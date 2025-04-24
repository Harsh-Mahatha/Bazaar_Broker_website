import { useState, useEffect } from "react";
import DBG from "../assets/Images/DeckBG.png";
import Cross from "../assets/Images/Close.png";
import SkillF from "../assets/Images/SkillFrame.png";
import NImg from "../assets/Images/NoImg.png";
import Circle from "../assets/Images/circle.png";
import Rollbar from "rollbar";
import HealthModal from "../components/HealthModal";
import CardSearchModal from "../components/CardSearchModal";
import SkillsListModal from "../components/SkillsListModal";
import HeroSelectModal from "../components/HeroSelectModal";
import SkillsModal from "../components/SkillsModal";
import BattleButtons from "../components/BattleButtons";
import DeckContainers from "../components/DeckContainers";

const rollbar = new Rollbar({
  accessToken: "5dbb60afeba94802b88918f38b13bab2", 
  captureUncaught: true,
  captureUnhandledRejections: true,
  environment: process.env.NODE_ENV,
});

export default function BattlePage() {
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const [skills, setSkills] = useState([]);
  const [skillSearchTerm, setSkillSearchTerm] = useState("");
  const [ourSkills, setOurSkills] = useState([]);
  const [enemySkills, setEnemySkills] = useState([]);
  const [selectedDeckForSkills, setSelectedDeckForSkills] = useState(null);
  const [showSkillsList, setShowSkillsList] = useState(null); 
  const [enemyDeck, setEnemyDeck] = useState(Array(10).fill(null));
  const [ourDeck, setOurDeck] = useState(Array(10).fill(null));
  const [ourHero, setOurHero] = useState("Merchant");
  const [enemyHero, setEnemyHero] = useState("Merchant");
  const [selectingFor, setSelectingFor] = useState(null);
  const [availableCards, setAvailableCards] = useState([]);
  const [selectingSize, setSelectingSize] = useState(null);
  const [fightResult, setFightResult] = useState(null);
  const [selectedDay, setSelectedDay] = useState(1);
  const [monsters, setMonsters] = useState([]);
  const [selectedMonster, setSelectedMonster] = useState(null);
  const [ourSelectedDay, setOurSelectedDay] = useState(1);
  const [ourMonsters, setOurMonsters] = useState([]);
  const [ourSelectedMonster, setOurSelectedMonster] = useState(null);
  const [isCardSearchModalOpen, setIsCardSearchModalOpen] = useState(false);
  const [cardSearchTerm, setCardSearchTerm] = useState("");
  const [allCards, setAllCards] = useState([]);
  const [currentStats, setCurrentStats] = useState({});
  const [isHeroSelectPanelOpen, setIsHeroSelectPanelOpen] = useState(false);
  const [selectedDeckTypeForCards, setSelectedDeckTypeForCards] = useState(null);
  const [enemySelectionType, setEnemySelectionType] = useState(null);
  const [playerSelectionType, setPlayerSelectionType] = useState(null);
  const [allMonsters, setAllMonsters] = useState([]);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
  const [displayedEnemyHealth, setDisplayedEnemyHealth] = useState(250);
  const [displayedPlayerHealth, setDisplayedPlayerHealth] = useState(250);
  const [customEnemyHealth, setCustomEnemyHealth] = useState(250);
  const [customPlayerHealth, setCustomPlayerHealth] = useState(250);
  const [isProcessing, setIsProcessing] = useState(false);
  const [battleStats, setBattleStats] = useState({
    enemy: null,
    our: null,
    duration: null,
  });
  

  // Add this useEffect to fetch all monsters
  useEffect(() => {
    const fetchAllMonsters = async () => {
      try {
        const monstersPromises = Array.from({ length: 10 }, (_, i) =>
          fetch(
            `https://bazaarbroker-001-site1.ptempurl.com/monster-by-day/${
              i + 1
            }`
          ).then((res) => res.json())
        );

        const allDaysMonsters = await Promise.all(monstersPromises);
        const processedMonsters = allDaysMonsters.flatMap(
          (monsters, dayIndex) =>
            monsters.map((monster) => ({
              name: monster?.monster || "Unknown",
              maxHealth: parseInt(monster?.health) || 0,
              items:
                monster?.items?.map((item, index) => {
                  if (item === "empty") return null;
                  // If it's a valid item, return its data
                  return {
                    name: item?.name || "Unknown Item",
                    size: item?.size?.toLowerCase() || "small",
                    position: index, // Store original position
                  };
                }) || [],
              skills: monster?.skills || [],
              day: dayIndex + 1,
            }))
        );

        setAllMonsters(processedMonsters);
        setMonsters(processedMonsters);
        setOurMonsters(processedMonsters);
      } catch (error) {
        console.error("Error fetching all monsters:", error);
        rollbar.error("Error fetching all monsters:", error);
      }
    };

    fetchAllMonsters();
  }, []);

  const hasCards = (deck) => {
    return deck.some((card) => card && card !== "merged");
  };
  const fetchHeroCards = async (hero, size) => {
    try {
      const response = await fetch(`/data/${hero.toLowerCase()}_${size}.json`);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      const items = data.Items.map((item) => {
        const tier =
          item.Tags?.find((tag) =>
            ["Bronze", "Silver", "Gold", "Diamond", "Legendary"].includes(tag)
          ) || "Bronze";
        return {
          name: item.Name,
          image: item.ImageUrl,
          size,
          attributes: item.Attributes,
          tier,
        };
      });
      return items;
    } catch (error) {
      console.error(`Error loading ${size} cards for ${hero}:`, error);
      rollbar.error(`Error loading ${size} cards for ${hero}:`, error);
      return [];
    }
  };
  useEffect(() => {
    if (selectingSize && selectingFor) {
      loadHeroCards(selectingFor.deckType, selectingSize);
    }
  }, [selectingSize]);

  const handleHeroSelectOpen = (type) => {
    setIsHeroSelectPanelOpen(true);
    setSelectingFor(type);
    // Reset monsters list to show all monsters
    const allDaysMonsters = [...allMonsters];
    if (type === "enemy") {
      setMonsters(allDaysMonsters);
    } else {
      setOurMonsters(allDaysMonsters);
    }
  };

  useEffect(() => {
    setEnemyDeck(Array(10).fill(null));
    setEnemySkills([]); // Clear enemy skills when hero changes
  }, [enemyHero]);

  useEffect(() => {
    setOurDeck(Array(10).fill(null));
    setOurSkills([]); // Clear our skills when hero changes
  }, [ourHero]);

  const handleOpenChest = (deckType) => {
    // Implementation for chest opening functionality
    console.log(`Opening chest for ${deckType}`);
  };

  const processMonsterItems = (items) => {
    let processedItems = Array(10).fill(null);

    for (let i = 0; i < items.length && i < 10; i++) {
      const item = items[i];

      // Skip if empty slot or already processed as part of larger card
      if (item === "empty" || processedItems[i] === "merged") {
        continue;
      }

      if (item && item.name) {
        const size = item.size?.toLowerCase() || "small";
        const requiredSlots = size === "large" ? 3 : size === "medium" ? 2 : 1;

        // Skip if this is a duplicate entry for a multi-slot card
        const prevItem = i > 0 ? items[i - 1] : null;
        if (
          prevItem &&
          prevItem.name === item.name &&
          prevItem.size === item.size
        ) {
          continue; // Skip duplicate entries for multi-slot cards
        }

        // Place the card and mark merged slots
        if (i + requiredSlots <= 10) {
          processedItems[i] = {
            name: item.name,
            size: size,
            position: i,
          };

          // Mark merged slots
          if (size === "medium") {
            processedItems[i + 1] = "merged";
          } else if (size === "large") {
            processedItems[i + 1] = "merged";
            processedItems[i + 2] = "merged";
          }
        }
      }
    }

    return processedItems;
  };
  // Enemy monsters fetch function
  useEffect(() => {
    const fetchMonsters = async () => {
      try {
        if (!selectedDay || selectedDay < 1 || selectedDay > 10) {
          console.error("Invalid day selected:", selectedDay);
          rollbar.error("Invalid day selected:", selectedDay);
          setMonsters([]);
          return;
        }

        const response = await fetch(
          ` https://bazaarbroker-001-site1.ptempurl.com/monster-by-day/${selectedDay}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          console.error("Invalid data format received:", data);
          rollbar.error("Invalid data format received:", data);
          setMonsters([]);
          return;
        }

        const processedMonsters = data.map((monster) => ({
          name: monster?.monster || "Unknown",
          maxHealth: parseInt(monster?.health) || 0,
          items: processMonsterItems(monster?.items || []),
          skills: monster?.skills || [],
        }));

        console.log("Processed monsters:", processedMonsters);
        setMonsters(processedMonsters);
      } catch (error) {
        console.error("Error fetching monsters:", error);
        rollbar.error("Error fetching monsters:", error);
        setMonsters([]);
      }
    };

    if (enemyHero === "Monster") {
      fetchMonsters();
    }
  }, [selectedDay, enemyHero]);

  const isFirstThreeEmpty = (deck) => {
    return deck[0] === null && deck[1] === null && deck[2] === null;
  };

  const shouldRenderSlot = (index, deck) => {
    const isEmpty = !hasCards(deck);

    // If deck is empty and it's one of the first three slots (for large card)
    if (isEmpty && index < 3) {
      // Only render the first slot, hide slots 1 and 2
      return index === 0;
    }

    // If deck has cards, show all slots
    return true;
  };

  // Our monsters fetch function
  useEffect(() => {
    const fetchOurMonsters = async () => {
      try {
        if (!ourSelectedDay || ourSelectedDay < 1 || ourSelectedDay > 10) {
          console.error("Invalid day selected:", ourSelectedDay);
          rollbar.error("Invalid day selected:", ourSelectedDay);
          setOurMonsters([]);
          return;
        }

        const response = await fetch(
          ` https://bazaarbroker-001-site1.ptempurl.com/monster-by-day/${ourSelectedDay}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          console.error("Invalid data format received:", data);
          rollbar.error("Invalid data format received:", data);
          setOurMonsters([]);
          return;
        }

        const processedMonsters = data.map((monster) => ({
          name: monster?.monster || "Unknown",
          maxHealth: parseInt(monster?.health) || 0,
          items: processMonsterItems(monster?.items || []),
          skills: monster?.skills || [],
        }));

        console.log("Processed our monsters:", processedMonsters);
        setOurMonsters(processedMonsters);
      } catch (error) {
        console.error("Error fetching our monsters:", error);
        rollbar.error("Error fetching our monsters:", error);
        setOurMonsters([]);
      }
    };

    if (ourHero === "Monster") {
      fetchOurMonsters();
    }
  }, [ourSelectedDay, ourHero]);

  useEffect(() => {
    const fetchAllSkills = async () => {
      try {
        const response = await fetch(
          `https://bazaarbroker-001-site1.ptempurl.com/skills`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const processedSkills = data.map((skill) => {
          const cleanedName = skill.name.replace(/[^a-zA-Z0-9]/g, "");
          return {
            name: skill.name,
            image: `/Skills/${cleanedName}.avif`,
            effects: skill.effects || [],
          };
        });

        setSkills(processedSkills);
      } catch (error) {
        console.error("Error fetching skills from API:", error);
        rollbar.error("Error fetching skills from API:", error);
        setSkills([]);
      }
    };

    fetchAllSkills();
  }, []);

  useEffect(() => {
    let cards = document.querySelectorAll(".card-twinkle");
    for (let i = 0; i < cards.length; i++) {
      addTwinkleEffect(cards[i]);
    }
  }, []);

  const addTwinkleEffect = (card) => {
    const sizes = [1, 1, 2, 3, 4];

    function randomPosition(min, max) {
      //get random position between 1 - 100;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const body = card;
    for (let i = 0; i < 30; i++) {
      const top = randomPosition(1, 90);
      const left = randomPosition(1, 90);
      const random = Math.floor(Math.random() * sizes.length);
      const randomSize = sizes[random];
      const div = document.createElement("div");
      div.style.position = "absolute";
      div.style.top = top + "%";
      div.style.left = left + "%";
      div.style.height = randomSize + "px";
      div.style.width = randomSize + "px";
      div.style.backgroundColor = "#FFFFFF";
      div.style.borderRadius = "50%";
      if (i <= 5) {
        div.classList.add("star1");
      }
      if (i <= 10 && i > 5) {
        div.classList.add("star2");
      }
      if (i <= 15 && i > 10) {
        div.classList.add("star3");
      }
      if (i <= 20 && i > 15) {
        div.classList.add("star4");
      }
      if (i <= 25 && i > 20) {
        div.classList.add("star5");
      }
      if (i <= 30 && i > 25) {
        div.classList.add("star6");
      }
      body.appendChild(div);
    }
  };

  const loadHeroCards = async (deckType, size) => {
    const hero = deckType === "enemy" ? enemyHero : ourHero;
    const cards = await fetchHeroCards(hero, size);
    setAvailableCards(cards);
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
  useEffect(() => {
    const fetchAllCards = async () => {
      try {
        const response = await fetch(
          ` https://bazaarbroker-001-site1.ptempurl.com/items`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Process the data to match your card format
        const processedCards = data.map((item) => {
          // Extract tier from tags (Bronze+, Silver+, Gold+, Diamond+, Legendary+)
          const tierTag = item.tags.find((tag) =>
            ["Bronze+", "Silver+", "Gold+", "Diamond+", "Legendary+"].includes(
              tag
            )
          );
          const tier = tierTag ? tierTag.replace("+", "") : "Bronze";

          // Extract size from tags
          const sizeTag = item.tags.find((tag) =>
            ["Small", "Medium", "Large"].includes(tag)
          );
          const size = sizeTag ? sizeTag.toLowerCase() : "small";

          // Extract hero from tags
          const heroTag = item.tags.find((tag) =>
            [
              "Vanessa",
              "Pygmalien",
              "Mak",
              "Jules",
              "Stelle",
              "Dooley",
            ].includes(tag)
          );
          const hero = heroTag || "Unknown";

          const cleanedName = item.name.replace(/[^a-zA-Z0-9]/g, "");
          return {
            name: item.name,
            image: `/Items/${cleanedName}.avif`,
            size,
            attributes: item.attributes,
            hero,
            tier,
            tags: item.tags,
          };
        });

        setAllCards(processedCards);
      } catch (error) {
        console.error("Error fetching cards from API:", error);
        rollbar.error("Error fetching cards from API:", error);
      }
    };

    fetchAllCards();
  }, []);

  return (
    <>
      <div
        className="w-[1651px] h-[922px] mx-auto flex flex-col gap-2 p-2 bg-cover bg-center mt-[-45px] z-10 overflow-x-hidden"
        style={{
          backgroundImage: `url(${DBG})`,
        }}
      >
        {/* Enemy Section */}
        <div className="flex items-center justify-between  p-6 rounded-xl mt-[-4] relative top-[35px] left-[300px]">
          {/* Left Side - Chest */}
                <div className="flex-none">
                <button
                  className="w-36 h-32 transition-all flex items-center justify-center top-[32px] left-[-25px] group relative"
                  onClick={() => handleOpenChest("enemy")}
                >
                  <img src="/Chest.png" alt="Chest" className="w-36 h-36" />
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 
                      bg-gray-800/95 text-white text-sm rounded opacity-0 group-hover:opacity-100 
                      transition-opacity duration-200 z-50 pointer-events-none min-w-[150px]
                      border-2 border-gray-300/50
                      before:content-[''] before:absolute before:top-full before:left-1/2 
                      before:-translate-x-1/2 before:border-8 before:border-transparent 
                      before:border-t-gray-800/95
                      after:content-[''] after:absolute after:top-full after:left-1/2 
                      after:-translate-x-1/2 after:border-[8px] after:border-transparent 
                      after:border-t-gray-600/50 after:-mt-[1px]">
                  Coming Soon
                  </div>
                </button>
                </div>

                {/* Skills Section */}
          <div className="flex flex-col gap-0 absolute top-[33px] left-[192px]">
            {/* Top row with two skill buttons */}
            <div className="flex gap-8 ml-6 mt-10">
              {enemySkills.length > 0 ? (
                <div className="w-[58px] h-[58px] relative group">
                  <img
                    src={Circle}
                    alt="circle"
                    className="w-[65px] h-[65px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  />
                  <img
                    src={enemySkills[0].image}
                    alt={enemySkills[0].name}
                    className="w-[50px] h-[50px] object-cover rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  />
                  <img
                    src={SkillF}
                    alt="frame"
                    className="absolute inset-0 w-[60px] h-[60px] pointer-events-none"
                  />
                  {/* Tooltip */}

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
                    <div className="font-bold mb-1">{enemySkills[0].name}</div>
                    {enemySkills[0].effects && (
                      <div className="text-xs text-gray-300">
                        {enemySkills[0].effects}
                      </div>
                    )}
                  </div>
                  {/* Remove button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveSkill("enemy", 0);
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-cover bg-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    style={{ backgroundImage: `url(${Cross})` }}
                  />
                </div>
              ) : (
                <button
                  onClick={() => {
                    setSelectedDeckForSkills("enemy");
                    setIsSkillsModalOpen(true);
                  }}
                  className="w-[58px] h-[58px] rounded-full flex items-center justify-center bg-center bg-cover group relative"
                  style={{ backgroundImage: `url(${SkillF})` }}
                >
                  <img
                    src={Circle}
                    alt="circle"
                    className="w-[65px] h-[65px] absolute"
                  />
                  <img
                    src="/Icons/plus.svg"
                    alt="Reset"
                    className="w-10 h-10 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  />
                </button>
              )}
              {enemySkills.length > 1 ? (
                <div className="w-[58px] h-[58px] relative group">
                  <img
                    src={Circle}
                    alt="circle"
                    className="w-[65px] h-[65px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  />
                  <img
                    src={enemySkills[1].image}
                    alt={enemySkills[1].name}
                    className="w-[50px] h-[50px] object-cover rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  />
                  <img
                    src={SkillF}
                    alt="frame"
                    className="absolute inset-0 w-[60px] h-[60px] pointer-events-none"
                  />
                  {/* Tooltip */}
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
                    <div className="font-bold mb-1">{enemySkills[1].name}</div>
                    {enemySkills[1].effects && (
                      <div className="text-xs text-gray-300">
                        {enemySkills[1].effects}
                      </div>
                    )}
                  </div>
                  {/* Remove button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveSkill("enemy", 1);
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-cover bg-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    style={{ backgroundImage: `url(${Cross})` }}
                  />
                </div>
              ) : (
                <button
                  onClick={() => {
                    setSelectedDeckForSkills("enemy");
                    setIsSkillsModalOpen(true);
                  }}
                  className="w-[58px] h-[58px] rounded-full flex items-center justify-center bg-center bg-cover group relative"
                  style={{ backgroundImage: `url(${SkillF})` }}
                >
                  <img
                    src={Circle}
                    alt="circle"
                    className="w-[65px] h-[65px] absolute"
                  />
                  <img
                    src="/Icons/plus.svg"
                    alt="Reset"
                    className="w-10 h-10 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  />
                </button>
              )}
            </div>

            {/* Bottom row with view/add skills button */}
            <div className="flex justify-center ml-6 mb-2">
              <button
                onClick={() => {
                  if (enemySkills.length >= 2) {
                    setShowSkillsList("enemy");
                  } else {
                    setSelectedDeckForSkills("enemy");
                    setIsSkillsModalOpen(true);
                  }
                }}
                className="w-[58px] h-[58px] rounded-full flex items-center justify-center bg-center bg-cover group relative"
                style={{ backgroundImage: `url(${SkillF})` }}
                title={
                  enemySkills.length >= 2 ? "View All Skills" : "Add Skill"
                }
              >
                <img
                  src={Circle}
                  alt="circle"
                  className="w-[65px] h-[65px] absolute"
                />
                {enemySkills.length > 2 && (
                  <div className="absolute top-[-5px] right-[-8px] bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {enemySkills.length - 2}
                  </div>
                )}
                <img
                  src="/Icons/plus.svg"
                  alt="Add Skill"
                  className="w-10 h-10 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                />
              </button>
            </div>
          </div>

          {/* Character Portrait */}
          <div className="flex-none ml-11 mt-4 absolute top-[42px] left-[403px]">
            <div
              className="w-36 h-36 rounded-full cursor-pointer border-4 border-[#B1714B] overflow-hidden relative group"
              onClick={() => handleHeroSelectOpen("enemy")} // For enemy portrait
            >
              <img
                src={`/Monster_Textures/${
                  enemyHero === "Monster" && selectedMonster
                    ? selectedMonster.name.replace(/\s+/g, "")
                    : enemyHero
                }.avif`}
                alt={enemyHero}
                className="w-full h-full object-cover"
                onError={(e) => (e.target.src = NImg)}
              />
              {/* Plus icon overlay on hover */}
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <img src="/Icons/plus.svg" alt="Change" className="w-16 h-16" />
              </div>
            </div>
          </div>

          {/* Info Section for Enemy */}
          <div className="flex-grow ml-[650px] mt-[30px] rounded-lg p-4 h-[120px] w-[200px] overflow-visible">
            {isProcessing ? (
              <div className="text-white h-full">
                <p className="mb-1 font-semibold">Processing...</p>
              </div>
            ) : fightResult && battleStats.enemy ? (
              <div className="text-white h-full">
                <p className="mb-1 font-semibold">
                  {fightResult === "PlayerBottomWon"
                    ? "Defeated!"
                    : fightResult === "PlayerTopWon"
                    ? "Victory!"
                    : "Tie"}
                </p>
                <div className="text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <img
                      src="/StatIcons/health.png"
                      alt="HP"
                      className="w-4 h-4"
                    />
                    <p>
                      {Math.max(0, battleStats.enemy.CurrentStats.Health)}/
                      {battleStats.enemy.CurrentStats.MaxHealth}
                    </p>
                  </div>
                  <div>
                    {Object.entries(battleStats.enemy.DamageTotals)
                      .filter(([_, value]) => value > 0)
                      .map(([type, value]) => (
                        <div
                          key={type}
                          className="flex items-center gap-2 text-sm"
                        >
                          {type.toLowerCase() === "sandstorm" ? (
                            <img
                              src="/StatIcons/Sandstorm.png"
                              alt="Sandstorm"
                              className="w-4 h-4"
                              onError={(e) => {
                                console.log(`Failed to load sandstorm icon`);
                                e.target.style.display = "none";
                              }}
                            />
                          ) : (
                            <img
                              src={`/StatIcons/${type.toLowerCase()}.png`}
                              alt={type}
                              className="w-4 h-4"
                              onError={(e) => {
                                console.log(`Failed to load icon for ${type}`);
                                e.target.style.display = "none";
                              }}
                            />
                          )}
                          <span>{value}</span>
                        </div>
                      ))}
                  </div>
                  {battleStats.duration && (
                    <div className="flex items-center gap-2 mt-1 text-sm">
                      <img
                        src="/StatIcons/Duration.png"
                        alt="Duration"
                        className="w-4 h-4"
                      />
                      <span>{battleStats.duration}s</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-white h-full">
                <div className="flex items-center gap-2 mb-1">
                  <img
                    src="/StatIcons/health.png"
                    alt="HP"
                    className="w-6 h-6"
                  />
                  <p>
                    {displayedEnemyHealth}/{displayedEnemyHealth}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        <DeckContainers
          {...{
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
          }}
        />
        {/* Player Section - Mirror of Enemy Section */}
        <div className="flex items-center justify-between p-6 rounded-xl mt-3 relative h-[210px] bottom-[88px] left-[300px]">
          {/* Left Side - Chest */}
                <div className="flex-none">
                <button
                  className="w-36 h-36 transition-all flex items-center justify-center bottom-[-15px] left-[-25px] group relative"
                  onClick={() => handleOpenChest("our")}
                >
                  <img
                  src="/Chest.png"
                  alt="Chest"
                  className="w-36 h-36 transform scale-y-[-1]"
                  />
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 
                    bg-gray-800/95 text-white text-sm rounded opacity-0 group-hover:opacity-100 
                    transition-opacity duration-200 z-50 pointer-events-none min-w-[150px]
                    border-2 border-gray-300/50
                    before:content-[''] before:absolute before:top-full before:left-1/2 
                    before:-translate-x-1/2 before:border-8 before:border-transparent 
                    before:border-t-gray-800/95
                    after:content-[''] after:absolute after:top-full after:left-1/2 
                    after:-translate-x-1/2 after:border-[8px] after:border-transparent 
                    after:border-t-gray-600/50 after:-mt-[1px]">
                  Coming Soon
                  </div>
                </button>
                </div>

                {/* Skills Section */}
          <div className="flex flex-col gap-0 absolute bottom-[24px] left-[191px]">
            {/* Top row with view/add skills button */}
            <div className="flex justify-center ml-6 mt-10">
              <button
                onClick={() => {
                  if (ourSkills.length >= 2) {
                    setShowSkillsList("our");
                  } else {
                    setSelectedDeckForSkills("our");
                    setIsSkillsModalOpen(true);
                  }
                }}
                className="w-[58px] h-[58px] rounded-full flex items-center justify-center bg-center bg-cover group relative"
                style={{ backgroundImage: `url(${SkillF})` }}
                title={ourSkills.length >= 2 ? "View All Skills" : "Add Skill"}
              >
                <img
                  src={Circle}
                  alt="circle"
                  className="w-[65px] h-[65px] absolute"
                />
                {ourSkills.length > 2 && (
                  <div className="absolute bottom-[42px] right-[-9px] bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {ourSkills.length - 2}
                  </div>
                )}
                <img
                  src="/Icons/plus.svg"
                  alt="Add Skill"
                  className="w-10 h-10 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                />
              </button>
            </div>

            {/* Bottom row with two skill buttons */}
            <div className="flex gap-8 ml-6 mb-2">
              {ourSkills.length > 0 ? (
                <div className="w-[58px] h-[58px] relative group">
                  <img
                    src={Circle}
                    alt="circle"
                    className="w-[65px] h-[65px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  />
                  <img
                    src={ourSkills[0].image}
                    alt={ourSkills[0].name}
                    className="w-[50px] h-[50px] object-cover rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  />
                  <img
                    src={SkillF}
                    alt="frame"
                    className="absolute inset-0 w-[60px] h-[60px] pointer-events-none"
                  />
                  {/* Tooltip */}
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
                    <div className="font-bold mb-1">{ourSkills[0].name}</div>
                    {ourSkills[0].effects && (
                      <div className="text-xs text-gray-300">
                        {ourSkills[0].effects}
                      </div>
                    )}
                  </div>
                  {/* Remove button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveSkill("our", 0);
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-cover bg-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    style={{ backgroundImage: `url(${Cross})` }}
                  />
                </div>
              ) : (
                <button
                  onClick={() => {
                    setSelectedDeckForSkills("our");
                    setIsSkillsModalOpen(true);
                  }}
                  className="w-[58px] h-[58px] rounded-full flex items-center justify-center bg-center bg-cover group relative"
                  style={{ backgroundImage: `url(${SkillF})` }}
                >
                  <img
                    src={Circle}
                    alt="circle"
                    className="w-[65px] h-[65px] absolute"
                  />
                  <img
                    src="/Icons/plus.svg"
                    alt="Add Skill"
                    className="w-10 h-10 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  />
                </button>
              )}

              {ourSkills.length > 1 ? (
                <div className="w-[58px] h-[58px] relative group">
                  <img
                    src={Circle}
                    alt="circle"
                    className="w-[65px] h-[65px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  />
                  <img
                    src={ourSkills[1].image}
                    alt={ourSkills[1].name}
                    className="w-[50px] h-[50px] object-cover rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  />
                  <img
                    src={SkillF}
                    alt="frame"
                    className="absolute inset-0 w-[60px] h-[60px] pointer-events-none"
                  />
                  {/* Tooltip */}
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
                    <div className="font-bold mb-1">{ourSkills[1].name}</div>
                    {ourSkills[1].effects && (
                      <div className="text-xs text-gray-300">
                        {ourSkills[1].effects}
                      </div>
                    )}
                  </div>
                  {/* Remove button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveSkill("our", 1);
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-cover bg-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    style={{ backgroundImage: `url(${Cross})` }}
                  />
                </div>
              ) : (
                <button
                  onClick={() => {
                    setSelectedDeckForSkills("our");
                    setIsSkillsModalOpen(true);
                  }}
                  className="w-[58px] h-[58px] rounded-full flex items-center justify-center bg-center bg-cover group relative"
                  style={{ backgroundImage: `url(${SkillF})` }}
                >
                  <img
                    src={Circle}
                    alt="circle"
                    className="w-[65px] h-[65px] absolute"
                  />
                  <img
                    src="/Icons/plus.svg"
                    alt="Add Skill"
                    className="w-10 h-10 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  />
                </button>
              )}
            </div>
          </div>

          {/* Character Portrait */}
          <div className="flex-none ml-11 mt-4 absolute bottom-[15px] left-[403px]">
            <div
              className="w-36 h-36 rounded-full cursor-pointer border-4 border-[#B1714B] overflow-hidden relative group"
              onClick={() => handleHeroSelectOpen("our")} // For player portrait
            >
              <img
                src={`/Monster_Textures/${
                  ourHero === "Monster" && ourSelectedMonster
                    ? ourSelectedMonster.name.replace(/\s+/g, "")
                    : ourHero
                }.avif`}
                alt={ourHero}
                className="w-full h-full object-cover"
                onError={(e) => (e.target.src = NImg)}
              />
              {/* Plus icon overlay on hover */}
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <img src="/Icons/plus.svg" alt="Change" className="w-16 h-16" />
              </div>
            </div>
          </div>

          {/* Info Section for Player */}
          <div className="flex-grow ml-[650px] mb-[0px] rounded-lg p-4 h-[120px] w-[200px] overflow-visible">
            {isProcessing ? (
              <div className="text-white h-full">
                <p className="mb-1 font-semibold">Processing...</p>
              </div>
            ) : fightResult && battleStats.our ? (
              <div className="text-white h-full">
                <p className="mb-1 font-semibold">
                  {fightResult === "PlayerBottomWon"
                    ? "Victory!"
                    : fightResult === "PlayerTopWon"
                    ? "Defeated!"
                    : "Tie"}
                </p>
                <div className="text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <img
                      src="/StatIcons/health.png"
                      alt="HP"
                      className="w-4 h-4"
                    />
                    <p>
                      {Math.max(0, battleStats.our.CurrentStats.Health)}/
                      {battleStats.our.CurrentStats.MaxHealth}
                    </p>
                  </div>
                  <div>
                    {Object.entries(battleStats.our.DamageTotals)
                      .filter(([_, value]) => value > 0)
                      .map(([type, value]) => (
                        <div
                          key={type}
                          className="flex items-center gap-2 text-sm"
                        >
                          {type.toLowerCase() === "sandstorm" ? (
                            <img
                              src="/StatIcons/Sandstorm.png"
                              alt="Sandstorm"
                              className="w-4 h-4"
                              onError={(e) => {
                                console.log("Failed to load sandstorm icon");
                                e.target.style.display = "none";
                              }}
                            />
                          ) : (
                            <img
                              src={`/StatIcons/${type.toLowerCase()}.png`}
                              alt={type}
                              className="w-4 h-4"
                              onError={(e) => {
                                console.log(`Failed to load icon for ${type}`);
                                e.target.style.display = "none";
                              }}
                            />
                          )}
                          <span>{value}</span>
                        </div>
                      ))}
                  </div>
                  {battleStats.duration && (
                    <div className="flex items-center gap-2 mt-1 text-sm">
                      <img
                        src="/StatIcons/Duration.png"
                        alt="Duration"
                        className="w-4 h-4"
                      />
                      <span>{battleStats.duration}s</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-white h-full">
                <div className="flex items-center gap-2 mb-1">
                  <img
                    src="/StatIcons/health.png"
                    alt="HP"
                    className="w-6 h-6"
                  />
                  <p>
                    {displayedPlayerHealth}/{displayedPlayerHealth}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>{" "}
      </div>

      {isSkillsModalOpen && (
        <SkillsModal
          {...{
            setIsSkillsModalOpen,
            filteredSkills,
            skillSearchTerm,
            setSkillSearchTerm,
            selectedDeckForSkills,
            setOurSkills,
            setEnemySkills,
            ourSkills,
            enemySkills,
          }}
        />
      )}
      <BattleButtons
        {...{
          hasCards,
          setIsHealthModalOpen,
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
        }}
      />
      {/* Hero Selection Modal */}
      {isHeroSelectPanelOpen && (
        <HeroSelectModal
          {...{
            setIsHeroSelectPanelOpen,
            setEnemySelectionType,
            setPlayerSelectionType,
            setSelectingFor,
            selectingFor,
            allMonsters,
            setMonsters,
            setSelectedDay,
            selectedDay,
            setOurMonsters,
            setOurSelectedDay,
            ourSelectedDay,
            setEnemyHero,
            setOurHero,
            setDisplayedEnemyHealth,
            setCustomEnemyHealth,
            setDisplayedPlayerHealth,
            setCustomPlayerHealth,
            setSelectedMonster,
            setOurSelectedMonster,
            monsters,
            ourMonsters,
            skills,
            setSkills,
            rollbar,
            setEnemySkills,
            setOurSkills,
            setEnemyDeck,
            setOurDeck,
          }}
        />
      )}
      {/* Skills List Modal */}
      {showSkillsList && (
        <SkillsListModal
          {...{
            setShowSkillsList,
            showSkillsList,
            setSelectedDeckForSkills,
            setIsSkillsModalOpen,
            ourSkills,
            enemySkills,
            handleRemoveSkill,
          }}
        />
      )}
      {/* Card Search Modal */}
      {isCardSearchModalOpen && (
        <CardSearchModal
          {...{
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
          }}
        />
      )}
      {/* Health Modal */}
      {isHealthModalOpen && (
        <HealthModal
          {...{
            setIsHealthModalOpen,
            setCustomEnemyHealth,
            setCustomPlayerHealth,
            customEnemyHealth,
            customPlayerHealth,
            enemyHero,
            selectedMonster,
            ourHero,
            ourSelectedMonster,
            setDisplayedEnemyHealth,
            setDisplayedPlayerHealth,
          }}
        />
      )}
    </>
  );
}
