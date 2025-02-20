import { useState, useEffect } from "react";

// Fetch hero card data
const fetchHeroCards = async (hero, size) => {
  try {
    const response = await fetch(`/data/${hero.toLowerCase()}_${size}.json`);
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
};

export default function BazaarBuildPlanner() {
  const [enemyDeck, setEnemyDeck] = useState(Array(10).fill(null));
  const [ourDeck, setOurDeck] = useState(Array(10).fill(null));
  const [ourHero, setOurHero] = useState("Vanessa");
  const [enemyHero, setEnemyHero] = useState("Vanessa");
  const [selectingFor, setSelectingFor] = useState(null);
  const [availableCards, setAvailableCards] = useState([]);
  const [selectingSize, setSelectingSize] = useState(null);

  useEffect(() => {
    if (selectingSize && selectingFor) {
      loadHeroCards(selectingFor.deckType, selectingSize);
    }
  }, [selectingSize]);

  useEffect(() => {
    setEnemyDeck(Array(10).fill(null));
    setOurDeck(Array(10).fill(null));
  }, [ourHero, enemyHero]);

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
    let availableIndexes = [];

    for (let i = index; i < index + cardSize; i++) {
      if (i < newDeck.length && newDeck[i] === null) {
        availableIndexes.push(i);
      }
    }

    if (availableIndexes.length === cardSize) {
      availableIndexes.forEach((slotIndex, i) => {
        newDeck[slotIndex] = i === 0 ? card : "merged";
      });
      setDeck(newDeck);
    }

    setSelectingFor(null);
    setSelectingSize(null);
    setAvailableCards([]);
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-5xl font-extrabold mb-8 text-yellow-400">Bazaar Build Planner</h1>

      {/* Hero Selection */}
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

            {/* Center-aligned Slots */}
            <div className="flex justify-center gap-2">
              {(deckType === "enemy" ? enemyDeck : ourDeck).map((card, index) => (
                <div
                  key={index}
                  className={`relative flex items-center justify-center border-2 rounded-md cursor-pointer ${card === "merged" ? "hidden" : ""}`}
                  style={{
                    width: card && card !== "merged" ? `${(card.size === "medium" ? 2 : card.size === "large" ? 3 : 1) * 80}px` : "80px",
                    height: "120px",
                    backgroundColor: card ? "transparent" : "gray",
                  }}
                  onClick={() => !card && setSelectingFor({ deckType, index })}
                >
                  {card && card !== "merged" ? (
                    <img src={card.image} alt={card.name} className="w-full h-full object-cover rounded-md" />
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
                    <button key={size} className="bg-gray-600 p-3 rounded-lg text-white" onClick={() => setSelectingSize(size)}>{size}</button>
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
    </div>
  );
}
