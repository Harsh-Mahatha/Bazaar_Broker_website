import React, { useState, useRef } from "react";
import Bread from "../assets/Images/BreadBG.png";
import SupportBanner from "../components/SupportBanner";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import ContactForm from "../components/ContactForm";
import { FaEnvelope } from "react-icons/fa";
import { MdSettingsBackupRestore } from "react-icons/md";

export default function FAQPage({ setCurrentPage }) {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [supportBannerVisible, setSupportBannerVisible] = useState(true);
  const contactRef = useRef(null);
  const navigate = useNavigate(); // Initialize useNavigate

  // FAQ data for easier management
  const faqItems = [
    {
      question: "What is Bazaar Broker?",
      answer: (
        <>
          As a player, one thing that always annoyed me was figuring out whether
          something should go on the or of the core. 😅 I can't be the only one
          who's spent way too much time doing the math or second-guessing
          myself. So, I started building a little to help with that! <br />{" "}
          <br /> This website is an unofficial fan-made tools designed to assist
          players of The Bazaar. We are not affiliated with, endorsed by, or
          connected to the developers or publishers of The Bazaar in any way.
          All game-related names, images, and intellectual property belong to
          their respective owners.
        </>
      ),
    },
    {
      question: "Contact Us",
      answer: (
        <div className="flex flex-col">
          <span>Feel free to ask us any questions.</span>
          <div ref={contactRef}>
            <button
              onClick={() => {
                setIsContactFormOpen(true);
                setTimeout(() => {
                  contactRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                }, 100);
              }}
              className="mt-4 bg-[#b8860b] text-white py-2 px-4 rounded hover:bg-[#8b6508] transition-colors font-bold shadow-lg flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#e0ac54]"
              aria-label="Open Contact Us form"
            >
              <FaEnvelope /> Contact Us
            </button>
            {isContactFormOpen && (
              <ContactForm
                isOpen={isContactFormOpen}
                onClose={() => setIsContactFormOpen(false)}
              />
            )}
          </div>
        </div>
      ),
    },
    {
      question: "When will everything be ready?",
      answer: (
        <>
          We are working on adding all the heroes. You can find more information
          on our
          <span
            onClick={() => setCurrentPage("features")}
            className="text-[#e0ac54] hover:text-[#F1D5BD] cursor-pointer"
          >
            {" "}
            Coming Soon{" "}
          </span>
          page. As we are still in Beta, some of the mechanics may be missing.
        </>
      ),
    },
  ];

  return (
    <div className="flex flex-col items-center min-h-screen p-4" role="main">
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
              aria-label="Go to Home"
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
            {faqItems.map((item, idx) => (
              <div className="faq-item" key={idx}>
                <h2 className="text-[#e0ac54] text-3xl font-bold mb-4">
                  {item.question}
                </h2>
                <p className="text-white text-lg">{item.answer}</p>
              </div>
            ))}
          </div>
          {/* Support Banner fixed at Bottom */}
          <SupportBanner
            currentPage="faq"
            isVisible={supportBannerVisible}
            setIsVisible={setSupportBannerVisible}
          />
        </div>
      </div>
    </div>
  );
}
