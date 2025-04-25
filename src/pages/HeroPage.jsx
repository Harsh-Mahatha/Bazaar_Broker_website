import React, { useEffect, useState } from "react";
import Bread from "../assets/Images/HeroBread.png";
import { Link } from "react-router-dom";

const HeroInfoPage = ({ setCurrentPage }) => {
  return (
    <div className="w-screen h-screen bg-black relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img src="/HeroBG.gif" alt="" className="w-full h-full object-cover" />
      </div>

      <div className="relative flex flex-col items-center w-full h-full">
        {/* Breadcrumb at the top */}
        <div
          className="absolute top-[3vh] left-1/2 transform -translate-x-1/2 w-[26vw] h-[7.5vh] flex items-center justify-center z-10"
          style={{
            backgroundImage: `url(${Bread})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
          <div className="flex items-center space-x-2 text-purple-300 font-semibold text-[1.1vw]">
            <Link 
              to="/"
              className="cursor-pointer hover:text-[#e0ac54] transition-colors"
              onClick={() => setCurrentPage('battle')}
            >
              Home
            </Link>
            <span>&gt;</span>
            <span className="text-gray-300">Hero</span>
          </div>
        </div>

        {/* Content Container */}
          <div className="absolute top-[23vh] left-[13vw] w-[39vw]">
            <div className="space-y-[2vh]">
              <div>
                <h2 className="text-[1.8vw] text-purple-300 font-bold mb-[2vh]">
            El - The Hero Of Space And Time
                </h2>
                <p className="text-[0.9vw] text-gray-300 mb-[3vh]">
            This hero harnesses the power of time and space manipulation to
            gain the upper hand.
                </p>
              </div>

              <div>
                <h3 className="text-[1.3vw] text-purple-300 font-bold mb-[1vh]">
            Hero Ability - Temporal Erasure
                </h3>
                <p className="text-[0.9vw] text-gray-300">
            Tired of seeing the same items over and over again in the shop?
            Now you can erase them from existence!
            <br />
            This new mechanic lets you shrink the item pool, making it
            easier to find exactly what you're looking for.
                </p>
              </div>

              <div>
                <h3 className="text-[1.3vw] text-purple-300 font-bold mb-[1vh]">
            Hero Ability - Dimensional Recalibration
                </h3>
                <p className="text-[0.9vw] text-gray-300">
            Through the art of Dimensional Recalibration, even the largest
            relics fold into a fraction of their form - items can be resized
                </p>
              </div>

              <div>
                <h4 className="text-[1.3vw] text-purple-300 font-bold mb-[1vh]">
            Item - Inverted Reality
                </h4>
                <p className="text-[0.9vw] text-gray-300">
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
        <div className="absolute inset-0 pointer-events-none w-full h-full overflow-hidden">
          {[...Array(50)].map((_, index) => (
            <div
              key={index}
              className="absolute bg-purple-500 opacity-30 rounded-md transform rotate-45"
              style={{
                width: '0.5vw',
                height: '0.5vw',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 5}s infinite ease-in-out ${
                  Math.random() * 2
                }s`,
              }}
            />
          ))}
        </div>

        {/* CSS Animation */}
        <style jsx>{`
          @keyframes float {
            0%, 100% {
              transform: translateY(0) rotate(45deg);
            }
            50% {
              transform: translateY(-2vh) rotate(45deg);
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default HeroInfoPage;