import React from "react";
import Bread from "../assets/Images/BreadBG.png";
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

        {/* Simplified Feature Grid */}
        <div className="relative rounded-lg p-7 w-[1100px] max-w-full mt-[-40px] mb-[70px]">
          <div className="mt-10 flex flex-col space-y-8">
            {/* Feature Item 1 */}
            <div className="feature-item">
              <h2 className="text-[#e0ac54] text-3xl font-bold mb-4">What's Left</h2>
              <p className="text-white text-lg">
              Currently, we just have the Vanessa items out and Monsters from Days 1 and 2.
              <br/>
              What's next: <br/>
              Enchantments <br/>
              Internal Cooldown and any other pending mechanics.<br/>
              Remaining Monsters<br/>
              Vanessa Skills<br/>
              Items and skills for Dooley<br/>
              Items and skills for Pygmalien<br/>
              Items and skills for MaK<br/>
              </p>
            </div>
            
            {/* Feature Item 2 */}
            <div className="feature-item">
              <h2 className="text-[#e0ac54] text-3xl font-bold mb-4">Ranked Ladder</h2>
              <p className="text-white text-lg">
              Compete for the best setups in a thrilling new format that rewards both strategy and creativity
              <br/>
               offering a fresh and balanced way to showcase your skills.
              </p>
            </div>
            
            {/* Feature Item 3 */}
            <div className="feature-item">
              <h2 className="text-[#e0ac54] text-3xl font-bold mb-4">El: New Space and Time Hero</h2>
              <div className="flex items-center text-lg">
              <a
                  href="/hero-info"
                  target="_blank"
                  className="text-[#e0ac54] hover:text-[#F1D5BD]"
                >
                Click here &nbsp;
                </a>
                <span className="text-white">
                   to discover how this hero harnesses the power of time and space manipulation to gain the upper hand.
                </span>
               
              </div>
            </div>
            
            {/* Feature Item 4 */}
            <div className="feature-item">
              <h2 className="text-[#e0ac54] text-3xl font-bold mb-4">Deck Optimizer</h2>
              <p className="text-white text-lg">
              Right now you can only run a single battle. We will be expanding this basic feature.
              <br/>
              Playmat optimizer: Will check if any new item improves your build or makes it worse. It will also rearrange the items and place them in the best layout.
              </p>
            </div>
            
            {/* Feature Item 5 */}
            <div className="feature-item">
              <h2 className="text-[#e0ac54] text-3xl font-bold mb-4">Create Your Own Card</h2>
              <p className="text-white text-lg">
              We're building a community-driven system where you can design your own cards—and the best creations will be officially added to the game.
              Have a brilliant idea or a fresh mechanic the game doesn’t support yet? No problem. Give us a few days and we can add it in.
              </p>
            </div>
            
            {/* Feature Item 6 */}
            <div className="feature-item">
              <h2 className="text-[#e0ac54] text-3xl font-bold mb-4">Quality of Life Improvements</h2>
              <p className="text-white text-lg">
              Quick Image Setup: Upload a screenshot to auto-setup the board 
              <br/>
              Search filters: Find items and skills easily
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
          <div className="mt-[25px] w-full max-w-screen-xl flex justify-between items-center px-10 mb-2">
            <div className="max-w-[90%] text-[#4a2d00] text-base leading-8">
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
              className="bg-[#4a2d00] hover:bg-[#e0ac54] text-white font-semibold px-6 py-2 rounded-xl transition-colors mr-10"
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