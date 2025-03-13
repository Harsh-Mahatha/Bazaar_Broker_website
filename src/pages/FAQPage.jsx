import React from 'react';
import Panel from "../assets/Images/Fpanel.png";

export default function FAQPage() {
  return (
    <div className="flex justify-center items-center min-h-screen p-5">
      <div className="relative rounded-lg p-8 w-[1080px] h-[926px] shadow-lg bg-cover bg-center" style={{ backgroundImage: `url(${Panel})` }}>
        
        {/* FAQ Title */}
        <h1 className="text-5xl font-bold text-[#4a2d00] text-center mb-4 mt-14">FAQ</h1>
          
        {/* FAQ Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-40 ml-40 mr-20 max-w-4xl mx-auto">
          <div className="bg-[#f9f3e8] border-2 border-[#e0ac54] rounded-md p-5 shadow-md w-[300px] h-[180px]">
            <h2 className="font-bold text-lg mb-2 text-[#4a2d00]">What is Bazaar Broker?</h2>
            <p className="text-sm text-[#4a2d00]">
              Bazaar Broker is a web-based deck tracker for The Bazaar. It helps players track battles and 
              optimize their layouts (coming soon).
            </p>
          </div>

          <div className="bg-[#f9f3e8] border-2 border-[#e0ac54] rounded-md p-5 shadow-md w-[300px] h-[180px]">
            <h2 className="font-bold text-lg mb-2 text-[#4a2d00]">Is it free to use?</h2>
            <p className="text-sm text-[#4a2d00]">
              Yes, Bazaar Broker is completely free to use for all players.
            </p>
          </div>

          <div className="bg-[#f9f3e8] border-2 border-[#e0ac54] rounded-md p-5 shadow-md w-[300px] h-[180px]">
            <h2 className="font-bold text-lg mb-2 text-[#4a2d00]">How do I get started?</h2>
            <p className="text-sm text-[#4a2d00]">
              Simply Add you Cards in the Deck or Choose from a Monster Loadout then Clik on Battle.
            </p>
          </div>

          <div className="bg-[#f9f3e8] border-2 border-[#e0ac54] rounded-md p-5 shadow-md w-[300px] h-[180px]">
            <h2 className="font-bold text-lg mb-2 text-[#4a2d00]">What features are coming soon?</h2>
            <p className="text-sm text-[#4a2d00]">
              We're working on deck optimization tools, advanced statistics, A detailed list of items.
            </p>
          </div>
        </div>
        
      </div>
    </div>
  );
}