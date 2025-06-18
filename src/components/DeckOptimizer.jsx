import React, { useState } from "react";
import Cross from "../assets/Images/Close.png";

const apiUrl = import.meta.env.VITE_API_URL;

const DeckOptimizerModal = ({
  isOpen,
  onClose,
  ourDeck,
  enemyDeck,
  setOurDeck,
  enemyHero,
  selectedMonster,
  ourHero,
  ourSelectedMonster,
  selectedDay,
  ourSelectedDay,
  customEnemyHealth,
  customPlayerHealth,
  enemySkills,
  ourSkills,
  rollbar,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [optimizedDeck, setOptimizedDeck] = useState(null);
  const [originalDeck, setOriginalDeck] = useState(null);

  if (!isOpen) return null;

  // Function to determine health value
  const getHealthValue = (isEnemy) => {
    if (isEnemy) {
      if (enemyHero === "Monster" && selectedMonster) {
        return customEnemyHealth || selectedMonster.maxHealth;
      }
      return customEnemyHealth;
    } else {
      if (ourHero === "Monster" && ourSelectedMonster) {
        return customPlayerHealth || ourSelectedMonster.maxHealth;
      }
      return customPlayerHealth;
    }
  };

  // Create arrays without empty strings for merged slots
  const getItemsArray = (deck) => {
    const items = [];
    for (let i = 0; i < deck.length; i++) {
      if (deck[i] && deck[i] !== "merged") {
        items.push(deck[i].name);
      } else if (!deck[i]) {
        items.push(""); // Only add empty string for truly empty slots
      }
      // Skip the next slot(s) if this is a medium/large card
      if (deck[i] && deck[i] !== "merged") {
        if (deck[i].size === "medium") {
          i++; // Skip next slot
        } else if (deck[i].size === "large") {
          i += 2; // Skip next two slots
        }
      }
    }
    return items;
  };

  const handleOptimize = async () => {
    setIsLoading(true);
    setError(null);
    setOriginalDeck([...ourDeck]); // Store the original deck state

    try {
      const optimizationData = {
        playerTop: {
          name:
            enemyHero === "Monster" && selectedMonster
              ? selectedMonster.name
              : enemyHero,
          isMonster: false,
          HP: getHealthValue(true),
          day: selectedDay || 0,
          items: getItemsArray(enemyDeck),
          skills: enemySkills.map((skill) => skill.name),
        },
        playerBottom: {
          name:
            ourHero === "Monster" && ourSelectedMonster
              ? ourSelectedMonster.name
              : ourHero,
          isMonster: false,
          HP: getHealthValue(false),
          day: ourSelectedDay || 0,
          items: getItemsArray(ourDeck),
          skills: ourSkills.map((skill) => skill.name),
        },
      };

      const response = await fetch(`${apiUrl}/battle/optimize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(optimizationData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Optimization result:", result);

      // If API returns an optimized layout, process it
      if (result.Layout && Array.isArray(result.Layout)) {
        // Process the optimized deck to match your deck structure
        const processedDeck = processOptimizedDeck(result.Layout);
        setOptimizedDeck(processedDeck); // Store the optimized deck
        setOurDeck(processedDeck); // Update the current deck
        setShowSuccess(true);
      }
    } catch (error) {
      console.error("Optimization error:", error);
      rollbar.error("Optimization error:", error);
      setError("Failed to optimize: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Process the optimized deck from API to match your app's deck structure
  const processOptimizedDeck = (optimizedLayout) => {
    // Start with an empty deck
    let processedDeck = Array(10).fill(null);

    // Calculate how many slots the optimized layout will use
    let totalSlotsNeeded = 0;
    for (const item of optimizedLayout) {
      if (!item || !item.Name) continue;

      if (item.Size.toLowerCase() === "small") {
        totalSlotsNeeded += 1;
      } else if (item.Size.toLowerCase() === "medium") {
        totalSlotsNeeded += 2;
      } else if (item.Size.toLowerCase() === "large") {
        totalSlotsNeeded += 3;
      }
    }

    // Calculate the starting index to center the cards in the deck
    // For a 10-slot deck, if we need 6 slots, we should start at index (10-6)/2 = 2
    const startIndex = Math.floor((10 - totalSlotsNeeded) / 2);
    let currentIndex = Math.max(0, startIndex); // Ensure we don't have negative index

    // Process each item from the optimized layout
    for (const item of optimizedLayout) {
      if (!item || !item.Name) continue;

      // Check if we still have room in the deck
      if (currentIndex >= 10) break;

      // Add the item to the deck
      processedDeck[currentIndex] = {
        name: item.Name,
        size: item.Size.toLowerCase(),
        image: `/Items/${item.Name.replace(/\s+/g, "")}.avif`,
        // Try to find existing card data from current deck
        attributes: findCardAttributes(item.Name, ourDeck) || [],
        tier: findCardTier(item.Name, ourDeck) || "Bronze",
      };

      // Handle merged slots based on card size
      if (item.Size.toLowerCase() === "medium") {
        if (currentIndex + 1 < 10) {
          processedDeck[currentIndex + 1] = "merged";
        }
        currentIndex += 2; // Skip the next slot
      } else if (item.Size.toLowerCase() === "large") {
        if (currentIndex + 1 < 10) {
          processedDeck[currentIndex + 1] = "merged";
        }
        if (currentIndex + 2 < 10) {
          processedDeck[currentIndex + 2] = "merged";
        }
        currentIndex += 3; // Skip the next two slots
      } else {
        currentIndex++; // Move to next slot
      }
    }

    return processedDeck;
  };

  // Helper function to find card attributes from existing deck
  const findCardAttributes = (cardName, deck) => {
    for (const card of deck) {
      if (card && card !== "merged" && card.name === cardName) {
        return card.attributes;
      }
    }
    return [];
  };

  // Helper function to find card tier from existing deck
  const findCardTier = (cardName, deck) => {
    for (const card of deck) {
      if (card && card !== "merged" && card.name === cardName) {
        return card.tier;
      }
    }
    return "Bronze";
  };
  return (
    <>
      {!showSuccess ? (
        // Optimizer Panel
        <div className="fixed inset-0 flex justify-center items-center z-40">
          <div className="bg-[#B1714B] p-6 rounded-lg shadow-xl w-[500px] max-h-[80vh] relative">
            <button
              className="absolute top-1 right-1 w-10 h-10 bg-cover bg-center transform translate-x-1/2 -translate-y-1/2"
              style={{ backgroundImage: `url(${Cross})` }}
              onClick={onClose}
            />

            <div className="overflow-y-auto max-h-[calc(80vh-40px)]">
              <h3 className="text-2xl font-semibold text-white mb-6 text-center">
                Deck Optimizer
              </h3>

              <p className="text-white text-center mb-8">
                Choose the Max efficiency for optimization ..
              </p>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <button
                  onClick={handleOptimize}
                  disabled={isLoading}
                  className={`px-6 py-3 rounded-lg text-white font-medium
                    ${
                      isLoading
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700 active:bg-red-800"
                    }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-3 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </div>
                  ) : (
                    "Damage"
                  )}
                </button>

                <button
                  disabled={true}
                  className="px-6 py-3 bg-orange-600 opacity-50 cursor-not-allowed text-white rounded-lg"
                >
                  Burn
                </button>

                <button
                  disabled={true}
                  className="px-6 py-3 bg-yellow-400 opacity-50 cursor-not-allowed text-white rounded-lg"
                >
                  Defense
                </button>

                <button
                  disabled={true}
                  className="px-6 py-3 bg-cyan-600 opacity-50 cursor-not-allowed text-white rounded-lg"
                >
                  Freeze
                </button>
              </div>

              {error && (
                <div className="p-3 mt-4 bg-red-500 bg-opacity-20 border border-red-500 text-red-700 rounded text-center">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        // Accept/Deny Panel
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 mb-8 z-50">
          <div className="bg-[#B1714B] px-8 py-4 rounded-lg shadow-xl flex flex-col items-center">
            <p className="text-white text-lg mb-4">
              Do you want to keep the optimized deck?
            </p>
            <div className="flex justify-center space-x-6">
              <button
                onClick={() => {
                  setShowSuccess(false);
                  onClose();
                }}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
              >
                Accept
              </button>
              <button
                onClick={() => {
                  if (originalDeck) {
                    setOurDeck(originalDeck); // Revert to original deck
                  }
                  setShowSuccess(false);
                  onClose();
                }}
                className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
              >
                Deny
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeckOptimizerModal;
