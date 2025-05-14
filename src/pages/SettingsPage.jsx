import React from "react";
import Bread from "../assets/Images/BreadBG.png";
import { useSkin } from "../context/SkinContext";

export default function SettingsPage({ setCurrentPage }) {
  const { selectedSkin, updateSkin } = useSkin();

  // Categories
  const categories = ["Cosmetics"];

  // Game mat skin options with images
  const skinOptions = [
    { name: "City", image: "/City.png" },
    { name: "Metallic", image: "/Metallic.png" },
    { name: "FutureGlow",image: "/ThirdSkin.png" },
  ];

  return (
    <>
      {/* Breadcrumb - Moved outside main content div */}
      <div
        className="relative w-[500px] h-[81px] flex items-center justify-center z-10 mx-auto top-[-15px]"
        style={{
          backgroundImage: `url(${Bread})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          marginBottom: "0px",
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
          <span>{">"}</span>
          <span className="text-[#4a2d00]">Settings</span>
        </div>
      </div>

      {/* Main content with background */}
      <div
        className="w-[75%] aspect-[16/9] flex flex-col items-center max-w-[1920px] mx-auto bg-[url('/src/assets/Images/SettingsPanel.png')] bg-contain bg-top bg-no-repeat"
        role="main"
      >
        {/* Settings Content */}
        <div
          className="relative w-[1100px] max-w-full flex justify-center items-center top-[60px]"
          style={{
            borderRadius: "10px",
            padding: "-30px",
          }}
        >
          {/* Game Mat Skin Options */}
          <div className="mb-0 text-center">
            <h3 className="text-3xl text-[#4a2d00] font-semibold mb-[100px]">Game Mat Skins:</h3>
            <div className="flex flex-wrap justify-center gap-[100px]">
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
    </>
  );
}
