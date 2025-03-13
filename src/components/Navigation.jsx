import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navigation({ currentPage, setCurrentPage }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="text-[#4a2d00] p-2 rounded-full bg-[#f9f3e8] backdrop-blur-md hover:bg-[#4a2d00] hover:text-[#f9f3e8] transition-all"
      >
        {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
      </button>
      
      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-[#4a2d00]/90 backdrop-blur-md ring-1 ring-[#f9f3e8] ring-opacity-5">
          <div className="py-1">
            <button
              onClick={() => {
                setCurrentPage('battle');
                setIsMenuOpen(false);
              }}
              className={`block px-4 py-2 text-sm w-full text-left ${
                currentPage === 'battle' ? 'text-[#f9f3e8]' : 'text-[#f9f3e8]/70'
              } hover:bg-[#613c00]`}
            >
              Battle
            </button>
            <button
              onClick={() => {
                setCurrentPage('faq');
                setIsMenuOpen(false);
              }}
              className={`block px-4 py-2 text-sm w-full text-left ${
                currentPage === 'faq' ? 'text-[#f9f3e8]' : 'text-[#f9f3e8]/70'
              } hover:bg-[#613c00]`}
            >
              FAQ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}