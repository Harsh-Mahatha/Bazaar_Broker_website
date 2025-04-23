import React from "react";
import { Plus } from "lucide-react";
import Cross from "../assets/Images/Close.png";
export default function SkillsListModal({
  setShowSkillsList,
  showSkillsList,
  setSelectedDeckForSkills,
  setIsSkillsModalOpen,
  ourSkills,
  enemySkills,
  handleRemoveSkill,
}) {
  return (
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
        <div className="grid grid-cols-2 gap-2 max-h-[400px] ">
          {(showSkillsList === "enemy" ? enemySkills : ourSkills)
            .slice(2) // Skip the first two skills
            .map((skill, index) => (
              <div
                key={index}
                className="relative flex items-center gap-2 bg-[#804A2B] p-2 rounded-lg group/skill"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveSkill(showSkillsList, index + 2);
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-cover bg-center opacity-0 group-hover/skill:opacity-100 transition-opacity z-10"
                  style={{ backgroundImage: `url(${Cross})` }}
                />
                <div className="relative">
                  <img
                    src={skill.image}
                    alt={skill.name}
                    className="w-12 h-12 rounded-full"
                  />
                </div>
                <div className="flex-1">
                  <div className="text-white">{skill.name}</div>
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
                  <div className="font-bold mb-1">{skill.name}</div>
                  {skill.description && (
                    <div className="text-xs text-gray-300">
                      {skill.description}
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
