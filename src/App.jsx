import SettingsPage from "./pages/SettingsPage";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import BattlePage from "./pages/BattlePage";
import FAQPage from "./pages/FAQPage";
import UpcomingFeaturesPage from "./pages/UpcomingFeaturesPage";
import HeroInfoPage from "./pages/HeroPage";
import Background from "./assets/Images/BG.png";
import BBG from "./assets/Images/BattleBG.png";
import Logo from "./assets/Images/Logo.png";
import LoadingScreen from "./components/LoadingScreen";
import LoadingGif from "./assets/Images/Loading.gif";
import MobileWarning from "./components/MobileWarning";

import "./App.css";

export default function App() {
  const [currentPage, setCurrentPage] = useState("battle");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Add timeout failsafe
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    // Function to check if all images are loaded
    const loadImages = async () => {
      const imageUrls = [Background, BBG, Logo];

      try {
        const loadPromises = imageUrls.map((url) => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = url;
            img.onload = resolve;
            img.onerror = reject;
          });
        });

        await Promise.all(loadPromises);
        clearTimeout(timeoutId); // Clear timeout if images load successfully
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading images:", error);
        setIsLoading(false);
      }
    };

    // Listen for window load event
    window.addEventListener("load", loadImages);

    return () => {
      window.removeEventListener("load", loadImages);
      clearTimeout(timeoutId); // Clean up timeout on component unmount
    };
  }, []);

  const MainContent = () => (
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
        ) : currentPage === "settings" ? (
          <SettingsPage setCurrentPage={setCurrentPage} />
        ) : null}
        <img
          src={Logo}
          alt="Logo"
          className="fixed bottom-0 right-[8px] w-60 h-60 object-contain z-50 drop-shadow-2xl mb-[-70px]"
        />
      </div>
    </div>
  );

  return (
    <>
      {isLoading ? (
        <LoadingScreen loadingGif={LoadingGif} />
      ) : (
        <BrowserRouter>
          <MobileWarning />
          <Routes>
            <Route path="/" element={<MainContent />} />
            <Route path="/home" element={<BattlePage />} /> {/* Home Route */}
            <Route path="/faq" element={<FAQPage setCurrentPage={setCurrentPage} />} /> {/* Pass setCurrentPage */}
            <Route path="/hero-info" element={<HeroInfoPage />} />
            <Route path="/settings" element={<SettingsPage setCurrentPage={setCurrentPage} />} />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
}