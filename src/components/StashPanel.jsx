import React from 'react';

export default function StashPanel({ isOpen, onClose, deckType }) {
  if (!isOpen) return null;

  const isEnemy = deckType === "enemy";

  return (
    <div 
      className={`fixed left-1/2 -translate-x-1/2 w-[55%] z-50 transition-all duration-300 ${
        isEnemy ? 'top-12' : 'bottom-12'
      }`}
    >
      <div className={`bg-[#B1714B] p-4 rounded-xl border-4 ${
        isEnemy ? 'border-red-500' : 'border-blue-500'
      } shadow-xl`}>
        <div className="flex justify-between items-center mt-[-10px] mb-[10px]">
          <h2 className="text-white text-2xl font-semibold">
            {isEnemy ? "Enemy Stash" : "Player Stash"}
          </h2>
          <button 
            onClick={onClose}
            className="text-[#B1714B] hover:text-[#E4B483] transition-colors"
          >
            <img src="/Close.png" alt="Close" className="w-8 h-8" />
          </button>
        </div>
        
        <div className="relative">
          <div className="flex gap-1 justify-between">
            {Array(10).fill(null).map((_, index) => (
              <div 
                key={index}
                className="w-[90px] h-[156px] border border-[#B1714B]/50 rounded-lg bg-[#804A2B]"
              />
            ))}
          </div>
          
          {/* Overlay text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-4xl font-semibold">Coming Soon</span>
          </div>
        </div>
      </div>
    </div>
  );
}