import { useState, useEffect } from "react";

export default function Navigation({ currentPage, setCurrentPage }) {
  const [isMenuOpen, setIsMenuOpen] = useState(currentPage === "battle");

  useEffect(() => {
    if (currentPage === "battle") {
      setIsMenuOpen(true);
    }
  }, [currentPage]);

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-[#575757] hover:bg-[#4a2d00] transition-all"
      >
        <img
          src={isMenuOpen ? "/Icons/close.svg" : "/Icons/ham.svg"}
          alt={isMenuOpen ? "Close menu" : "Open menu"}
          className={isMenuOpen ? "w-6 h-6" : "w-8 h-8"}
        />
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-[#4a2d00]/90 backdrop-blur-md ring-1 ring-[#f9f3e8] ring-opacity-5">
          <div className="py-1">
            <button
              onClick={() => {
                setCurrentPage("battle");
                setIsMenuOpen(false);
              }}
              className={`block px-4 py-2 text-sm w-full text-left ${
                currentPage === "battle"
                  ? "text-[#f9f3e8]"
                  : "text-[#f9f3e8]/70"
              } hover:bg-[#613c00]`}
            >
              Home
            </button>
            <button
              onClick={() => {
                setCurrentPage("faq");
                setIsMenuOpen(false);
              }}
              className={`block px-4 py-2 text-sm w-full text-left ${
                currentPage === "faq" ? "text-[#f9f3e8]" : "text-[#f9f3e8]/70"
              } hover:bg-[#613c00]`}
            >
              FAQ
            </button>
            <button
              onClick={() => {
                setCurrentPage("features");
                setIsMenuOpen(false);
              }}
              className={`block px-4 py-2 text-sm w-full text-left ${
                currentPage === "features"
                  ? "text-[#f9f3e8]"
                  : "text-[#f9f3e8]/70"
              } hover:bg-[#613c00]`}
            >
              Coming Soon
            </button>
            <button
              onClick={() => {
                setCurrentPage("settings");
                setIsMenuOpen(false);
              }}
              className={`block px-4 py-2 text-sm w-full text-left ${
                currentPage === "settings"
                  ? "text-[#f9f3e8]"
                  : "text-[#f9f3e8]/70"
              } hover:bg-[#613c00]`}
            >
              Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
