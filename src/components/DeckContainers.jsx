import React from "react";
import BronzeSmall from "../assets/CardFrames/Bronze_Frame_V3_S.png";
import BronzeMedium from "../assets/CardFrames/Bronze_Frame_V3_M.png";
import BronzeLarge from "../assets/CardFrames/Bronze_Frame_V3_B.png";
import SilverSmall from "../assets/CardFrames/Silver_Frame_V3_S.png";
import SilverMedium from "../assets/CardFrames/Silver_Frame_V3_M.png";
import SilverLarge from "../assets/CardFrames/Silver_Frame_V3_B.png";
import GoldSmall from "../assets/CardFrames/Gold_Frame_V3_S.png";
import GoldMedium from "../assets/CardFrames/Gold_Frame_V3_M.png";
import GoldLarge from "../assets/CardFrames/Gold_Frame_V3_B.png";
import DiamondSmall from "../assets/CardFrames/Diamond_Frame_V3_S.png";
import DiamondMedium from "../assets/CardFrames/Diamond_Frame_V3_M.png";
import DiamondLarge from "../assets/CardFrames/Diamond_Frame_V3_B.png";
import LegendarySmall from "../assets/CardFrames/Legendary_Frame_V3_S.png";
import LegendaryMedium from "../assets/CardFrames/Legendary_Frame_V3_M.png";
import LegendaryLarge from "../assets/CardFrames/Legendary_Frame_V3_B.png";
import NCB from "../assets/Images/CardBack.png";
import CBL from "../assets/Images/CBLarge.png";
import CBLP from "../assets/Images/CardTransparent.png";
import Left from "../assets/Images/Arrow_Left.png";
import Right from "../assets/Images/Arrow_Right.png";
import Cross from "../assets/Images/Close.png";

const DeckContainers = ({
  enemyDeck,
  ourDeck,
  shouldRenderSlot,
  findCardParentIndex,
  fightResult,
  battleStats,
  hasCards,
  enemyHero,
  ourHero,
  isCardSearchModalOpen,
  setIsCardSearchModalOpen,
  setSelectedDeckTypeForCards,
  setEnemyDeck,
  setOurDeck,
  currentStats,
  isSkillsModalOpen,
  getCardSize,
  selectingFor,
  showSkillsList,
  isHeroSelectPanelOpen,
}) => {
  const getCardFrame = (tier, size) => {
    const frames = {
      Bronze: {
        small: BronzeSmall,
        medium: BronzeMedium,
        large: BronzeLarge,
      },
      Silver: {
        small: SilverSmall,
        medium: SilverMedium,
        large: SilverLarge,
      },
      Gold: {
        small: GoldSmall,
        medium: GoldMedium,
        large: GoldLarge,
      },
      Diamond: {
        small: DiamondSmall,
        medium: DiamondMedium,
        large: DiamondLarge,
      },
      Legendary: {
        small: LegendarySmall,
        medium: LegendaryMedium,
        large: LegendaryLarge,
      },
    };

    // Default to Bronze if tier is not found
    return (
      frames[tier]?.[size.toLowerCase()] || frames.Bronze[size.toLowerCase()]
    );
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

  return (
    <div className="flex flex-col gap-4 mt-[95px] ml-[240px]">
      {/* Deck Containers */}
      <div
        className="w-full max-w-6xl p-6 rounded-lg bg-no-repeat bg-cover -mt-20 -ml-0"
        style={{ backgroundColor: "transparent" }}
      >
        {["enemy", "our"].map((deckType, index) => (
          <div
            key={deckType}
            className={`w-full max-w-8xl p-6 rounded-lg ${
              index == 1 ? "mt-[5px]" : ""
            }`}
          >
            {/* Center-aligned Slots */}
            <div className="flex justify-center gap-2">
              {(deckType === "enemy" ? enemyDeck : ourDeck)
                .slice(0, 10)
                .map((card, index) => {
                  // Skip rendering slots 1 and 2 when deck is empty
                  if (
                    !shouldRenderSlot(
                      index,
                      deckType === "enemy" ? enemyDeck : ourDeck
                    )
                  ) {
                    return null;
                  }

                  // Skip rendering merged slots that follow a card
                  if (card === "merged") {
                    const prevIndex = findCardParentIndex(
                      deckType === "enemy" ? enemyDeck : ourDeck,
                      index
                    );
                    if (prevIndex >= 0 && prevIndex < index) {
                      return null;
                    }
                  }

                  // Get usage count for this card
                  const usageCount = fightResult
                    ? battleStats[deckType]?.Playmat?.Slots?.[index]?.Item
                        ?.Stats?.UsageStats?.TimesUsed || 0
                    : null;

                  return (
                    <div
                      key={index}
                      className={`${
                        index === 0 ? "card-twinkle" : ""
                      } relative flex items-center justify-center rounded-md transition-all duration-200 bg-center bg-cover group ${
                        card && card !== "merged"
                          ? "opacity-100" // Card slots at 100%
                          : index === 0 &&
                            !hasCards(
                              deckType === "enemy" ? enemyDeck : ourDeck
                            )
                          ? "opacity-100" // First slot of empty deck at 100%
                          : hasCards(deckType === "enemy" ? enemyDeck : ourDeck)
                          ? "opacity-20 hover:opacity-100" // Empty slots at 20% if deck has cards
                          : "opacity-0 hover:opacity-100"
                      }`}
                      style={{
                        width:
                          index === 0 &&
                          !hasCards(deckType === "enemy" ? enemyDeck : ourDeck)
                            ? "233px" // Large width for empty deck first slot (reduced by 10%)
                            : card && card.size === "medium"
                            ? "156px" // Medium width reduced by 10%
                            : card && card.size === "large"
                            ? "233px" // Large width reduced by 10%
                            : "82px", // Small width reduced by 10%
                        height: "156px", // Height reduced by 10%
                        backgroundImage:
                          index === 0 &&
                          !hasCards(deckType === "enemy" ? enemyDeck : ourDeck)
                            ? `url(${CBL})`
                            : `url(${NCB})`,
                      }}
                      onClick={() => {
                        if (!card) {
                          if (
                            (deckType === "enemy" && enemyHero === "Monster") ||
                            (deckType === "our" && ourHero === "Monster")
                          ) {
                            setIsCardSearchModalOpen(true);
                          }
                          setSelectedDeckTypeForCards({
                            deckType: deckType,
                            index: index,
                          });
                          setIsCardSearchModalOpen(true);
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
                            src={getCardFrame(card.tier, card.size)}
                            alt="frame"
                            className="absolute inset-0 w-full h-full pointer-events-none"
                          />
                          {/* Add tooltip */}
                          {card.attributes && (
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
                              <div className="font-bold mb-3.5 border-b border-gray-600 pb-1.75">
                                {card.name}
                              </div>
                              <div className="max-h-[525px] overflow-y-auto">
                                {/* Original attributes */}
                                {card.attributes?.map((attr, index) => (
                                  <div
                                    key={index}
                                    className="text-xs text-gray-300 mb-2.5 leading-3"
                                  >
                                    {attr}
                                  </div>
                                ))}

                                {/* Current Stats section */}
                                {currentStats[card.name] && (
                                  <>
                                    <div className="font-bold text-sm mt-3 mb-2 text-gray-200">
                                      Current Stats:
                                    </div>
                                    {Object.entries(currentStats[card.name])
                                      .filter(([_, value]) => value !== 0) // Only show non-zero values
                                      .map(([stat, value]) => {
                                        // Format the stat name and value based on special cases
                                        let displayStat = stat;
                                        let displayValue = value;

                                        // Handle time stats (internal/external)
                                        if (
                                          stat.includes("Internal") ||
                                          stat.includes("External")
                                        ) {
                                          // Remove 'Internal' or 'External' from the stat name
                                          displayStat = stat.replace(
                                            /(Internal|External)$/,
                                            ""
                                          );
                                          // Convert milliseconds to seconds for time stats
                                          displayValue =
                                            (value / 1000).toFixed(1) + "s";
                                        }
                                        // Handle MaxEnchantments case
                                        else if (stat === "MaxEnchantments") {
                                          displayStat = "Max Enchantments";
                                        }

                                        return (
                                          <div
                                            key={stat}
                                            className="text-xs text-gray-300 mb-1 flex justify-between"
                                          >
                                            <span>{displayStat}:</span>
                                            <span className="font-medium">
                                              {displayValue}
                                            </span>
                                          </div>
                                        );
                                      })}
                                  </>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Show card usage stats if available */}
                          {fightResult && (
                            <div className="absolute bottom-[10px] right-[5px] bg-black bg-opacity-70 text-white text-sm px-3.5 py-1.75 rounded-md z-10 flex flex-col items-end">
                              {(() => {
                                const entries = Object.entries(
                                  battleStats[deckType]?.Playmat?.Slots?.[index]
                                    ?.Item?.Stats?.UsageStats || {}
                                );
                                return entries.filter(
                                  ([_, value]) => value > 0
                                );
                              })().map(([statType, value]) => (
                                <div
                                  key={statType}
                                  className="flex items-center gap-1.75"
                                >
                                  {statType.toLowerCase() === "timesused" ? (
                                    <>
                                      <span>×</span>
                                      <span className="font-bold">{value}</span>
                                    </>
                                  ) : (
                                    <>
                                      <img
                                        src={`/StatIcons/${statType.toLowerCase()}.png`}
                                        alt={statType}
                                        className="w-7 h-7"
                                        onError={(e) => {
                                          console.log(
                                            `Failed to load icon for ${statType}`
                                          );
                                          e.target.style.display = "none";
                                        }}
                                      />
                                      <span className="font-bold">{value}</span>
                                    </>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="absolute top-0 left-0 right-0 flex justify-between px-1.75 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              className="h-6 w-6 bg-cover bg-center mt-16 ml-2"
                              style={{ backgroundImage: `url(${Left})` }}
                              onClick={(e) => {
                                e.stopPropagation();
                                moveCardLeft(deckType, index);
                              }}
                            />
                            <button
                              className="h-6 w-6 bg-cover bg-center mt-16 mr-2"
                              style={{ backgroundImage: `url(${Right})` }}
                              onClick={(e) => {
                                e.stopPropagation();
                                moveCardRight(deckType, index);
                              }}
                            />
                          </div>
                          <div className="absolute top-[-7px] right-[-7px] opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              className="h-6 w-6 bg-cover bg-center"
                              style={{ backgroundImage: `url(${Cross})` }}
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteCard(deckType, index);
                              }}
                            />
                          </div>
                        </>
                      ) : card === "merged" ? (
                        <span className="text-gray-400">↔</span>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center relative group">
                          {!selectingFor &&
                            !isSkillsModalOpen &&
                            !showSkillsList &&
                            !isHeroSelectPanelOpen &&
                            !isCardSearchModalOpen && (
                              <>
                                <img
                                  src="/Icons/plus.svg"
                                  alt="Reset"
                                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 w-16 h-16 absolute"
                                />
                                {index == 0 ? (
                                  <img
                                    src={CBLP}
                                    alt="card"
                                    className="w-full h-full z-10 absolute"
                                  />
                                ) : (
                                  <></>
                                )}
                              </>
                            )}
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
    </div>
  );
};
export default DeckContainers;
