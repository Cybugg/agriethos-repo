'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X } from 'lucide-react';

type MobileNavProps = {
  isOpen: boolean;
  onClose: () => void;
  currentPage: 'home' | 'history' | 'statistics' | 'review';
};

export default function MobileNav({ isOpen, onClose, currentPage }: MobileNavProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 p-6 flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <Image src="/icons/agriethos-logo-3-1-2.png" alt="Agriethos Logo" width={32} height={32} />
          <span className="text-xl font-medium">Agriethos</span>
        </div>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
          <X size={24} />
        </button>
      </div>
      
      <nav className="flex flex-col gap-4 mt-8">
        <Link 
          href="/dashboard/reviewer"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
            currentPage === 'home' ? 'bg-[#a5eb4c] text-[#003024] font-medium' : 'text-[#898989]'
          }`}
          onClick={onClose}
        >
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
          className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
            currentPage === 'history' ? 'bg-[#a5eb4c] text-[#003024] font-medium' : 'text-[#898989]'
          }`}
          onClick={onClose}
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
          className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
            currentPage === 'statistics' ? 'bg-[#a5eb4c] text-[#003024] font-medium' : 'text-[#898989]'
          }`}
          onClick={onClose}
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
  );
}