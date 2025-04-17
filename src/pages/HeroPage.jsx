import React from 'react';

const HeroInfoPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Background Image */}
      <div className="fixed inset-0 w-full h-full">
        <img 
          src="/src/assets/Images/HeroBG.png"
          alt="" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col lg:flex-row h-screen p-6 lg:p-16 items-center justify-center">
        {/* Left Side: Text Content */}
            <div className=" ml-[120px] w-[500px] lg:w-1/2 space-y-10 p-6">
              <div>
                <h1 className="text-3xl lg:text-4xl text-purple-300 font-bold mb-4">
                  El: The Hero Of Time And Space
                </h1>
                <p className="text-gray-300 mb-6">
                This hero harnesses the power of time and space manipulation to gain the upper hand.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl lg:text-3xl text-purple-300 font-bold mb-4">
                  Hero Ability: Temporal Erasure
                </h2>
                <p className="text-gray-300">
                Tired of seeing the same items over and over again in the shop? 
                <br/>
                Now you can erase them from existence!
                <br/>
                This new mechanic lets you shrink the item pool, making it easier to find exactly what you're looking for.
                </p>
              </div>
            </div>

            {/* Right Side: Hero Image */}
            <div className="w-full lg:w-1/2 flex justify-center items-center">
              <img 
                src="/src/assets/Images/EL.gif" 
                alt="El: The Hero Of Time And Space"
                className="max-h-96 lg:max-h-screen object-contain bg-transparent"
              />
            </div>
              </div>

              {/* Floating elements/particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(50)].map((_, index) => (
          <div
            key={index}
            className="absolute w-2 h-2 bg-purple-500 opacity-30 rounded-md transform rotate-45"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 5}s infinite ease-in-out ${Math.random() * 2}s`
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
            transform: translateY(-20px) rotate(45deg);
          }
        }
      `}</style>
    </div>
  );
};

export default HeroInfoPage;