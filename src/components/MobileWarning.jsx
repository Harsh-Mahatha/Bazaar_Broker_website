import React, { useState, useEffect } from 'react';

const MobileWarning = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsVisible(window.innerWidth < 768 && !isDismissed);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, [isDismissed]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg z-50 border border-gray-700">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <p className="text-sm">
            ⚠️ For the best experience, please use this website on a desktop or larger screen.
          </p>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="ml-4 text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default MobileWarning;