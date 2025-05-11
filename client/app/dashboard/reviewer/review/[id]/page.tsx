'use client';

import React, { useState } from 'react';
import { ArrowLeft, Menu } from 'lucide-react';
import Link from 'next/link';
import Image from "next/image";
import { useParams } from 'next/navigation';
import MobileNav from "../../components/MobileNav";

export default function CropReviewPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const params = useParams();
  const id = params.id;

  // In a real app, you'd fetch the data based on the ID
  const cropData = {
    cropName: 'Tomato',
    farmName: 'Active Farms',
    growthStage: 'Pre-harvest',
    fertilizerType: 'Organic',
    irrigationMethod: 'Drip',
    companionPlanting: 'No',
    pesticideUsage: 'No'
  };

  const handleApprove = () => {
    // Handle approval logic
    console.log('Crop approved');
    // Generate harvest code and QR code logic would go here
  };

  const handleReject = () => {
    // Handle rejection logic
    console.log('Crop rejected');
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Mobile Nav */}
      <MobileNav 
        isOpen={mobileNavOpen} 
        onClose={() => setMobileNavOpen(false)} 
        currentPage="review" 
      />
      
      {/* Sidebar - Hidden on mobile */}
      <div className="hidden md:flex md:w-[317px] border-r border-[#cfcfcf] flex-col">
        {/* Sidebar content same as before */}
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
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#898989] hover:bg-[#f6fded] transition-colors"
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
            href="/dashboard/reviewer/statistics"
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
        <header className="flex justify-between items-center p-4 md:p-6 border-b border-[#cfcfcf]">
          <div className="flex items-center gap-2">
            <Link href="/dashboard/reviewer" className="p-2 rounded-full hover:bg-[#f6fded]">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-[#000000]">Review Crop</h1>
              <p className="text-xs md:text-sm text-[#898989]">Reviewing submission #{id}</p>
            </div>
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
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            {/* Crop details card */}
            <div className="bg-white rounded-lg border border-[#cfcfcf] p-4 md:p-6 flex-1">
              <h2 className="text-lg font-semibold mb-4">Crop to Review</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-[#898989]">Crop name</span>
                  <span className="font-medium">{cropData.cropName}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-[#898989]">Farm name</span>
                  <span className="font-medium">{cropData.farmName}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-[#898989]">Growth stage</span>
                  <span className="font-medium">{cropData.growthStage}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-[#898989]">Fertilizer type</span>
                  <span className="font-medium">{cropData.fertilizerType}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-[#898989]">Irrigation method</span>
                  <span className="font-medium">{cropData.irrigationMethod}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-[#898989]">Companion planting</span>
                  <span className="font-medium">{cropData.companionPlanting}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-[#898989]">Pesticide usage</span>
                  <span className="font-medium">{cropData.pesticideUsage}</span>
                </div>
              </div>
            </div>
            
            {/* Instructions card */}
            <div className="bg-white rounded-lg border border-[#cfcfcf] p-4 md:p-6 flex-1">
              <h2 className="text-lg font-semibold mb-4">Agent Instructions</h2>
              
              <ol className="list-decimal pl-5 space-y-2 mb-6">
                <li>Check submitted logs, images, and farming methods.</li>
                <li>Approve if the crop meets standards. Request updates if needed.</li>
                <li>Confirm harvest details and final images.</li>
                <li>Once approved, generate a unique harvest code and QR code.</li>
                <li>Crops move through statuses: In Progress → Verified / Rejected.</li>
              </ol>
              
              <div className="flex gap-4 mt-6">
                <button 
                  onClick={handleReject}
                  className="flex-1 py-3 border border-[#003024] rounded-lg text-center font-medium"
                >
                  Reject
                </button>
                <button 
                  onClick={handleApprove}
                  className="flex-1 py-3 bg-[#a5eb4c] text-[#003024] rounded-lg text-center font-medium hover:bg-[#96d645]"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}