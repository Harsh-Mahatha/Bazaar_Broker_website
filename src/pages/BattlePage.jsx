import { useState, useEffect } from "react";
import { Trash2, Plus, Search, Swords } from "lucide-react";

// Import your images
import DBG from "../assets/Images/DeckBG.png";
import NCB from "../assets/Images/CardBack.png";
import CBL from "../assets/Images/CBLarge.png";
import CBLP from "../assets/Images/CardTransparent.png";
import Cross from "../assets/Images/Close.png";
import SkillF from "../assets/Images/SkillFrame.png";
import NImg from "../assets/Images/NoImg.png";
import Left from "../assets/Images/Left_Gem.png";
import Right from "../assets/Images/Right_Gem.png";
import Del from "../assets/Images/Delete_Gem.png";
import Circle from "../assets/Images/circle.png";
import BronzeSmall from "../assets/CardFrames/Bronze_Frame_Small.png";
import BronzeMedium from "../assets/CardFrames/Bronze_Frame_Medium.png";
import BronzeLarge from "../assets/CardFrames/Bronze_Frame_Big.png";
import SilverSmall from "../assets/CardFrames/Silver_Frame_Small.png";
import SilverMedium from "../assets/CardFrames/Silver_Frame_Medium.png";
import SilverLarge from "../assets/CardFrames/Silver_Frame_Big.png";
import GoldSmall from "../assets/CardFrames/Gold_Frame_Small.png";
import GoldMedium from "../assets/CardFrames/Gold_Frame_Medium.png";
import GoldLarge from "../assets/CardFrames/Gold_Frame_Big.png";
import DiamondSmall from "../assets/CardFrames/Diamond_Frame_Small.png";
import DiamondMedium from "../assets/CardFrames/Diamond_Frame_Medium.png";
import DiamondLarge from "../assets/CardFrames/Diamond_Frame_Big.png";
import LegendarySmall from "../assets/CardFrames/Legendary_Frame_Small.png";
import LegendaryMedium from "../assets/CardFrames/Legendary_Frame_Medium.png";
import LegendaryLarge from "../assets/CardFrames/Legendary_Frame_Big.png";

export default function BattlePage() {
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const [skills, setSkills] = useState([]);
  const [skillSearchTerm, setSkillSearchTerm] = useState("");
  const [ourSkills, setOurSkills] = useState([]);
  const [enemySkills, setEnemySkills] = useState([]);
  const [selectedDeckForSkills, setSelectedDeckForSkills] = useState(null);
  const [showSkillsList, setShowSkillsList] = useState(null); // 'enemy' or 'our' or null
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
  const [isHeroSelectPanelOpen, setIsHeroSelectPanelOpen] = useState(false);
  const [selectedDeckTypeForCards, setSelectedDeckTypeForCards] =
    useState(null);
  const [enemySelectionType, setEnemySelectionType] = useState(null);
  const [playerSelectionType, setPlayerSelectionType] = useState(null);
  const [allMonsters, setAllMonsters] = useState([]);
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
            `http://bazaarbroker-001-site1.ptempurl.com/monster-by-day/${i + 1}`
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
      }
    };

    fetchAllMonsters();
  }, []);

  // Add this after the imports

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
          setMonsters([]);
          return;
        }

        const response = await fetch(
          `http://bazaarbroker-001-site1.ptempurl.com/monster-by-day/${selectedDay}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          console.error("Invalid data format received:", data);
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
    if (index > 2) return true;
    if (index === 0 && isFirstThreeEmpty(deck)) return true;
    if (index < 3 && isFirstThreeEmpty(deck)) return false;
    return true;
  };

  // Our monsters fetch function
  useEffect(() => {
    const fetchOurMonsters = async () => {
      try {
        if (!ourSelectedDay || ourSelectedDay < 1 || ourSelectedDay > 10) {
          console.error("Invalid day selected:", ourSelectedDay);
          setOurMonsters([]);
          return;
        }

        const response = await fetch(
          `http://bazaarbroker-001-site1.ptempurl.com/monster-by-day/${ourSelectedDay}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          console.error("Invalid data format received:", data);
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
        setOurMonsters([]);
      }
    };

    if (ourHero === "Monster") {
      fetchOurMonsters();
    }
  }, [ourSelectedDay, ourHero]);
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

  const handleCardSelect = (index, deckType, card) => {
    setSelectedDeckTypeForCards(deckType);
    setIsCardSearchModalOpen(true);
    let deck = deckType === "enemy" ? enemyDeck : ourDeck;
    let setDeck = deckType === "enemy" ? setEnemyDeck : setOurDeck;
    let newDeck = [...deck];

    // If selecting in combined large slot area, reset all three slots to null first
    if (isFirstThreeEmpty(deck) && index === 0) {
      newDeck[0] = null;
      newDeck[1] = null;
      newDeck[2] = null;
    }

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
    // Check if both decks have at least one card
    if (!hasCards(ourDeck) || !hasCards(enemyDeck)) {
      setFightResult("Each deck must have at least one card to battle!");
      return;
    }
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

    // Prepare battle data in required format
    const battleData = {
      playerTop: {
        name:
          enemyHero === "Monster" && selectedMonster
            ? selectedMonster.name
            : enemyHero,
        isMonster: false,
        HP: selectedMonster ? selectedMonster.maxHealth : 100,
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
        HP: ourSelectedMonster ? ourSelectedMonster.maxHealth : 100,
        day: ourSelectedDay || 0,
        items: getItemsArray(ourDeck),
        skills: ourSkills.map((skill) => skill.name),
      },
    };
    console.log("Battle Data:", battleData);
    try {
      const response = await fetch(
        "http://bazaarbroker-001-site1.ptempurl.com/battle/run",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(battleData),
        }
      );

      if (!response.ok) {
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
      console.error("Error during battle:", error);
      setFightResult("Error: " + error.message);
      setBattleStats({ enemy: null, our: null, duration: null });
    }
  };
  const handleMonsterSelect = async (monsterName, type = "enemy") => {
    const monstersList = type === "enemy" ? monsters : ourMonsters;
    const monster = monstersList.find((m) => m.name === monsterName);

    if (!monster) return;

    // Set monster state first
    if (type === "enemy") {
      setSelectedMonster(monster);
      setEnemyHero("Monster");
    } else {
      setOurSelectedMonster(monster);
      setOurHero("Monster");
    }

    try {
      // Process monster skills
      let availableSkills = skills;
      if (!availableSkills || availableSkills.length === 0) {
        const response = await fetch("data/skills.json");
        if (!response.ok) throw new Error("Failed to load skills data");
        const data = await response.json();
        availableSkills = data;
        setSkills(data);
      }

      await new Promise((resolve) => setTimeout(resolve, 100));

      const monsterSkills = [];
      for (const skillName of monster.skills) {
        const foundSkill = availableSkills.find(
          (s) => s.name.toLowerCase() === skillName.toLowerCase()
        );
        if (foundSkill) monsterSkills.push(foundSkill);
      }

      // Set skills based on type
      if (type === "enemy") {
        setEnemySkills(monsterSkills);
      } else {
        setOurSkills(monsterSkills);
      }

      // Build deck preserving item positions
      let newDeck = Array(10).fill(null);
      let processedPositions = new Set(); // Keep track of processed positions

      for (let i = 0; i < monster.items.length; i++) {
        const item = monster.items[i];

        // Skip if position already processed or item is empty
        if (!item || item === "empty" || processedPositions.has(i)) {
          continue;
        }

        // Try to fetch card data
        const cardData = await fetchCardData(item.name, item.size);
        if (cardData) {
          const size = item.size?.toLowerCase() || "small";
          newDeck[i] = {
            name: item.name,
            size: size,
            image: `/items/${item.name.replace(/\s+/g, "")}.avif`,
            attributes: cardData.attributes,
            tier: cardData.tier,
          };

          // Mark slots as processed based on card size
          processedPositions.add(i);
          if (size === "medium") {
            processedPositions.add(i + 1);
            newDeck[i + 1] = "merged";
          } else if (size === "large") {
            processedPositions.add(i + 1);
            processedPositions.add(i + 2);
            newDeck[i + 1] = "merged";
            newDeck[i + 2] = "merged";
          }
        }
      }

      // Update the appropriate deck
      if (type === "enemy") {
        setEnemyDeck(newDeck);
      } else {
        setOurDeck(newDeck);
      }

      // Close the hero select panel
      setIsHeroSelectPanelOpen(false);
      setEnemySelectionType(null);
      setPlayerSelectionType(null);
      setSelectingFor(null);
    } catch (error) {
      console.error("Error in handleMonsterSelect:", error);
    }
  };
  const fetchCardData = async (cardName, size) => {
    if (!size) {
      console.error("Size not provided for card:", cardName);
      size = "small";
    }

    const tierTags = ["Bronze+", "Silver+", "Gold+", "Diamond+", "Legendary+"];

    // Try monster cards first
    try {
      const response = await fetch(`/data/monsters_${size}.json`);
      if (response.ok) {
        const data = await response.json();

        const item = data.Items.find((item) => item.Name === cardName);
        if (item) {
          // Extract tier from tags with "+" suffix
          const tier =
            item.Tags?.find((tag) => tierTags.includes(tag))?.replace(
              "+",
              ""
            ) || "Bronze";
          return {
            attributes: item.Attributes || [],
            name: item.Name,
            image: item.ImageUrl,
            tier: tier,
            size: size,
          };
        }
      }
    } catch (error) {
      console.error(`Error checking monsters_${size}.json:`, error);
    }

    // If not found in monsters, try hero cards
    const heroTypes = ["vanessa", "pygmalien", "dooley"];

    for (const hero of heroTypes) {
      try {
        const response = await fetch(`/data/${hero}_${size}.json`);
        if (!response.ok) continue;
        const data = await response.json();
        const item = data.Items.find((item) => item.Name === cardName);
        if (item) {
          // Extract tier from tags with "+" suffix
          const tier =
            item.Tags?.find((tag) => tierTags.includes(tag))?.replace(
              "+",
              ""
            ) || "Bronze";
          return {
            attributes: item.Attributes || [],
            name: item.Name,
            image: item.ImageUrl,
            tier: tier,
            size: size,
          };
        }
      } catch (error) {
        console.error(`Error checking ${hero}_${size}.json:`, error);
      }
    }

    console.warn(`Card not found: ${cardName} (size: ${size})`);
    return null;
  };

  useEffect(() => {
    const fetchAllCards = async () => {
      try {
        const response = await fetch(
          `http://bazaarbroker-001-site1.ptempurl.com/items`
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
            image: `/items/${cleanedName}.avif`,
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
      }
    };

    fetchAllCards();
  }, []);

  return (
    <>
      <div
        className="w-full max-w-[1651px] h-[922px] mx-auto flex flex-col gap-2 p-2 bg-cover bg-center mt-[-45px] z-10 overflow-x-hidden"
        style={{
          backgroundImage: `url(${DBG})`,
        }}
      >
        {/* Enemy Section */}
        <div className="flex items-center justify-between  p-6 rounded-xl mt-[-4] relative top-[35px] left-[300px]">
          {/* Left Side - Chest */}
          <div className="flex-none">
            <button
              className="w-36 h-32 transition-all flex items-center justify-center absolute top-[65px] left-[2px] group"
              onClick={() => handleOpenChest("enemy")}
            >
              <img src="/Chest.png" alt="Chest" className="w-36 h-36" />
            </button>
          </div>

          {/* Skills Section */}
          <div className="flex flex-col gap-2 absolute top-[30px] left-[192px]">
            {/* Top row with two skill buttons */}
            <div className="flex gap-8 ml-6 mt-10">
              {enemySkills.length > 0 ? (
                <div className="w-[58px] h-[58px] relative">
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
                <div className="w-[58px] h-[58px] relative">
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

          {/* Info Section */}
          <div className="flex-grow ml-[650px] mt-[30px] rounded-lg p-4 h-[120px] w-[200px] overflow-visible">
            {fightResult && battleStats.enemy ? (
              <div className="text-white h-full">
                <p className="mb-1 font-semibold">
                  {fightResult === "PlayerBottomWon"
                    ? "Defeated!"
                    : fightResult === "PlayerTopWon"
                    ? "Victory!"
                    : "Tie"}
                </p>
                <div className="text-sm">
                  <p className="mb-1">
                    HP: {Math.max(0, battleStats.enemy.CurrentStats.Health)}/
                    {battleStats.enemy.CurrentStats.MaxHealth}
                  </p>
                  <div>
                    {Object.entries(battleStats.enemy.DamageTotals)
                      .filter(([_, value]) => value > 0)
                      .map(([type, value]) => (
                        <p key={type} className="text-sm">
                          {type}: {value}
                        </p>
                      ))}
                  </div>
                  {battleStats.duration && (
                    <p className="mt-1 text-sm">
                      Duration: {battleStats.duration}s
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full"></div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4 mt-[110px] ml-[240px]">
          {/* Deck Containers */}
          <div
            className="w-full max-w-6xl p-6 rounded-lg bg-no-repeat bg-cover -mt-20 -ml-0"
            style={{ backgroundColor: "transparent" }}
          >
            {["enemy", "our"].map((deckType, index) => (
              <div
                key={deckType}
                className={`w-full max-w-8xl p-6 rounded-lg ${
                  index == 1 ? "mt-[30px]" : ""
                }`}
              >
                {/* Center-aligned Slots */}
                <div className="flex justify-center gap-2">
                  {(deckType === "enemy" ? enemyDeck : ourDeck)
                    .slice(0, 10)
                    .map((card, index) => {
                      // Skip rendering slots 1 and 2 when first three are empty
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
                          return null; // Don't render this merged slot separately
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
                            index == 0 ? "card-twinkle" : ""
                          } relative flex items-center justify-center rounded-md transition-all duration-200 bg-center bg-cover group ${
                            card && card !== "merged"
                              ? "opacity-100"
                              : isFirstThreeEmpty(
                                  deckType === "enemy" ? enemyDeck : ourDeck
                                ) && index === 0
                              ? "opacity-100" // Large card slot is always 100% opacity
                              : "opacity-0 hover:opacity-100"
                          }`}
                          style={{
                            width:
                              isFirstThreeEmpty(
                                deckType === "enemy" ? enemyDeck : ourDeck
                              ) && index === 0
                                ? "267.75px" // This is the width of a large slot
                                : card && card.size === "medium"
                                ? "182.07px"
                                : card && card.size === "large"
                                ? "267.75px"
                                : "87.82px",
                            height: "128.52px",
                            backgroundImage:
                              isFirstThreeEmpty(
                                deckType === "enemy" ? enemyDeck : ourDeck
                              ) && index === 0
                                ? `url(${CBL})`
                                : `url(${NCB})`,
                          }}
                          onClick={() => {
                            if (!card) {
                              if (
                                (deckType === "enemy" &&
                                  enemyHero === "Monster") ||
                                (deckType === "our" && ourHero === "Monster")
                              ) {
                                setIsCardSearchModalOpen(true);
                              }
                              setSelectedDeckTypeForCards(deckType);
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
                                              transition-opacity duration-200 z-50 pointer-events-none min-w-[300px] max-w-[400px]"
                                >
                                  <div className="font-bold mb-2 text-base border-b border-gray-600 pb-1">
                                    {card.name}
                                  </div>
                                  <div className="max-h-[300px] overflow-y-auto">
                                    {card.attributes?.map((attr, index) => (
                                      <div
                                        key={index}
                                        className="text-xs text-gray-300 mb-1.5 leading-relaxed"
                                      >
                                        {attr}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {fightResult && (
                                <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-md z-10 flex flex-col items-end">
                                  {(() => {
                                    const entries = Object.entries(
                                      battleStats[deckType]?.Playmat?.Slots?.[
                                        index
                                      ]?.Item?.Stats?.UsageStats || {}
                                    );
                                    ``;
                                    return entries.filter(
                                      ([_, value]) => value > 0
                                    ); // Only show non-zero stats
                                  })().map(([statType, value]) => (
                                    <div
                                      key={statType}
                                      className="flex items-center gap-1"
                                    >
                                      {statType.toLowerCase() ===
                                      "timesused" ? (
                                        <>
                                          <span>×</span>
                                          <span className="font-bold">
                                            {value}
                                          </span>
                                        </>
                                      ) : (
                                        <>
                                          <img
                                            src={`/StatIcons/${statType.toLowerCase()}.png`}
                                            alt={statType}
                                            className="w-4 h-4"
                                            onError={(e) => {
                                              console.log(
                                                `Failed to load icon for ${statType}`
                                              );
                                              e.target.style.display = "none";
                                            }}
                                          />
                                          <span className="font-bold">
                                            {value}
                                          </span>
                                        </>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}

                              {!(
                                (deckType === "enemy" &&
                                  enemyHero === "Monster") ||
                                (deckType === "our" && ourHero === "Monster")
                              ) && (
                                <>
                                  <div className="absolute top-0 left-0 right-0 flex justify-between px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      className="h-6 w-6 bg-cover bg-center mt-2"
                                      style={{
                                        backgroundImage: `url(${Left})`,
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        moveCardLeft(deckType, index);
                                      }}
                                    />
                                    <button
                                      className="h-6 w-6 bg-cover bg-center mt-2"
                                      style={{
                                        backgroundImage: `url(${Right})`,
                                      }}
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
                                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 w-16 h-16 absolute"
                                    />
                                    {index == 0 ? (
                                      <img
                                        src={CBLP}
                                        alt="card"
                                        className="w-full h-full z-0"
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
        {/* Player Section - Mirror of Enemy Section */}
        <div className="flex items-center justify-between p-6 rounded-xl mt-3 relative h-[210px] bottom-[79px] left-[300px]">
          {/* Left Side - Chest */}
          <div className="flex-none">
            <button
              className="w-36 h-36 transition-all flex items-center justify-center absolute bottom-[15px] left-[-2px]"
              onClick={() => handleOpenChest("our")}
            >
              <img
                src="/Chest.png"
                alt="Chest"
                className="w-36 h-36 transform scale-y-[-1]"
              />
            </button>
          </div>

          {/* Skills Section */}
          <div className="flex flex-col gap-2 absolute bottom-[20px] left-[191px]">
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
                <div className="w-[58px] h-[58px] relative">
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
                <div className="w-[58px] h-[58px] relative">
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

          {/* Info Section */}
          <div className="flex-grow ml-[650px] mb-[0px] rounded-lg p-4 h-[120px] w-[200px] overflow-visible">
            {fightResult && battleStats.our ? (
              <div className="text-white h-full">
                <p className="mb-1 font-semibold">
                  {fightResult === "PlayerBottomWon"
                    ? "Victory!"
                    : fightResult === "PlayerTopWon"
                    ? "Defeated!"
                    : "Tie"}
                </p>
                <div className="text-sm">
                  <p className="mb-1">
                    HP: {Math.max(0, battleStats.our.CurrentStats.Health)}/
                    {battleStats.our.CurrentStats.MaxHealth}
                  </p>
                  <div>
                    {Object.entries(battleStats.our.DamageTotals)
                      .filter(([_, value]) => value > 0)
                      .map(([type, value]) => (
                        <p key={type} className="text-sm">
                          {type}: {value}
                        </p>
                      ))}
                  </div>
                  {battleStats.duration && (
                    <p className="mt-1 text-sm">
                      Duration: {battleStats.duration}s
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full"></div>
            )}
          </div>
        </div>{" "}
      </div>
      {/* Card Selection Popup */}
      {selectingFor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
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
                      className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-[#905A3B]"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-[#B1714B] p-6 rounded-lg shadow-xl w-[600px] h-[80vh] relative flex flex-col">
            <button
              className="absolute top-1 right-1 w-10 h-10 bg-cover bg-center transform translate-x-1/2 -translate-y-1/2"
              style={{ backgroundImage: `url(${Cross})` }}
              onClick={() => setIsSkillsModalOpen(false)}
            ></button>
            <div className="flex-none">
              <h3 className="text-white text-xl mb-4">Select a Skill</h3>
              {/* Added total skill count display */}
              <div className="text-gray-300 text-sm mb-2">
                Total skills available: {filteredSkills.length}
              </div>
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search skills..."
                    value={skillSearchTerm}
                    onChange={(e) => setSkillSearchTerm(e.target.value)}
                    className="w-full p-2 pl-8 rounded text-white bg-[#804A2B]"
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
                    className="flex flex-col p-3 rounded-lg cursor-pointer hover:bg-[#905A3B]"
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
      <div className="relative bottom-[50px]">
        <div className="flex space-x-6">
          <div className="relative group">
            <button
              onClick={async () => {
                await handleFight();
              }}
              disabled={!hasCards(ourDeck) || !hasCards(enemyDeck)}
              className={`text-white w-14 h-14 border border-black rounded-md 
                          shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),inset_0_-1px_2px_rgba(0,0,0,0.3),0_2px_4px_rgba(0,0,0,0.3)] 
                          transition-all duration-300 cursor-pointer
                          ${
                            !hasCards(ourDeck) || !hasCards(enemyDeck)
                              ? "opacity-50 cursor-not-allowed pointer-events-none"
                              : "bg-gray-800/95 backdrop-blur-md hover:opacity-70 active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3),inset_0_-1px_2px_rgba(255,255,255,0.3)]"
                          }
                          inline-flex items-center justify-center p-0`}
            >
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src="/Icons/Battle_Style_A.svg"
                  alt="Battle"
                  className="w-10 h-10 pointer-events-none"
                />
              </div>
            </button>
            {(!hasCards(ourDeck) || !hasCards(enemyDeck)) && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800/95 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                You need to add at least one card before battling
              </div>
            )}
          </div>
        </div>
      </div>

      {isHeroSelectPanelOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-[#B1714B] p-6 rounded-lg shadow-xl w-[800px] h-[600px] relative flex flex-col">
            <button
              className="absolute top-1 right-1 w-10 h-10 bg-cover bg-center transform translate-x-1/2 -translate-y-1/2"
              style={{ backgroundImage: `url(${Cross})` }}
              onClick={() => {
                setIsHeroSelectPanelOpen(false);
                setEnemySelectionType(null);
                setPlayerSelectionType(null);
                setSelectingFor(null);
              }}
            />

            <h3 className="text-xl font-semibold text-white">Add Monster</h3>

            {/* Monster count */}
            <div className="text-gray-300 text-sm mb-4">
              Total monsters:{" "}
              {(selectingFor === "enemy" ? monsters : ourMonsters).length}
            </div>

            {/* Add search bar for monsters */}
            <div className="mb-4 flex gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full p-2 pl-8 rounded bg-[#804A2B] text-white"
                  onChange={(e) => {
                    const searchTerm = e.target.value.toLowerCase();
                    const filtered = allMonsters.filter((monster) =>
                      monster.name.toLowerCase().includes(searchTerm)
                    );
                    if (selectingFor === "enemy") {
                      setMonsters(filtered);
                    } else {
                      setOurMonsters(filtered);
                    }
                  }}
                />
                <Search className="absolute top-2.5 left-2 text-gray-400 h-5 w-5" />
              </div>
              <select
                className="bg-[#804A2B] text-white p-2 rounded-lg w-32"
                onChange={(e) => {
                  const day = Number(e.target.value);
                  const filtered = day
                    ? allMonsters.filter((monster) => monster.day === day)
                    : [...allMonsters];
                  if (selectingFor === "enemy") {
                    setMonsters(filtered);
                    setSelectedDay(day);
                  } else {
                    setOurMonsters(filtered);
                    setOurSelectedDay(day);
                  }
                }}
              >
                <option value="">All Days</option>
                {Array.from({ length: 10 }, (_, i) => i + 1).map((day) => (
                  <option key={day} value={day}>
                    Day {day}
                  </option>
                ))}
              </select>
            </div>

            {/* Monster Grid with fixed height and scroll */}
            <div className="grid grid-cols-3 gap-4 overflow-y-auto flex-1 pr-2">
              {(selectingFor === "enemy" ? monsters : ourMonsters).map(
                (monster) => (
                  <div
                    key={`${monster.name}-${monster.day}`}
                    className="flex items-center p-4 bg-[#804A2B] rounded-lg cursor-pointer hover:bg-[#905A3B] transition-all"
                    onClick={() => {
                      if (selectingFor === "enemy") {
                        setEnemyHero("Monster");
                        handleMonsterSelect(monster.name);
                      } else {
                        setOurHero("Monster");
                        handleMonsterSelect(monster.name, "our");
                      }
                      setIsHeroSelectPanelOpen(false);
                      setEnemySelectionType(null);
                      setPlayerSelectionType(null);
                      setSelectingFor(null);
                    }}
                  >
                    <img
                      src={`/Monster_Textures/${monster.name.replace(
                        /\s+/g,
                        ""
                      )}.avif`}
                      alt={monster.name}
                      className="w-16 h-16 rounded-full mr-4 object-cover"
                      onError={(e) => (e.target.src = NImg)}
                    />
                    <div>
                      <div className="text-white font-medium">
                        {monster.name}
                      </div>
                      <div className="text-gray-300 text-sm">
                        HP: {monster.maxHealth}
                        <br />
                        Day: {monster.day}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
      {/* Skills List Modal */}
      {showSkillsList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-[#B1714B] p-4 rounded-lg shadow-xl w-[450px] max-h-[100vh] relative">
            <button
              className="absolute top-1 right-1 w-8 h-8 bg-cover bg-center transform translate-x-1/2 -translate-y-1/2"
              style={{ backgroundImage: `url(${Cross})` }}
              onClick={() => setShowSkillsList(null)}
            />

            <h3 className="text-xl font-semibold text-white mb-4 pr-8">
              {showSkillsList === "enemy" ? "Enemy" : "Our"} Additional Skills
            </h3>

            <button
              onClick={() => {
                setSelectedDeckForSkills(showSkillsList);
                setIsSkillsModalOpen(true);
                setShowSkillsList(null); // Close the skills list panel
              }}
              className="mb-4 w-full p-4 bg-[#804A2B] hover:bg-[#905A3B] text-white rounded-lg group flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Add New Skill
            </button>

            <div className="grid grid-cols-2 gap-2 max-h-[400px]">
              {(showSkillsList === "enemy" ? enemySkills : ourSkills)
                .slice(2) // Skip the first two skills
                .map((skill, index) => (
                  <div
                    key={index}
                    className="relative flex items-center gap-2 bg-[#804A2B] p-2 rounded-lg group"
                  >
                    <button
                      onClick={() =>
                        handleRemoveSkill(showSkillsList, index + 2)
                      } // Add 2 to index since we sliced
                      className="absolute -top-2 -right-2 w-6 h-6 bg-cover bg-center z-10"
                      style={{ backgroundImage: `url(${Cross})` }}
                    />
                    <img
                      src={skill.image}
                      alt={skill.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="text-white">{skill.name}</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
      {/* Add this before the final closing tag */}
      {isCardSearchModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-[#B1714B] p-6 rounded-lg shadow-xl w-[800px] h-[80vh] relative flex flex-col">
            <button
              className="absolute top-1 right-1 w-10 h-10 bg-cover bg-center transform translate-x-1/2 -translate-y-1/2"
              style={{ backgroundImage: `url(${Cross})` }}
              onClick={() => setIsCardSearchModalOpen(false)}
            />

            <div className="sticky top-0 z-10 pb-4">
              <h3 className="text-xl font-semibold text-white mb-4">
                Add Cards
              </h3>
              <div className="text-gray-300 text-sm mb-2">
                Total cards available:{" "}
                {
                  allCards.filter((card) =>
                    card.name
                      .toLowerCase()
                      .includes(cardSearchTerm.toLowerCase())
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
                    card.name
                      .toLowerCase()
                      .includes(cardSearchTerm.toLowerCase())
                )
                .map((card, i) => (
                  <div
                    key={i}
                    className="flex flex-col p-3 rounded-lg cursor-pointer hover:bg-[#804A2B] transition-colors bg-[#8B4B2B] h-24"
                    onClick={() => {
                      const deck =
                        selectedDeckTypeForCards === "enemy"
                          ? enemyDeck
                          : ourDeck;
                      const emptySlot = deck.findIndex((slot) => slot === null);
                      if (emptySlot !== -1) {
                        handleCardSelect(
                          emptySlot,
                          selectedDeckTypeForCards,
                          card
                        );
                      }
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
                        <span className="text-white font-medium">
                          {card.name}
                        </span>
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
      )}
    </>
  );
}
