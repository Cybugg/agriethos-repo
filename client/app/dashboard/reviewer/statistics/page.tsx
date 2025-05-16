'use client';

import React, { useState } from 'react';
import { Bell, ChevronDown, Menu } from 'lucide-react';
import Link from 'next/link';
import Image from "next/image";
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import MobileNav from "../components/MobileNav";

export default function StatisticsPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [timeframe, setTimeframe] = useState('This Week');
  
  // Sample data for charts and stats
  const summaryStats = {
    cropsApproved: 22,
    cropsRejected: 4,
    totalCropsReviewed: 26
  };
  
  const weeklyActivityData = [
    { name: 'Mon', value: 3 },
    { name: 'Tue', value: 4 },
    { name: 'Wed', value: 5 },
    { name: 'Thu', value: 5 },
    { name: 'Fri', value: 6 },
    { name: 'Sat', value: 10 },
    { name: 'Sun', value: 12 }
  ];
  
  const verificationData = [
    { name: 'Verified', value: 22, color: '#96d645' },
    { name: 'Rejected', value: 4, color: '#e30e0e' }
  ];
  
  const topFarmsData = [
    { id: 1, name: 'God\'s Grace Farms', reviewed: 12, successful: 11, rejected: 1 },
    { id: 2, name: 'Active Farms', reviewed: 6, successful: 6, rejected: 0 },
    { id: 3, name: 'Farms bros', reviewed: 2, successful: 1, rejected: 1 },
    { id: 4, name: 'Fruta', reviewed: 9, successful: 9, rejected: 0 }
  ];

  const toggleTimeframe = () => {
    // In a real app, this would cycle through available timeframes or open a dropdown
    setTimeframe(timeframe === 'This Week' ? 'This Month' : 'This Week');
  };

  // Mobile card view for top farms
  const MobileFarmCards = () => (
    <div className="flex flex-col gap-4 md:hidden">
      {topFarmsData.map((farm) => (
        <div key={farm.id} className="border border-[#cfcfcf] rounded-lg p-4">
          <h3 className="font-medium mb-2">{farm.name}</h3>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div>
              <p className="text-[#898989]">Reviewed</p>
              <p>{farm.reviewed}</p>
            </div>
            <div>
              <p className="text-[#898989]">Success</p>
              <p className="text-[#96d645]">{farm.successful}</p>
            </div>
            <div>
              <p className="text-[#898989]">Rejected</p>
              <p className="text-[#e30e0e]">{farm.rejected}</p>
            </div>
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
        currentPage="statistics" 
      />
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="flex justify-between items-center p-4 md:p-6 border-b border-[#cfcfcf]">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-[#000000]">Statistics</h1>
            <p className="text-sm text-[#898989]">View your review performance and metrics</p>
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
          {/* Summary Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-[#cfcfcf] p-4 md:p-6">
              <p className="text-[#898989] text-sm mb-2">Crops Approved</p>
              <h2 className="text-2xl md:text-3xl font-bold text-[#149414]">{summaryStats.cropsApproved}</h2>
            </div>
            <div className="bg-white rounded-lg border border-[#cfcfcf] p-4 md:p-6">
              <p className="text-[#898989] text-sm mb-2">Crops Rejected</p>
              <h2 className="text-2xl md:text-3xl font-bold text-[#e30e0e]">{summaryStats.cropsRejected}</h2>
            </div>
            <div className="bg-white rounded-lg border border-[#cfcfcf] p-4 md:p-6 sm:col-span-2 md:col-span-1">
              <p className="text-[#898989] text-sm mb-2">Total Crops Reviewed</p>
              <h2 className="text-2xl md:text-3xl font-bold text-[#003024]">{summaryStats.totalCropsReviewed}</h2>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Activity Chart */}
            <div className="bg-white rounded-lg border border-[#cfcfcf] p-4 md:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base md:text-lg font-medium text-[#000000]">Review Activity</h3>
                <button 
                  onClick={toggleTimeframe}
                  className="flex items-center gap-1 border border-[#cfcfcf] rounded-lg px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm hover:bg-[#f6fded]"
                >
                  {timeframe} <ChevronDown size={16} />
                </button>
              </div>
              <div className="h-[180px] md:h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyActivityData} margin={{ top: 5, right: 10, bottom: 20, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false}
                      width={30}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '8px', 
                        border: '1px solid #cfcfcf',
                        fontSize: '12px'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#a5eb4c" 
                      strokeWidth={2}
                      dot={{ fill: '#a5eb4c', r: 4 }} 
                      activeDot={{ r: 6 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="bg-white rounded-lg border border-[#cfcfcf] p-4 md:p-6">
              <h3 className="text-base md:text-lg font-medium text-[#000000] mb-4">Verification Results</h3>
              <div className="h-[180px] md:h-[250px] flex flex-col items-center justify-center">
                <div className="h-[120px] w-[120px] md:h-[180px] md:w-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={verificationData}
                        cx="50%"
                        cy="50%"
                        innerRadius={0}
                        outerRadius="80%"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {verificationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value} crops`, '']}
                        contentStyle={{ 
                          borderRadius: '8px', 
                          border: '1px solid #cfcfcf',
                          fontSize: '12px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#96d645]"></div>
                    <span className="text-xs md:text-sm text-[#898989]">Verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#e30e0e]"></div>
                    <span className="text-xs md:text-sm text-[#898989]">Rejected</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Farms Section */}
          <div className="bg-white rounded-lg border border-[#cfcfcf] mb-6">
            <div className="p-4 md:p-6 pb-3">
              <h3 className="text-base md:text-lg font-medium text-[#000000]">Top Farms Reviewed</h3>
            </div>
            
            {/* Mobile view: cards */}
            <MobileFarmCards />
            
            {/* Desktop view: table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-left bg-[#f9f9f9]">
                    <th className="px-6 py-3 text-sm font-medium text-[#898989]">Farm Name</th>
                    <th className="px-6 py-3 text-sm font-medium text-[#898989]">Crops Reviewed</th>
                    <th className="px-6 py-3 text-sm font-medium text-[#898989]">Successful Reviews</th>
                    <th className="px-6 py-3 text-sm font-medium text-[#898989]">Rejected Reviews</th>
                  </tr>
                </thead>
                <tbody>
                  {topFarmsData.map((farm) => (
                    <tr key={farm.id} className="hover:bg-[#f6fded] border-t border-[#f0f0f0]">
                      <td className="px-6 py-4 font-medium">{farm.name}</td>
                      <td className="px-6 py-4">{farm.reviewed}</td>
                      <td className="px-6 py-4 text-[#96d645]">{farm.successful}</td>
                      <td className="px-6 py-4 text-[#e30e0e]">{farm.rejected}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}