import React, { useState } from "react";
import Bread from "../assets/Images/BreadBG.png";
import Banner from "../assets/Images/Banner.png";
import { Link } from "react-router-dom";
import SupportBanner from "../components/SupportBanner";

const UpcomingFeatures = ({ setCurrentPage }) => {
const [supportBannerVisible, setSupportBannerVisible] = useState(true);
  return (
    <div className="flex justify-center min-h-screen p-4">
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
            ``
            {/* Feature Item 2 */}
            <div className="faq-item">
              <h2 className="text-[#e0ac54] text-3xl font-bold mb-4">
                What's next?
              </h2>
              <p className="text-white text-lg">
                Card editor <br /> Enchantments <br /> Internal Cooldown and any
                other pending mechanics. <br /> Remaining Monsters <br />
                Mak Items <br />
                Skills
              </p>
            </div>
            <div className="faq-item">
              <h2 className="text-[#e0ac54] text-3xl font-bold mb-4">
                Help Us Bring El to Life
              </h2>
              <p className="text-white text-lg">
                This started as a project among a handful of us who all share a
                love for games. Now we need your help to push it to the next
                stage. One of the heroes we’re dreaming of bringing to life is
                El. &nbsp;
                <Link
                  to="/hero-info"
                  className="text-[#e0ac54] hover:text-[#F1D5BD]"
                >
                  Click here to learn more &nbsp;
                </Link>
                and help us make this vision a reality. <br /> You can {" "}
                {
                  <a
                    href="http://buymeacoffee.com/jimmytba"
                    target="_blank"
                    className="text-[#e0ac54] hover:text-[#F1D5BD]"
                  >
                    Buy us a coffee
                  </a>
                }{" "}
                to help shape the future of the game.
              </p>
            </div>
            {/* FAQ Item 6 */}
            <div className="faq-item">
              <h2 className="text-[#e0ac54] text-3xl font-bold mb-4">
                Optimizer
              </h2>
              <p className="text-white text-lg">
                With a single click, unleash the full power of optimization.
                Instantly test if a new item strengthens your build. No
                guesswork, every possible combination is tested to reveal the
                ultimate setup.
              </p>
            </div>
            {/* FAQ Item 7 */}
            <div className="faq-item">
              <h2 className="text-[#e0ac54] text-3xl font-bold mb-4">
                Creator's Kit
              </h2>
              <p className="text-white text-lg">
                Create your own items, skills, monsters, and more in a
                community-driven system where your imagination shapes the game.
                Design original content, even with entirely new mechanics, and
                see it come to life in custom game modes built around the most
                creative contributions.
              </p>
            </div>
            {/* FAQ Item 78*/}
            {/* Feature Item 6 */}
            <div className="feature-item">
              <h2 className="text-[#e0ac54] text-3xl font-bold mb-4">
                Quality of Life Improvements
              </h2>
              <p className="text-white text-lg">
                Quick Image Setup: Upload a screenshot to auto-setup the board
                <br />
                Search filters: Find items and skills easily
              </p>
            </div>
            <div className="feature-item">
              <h2 className="text-[#e0ac54] text-3xl font-bold mb-4">
                Ranked Ladder
              </h2>
              <p className="text-white text-lg">
                Compete for the best setups in a thrilling new format that
                rewards both strategy and creativity
                <br />
                offering a fresh and balanced way to showcase your skills.
              </p>
            </div>
          </div>
        </div>

        {/* Support Banner fixed at Bottom */}
        <SupportBanner
        currentPage="features"
        isVisible={supportBannerVisible}
        setIsVisible={setSupportBannerVisible}
      />
      </div>
    </div>
  );
};

export default UpcomingFeatures;
