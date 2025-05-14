<<<<<<< Updated upstream
import React, { useEffect, useState } from "react";
import '../styles/TutorialArrow.css';

const TutorialArrow = ({
  id,
  position,
  direction = "right",
  message,
  offset = { x: 0, y: 0 },
  arrowSize = { width: 50, height: 50 },
  fixed = false,
  onDismiss,
  autoDismissTime = 10000, // Auto-dismiss after 8 seconds
}) => {
  const [visible, setVisible] = useState(true);

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
=======
import React, { useState, useEffect } from 'react';
import '../styles/TutorialArrow.css';

const TutorialArrow = ({ 
  id, 
  position, 
  direction = 'right', 
  message, 
  offset = { x: 0, y: 0 },
  arrowSize = { width: 50, height: 50 },
  fixed = false,
  onDismiss
}) => {
  const [visible, setVisible] = useState(true); // Controls arrow visibility
  const [messageVisible, setMessageVisible] = useState(false); // Message starts hidden
  const [hasBeenSeen, setHasBeenSeen] = useState(false);

  // Check if this tutorial arrow has been seen before
  useEffect(() => {
    const seen = localStorage.getItem(`tutorial-arrow-${id}`);
    if (seen) {
      setHasBeenSeen(true);
    }
  }, [id]);

  // Handle toggling the message visibility and dismissing the arrow
  const handleToggleMessage = () => {
    setMessageVisible(!messageVisible);

    // Mark as seen the first time it's opened
    if (!hasBeenSeen && !messageVisible) {
      localStorage.setItem(`tutorial-arrow-${id}`, 'seen');
      setHasBeenSeen(true);
    }

    // Dismiss the arrow after toggling the message
    if (messageVisible) {
      setVisible(false); // Hide the arrow
      if (onDismiss) {
        onDismiss(); // Notify the parent component
      }
    }
  };
>>>>>>> Stashed changes

  if (!visible) return null; // Do not render if not visible

  return (
<<<<<<< Updated upstream
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
        className={`tutorial-arrow tutorial-arrow-${direction}`}
        style={{
          cursor: "pointer",
          width: arrowSize.width,
          height: arrowSize.height,
        }}
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
=======
    <div 
      className="tutorial-arrow-container"
      style={{
        position: fixed ? 'fixed' : 'absolute',
        top: typeof position.y === 'string' ? position.y : position.y + offset.y + 'px',
        left: typeof position.x === 'string' ? position.x : position.x + offset.x + 'px',
      }}
    >
      <div 
        className={`tutorial-arrow tutorial-arrow-${direction}`}
        onClick={handleToggleMessage} // Self-dismiss on click
        style={{ cursor: 'pointer' }}
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
            // stroke="#FFD700" 
            stroke="#8D582C" 
            strokeWidth="5" 
            strokeLinecap="round" 
>>>>>>> Stashed changes
            strokeLinejoin="round"
          />
        </svg>
      </div>
<<<<<<< Updated upstream

      {/* Tooltip Message */}
      <div
        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 
        bg-gray-800/95 text-white text-sm rounded opacity-0 group-hover:opacity-100 
        transition-opacity duration-200 z-50 pointer-events-none min-w-[150px]
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
=======
      
      {messageVisible && message && (
        <div className="tutorial-message">
          <p>{message}</p>
        </div>
      )}
>>>>>>> Stashed changes
    </div>
  );
};

export default TutorialArrow;
