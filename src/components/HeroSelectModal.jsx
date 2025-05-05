import React from "react";
import { Search } from "lucide-react";
import Cross from "../assets/Images/Close.png";
import NImg from "../assets/Images/NoImg.png";
const apiUrl = import.meta.env.VITE_API_URL;
const HeroSelectModal = ({
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
}) => {
  // Function to handle monster selection
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

    if (type === "enemy") {
      setDisplayedEnemyHealth(monster.maxHealth);
      setCustomEnemyHealth(monster.maxHealth);
    } else {
      setDisplayedPlayerHealth(monster.maxHealth);
      setCustomPlayerHealth(monster.maxHealth);
    }

    try {
      // Process monster skills
      let availableSkills = skills;
      if (!availableSkills || availableSkills.length === 0) {
        const fetchAllSkills = async () => {
          try {
            const response = await fetch(`${apiUrl}/skills`);
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Fetched Skills Data:", data);
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
            image: `/Items/${item.name.replace(/\s+/g, "")}.avif`,
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
      rollbar.error("Error in handleMonsterSelect:", error);
    }
  };
  const fetchCardData = async (cardName, size) => {
    if (!size) {
      console.error("Size not provided for card:", cardName);
      rollbar.error("Size not provided for card:", cardName);
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
      rollbar.error(`Error checking monsters_${size}.json:`, error);
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
        rollbar.error(`Error checking ${hero}_${size}.json:`, error);
      }
    }

    console.warn(`Card not found: ${cardName} (size: ${size})`);
    return null;
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#B1714B] p-6 rounded-lg shadow-xl w-[800px] h-[700px] relative flex flex-col overflow-visible">
        <button
          className="absolute top-1 right-1 w-10 h-10 bg-cover bg-center transform translate-x-1/2 -translate-y-1/2"
          style={{ backgroundImage: `url(${Cross})` }}
          onClick={() => {
            setIsHeroSelectPanelOpen(false);
            setEnemySelectionType(null);
            setPlayerSelectionType(null);
            setSelectingFor(null);
            setSelectedDay(0);
            setOurSelectedDay(0);
          }}
        />

        {/* Scrollable container for all content */}
        <div className="flex flex-col h-full overflow-y-auto">
          <h3 className="text-xl font-semibold text-white mb-4 flex-none">
            Select Character
          </h3>

          {/* Merchant section */}
          <div className="mb-6 flex-none">
            <div
              className="flex items-center p-4 bg-[#804A2B] rounded-lg cursor-pointer hover:bg-[#905A3B] transition-all"
              onClick={() => {
                if (selectingFor === "enemy") {
                  setEnemyHero("Merchant");
                  setSelectedMonster(null);
                  setDisplayedEnemyHealth(250);
                  setCustomEnemyHealth(250);
                } else {
                  setOurHero("Merchant");
                  setOurSelectedMonster(null);
                  setDisplayedPlayerHealth(250);
                  setCustomPlayerHealth(250);
                }
                setIsHeroSelectPanelOpen(false);
                setEnemySelectionType(null);
                setPlayerSelectionType(null);
                setSelectingFor(null);
                setSelectedDay(0);
                setOurSelectedDay(0);
              }}
            >
              <img
                src="/Monster_Textures/Merchant.avif"
                alt="Merchant"
                className="w-16 h-16 rounded-full mr-4 object-cover"
                onError={(e) => (e.target.src = NImg)}
              />
              <div>
                <div className="text-white font-medium">Custom</div>
                <div className="text-gray-300 text-sm">Custom Deck Builder</div>
              </div>
            </div>
          </div>

          <div className="border-b border-[#804A2B] mb-6 flex-none" />

          {/* Monster section header */}
          <div className="flex-none">
            <h3 className="text-xl font-semibold text-white mb-4">
              Select Monster
            </h3>
            <div className="text-gray-300 text-sm mb-4">
              Total monsters:{" "}
              {(selectingFor === "enemy" ? monsters : ourMonsters).length}
            </div>
          </div>

          {/* Search and filter controls - Updated layout */}
          <div className="mb-6 flex-none">
            {/* Search bar - Full width */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search monsters..."
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
            </div>

            {/* Day filters - Below search bar */}
            <div className="w-full">
              <div className="text-white text-sm mb-2">Day:</div>
              <div className="flex flex-wrap gap-2">
                {/* All button */}
                <button
                  className={`h-10 px-4 rounded-full flex items-center justify-center transition-all
    ${
      (selectingFor === "enemy" ? !selectedDay : !ourSelectedDay)
        ? "bg-[#6B3D1F] text-white border-2 border-white shadow-lg"
        : "bg-[#804A2B] text-gray-300 hover:bg-[#905A3B] hover:text-white"
    }`}
                  onClick={() => {
                    const filtered = [...allMonsters];
                    if (selectingFor === "enemy") {
                      setMonsters(filtered);
                      setSelectedDay(0);
                    } else {
                      setOurMonsters(filtered);
                      setOurSelectedDay(0);
                    }
                  }}
                >
                  All
                </button>

                {/* Day buttons 1-9 - Circular */}
                {Array.from({ length: 9 }, (_, i) => i + 1).map((day) => (
                  <button
                    key={day}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all
      ${
        day <= 5
          ? (selectingFor === "enemy" ? selectedDay : ourSelectedDay) === day
            ? "bg-[#6B3D1F] text-white border-2 border-white shadow-lg" // Updated styling for selected state
            : "bg-[#804A2B] text-gray-300 hover:bg-[#905A3B] hover:text-white"
          : "bg-[#804A2B] text-gray-300 opacity-50 cursor-not-allowed"
      } relative group`}
                    onClick={() => {
                      if (day <= 5) {
                        const filtered = allMonsters.filter(
                          (monster) => monster.day === day
                        );
                        if (selectingFor === "enemy") {
                          setMonsters(filtered);
                          setSelectedDay(day);
                        } else {
                          setOurMonsters(filtered);
                          setOurSelectedDay(day);
                        }
                      }
                    }}
                    disabled={day > 5}
                  >
                    {day}
                    {day > 5 && (
                      <div
                        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 
        bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 
        transition-opacity duration-200 whitespace-nowrap"
                      >
                        Coming Soon
                      </div>
                    )}
                  </button>
                ))}

                {/* 10+ button - Oval */}
                {/* 10+ button - Oval */}
                <button
                  className={`h-10 px-4 rounded-full flex items-center justify-center transition-all
    ${
      (selectingFor === "enemy" ? selectedDay : ourSelectedDay) === "10+"
        ? "bg-[#6B3D1F] text-white border-2 border-white shadow-lg" // Updated to match selected state
        : "bg-[#804A2B] text-gray-300 opacity-50 cursor-not-allowed"
    } relative group`}
                  disabled
                >
                  10+
                  <div
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 
    bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 
    transition-opacity duration-200 whitespace-nowrap"
                  >
                    Coming Soon
                  </div>
                </button>
                {/* Event button - Oval */}
                <button
                  className={`h-10 px-4 rounded-full flex items-center justify-center transition-all
    ${
      (selectingFor === "enemy" ? selectedDay : ourSelectedDay) === "event"
        ? "bg-[#6B3D1F] text-white border-2 border-white shadow-lg" // Updated to match selected state
        : "bg-[#804A2B] text-gray-300 opacity-50 cursor-not-allowed"
    } relative group`}
                  disabled
                >
                  Event
                  <div
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 
    bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 
    transition-opacity duration-200 whitespace-nowrap"
                  >
                    Coming Soon
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Monster Grid - Now flexibly takes remaining space */}
          <div className="flex-1 overflow-y-auto-visible">
            <div className="grid grid-cols-3 gap-4 overflow-visible flex-1 pr-2">
              {(selectingFor === "enemy" ? monsters : ourMonsters).map(
                (monster) => (
                  <div
                    key={`${monster.name}-${monster.day}`}
                    className="flex items-center p-4 bg-[#804A2B] rounded-lg cursor-pointer hover:bg-[#905A3B] transition-all relative group"
                    onClick={() => {
                      if (selectingFor === "enemy") {
                        setEnemyHero("Monster");
                        handleMonsterSelect(monster.name);
                      } else {
                        setOurHero("Monster");
                        handleMonsterSelect(monster.name, "our");
                      }
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
                      <div className="font-bold mb-2">{monster.name}</div>
                      {monster.items?.some((item) => item && item.name) && (
                        <div className="mb-2">
                          <span className="font-semibold">Items: </span>
                          {monster.items
                            .filter((item) => item && item.name)
                            .map((item) => item.name)
                            .filter(
                              (name, index, self) =>
                                self.indexOf(name) === index
                            )
                            .join(", ")}
                        </div>
                      )}
                      {monster.skills?.length > 0 && (
                        <div>
                          <span className="font-semibold">Skills: </span>
                          {monster.skills.join(", ")}
                        </div>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HeroSelectModal;
