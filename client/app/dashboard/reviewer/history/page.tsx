'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Check, X, Menu, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import Image from "next/image";
import MobileNav from "../components/MobileNav";
import axios from 'axios';

interface Crop {
  id: string;
  cropName: string;
  farm: string;
  growthStage: string;
  status: 'Success' | 'Rejected';
  reviewStage: 'Pre-harvest' | 'Post-harvest'; // Add this to show which stage was reviewed
}

import { useNavContext } from '../NavContext';
import { BsPerson } from 'react-icons/bs';
import { useAgentAuth } from '@/app/Context/AgentAuthContext';
import { useRouter } from 'next/navigation';

export default function CropHistoryPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [cropHistory, setCropHistory] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {address, logout, user} = useAgentAuth();
  const [displayLogout, setDisplayLogout] = useState<boolean>(false);
  const {setCurrentPage, setMobileDisplay} = useNavContext();
  
  //Navbar default settings
  useEffect(() => {
    setCurrentPage("history");
    setMobileDisplay(false);
  }, [])
  
  // Fetch crops from API
  useEffect(() => {
    const fetchReviewedCrops = async () => {
      if (!user?._id) return; // Don't fetch if user ID isn't available
      
      try {
        setLoading(true);
        // Use reviewer-specific endpoint
        const response = await axios.get(`http://localhost:5000/api/crops/reviewed/${user._id}`);
        
        if (response.data.success) {
          // Map the API response to match the existing cropHistory structure
          const formattedData = response.data.data.map((crop: any) => {
            // Determine which stage this reviewer reviewed
            let reviewStage = 'Pre-harvest';
            if (crop.postHarvestAgent === user._id) {
              reviewStage = 'Post-harvest';
            }
            
            return {
              id: crop._id,
              cropName: crop.cropName,
              farm: crop.farmPropertyId?.farmName || 'N/A',
              growthStage: crop.growthStage === 'pre-harvest' ? 'Pre-harvest' : 'Post-harvest',
              status: crop.verificationStatus === 'rejected' ? 'Rejected' : 'Success',
              reviewStage // Add this field
            };
          });
          setCropHistory(formattedData);
        } else {
          setError('Failed to load data');
        }
      } catch (err) {
        console.error('Error fetching crops:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchReviewedCrops();
  }, [user?._id]); // Add user._id as dependency

  const StatusBadge = ({ status, className }: { status: 'Success' | 'Rejected', className?: string }) => {
    if (status === 'Success') {
      return (
        <div className={`border border-[#149414] border-solid inline-flex items-center px-3 py-1 rounded-full bg-[#f6fded] text-[#149414] text-sm whitespace-nowrap ${className || ''}`}>
          <Check size={16} className="mr-1 border border-[#149414] border-solid rounded-[18px] text-[#149414] p-[1px]" />
          <span className='text-[#149414]'>Success</span>
        </div>
      );
    } else {
      return (
        <div className={`inline-flex items-center px-3 py-1 rounded-full bg-[#FFF1F1] text-[#e30e0e] text-sm border border-[#e30e0e] whitespace-nowrap ${className || ''}`}>
          <X size={16} className="mr-1 border border-[#e30e0e] text-[#e30e0e] border-solid rounded-[18px] p-[1px]" />
          <span className='text-[#e30e0e]'>Rejected</span>
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
            <h3 className="font-medium text-black">{crop.cropName}</h3>
            <StatusBadge status={crop.status} />
          </div>
          <div className="text-sm text-[#898989] mb-2">
            {crop.farm}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              {/* Current growth stage */}
              {crop.growthStage === 'Pre-harvest' ? (
                <span className="px-3 py-1 text-xs rounded-full bg-[#f6fded] border border-[#96d645] text-[#75a736]">
                  {crop.growthStage}
                </span>
              ) : (
                <span className="px-3 py-1 text-xs rounded-full bg-[#F0F4F3] border-[0.75px] border-[#003024] text-[#003024]">
                  {crop.growthStage}
                </span>
              )}
              {/* Reviewed stage indicator */}
              <span className="text-xs text-[#898989]">
                Reviewed: {crop.reviewStage}
              </span>
            </div>
            <Link href={`/dashboard/reviewer/review/${crop.id}`} className="text-[#003024] text-sm">
              View
            </Link>
          </div>
        </div>
      ))}
    </div>
  );

  // Refresh function
  const handleRefresh = async () => {
    if (!user?._id) return;
    
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/crops/reviewed/${user._id}`);
      
      if (response.data.success) {
        const formattedData = response.data.data.map((crop: any) => {
          let reviewStage = 'Pre-harvest';
          if (crop.postHarvestAgent === user._id) {
            reviewStage = 'Post-harvest';
          }
          
          return {
            id: crop._id,
            cropName: crop.cropName,
            farm: crop.farmPropertyId?.farmName || 'N/A',
            growthStage: crop.growthStage === 'pre-harvest' ? 'Pre-harvest' : 'Post-harvest',
            status: crop.verificationStatus === 'rejected' ? 'Rejected' : 'Success',
            reviewStage
          };
        });
        setCropHistory(formattedData);
      }
    } catch (err) {
      console.error('Error refreshing data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Mobile Nav */}
      <MobileNav 
        isOpen={mobileNavOpen} 
        onClose={() => setMobileNavOpen(false)} 
        currentPage="history" 
      />
      
      {/* Main content */}
      <div className="flex-1 overflow-auto mt-[55px]">
        <header className="flex justify-between items-center p-4 md:px-8">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold lg:font-normal text-[#000000]">History</h1>
            <p className="text-sm md:text-base text-[#898989]">View past crop submissions</p>
          </div>
          <div className="flex items-center gap-2">
            <div className='px-2 py-1 border border-gray-500 text-gray-600 rounded-full cursor-pointer' onClick={() => window.location.reload()}>
              Reload
            </div>
            <button className='px-2 py-1 border-2 w-full border-[#a5eb4c] rounded-2xl lg:block text-grey-800'>
              <div className='flex items-center justify-center gap-2 relative' onClick={() => setDisplayLogout(!displayLogout)}>
                <div className='text-grey-800 text-lg'><BsPerson /></div> 
                <div>{address && address.slice(0,6)}...{address&&address.slice(-4)}</div>
                <div className='absolute bottom-[-150%] w-full flex flex-col bg-grey-100'>
                  {displayLogout && address && <div className='text-black bg-primary-500 py-1 px-2' onClick={() => logout()}>
                    Disconnect
                  </div>}
                </div>
              </div> 
            </button>
            <button className="p-2 rounded-full hover:bg-[#f6fded]">
              <Image src="/icons/bell.svg" alt="Notifications" width={40} height={24} />
            </button>
            <button className="md:hidden p-2 rounded-full hover:bg-[#f6fded]" onClick={() => setMobileNavOpen(true)}>
              <Menu size={24} />
            </button>
          </div>
        </header>

        {/* Main content */}
        <div className="py-4 md:p-6">
          {loading ? (
            <div className="flex text-grey-600 justify-center items-center h-64">
              <p>Loading history data...</p>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center p-8">
              {error}
            </div>
          ) : (
            <>
              {/* Card view for mobile */}
              <MobileCardView />
              
              {/* Table view for desktop */}
              <div className="hidden md:block overflow-x-auto bg-white rounded-lg w-full px-4">
                <table className="w-full table-auto ml-[-39px]">
                  <thead>
                    <tr className="text-left">
                      <th className="w-[18%] px-6 py-4 font-medium text-lg text-[#898989]">Crop Name</th>
                      <th className="w-[18%] px-6 py-4 font-medium text-lg text-[#898989]">Farm</th>
                      <th className="w-[18%] px-6 py-4 font-medium text-lg text-[#898989]">Growth Stage</th>
                      <th className="w-[18%] px-6 py-4 font-medium text-lg text-[#898989]">Reviewed Stage</th>
                      <th className="w-[28%] px-6 py-4 font-medium text-lg text-[#898989]">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cropHistory.map((crop) => (
                      <tr key={crop.id} className="hover:bg-[#f6fded]">
                        <td className="px-6 py-4 font-medium text-black">{crop.cropName}</td>
                        <td className="px-6 py-4 text-black">{crop.farm}</td>
                        <td className="px-6 py-4">
                          {crop.growthStage === 'Pre-harvest' ? (
                            <span className="px-3 py-1 text-sm rounded-full bg-[#f6fded] border border-[#96d645] text-[#75a736]">
                              {crop.growthStage}
                            </span>
                          ) : (
                            <span className="px-3 py-1 text-sm rounded-full bg-[#F0F4F3] border-[0.75px] border-[#003024] text-[#003024]">
                              {crop.growthStage}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700">
                            {crop.reviewStage}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge className='text-black' status={crop.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}