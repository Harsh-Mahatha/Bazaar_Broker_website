import React, { useState } from "react";
import Banner from "../assets/Images/Banner.png";
import Cross from "../assets/Images/Close.png";

export default function SupportBanner({
  currentPage,
  isVisible,
  setIsVisible,
}) {
  const isBattlePage = currentPage === "battle";

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 w-full h-[105px] z-50 flex justify-center items-center"
      style={{
        backgroundImage: `url(${Banner})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <div className="mt-[15px] w-full max-w-screen-xl flex justify-between items-center px-10">
        <div className="relative bg-[#f9f3e8] border-2 border-[#e0ac54] rounded-md p-6 w-[1040px] h-[80px] shadow-md ml-[78px] flex justify-between items-center mb-[12px]">
          {isBattlePage && (
            <button
              onClick={() => setIsVisible(false)}
              className="absolute top-[-10px] right-[-10px] hover:opacity-80 z-50"
              aria-label="Close banner"
            >
              <img src={Cross} alt="Close" className="w-6 h-6" />
            </button>
          )}
          <div className="text-[#4a2d00] text-base leading-8">
            <p>
              We would love to create our own game. We've launched a kickstarter
              page where you can show your support.
              <br />
              Why us: The handsome Reynad started{" "}
              {
                <a
                  href="https://youtu.be/U13a2hawk3I?si=NfjF1ZoivgCJljpA"
                  target="_blank"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  The Bazaar
                </a>
              }{" "}
              6 years ago. We're aiming to outdo that in just 6 months.
            </p>
          </div>
          <button
            className="bg-[#4a2d00] hover:bg-[#e0ac54] text-white font-semibold px-6 py-2 rounded-xl transition-colors"
            onClick={() =>
              window.open(
                "https://www.kickstarter.com/projects/21925837/bazaar-broker?ref=pdzg1h",
                "_blank"
              )
            }
          >
            Support Us
          </button>
        </div>
      </div>
    </div>
  );
}
