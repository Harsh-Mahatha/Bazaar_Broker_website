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
          className="relative w-[500px] h-[81px] flex items-center justify-center mt-[-160px] mb-[10px] z-10"
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-0 gap-y-6 mt-[55px] ml-[93px] mr-18 max-w-4xl mx-auto">
                <div className="bg-[#f9f3e8] border-2 border-[#e0ac54] rounded-md p-4 shadow-md w-[351px] h-[210px]">
                  <h2 className="font-bold text-base mb-2 text-[#4a2d00]">
                  What is Bazaar Broker?
                  </h2>
                  <p className="text-sm text-[#4a2d00]">
                  This website and its related app are unofficial fan-made tools designed to assist players of The Bazaar. 
                  We are not affiliated with, endorsed by, or connected to the developers or publishers of The Bazaar in any way. 
                  All game-related names, images, and intellectual property belong to their respective owners.
                  </p>
                </div>

                <div className="bg-[#f9f3e8] border-2 border-[#e0ac54] rounded-md p-4 shadow-md w-[351px] h-[210px]">
                  <h2 className="font-bold text-lg mb-2 text-[#4a2d00]">
                  When will all the heroes be implemented?
                  </h2>
                  <p className="text-sm text-[#4a2d00]">
                  Right now Vanessa is ready. We are working on first adding all the heroes.
                  You can find more information on our "Coming Soon" page
                  As we are still in Beta, some of the mechanics may be missing.
                  </p>
                </div>

                <div className="bg-[#f9f3e8] border-2 border-[#e0ac54] rounded-md p-4 shadow-md w-[351px] h-[210px]">
                  <h2 className="font-bold text-lg mb-2 text-[#4a2d00]">
                  Why did we build this app?
                  </h2>
                  <p className="text-sm text-[#4a2d00]">
                  I was tired of not knowing if I should place the ray on the left or the right of core.
                  </p>
                </div>

                <div className="bg-[#f9f3e8] border-2 border-[#e0ac54] rounded-md p-4 shadow-md w-[351px] h-[210px]">
                  <h2 className="font-bold text-lg mb-2 text-[#4a2d00]">
                  Contact Us:
                  </h2>
                  <p className="text-sm text-[#4a2d00]">
                  Feel free to ask us any question and we will answer 
                  <b>  Click here</b>
                  </p>
                </div>
                </div>
              </div>
              {/* Support Banner fixed at Bottom */}
        <div
          className="fixed bottom-0 left-0 w-full h-[125px] z-50 flex justify-center items-center"
          style={{
            backgroundImage: `url(${Banner})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
          <div className=" mt-[25px] w-full max-w-screen-xl flex justify-between items-center px-10">
            <div className="bg-[#f9f3e8] border-2 border-[#e0ac54] rounded-md p-6 w-[1040px] h-[100px] shadow-md ml-[78px] flex justify-between items-center mb-[12px]">
              <div className="text-[#4a2d00] text-base leading-8">
                <p>
                  We would love to create our own game. We’ve launched a Kickstarter page where you can show your support.
                  <br />
                  Why us: The once handsome Reynad started {<a
                        href="https://youtu.be/U13a2hawk3I?si=NfjF1ZoivgCJljpA"
                        target="_blank"
                        className="text-[#4a2d00] font-bold hover:text-[#e0ac54] text-lg  mx-1"
                      >
                        The Bazaar
                      </a>} 6 years ago. We can do better in 6 ... months. 
                </p>
              </div>
              <button
                className="bg-[#4a2d00] hover:bg-[#e0ac54] text-white font-semibold px-6 py-2 rounded-xl transition-colors  "
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
    </div>
  );
}
