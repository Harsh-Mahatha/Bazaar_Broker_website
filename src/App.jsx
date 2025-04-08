import { useState } from "react";
import Navigation from "./components/Navigation";
import BattlePage from "./pages/BattlePage";
import FAQPage from "./pages/FAQPage";
import UpcomingFeaturesPage from "./pages/UpcomingFeaturesPage";
import Background from "./assets/Images/BG.png";
import Logo from "./assets/Images/Logo.png";
import "./App.css";
export default function App() {
  const [currentPage, setCurrentPage] = useState("battle");

  return (
    <>
    <div
      className="flex flex-col items-center p-6 bg-gray-900 text-white min-h-screen bg-cover relative"
    >
      <img src={Background} alt="" className="absolute inset-0 w-full h-full" />
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {currentPage === "battle" ? (
        <BattlePage />
      ) : currentPage === "faq" ? (
        <FAQPage setCurrentPage={setCurrentPage} />
      ) : currentPage === "features" ? (
        <UpcomingFeaturesPage setCurrentPage={setCurrentPage} />
      ) : null}

      <img
        src={Logo}
        alt="Logo"
        className="fixed bottom-0 right-4 w-80 h-80 object-contain z-50 drop-shadow-2xl mb-[-90px]"
      />
    </div>
    </>
  );
}
