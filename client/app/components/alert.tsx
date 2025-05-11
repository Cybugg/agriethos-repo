import React, { useEffect, useState } from 'react';

interface AlertProps {
  message: string;
  duration?: number; // in ms
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Call parent handler to remove alert
    }, duration);

    return () => clearTimeout(timer); // Cleanup on unmount
  }, [duration, onClose]);

  return (
    <div className="bg-green-100 text-green-700 p-4 rounded-md shadow-md z-50">
      {message}
    </div>
  );
};

export default Alert;
