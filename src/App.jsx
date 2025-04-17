import { useState } from "react";
import Navigation from "./components/Navigation";
import BattlePage from "./pages/BattlePage";
import FAQPage from "./pages/FAQPage";
import UpcomingFeaturesPage from "./pages/UpcomingFeaturesPage";
import Background from "./assets/Images/BG.png";
import BBG from "./assets/Images/BattleBG.png";
import Logo from "./assets/Images/Logo.png";
import "./App.css";
export default function App() {
  const [currentPage, setCurrentPage] = useState("battle");

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="fixed inset-0 w-full h-full">
        <img 
          src={currentPage === "battle" ? BBG : Background} 
          alt="" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="relative z-10 flex flex-col items-center p-6 min-h-screen">
        <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />

        {currentPage === "battle" ? (
          <BattlePage />
        ) : currentPage === "faq" ? (
          <FAQPage setCurrentPage={setCurrentPage} />
        ) : currentPage === "features" ? (
          <UpcomingFeaturesPage setCurrentPage={setCurrentPage} />
        ) : null}

        {currentPage === "battle" && (
          <img
            src={Logo}
            alt="Logo"
            className="fixed bottom-0 right-[-20px] w-80 h-80 object-contain z-50 drop-shadow-2xl mb-[-100px]"
          />
        )}
      </div>
    </div>
  );
}
