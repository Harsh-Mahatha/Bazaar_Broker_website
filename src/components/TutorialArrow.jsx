import React, { useEffect, useState } from "react";
import '../styles/TutorialArrow.css';

// Create a global event bus for arrow communication
const arrowEventBus = {
  listeners: {},
  subscribe: (event, callback) => {
    if (!arrowEventBus.listeners[event]) {
      arrowEventBus.listeners[event] = [];
    }
    arrowEventBus.listeners[event].push(callback);
    return () => {
      arrowEventBus.listeners[event] = arrowEventBus.listeners[event].filter(cb => cb !== callback);
    };
  },
  publish: (event) => {
    if (arrowEventBus.listeners[event]) {
      arrowEventBus.listeners[event].forEach(callback => callback());
    }
  }
};

const TutorialArrow = ({
  id,
  position,
  direction = "right",
  message,
  offset = { x: 0, y: 0 },
  arrowSize = { width: 50, height: 50 },
  fixed = false,
  onDismiss,
  autoDismissTime = 10000, // Auto-dismiss after 10 seconds
}) => {
  const [visible, setVisible] = useState(true);

  // Subscribe to the global "dismissAll" event
  useEffect(() => {
    const unsubscribe = arrowEventBus.subscribe("dismissAll", () => {
      setVisible(false);
      if (onDismiss) {
        onDismiss();
      }
    });
    
    return unsubscribe; // Clean up subscription on unmount
  }, [onDismiss]);

  // Auto-dismiss the arrow after the specified time
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onDismiss) {
        onDismiss(); // Notify the parent component
      }
    }, autoDismissTime);

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, [autoDismissTime, onDismiss]);

  // Function to handle click on arrow or target element
  const handleArrowClick = () => {
    // Dismiss all arrows by publishing to the event bus
    arrowEventBus.publish("dismissAll");
  };

  // Function to add click listener to the target element
  useEffect(() => {
    // Find target element by position or ID
    const targetElement = document.elementFromPoint(
      typeof position.x === "string" ? parseInt(position.x) : position.x + offset.x,
      typeof position.y === "string" ? parseInt(position.y) : position.y + offset.y
    );
    
    if (targetElement) {
      const clickHandler = () => {
        // Dismiss all arrows when any target is clicked
        arrowEventBus.publish("dismissAll");
      };
      
      targetElement.addEventListener('click', clickHandler);
      
      return () => {
        targetElement.removeEventListener('click', clickHandler);
      };
    }
  }, [position, offset]);

  if (!visible) return null; // Do not render if not visible

  return (
    <div
      className="tutorial-arrow-container group"
      style={{
        position: fixed ? "fixed" : "absolute",
        top: typeof position.y === "string" ? position.y : position.y + offset.y + "px",
        left: typeof position.x === "string" ? position.x : position.x + offset.x + "px",
      }}
    >
      {/* Arrow */}
      <div
        className={`tutorial-arrow tutorial-arrow-${direction} arrow-animate-${direction}`}
        style={{
          cursor: "pointer",
          width: arrowSize.width,
          height: arrowSize.height,
        }}
        onClick={handleArrowClick}  // Add click handler to the arrow itself
      >
        <svg
          width={arrowSize.width}
          height={arrowSize.height}
          viewBox="0 0 50 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="tutorial-arrow-svg"
        >
          <path
            d="M10 25L40 25M40 25L25 10M40 25L25 40"
            stroke="#8D582C" // Arrow color
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Tooltip Message - Now visible by default */}
      <div
        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 
        bg-gray-800/95 text-white text-sm rounded opacity-100
        transition-opacity duration-200 z-50 min-w-[150px] tooltip-message
        border-2 border-gray-300/50
        before:content-[''] before:absolute before:top-full before:left-1/2 
        before:-translate-x-1/2 before:border-8 before:border-transparent 
        before:border-t-gray-800/95
        after:content-[''] after:absolute after:top-full after:left-1/2 
        after:-translate-x-1/2 after:border-[8px] after:border-transparent 
        after:border-t-gray-600/50 after:-mt-[1px]"
      >
        {message}
      </div>
    </div>
  );
};

export default TutorialArrow;




