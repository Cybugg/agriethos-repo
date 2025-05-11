'use client';

import React from 'react';
import { Bell, Check, X } from 'lucide-react';
import Link from 'next/link';
import Image from "next/image";

export default function CropHistoryPage() {
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

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-[317px] border-r border-[#cfcfcf] flex flex-col">
        <div className="p-6">
          <Image src="/icons/agriethos-logo-3-1-2.png" alt="Agriethos Logo" width={40} height={40} className="mb-8" />
          Agriethos
        </div>
        <nav className="flex flex-col px-4 gap-2">
          <Link href="/dashboard/reviewer" className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#898989] hover:bg-[#f6fded] transition-colors">
            <Image 
              src="/icons/ph-house-line-fill.svg" 
              alt="Home Icon" 
              width={20} 
              height={20} 
            />
            Home
          </Link>
          <Link
            href="/dashboard/reviewer/history"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#a5eb4c] text-[#003024] font-medium"
          >
            <Image 
              src="/icons/ph-clock-countdown-light.svg" 
              alt="History Icon" 
              width={20} 
              height={20} 
            />
            History
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#898989] hover:bg-[#f6fded] transition-colors"
          >
            <Image 
              src="/icons/ph-chart-line-light.svg" 
              alt="Statistics Icon" 
              width={20} 
              height={20} 
            />
            Statistics
          </Link>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="flex justify-between items-center p-6 border-b border-[#cfcfcf]">
          <div>
            <h1 className="text-2xl font-semibold text-[#000000]">History</h1>
            <p className="text-[#898989]">View past crop submissions</p>
          </div>
          <button className="p-2 rounded-full hover:bg-[#f6fded]">
            <Image src="/icons/bell.svg" alt="Notifications" width={24} height={24} />
          </button>
        </header>

        {/* Main content */}
        <div className="p-6">
          {/* Crop History Table */}
          <div className="overflow-x-auto bg-white rounded-lg">
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