import React, { useState, useEffect } from "react";
import { Search, Tag } from "lucide-react";
import Cross from "../assets/Images/Close.png";

const SkillsModal = ({
  setIsSkillsModalOpen,
  filteredSkills,
  skillSearchTerm,
  setSkillSearchTerm,
  selectedDeckForSkills,
  setOurSkills,
  setEnemySkills,
  ourSkills,
  enemySkills,
}) => {
  // State for filters
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedHeroes, setSelectedHeroes] = useState([]);
  const [selectedTiers, setSelectedTiers] = useState([]);
  const [filterMode, setFilterMode] = useState("matchAny"); // "matchAll" or "matchAny"
  const [finalFilteredSkills, setFinalFilteredSkills] = useState([]);
  
  // Trigger dismissal of tutorial arrows when modal opens
  useEffect(() => {
    // Dispatch a custom event to dismiss arrows
    const event = new CustomEvent("dismissTutorialArrows");
    document.dispatchEvent(event);
  }, []);
  
  // Predefined skill effect tags
  const effectTags = [
    "Ammo", "AmmoReference", "Apparel", "Aquatic", "Burn", "BurnReference",
    "Charge", "Cooldown", "Core", "Crit", "CritReference", "Damage",
    "DamageReference", "Economy", "Freeze", "FreezeReference", "Friend", "Gold",
    "Haste", "HasteReference", "Heal", "HealReference", "Health", 
    "HealthReference", "Income", "Poison", "PoisonReference", "Potion",
    "Property", "Regen", "RegenReference", "Shield", "ShieldReference", "Slow",
    "SlowReference", "Tech", "Tool", "Toy", "Value", "Vehicle", "Weapon"
  ];

  // Heroes and tiers based on the image
  const heroes = [
    "Vanessa", "Pygmalien", "Dooley", "Mak", "Jules", "Stelle", "Common"
  ];
  
  const tiers = [
    "Bronze+", "Silver+", "Gold+", "Diamond+", "Legendary"
  ];

  // Initialize finalFilteredSkills when component mounts or filteredSkills changes
  useEffect(() => {
    console.log("Initial skills data loaded:", filteredSkills.length);
    setFinalFilteredSkills(filteredSkills);
  }, [filteredSkills]);

  // Update filtered skills whenever filters change
  useEffect(() => {
    if (!Array.isArray(filteredSkills) || filteredSkills.length === 0) {
      setFinalFilteredSkills([]);
      return;
    }

    try {
      // Normalize skill data to ensure consistent structure
      const normalizedSkills = filteredSkills.map(skill => ({
        ...skill,
        tags: Array.isArray(skill.tags) ? skill.tags : []
      }));
      
      // Simple tag check function - case insensitive partial match
      const matchesTag = (skillTags, searchTag) => {
        if (!Array.isArray(skillTags)) return false;
        return skillTags.some(tag => 
          String(tag).toLowerCase().includes(String(searchTag).toLowerCase())
        );
      };

      const filtered = normalizedSkills.filter(skill => {
        // Search term filter
        const matchesSearch = !skillSearchTerm || 
          skill.name.toLowerCase().includes(skillSearchTerm.toLowerCase()) ||
          (skill.effects && skill.effects.some(effect => 
            effect.toLowerCase().includes(skillSearchTerm.toLowerCase())
          ));
        
        if (!matchesSearch) return false;
        
        // Handle tag filters
        let passesTagFilters = true;
        if (selectedTags.length > 0) {
          const tagMatches = selectedTags.filter(tag => 
            matchesTag(skill.tags, tag)
          );
          
          passesTagFilters = filterMode === "matchAny" 
            ? tagMatches.length > 0 
            : tagMatches.length === selectedTags.length;
          
          if (!passesTagFilters) return false;
        }
        
        // Handle hero filters
        let passesHeroFilters = true;
        if (selectedHeroes.length > 0) {
          const heroMatches = selectedHeroes.filter(hero => 
            matchesTag(skill.tags, hero)
          );
          
          passesHeroFilters = filterMode === "matchAny" 
            ? heroMatches.length > 0 
            : heroMatches.length === selectedHeroes.length;
          
          if (!passesHeroFilters) return false;
        }
        
        // Handle tier filters (excluding Monster Drops Only)
        let passesTierFilters = true;
        const regularTiers = selectedTiers.filter(t => t !== "Monster Drops Only");
        if (regularTiers.length > 0) {
          const tierMatches = regularTiers.filter(tier => 
            matchesTag(skill.tags, tier)
          );
          
          passesTierFilters = filterMode === "matchAny" 
            ? tierMatches.length > 0 
            : tierMatches.length === regularTiers.length;
          
          if (!passesTierFilters) return false;
        }
        
        // Handle Monster Drops Only as a special case
        if (selectedTiers.includes("Monster Drops Only")) {
          const isMonsterDrop = skill.tags && skill.tags.some(tag => 
            String(tag).toLowerCase().includes("monster")
          );
          if (!isMonsterDrop) return false;
        }
        
        // If all filters pass
        return true;
      });
      
      setFinalFilteredSkills(filtered);
      
      console.log(`Filtered: ${filtered.length}/${filteredSkills.length} skills`);
    } catch (error) {
      console.error("Error filtering skills:", error);
      setFinalFilteredSkills(filteredSkills); // Fallback to unfiltered
    }
  }, [filteredSkills, skillSearchTerm, selectedTags, selectedHeroes, selectedTiers, filterMode]);

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };
  
  const handleHeroToggle = (hero) => {
    setSelectedHeroes(prev => prev.includes(hero) ? prev.filter(h => h !== hero) : [...prev, hero]);
  };
  
  const handleTierToggle = (tier) => {
    setSelectedTiers(prev => prev.includes(tier) ? prev.filter(t => t !== tier) : [...prev, tier]);
  };

  const handleSelectSkill = (skill) => {
    try {
      console.log("Selected skill:", skill.name, "for deck:", selectedDeckForSkills);
      
      // Create a new skill object to avoid reference issues
      const skillToAdd = {...skill};
      
      if (selectedDeckForSkills === "our") {
        const updatedSkills = [...ourSkills, skillToAdd];
        setOurSkills(updatedSkills);
        console.log("Updated our skills:", updatedSkills.length);
      } else if (selectedDeckForSkills === "enemy") {
        const updatedSkills = [...enemySkills, skillToAdd];
        setEnemySkills(updatedSkills);
        console.log("Updated enemy skills:", updatedSkills.length);
      } else {
        console.error("Invalid deck selection:", selectedDeckForSkills);
      }
      
      // Dispatch an event to dismiss tutorial arrows before closing modal
      const event = new CustomEvent("dismissTutorialArrows");
      document.dispatchEvent(event);
      
      // Close modal after selection
      setIsSkillsModalOpen(false);
    } catch (error) {
      console.error("Error selecting skill:", error);
    }
  };

  const clearAllFilters = () => {
    setSelectedTags([]);
    setSelectedHeroes([]);
    setSelectedTiers([]);
    setSkillSearchTerm("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
      <div className="bg-[#B1714B] p-6 rounded-lg shadow-xl w-[600px] h-[90vh] relative flex flex-col">
        <button
          className="absolute top-1 right-1 w-10 h-10 bg-cover bg-center transform translate-x-1/2 -translate-y-1/2"
          style={{ backgroundImage: `url(${Cross})` }}
          onClick={() => {
            // Dismiss tutorial arrows when closing modal
            const event = new CustomEvent("dismissTutorialArrows");
            document.dispatchEvent(event);
            setIsSkillsModalOpen(false);
          }}
        ></button>
        
        <div className="flex flex-col h-full">
          <div className="flex-none">
            <h3 className="text-white text-xl mb-4">Select a Skill</h3>
            
            <div className="text-gray-300 text-sm mb-2">
              Total skills available: {finalFilteredSkills.length} (All Skills coming Soon)
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
            
            {/* Filter mode toggle */}
            <div className="mb-4 flex gap-2">
              <button
                onClick={() => setFilterMode("matchAny")}
                className={`px-4 py-1 rounded text-sm font-medium ${
                  filterMode === "matchAny"
                    ? "bg-[#D98F5F] text-white"
                    : "bg-[#5d351e] text-gray-300 hover:bg-[#804A2B]"
                }`}
              >
                Match Any
              </button>
              <button
                onClick={() => setFilterMode("matchAll")}
                className={`px-4 py-1 rounded text-sm font-medium ${
                  filterMode === "matchAll"
                    ? "bg-[#D98F5F] text-white"
                    : "bg-[#5d351e] text-gray-300 hover:bg-[#804A2B]"
                }`}
              >
                Match All
              </button>
              
              {(selectedTags.length > 0 || selectedHeroes.length > 0 || selectedTiers.length > 0 || skillSearchTerm) && (
                <button 
                  onClick={clearAllFilters}
                  className="ml-auto text-xs text-gray-300 hover:text-white underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
            
            {/* Heroes filter section */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-white text-xl">Heroes</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {heroes.map(hero => (
                  <button
                    key={hero}
                    onClick={() => handleHeroToggle(hero)}
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
            
            {/* Starting Tiers filter section */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-white text-xl">Starting Tiers</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {tiers.map(tier => (
                  <button
                    key={tier}
                    onClick={() => handleTierToggle(tier)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedTiers.includes(tier)
                        ? "bg-[#D98F5F] text-white"
                        : "bg-[#5d351e] text-gray-300 hover:bg-[#804A2B]"
                    }`}
                  >
                    {tier}
                  </button>
                ))}
                
                {/* Misc section - Monster Drops Only */}
                <button
                  onClick={() => handleTierToggle("Monster Drops Only")}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    selectedTiers.includes("Monster Drops Only")
                      ? "bg-[#D98F5F] text-white"
                      : "bg-[#5d351e] text-gray-300 hover:bg-[#804A2B]"
                  }`}
                >
                  Monster Drops Only
                </button>
              </div>
            </div>
            
            {/* Tags filter section */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-white text-xl">Tags</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {effectTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
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

          {/* Skills Grid with scroll */}
          <div className="flex-1 overflow-y-auto mt-2 pb-6 pr-1">
            <div className="grid grid-cols-2 gap-4">
              {finalFilteredSkills.map((skill, i) => (
                <div
                  key={i}
                  className={`flex flex-col p-3 rounded-lg relative group mb-2 ${
                    skill.name !== "Burst of Flame"
                      ? "cursor-pointer hover:bg-[#905A3B]"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                  style={{ backgroundColor: "#804A2B" }}
                  onClick={() => {
                    if (skill.name !== "Burst of Flame") {
                      handleSelectSkill(skill);
                    }
                  }}
                >
                  {skill.name === "Burst of Flame" && (
                    <div className="absolute invisible group-hover:visible bg-gray-900 text-white text-xs rounded px-2 py-1 -top-8 left-1/2 transform -translate-x-1/2">
                      Broken
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <img
                      src={skill.image}
                      alt={skill.name}
                      className="w-12 h-12 rounded-md object-cover"
                      onError={(e) => {
                        e.target.src = "https://placehold.co/100x100?text=No+Image";
                      }}
                    />
                    <span className="text-white font-medium">{skill.name}</span>
                  </div>
                  {skill.effects && (
                    <div className="text-gray-300 text-sm mt-2">
                      {skill.effects.map((effect, index) => (
                        <p key={index}>{effect}</p>
                      ))}
                    </div>
                  )}
                  
                  {/* Display tags for each skill */}
                  {skill.tags && skill.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {skill.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="bg-[#5d351e] text-gray-300 text-xs px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                      {skill.tags.length > 3 && (
                        <span className="bg-[#5d351e] text-gray-300 text-xs px-2 py-0.5 rounded">
                          +{skill.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {finalFilteredSkills.length === 0 && (
              <div className="flex justify-center items-center h-40">
                <p className="text-gray-300 text-center">
                  No skills match your current search.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsModal;










