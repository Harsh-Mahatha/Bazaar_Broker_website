import React from "react";
import Bread from "../assets/Images/BreadBG.png";
import { useSkin } from "../context/SkinContext"; // Import useSkin

export default function SettingsPage({ setCurrentPage }) {
  const { selectedSkin, updateSkin } = useSkin(); // Access SkinContext

  // Categories
  const categories = ["Cosmetics"];

  // Game mat skin options with images
  const skinOptions = [
    { name: "City", image: "/public/setting2.png" },
    { name: "Metallic", image: "/public/setting5.png" },
  ];

  return (
    <div
      style={{
        backgroundImage: "url('/src/assets/Images/settingbgnew.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: "50px", // Add padding to shift content down slightly
      }}
      role="main"
    >
      {/* Breadcrumb */}
      <div
        className="relative w-[500px] h-[81px] flex items-center justify-center z-10"
        style={{
          backgroundImage: `url(${Bread})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          marginBottom: "20px", // Add spacing below breadcrumb
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
          <span>|</span>
          <button
            onClick={() => setCurrentPage("faq")}
            className="cursor-pointer hover:text-[#e0ac54] transition-colors"
            aria-label="Go to FAQ"
          >
            FAQ
          </button>
          <span>|</span>
          <span className="text-[#4a2d00]">Settings</span>
        </div>
      </div>

      {/* Settings Content */}
      <div
        className="relative w-[1100px] max-w-full flex justify-center items-center"
        style={{
          borderRadius: "10px",
          padding: "20px",
          marginTop: "20px", // Adjust margin to shift content upwards
        }}
      >
        {/* Game Mat Skin Options */}
        <div className="mb-8 text-center">
          <h3 className="text-xl font-semibold mb-4">Game Mat Skin:</h3>
          <div className="flex flex-wrap justify-center gap-8">
            {skinOptions.map((skin) => (
              <div
                key={skin.name}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedSkin === skin.name
                    ? "border-2 border-[#e0ac54] rounded-md p-1 bg-[#fff0d9]"
                    : "border border-transparent p-1 hover:border-[#e0ac54] hover:bg-[#fff8e9] rounded-md"
                }`}
                onClick={() => updateSkin(skin.name)} // Update skin on click
              >
                <div className="w-32 h-24 overflow-hidden border border-[#e0ac54] rounded-md">
                  <img
                    src={skin.image}
                    alt={`${skin.name} skin`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-center py-1 mt-1 font-medium text-[#4a2d00]">
                  {skin.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}