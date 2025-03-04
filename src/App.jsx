import { useState, useEffect, useRef } from "react";
import { Trash2, ArrowLeft, ArrowRight } from "lucide-react";
import { Search } from "lucide-react";
import { Trophy, XCircle, AlertCircle } from 'lucide-react';


const fetchHeroCards = async (hero, size) => {
  try {
    const response = await fetch(`/data/${hero.toLowerCase()}_${size}.json`);
    if (!response.ok) throw new Error("Failed to fetch");
    const data = await response.json();
    return data.Items.map(item => ({
      name: item.Name,
      image: item.ImageUrl,
      size
    }));
  } catch (error) {
    console.error(`Error loading ${size} cards for ${hero}:`, error);
    return [];
  }
}



export default function App() {
  // Ensure missing states are included
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const [skills, setSkills] = useState([]);
  const [skillSearchTerm, setSkillSearchTerm] = useState("");
  const [ourSkills, setOurSkills] = useState([]);
  const [enemySkills, setEnemySkills] = useState([]);
  const [selectedDeckForSkills, setSelectedDeckForSkills] = useState(null);

  const [enemyDeck, setEnemyDeck] = useState(Array(10).fill(null));
  const [ourDeck, setOurDeck] = useState(Array(10).fill(null));
  const [ourHero, setOurHero] = useState("Vanessa");
  const [enemyHero, setEnemyHero] = useState("Pygmalien");
  const [selectingFor, setSelectingFor] = useState(null);
  const [availableCards, setAvailableCards] = useState([]);
  const [selectingSize, setSelectingSize] = useState(null);
  const [cardDetails, setCardDetails] = useState({ myDeck: [], enemyDeck: [] });
  const [fightResult, setFightResult] = useState(null);

  useEffect(() => {
    if (selectingSize && selectingFor) {
      loadHeroCards(selectingFor.deckType, selectingSize);
    }
  }, [selectingSize]);

  useEffect(() => {
    setOurDeck(Array(10).fill(null));
  }, [ourHero]);

  useEffect(() => {
    setEnemyDeck(Array(10).fill(null));
  }, [enemyHero]);

// Add this after the initial state declarations
useEffect(() => {
  const loadSkills = async () => {
    try {
      const response = await fetch('data/skills.json'); // Adjust path as needed
      const data = await response.json();
      setSkills(data);
    } catch (error) {
      console.error('Error loading skills:', error);
      setSkills([]);
    }
  };

  loadSkills();
}, []);

  const loadHeroCards = async (deckType, size) => {
    const hero = deckType === "enemy" ? enemyHero : ourHero;
    const cards = await fetchHeroCards(hero, size);
    setAvailableCards(cards);
  };

  const handleCardSelect = (index, deckType, card) => {
    let deck = deckType === "enemy" ? enemyDeck : ourDeck;
    let setDeck = deckType === "enemy" ? setEnemyDeck : setOurDeck;
    let newDeck = [...deck];
  
    let cardSize = card.size === "medium" ? 2 : card.size === "large" ? 3 : 1;
  
    // Try placing normally first (right expansion)
    let canPlaceNormally = true;
    for (let i = 0; i < cardSize; i++) {
      if (index + i >= newDeck.length || newDeck[index + i] !== null) {
        canPlaceNormally = false;
        break;
      }
    }
  
    if (canPlaceNormally) {
      newDeck[index] = card;
      for (let i = 1; i < cardSize; i++) newDeck[index + i] = "merged";
      setDeck(newDeck);
      setSelectingFor(null);
      setSelectingSize(null);
      setAvailableCards([]);
      return;
    }
  
    // If can't place normally, check if we can place by expanding to the left
    let canPlaceLeft = true;
    
    // For medium cards (size 2), check if there's space for 1 slot to the left
    if (cardSize === 2) {
      if (index - 1 >= 0 && newDeck[index - 1] === null) {
        newDeck[index - 1] = card;
        newDeck[index] = "merged";
        setDeck(newDeck);
        setSelectingFor(null);
        setSelectingSize(null);
        setAvailableCards([]);
        return;
      }
    }
    
    // For large cards (size 3), check if there's space for 1 or 2 slots to the left
    else if (cardSize === 3) {
      // Check if we can place with 1 slot to the left and 1 to the right
      if (index - 1 >= 0 && index + 1 < newDeck.length && 
          newDeck[index - 1] === null && newDeck[index + 1] === null) {
        newDeck[index - 1] = card;
        newDeck[index] = "merged";
        newDeck[index + 1] = "merged";
        setDeck(newDeck);
        setSelectingFor(null);
        setSelectingSize(null);
        setAvailableCards([]);
        return;
      }
      
      // Check if we can place with 2 slots to the left
      if (index - 2 >= 0 && index - 1 >= 0 && 
          newDeck[index - 2] === null && newDeck[index - 1] === null) {
        newDeck[index - 2] = card;
        newDeck[index - 1] = "merged";
        newDeck[index] = "merged";
        setDeck(newDeck);
        setSelectingFor(null);
        setSelectingSize(null);
        setAvailableCards([]);
        return;
      }
    }
  
    // Try the existing adjusted placement logic as a fallback
    let adjustedIndex = null;
  
    if (cardSize === 2) { // Medium Card (2 Slots)
      if ((index + 1 < newDeck.length && newDeck[index + 1] !== null) &&
        index - 1 >= 0 && newDeck[index - 1] === null) {
        adjustedIndex = index - 1; // Move left
      } else if ((index - 1 >= 0 && newDeck[index - 1] !== null) &&
        index + 1 < newDeck.length && newDeck[index + 1] === null) {
        adjustedIndex = index; // Stay in place
      }
    } else if (cardSize === 3) { // Large Card (3 Slots)
      if ((index + 1 < newDeck.length && newDeck[index + 1] !== null) &&
        index - 2 >= 0 &&
        newDeck[index - 1] === null &&
        newDeck[index - 2] === null) {
        adjustedIndex = index - 2; // Shift left
      } else if ((index - 1 >= 0 && newDeck[index - 1] !== null) &&
        index + 2 < newDeck.length &&
        newDeck[index + 1] === null &&
        newDeck[index + 2] === null) {
        adjustedIndex = index; // Stay in place
      }
    }
  
    // If we found a valid adjusted position, place the card
    if (adjustedIndex !== null) {
      newDeck[adjustedIndex] = card;
      for (let i = 1; i < cardSize; i++) newDeck[adjustedIndex + i] = "merged";
      setDeck(newDeck);
    }
  
    // Reset selection
    setSelectingFor(null);
    setSelectingSize(null);
    setAvailableCards([]);
  };

  const deleteCard = (deckType, index) => {
    let deck = deckType === "enemy" ? enemyDeck : ourDeck;
    let setDeck = deckType === "enemy" ? setEnemyDeck : setOurDeck;
    let newDeck = [...deck];

    if (newDeck[index] && newDeck[index] !== "merged") {
      let cardSize = newDeck[index].size === "medium" ? 2 : newDeck[index].size === "large" ? 3 : 1;

      // Remove the card and its merged slots
      for (let i = 0; i < cardSize; i++) {
        if (index + i < newDeck.length) {
          newDeck[index + i] = null;
        }
      }

      setDeck(newDeck);
    }
  };

  // Find the actual index of the card (not a merged slot)
  const findCardParentIndex = (deck, index) => {
    let i = index;
    while (i >= 0 && deck[i] === "merged") {
      i--;
    }
    return i;
  };

  // Find the size of the card at the given index
  const getCardSize = (card) => {
    if (!card || card === "merged") return 0;
    return card.size === "medium" ? 2 : card.size === "large" ? 3 : 1;
  };

  // Move card left
  const moveCardLeft = (deckType, index) => {
    const deck = deckType === "enemy" ? enemyDeck : ourDeck;
    const setDeck = deckType === "enemy" ? setEnemyDeck : setOurDeck;
    let newDeck = [...deck];
    
    // Find the actual card index if this is a merged slot
    const actualIndex = deck[index] === "merged" ? 
      findCardParentIndex(deck, index) : index;
    
    if (actualIndex <= 0 || !deck[actualIndex] || deck[actualIndex] === "merged") {
      return; // Already at leftmost position or not a valid card
    }
    
    const card = deck[actualIndex];
    const cardSize = getCardSize(card);
    
    // Check if there's room to move left
    if (actualIndex - 1 >= 0 && deck[actualIndex - 1] === null) {
      // Clear current position
      for (let i = 0; i < cardSize; i++) {
        if (actualIndex + i < newDeck.length) {
          newDeck[actualIndex + i] = null;
        }
      }
      
      // Place at new position
      newDeck[actualIndex - 1] = card;
      for (let i = 1; i < cardSize; i++) {
        if (actualIndex - 1 + i < newDeck.length) {
          newDeck[actualIndex - 1 + i] = "merged";
        }
      }
      
      setDeck(newDeck);
    }
  };
  
  // Move card right
  const moveCardRight = (deckType, index) => {
    const deck = deckType === "enemy" ? enemyDeck : ourDeck;
    const setDeck = deckType === "enemy" ? setEnemyDeck : setOurDeck;
    let newDeck = [...deck];
    
    // Find the actual card index if this is a merged slot
    const actualIndex = deck[index] === "merged" ? 
      findCardParentIndex(deck, index) : index;
    
    if (actualIndex < 0 || !deck[actualIndex] || deck[actualIndex] === "merged") {
      return; // Not a valid card
    }
    
    const card = deck[actualIndex];
    const cardSize = getCardSize(card);
    
    // Check if there's room to move right
    const lastMergedIndex = actualIndex + cardSize - 1;
    if (lastMergedIndex + 1 < deck.length && deck[lastMergedIndex + 1] === null) {
      // Clear current position
      for (let i = 0; i < cardSize; i++) {
        if (actualIndex + i < newDeck.length) {
          newDeck[actualIndex + i] = null;
        }
      }
      
      // Place at new position
      newDeck[actualIndex + 1] = card;
      for (let i = 1; i < cardSize; i++) {
        if (actualIndex + 1 + i < newDeck.length) {
          newDeck[actualIndex + 1 + i] = "merged";
        }
      }
      
      setDeck(newDeck);
    }
  };

  const handleAddSkill = (deckType) => {
    setSelectedDeckForSkills(deckType);
    setIsSkillsModalOpen(true);
  };

  const handleSelectSkill = (skill) => {
    if (selectedDeckForSkills === "our") {
      setOurSkills([...ourSkills, skill]);
    } else if (selectedDeckForSkills === "enemy") {
      setEnemySkills([...enemySkills, skill]);
    }
    setIsSkillsModalOpen(false);
  };

  const handleRemoveSkill = (deckType, index) => {
    if (deckType === "our") {
      setOurSkills(ourSkills.filter((_, i) => i !== index));
    } else if (deckType === "enemy") {
      setEnemySkills(enemySkills.filter((_, i) => i !== index));
    }
  };

  const filteredSkills = skills.filter((skill) =>
    skill.name.toLowerCase().includes(skillSearchTerm.toLowerCase())
  );

  const fetchCardDetails = async () => {
    // Extract non-null cards from both decks
    const ourFilteredDeck = ourDeck.filter(card => card && card !== "merged");
    const enemyFilteredDeck = enemyDeck.filter(card => card && card !== "merged");

    const fetchCards = async (deck) => {
      if (!deck || deck.length === 0) return [];
      
      const uniqueCardNames = [...new Set(deck.map((card) => card.name))];
      const requests = uniqueCardNames.map((cardName) =>
        fetch(`https://bazaar-broker-api.azurewebsites.net/${encodeURIComponent(cardName)}`)
          .then((res) => res.json())
          .catch(() => null)
      );

      return (await Promise.all(requests)).filter((res) => res !== null);
    };

    const myDeckDetails = await fetchCards(ourFilteredDeck);
    const enemyDeckDetails = await fetchCards(enemyFilteredDeck);

    setCardDetails({ myDeck: myDeckDetails, enemyDeck: enemyDeckDetails });
  };

  const handleFight = async () => {
    // Extract non-null cards and skills from both decks
    const ourFilteredDeck = ourDeck.filter(card => card && card !== "merged").map(card => card.name);
    const enemyFilteredDeck = enemyDeck.filter(card => card && card !== "merged").map(card => card.name);
  
    const battleData = {
      ourDeck: {
        hero: ourHero,
        cards: ourFilteredDeck,
        skills: ourSkills.map(skill => skill.name)
      },
      enemyDeck: {
        hero: enemyHero,
        cards: enemyFilteredDeck,
        skills: enemySkills.map(skill => skill.name)
      }
    };
  
    // Simulated API call (replace with actual API endpoint when ready)
    try {
      // Simulated API response
      const result = "Victory"; // Hardcoded for now
      setFightResult(result);
    } catch (error) {
      console.error("Error during battle:", error);
      setFightResult("Error");
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-5xl font-extrabold mb-8 text-yellow-400">Bazaar Broker</h1>
      <div className="flex gap-8 mb-6">
        <div>
          <label className="text-lg font-bold">Our Hero:</label>
          <select
            className="ml-2 p-2 rounded bg-gray-700 text-white"
            value={ourHero}
            onChange={(e) => setOurHero(e.target.value)}
          >
            <option value="Vanessa">Vanessa</option>
            <option value="Pygmalien">Pygmalien</option>
            <option value="Dooley">Dooley</option>
          </select>
        </div>

        <div>
          <label className="text-lg font-bold">Enemy Hero:</label>
          <select
            className="ml-2 p-2 rounded bg-gray-700 text-white"
            value={enemyHero}
            onChange={(e) => setEnemyHero(e.target.value)}
          >
            <option value="Vanessa">Vanessa</option>
            <option value="Pygmalien">Pygmalien</option>
            <option value="Dooley">Dooley</option>
          </select>
        </div>
      </div>

      {/* Deck Containers */}
      <div className="w-full max-w-6xl p-6 bg-gray-800 rounded-lg shadow-2xl border border-gray-700">
        {["our", "enemy"].map((deckType) => (
          <div key={deckType} className="mb-8 p-4 bg-gray-700 rounded-lg shadow-md w-full">
            <h3 className={`text-2xl font-semibold mb-3 ${deckType === "enemy" ? "text-red-400" : "text-blue-400"}`}>
              {deckType === "enemy" ? "Enemy Deck" : "Our Deck"}
            </h3>
            <div className="flex justify-center gap-2 mb-2">
              {(deckType === "enemy" ? enemySkills : ourSkills).map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center p-1 bg-gray-700 rounded-full cursor-pointer hover:bg-gray-600 group relative"
                >
                  <img
                    src={skill.image}
                    alt={skill.name}
                    className="w-16 h-16 rounded-full" // Increased size to w-16 h-16
                  />
                  <button
                    onClick={() => handleRemoveSkill(deckType, index)}
                    className="absolute -top-1 -right-1 bg-red-500 p-0.5 rounded-full text-white text-[10px]" // Made text even smaller
                  >
                    ✖
                  </button>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {skill.name}
                    {skill.description && (
                      <div className="text-xs text-gray-300">{skill.description}</div>
                    )}
                  </div>
                </div>
              ))}
              <button
                onClick={() => handleAddSkill(deckType)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors ${
                  deckType === "enemy" ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                <span>+ Skills</span>
              </button>
            </div>
            {/* Center-aligned Slots */}
            <div className="flex justify-center gap-2">
              {(deckType === "enemy" ? enemyDeck : ourDeck).map((card, index) => (
                <div
                  key={index}
                  className={`relative flex items-center justify-center border-2 rounded-md transition-all duration-200
                    ${card === "merged" ? "hidden" : ""}
                    ${selectingFor && selectingFor.index === index ? "border-yellow-400 bg-gray-600" : ""} 
                    ${card ? "hover:border-yellow-300 cursor-pointer group" : "hover:border-yellow-300 cursor-pointer"}`}
                  style={{
                    width: card && card !== "merged" ? `${(card.size === "medium" ? 2 : card.size === "large" ? 3 : 1) * 80}px` : "80px",
                    height: "120px",
                    backgroundColor: card ? "transparent" : "gray"
                  }}
                  onClick={() => {
                    if (!card) {
                      setSelectingFor({ deckType, index });
                      setSelectingSize(null);
                    }
                  }}
                >              
                  {card && card !== "merged" ? (
                    <>
                      <img src={card.image} alt={card.name} className="w-full h-full object-cover rounded-md" />
                      
                      {/* Card Control Buttons */}
                      <div className="absolute top-0 left-0 right-0 flex justify-between px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Left Movement Button */}
                        <button 
                          className="bg-blue-500 p-1 rounded-full text-white flex items-center justify-center mt-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveCardLeft(deckType, index);
                          }}
                        >
                          <ArrowLeft size={16} />
                        </button>
                        
                        {/* Right Movement Button */}
                        <button 
                          className="bg-blue-500 p-1 rounded-full text-white flex items-center justify-center mt-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveCardRight(deckType, index);
                          }}
                        >
                          <ArrowRight size={16} />
                        </button>
                      </div>
                      
                      {/* Delete Button */}
                      <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          className="bg-red-500 p-1 rounded-full text-white flex items-center justify-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCard(deckType, index);
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </>
                  ) : (
                    <span className="text-gray-300 text-2xl">+</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Card Selection Popup */}
      {selectingFor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-96 max-h-[80vh] overflow-y-auto relative">
            <button className="absolute top-3 right-3 bg-red-600 text-white p-2 rounded" onClick={() => setSelectingFor(null)}>✖</button>

            {!selectingSize ? (
              <>
                <h3 className="text-xl font-semibold text-gray-300 mb-4">Select Card Size</h3>
                <div className="flex gap-4 mb-4">
                  {["small", "medium", "large"].map(size => (
                    <button key={size} className="bg-gray-600 p-3 rounded-lg text-white" onClick={() => {
                      setSelectingSize(size);
                    }}>{size}</button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-gray-300 mb-4">Select a Card</h3>
                <div className="grid grid-cols-2 gap-4">
                  {availableCards.map((card, i) => (
                    <div key={i} className="flex items-center p-2 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600"
                      onClick={() => handleCardSelect(selectingFor.index, selectingFor.deckType, card)}>
                      <img src={card.image} alt={card.name} className="w-12 h-12 rounded-md mr-2" />
                      <span className="text-white">{card.name}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

{isSkillsModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-[600px] max-h-[80vh] overflow-y-auto relative">
      <button
        className="absolute top-3 right-3 bg-red-600 text-white p-2 rounded"
        onClick={() => setIsSkillsModalOpen(false)}
      >
        ✖
      </button>
      <h3 className="text-xl font-semibold text-gray-300 mb-4">
        Select a Skill
      </h3>
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search skills..."
            value={skillSearchTerm}
            onChange={(e) => setSkillSearchTerm(e.target.value)}
            className="w-full p-2 pl-8 rounded bg-gray-700 text-white"
          />
          <Search className="absolute top-2.5 left-2 text-gray-400 h-5 w-5" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {filteredSkills.map((skill, i) => (
          <div
            key={i}
            className="flex flex-col p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
            onClick={() => handleSelectSkill(skill)}
          >
            <div className="flex items-center gap-3">
              <img
                src={skill.image}
                alt={skill.name}
                className="w-12 h-12 rounded-md object-cover"
              />
              <span className="text-white font-medium">{skill.name}</span>
            </div>
            {skill.description && (
              <p className="text-gray-300 text-sm mt-2">{skill.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
)}

      <div className="p-4">
                <button 
              onClick={fetchCardDetails} 
              className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Get Info
            </button>
            <button 
              onClick={handleFight} 
              className="mt-4 p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
            >
              Fight
            </button>
            {fightResult && (
              <div className={`mt-4 p-2 rounded font-bold text-xl ${
                fightResult === "Victory" ? "text-green-400" : "text-red-400"
              }`}>
                {fightResult}!
              </div>
            )}

      {/* Table for Card Details */}
      {cardDetails.myDeck.length > 0 || cardDetails.enemyDeck.length > 0 ? (
        <div className="mt-6 p-4 bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-center text-white">Card Details</h2>

          <div className="grid grid-cols-2 gap-4">
            {/* My Deck Table */}
            <div className="bg-gray-700 p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-2 text-center text-blue-400">My Deck</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-600 rounded-lg">
                  <thead>
                    <tr className="bg-gray-800">
                      <th className="border border-gray-600 p-2 text-blue-300">Name</th>
                      <th className="border border-gray-600 p-2 text-blue-300">Size</th>
                      <th className="border border-gray-600 p-2 text-blue-300">Collection</th>
                      <th className="border border-gray-600 p-2 text-blue-300">Types</th>
                      <th className="border border-gray-600 p-2 text-blue-300">Cooldown (ms)</th>
                      <th className="border border-gray-600 p-2 text-blue-300">Stats</th>
                      <th className="border border-gray-600 p-2 text-blue-300">Effects</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cardDetails.myDeck.map((card, index) => (
                      <tr key={index} className="hover:bg-gray-600">
                        <td className="border border-gray-600 p-2 text-white">{card.name}</td>
                        <td className="border border-gray-600 p-2 text-white">{card.size}</td>
                        <td className="border border-gray-600 p-2 text-white">{card.collection}</td>
                        <td className="border border-gray-600 p-2 text-white">{card.types.join(", ")}</td>
                        <td className="border border-gray-600 p-2 text-white">{card.baseCooldownsMS.join(", ")}</td>
                        <td className="border border-gray-600 p-2 text-white">
                          {card.stats && Object.entries(card.stats)
                            .map(([key, value]) => `${key}: ${value.join(", ")}`)
                            .join(" | ")}
                        </td>
                        <td className="border border-gray-600 p-2 text-white">
                          {card.effects && card.effects
                            .map((effect) => `${effect.description} (Triggers: ${effect.triggers.join(", ")})`)
                            .join(" | ")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Enemy Deck Table */}
            <div className="bg-gray-700 p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-2 text-center text-red-400">Enemy Deck</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-600 rounded-lg">
                  <thead>
                    <tr className="bg-gray-800">
                      <th className="border border-gray-600 p-2 text-red-300">Name</th>
                      <th className="border border-gray-600 p-2 text-red-300">Size</th>
                      <th className="border border-gray-600 p-2 text-red-300">Collection</th>
                      <th className="border border-gray-600 p-2 text-red-300">Types</th>
                      <th className="border border-gray-600 p-2 text-red-300">Cooldown (ms)</th>
                      <th className="border border-gray-600 p-2 text-red-300">Stats</th>
                      <th className="border border-gray-600 p-2 text-red-300">Effects</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cardDetails.enemyDeck.map((card, index) => (
                      <tr key={index} className="hover:bg-gray-600">
                        <td className="border border-gray-600 p-2 text-white">{card.name}</td>
                        <td className="border border-gray-600 p-2 text-white">{card.size}</td>
                        <td className="border border-gray-600 p-2 text-white">{card.collection}</td>
                        <td className="border border-gray-600 p-2 text-white">{card.types.join(", ")}</td>
                        <td className="border border-gray-600 p-2 text-white">{card.baseCooldownsMS.join(", ")}</td>
                        <td className="border border-gray-600 p-2 text-white">
                          {card.stats && Object.entries(card.stats)
                            .map(([key, value]) => `${key}: ${value.join(", ")}`)
                            .join(" | ")}
                        </td>
                        <td className="border border-gray-600 p-2 text-white">
                        {card.effects && card.effects
                          .map((effect) => `${effect.description} (Triggers: ${effect.triggers.join(", ")})`)
                          .join(" | ")}
                      </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
    </div>
  );
}