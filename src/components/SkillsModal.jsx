import React, { useState } from "react";
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
  // State for tag filters (UI only)
  const [selectedTags, setSelectedTags] = useState([]);
  
  // Predefined enchantment tags
  const enchantmentTags = [
    "Deadly", 
    "Fiery", 
    "Golden", 
    "Heavy", 
    "Icy", 
    "Obsidian",
    "Radiant", 
    "Restorative", 
    "Shielded", 
    "Shiny", 
    "Toxic", 
    "Turbo"
  ];

  // No actual filtering for now - will be implemented when backend provides the data
  const displayedSkills = filteredSkills;

  const handleTagToggle = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSelectSkill = (skill) => {
    if (selectedDeckForSkills === "our") {
      setOurSkills([...ourSkills, skill]);
    } else if (selectedDeckForSkills === "enemy") {
      setEnemySkills([...enemySkills, skill]);
    }
    setIsSkillsModalOpen(false);
  };

  const clearTagFilters = () => {
    setSelectedTags([]);
  };

  return (
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
            Total skills available: {displayedSkills.length} (All Skills coming Soon)
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
          
          {/* Enchantments filter section */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-white text-xl">Enchantments</p>
              {selectedTags.length > 0 && (
                <button 
                  onClick={clearTagFilters}
                  className="text-xs text-gray-300 hover:text-white underline"
                >
                  Clear filters
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {enchantmentTags.map(tag => (
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

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            {displayedSkills.map((skill, i) => {
              return (
                <div
                  key={i}
                  className={`flex flex-col p-3 rounded-lg relative group ${
                    skill.name !== "Burst of Flame"
                      ? "cursor-pointer hover:bg-[#905A3B]"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                  style={{ backgroundColor: "#804A2B" }}
                  onClick={() =>
                    skill.name !== "Burst of Flame" && handleSelectSkill(skill)
                  }
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
                </div>
              );
            })}
          </div>
          
          {displayedSkills.length === 0 && (
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-300 text-center">
                No skills match your current search.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillsModal;