import { useState } from 'react';
import Navigation from './components/Navigation';
import BattlePage from './pages/BattlePage';
import FAQPage from './pages/FAQPage';
import Background from "./assets/Images/BG.png";
import Logo from "./assets/Images/Logo.png";

export default function App() {
  const [currentPage, setCurrentPage] = useState('battle');

  return (
    <div
      className="flex flex-col items-center p-6 bg-gray-900 text-white min-h-screen bg-cover relative"
      style={{ backgroundImage: `url(${Background})` }}
    >
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      {currentPage === 'battle' ? (
        <BattlePage />
      ) : currentPage === 'faq' ? (
        <FAQPage />
      ) : null}

      <img
        src={Logo}
        alt="Logo"
        className="fixed bottom-0 right-0 w-48 h-48 object-contain z-50 drop-shadow-2xl"
      />
    </div>
  );
}