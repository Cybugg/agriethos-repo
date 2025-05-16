'use client';

import React, { useState } from 'react';
import { Bell, Check, X, Menu } from 'lucide-react';
import Link from 'next/link';
import Image from "next/image";
import MobileNav from "../components/MobileNav";

export default function CropHistoryPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  
  // Sample data for crop history
  const cropHistory = [
    { id: 1, cropName: 'Lettuce', farm: 'God\'s Grace Farms', growthStage: 'Pre-harvest', status: 'Success' },
    { id: 2, cropName: 'Maize', farm: 'Active Farms', growthStage: 'Post-harvest', status: 'Success' },
    { id: 3, cropName: 'Cabbage', farm: 'Farms bros', growthStage: 'Pre-harvest', status: 'Success' },
    { id: 4, cropName: 'Avocado', farm: 'Farms bros', growthStage: 'Post-harvest', status: 'Rejected' },
    { id: 5, cropName: 'Onions', farm: 'Active Farms', growthStage: 'Post-harvest', status: 'Success' },
    { id: 6, cropName: 'Oranges', farm: 'Fruta', growthStage: 'Pre-harvest', status: 'Success' },
    { id: 7, cropName: 'Grapes', farm: 'Fruta', growthStage: 'Post-harvest', status: 'Success' },
  ];

  const StatusBadge = ({ status }) => {
    if (status === 'Success') {
      return (
        <div className="flex items-center px-1.5 py-1 rounded-full bg-[#f6fded] text-[#96d645] text-sm">
          <Check size={16} className="mr-1" />
          <span>Success</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center px-1.5 py-1 rounded-full bg-[#FFF1F1] text-[#e30e0e] text-sm border border-[#e30e0e]">
          <X size={16} className="mr-1" />
          <span>Rejected</span>
        </div>
      );
    }
  };

  // Card view for mobile screens
  const MobileCardView = () => (
    <div className="flex flex-col gap-4 md:hidden">
      {cropHistory.map((crop) => (
        <div key={crop.id} className="border border-[#cfcfcf] rounded-lg p-4 hover:bg-[#f6fded]">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">{crop.cropName}</h3>
            <StatusBadge status={crop.status} />
          </div>
          <div className="text-sm text-[#898989] mb-2">
            {crop.farm}
          </div>
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 text-xs rounded-full bg-[#f0f4f3] text-[#898989]">
              {crop.growthStage}
            </span>
            <Link href={`/dashboard/reviewer/review/${crop.id}`} className="text-[#003024] text-sm">
              View
            </Link>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex h-screen bg-white">
      {/* Mobile Nav */}
      <MobileNav 
        isOpen={mobileNavOpen} 
        onClose={() => setMobileNavOpen(false)} 
        currentPage="history" 
      />
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="flex justify-between items-center p-4 md:p-6 border-b border-[#cfcfcf]">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-[#000000]">History</h1>
            <p className="text-sm text-[#898989]">View past crop submissions</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-[#f6fded]">
              <Image src="/icons/bell.svg" alt="Notifications" width={24} height={24} />
            </button>
            <button className="md:hidden p-2 rounded-full hover:bg-[#f6fded]" onClick={() => setMobileNavOpen(true)}>
              <Menu size={24} />
            </button>
          </div>
        </header>

        {/* Main content */}
        <div className="p-4 md:p-6">
          {/* Card view for mobile */}
          <MobileCardView />
          
          {/* Table view for desktop */}
          <div className="hidden md:block overflow-x-auto bg-white rounded-lg">
            <table className="min-w-full">
              <thead>
                <tr className="text-left bg-[#f9f9f9]">
                  <th className="px-6 py-4 font-medium text-[#898989]">Crop Name</th>
                  <th className="px-6 py-4 font-medium text-[#898989]">Farm</th>
                  <th className="px-6 py-4 font-medium text-[#898989]">Growth Stage</th>
                  <th className="px-6 py-4 font-medium text-[#898989]">Status</th>
                </tr>
              </thead>
              <tbody>
                {cropHistory.map((crop) => (
                  <tr key={crop.id} className="hover:bg-[#f6fded]">
                    <td className="px-6 py-4 font-medium">{crop.cropName}</td>
                    <td className="px-6 py-4">{crop.farm}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 text-sm rounded-full bg-[#f0f4f3] text-[#898989]">
                        {crop.growthStage}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={crop.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}