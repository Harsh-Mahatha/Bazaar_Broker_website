// import React, { useState, useEffect } from "react";
// import Bread from "../assets/Images/BreadBG.png";
// import SupportBanner from "../components/SupportBanner";
// import { FaSearch } from "react-icons/fa";

// export default function SettingsPage({ setCurrentPage }) {
//   const [activeCategory, setActiveCategory] = useState("Cosmetics");
//   const [selectedSkin, setSelectedSkin] = useState("City");
  
//   // Function to save selected skin to localStorage
//   useEffect(() => {
//     // Load saved skin preference on component mount
//     const savedSkin = localStorage.getItem("selectedGameMatSkin");
//     if (savedSkin) {
//       setSelectedSkin(savedSkin);
//     }
//   }, []);
  
//   // Save skin preference when it changes
//   useEffect(() => {
//     localStorage.setItem("selectedGameMatSkin", selectedSkin);
//   }, [selectedSkin]);
  
//   // Categories and their settings
//   const categories = [
//     "General",
//     "Cosmetics",
//     "Audio",
//     "Graphics",
//     "Controls",
//     "Account"
//   ];
  
//   // Game mat skin options with images
//   const skinOptions = [
//     { name: "City", image: "/public/setting2.png" },
//     { name: "Metallic", image: "/public/setting5.png" },
//     { name: "Stone", image: "/public/setting3.png" },
//     { name: "Marble", image: "/public/setting4.png" }
//   ];
  
//   // Render settings content based on active category
//   const renderSettingsContent = () => {
//     switch (activeCategory) {
//       case "Cosmetics":
//         return (
//           <div className="setting-section">
//             <h2 className="text-2xl font-bold mb-6">Cosmetics</h2>
            
//             <div className="mb-8">
//               <h3 className="text-xl font-semibold mb-4">Game Mat Skin:</h3>
//               <div className="flex gap-4">
//                 {skinOptions.map((skin) => (
//                   <div 
//                     key={skin.name}
//                     className={`cursor-pointer overflow-hidden ${selectedSkin === skin.name ? 'border-[#e0ac54]' : 'border-[#e0ac54] border-opacity-50'}`}
//                     onClick={() => setSelectedSkin(skin.name)}
//                   >
//                     <div className="w-24 h-16 overflow-hidden border border-[#e0ac54] rounded-md">
//                       <img 
//                         src={skin.image} 
//                         alt={`${skin.name} skin`}
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                     <p className="text-center py-1 mt-1 text-[#4a2d00]">{skin.name}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         );
//       case "General":
//         return (
//           <div className="setting-section">
//             <h2 className="text-2xl font-bold mb-6">General</h2>
//             <div className="mb-4">
//               <h3 className="text-xl font-semibold mb-2">Language:</h3>
//               <select className="bg-[#4a2d00] border border-[#e0ac54] text-white p-2 rounded w-64">
//                 <option value="en">English</option>
//                 <option value="es">Spanish</option>
//                 <option value="fr">French</option>
//                 <option value="de">German</option>
//               </select>
//             </div>
//             <div className="mb-4">
//               <h3 className="text-xl font-semibold mb-2">Notifications:</h3>
//               <div className="flex items-center gap-2">
//                 <input type="checkbox" id="notifications" className="w-5 h-5" />
//                 <label htmlFor="notifications">Enable game notifications</label>
//               </div>
//             </div>
//           </div>
//         );
//       case "Audio":
//         return (
//           <div className="setting-section">
//             <h2 className="text-2xl font-bold mb-6">Audio</h2>
            
//             <div className="mb-4">
//               <h3 className="text-xl font-semibold mb-2">Master Volume:</h3>
//               <input type="range" className="w-full max-w-md" />
//             </div>
            
//             <div className="mb-4">
//               <h3 className="text-xl font-semibold mb-2">Music Volume:</h3>
//               <input type="range" className="w-full max-w-md" />
//             </div>
            
//             <div className="mb-4">
//               <h3 className="text-xl font-semibold mb-2">Sound Effects:</h3>
//               <input type="range" className="w-full max-w-md" />
//             </div>
            
//             <div className="mb-4">
//               <div className="flex items-center gap-2">
//                 <input type="checkbox" id="muteAll" className="w-5 h-5" />
//                 <label htmlFor="muteAll">Mute All</label>
//               </div>
//             </div>
//           </div>
//         );
//       case "Graphics":
//         return (
//           <div className="setting-section">
//             <h2 className="text-2xl font-bold mb-6">Graphics</h2>
            
//             <div className="mb-4">
//               <h3 className="text-xl font-semibold mb-2">Quality:</h3>
//               <select className="bg-[#4a2d00] border border-[#e0ac54] text-white p-2 rounded w-64">
//                 <option value="low">Low</option>
//                 <option value="medium">Medium</option>
//                 <option value="high">High</option>
//                 <option value="ultra">Ultra</option>
//               </select>
//             </div>
            
//             <div className="mb-4">
//               <h3 className="text-xl font-semibold mb-2">Resolution:</h3>
//               <select className="bg-[#4a2d00] border border-[#e0ac54] text-white p-2 rounded w-64">
//                 <option value="1280x720">1280x720</option>
//                 <option value="1920x1080">1920x1080</option>
//                 <option value="2560x1440">2560x1440</option>
//                 <option value="3840x2160">3840x2160</option>
//               </select>
//             </div>
            
//             <div className="mb-4">
//               <div className="flex items-center gap-2">
//                 <input type="checkbox" id="fullscreen" className="w-5 h-5" />
//                 <label htmlFor="fullscreen">Fullscreen</label>
//               </div>
//             </div>
//           </div>
//         );
//       case "Controls":
//         return (
//           <div className="setting-section">
//             <h2 className="text-2xl font-bold mb-6">Controls</h2>
            
//             <div className="mb-4">
//               <h3 className="text-xl font-semibold mb-2">Mouse Sensitivity:</h3>
//               <input type="range" className="w-full max-w-md" />
//             </div>
            
//             <div className="mb-4">
//               <div className="flex items-center gap-2">
//                 <input type="checkbox" id="invertMouse" className="w-5 h-5" />
//                 <label htmlFor="invertMouse">Invert Mouse</label>
//               </div>
//             </div>
            
//             <div className="mb-6">
//               <h3 className="text-xl font-semibold mb-2">Key Bindings:</h3>
//               <button className="bg-[#b8860b] text-white py-2 px-4 rounded hover:bg-[#8b6508] transition-colors">
//                 Configure Key Bindings
//               </button>
//             </div>
//           </div>
//         );
//       case "Account":
//         return (
//           <div className="setting-section">
//             <h2 className="text-2xl font-bold mb-6">Account</h2>
            
//             <div className="mb-4">
//               <h3 className="text-xl font-semibold mb-2">User Profile:</h3>
//               <div className="bg-[#4a2d00] p-4 rounded max-w-md">
//                 <p><strong>Username:</strong> Player123</p>
//                 <p><strong>Email:</strong> player123@example.com</p>
//                 <p><strong>Account Created:</strong> January 1, 2024</p>
//               </div>
//             </div>
            
//             <div className="mb-4 flex gap-4">
//               <button className="bg-[#b8860b] text-white py-2 px-4 rounded hover:bg-[#8b6508] transition-colors">
//                 Change Password
//               </button>
//               <button className="bg-[#b8860b] text-white py-2 px-4 rounded hover:bg-[#8b6508] transition-colors">
//                 Update Profile
//               </button>
//             </div>
            
//             <div className="mb-4 mt-8">
//               <button className="bg-red-800 text-white py-2 px-4 rounded hover:bg-red-900 transition-colors">
//                 Log Out
//               </button>
//             </div>
//           </div>
//         );
//       default:
//         return <div>Select a category from the sidebar</div>;
//     }
//   };

//   return (
//      <div className="flex flex-col items-center min-h-screen p-4 bg-[#3d2413] bg-opacity-90"
//          style={{
//            backgroundImage: "url('/setting_page_asset_1.png')",
//            backgroundSize: "cover",
//            backgroundRepeat: "no-repeat"
//          }}
//          role="main">
//       <div className="relative flex flex-col items-center w-full">
//         {/* Breadcrumb at the top */}
//         <div
//           className="relative w-[500px] h-[81px] flex items-center justify-center mb-[10px] z-10"
//           style={{
//             backgroundImage: `url(${Bread})`,
//             backgroundSize: "contain",
//             backgroundRepeat: "no-repeat",
//             backgroundPosition: "center",
//           }}
//         >
//           <div className="flex items-center space-x-2 text-[#4a2d00] font-semibold">
//             <button
//               onClick={() => setCurrentPage("battle")}
//               className="cursor-pointer hover:text-[#e0ac54] transition-colors"
//               aria-label="Go to Home"
//             >
//               Home
//             </button>
//             <span>|</span>
//             <button
//               className="cursor-pointer hover:text-[#e0ac54] transition-colors"
//               aria-label="Go to FAQ"
//             >
//               FAQ
//             </button>
//             <span>|</span>
//             <span className="text-[#4a2d00]">Settings</span>
//           </div>
//         </div>

//         {/* Settings Content */}
//         <div className="relative w-[1100px] max-w-full mb-[70px]">
//           {/* Main settings panel with decorative border */}
//           <div className="bg-[#f8e9d5] rounded-lg p-6 relative">
//             {/* Decorative border overlay */}
//             <div className="absolute inset-0 pointer-events-none border-[#e0ac54] border-2 rounded-lg" 
//                  style={{
//                    backgroundImage: "url('/path/to/border-decoration.png')",
//                    backgroundSize: "100% 100%",
//                    backgroundRepeat: "no-repeat"
//                  }}>
//             </div>
            
//             {/* Search Bar */}
//             <div className="mb-6 flex justify-center relative z-10">
//               <div className="relative w-full max-w-lg">
//                 <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8b6508]" />
//                 <input
//                   type="text"
//                   placeholder="Search setting"
//                   className="w-full py-3 pl-10 pr-4 bg-[#ffecd1] border border-[#e0ac54] rounded-md text-[#4a2d00] focus:outline-none focus:ring-2 focus:ring-[#e0ac54]"
//                 />
//               </div>
//             </div>

//             <div className="flex relative z-10">
//               {/* Settings Categories Sidebar with vertical divider */}
//               <div className="w-64 pr-4 border-r-2 border-[#e0ac54] border-opacity-30">
//                 {categories.map((category) => (
//                   <button
//                     key={category}
//                     onClick={() => setActiveCategory(category)}
//                     className={`flex items-center p-3 w-full font-semibold text-left mb-1 ${
//                       activeCategory === category
//                         ? "bg-[#e0ac54] text-[#4a2d00] rounded-md"
//                         : "text-[#4a2d00] hover:bg-[#f0d9b5]"
//                     }`}
//                   >
//                     <span className="mr-2 text-lg">
//                       {activeCategory === category ? "◆" : "◇"}
//                     </span>
//                     {category}
//                   </button>
//                 ))}
//               </div>

//               {/* Settings Content Area */}
//               <div className="flex-1 pl-8 pr-4">
//                 <div className="bg-[#fff5e6] p-6 rounded-lg shadow-sm">
//                   {renderSettingsContent()}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Support Banner fixed at Bottom */}
//           <SupportBanner />
//         </div>
//       </div>
//     </div>
//   );
// }


// import React, { useState, useEffect } from "react";
// import Bread from "../assets/Images/BreadBG.png";
// import SupportBanner from "../components/SupportBanner";
// import { FaSearch } from "react-icons/fa";

// export default function SettingsPage({ setCurrentPage }) {
//   const [activeCategory, setActiveCategory] = useState("Cosmetics");
//   const [selectedSkin, setSelectedSkin] = useState("City");
  
//   // Function to load saved skin preference on component mount
//   useEffect(() => {
//     const savedSkin = localStorage.getItem("selectedGameMatSkin");
//     if (savedSkin) {
//       setSelectedSkin(savedSkin);
//     }
//   }, []);
  
//   // Save skin preference when it changes
//   useEffect(() => {
//     localStorage.setItem("selectedGameMatSkin", selectedSkin);
//   }, [selectedSkin]);
  
//   // Categories
//   const categories = ["Cosmetics"];
  
//   // Game mat skin options with images
//   const skinOptions = [
//     { name: "City", image: "/public/setting2.png" },
//     { name: "Metallic", image: "/public/setting5.png" },
//     { name: "Stone", image: "/public/setting3.png" },
//     { name: "Marble", image: "/public/setting4.png" }
//   ];

//   return (
//     <div className="flex flex-col items-center min-h-screen p-4 bg-[#3d2413] bg-opacity-90"
//         style={{
//           backgroundImage: "url('/setting_page_asset_1.png')",
//           backgroundSize: "cover",
//           backgroundRepeat: "no-repeat"
//         }}
//         role="main">
//       <div className="relative flex flex-col items-center w-full">
//         {/* Breadcrumb at the top */}
//         <div
//           className="relative w-[500px] h-[81px] flex items-center justify-center mb-[10px] z-10"
//           style={{
//             backgroundImage: `url(${Bread})`,
//             backgroundSize: "contain",
//             backgroundRepeat: "no-repeat",
//             backgroundPosition: "center",
//           }}
//         >
//           <div className="flex items-center space-x-2 text-[#4a2d00] font-semibold">
//             <button
//               onClick={() => setCurrentPage("battle")}
//               className="cursor-pointer hover:text-[#e0ac54] transition-colors"
//               aria-label="Go to Home"
//             >
//               Home
//             </button>
//             <span>|</span>
//             <button
//               className="cursor-pointer hover:text-[#e0ac54] transition-colors"
//               aria-label="Go to FAQ"
//             >
//               FAQ
//             </button>
//             <span>|</span>
//             <span className="text-[#4a2d00]">Settings</span>
//           </div>
//         </div>

//         {/* Settings Content */}
//         <div className="relative w-[1100px] max-w-full mb-[70px]">
//           {/* Main settings panel with decorative border */}
//           <div className="bg-[#f8e9d5] rounded-lg p-6 relative">
//             {/* Decorative border overlay */}
//             <div className="absolute inset-0 pointer-events-none border-[#e0ac54] border-2 rounded-lg" 
//                  style={{
//                    backgroundImage: "url('/path/to/border-decoration.png')",
//                    backgroundSize: "100% 100%",
//                    backgroundRepeat: "no-repeat"
//                  }}>
//             </div>
            
//             {/* Search Bar */}
//             <div className="mb-6 flex justify-center relative z-10">
//               <div className="relative w-full max-w-lg">
//                 <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8b6508]" />
//                 <input
//                   type="text"
//                   placeholder="Search setting"
//                   className="w-full py-3 pl-10 pr-4 bg-[#ffecd1] border border-[#e0ac54] rounded-md text-[#4a2d00] focus:outline-none focus:ring-2 focus:ring-[#e0ac54]"
//                 />
//               </div>
//             </div>

//             <div className="flex relative z-10">
//               {/* Settings Categories Sidebar with vertical divider */}
//               <div className="w-64 pr-4 border-r-2 border-[#e0ac54] border-opacity-30">
//                 {categories.map((category) => (
//                   <button
//                     key={category}
//                     onClick={() => setActiveCategory(category)}
//                     className={`flex items-center p-3 w-full font-semibold text-left mb-1 ${
//                       activeCategory === category
//                         ? "bg-[#e0ac54] text-[#4a2d00] rounded-md"
//                         : "text-[#4a2d00] hover:bg-[#f0d9b5]"
//                     }`}
//                   >
//                     <span className="mr-2 text-lg">
//                       {activeCategory === category ? "◆" : "◇"}
//                     </span>
//                     {category}
//                   </button>
//                 ))}
//               </div>

//               {/* Settings Content Area */}
//               <div className="flex-1 pl-8 pr-4">
//                 <div className="bg-[#fff5e6] p-6 rounded-lg shadow-sm">
//                   <div className="setting-section">
//                     <h2 className="text-2xl font-bold mb-6">Cosmetics</h2>
                    
//                     <div className="mb-8">
//                       <h3 className="text-xl font-semibold mb-4">Game Mat Skin:</h3>
//                       <div className="flex flex-wrap justify-center gap-8">
//                         {skinOptions.map((skin) => (
//                           <div 
//                             key={skin.name}
//                             className={`cursor-pointer overflow-hidden ${selectedSkin === skin.name ? 'border-[#e0ac54]' : 'border-[#e0ac54] border-opacity-50'}`}
//                             onClick={() => setSelectedSkin(skin.name)}
//                           >
//                             <div className="w-32 h-24 overflow-hidden border border-[#e0ac54] rounded-md">
//                               <img 
//                                 src={skin.image} 
//                                 alt={`${skin.name} skin`}
//                                 className="w-full h-full object-cover"
//                               />
//                             </div>
//                             <p className="text-center py-1 mt-1 text-[#4a2d00]">{skin.name}</p>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Support Banner fixed at Bottom */}
//           <SupportBanner />
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import Bread from "../assets/Images/BreadBG.png";
import SupportBanner from "../components/SupportBanner";
import { FaSearch } from "react-icons/fa";

export default function SettingsPage({ setCurrentPage }) {
  const [activeCategory, setActiveCategory] = useState("Cosmetics");
  const [selectedSkin, setSelectedSkin] = useState("City");
  
  // Function to load saved skin preference on component mount
  useEffect(() => {
    const savedSkin = localStorage.getItem("selectedGameMatSkin");
    if (savedSkin) {
      setSelectedSkin(savedSkin);
    }
  }, []);
  
  // Save skin preference when it changes
  useEffect(() => {
    localStorage.setItem("selectedGameMatSkin", selectedSkin);
  }, [selectedSkin]);
  
  // Categories
  const categories = ["Cosmetics"];
  
  // Game mat skin options with images
  const skinOptions = [
    { name: "City", image: "/public/setting2.png" },
    { name: "Metallic", image: "/public/setting5.png" },
    { name: "Stone", image: "/public/setting3.png" },
    { name: "Marble", image: "/public/setting4.png" }
  ];

  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-[#3d2413] bg-opacity-90"
        style={{
          backgroundImage: "url('/setting_page_asset_1.png')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat"
        }}
        role="main">
      <div className="relative flex flex-col items-center w-full">
        {/* Breadcrumb at the top */}
        <div
          className="relative w-[500px] h-[81px] flex items-center justify-center mb-[10px] z-10"
          style={{
            backgroundImage: `url(${Bread})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
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
        <div className="relative w-[1100px] max-w-full mb-[70px]">
          {/* Main settings panel with decorative border */}
          <div className="bg-[#f8e9d5] rounded-lg p-6 relative">
            {/* Decorative border overlay */}
            <div className="absolute inset-0 pointer-events-none border-[#e0ac54] border-2 rounded-lg" 
                 style={{
                   backgroundImage: "url('/path/to/border-decoration.png')",
                   backgroundSize: "100% 100%",
                   backgroundRepeat: "no-repeat"
                 }}>
            </div>
            
            {/* Search Bar */}
            <div className="mb-6 flex justify-center relative z-10">
              <div className="relative w-full max-w-lg">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8b6508]" />
                <input
                  type="text"
                  placeholder="Search setting"
                  className="w-full py-3 pl-10 pr-4 bg-[#ffecd1] border border-[#e0ac54] rounded-md text-[#4a2d00] focus:outline-none focus:ring-2 focus:ring-[#e0ac54]"
                />
              </div>
            </div>

            <div className="flex relative z-10">
              {/* Settings Categories Sidebar with vertical divider */}
              <div className="w-64 pr-4 border-r-2 border-[#e0ac54] border-opacity-30">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`flex items-center p-3 w-full font-semibold text-left mb-1 ${
                      activeCategory === category
                        ? "bg-[#e0ac54] text-[#4a2d00] rounded-md"
                        : "text-[#4a2d00] hover:bg-[#f0d9b5]"
                    }`}
                  >
                    <span className="mr-2 text-lg">
                      {activeCategory === category ? "◆" : "◇"}
                    </span>
                    {category}
                  </button>
                ))}
              </div>

              {/* Settings Content Area */}
              <div className="flex-1 pl-8 pr-4">
                <div className="bg-[#fff5e6] p-6 rounded-lg shadow-sm">
                  <div className="setting-section">
                    <h2 className="text-2xl font-bold mb-6">Cosmetics</h2>
                    
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold mb-4">Game Mat Skin:</h3>
                      <div className="flex flex-wrap justify-center gap-8">
                        {skinOptions.map((skin) => (
                          <div 
                            key={skin.name}
                            className={`cursor-pointer transition-all duration-200 ${
                              selectedSkin === skin.name 
                                ? 'border-2 border-[#e0ac54] rounded-md p-1 bg-[#fff0d9]' 
                                : 'border border-transparent p-1 hover:border-[#e0ac54] hover:bg-[#fff8e9] rounded-md'
                            }`}
                            onClick={() => setSelectedSkin(skin.name)}
                          >
                            <div className="w-32 h-24 overflow-hidden border border-[#e0ac54] rounded-md">
                              <img 
                                src={skin.image} 
                                alt={`${skin.name} skin`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <p className="text-center py-1 mt-1 font-medium text-[#4a2d00]">{skin.name}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Support Banner fixed at Bottom */}
          <SupportBanner />
        </div>
      </div>
    </div>
  );
}