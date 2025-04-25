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
                the only one who's spent way too much time doing the math or
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

            {/* FAQ Item 5 */}
            
          </div>

          {/* Support Banner fixed at Bottom */}
          <SupportBanner />
        </div>
      </div>
    </div>
  );
}
