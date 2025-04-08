import React from 'react';
import Panel from "../assets/Images/FPanel.png";
import Bread from "../assets/Images/BreadBG.png";

export default function FAQPage({ setCurrentPage }) {
  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="relative flex flex-col items-center w-full">
        {/* Breadcrumb at the top */}
        <div className="relative w-[500px] h-[81px] flex items-center justify-center mt-[-30px] mb-[10px] z-10"
             style={{ backgroundImage: `url(${Bread})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
          <div className="flex items-center space-x-2 text-[#4a2d00] font-semibold">
            <button 
              onClick={() => setCurrentPage('battle')} 
              className="cursor-pointer hover:text-[#e0ac54] transition-colors">
              Home
            </button>
            <span>&gt;</span>
            <span className="text-[#e0ac54]">FAQ</span>
          </div>
        </div>
      <div className="relative rounded-lg p-7 w-[972px] h-[833px] shadow-lg bg-cover bg-center" style={{ backgroundImage: `url(${Panel})` }}>
        
        {/* FAQ Title */}
        <h1 className="text-4xl font-bold text-[#4a2d00] text-center mb-4 mt-12">FAQ</h1>
          
        {/* FAQ Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-36 ml-[115px] mr-18 max-w-4xl mx-auto">
          <div className="bg-[#f9f3e8] border-2 border-[#e0ac54] rounded-md p-4 shadow-md w-[270px] h-[162px]">
            <h2 className="font-bold text-base mb-2 text-[#4a2d00]">What is Bazaar Broker?</h2>
            <p className="text-xs text-[#4a2d00]">
              Bazaar Broker is a web-based deck tracker for The Bazaar. It helps players track battles and 
              optimize their layouts (coming soon).
            </p>
          </div>

          <div className="bg-[#f9f3e8] border-2 border-[#e0ac54] rounded-md p-4 shadow-md w-[270px] h-[162px]">
            <h2 className="font-bold text-lg mb-2 text-[#4a2d00]">Is it free to use?</h2>
            <p className="text-sm text-[#4a2d00]">
              Yes, Bazaar Broker is completely free to use for all players.
            </p>
          </div>

          <div className="bg-[#f9f3e8] border-2 border-[#e0ac54] rounded-md p-4 shadow-md w-[270px] h-[162px]">
            <h2 className="font-bold text-lg mb-2 text-[#4a2d00]">How do I get started?</h2>
            <p className="text-sm text-[#4a2d00]">
              Simply Add you Cards in the Deck or Choose from a Monster Loadout then Clik on Battle.
            </p>
          </div>

          <div className="bg-[#f9f3e8] border-2 border-[#e0ac54] rounded-md p-4 shadow-md w-[270px] h-[162px]">
            <h2 className="font-bold text-lg mb-2 text-[#4a2d00]">What features are coming soon?</h2>
            <p className="text-sm text-[#4a2d00]">
              We're working on deck optimization tools, advanced statistics, A detailed list of items.
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}