import { useState, useEffect } from "react";
import {
  Trash2,
  Plus,
  Trophy,
  XCircle,
  AlertCircle,
  Search,
  Swords,
} from "lucide-react";

// Import your images
import DBG from "../assets/Images/DeckBG.png";
import NCB from "../assets/Images/NCardBack.png";
import Cross from "../assets/Images/Close.png";
import SBG from "../assets/Images/SkillBG.png";
import SF from "../assets/Images/SFrame.png";
import MF from "../assets/Images/MFrame.png";
import LF from "../assets/Images/LFrame.png";
import SkillF from "../assets/Images/SkillFrame.png";
import NImg from "../assets/Images/NoImg.png";
import Left from "../assets/Images/Left_Gem.png";
import Right from "../assets/Images/Right_Gem.png";
import Del from "../assets/Images/Delete_Gem.png";

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
  const [ourHero, setOurHero] = useState("Vanessa");
  const [enemyHero, setEnemyHero] = useState("Dooley");
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
  const fetchHeroCards = async (hero, size) => {
    try {
      const response = await fetch(`/data/${hero.toLowerCase()}_${size}.json`);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      return data.Items.map((item) => ({
        name: item.Name,
        image: item.ImageUrl,
        size,
        attributes: item.Attributes,
      }));
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
    let deck = deckType === "enemy" ? enemyDeck : ourDeck;
    let setDeck = deckType === "enemy" ? setEnemyDeck : setOurDeck;
    let newDeck = [...deck];

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
    const ourFilteredDeck = ourDeck
      .filter((card) => card && card !== "merged")
      .map((card) => card.name);
    const enemyFilteredDeck = enemyDeck
      .filter((card) => card && card !== "merged")
      .map((card) => card.name);

    const battleData = {
      ourDeck: {
        hero: ourHero,
        cards: ourFilteredDeck,
        skills: ourSkills.map((skill) => skill.name),
      },
      enemyDeck: {
        hero: enemyHero,
        cards: enemyFilteredDeck,
        skills: enemySkills.map((skill) => skill.name),
      },
    };

    try {
      const result = "Defeat";

      const mockUsage = {
        enemy: {},
        our: {},
      };

      const mockDamage = {
        enemy: {},
        our: {},
      };

      enemyDeck.forEach((card, index) => {
        if (card && card !== "merged") {
          mockUsage.enemy[index] = Math.floor(Math.random() * 50);
          mockDamage.enemy[index] = Math.floor(Math.random() * 1000);
        }
      });

      ourDeck.forEach((card, index) => {
        if (card && card !== "merged") {
          mockUsage.our[index] = Math.floor(Math.random() * 50);
          mockDamage.our[index] = Math.floor(Math.random() * 1000);
        }
      });

      setCardUsage(mockUsage);
      setCardDamage(mockDamage);
      setFightResult(result);
    } catch (error) {
      console.error("Error during battle:", error);
      setFightResult("Error");
    }
  };
  const handleMonsterSelect = async (monsterName, type = "enemy") => {
    const monstersList = type === "enemy" ? monsters : ourMonsters;
    const monster = monstersList.find((m) => m.name === monsterName);

    if (!monster) return;

    // Set monster and skills
    if (type === "enemy") {
      setSelectedMonster(monster);
      const skillsToAdd = monster.skills
        .map((skillName) =>
          skills.find((s) => s.name.toLowerCase() === skillName.toLowerCase())
        )
        .filter((skill) => skill !== undefined);
      setEnemySkills(skillsToAdd);
    } else {
      setOurSelectedMonster(monster);
      const skillsToAdd = monster.skills
        .map((skillName) =>
          skills.find((s) => s.name.toLowerCase() === skillName.toLowerCase())
        )
        .filter((skill) => skill !== undefined);
      setOurSkills(skillsToAdd);
    }
    // Build deck with card data
    let newDeck = Array(10).fill(null);
    let currentIndex = 0;

    for (const item of monster.items) {
      if (currentIndex >= newDeck.length) break;

      const size = item.size.toLowerCase();
      const cardSize = size === "medium" ? 2 : size === "large" ? 3 : 1;

      if (currentIndex + cardSize <= newDeck.length) {
        // Fetch card data including attributes with correct size
        const cardData = await fetchCardData(item.name, size);

        if (cardData) {
          newDeck[currentIndex] = {
            name: item.name,
            size: size,
            image: cardData.image,
            attributes: cardData.attributes,
          };

          // Fill merged slots
          for (let i = 1; i < cardSize; i++) {
            newDeck[currentIndex + i] = "merged";
          }

          currentIndex += cardSize;
        } else {
          // Fallback if card data not found
          console.warn(`No card data found for: ${item.name} (${size})`);
          const sanitizedName = item.name
            .replace(/\s+/g, "")
            .replace(/'/g, "")
            .replace(/-/g, "");

          newDeck[currentIndex] = {
            name: item.name,
            size: size,
            image: `/items/${sanitizedName}.avif`,
            attributes: [], // Empty attributes if card data not found
          };

          // Fill merged slots even for fallback
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
  useEffect(() => {
    const fetchAllCards = async () => {
      const sizes = ["small", "medium", "large"];
      let cards = [];

      // Fetch hero cards
      const heroes = ["vanessa", "pygmalien", "dooley"];
      for (const hero of heroes) {
        for (const size of sizes) {
          try {
            const response = await fetch(`/data/${hero}_${size}.json`);
            if (!response.ok) continue;
            const data = await response.json();
            const processedCards = data.Items.map((item) => ({
              name: item.Name,
              image: item.ImageUrl,
              size,
              attributes: item.Attributes,
              hero: hero.charAt(0).toUpperCase() + hero.slice(1),
            }));
            cards = [...cards, ...processedCards];
          } catch (error) {
            console.error(`Error loading ${hero}_${size}.json:`, error);
          }
        }
      }

      // Fetch monster cards
      for (const size of sizes) {
        try {
          const response = await fetch(`/data/monsters_${size}.json`);
          if (!response.ok) continue;
          const data = await response.json();
          const processedCards = data.Items.map((item) => ({
            name: item.Name,
            image: item.ImageUrl,
            size,
            attributes: item.Attributes,
            hero: "Monster", // Set hero as "Monster" for monster cards
          }));
          cards = [...cards, ...processedCards];
        } catch (error) {
          console.error(`Error loading monster_${size}.json:`, error);
        }
      }

      setAllCards(cards);
    };

    fetchAllCards();
  }, []);

  return (
    <>
      <div
        className="w-full max-w-6xl mx-auto flex flex-col gap-8 p-6 bg-cover bg-center mt-10 z-10"
        style={{
          backgroundImage: `url(${DBG})`,
        }}
      >
        {/* Enemy Section */}
        <div className="flex items-center justify-between  p-6 rounded-xl mt-[-4] relative">
          {/* Left Side - Chest */}
          <div className="flex-none">
            <button
              className="w-36 h-36 transition-all flex items-center justify-center absolute top-[65px] left-[35px]"
              onClick={() => handleOpenChest("enemy")}
            >
              <img
                src="/src/assets/Images/Chest.png"
                alt="Chest"
                className="w-36 h-36 "
              />
            </button>
          </div>

          {/* Skills Section */}
          <div className="flex flex-col gap-2 absolute top-[35px] left-[245px]">
            {/* Top row with two skill buttons */}
            <div className="flex gap-11 ml-6 mt-10">
              {" "}
              {/* Changed gap-4 to gap-8 */}
              {enemySkills.length > 0 ? (
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#B1714B]">
                  <img
                    src={enemySkills[0].image}
                    alt={enemySkills[0].name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <button
                  onClick={() => handleAddSkill("enemy")}
                  className="w-14 h-14 rounded-full bg-[#804A2B] hover:bg-[#905A3B] flex items-center justify-center"
                >
                  <Plus size={24} className="text-white" />
                </button>
              )}
              {enemySkills.length > 1 ? (
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#B1714B]">
                  {" "}
                  {/* Removed ml-4 */}
                  <img
                    src={enemySkills[1].image}
                    alt={enemySkills[1].name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <button
                  onClick={() => handleAddSkill("enemy")}
                  className="w-14 h-14 rounded-full bg-[#804A2B] hover:bg-[#905A3B] flex items-center justify-center"
                >
                  <Plus size={24} className="text-white" />
                </button>
              )}
            </div>

            {/* Bottom row with view skills button */}
            <div className="flex justify-center ml-6 mb-2 ">
              <button
                onClick={() => setShowSkillsList("enemy")}
                className="w-14 h-14 rounded-full bg-[#804A2B] hover:bg-[#905A3B] flex items-center justify-center relative"
                title="View All Skills"
              >
                {enemySkills.length > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {enemySkills.length}
                  </div>
                )}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Character Portrait */}
          <div className="flex-none ml-11 mt-4 absolute top-[45px] left-[40%]">
            <div
              className="w-32 h-32 rounded-full cursor-pointer border-4 border-[#B1714B] overflow-hidden"
              onClick={() => {
                setSelectingFor("enemy");
                setIsHeroSelectPanelOpen(true);
              }}
            >
              <img
                src={`/Monster_Textures/${enemyHero}${
                  enemyHero === "Monster" && selectedMonster
                    ? `_${selectedMonster.name}`
                    : ""
                }.avif`}
                alt={enemyHero}
                className="w-full h-full object-cover"
                onError={(e) => (e.target.src = NImg)}
              />
            </div>
          </div>

          {/* Info Section */}
          <div className="flex-grow ml-8  rounded-lg p-4 min-h-[96px] max-w-md">
            {fightResult && (
              <div className="text-white">
                <h3 className="font-semibold mb-2">Battle Status</h3>
                <p>{fightResult === "Victory" ? "Defeated!" : "Victory!"}</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4 mt-[125px]">
          {/* Deck Containers */}
          <div
            className="w-full max-w-6xl p-6 rounded-lg bg-no-repeat bg-cover -mt-20 -ml-0"
            style={{ backgroundColor: "transparent" }}
          >
            {["enemy", "our"].map((deckType, index) => (
              <div key={deckType} className={`w-full max-w-6xl p-6 rounded-lg ${index == 1 ? "mt-[75px]" : ""}`}>
                {/* Center-aligned Slots */}
                {/* Center-aligned Slots */}
                <div className="flex justify-center gap-2">
                  {(deckType === "enemy" ? enemyDeck : ourDeck)
                    .slice(0, 10)
                    .map((card, index) => {
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
                          className="relative flex items-center justify-center rounded-md transition-all duration-200 bg-center bg-cover group"
                          style={{
                          width:
                            card && card.size === "medium"
                            ? "160px"
                            : card && card.size === "large"
                            ? "240px"
                            : "80px",
                          height: "120px",
                          backgroundImage: `url(${NCB})`,
                          }}
                          onClick={() => {
                          if (
                            !card &&
                            !(
                            (deckType === "enemy" &&
                              enemyHero === "Monster") ||
                            (deckType === "our" && ourHero === "Monster")
                            )
                          ) {
                            setSelectingFor({ deckType, index });
                            setSelectingSize(null);
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
                            src={
                              card.size === "medium"
                              ? MF
                              : card.size === "large"
                              ? LF
                              : SF
                            }
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
                          <div className="w-full h-full flex flex-col items-center justify-center relative">
                            {!selectingFor && !isSkillsModalOpen && !showSkillsList && !isHeroSelectPanelOpen && !isCardSearchModalOpen && (
                            <>
                              <div className="absolute inset-0 bg-gray-500/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-md"></div>
                              <Plus
                              size={70}
                              className="text-[#f9f3e8] opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                              />
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
        <div className="flex items-center justify-between p-6 rounded-xl mt-3 relative h-[210px]">
          {/* Left Side - Chest */}
          <div className="flex-none">
            <button
              className="w-36 h-36 transition-all flex items-center justify-center absolute bottom-[85px] left-[40px]"
              onClick={() => handleOpenChest("our")}
            >
              <img
                src="/src/assets/Images/Chest.png"
                alt="Chest"
                className="w-36 h-36 transform scale-y-[-1]"
              />
            </button>
          </div>

          {/* Skills Section */}
          <div className="flex flex-col gap-2 absolute bottom-[85px] left-[250px]">
            {/* Top row with view skills button */}
            <div className="flex justify-center ml-6 mt-10">
              <button
                onClick={() => setShowSkillsList("our")}
                className="w-14 h-14 rounded-full bg-[#804A2B] hover:bg-[#905A3B] flex items-center justify-center relative"
                title="View All Skills"
              >
                {ourSkills.length > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {ourSkills.length}
                  </div>
                )}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              </button>
            </div>

            {/* Bottom row with two skill buttons */}
            <div className="flex gap-11 ml-6 mb-2">
              {ourSkills.length > 0 ? (
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#B1714B]">
                  <img
                    src={ourSkills[0].image}
                    alt={ourSkills[0].name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <button
                  onClick={() => handleAddSkill("our")}
                  className="w-14 h-14 rounded-full bg-[#804A2B] hover:bg-[#905A3B] flex items-center justify-center"
                >
                  <Plus size={24} className="text-white" />
                </button>
              )}

              {ourSkills.length > 1 ? (
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#B1714B]">
                  <img
                    src={ourSkills[1].image}
                    alt={ourSkills[1].name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <button
                  onClick={() => handleAddSkill("our")}
                  className="w-14 h-14 rounded-full bg-[#804A2B] hover:bg-[#905A3B] flex items-center justify-center"
                >
                  <Plus size={24} className="text-white" />
                </button>
              )}
            </div>
          </div>

          {/* Character Portrait */}
          <div className="flex-none ml-11 mt-4 absolute bottom-[85px] left-[40%]">
            <div
              className="w-32 h-32 rounded-full cursor-pointer border-4 border-[#B1714B] overflow-hidden"
              onClick={() => {
                setSelectingFor("our");
                setIsHeroSelectPanelOpen(true);
              }}
            >
              <img
                src={`/Monster_Textures/${ourHero}${
                  ourHero === "Monster" && ourSelectedMonster
                    ? `_${ourSelectedMonster.name}`
                    : ""
                }.avif`}
                alt={ourHero}
                className="w-full h-full object-cover"
                onError={(e) => (e.target.src = NImg)}
              />
            </div>
          </div>

          {/* Info Section */}
          <div className="flex-grow ml-8 rounded-lg p-4 min-h-[96px] max-w-md">
            {fightResult && (
              <div className="text-white">
                <h3 className="font-semibold mb-2">Battle Status</h3>
                <p>{fightResult === "Victory" ? "Victory!" : "Defeated!"}</p>
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
                      className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-600"
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
          <div
            className="bg-gray-800 p-6 rounded-lg shadow-xl w-[600px] h-[80vh] relative bg-cover bg-center flex flex-col"
            style={{ backgroundImage: `url(${SBG})` }}
          >
            <button
              className="absolute top-3 right-3 w-10 h-10 text-white p-2 rounded bg-cover bg-center"
              style={{ backgroundImage: `url(${Cross})` }}
              onClick={() => setIsSkillsModalOpen(false)}
            ></button>
            <div className="flex-none">
              <h3 className="text-white text-xl mb-4">Select a Skill</h3>
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search skills..."
                    value={skillSearchTerm}
                    onChange={(e) => setSkillSearchTerm(e.target.value)}
                    className="w-full p-2 pl-8 rounded b text-white"
                    style={{ backgroundColor: "#B1714B" }}
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
                    className="flex flex-col p-3  rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
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
      <div className="p-4">
        <div className="p-6 flex space-x-4">
          <button
            onClick={async () => {
              await handleFight();
            }}
            className="text-white w-14 h-14 border border-black rounded-md 
                shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),inset_0_-1px_2px_rgba(0,0,0,0.3),0_2px_4px_rgba(0,0,0,0.3)] 
                transition-all duration-300 bg-black/20 backdrop-blur-md hover:opacity-70 
                active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3),inset_0_-1px_2px_rgba(255,255,255,0.3)]
                flex items-center justify-center"
          >
            <Swords size={24} />
          </button>

          <button
            onClick={() => {
              setEnemyDeck(Array(10).fill(null));
              setOurDeck(Array(10).fill(null));
              setEnemySkills([]);
              setOurSkills([]);
              setFightResult(null);
              // Reset selected monster when clearing
              setSelectedMonster(null);
              setOurSelectedMonster(null);
            }}
            className="text-white w-14 h-14 border border-black rounded-md 
                shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),inset_0_-1px_2px_rgba(0,0,0,0.3),0_2px_4px_rgba(0,0,0,0.3)] 
                transition-all duration-300 bg-black/20 backdrop-blur-md hover:opacity-70 
                active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3),inset_0_-1px_2px_rgba(255,255,255,0.3)]
                flex items-center justify-center"
          >
            <Trash2 size={24} />
          </button>
        </div>
      </div>
      {/* Hero Selection Panel */}
      {isHeroSelectPanelOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-[#B1714B] p-6 rounded-lg shadow-xl w-[800px] max-h-[80vh] relative flex flex-col">
            <button
              className="absolute top-3 right-3 w-10 h-10 bg-cover bg-center"
              style={{ backgroundImage: `url(${Cross})` }}
              onClick={() => setIsHeroSelectPanelOpen(false)}
            />

            <h3 className="text-xl font-semibold text-white mb-6">
              Select {selectingFor === "enemy" ? "Enemy" : "Your"} Character
            </h3>

            {/* Heroes Section */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {["Vanessa", "Pygmalien", "Dooley"].map((hero) => (
                <div
                  key={hero}
                  className="flex flex-col items-center p-4 bg-[#804A2B] rounded-lg cursor-pointer hover:bg-[#905A3B] transition-all"
                  onClick={() => {
                    if (selectingFor === "enemy") {
                      setEnemyHero(hero);
                    } else {
                      setOurHero(hero);
                    }
                    setIsHeroSelectPanelOpen(false);
                  }}
                >
                  <img
                    src={`/Monster_Textures/${hero}.avif`}
                    alt={hero}
                    className="w-24 h-24 rounded-full mb-2 object-cover"
                    onError={(e) => (e.target.src = NImg)}
                  />
                  <span className="text-white font-medium">{hero}</span>
                </div>
              ))}
            </div>

            {/* Monster Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium text-white">Monsters</h4>
                <select
                  value={
                    selectingFor === "enemy" ? selectedDay : ourSelectedDay
                  }
                  onChange={(e) => {
                    const day = Number(e.target.value);
                    if (selectingFor === "enemy") {
                      setSelectedDay(day);
                      // Force monster list refresh
                      setMonsters([]);
                      if (enemyHero === "Monster") {
                        fetch(
                          `https://bazaarbrokerapi20250308232423-bjd2g3dbebcagpey.canadacentral-01.azurewebsites.net/monster-by-day/${day}`
                        )
                          .then((response) => response.json())
                          .then((data) => {
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
                            setMonsters(processedMonsters);
                          })
                          .catch((error) =>
                            console.error("Error fetching monsters:", error)
                          );
                      }
                    } else {
                      setOurSelectedDay(day);
                      // Force our monster list refresh
                      setOurMonsters([]);
                      if (ourHero === "Monster") {
                        fetch(
                          `https://bazaarbrokerapi20250308232423-bjd2g3dbebcagpey.canadacentral-01.azurewebsites.net/monster-by-day/${day}`
                        )
                          .then((response) => response.json())
                          .then((data) => {
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
                            setOurMonsters(processedMonsters);
                          })
                          .catch((error) =>
                            console.error("Error fetching our monsters:", error)
                          );
                      }
                    }
                  }}
                  className="bg-[#804A2B] text-white p-2 rounded-lg w-32"
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={day}>
                      Day {day}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4 overflow-y-auto max-h-[400px]">
                {(selectingFor === "enemy" ? monsters : ourMonsters).map(
                  (monster) => (
                    <div
                      key={monster.name}
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
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Skills List Modal */}
      {showSkillsList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-[#B1714B] p-6 rounded-lg shadow-xl w-[400px] max-h-[80vh] relative">
            <button
              className="absolute top-1 right-1 w-8 h-8 bg-cover bg-center transform translate-x-1/2 -translate-y-1/2"
              style={{ backgroundImage: `url(${Cross})` }}
              onClick={() => setShowSkillsList(null)}
            />

            <h3 className="text-xl font-semibold text-white mb-4 pr-8">
              {showSkillsList === "enemy" ? "Enemy" : "Our"} Skills
            </h3>

            <button
              onClick={() => {
                setSelectedDeckForSkills(showSkillsList);
                setIsSkillsModalOpen(true);
                setShowSkillsList(null); // Close the skills list panel
              }}
              className="mb-4 w-full p-3 bg-[#804A2B] hover:bg-[#905A3B] text-white rounded-lg flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Add New Skill
            </button>

            <div className="grid grid-cols-2 gap-4 overflow-y-auto max-h-[400px]">
              {(showSkillsList === "enemy" ? enemySkills : ourSkills).map(
                (skill, index) => (
                  <div
                    key={index}
                    className="relative flex items-center gap-2 bg-[#804A2B] p-2 rounded-lg"
                  >
                    <button
                      onClick={() => handleRemoveSkill(showSkillsList, index)}
                      className="absolute top-2 right-2 w-6 h-6 bg-cover bg-center transform translate-x-1/2 -translate-y-1/2 z-60"
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
                )
              )}
            </div>
          </div>
        </div>
      )}
      {/* Add this before the final closing tag */}
      {isCardSearchModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-[#B1714B] p-6 rounded-lg shadow-xl w-[800px] h-[80vh] relative flex flex-col">
            <button
              className="absolute top-3 right-3 w-10 h-10 bg-cover bg-center"
              style={{ backgroundImage: `url(${Cross})` }}
              onClick={() => setIsCardSearchModalOpen(false)}
            />

            <div className="sticky top-0 z-10 pb-4">
              <h3 className="text-xl font-semibold text-white mb-4">
                Add Cards
              </h3>
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
                .filter((card) =>
                  card.name.toLowerCase().includes(cardSearchTerm.toLowerCase())
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
                      const setDeck =
                        selectedDeckTypeForCards === "enemy"
                          ? setEnemyDeck
                          : setOurDeck;
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
