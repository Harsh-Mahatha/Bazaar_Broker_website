import React from "react";
import { Search } from "lucide-react";
import Cross from "../assets/Images/Close.png";
const apiUrl = import.meta.env.VITE_API_URL;
const CardSearchModal = ({
  setIsCardSearchModalOpen,
  allCards,
  selectedDeckTypeForCards,
  cardSearchTerm,
  setCardSearchTerm,
  enemyDeck,
  ourDeck,
  setEnemyDeck,
  setOurDeck,
  currentStats,
  setCurrentStats,
  setSelectingFor,
  setSelectingSize,
  setAvailableCards,
  isFirstThreeEmpty,
  rollbar,
}) => {
  const handleCardSelect = async (index, deckType, card) => {
    try {
      const deck = deckType === "enemy" ? enemyDeck : ourDeck;
      let setDeck = deckType === "enemy" ? setEnemyDeck : setOurDeck;

      // Create array of existing card names
      const existingCardNames = deck
        .filter((item) => item && item !== "merged")
        .map((item) => item.name);

      // Add the new card name
      const cardNames = [...existingCardNames, card.name];

      // Make API call for current stats
      const response = await fetch(
        `${apiUrl}/currentStats`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cardNames),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const statsData = await response.json();

      // Update current stats state
      const newStats = { ...currentStats };
      statsData.forEach((stat) => {
        newStats[stat.name] = stat.currentStats;
      });
      setCurrentStats(newStats);

      // Card Placement Logic
      let newDeck = [...deck];

      // If selecting in combined large slot area, reset all three slots
      if (isFirstThreeEmpty(deck) && index === 0) {
        newDeck[0] = null;
        newDeck[1] = null;
        newDeck[2] = null;
      }

      const cardSize =
        card.size === "medium" ? 2 : card.size === "large" ? 3 : 1;

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
        for (let i = 1; i < cardSize; i++) {
          newDeck[index + i] = "merged";
        }
        setDeck(newDeck);
        setSelectingFor(null);
        setSelectingSize(null);
        setAvailableCards([]);
        return;
      }

      // Try placing by expanding to the left
      if (cardSize === 2 && index - 1 >= 0 && newDeck[index - 1] === null) {
        newDeck[index - 1] = card;
        newDeck[index] = "merged";
        setDeck(newDeck);
        setSelectingFor(null);
        setSelectingSize(null);
        setAvailableCards([]);
        return;
      }

      if (cardSize === 3) {
        // Check for 1 slot left, 1 right
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

        // Check for 2 slots to the left
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

      // Try adjusted placement as fallback
      let adjustedIndex = null;

      if (cardSize === 2) {
        if (
          index + 1 < newDeck.length &&
          newDeck[index + 1] !== null &&
          index - 1 >= 0 &&
          newDeck[index - 1] === null
        ) {
          adjustedIndex = index - 1;
        } else if (
          index - 1 >= 0 &&
          newDeck[index - 1] !== null &&
          index + 1 < newDeck.length &&
          newDeck[index + 1] === null
        ) {
          adjustedIndex = index;
        }
      } else if (cardSize === 3) {
        if (
          index + 1 < newDeck.length &&
          newDeck[index + 1] !== null &&
          index - 2 >= 0 &&
          newDeck[index - 1] === null &&
          newDeck[index - 2] === null
        ) {
          adjustedIndex = index - 2;
        } else if (
          index - 1 >= 0 &&
          newDeck[index - 1] !== null &&
          index + 2 < newDeck.length &&
          newDeck[index + 1] === null &&
          newDeck[index + 2] === null
        ) {
          adjustedIndex = index;
        }
      }

      // If we found a valid adjusted position, place the card
      if (adjustedIndex !== null) {
        newDeck[adjustedIndex] = card;
        for (let i = 1; i < cardSize; i++) {
          newDeck[adjustedIndex + i] = "merged";
        }
        setDeck(newDeck);
      }

      // Reset selection states
      setSelectingFor(null);
      setSelectingSize(null);
      setAvailableCards([]);
      setIsCardSearchModalOpen(false);
    } catch (error) {
      console.error("Error in handleCardSelect:", error);
      rollbar.error("Error in handleCardSelect:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#B1714B] p-6 rounded-lg shadow-xl w-[800px] h-[80vh] relative flex flex-col">
        <button
          className="absolute top-1 right-1 w-10 h-10 bg-cover bg-center transform translate-x-1/2 -translate-y-1/2"
          style={{ backgroundImage: `url(${Cross})` }}
          onClick={() => setIsCardSearchModalOpen(false)}
        />

        <div className="sticky top-0 z-10 pb-4">
          <h3 className="text-xl font-semibold text-white mb-4">Add Cards</h3>
          <div className="text-gray-300 text-sm mb-2">
            Total cards available:{" "}
            {
              allCards.filter((card) =>
                card.name.toLowerCase().includes(cardSearchTerm.toLowerCase())
              ).length
            }
          </div>
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search cards..."
              value={cardSearchTerm}
              onChange={(e) => setCardSearchTerm(e.target.value)}
              className="w-full p-2 pl-8 rounded text-white bg-[#804A2B]"
            />
            <Search className="absolute top-2.5 left-2 text-gray-400 h-5 w-5" />
          </div>
        </div>

        <div className="overflow-y-auto flex-1 grid grid-cols-3 gap-4">
          {allCards
            .filter(
              (card) =>
                card.hero === "Vanessa" &&
                card.name.toLowerCase().includes(cardSearchTerm.toLowerCase())
            )
            .map((card, i) => (
              <div
                key={i}
                className="flex flex-col p-3 rounded-lg cursor-pointer hover:bg-[#804A2B] transition-colors bg-[#8B4B2B] h-24"
                onClick={() => {
                  handleCardSelect(
                    selectedDeckTypeForCards.index,
                    selectedDeckTypeForCards.deckType,
                    card
                  );
                  setIsCardSearchModalOpen(false);
                }}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={card.image}
                    alt={card.name}
                    className="w-16 h-16 rounded-md object-cover"
                  />
                  <div>
                    <span className="text-white font-medium">{card.name}</span>
                    <div className="text-gray-300 text-sm">
                      {card.hero} • {card.size}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CardSearchModal;