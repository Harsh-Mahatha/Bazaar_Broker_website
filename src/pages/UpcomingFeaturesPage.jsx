import React from "react";
import Bread from "../assets/Images/BreadBG.png";
import FF from "../assets/Images/FeatureFrame.png";
import Banner from "../assets/Images/Banner.png";

const UpcomingFeatures = ({ setCurrentPage }) => {
  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="relative flex flex-col items-center w-full">
        {/* Breadcrumb at the top */}
        <div
          className="relative w-[500px] h-[81px] flex items-center justify-center mt-[-30px] mb-[10px] z-10"
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
            <span className="text-[#4a2d00]">Coming Soon</span>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="relative rounded-lg p-7 w-[1100px] h-[750px]">
          <div className="mt-[100px] grid grid-cols-2 gap-x-8 gap-y-7">
            {[
              "What's Left",
              "Ranked Ladder",
              "El",
              "Deck Optimizer",
              "Create Your Own Card",
              "Quality of Life Improvements",
            ].map((title, index) => (
              <div key={index} className="relative">
                <div
                  className="w-full h-[115px] flex items-center justify-center"
                  style={{
                    backgroundImage: `url(${FF})`,
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                  }}
                >
                  {title === "El" ? (
                    <div className="flex items-center justify-center text-center px-4">
                      <span className="text-[#F1D5BD] font-bold text-lg">
                        El: New Space and Time Hero (
                      </span>
                      <a
                        href="/hero-info"
                        target="_blank"
                        className="text-[#e0ac54] hover:text-[#F1D5BD] text-lg underline mx-1"
                      >
                        More Info
                      </a>
                      <span className="text-[#F1D5BD] font-bold text-lg">
                        )
                      </span>
                    </div>
                  ) : (
                    <h2
                      className="font-bold text-lg text-[#F1D5BD]"
                      dangerouslySetInnerHTML={{ __html: title }}
                    ></h2>
                  )}
                </div>
              </div>
            ))}
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
};

export default UpcomingFeatures;
