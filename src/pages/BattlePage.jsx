import { useState, useEffect } from "react";
import {
  Trash2,
  ArrowLeft,
  ArrowRight,
  Plus,
  Trophy,
  XCircle,
  AlertCircle,
  Search,
  Info,
  Swords,
} from "lucide-react";

// Import your images
import DBG from "../assets/Images/DeckBG.png";
import NCB from "../assets/Images/NCardBack.png";
import Cross from "../assets/Images/Close.png";
import SBG from "../assets/Images/SkillBG.png";
import SF from "../assets/Images/SFrame.png";
import MF from "../assets/Images/MFrame.png";
import LF from "../assets/Images/LFrame.png";
import SkillF from "../assets/Images/SkillFrame.png";
import NImg from "../assets/Images/NoImg.png";
import Left from "../assets/Images/Left_Gem.png";
import Right from "../assets/Images/Right_Gem.png";
import Del from "../assets/Images/Delete_Gem.png";

export default function BattlePage() {
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const [skills, setSkills] = useState([]);
  const [skillSearchTerm, setSkillSearchTerm] = useState("");
  const [ourSkills, setOurSkills] = useState([]);
  const [enemySkills, setEnemySkills] = useState([]);
  const [selectedDeckForSkills, setSelectedDeckForSkills] = useState(null);

  const [enemyDeck, setEnemyDeck] = useState(Array(10).fill(null));
  const [ourDeck, setOurDeck] = useState(Array(10).fill(null));
  const [ourHero, setOurHero] = useState("Vanessa");
  const [enemyHero, setEnemyHero] = useState("Monster");
  const [selectingFor, setSelectingFor] = useState(null);
  const [availableCards, setAvailableCards] = useState([]);
  const [selectingSize, setSelectingSize] = useState(null);
  const [cardDetails, setCardDetails] = useState({ myDeck: [], enemyDeck: [] });
  const [fightResult, setFightResult] = useState(null);
  const [selectedDay, setSelectedDay] = useState(1);
  const [monsters, setMonsters] = useState([]);
  const [selectedMonster, setSelectedMonster] = useState(null);
  const [ourSelectedDay, setOurSelectedDay] = useState(1);
  const [ourMonsters, setOurMonsters] = useState([]);
  const [ourSelectedMonster, setOurSelectedMonster] = useState(null);
  const [cardUsage, setCardUsage] = useState({ enemy: {}, our: {} });
  const [cardDamage, setCardDamage] = useState({ enemy: {}, our: {} });

  const fetchHeroCards = async (hero, size) => {
    try {
      const response = await fetch(`/data/${hero.toLowerCase()}_${size}.json`);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      return data.Items.map((item) => ({
        name: item.Name,
        image: item.ImageUrl,
        size,
      }));
    } catch (error) {
      console.error(`Error loading ${size} cards for ${hero}:`, error);
      return [];
    }
  };
  useEffect(() => {
    if (selectingSize && selectingFor) {
      loadHeroCards(selectingFor.deckType, selectingSize);
    }
  }, [selectingSize]);

  useEffect(() => {
    setEnemyDeck(Array(10).fill(null));
    setEnemySkills([]); // Clear enemy skills when hero changes
  }, [enemyHero]);

  useEffect(() => {
    setOurDeck(Array(10).fill(null));
    setOurSkills([]); // Clear our skills when hero changes
  }, [ourHero]);

  useEffect(() => {
    const fetchMonsters = async () => {
      try {
        const response = await fetch(
          `https://bazaarbrokerapi20250308232423-bjd2g3dbebcagpey.canadacentral-01.azurewebsites.net/monster-by-day/${ourSelectedDay}`
        );
        const data = await response.json();

        // Add data validation
        if (!Array.isArray(data)) {
          console.error("Invalid data format received:", data);
          setOurMonsters([]);
          return;
        }

        // Transform the monsters data with null checks
        const processedMonsters = data.map((monster) => ({
          name: monster?.Name || "Unknown",
          maxHealth: monster?.Stats?.CurrentStats?.MaxHealth || 0,
          items:
            monster?.Playmat?.Slots?.filter(
              (slot) =>
                slot?.IsOccupied &&
                slot?.Item !== "(Empty)" &&
                typeof slot?.Item !== "string" // Skip "Occupied:" entries
            )?.map((slot) => ({
              name: slot?.Item?.Name || "Unknown Item",
              size: (slot?.Item?.Size || "small").toLowerCase(),
            })) || [],
          skills: monster?.SkillDeck?.Skills?.map((skill) => skill?.Name) || [],
        }));

        setOurMonsters(processedMonsters);
      } catch (error) {
        console.error("Error fetching monsters:", error);
        setOurMonsters([]);
      }
    };

    if (ourHero === "Monster") {
      fetchMonsters();
    }
  }, [ourSelectedDay, ourHero]);
  // Update the fetchMonsters function in the useEffect
  useEffect(() => {
    const fetchMonsters = async () => {
      try {
        const response = await fetch(
          `https://bazaarbrokerapi20250308232423-bjd2g3dbebcagpey.canadacentral-01.azurewebsites.net/monster-by-day/${selectedDay}`
        );
        const data = await response.json();

        // Add data validation
        if (!Array.isArray(data)) {
          console.error("Invalid data format received:", data);
          setMonsters([]);
          return;
        }

        // Transform the monsters data with null checks
        const processedMonsters = data.map((monster) => ({
          name: monster?.Name || "Unknown",
          maxHealth: monster?.Stats?.CurrentStats?.MaxHealth || 0,
          items:
            monster?.Playmat?.Slots?.filter(
              (slot) =>
                slot?.IsOccupied &&
                slot?.Item !== "(Empty)" &&
                typeof slot?.Item !== "string" // Skip "Occupied:" entries
            )?.map((slot) => ({
              name: slot?.Item?.Name || "Unknown Item",
              size: (slot?.Item?.Size || "small").toLowerCase(),
            })) || [],
          skills: monster?.SkillDeck?.Skills?.map((skill) => skill?.Name) || [],
        }));

        setMonsters(processedMonsters);
      } catch (error) {
        console.error("Error fetching monsters:", error);
        setMonsters([]);
      }
    };

    if (enemyHero === "Monster") {
      fetchMonsters();
    }
  }, [selectedDay, enemyHero]);

  // Add this after the initial state declarations
  useEffect(() => {
    const loadSkills = async () => {
      try {
        const response = await fetch("data/skills.json"); // Adjust path as needed
        const data = await response.json();
        setSkills(data);
      } catch (error) {
        console.error("Error loading skills:", error);
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
      if (
        index - 1 >= 0 &&
        index + 1 < newDeck.length &&
        newDeck[index - 1] === null &&
        newDeck[index + 1] === null
      ) {
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
      if (
        index - 2 >= 0 &&
        index - 1 >= 0 &&
        newDeck[index - 2] === null &&
        newDeck[index - 1] === null
      ) {
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

    if (cardSize === 2) {
      // Medium Card (2 Slots)
      if (
        index + 1 < newDeck.length &&
        newDeck[index + 1] !== null &&
        index - 1 >= 0 &&
        newDeck[index - 1] === null
      ) {
        adjustedIndex = index - 1; // Move left
      } else if (
        index - 1 >= 0 &&
        newDeck[index - 1] !== null &&
        index + 1 < newDeck.length &&
        newDeck[index + 1] === null
      ) {
        adjustedIndex = index; // Stay in place
      }
    } else if (cardSize === 3) {
      // Large Card (3 Slots)
      if (
        index + 1 < newDeck.length &&
        newDeck[index + 1] !== null &&
        index - 2 >= 0 &&
        newDeck[index - 1] === null &&
        newDeck[index - 2] === null
      ) {
        adjustedIndex = index - 2; // Shift left
      } else if (
        index - 1 >= 0 &&
        newDeck[index - 1] !== null &&
        index + 2 < newDeck.length &&
        newDeck[index + 1] === null &&
        newDeck[index + 2] === null
      ) {
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
      let cardSize =
        newDeck[index].size === "medium"
          ? 2
          : newDeck[index].size === "large"
          ? 3
          : 1;

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
    const actualIndex =
      deck[index] === "merged" ? findCardParentIndex(deck, index) : index;

    if (
      actualIndex <= 0 ||
      !deck[actualIndex] ||
      deck[actualIndex] === "merged"
    ) {
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
    const actualIndex =
      deck[index] === "merged" ? findCardParentIndex(deck, index) : index;

    if (
      actualIndex < 0 ||
      !deck[actualIndex] ||
      deck[actualIndex] === "merged"
    ) {
      return; // Not a valid card
    }

    const card = deck[actualIndex];
    const cardSize = getCardSize(card);

    // Check if there's room to move right
    const lastMergedIndex = actualIndex + cardSize - 1;
    if (
      lastMergedIndex + 1 < deck.length &&
      deck[lastMergedIndex + 1] === null
    ) {
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

  const handleFight = async () => {
    const ourFilteredDeck = ourDeck
      .filter((card) => card && card !== "merged")
      .map((card) => card.name);
    const enemyFilteredDeck = enemyDeck
      .filter((card) => card && card !== "merged")
      .map((card) => card.name);

    const battleData = {
      ourDeck: {
        hero: ourHero,
        cards: ourFilteredDeck,
        skills: ourSkills.map((skill) => skill.name),
      },
      enemyDeck: {
        hero: enemyHero,
        cards: enemyFilteredDeck,
        skills: enemySkills.map((skill) => skill.name),
      },
    };

    try {
      const result = "Defeat";

      const mockUsage = {
        enemy: {},
        our: {},
      };

      const mockDamage = {
        enemy: {},
        our: {},
      };

      enemyDeck.forEach((card, index) => {
        if (card && card !== "merged") {
          mockUsage.enemy[index] = Math.floor(Math.random() * 50);
          mockDamage.enemy[index] = Math.floor(Math.random() * 1000);
        }
      });

      ourDeck.forEach((card, index) => {
        if (card && card !== "merged") {
          mockUsage.our[index] = Math.floor(Math.random() * 50);
          mockDamage.our[index] = Math.floor(Math.random() * 1000);
        }
      });

      setCardUsage(mockUsage);
      setCardDamage(mockDamage);
      setFightResult(result);
    } catch (error) {
      console.error("Error during battle:", error);
      setFightResult("Error");
    }
  };
  const handleMonsterSelect = (monsterName, type = "enemy") => {
    const monstersList = type === "enemy" ? monsters : ourMonsters;
    const monster = monstersList.find((m) => m.name === monsterName);

    if (!monster) return;

    if (type === "enemy") {
      setSelectedMonster(monster);
      const skillsToAdd = monster.skills
        .map((skillName) =>
          skills.find((s) => s.name.toLowerCase() === skillName.toLowerCase())
        )
        .filter((skill) => skill !== undefined);
      setEnemySkills(skillsToAdd);
    } else {
      setOurSelectedMonster(monster);
      const skillsToAdd = monster.skills
        .map((skillName) =>
          skills.find((s) => s.name.toLowerCase() === skillName.toLowerCase())
        )
        .filter((skill) => skill !== undefined);
      setOurSkills(skillsToAdd);
    }

    // Rest of the deck building code with modified image path handling
    let newDeck = Array(10).fill(null);
    let currentIndex = 0;

    monster.items.forEach((item) => {
      if (currentIndex >= newDeck.length) return;

      const cardSize =
        item.size === "medium" ? 2 : item.size === "large" ? 3 : 1;

      if (currentIndex + cardSize <= newDeck.length) {
        // Remove spaces and apostrophes from item name for image path
        const sanitizedName = item.name
          .replace(/\s+/g, "") // Remove spaces
          .replace(/'/g, ""); // Remove apostrophes

        newDeck[currentIndex] = {
          name: item.name,
          size: item.size,
          image: `/items/${sanitizedName}.avif`,
        };

        for (let i = 1; i < cardSize; i++) {
          newDeck[currentIndex + i] = "merged";
        }

        currentIndex += cardSize;
      }
    });

    if (type === "enemy") {
      setEnemyDeck(newDeck);
    } else {
      setOurDeck(newDeck);
    }
  };

  return (
    <>
      {/* Move your existing JSX here (everything except the background div and navigation) */}
      <div className="flex gap-8 mb-6">
        <div>
          <label className="text-lg font-bold">Enemy Deck:</label>
          <select
            className="ml-2 p-2 rounded text-white border border-black
            shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),inset_0_-1px_2px_rgba(0,0,0,0.3),0_2px_4px_rgba(0,0,0,0.3)]
            transition-all duration-300 bg-black/20 backdrop-blur-md hover:opacity-70
            active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3),inset_0_-1px_2px_rgba(255,255,255,0.3)]"
            value={enemyHero}
            onChange={(e) => setEnemyHero(e.target.value)}
          >
            <option value="Monster">Monster</option>
            <option value="Vanessa">Vanessa</option>
            <option value="Pygmalien">Pygmalien</option>
            <option value="Dooley">Dooley</option>
          </select>
        </div>
        <div>
          <label className="text-lg font-bold">Player Deck:</label>
          <select
            className="ml-2 p-2 rounded text-white border border-black
            shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),inset_0_-1px_2px_rgba(0,0,0,0.3),0_2px_4px_rgba(0,0,0,0.3)]
            transition-all duration-300 bg-black/20 backdrop-blur-md hover:opacity-70
            active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3),inset_0_-1px_2px_rgba(255,255,255,0.3)]"
            value={ourHero}
            onChange={(e) => setOurHero(e.target.value)}
          >
            <option value="Monster">Monster</option>
            <option value="Vanessa">Vanessa</option>
            <option value="Pygmalien">Pygmalien</option>
            <option value="Dooley">Dooley</option>
          </select>
        </div>
      </div>
      {/* Update monster selection dropdowns */}
      <div className="w-full max-w-6xl flex justify-between mb-4 px-6">
        {/* Left side - Enemy Monster Controls */}
        <div className="flex gap-4">
          <div
            className={`${
              enemyHero === "Monster"
                ? "opacity-100"
                : "opacity-30 pointer-events-none"
            }`}
          >
            <select
              className="ml-2 p-2 rounded text-white border border-black
              shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),inset_0_-1px_2px_rgba(0,0,0,0.3),0_2px_4px_rgba(0,0,0,0.3)]
              transition-all duration-300 bg-black/20 backdrop-blur-md hover:opacity-70
              active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3),inset_0_-1px_2px_rgba(255,255,255,0.3)]"
              value={selectedDay}
              onChange={(e) => setSelectedDay(parseInt(e.target.value))}
              disabled={enemyHero !== "Monster"}
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((day) => (
                <option key={day} value={day}>
                  Day {day}
                </option>
              ))}
            </select>
          </div>
          <div
            className={`${
              enemyHero === "Monster"
                ? "opacity-100"
                : "opacity-30 pointer-events-none"
            }`}
          >
            <select
              className="ml-2 p-2 rounded text-white border border-black
              shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),inset_0_-1px_2px_rgba(0,0,0,0.3),0_2px_4px_rgba(0,0,0,0.3)]
              transition-all duration-300 bg-black/20 backdrop-blur-md hover:opacity-70
              active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3),inset_0_-1px_2px_rgba(255,255,255,0.3)]"
              value={selectedMonster?.name || ""}
              onChange={(e) => handleMonsterSelect(e.target.value)}
              disabled={enemyHero !== "Monster"}
            >
              <option value="">Select Enemy Monster</option>
              {monsters.map((monster) => (
                <option key={monster.name} value={monster.name}>
                  {monster.name} (HP: {monster.maxHealth})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right side - Our Monster Controls */}
        <div className="flex gap-4">
          <div
            className={`${
              ourHero === "Monster"
                ? "opacity-100"
                : "opacity-30 pointer-events-none"
            }`}
          >
            <select
              className="ml-2 p-2 rounded text-white border border-black
              shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),inset_0_-1px_2px_rgba(0,0,0,0.3),0_2px_4px_rgba(0,0,0,0.3)]
              transition-all duration-300 bg-black/20 backdrop-blur-md hover:opacity-70
              active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3),inset_0_-1px_2px_rgba(255,255,255,0.3)]"
              value={ourSelectedDay}
              onChange={(e) => setOurSelectedDay(parseInt(e.target.value))}
              disabled={ourHero !== "Monster"}
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((day) => (
                <option key={day} value={day}>
                  Day {day}
                </option>
              ))}
            </select>
          </div>
          <div
            className={`${
              ourHero === "Monster"
                ? "opacity-100"
                : "opacity-30 pointer-events-none"
            }`}
          >
            <select
              className="ml-2 p-2 rounded text-white border border-black
              shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),inset_0_-1px_2px_rgba(0,0,0,0.3),0_2px_4px_rgba(0,0,0,0.3)]
              transition-all duration-300 bg-black/20 backdrop-blur-md hover:opacity-70
              active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3),inset_0_-1px_2px_rgba(255,255,255,0.3)]"
              value={ourSelectedMonster?.name || ""}
              onChange={(e) => handleMonsterSelect(e.target.value, "our")}
              disabled={ourHero !== "Monster"}
            >
              <option value="">Select Our Monster</option>
              {ourMonsters.map((monster) => (
                <option key={monster.name} value={monster.name}>
                  {monster.name} (HP: {monster.maxHealth})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {/* Deck Containers */}
      <div
        className="w-full max-w-6xl p-6 bg-gray-800 rounded-lg shadow-2xl border border-gray-700 bg-no-repeat bg-cover mt-4 ml-4"
        style={{ backgroundImage: `url(${DBG})` }}
      >
        {["enemy", "our"].map((deckType) => (
          <div
            key={deckType}
            className="mb-8 p-4 bg-gray-700 rounded-lg  w-full"
            style={{ backgroundColor: "transparent" }}
          >
            <div className="flex justify-center gap-2 mb-2 mt-10">
              {(deckType === "enemy" ? enemySkills : ourSkills).map(
                (skill, index) => (
                  <div key={index} className="relative w-16 h-16">
                    <div className="relative w-full h-full group">
                      <div className="w-full h-full rounded-full bg-gray-700 hover:bg-gray-600 overflow-hidden">
                        {/* Skill image */}
                        <img
                          src={skill.image}
                          alt={skill.name}
                          className="w-full h-full object-cover"
                        />
                        {/* Remove button - disabled for monster loadout */}
                        {!(
                          (deckType === "enemy" && enemyHero === "Monster") ||
                          (deckType === "our" && ourHero === "Monster")
                        ) && (
                          <button
                            onClick={() => handleRemoveSkill(deckType, index)}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-cover bg-center z-1"
                            style={{ backgroundImage: `url(${Cross})` }}
                          ></button>
                        )}
                      </div>

                      {/* Tooltip */}
                      <div
                        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10"
                        style={{
                          pointerEvents:
                            selectingFor || isSkillsModalOpen ? "none" : "auto",
                        }}
                      >
                        {skill.name}
                        {skill.description && (
                          <div className="text-xs text-gray-300">
                            {skill.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              )}

              {/* Add skill button */}
              <div className="relative w-16 h-16">
                <button
                  onClick={() => handleAddSkill(deckType)}
                  className={`w-full h-full rounded-full flex items-center justify-center transition-all hover:scale-105 cursor-pointer bg-cover bg-center ${
                    (deckType === "enemy" && enemyHero === "Monster") ||
                    (deckType === "our" && ourHero === "Monster")
                      ? "opacity-30 pointer-events-none"
                      : ""
                  } ${
                    deckType === "enemy"
                      ? "hover:border-red-300 bg-[#4A2D1B]"
                      : "hover:border-blue-300 bg-[#4A2D1B]"
                  }`}
                  style={{ backgroundImage: `url(${SkillF})` }}
                >
                  <Plus size={24} className="text-white" />
                </button>
              </div>
            </div>
            {/* Center-aligned Slots */}
            <div className="flex justify-center gap-2">
              {(deckType === "enemy" ? enemyDeck : ourDeck)
                .slice(0, 10)
                .map((card, index) => {
                  // Skip rendering merged slots that follow a card
                  if (card === "merged") {
                    const prevIndex = findCardParentIndex(
                      deckType === "enemy" ? enemyDeck : ourDeck,
                      index
                    );
                    if (prevIndex >= 0 && prevIndex < index) {
                      return null; // Don't render this merged slot separately
                    }
                  }

                  // Get usage count for this card
                  const usageCount = fightResult
                    ? (deckType === "enemy"
                        ? cardUsage.enemy[index]
                        : cardUsage.our[index]) || 0
                    : null;

                  return (
                    <div
                      key={index}
                      className={`relative flex items-center justify-center border-2 rounded-md transition-all duration-200 bg-center bg-cover group
        ${
          selectingFor && selectingFor.index === index
            ? "border-yellow-400 bg-gray-600"
            : ""
        } 
        ${
          card === "merged"
            ? "border-dashed border-gray-500"
            : card
            ? "hover:border-red-500 cursor-pointer"
            : "hover:border-red-500 cursor-pointer"
        }`}
                      style={{
                        width:
                          card && card.size === "medium"
                            ? "160px"
                            : card && card.size === "large"
                            ? "240px"
                            : "80px",
                        height: "120px",
                        backgroundImage: `url(${NCB})`,
                      }}
                      onClick={() => {
                        if (
                          !card &&
                          !(
                            (deckType === "enemy" && enemyHero === "Monster") ||
                            (deckType === "our" && ourHero === "Monster")
                          )
                        ) {
                          setSelectingFor({ deckType, index });
                          setSelectingSize(null);
                        }
                      }}
                    >
                      {card && card !== "merged" ? (
                        <>
                          <img
                            src={card.image}
                            alt={card.name}
                            className="w-full h-full object-cover"
                          />
                          <img
                            src={
                              card.size === "medium"
                                ? MF
                                : card.size === "large"
                                ? LF
                                : SF
                            }
                            alt="frame"
                            className="absolute inset-0 w-full h-full pointer-events-none"
                          />

                          {fightResult && (
                            <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-md z-10 flex flex-col items-end">
                              <div className="flex items-center gap-1">
                                <span className="text-gray-300">Uses:</span>
                                <span className="font-bold">
                                  ×{cardUsage[deckType][index] || 0}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-red-300">DMG:</span>
                                <span className="font-bold">
                                  {cardDamage[deckType][index] || 0}
                                </span>
                              </div>
                            </div>
                          )}

                          {!(
                            (deckType === "enemy" && enemyHero === "Monster") ||
                            (deckType === "our" && ourHero === "Monster")
                          ) && (
                            <>
                              <div className="absolute top-0 left-0 right-0 flex justify-between px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  className="h-6 w-6 bg-cover bg-center mt-2"
                                  style={{ backgroundImage: `url(${Left})` }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    moveCardLeft(deckType, index);
                                  }}
                                />
                                <button
                                  className="h-6 w-6 bg-cover bg-center mt-2"
                                  style={{ backgroundImage: `url(${Right})` }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    moveCardRight(deckType, index);
                                  }}
                                />
                              </div>
                              <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  className="h-6 w-6 bg-cover bg-center"
                                  style={{ backgroundImage: `url(${Del})` }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteCard(deckType, index);
                                  }}
                                />
                              </div>
                            </>
                          )}
                        </>
                      ) : card === "merged" ? (
                        <span className="text-gray-400">↔</span>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Plus
                            size={70}
                            className="text-[#f9f3e8] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          />
                        </div>
                      )}
                    </div>
                  );
                })
                .filter(Boolean)}{" "}
              {/* Filter out null values from skipped merged slots */}
            </div>
          </div>
        ))}
      </div>
      {/* Card Selection Popup */}
      {selectingFor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div
            className="p-6 rounded-lg shadow-xl w-96 max-h-[80vh] flex flex-col relative"
            style={{ backgroundColor: "#B1714B" }}
          >
            <div className="sticky top-0 bg-[#B1714B] z-10 pb-4">
              <button
                className="absolute top-3 right-3 w-10 h-10 bg-cover bg-center"
                style={{ backgroundImage: `url(${Cross})` }}
                onClick={() => setSelectingFor(null)}
              />
              {!selectingSize ? (
                <h3 className="text-xl font-semibold text-white mb-4 pr-12">
                  Select Card Size
                </h3>
              ) : (
                <h3 className="text-xl font-semibold text-gray-300 mb-4 pr-12">
                  Select a Card
                </h3>
              )}
            </div>

            <div className="overflow-y-auto flex-1">
              {!selectingSize ? (
                <div className="flex gap-4 mb-4">
                  {["small", "medium", "large"].map((size) => (
                    <button
                      key={size}
                      className="bg-gray-600 p-3 rounded-lg text-white"
                      style={{ backgroundColor: "#804A2B" }}
                      onClick={() => {
                        setSelectingSize(size);
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {availableCards.map((card, i) => (
                    <div
                      key={i}
                      className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-600"
                      style={{ backgroundColor: "#804A2B" }}
                      onClick={() =>
                        handleCardSelect(
                          selectingFor.index,
                          selectingFor.deckType,
                          card
                        )
                      }
                    >
                      <img
                        src={card.image}
                        alt={card.name}
                        className="w-12 h-12 rounded-md mr-2 object-cover"
                      />
                      <span className="text-white">{card.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {isSkillsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div
            className="bg-gray-800 p-6 rounded-lg shadow-xl w-[600px] h-[80vh] relative bg-cover bg-center flex flex-col"
            style={{ backgroundImage: `url(${SBG})` }}
          >
            <button
              className="absolute top-3 right-3 w-10 h-10 text-white p-2 rounded bg-cover bg-center"
              style={{ backgroundImage: `url(${Cross})` }}
              onClick={() => setIsSkillsModalOpen(false)}
            ></button>
            <div className="flex-none">
              <h3 className="text-white text-xl mb-4">Select a Skill</h3>
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search skills..."
                    value={skillSearchTerm}
                    onChange={(e) => setSkillSearchTerm(e.target.value)}
                    className="w-full p-2 pl-8 rounded b text-white"
                    style={{ backgroundColor: "#B1714B" }}
                  />
                  <Search className="absolute top-2.5 left-2 text-gray-400 h-5 w-5" />
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                {filteredSkills.map((skill, i) => (
                  <div
                    key={i}
                    className="flex flex-col p-3  rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
                    style={{ backgroundColor: "#804A2B" }}
                    onClick={() => handleSelectSkill(skill)}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={skill.image}
                        alt={skill.name}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                      <span className="text-white font-medium">
                        {skill.name}
                      </span>
                    </div>
                    {skill.description && (
                      <p className="text-gray-300 text-sm mt-2">
                        {skill.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="p-4">
        <div className="p-6 flex space-x-4">
          <button
            onClick={async () => {
              await handleFight();
            }}
            className="text-white text-lg px-6 py-3 border border-black rounded-md 
      shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),inset_0_-1px_2px_rgba(0,0,0,0.3),0_2px_4px_rgba(0,0,0,0.3)] 
      transition-all duration-300 bg-black/20 backdrop-blur-md hover:opacity-70 
      active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3),inset_0_-1px_2px_rgba(255,255,255,0.3)]
      flex items-center gap-2"
          >
            <Swords size={24} />
          </button>

          {/* Permanently disabled 10x button */}
          <button
            className="text-white text-lg px-6 py-3 border border-black rounded-md 
      shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),inset_0_-1px_2px_rgba(0,0,0,0.3),0_2px_4px_rgba(0,0,0,0.3)] 
      transition-all duration-300 bg-black/20 backdrop-blur-md opacity-30 pointer-events-none
      flex items-center gap-2"
            disabled
          >
            <Swords size={24} />
            x10
          </button>

          {/* Permanently disabled 100x button */}
          <button
            className="text-white text-lg px-6 py-3 border border-black rounded-md 
      shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),inset_0_-1px_2px_rgba(0,0,0,0.3),0_2px_4px_rgba(0,0,0,0.3)] 
      transition-all duration-300 bg-black/20 backdrop-blur-md opacity-30 pointer-events-none
      flex items-center gap-2"
            disabled
          >
            <Swords size={24} />
            x100
          </button>

          <button
            onClick={() => {
              setEnemyDeck(Array(10).fill(null));
              setOurDeck(Array(10).fill(null));
              setEnemySkills([]);
              setOurSkills([]);
              setFightResult(null);
            }}
            className="text-white text-lg px-6 py-3 border border-black rounded-md 
      shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),inset_0_-1px_2px_rgba(0,0,0,0.3),0_2px_4px_rgba(0,0,0,0.3)] 
      transition-all duration-300 bg-black/20 backdrop-blur-md hover:opacity-70 
      active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3),inset_0_-1px_2px_rgba(255,255,255,0.3)]
      flex items-center gap-2"
          >
            <Trash2 size={24} />
            Clear Board
          </button>
        </div>
      </div>
      {/* Victory/Defeat Popup */}
      {fightResult && (
        <div
          className={`mt-4 p-6 bg-[#f9f3e8] rounded-xl shadow-xl border-2 border-[#e0ac54]`}
        >
          <div className="flex items-center justify-center gap-6">
            <div
              className={`${
                fightResult === "Victory" ? "animate-bounce" : "animate-pulse"
              }`}
            >
              {fightResult === "Victory" ? (
                <Trophy className="w-16 h-16 text-yellow-400" />
              ) : (
                <AlertCircle className="w-16 h-16 text-red-400" />
              )}
            </div>

            <div className="flex flex-col">
              <h2
                className={`text-3xl font-bold ${
                  fightResult === "Victory" ? "text-green-400" : "text-red-400"
                }`}
              >
                {fightResult}!
              </h2>
              <p className="text-[#4a2d00] text-lg">
                {fightResult === "Victory"
                  ? "Our Deck Won !!"
                  : "Enemy Deck Won!"}
              </p>
            </div>

            <button
              onClick={() => setFightResult(null)}
              className="ml-auto text-gray-400 hover:text-white transition-colors"
            >
              <XCircle size={24} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
