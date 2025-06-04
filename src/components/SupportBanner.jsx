import React, { useCallback } from "react";
import Banner from "../assets/Images/Banner.png";
import Cross from "../assets/Images/Close.png";

export default function SupportBanner({
  currentPage,
  isVisible,
  setIsVisible,
}) {
  const isBattlePage = currentPage === "battle";

  const handleClose = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Use RAF to ensure state update happens outside current render cycle
    requestAnimationFrame(() => {
      setIsVisible(false);
    });
  }, [setIsVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 w-full h-[105px] z-50 flex justify-center items-center pointer-events-none"
      style={{
        backgroundImage: `url(${Banner})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <div className="mt-[15px] w-full max-w-screen-xl flex justify-between items-center px-10">
        <div className="relative bg-[#f9f3e8] border-2 border-[#e0ac54] rounded-md p-6 w-[700px] h-[80px] shadow-md ml-[250px] flex justify-between items-center mb-[12px] pointer-events-auto">
          {isBattlePage && (
            <button
              onClick={handleClose}
              className="absolute top-[-10px] right-[-10px] hover:opacity-80 z-50"
              aria-label="Close banner"
            >
              <img src={Cross} alt="Close" className="w-6 h-6" />
            </button>
          )}
          <div className="text-[#4a2d00] text-xl leading-8">
            <p>
              We would love to create our own game.
            </p>
          </div>
          <button
            className="bg-[#4a2d00] hover:bg-[#e0ac54] text-white font-semibold px-6 py-2 rounded-xl transition-colors mr-[30px]"
            onClick={() =>
              window.open(
                "http://buymeacoffee.com/jimmytba",
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