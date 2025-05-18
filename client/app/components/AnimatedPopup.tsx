"use client";
import React, { useEffect, useState } from 'react';

interface AnimatedPopupProps {
  message: string;
  type: 'success' | 'error' | 'info';
  show: boolean;
  onClose: () => void; // Callback when the popup is fully closed
  duration?: number;
}

const AnimatedPopup: React.FC<AnimatedPopupProps> = ({
  message,
  type,
  show,
  onClose,
  duration = 3000, // Default duration 3 seconds
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let visibilityTimer: NodeJS.Timeout;
    let closeTimer: NodeJS.Timeout;

    if (show && message) {
      setIsVisible(true); // Trigger fade-in

      visibilityTimer = setTimeout(() => {
        setIsVisible(false); // Trigger fade-out
        closeTimer = setTimeout(() => {
          onClose(); // Call onClose after fade-out animation
        }, 500); // Animation duration for fade-out
      }, duration);
    }

    return () => {
      clearTimeout(visibilityTimer);
      clearTimeout(closeTimer);
    };
  }, [show, message, duration, onClose]);

  if (!show && !isVisible) { // Only render if it's supposed to be shown or is in process of fading out
    return null;
  }

  let baseClasses = 'fixed top-16 right-5 md:right-10 p-4 rounded-lg shadow-xl text-white text-sm md:text-base';
  let typeClasses = '';
  let animationClasses = '';

  if (type === 'success') {
    typeClasses = 'bg-green-500';
  } else if (type === 'error') {
    typeClasses = 'bg-red-500';
  } else {
    typeClasses = 'bg-blue-500';
  }

  if (isVisible) {
    animationClasses = 'opacity-100 translate-y-0 transition-all duration-500 ease-out';
  } else {
    animationClasses = 'opacity-0 -translate-y-5 transition-all duration-500 ease-in';
  }

  return (
    <div
      className={`${baseClasses} ${typeClasses} ${animationClasses}`}
      style={{ zIndex: 1050 }} // Ensure it's above other elements
    >
      {message}
    </div>
  );
};

export default AnimatedPopup;