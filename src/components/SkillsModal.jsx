import React from "react";
import { Search } from "lucide-react";
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
  const handleSelectSkill = (skill) => {
    if (selectedDeckForSkills === "our") {
      setOurSkills([...ourSkills, skill]);
    } else if (selectedDeckForSkills === "enemy") {
      setEnemySkills([...enemySkills, skill]);
    }
    setIsSkillsModalOpen(false);
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
            {filteredSkills.map((skill, i) => {
              //console.log("Rendering Skill:", skill);
              return (
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
        </div>
      </div>
    </div>
  );
}
export default SkillsModal;
