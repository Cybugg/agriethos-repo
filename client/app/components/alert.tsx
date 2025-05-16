import React, { useEffect, useState } from 'react';

interface AlertProps {
  message: string;
  duration?: number; // in ms
  onClose: () => void;
  color:string;
  background:string
}

const Alert: React.FC<AlertProps> = ({ message, duration = 3000, onClose,color = "text-green-500", background= "bg-green-100" }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Call parent handler to remove alert
    }, duration);

    return () => clearTimeout(timer); // Cleanup on unmount
  }, [duration, onClose]);

  return (
    <div className={background + " " + color +" p-4 rounded-md shadow-md z-50 absolute top-0 mx-96 mt-5"}>
      {message}
    </div>
  );
};

export default Alert;
