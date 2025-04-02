import { useState, useEffect } from "react";
import { Trash2, Plus, Search, Swords } from "lucide-react";

// Import your images
import DBG from "../assets/Images/DeckBG.png";
import NCB from "../assets/Images/CardBack.png";
import CBM from "../assets/Images/CBMed.png";
import CBL from "../assets/Images/CBLarge.png";
import Cross from "../assets/Images/Close.png";
import SkillF from "../assets/Images/SkillFrame.png";
import NImg from "../assets/Images/NoImg.png";
import Left from "../assets/Images/Left_Gem.png";
import Right from "../assets/Images/Right_Gem.png";
import Del from "../assets/Images/Delete_Gem.png";
import BronzeSmall from "../assets/CardFrames/Bronze_Frame_small.png";
import BronzeMedium from "../assets/CardFrames/Bronze_Frame_medium.png";
import BronzeLarge from "../assets/CardFrames/Bronze_Frame_Big.png";
import SilverSmall from "../assets/CardFrames/Silver_Frame_small.png";
import SilverMedium from "../assets/CardFrames/Silver_Frame_medium.png";
import SilverLarge from "../assets/CardFrames/Silver_Frame_Big.png";
import GoldSmall from "../assets/CardFrames/Gold_Frame_small.png";
import GoldMedium from "../assets/CardFrames/Gold_Frame_medium.png";
import GoldLarge from "../assets/CardFrames/Gold_Frame_Big.png";
import DiamondSmall from "../assets/CardFrames/Diamond_Frame_small.png";
import DiamondMedium from "../assets/CardFrames/Diamond_Frame_medium.png";
import DiamondLarge from "../assets/CardFrames/Diamond_Frame_Big.png";
import LegendarySmall from "../assets/CardFrames/Legendary_Frame_small.png";
import LegendaryMedium from "../assets/CardFrames/Legendary_Frame_medium.png";
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
  const [cardUsage, setCardUsage] = useState({ enemy: {}, our: {} });
  const [cardDamage, setCardDamage] = useState({ enemy: {}, our: {} });
  const [isCardSearchModalOpen, setIsCardSearchModalOpen] = useState(false);
  const [cardSearchTerm, setCardSearchTerm] = useState("");
  const [allCards, setAllCards] = useState([]);
  const [isHeroSelectPanelOpen, setIsHeroSelectPanelOpen] = useState(false);
  const [selectedDeckTypeForCards, setSelectedDeckTypeForCards] =
    useState(null);
  const [enemySelectionType, setEnemySelectionType] = useState(null);
  const [playerSelectionType, setPlayerSelectionType] = useState(null);
  const [allMonsters, setAllMonsters] = useState([]);

  // Add this useEffect to fetch all monsters
  useEffect(() => {
    const fetchAllMonsters = async () => {
      try {
        const monstersPromises = Array.from({ length: 10 }, (_, i) =>
          fetch(
            `https://bazaarbrokerapi20250308232423-bjd2g3dbebcagpey.canadacentral-01.azurewebsites.net/monster-by-day/${
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
                monster?.items?.map((item) => ({
                  name: item?.name || "Unknown Item",
                  size: item?.size?.toLowerCase() || "small",
                })) || [],
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
        console.log(`Found tier for ${item.Name}:`, tier);
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

  // Enemy monsters fetch function
  useEffect(() => {
    const fetchMonsters = async () => {
      try {
        // Add error handling for day validation
        if (!selectedDay || selectedDay < 1 || selectedDay > 10) {
          console.error("Invalid day selected:", selectedDay);
          setMonsters([]);
          return;
        }

        const response = await fetch(
          `https://bazaarbrokerapi20250308232423-bjd2g3dbebcagpey.canadacentral-01.azurewebsites.net/monster-by-day/${selectedDay}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Add data validation
        if (!Array.isArray(data)) {
          console.error("Invalid data format received:", data);
          setMonsters([]);
          return;
        }

        // Transform the monsters data according to new format
        const processedMonsters = data.map((monster) => ({
          name: monster?.monster || "Unknown",
          maxHealth: parseInt(monster?.health) || 0,
          items:
            monster?.items?.map((item) => ({
              name: item?.name || "Unknown Item",
              size: item?.size?.toLowerCase() || "small",
            })) || [],
          skills: monster?.skills || [],
        }));

        console.log("Processed monsters:", processedMonsters); // Debug log
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
          `https://bazaarbrokerapi20250308232423-bjd2g3dbebcagpey.canadacentral-01.azurewebsites.net/monster-by-day/${ourSelectedDay}`
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
          items:
            monster?.items?.map((item) => ({
              name: item?.name || "Unknown Item",
              size: item?.size?.toLowerCase() || "small",
            })) || [],
          skills: monster?.skills || [],
        }));

        console.log("Processed our monsters:", processedMonsters); // Debug log
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

    // Filter out null and merged slots
    const ourFilteredDeck = ourDeck.filter((card) => card && card !== "merged");
    const enemyFilteredDeck = enemyDeck.filter(
      (card) => card && card !== "merged"
    );

    // Prepare battle data in required format
    const battleData = {
      playerTop: {
        name:
          enemyHero === "Monster" && selectedMonster
            ? selectedMonster.name
            : enemyHero,
        HP: selectedMonster ? selectedMonster.maxHealth : 100,
        day: selectedDay || 0,
        items: enemyFilteredDeck.map((card) => card.name),
        skills: enemySkills.map((skill) => skill.name),
      },
      playerBottom: {
        name:
          ourHero === "Monster" && ourSelectedMonster
            ? ourSelectedMonster.name
            : ourHero,
        HP: ourSelectedMonster ? ourSelectedMonster.maxHealth : 100,
        day: ourSelectedDay || 0,
        items: ourFilteredDeck.map((card) => card.name),
        skills: ourSkills.map((skill) => skill.name),
      },
    };

    try {
      // Make POST request to battle API
      const response = await fetch(
        "https://bazaarbrokerapi20250308232423-bjd2g3dbebcagpey.canadacentral-01.azurewebsites.net/battle/run",
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

      // Process player (our) card usage and stats
      const ourUsage = {};
      const ourDamage = {};
      if (resultsData.Player?.Playmat?.Slots) {
        resultsData.Player.Playmat.Slots.forEach((slot, index) => {
          if (slot.IsOccupied) {
            ourUsage[index] = slot.Item.Stats.UsageStats.TimesUsed || 0;
            ourDamage[index] = slot.Item.Stats.UsageStats.Damage || 0;
          }
        });
      }

      // Process opponent (enemy) card usage and stats
      const enemyUsage = {};
      const enemyDamage = {};
      if (resultsData.Opponent?.Playmat?.Slots) {
        resultsData.Opponent.Playmat.Slots.forEach((slot, index) => {
          if (slot.IsOccupied) {
            enemyUsage[index] = slot.Item.Stats.UsageStats.TimesUsed || 0;
            enemyDamage[index] = slot.Item.Stats.UsageStats.Damage || 0;
          }
        });
      }

      // Update state with battle results
      setCardUsage({ enemy: enemyUsage, our: ourUsage });
      setCardDamage({ enemy: enemyDamage, our: ourDamage });
      console.log("Card Usage:", { enemy: enemyUsage, our: ourUsage });
      console.log("Card Damage:", { enemy: enemyDamage, our: ourDamage });
      setFightResult(resultsData.Result || "Unknown");

      // Save battle results data for debugging (optional)
      console.log("Battle Results Data:", resultsData);
    } catch (error) {
      console.error("Error during battle:", error);
      setFightResult("Error: " + error.message);
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
      // Load skills data first if not available
      let availableSkills = skills;
      if (!availableSkills || availableSkills.length === 0) {
        const response = await fetch("data/skills.json");
        if (!response.ok) throw new Error("Failed to load skills data");
        const data = await response.json();
        availableSkills = data;
        setSkills(data);
      }

      // Wait for skills data to be loaded
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Process monster skills
      const monsterSkills = [];
      for (const skillName of monster.skills) {
        const foundSkill = availableSkills.find(
          (s) => s.name.toLowerCase() === skillName.toLowerCase()
        );
        if (foundSkill) monsterSkills.push(foundSkill);
      }

      // Update skills state after ensuring we have the data
      if (type === "enemy") {
        setEnemySkills(monsterSkills);
      } else {
        setOurSkills(monsterSkills);
      }

      // Build deck with card data
      let newDeck = Array(10).fill(null);
      let currentIndex = 0;

      for (const item of monster.items) {
        if (currentIndex >= newDeck.length) break;

        const size = item.size.toLowerCase();
        const cardSize = size === "medium" ? 2 : size === "large" ? 3 : 1;

        if (currentIndex + cardSize <= newDeck.length) {
          const cardData = await fetchCardData(item.name, size);

          if (cardData) {
            newDeck[currentIndex] = {
              name: item.name,
              size: size,
              image: cardData.image,
              attributes: cardData.attributes,
            };

            for (let i = 1; i < cardSize; i++) {
              newDeck[currentIndex + i] = "merged";
            }

            currentIndex += cardSize;
          }
        }
      }

      // Update the appropriate deck
      if (type === "enemy") {
        setEnemyDeck(newDeck);
      } else {
        setOurDeck(newDeck);
      }
    } catch (error) {
      console.error("Error in handleMonsterSelect:", error);
    }
  };

  const fetchCardData = async (cardName, size) => {
    // Ensure size is provided and valid
    if (!size) {
      console.error("Size not provided for card:", cardName);
      size = "small";
    }

    // Try hero cards first
    const heroTypes = ["vanessa", "pygmalien", "dooley"];

    // Try hero card JSONs
    for (const hero of heroTypes) {
      try {
        const response = await fetch(`/data/${hero}_${size}.json`);
        if (!response.ok) continue;
        const data = await response.json();
        const item = data.Items.find((item) => item.Name === cardName);
        if (item) {
          return {
            attributes: item.Attributes || [],
            name: item.Name,
            image: item.ImageUrl,
          };
        }
      } catch (error) {
        console.error(`Error checking ${hero}_${size}.json:`, error);
      }
    }

    // Try monster cards with the correct size
    try {
      const response = await fetch(`/data/monsters_${size}.json`);
      if (response.ok) {
        const data = await response.json();
        const item = data.Items.find((item) => item.Name === cardName);
        if (item) {
          return {
            attributes: item.Attributes || [], // Only include Attributes, no Enchantments
            name: item.Name,
            image: item.ImageUrl,
          };
        }
      }
    } catch (error) {
      console.error(`Error checking monsters_${size}.json:`, error);
    }

    // If card not found in any JSON, return null
    console.warn(`Card not found: ${cardName} (size: ${size})`);
    return null;
  };
  // Add this with your other useEffect hooks
  // Replace the existing fetchAllCards useEffect with this new one
  useEffect(() => {
    const fetchAllCards = async () => {
      const sizes = ["small", "medium", "large"];
      let cards = [];

      // Only fetch Vanessa's cards
      for (const size of sizes) {
        try {
          const response = await fetch(`/data/vanessa_${size}.json`);
          if (!response.ok) continue;
          const data = await response.json();
          const processedCards = data.Items.map((item) => ({
            name: item.Name,
            image: item.ImageUrl,
            size,
            attributes: item.Attributes,
            hero: "Vanessa", // Set hero name explicitly
            tier:
              item.Tags?.find((tag) =>
                ["Bronze", "Silver", "Gold", "Diamond", "Legendary"].includes(
                  tag
                )
              ) || "Bronze",
          }));
          cards = [...cards, ...processedCards];
        } catch (error) {
          console.error(`Error loading vanessa_${size}.json:`, error);
        }
      }

      setAllCards(cards);
    };

    fetchAllCards();
  }, []);

  const renderCardStats = (card, index, deckType) => {
    if (!fightResult || !card || card === "merged") return null;

    return (
      <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-md z-10 flex flex-col items-end">
        <div className="flex items-center gap-1">
          <img
            src="/src/assets/StatIcons/Uses.png"
            alt="Uses"
            className="w-4 h-4"
          />
          <span className="font-bold">×{cardUsage[deckType][index] || 0}</span>
        </div>
        {cardDamage[deckType][index] > 0 && (
          <div className="flex items-center gap-1">
            <img
              src="/src/assets/StatIcons/damage.png"
              alt="Damage"
              className="w-4 h-4"
            />
            <span className="font-bold">{cardDamage[deckType][index]}</span>
          </div>
        )}
      </div>
    );
  };
  return (
    <>
      <div
        className="w-[1093px] h-[823px] mx-auto flex flex-col gap-2 p-2 bg-cover bg-center mt-[-6] z-10"
        style={{
          backgroundImage: `url(${DBG})`,
        }}
      >
        {/* Enemy Section */}
        <div className="flex items-center justify-between  p-6 rounded-xl mt-[-4] relative top-[35px] left-[15px]">
          {/* </div>Left Side - Chest */}
          <div className="flex-none">
            <button
              className="w-34 h-32 transition-all flex items-center justify-center absolute top-[26px] left-[80px] group"
              onClick={() => handleOpenChest("enemy")}
            >
              <img src="/Chest.png" alt="Chest" className="w-36 h-36" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <img
                  src="/Icons/plus.svg"
                  alt="Open Chest"
                  className="w-16 h-16"
                />
              </div>
            </button>
          </div>

          {/* Skills Section */}
          <div className="flex flex-col gap-2 absolute top-[-4px] left-[259px]">
            {/* Top row with two skill buttons */}
            <div className="flex gap-8 ml-6 mt-10">
              {enemySkills.length > 0 ? (
                <div className="w-[54px] h-[54px] relative">
                  <img
                    src={enemySkills[0].image}
                    alt={enemySkills[0].name}
                    className="w-[50px] h-[50px] object-cover rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  />
                  <img
                    src={SkillF}
                    alt="frame"
                    className="absolute inset-0 w-[54px] h-[54px] pointer-events-none"
                  />
                </div>
              ) : (
                <button
                  onClick={() => {
                    setSelectedDeckForSkills("enemy");
                    setIsSkillsModalOpen(true);
                  }}
                  className="w-[54px] h-[54px] rounded-full flex items-center justify-center bg-center bg-cover group"
                  style={{ backgroundImage: `url(${SkillF})` }}
                >
                  <img
                    src="/Icons/plus.svg"
                    alt="Reset"
                    className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </button>
              )}
              {enemySkills.length > 1 ? (
                <div className="w-[54px] h-[54px] relative">
                  <img
                    src={enemySkills[1].image}
                    alt={enemySkills[1].name}
                    className="w-[50px] h-[50px] object-cover rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  />
                  <img
                    src={SkillF}
                    alt="frame"
                    className="absolute inset-0 w-[54px] h-[54px] pointer-events-none"
                  />
                </div>
              ) : (
                <button
                  onClick={() => {
                    setSelectedDeckForSkills("enemy");
                    setIsSkillsModalOpen(true);
                  }}
                  className="w-[54px] h-[54px] rounded-full flex items-center justify-center bg-center bg-cover group"
                  style={{ backgroundImage: `url(${SkillF})` }}
                >
                  <img
                    src="/Icons/plus.svg"
                    alt="Reset"
                    className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
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
                className="w-[54px] h-[54px] rounded-full flex items-center justify-center bg-center bg-cover group"
                style={{ backgroundImage: `url(${SkillF})` }}
                title={
                  enemySkills.length >= 2 ? "View All Skills" : "Add Skill"
                }
              >
                {enemySkills.length > 0 && (
                  <div className="absolute top-[97px] right-[35px] bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {enemySkills.length}
                  </div>
                )}
                <img
                  src="/Icons/plus.svg"
                  alt="Add Skill"
                  className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </button>
            </div>
          </div>

          {/* Character Portrait */}
          <div className="flex-none ml-11 mt-4 absolute top-[15px] left-[416px]">
            <div
              className="w-32 h-32 rounded-full cursor-pointer border-4 border-[#B1714B] overflow-hidden relative group"
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
          <div className="flex-grow ml-8  rounded-lg p-4 min-h-[96px] max-w-md top-5">
            {fightResult && (
              <div className="text-white top-6">
                <h3 className="font-semibold mb-2">Battle Status</h3>
                <p>
                  {fightResult === "PlayerBottomWon"
                    ? "Defeated!"
                    : fightResult === "PlayerTopWon"
                    ? "Victory!"
                    : "Tie"}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4 mt-[122px] ml-[5px]">
          {/* Deck Containers */}
          <div
            className="w-full max-w-6xl p-6 rounded-lg bg-no-repeat bg-cover -mt-20 -ml-0"
            style={{ backgroundColor: "transparent" }}
          >
            {["enemy", "our"].map((deckType, index) => (
              <div
                key={deckType}
                className={`w-full max-w-6xl p-6 rounded-lg ${
                  index == 1 ? "mt-[28px]" : ""
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
                        ? (deckType === "enemy"
                            ? cardUsage.enemy[index]
                            : cardUsage.our[index]) || 0
                        : null;

                      return (
                        <div
                          key={index}
                          className={`relative flex items-center justify-center rounded-md transition-all duration-200 bg-center bg-cover group ${
                            card && card !== "merged"
                              ? "opacity-100"
                              : isFirstThreeEmpty(
                                  deckType === "enemy" ? enemyDeck : ourDeck
                                ) && index === 0
                              ? "opacity-100" // Large card slot is always 100% opacity
                              : "opacity-20 hover:opacity-100"
                          }`}
                          style={{
                            width:
                              isFirstThreeEmpty(
                                deckType === "enemy" ? enemyDeck : ourDeck
                              ) && index === 0
                                ? "240px" // This is the width of a large slot
                                : card && card.size === "medium"
                                ? "160px"
                                : card && card.size === "large"
                                ? "240px"
                                : "80px",
                            height: "120px",
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
                              {renderCardStats(card, index, deckType)}
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
                                  <img
                                    src="/Icons/plus.svg"
                                    alt="Reset"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 w-16 h-16"
                                  />
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
        <div className="flex items-center justify-between p-6 rounded-xl mt-3 relative h-[210px] bottom-[74px] left-[15px]">
          {/* Left Side - Chest */}
          <div className="flex-none">
            <button
              className="w-36 h-36 transition-all flex items-center justify-center absolute bottom-[-6px] left-[79px]"
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
          <div className="flex flex-col gap-2 absolute bottom-[6px] left-[255px]">
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
                className="w-[54px] h-[54px] rounded-full flex items-center justify-center bg-center bg-cover group"
                style={{ backgroundImage: `url(${SkillF})` }}
                title={ourSkills.length >= 2 ? "View All Skills" : "Add Skill"}
              >
                {ourSkills.length > 0 && (
                  <div className="absolute top-8 right-9 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {ourSkills.length}
                  </div>
                )}
                <img
                  src="/Icons/plus.svg"
                  alt="Add Skill"
                  className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </button>
            </div>

            {/* Bottom row with two skill buttons */}
            <div className="flex gap-9 ml-6 mb-2">
              {ourSkills.length > 0 ? (
                <div className="w-[54px] h-[54px] relative">
                  <img
                    src={ourSkills[0].image}
                    alt={ourSkills[0].name}
                    className="w-[50px] h-[50px] object-cover rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  />
                  <img
                    src={SkillF}
                    alt="frame"
                    className="absolute inset-0 w-[54px] h-[54px] pointer-events-none"
                  />
                </div>
              ) : (
                <button
                  onClick={() => {
                    setSelectedDeckForSkills("our");
                    setIsSkillsModalOpen(true);
                  }}
                  className="w-[54px] h-[54px] rounded-full flex items-center justify-center bg-center bg-cover group"
                  style={{ backgroundImage: `url(${SkillF})` }}
                >
                  <img
                    src="/Icons/plus.svg"
                    alt="Add Skill"
                    className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </button>
              )}

              {ourSkills.length > 1 ? (
                <div className="w-[54px] h-[54px] relative">
                  <img
                    src={ourSkills[1].image}
                    alt={ourSkills[1].name}
                    className="w-[50px] h-[50px] object-cover rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  />
                  <img
                    src={SkillF}
                    alt="frame"
                    className="absolute inset-0 w-[54px] h-[54px] pointer-events-none"
                  />
                </div>
              ) : (
                <button
                  onClick={() => {
                    setSelectedDeckForSkills("our");
                    setIsSkillsModalOpen(true);
                  }}
                  className="w-[54px] h-[54px] rounded-full flex items-center justify-center bg-center bg-cover group"
                  style={{ backgroundImage: `url(${SkillF})` }}
                >
                  <img
                    src="/Icons/plus.svg"
                    alt="Add Skill"
                    className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </button>
              )}
            </div>
          </div>

          {/* Character Portrait */}
          <div className="flex-none ml-11 mt-4 absolute bottom-[4px] left-[416px]">
            <div
              className="w-32 h-32 rounded-full cursor-pointer border-4 border-[#B1714B] overflow-hidden relative group"
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
          <div className="flex-grow ml-8 rounded-lg p-4 min-h-[96px] max-w-md">
            {fightResult && (
              <div className="text-white">
                <h3 className="font-semibold mb-2">Battle Status</h3>
                <p>
                  {fightResult === "PlayerBottomWon"
                    ? "Victory!"
                    : fightResult === "PlayerTopWon"
                    ? "Defeated!"
                    : "Tie"}
                </p>
              </div>
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
      <div className="">
        <div className="flex space-x-6">
          <button
            onClick={async () => {
              await handleFight();
            }}
            disabled={!hasCards(ourDeck) || !hasCards(enemyDeck)}
            className={`text-white w-14 h-14 border border-black rounded-md 
                  shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),inset_0_-1px_2px_rgba(0,0,0,0.3),0_2px_4px_rgba(0,0,0,0.3)] 
                  transition-all duration-300 
                  ${
                    !hasCards(ourDeck) || !hasCards(enemyDeck)
                      ? "opacity-50 cursor-not-allowed"
                      : "bg-black/20 backdrop-blur-md hover:opacity-70 active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3),inset_0_-1px_2px_rgba(255,255,255,0.3)]"
                  }
                  flex items-center justify-center`}
          >
            <img
              src="/Icons/Battle_Style_A.svg"
              alt="Battle"
              className="w-10 h-10"
            />
          </button>
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
                Add Vanessa Cards
              </h3>
              {/* Total Vanessa cards count */}
              <div className="text-gray-300 text-sm mb-2">
                Total cards available:{" "}
                {
                  allCards.filter(
                    (card) =>
                      card.hero === "Vanessa" &&
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
                    className="flex flex-col p-3 rounded-lg cursor-pointer hover:bg-[#804A2B] transition-colors bg-[#8B4B2B]"
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
