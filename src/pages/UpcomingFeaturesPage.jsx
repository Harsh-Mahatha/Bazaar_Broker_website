import React from "react";
import Panel from "../assets/Images/FPanel.png";

const UpcomingFeatures = () => {
return (
    <div className="flex justify-center items-center min-h-screen p-5">
      <div className="relative rounded-lg p-8 w-[1080px] h-[926px] shadow-lg bg-cover bg-center" style={{ backgroundImage: `url(${Panel})` }}>
        
        {/* FAQ Title */}
        <h1 className="text-5xl font-bold text-[#4a2d00] text-center mb-4 mt-14">Upcoming Features</h1>
          
        {/* FAQ List */}
        <div className="mt-40 mx-auto max-w-3xl">
          <ul className="space-y-6">
            <li className="bg-[#f9f3e8] border-2 border-[#e0ac54] rounded-md p-5 shadow-md">
              <h2 className="font-bold text-lg mb-2 text-[#4a2d00]">All hero Items</h2>
            </li>

            <li className="bg-[#f9f3e8] border-2 border-[#e0ac54] rounded-md p-5 shadow-md">
              <h2 className="font-bold text-lg mb-2 text-[#4a2d00]">All days monster Loadouts</h2>
            </li>

            <li className="bg-[#f9f3e8] border-2 border-[#e0ac54] rounded-md p-5 shadow-md">
              <h2 className="font-bold text-lg mb-2 text-[#4a2d00]">Deck Optimization Button</h2>
            </li>

            <li className="bg-[#f9f3e8] border-2 border-[#e0ac54] rounded-md p-5 shadow-md">
              <h2 className="font-bold text-lg mb-2 text-[#4a2d00]">Load from Screenshot Button</h2>
            </li>
          </ul>
        </div>
        
      </div>
    </div>
  );
};

export default UpcomingFeatures;
