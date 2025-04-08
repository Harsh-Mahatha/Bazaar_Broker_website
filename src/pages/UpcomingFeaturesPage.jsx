import React from "react";
import Panel from "../assets/Images/FPanel.png";
import Bread from "../assets/Images/BreadBG.png";

const UpcomingFeatures = ({ setCurrentPage }) => {
return (
  <div className="flex justify-center items-center min-h-screen p-4">
     <div className="relative flex flex-col items-center w-full">
    {/* Breadcrumb at the top */}
    <div 
      className="relative w-[500px] h-[81px] flex items-center justify-center mt-[-30px] mb-[10px] z-10"
      style={{ backgroundImage: `url(${Bread})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
    >
      <div className="flex items-center space-x-2 text-[#4a2d00] font-semibold">
      <button 
        onClick={() => setCurrentPage('battle')} 
        className="cursor-pointer hover:text-[#e0ac54] transition-colors"
      >
        Home
      </button>
      <span>&gt;</span>
      <span className="text-[#e0ac54]">Upcoming Features</span>
      </div>
    </div>

    <div className="relative rounded-lg p-7 w-[972px] h-[833px] shadow-lg bg-cover bg-center" style={{ backgroundImage: `url(${Panel})` }}>
    
    {/* FAQ Title */}
    <h1 className="text-4xl font-bold text-[#4a2d00] text-center mb-4 mt-12">Upcoming Features</h1>
      
    {/* FAQ List */}
    <div className="mt-36 mx-auto max-w-2xl">
      <ul className="space-y-5">
      <li className="bg-[#f9f3e8] border-2 border-[#e0ac54] rounded-md p-4 shadow-md">
        <h2 className="font-bold text-base mb-2 text-[#4a2d00]">All hero Items</h2>
      </li>

      <li className="bg-[#f9f3e8] border-2 border-[#e0ac54] rounded-md p-4 shadow-md">
        <h2 className="font-bold text-base mb-2 text-[#4a2d00]">All days monster Loadouts</h2>
      </li>

      <li className="bg-[#f9f3e8] border-2 border-[#e0ac54] rounded-md p-4 shadow-md">
        <h2 className="font-bold text-base mb-2 text-[#4a2d00]">Deck Optimization Button</h2>
      </li>

      <li className="bg-[#f9f3e8] border-2 border-[#e0ac54] rounded-md p-4 shadow-md">
        <h2 className="font-bold text-base mb-2 text-[#4a2d00]">Load from Screenshot Button</h2>
      </li>
      </ul>
    </div>
    
    </div>
  </div>
  </div>
);
};

export default UpcomingFeatures;
