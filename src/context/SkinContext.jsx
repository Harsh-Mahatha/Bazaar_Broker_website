import React, { createContext, useState, useContext } from "react";

const SkinContext = createContext();

export const SkinProvider = ({ children }) => {
  const [selectedSkin, setSelectedSkin] = useState(
    localStorage.getItem("selectedGameMatSkin") || "City"
  );

  // Save the selected skin to localStorage whenever it changes
  const updateSkin = (skin) => {
    setSelectedSkin(skin);
    localStorage.setItem("selectedGameMatSkin", skin);
  };

  return (
    <SkinContext.Provider value={{ selectedSkin, updateSkin }}>
      {children}
    </SkinContext.Provider>
  );
};

export const useSkin = () => useContext(SkinContext);