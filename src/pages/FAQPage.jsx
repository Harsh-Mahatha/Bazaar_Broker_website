import React from "react";
import Panel from "../assets/Images/FPanel.png";
import Bread from "../assets/Images/BreadBG.png";
import Banner from "../assets/Images/Banner.png";

export default function FAQPage({ setCurrentPage }) {
  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="relative flex flex-col items-center w-full">
        {/* Breadcrumb at the top */}
        <div
          className="relative w-[500px] h-[81px] flex items-center justify-center mt-[-150px] mb-[10px] z-10"
          style={{
            backgroundImage: `url(${Bread})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
          <div className="flex items-center space-x-2 text-[#4a2d00] font-semibold">
            <button
              onClick={() => setCurrentPage("battle")}
              className="cursor-pointer hover:text-[#e0ac54] transition-colors"
            >
              Home
            </button>
            <span>&gt;</span>
            <span className="text-[#4a2d00]">FAQ</span>
          </div>
        </div>
        <div
          className="relative rounded-lg p-7 w-[1038px] h-[673px] shadow-lg bg-cover bg-center"
          style={{ backgroundImage: `url(${Panel})` }}
        >
          {/* FAQ Title */}
          <h1 className="text-4xl font-bold text-[#4a2d00] text-center mb-4 mt-12">
            FAQ
          </h1>

          {/* FAQ Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-[95px] ml-[140px] mr-18 max-w-4xl mx-auto">
            <div className="bg-[#f9f3e8] border-2 border-[#e0ac54] rounded-md p-4 shadow-md w-[270px] h-[162px]">
              <h2 className="font-bold text-base mb-2 text-[#4a2d00]">
                What is Bazaar Broker?
              </h2>
              <p className="text-xs text-[#4a2d00]">
                Bazaar Broker is a web-based deck tracker for The Bazaar. It
                helps players track battles and optimize their layouts (coming
                soon).
              </p>
            </div>

            <div className="bg-[#f9f3e8] border-2 border-[#e0ac54] rounded-md p-4 shadow-md w-[270px] h-[162px]">
              <h2 className="font-bold text-lg mb-2 text-[#4a2d00]">
                Is it free to use?
              </h2>
              <p className="text-sm text-[#4a2d00]">
                Yes, Bazaar Broker is completely free to use for all players.
              </p>
            </div>

            <div className="bg-[#f9f3e8] border-2 border-[#e0ac54] rounded-md p-4 shadow-md w-[270px] h-[162px]">
              <h2 className="font-bold text-lg mb-2 text-[#4a2d00]">
                How do I get started?
              </h2>
              <p className="text-sm text-[#4a2d00]">
                Simply Add you Cards in the Deck or Choose from a Monster
                Loadout then Clik on Battle.
              </p>
            </div>

            <div className="bg-[#f9f3e8] border-2 border-[#e0ac54] rounded-md p-4 shadow-md w-[270px] h-[162px]">
              <h2 className="font-bold text-lg mb-2 text-[#4a2d00]">
                What features are coming soon?
              </h2>
              <p className="text-sm text-[#4a2d00]">
                We're working on deck optimization tools, advanced statistics, A
                detailed list of items.
              </p>
            </div>
          </div>
        </div>
        {/* Support Banner fixed at Bottom */}
        <div
          className="fixed bottom-0 left-0 w-full h-[150px] z-50 flex justify-center items-center"
          style={{
            backgroundImage: `url(${Banner})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
          <div className=" mt-[25px] w-full max-w-screen-xl flex justify-between items-center px-10">
            <div className="max-w-[60%] text-[#4a2d00] text-sm leading-relaxed">
              <p>
                We would love to create our own Bazaar-inspired game. We've
                launched a Kickstarter page where you can show your support.
                <br />
                Why should you spend your hard-earned money on us?
                <br />
                Reynad, while he was still handsome, released{" "}
                <i>The Bazaar | Reynad’s New Card Game</i> 6 years ago.
                <br />
                We can do better in 6 ... months.
              </p>
            </div>

            <button
              className="bg-[#4a2d00] hover:bg-[#e0ac54] text-white font-semibold px-6 py-2 rounded-xl transition-colors"
              onClick={() =>
                window.open(
                  "https://bazaar-broker-kickstarter-link.com",
                  "_blank"
                )
              }
            >
              Support Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
