// import React from "react";
// import Cross from "../assets/Images/Close.png";
// export default function OptimizehModal({
//   setIsOptimizeModalOpen,
//   setCustomEnemyHealth,
//   setCustomPlayerHealth,
//   customEnemyHealth,
//   customPlayerHealth,
//   enemyHero,
//   selectedMonster,
//   ourHero,
//   ourSelectedMonster,
//   setDisplayedEnemyHealth,
//   setDisplayedPlayerHealth,
// }) {
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//       <div className="bg-[#B1714B] p-6 rounded-lg shadow-xl w-[400px] relative">
//         <button
//           className="absolute top-1 right-1 w-10 h-10 bg-cover bg-center transform translate-x-1/2 -translate-y-1/2"
//           style={{ backgroundImage: `url(${Cross})` }}
//           onClick={() => setIsOptimizeModalOpen(false)}
//         />

//         <h3 className="text-xl font-semibold text-white mb-6">Modify Health</h3>

//         <div className="space-y-4">
//           <div className="flex flex-col gap-2">
//             {/* <label className="text-white">
//               {enemyHero === "Monster" && selectedMonster
//                 ? `${selectedMonster.name} Max Health:`
//                 : "Opponent Max Health:"}
//             </label> */}
//             <input
//               type="number"
//               value={customEnemyHealth}
//               onChange={(e) => {
//                 const value = Math.max(1, Number(e.target.value));
//                 setCustomEnemyHealth(value);
//                 setDisplayedEnemyHealth(value);
//               }}
//               min="1"
//               max="999999"
//               className="w-full p-2 rounded bg-[#804A2B] text-white"
//             />
//           </div>

//           <div className="flex flex-col gap-2">
//             <label className="text-white">
//               {ourHero === "Monster" && ourSelectedMonster
//                 ? `${ourSelectedMonster.name} Max Health:`
//                 : "Player Max Health:"}
//             </label>
//             <input
//               type="number"
//               value={customPlayerHealth}
//               onChange={(e) => {
//                 const value = Math.max(1, Number(e.target.value));
//                 setCustomPlayerHealth(value);
//                 setDisplayedPlayerHealth(value);
//               }}
//               min="1"
//               max="999999"
//               className="w-full p-2 rounded bg-[#804A2B] text-white"
//             />
//           </div>

//           <button
//             onClick={() => {
//               setIsOptimizeModalOpen(false);
//             }}
//             className="w-full p-3 bg-[#804A2B] hover:bg-[#905A3B] text-white rounded-lg mt-4"
//           >
//             Save Changes
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
