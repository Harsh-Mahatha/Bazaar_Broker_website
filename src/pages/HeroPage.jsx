import React from "react";
import Bread from "../assets/Images/HeroBread.png";
import { Link } from "react-router-dom";
const HeroInfoPage = ({ }) => {
  return (
    <div className="w-[1920px] h-[1080px] bg-gray-900 relative">
      {/* Background Image */}
      <div className="absolute inset-0 w-[1920px] h-[1080px]">
        <img src="/HeroBG.gif" alt="" className="w-full h-full object-cover" />
      </div>
      <div className="relative flex flex-col items-center w-[1920px] h-[1080px]">
        {/* Breadcrumb at the top */}
          <div
            className="absolute top-[5px] left-1/2 transform -translate-x-1/2 w-[500px] h-[81px] flex items-center justify-center z-10"
            style={{
              backgroundImage: `url(${Bread})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          >
            <div className="flex items-center space-x-2 text-purple-300 font-semibold">
              <Link 
                to="/"
                className="cursor-pointer hover:text-[#e0ac54] transition-colors"
              >
                Home
              </Link>
              <span>&gt;</span>
              <span className="text-gray-300">Hero</span>
            </div>
          </div>

          {/* Content Container */}
        <div className="absolute top-[300px] left-[250px] w-[750px]">
          <div className="space-y-10">
            <div>
              <h2 className="text-2xl text-purple-300 font-bold mb-4">
                El - The Hero Of Space And Time
              </h2>
              <p className="text-gray-300 mb-6">
                This hero harnesses the power of time and space manipulation to
                gain the upper hand.
              </p>
            </div>

            <div>
              <h3 className="text-lg text-purple-300 font-bold mb-2">
                Hero Ability - Temporal Erasure
              </h3>
              <p className="text-gray-300">
                Tired of seeing the same items over and over again in the shop?
                Now you can erase them from existence!
                <br />
                This new mechanic lets you shrink the item pool, making it
                easier to find exactly what you're looking for.
              </p>
            </div>

            <div>
              <h3 className="text-lg text-purple-300 font-bold mb-2">
                Hero Ability - Dimensional Recalibration
              </h3>
              <p className="text-gray-300">
                Through the art of Dimensional Recalibration, even the largest
                relics fold into a fraction of their form - items can be resized
              </p>
            </div>

            <div>
              <h4 className="text-lg text-purple-300 font-bold mb-2">
                Item - Inverted Reality
              </h4>
              <p className="text-gray-300">
                In El's twisted domain, time plays by no rules. All slow effects
                haste instead, and all haste slows <br />
                All freeze effect charge instead, and all charges freezes.
                <br />
                Starting Tier: Silver <br />
                Size: (Large {">"} {">"} Medium {">"} {">"} Small)
              </p>
            </div>
          </div>
        </div>

        {/* Floating elements/particles */}
        <div className="absolute inset-0 pointer-events-none w-[1920px] h-[1080px] overflow-hidden">
          {[...Array(50)].map((_, index) => (
            <div
              key={index}
              className="absolute w-2 h-2 bg-purple-500 opacity-30 rounded-md transform rotate-45"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${
                  3 + Math.random() * 5
                }s infinite ease-in-out ${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* CSS Animation */}
        <style jsx>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0) rotate(45deg);
            }
            50% {
              transform: translateY(-20px) rotate(45deg);
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default HeroInfoPage;