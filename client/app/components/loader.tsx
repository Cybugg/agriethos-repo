// components/Loader.tsx
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="w-6 h-6 border-4 border-black border-dashed rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
