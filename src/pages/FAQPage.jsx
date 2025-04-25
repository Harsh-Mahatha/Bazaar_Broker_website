import React, { useState } from "react";
import Bread from "../assets/Images/BreadBG.png";
import SupportBanner from "../components/SupportBanner";
import { Link } from "react-router-dom";
import ContactForm from "../components/ContactForm";

export default function FAQPage({ setCurrentPage }) {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false); // Add state
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
            <span className="text-[#4a2d00]">FAQ</span>
          </div>
        </div>
        {/* FAQ Content */}
        <div className="relative rounded-lg p-7 w-[1100px] max-w-full mt-[-40px] mb-[70px]">
          <div className="mt-10 flex flex-col space-y-8">
            {/* FAQ Item 1 */}
            <div className="faq-item">
              <h2 className="text-[#e0ac54] text-3xl font-bold mb-4">
                What is Bazaar Broker?
              </h2>
              <p className="text-white text-lg">
                As a player, one thing that always annoyed me was figuring out
                whether something should go on the or of the core. 😅 I can't be
                the only one who's spent way too much time doing the or
                second-guessing myself. So, I started building a little to help
                with that! <br /> <br /> This website is an unofficial fan-made
                tools designed to assist players of The Bazaar. We are not
                affiliated with, endorsed by, or connected to the developers or
                publishers of The Bazaar in any way. All game-related names,
                images, and intellectual property belong to their respective
                owners.
              </p>
            </div>

            {/* FAQ Item 2 */}
            <div className="faq-item">
              <h2 className="text-[#e0ac54] text-3xl font-bold mb-4">
                Contact Us
              </h2>
              <p className="text-white text-lg">
                Feel free to ask us any questions.
              </p>
              <button
                onClick={() => setIsContactFormOpen(true)}
                className="mt-4 bg-[#e0ac54] text-white py-2 px-4 rounded hover:bg-[#F1D5BD] transition-colors"
              >
                Contact Us
              </button>
              <ContactForm
                isOpen={isContactFormOpen}
                onClose={() => setIsContactFormOpen(false)}
              />
            </div>

            {/* FAQ Item 3 */}
            <div className="faq-item">
              <h2 className="text-[#e0ac54] text-3xl font-bold mb-4">
                When will everything be ready?
              </h2>
              <p className="text-white text-lg">
                We are working on adding all the heroes. You can find more
                information on our
                <span
                  onClick={() => setCurrentPage("features")}
                  className="text-[#e0ac54] hover:text-[#F1D5BD] cursor-pointer"
                >
                  {" "}
                  Coming Soon
                  {" "}
                </span>
                page As we are still in Beta, some of the mechanics may be
                missing.
              </p>
            </div>

            {/* FAQ Item 4 */}
            <div className="faq-item">
              <h2 className="text-[#e0ac54] text-3xl font-bold mb-4">
                Why us ?
              </h2>
              <p className="text-white text-lg">
                The once handsome Reynad started{" "}
                {
                  <a
                    href="https://youtu.be/U13a2hawk3I?si=NfjF1ZoivgCJljpA"
                    target="_blank"
                    className="text-[#e0ac54] hover:text-[#F1D5BD] cursor-pointer"
                  >
                    The Bazaar
                  </a>
                }{" "}
                6 years ago. We're aiming to outdo that in just 6 months.
              </p>
            </div>
            {/* FAQ Item 5 */}
            <div className="faq-item">
              <h2 className="text-[#e0ac54] text-3xl font-bold mb-4">
                What's next?
              </h2>
              <p className="text-white text-lg">
                Card editor <br /> Enchantments <br /> Internal Cooldown and any
                other pending mechanics. <br /> Remaining Monsters <br />
                Dooley, Pyg, Mak Items <br />
                Skills
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
                and help us make this vision a reality. <br /> Your support on {" "}
                {
                  <a
                    href="https://www.kickstarter.com/projects/21925837/bazaar-broker?ref=pdzg1h"
                    target="_blank"
                    className="text-[#e0ac54] hover:text-[#F1D5BD]"
                  >
                    Kickstarter
                  </a>
                }{" "}
                will help shape the future of the game.
              </p>
            </div>
          </div>

          {/* Support Banner fixed at Bottom */}
          <SupportBanner />
        </div>
      </div>
    </div>
  );
}
