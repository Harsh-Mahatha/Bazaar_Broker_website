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
  const [visible, setVisible] = useState(true); // Always visible
  const [messageVisible, setMessageVisible] = useState(false); // Message starts hidden
  const [hasBeenSeen, setHasBeenSeen] = useState(false);
  
  useEffect(() => {
    // Check if this tutorial arrow has been seen before
    const seen = localStorage.getItem(`tutorial-arrow-${id}`);
    if (seen) {
      setHasBeenSeen(true);
    }
  }, [id]);
  
  const handleToggleMessage = () => {
    setMessageVisible(!messageVisible);
    
    // Mark as seen the first time it's opened
    if (!hasBeenSeen && !messageVisible) {
      localStorage.setItem(`tutorial-arrow-${id}`, 'seen');
      setHasBeenSeen(true);
    }
  };
  
  if (!visible) return null;
  
  return (
    <div 
      className="tutorial-arrow-container"
      style={{
        position: fixed ? 'fixed' : 'absolute',
        top: typeof position.y === 'string' ? position.y : position.y + offset.y + 'px',
        left: typeof position.x === 'string' ? position.x : position.x + offset.x + 'px',
      }}
    >
      <div 
        className={
          `tutorial-arrow tutorial-arrow-${direction}` +
          (!hasBeenSeen ? ' tutorial-arrow-pulse' : '') +
          (messageVisible ? ' tutorial-arrow-shifted' : '')
        }
        onClick={handleToggleMessage}
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
            stroke="#FFD700" 
            strokeWidth="5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>
      
      {messageVisible && message && (
        <div className="tutorial-message">
          <p>{message}</p>
        </div>
      )}
    </div>
  );
};

export default TutorialArrow;