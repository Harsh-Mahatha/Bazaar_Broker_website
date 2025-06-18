import React from "react";


const apiUrl = import.meta.env.VITE_API_URL;

const BattleButtons = ({
  hasCards,
  setIsHealthModalOpen,
  setIsOptimizeModalOpen,
  setFightResult,
  setBattleStats,
  setIsProcessing,
  isProcessing,
  ourDeck,
  enemyDeck,
  enemyHero,
  selectedMonster,
  customEnemyHealth,
  selectedDay,
  ourHero,
  ourSelectedMonster,
  customPlayerHealth,
  ourSelectedDay,
  enemySkills,
  ourSkills,
  rollbar,
  supportBannerVisible,
}) => {
  const handleFight = async () => {
    // Check if both decks have at least one card
    if (!hasCards(ourDeck) && !hasCards(enemyDeck)) {
      setFightResult("Both decks cannot be empty!");
      return;
    }

    // Set processing state to true before API call
    setIsProcessing(true);

    // Reset any previous battle results
    setFightResult(null);
    setBattleStats({ enemy: null, our: null, duration: null });

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

    // Function to determine health value
    const getHealthValue = (isEnemy) => {
      if (isEnemy) {
        // For enemy
        if (enemyHero === "Monster" && selectedMonster) {
          return customEnemyHealth || selectedMonster.maxHealth;
        }
        return customEnemyHealth;
      } else {
        // For player
        if (ourHero === "Monster" && ourSelectedMonster) {
          return customPlayerHealth || ourSelectedMonster.maxHealth;
        }
        return customPlayerHealth;
      }
    };

    // Prepare battle data in required format
    const battleData = {
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
    console.log("Battle Data:", battleData);

    try {
      const response = await fetch(`${apiUrl}/battle/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(battleData),
      });

      if (!response.ok) {
        if (response.status === 500) {
          window.alert(
            "Oops! Something went wrong, and we're unable to proceed at the moment. We're still in beta, so occasional hiccups are expected. Rest assured, the issue has been logged, and we are working quickly to resolve it Thank you so much for your patience and understanding! ☺"
          );
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const resultsData = await response.json();
      // Store battle stats
      setBattleStats({
        enemy: {
          CurrentStats: resultsData.Opponent?.Stats.CurrentStats,
          DamageTotals: resultsData.Opponent?.Stats.DamageTotals || {},
          Playmat: resultsData.Opponent?.Playmat,
        },
        our: {
          CurrentStats: resultsData.Player?.Stats.CurrentStats,
          DamageTotals: resultsData.Player?.Stats.DamageTotals || {},
          Playmat: resultsData.Player?.Playmat,
        },
        duration: resultsData.Duration
          ? Math.round(resultsData.Duration / 1000)
          : null,
      });
      console.log("Battle Results Data:", resultsData);
      setFightResult(resultsData.Result || "Unknown");
    } catch (error) {
      //console.error("Error during battle:", error);
      rollbar.error("Error during battle:", error);
      setFightResult("Error: " + error.message);
      setBattleStats({ enemy: null, our: null, duration: null });
    } finally {
      // Set processing state to false after API call completes
      setIsProcessing(false);
    }
  };
  
  return (
    <div
      className={`z-20 fixed left-1/2 transform -translate-x-1/2 transition-[bottom] duration-300 ${
        supportBannerVisible ? "bottom-[115px]" : "bottom-[10px]"
      }`}
    >
      <div className="flex space-x-6">
        {/* Fight Button */}
        <div className="relative group">
          <button
            onClick={async () => {
              await handleFight();
            }}
            disabled={
              (!hasCards(ourDeck) && !hasCards(enemyDeck)) || isProcessing
            }
            className={`text-white w-14 h-14 border border-black rounded-md 
                bg-[#575757]
                shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),inset_0_-1px_2px_rgba(0,0,0,0.3),0_2px_4px_rgba(0,0,0,0.3)] 
                transition-colors duration-300 cursor-pointer
                ${
                  (!hasCards(ourDeck) && !hasCards(enemyDeck)) || isProcessing
                    ? "opacity-50 cursor-not-allowed pointer-events-none"
                    : "hover:bg-[#404040] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3),inset_0_-1px_2px_rgba(255,255,255,0.3)]"
                }
                inline-flex items-center justify-center p-0`}
          >
            <div className="w-full h-full flex items-center justify-center">
              {isProcessing ? (
                <svg
                  className="animate-spin h-8 w-8 text-white"
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
              ) : (
                <img
                  src="/Icons/Battle_Style_A.svg"
                  alt="Battle"
                  className="w-10 h-10 pointer-events-none"
                />
              )}
            </div>
          </button>
          {!hasCards(ourDeck) && !hasCards(enemyDeck) && (
            <div
              className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 
                bg-gray-800/95 text-white text-sm rounded opacity-0 group-hover:opacity-100 
                transition-opacity duration-200 z-50 pointer-events-none min-w-[200px]
                border-2 border-gray-300/50
                before:content-[''] before:absolute before:top-full before:left-1/2 
                before:-translate-x-1/2 before:border-8 before:border-transparent 
                before:border-t-gray-800/95
                after:content-[''] after:absolute after:top-full after:left-1/2 
                after:-translate-x-1/2 after:border-[8px] after:border-transparent 
                after:border-t-gray-600/50 after:-mt-[1px]"
            >
              You need to add at least one card before battling
            </div>
          )}
        </div>

        {/* Health Button */}
        <div className="relative group">
          <button
            onClick={() => setIsHealthModalOpen(true)}
            className={`text-white w-14 h-14 border border-black rounded-md 
                bg-[#575757]
                shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),inset_0_-1px_2px_rgba(0,0,0,0.3),0_2px_4px_rgba(0,0,0,0.3)] 
                transition-colors duration-300 cursor-pointer
                hover:bg-[#404040] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3),inset_0_-1px_2px_rgba(255,255,255,0.3)]
                inline-flex items-center justify-center p-0`}
          >
            <div className="w-full h-full flex items-center justify-center">
              <img
                src="/Icons/Edit.svg"
                alt="Edit"
                className="ml-[8px] mb-[7px] w-10 h-10 pointer-events-none"
              />
            </div>
          </button>
          <div
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 
              bg-gray-800/95 text-white text-sm rounded opacity-0 group-hover:opacity-100 
              transition-opacity duration-200 z-50 pointer-events-none min-w-[120px]
              border-2 border-gray-300/50
              before:content-[''] before:absolute before:top-full before:left-1/2 
              before:-translate-x-1/2 before:border-8 before:border-transparent 
              before:border-t-gray-800/95
              after:content-[''] after:absolute after:top-full after:left-1/2 
              after:-translate-x-1/2 after:border-[8px] after:border-transparent 
              after:border-t-gray-600/50 after:-mt-[1px]"
          >
            Modify Health
          </div>
        </div>

        {/* Optimize Button */}
        <div className="relative group">
          <button
            onClick={() => setIsOptimizeModalOpen(true)}
            className={`text-white w-14 h-14 border border-black rounded-md 
                bg-[#575757]
                shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),inset_0_-1px_2px_rgba(0,0,0,0.3),0_2px_4px_rgba(0,0,0,0.3)] 
                transition-colors duration-300 cursor-pointer
                hover:bg-[#404040] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3),inset_0_-1px_2px_rgba(255,255,255,0.3)]
                inline-flex items-center justify-center p-0`}
          >
            <div className="w-full h-full flex items-center justify-center">
              <img
                src="/Icons/Optimize.svg"
                alt="Optimize"
                className="ml-[2px] mb-[2px] w-10 h-10 pointer-events-none"
              />
            </div>
          </button>
          <div
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 
              bg-gray-800/95 text-white text-sm rounded opacity-0 group-hover:opacity-100 
              transition-opacity duration-200 z-50 pointer-events-none min-w-[120px]
              border-2 border-gray-300/50
              before:content-[''] before:absolute before:top-full before:left-1/2 
              before:-translate-x-1/2 before:border-8 before:border-transparent 
              before:border-t-gray-800/95
              after:content-[''] after:absolute after:top-full after:left-1/2 
              after:-translate-x-1/2 after:border-[8px] after:border-transparent 
              after:border-t-gray-600/50 after:-mt-[1px]"
          >
            Optimize Deck
          </div>
        </div>
      </div>
    </div>
  );
};

export default BattleButtons;

