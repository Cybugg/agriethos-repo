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

  // Changed to position at the top of the screen instead of the middle
  const baseClasses = 'fixed inset-0 flex items-start justify-center z-50';
  // Added padding-top to give some space from the very top edge
  const popupClasses = 'p-4 rounded-lg shadow-xl text-sm md:text-base mx-4 mt-16';
  let typeClasses = '';
  let animationClasses = '';

  if (type === 'success') {
    typeClasses = 'bg-green-100 text-green-800';
  } else if (type === 'error') {
    typeClasses = 'bg-red-100 text-red-800';
  } else {
    typeClasses = 'bg-blue-100 text-blue-800';
  }

  if (isVisible) {
    animationClasses = 'opacity-100 scale-100 transition-all duration-500 ease-out';
  } else {
    animationClasses = 'opacity-0 scale-95 transition-all duration-500 ease-in';
  }

  return (
    <div className={baseClasses}>
      <div
        className={`${popupClasses} ${typeClasses} ${animationClasses}`}
        style={{ maxWidth: '400px' }}
      >
        {message}
      </div>
    </div>
  );
};

export default AnimatedPopup;