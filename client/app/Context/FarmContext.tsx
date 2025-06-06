"use client"
// context/FarmContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

type FarmData = {
  farmName: string;
  location: string;
  size: string;
  crops: string[];
  images: string[];
  [key: string]: string | string[] | any; // for flexibility
};

type FarmContextType = {
  farm: FarmData | null;
  setFarm: (data: FarmData) => void;
};

const FarmContext = createContext<FarmContextType | undefined>(undefined);

export const FarmProvider = ({ children }: { children: ReactNode }) => {
  const [farm, setFarm] = useState<FarmData | null>(null);

  return (
    <FarmContext.Provider value={{ farm, setFarm }}>
      {children}
    </FarmContext.Provider>
  );
};

export const useFarm = () => {
  const context = useContext(FarmContext);
  if (!context) {
    throw new Error('useFarm must be used within a FarmProvider');
  }
  return context;
};
