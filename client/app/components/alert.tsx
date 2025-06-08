import React, { useEffect } from 'react';

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
    <div className={background + " " + color +" p-4 rounded-md shadow-md  top-0 lg:mx-96 mt-5 fixed lg:min-w-96 z-[999999999999999]"}>
      {message}
    </div>
  );
};

export default Alert;
