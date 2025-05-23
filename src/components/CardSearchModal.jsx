import React, { useMemo, useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import Cross from "../assets/Images/Close.png";
const apiUrl = import.meta.env.VITE_API_URL;

// Add custom scrollbar styles to document head
const injectCustomScrollbarStyles = () => {
  // Only inject if not already present
  if (!document.getElementById('custom-scrollbar-styles')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'custom-scrollbar-styles';
    styleElement.textContent = `
      /* Custom scrollbar styling only for cards grid */
      .cards-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: #E8A87C #2A1A12;
      }
      
      .cards-scrollbar::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      
      .cards-scrollbar::-webkit-scrollbar-track {
        background: #2A1A12;
        border-radius: 4px;
      }
      
      .cards-scrollbar::-webkit-scrollbar-thumb {
        background-color: #B1714B;
        border-radius: 4px;
        border: 2px solid #2A1A12;
      }
      
      .cards-scrollbar::-webkit-scrollbar-thumb:hover {
        background-color: #E8A87C;
      }
    `;
    document.head.appendChild(styleElement);
  }
};

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
  const [selectedTags, setSelectedTags] = useState([]);
  const [matchType, setMatchType] = useState("all"); // "all" or "any"

  // Inject custom scrollbar styles on component mount
  useEffect(() => {
    injectCustomScrollbarStyles();
  }, []);

  // Toggle tag selection
  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  // Filter cards based on search term and tags
  const filteredCards = useMemo(() => {
    return allCards.filter(card => {
      // Filter by search term
      const matchesSearch = card.name.toLowerCase().includes(cardSearchTerm.toLowerCase());
      
      // Filter by card tags if any are selected
      let matchesTags = true;
      if (selectedTags.length > 0 && card.tags && Array.isArray(card.tags)) {
        if (matchType === "all") {
          // Card must have ALL selected tags
          matchesTags = selectedTags.every(tag => card.tags.includes(tag));
        } else {
          // Card must have ANY of the selected tags
          matchesTags = selectedTags.some(tag => card.tags.includes(tag));
        }
      } else if (selectedTags.length > 0) {
        matchesTags = false;
      }
      
      return matchesSearch && matchesTags;
    });
  }, [allCards, cardSearchTerm, selectedTags, matchType]);

  // Card selection handler
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
      rollbar?.error("Error in handleCardSelect:", error);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedTags([]);
    setCardSearchTerm('');
  };

  // Gets all the available tags in the dataset
  const getAllTags = () => {
    const tags = [
      "Ammo", "AmmoReference", "Apparel", "Aquatic", "Burn", "BurnReference",
      "Charge", "Cooldown", "Core", "Crit", "CritReference", "Damage",
      "DamageReference", "Dinosaur", "Dragon", "Economy", "Experience",
      "Food", "Freeze", "FreezeReference", "Friend", "Gold", "Haste",
      "HasteReference", "Heal", "HealReference", "Health", "HealthReference",
      "Income", "Poison", "PoisonReference", "Potion", "Property", "Ray",
      "Reagent", "Regen", "RegenReference", "Relic", "Shield", "ShieldReference",
      "Slow", "SlowReference", "Tech", "Tool", "Toy", "Unpurchasable",
      "Value", "Vehicle", "Weapon"
    ];
    return tags;
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
            Total cards available: {filteredCards.length} (All Cards coming Soon)
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
          
          {/* Card tags filter */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <h4 className="text-white font-medium mr-2">Tags</h4>
                <div className="flex bg-[#2A1A12] rounded overflow-hidden">
                  <button 
                    className={`px-3 py-1 text-sm transition-colors ${
                      matchType === "all" 
                        ? 'bg-[#804A2B] text-white' 
                        : 'text-gray-300 hover:bg-[#3A2013]'
                    }`}
                    onClick={() => setMatchType("all")}
                  >
                    Match All
                  </button>
                  <button 
                    className={`px-3 py-1 text-sm transition-colors ${
                      matchType === "any" 
                        ? 'bg-[#804A2B] text-white' 
                        : 'text-gray-300 hover:bg-[#3A2013]'
                    }`}
                    onClick={() => setMatchType("any")}
                  >
                    Match Any
                  </button>
                </div>
              </div>
              
              {(selectedTags.length > 0 || cardSearchTerm) && (
                <button 
                  onClick={clearFilters}
                  className="text-white text-sm bg-[#804A2B] hover:bg-[#6A3A22] px-3 py-1 rounded flex items-center"
                >
                  <X className="w-4 h-4 mr-1" /> Clear filters
                </button>
              )}
            </div>
            
            {/* Tag container with flex-wrap */}
            <div className="bg-[#2A1A12] rounded p-3">
              <div className="flex flex-wrap gap-2">
                {getAllTags().map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 rounded text-sm transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-[#E8A87C] text-[#5D341F] font-medium'
                        : 'bg-[#804A2B] text-white hover:bg-[#9A5B34]'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Selected filters display */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {/* Display selected tags */}
              {selectedTags.map(tag => (
                <div key={`tag-${tag}`} className="bg-[#E8A87C] text-[#5D341F] px-3 py-1 rounded text-sm flex items-center">
                  {tag}
                  <button 
                    onClick={() => toggleTag(tag)} 
                    className="ml-1 text-[#5D341F] hover:text-[#3A2013]"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Card grid with themed scrollbar */}
        <div className="overflow-y-auto cards-scrollbar flex-1 grid grid-cols-3 gap-4 pr-1">
          {filteredCards.map((card, i) => (
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
                  {/* Card tags */}
                  {card.tags && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {card.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="text-xs bg-[#5D341F] text-[#E8A87C] px-1 rounded">
                          {tag}
                        </span>
                      ))}
                      {card.tags.length > 3 && (
                        <span className="text-xs text-gray-300">+{card.tags.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {filteredCards.length === 0 && (
            <div className="col-span-3 text-white text-center py-8">
              No cards found matching your filters. Try adjusting your search or filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardSearchModal;



