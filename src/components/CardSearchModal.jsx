import React, { useMemo, useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import Cross from "../assets/Images/Close.png";
const apiUrl = import.meta.env.VITE_API_URL;

// Add custom scrollbar styles to document head
const injectCustomScrollbarStyles = () => {
  // Only inject if not already present
  if (!document.getElementById("custom-scrollbar-styles")) {
    const styleElement = document.createElement("style");
    styleElement.id = "custom-scrollbar-styles";
    styleElement.textContent = `
      /* Custom scrollbar styling only for tags section */
      .tags-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: #E8A87C #2A1A12;
      }
      
      .tags-scrollbar::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      
      .tags-scrollbar::-webkit-scrollbar-track {
        background: #2A1A12;
        border-radius: 4px;
      }
      
      .tags-scrollbar::-webkit-scrollbar-thumb {
        background-color: #B1714B;
        border-radius: 4px;
        border: 2px solid #2A1A12;
      }
      
      .tags-scrollbar::-webkit-scrollbar-thumb:hover {
        background-color: #E8A87C;
      }

      /* Main modal scrollbar */
      .modal-content {
        scrollbar-width: thin;
        scrollbar-color: #E8A87C #2A1A12;
      }
      
      .modal-content::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      
      .modal-content::-webkit-scrollbar-track {
        background: #2A1A12;
        border-radius: 4px;
      }
      
      .modal-content::-webkit-scrollbar-thumb {
        background-color: #B1714B;
        border-radius: 4px;
        border: 2px solid #2A1A12;
      }
      
      .modal-content::-webkit-scrollbar-thumb:hover {
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
  const [selectedHeroes, setSelectedHeroes] = useState([]);
  const [selectedTiers, setSelectedTiers] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [matchType, setMatchType] = useState("all"); // "all" or "any"

  // Debug state to track data availability
  const [debugInfo, setDebugInfo] = useState({
    cardsCount: 0,
    sampleCard: null,
  });

  // Inject custom scrollbar styles on component mount
  useEffect(() => {
    injectCustomScrollbarStyles();

    // Initialize debug info
    if (allCards && allCards.length > 0) {
      setDebugInfo({
        cardsCount: allCards.length,
        sampleCard: allCards[0],
      });
      console.log("Cards available:", allCards.length);
      console.log("Sample card:", allCards[0]);
    }
  }, [allCards]);

  // Toggle tag selection
  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Toggle hero selection
  const toggleHero = (hero) => {
    setSelectedHeroes((prev) =>
      prev.includes(hero) ? prev.filter((h) => h !== hero) : [...prev, hero]
    );
  };

  // Toggle tier selection
  const toggleTier = (tier) => {
    setSelectedTiers((prev) =>
      prev.includes(tier) ? prev.filter((t) => t !== tier) : [...prev, tier]
    );
  };

  // Toggle size selection
  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  // Filter cards based on search term, tags, heroes, tiers, and sizes
  const filteredCards = useMemo(() => {
    if (!allCards) return [];

    return allCards.filter((card) => {
      // Filter by search term
      const matchesSearch = card.name
        .toLowerCase()
        .includes(cardSearchTerm.toLowerCase());

      // Filter by card tags if any are selected
      let matchesTags = true;
      if (selectedTags.length > 0 && card.tags && Array.isArray(card.tags)) {
        if (matchType === "all") {
          // Card must have ALL selected tags
          matchesTags = selectedTags.every((tag) => card.tags.includes(tag));
        } else {
          // Card must have ANY of the selected tags
          matchesTags = selectedTags.some((tag) => card.tags.includes(tag));
        }
      } else if (selectedTags.length > 0) {
        matchesTags = false;
      }

      // Filter by hero
      let matchesHero = true;
      if (selectedHeroes.length > 0 && card.tags && Array.isArray(card.tags)) {
        matchesHero = selectedHeroes.some((hero) => card.tags.includes(hero));
      }

      // Filter by tier
      let matchesTier = true;
      if (selectedTiers.length > 0 && card.tags && Array.isArray(card.tags)) {
        matchesTier = selectedTiers.some((tier) =>
          card.tags.some((tag) => tag === `${tier}+`)
        );
      }

      // Filter by size
      let matchesSize = true;
      if (selectedSizes.length > 0 && card.tags && Array.isArray(card.tags)) {
        matchesSize = selectedSizes.some((size) => card.tags.includes(size));
      }

      return (
        matchesSearch &&
        matchesTags &&
        matchesHero &&
        matchesTier &&
        matchesSize
      );
    });
  }, [
    allCards,
    cardSearchTerm,
    selectedTags,
    selectedHeroes,
    selectedTiers,
    selectedSizes,
    matchType,
  ]);

  // Card selection handler
  const handleCardSelect = async (index, deckType, card) => {
    try {
      // Existing card selection logic remains unchanged
      const deck = deckType === "enemy" ? enemyDeck : ourDeck;
      let setDeck = deckType === "enemy" ? setEnemyDeck : setOurDeck;

      // Create array of existing card names
      const existingCardNames = deck
        .filter((item) => item && item !== "merged")
        .map((item) => item.name);

      // Add the new card name
      const cardNames = [...existingCardNames, card.name];

      // Make API call for current stats
      const response = await fetch(`${apiUrl}/currentStats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cardNames),
      });

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
    setSelectedHeroes([]);
    setSelectedTiers([]);
    setSelectedSizes([]);
    setCardSearchTerm("");
  };

  // Gets all the available tags in the dataset
  const getAllTags = () => {
    const tags = [
      "Ammo",
      "AmmoReference",
      "Apparel",
      "Aquatic",
      "Burn",
      "BurnReference",
      "Charge",
      "Cooldown",
      "Core",
      "Crit",
      "CritReference",
      "Damage",
      "DamageReference",
      "Dinosaur",
      "Dragon",
      "Economy",
      "Experience",
      "Food",
      "Freeze",
      "FreezeReference",
      "Friend",
      "Gold",
      "Haste",
      "HasteReference",
      "Heal",
      "HealReference",
      "Health",
      "HealthReference",
      "Income",
      "Poison",
      "PoisonReference",
      "Potion",
      "Property",
      "Ray",
      "Reagent",
      "Regen",
      "RegenReference",
      "Relic",
      "Shield",
      "ShieldReference",
      "Slow",
      "SlowReference",
      "Tech",
      "Tool",
      "Toy",
      "Unpurchasable",
      "Value",
      "Vehicle",
      "Weapon",
    ];
    return tags;
  };

  // Check if any filters are active
  const hasActiveFilters =
    selectedTags.length > 0 ||
    selectedHeroes.length > 0 ||
    selectedTiers.length > 0 ||
    selectedSizes.length > 0 ||
    cardSearchTerm;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#B1714B] p-4 rounded-lg shadow-xl w-[1200px] h-[90vh] relative flex flex-col">
        <button
          className="absolute top-1 right-1 w-10 h-10 bg-cover bg-center transform translate-x-1/2 -translate-y-1/2"
          style={{ backgroundImage: `url(${Cross})` }}
          onClick={() => setIsCardSearchModalOpen(false)}
        />

        <div className="flex h-full">
          {/* Left side - Filters section */}
                <div className="w-2/5 pr-4 flex-none">
                <h3 className="text-white text-xl mb-1 mt-[-7px]">Add Cards</h3>

                <div className="text-gray-300 text-sm mb-2">
                  Total cards available: {allCards?.length || 0}
                </div>

                {debugInfo.cardsCount === 0 && (
                  <div className="bg-red-800 text-white p-2 mb-2 rounded text-sm">
                  Warning: No cards found in data source. Total cards:{" "}
                  {debugInfo.cardsCount}
                  </div>
                )}

                <div className="mb-2">
                  <div className="relative">
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

                <div className="space-y-2">
                  {/* Match type and clear filters */}
              <div className="mb-2 flex gap-2">
                <button
                  onClick={() => setMatchType("any")}
                  className={`px-4 py-1 rounded text-sm font-medium ${
                    matchType === "any"
                      ? "bg-[#D98F5F] text-white"
                      : "bg-[#5d351e] text-gray-300 hover:bg-[#804A2B]"
                  }`}
                >
                  Match Any
                </button>
                <button
                  onClick={() => setMatchType("all")}
                  className={`px-4 py-1 rounded text-sm font-medium ${
                    matchType === "all"
                      ? "bg-[#D98F5F] text-white"
                      : "bg-[#5d351e] text-gray-300 hover:bg-[#804A2B]"
                  }`}
                >
                  Match All
                </button>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="ml-auto text-xs text-gray-300 hover:text-white underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>

              {/* Heroes filter */}
              <div className="mb-1">
                <p className="text-white text-base mb-2">Heroes</p>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    "Vanessa",
                    "Pygmalien",
                    "Dooley",
                    "Mak",
                    "Jules",
                    "Stelle",
                    "Common",
                  ].map((hero) => (
                    <button
                      key={hero}
                      onClick={() => toggleHero(hero)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        selectedHeroes.includes(hero)
                          ? "bg-[#D98F5F] text-white"
                          : "bg-[#5d351e] text-gray-300 hover:bg-[#804A2B]"
                      }`}
                    >
                      {hero}
                    </button>
                  ))}
                </div>
              </div>

              {/* Starting Tiers filter */}
              <div className="mb-4">
                <p className="text-white text-base mb-2">Starting Tiers</p>
                <div className="grid grid-cols-3 gap-2">
                  {["Bronze", "Silver", "Gold", "Diamond", "Legendary"].map(
                    (tier) => (
                      <button
                        key={tier}
                        onClick={() => toggleTier(tier)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          selectedTiers.includes(tier)
                            ? "bg-[#D98F5F] text-white"
                            : "bg-[#5d351e] text-gray-300 hover:bg-[#804A2B]"
                        }`}
                      >
                        {tier}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Sizes filter */}
              <div className="mb-4">
                <p className="text-white text-base mb-2">Sizes</p>
                <div className="grid grid-cols-3 gap-2">
                  {["Small", "Medium", "Large"].map((size) => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        selectedSizes.includes(size)
                          ? "bg-[#D98F5F] text-white"
                          : "bg-[#5d351e] text-gray-300 hover:bg-[#804A2B]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags filter */}
                      <div>
                      <p className="text-white text-base mb-2">Tags</p>
                      <div className="max-h-[365px] overflow-y-auto tags-scrollbar">
                        <div className="grid grid-cols-3 gap-2">
                        {getAllTags().map((tag) => (
                          <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            selectedTags.includes(tag)
                            ? "bg-[#D98F5F] text-white"
                            : "bg-[#5d351e] text-gray-300 hover:bg-[#804A2B]"
                          }`}
                          >
                          {tag}
                          </button>
                        ))}
                        </div>
                      </div>
                      </div>
                    </div>
                    </div>

                    {/* Right side - Cards grid section */}
          <div className="flex-1 overflow-y-auto pl-4">
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-4 bg-[#2A1A12] p-2 rounded">
                <div className="text-white text-xs my-auto mr-1">
                  Active filters:
                </div>

                {selectedHeroes.map((hero) => (
                  <div
                    key={`selected-hero-${hero}`}
                    className="bg-[#E8A87C] text-[#5D341F] px-2 py-1 rounded text-xs flex items-center"
                  >
                    {hero}
                    <button
                      onClick={() => toggleHero(hero)}
                      className="ml-1 text-[#5D341F] hover:text-[#3A2013]"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {selectedTiers.map((tier) => (
                  <div
                    key={`selected-tier-${tier}`}
                    className="bg-[#E8A87C] text-[#5D341F] px-2 py-1 rounded text-xs flex items-center"
                  >
                    {tier}
                    <button
                      onClick={() => toggleTier(tier)}
                      className="ml-1 text-[#5D341F] hover:text-[#3A2013]"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {selectedSizes.map((size) => (
                  <div
                    key={`selected-size-${size}`}
                    className="bg-[#E8A87C] text-[#5D341F] px-2 py-1 rounded text-xs flex items-center"
                  >
                    {size}
                    <button
                      onClick={() => toggleSize(size)}
                      className="ml-1 text-[#5D341F] hover:text-[#3A2013]"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {selectedTags.map((tag) => (
                  <div
                    key={`selected-tag-${tag}`}
                    className="bg-[#E8A87C] text-[#5D341F] px-2 py-1 rounded text-xs flex items-center"
                  >
                    {tag}
                    <button
                      onClick={() => toggleTag(tag)}
                      className="ml-1 text-[#5D341F] hover:text-[#3A2013]"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {cardSearchTerm && (
                  <div className="bg-[#E8A87C] text-[#5D341F] px-2 py-1 rounded text-xs flex items-center">
                    "{cardSearchTerm}"
                    <button
                      onClick={() => setCardSearchTerm("")}
                      className="ml-1 text-[#5D341F] hover:text-[#3A2013]"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-3 gap-4">
              {filteredCards.map((card, i) => (
                <div
                  key={i}
                  className="flex flex-col p-3 rounded-lg cursor-pointer hover:bg-[#905A3B] bg-[#804A2B]"
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
                      className="w-12 h-12 rounded-md object-cover"
                    />
                    <span className="text-white font-medium">{card.name}</span>
                  </div>
                  <div className="text-gray-300 text-sm mt-2">
                    {card.tags?.find((tag) =>
                      [
                        "Vanessa",
                        "Pygmalien",
                        "Dooley",
                        "Mak",
                        "Jules",
                        "Stelle",
                        "Common",
                      ].includes(tag)
                    )}{" "}
                    •{" "}
                    {card.tags?.find((tag) =>
                      ["Small", "Medium", "Large"].includes(tag)
                    )}
                  </div>
                  {card.tags && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {card.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="bg-[#5d351e] text-gray-300 text-xs px-2 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {card.tags.length > 3 && (
                        <span className="text-xs text-gray-300">
                          +{card.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredCards.length === 0 && (
              <div className="flex justify-center items-center h-40">
                <p className="text-gray-300 text-center">
                  No cards found matching your filters. Try adjusting your
                  search or filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardSearchModal;
