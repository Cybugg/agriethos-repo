'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Menu } from 'lucide-react';
import Link from 'next/link';
import Image from "next/image";
import { useParams, useRouter } from 'next/navigation';
import MobileNav from "../../components/MobileNav";
import axios from 'axios';

export default function CropReviewPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [cropData, setCropData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  // Fetch crop data from backend
  useEffect(() => {
    const fetchCropData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/crops/${id}`);
        
        if (response.data.success) {
          setCropData(response.data.data);
        } else {
          setError('Failed to load crop data');
        }
      } catch (err) {
        console.error('Error fetching crop data:', err);
        setError('Error loading crop data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCropData();
    }
  }, [id]);

  const handleApprove = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/crops/${id}`, {
        verificationStatus: 'verified'
      });
      
      if (response.data.success) {
        alert('Crop successfully approved');
        router.push('/dashboard/reviewer');
      }
    } catch (err) {
      console.error('Error approving crop:', err);
      alert('Failed to approve crop');
    }
  };

  const handleReject = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/crops/${id}`, {
        verificationStatus: 'rejected'
      });
      
      if (response.data.success) {
        alert('Crop rejected');
        router.push('/dashboard/reviewer');
      }
    } catch (err) {
      console.error('Error rejecting crop:', err);
      alert('Failed to reject crop');
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Mobile Nav */}
      <MobileNav 
        isOpen={mobileNavOpen} 
        onClose={() => setMobileNavOpen(false)} 
        currentPage="review" 
      />

      {/* Main content */}
      <div className="flex-1 overflow-auto mt-[55px]">
        <header className="flex justify-between items-center p-4 md:p-6 border-b border-[#cfcfcf]">
          <div className="flex items-center gap-2">
            <Link href="/dashboard/reviewer" className="p-2 rounded-full hover:bg-[#f6fded] text-[#003024]">
              <ArrowLeft size={20} className='mr-[24]' />
            </Link>
            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-[#000000]">Home</h1>
              <p className="text-xs md:text-lg text-[#898989]">Manage all crop submission</p>
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
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading crop data...</p>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center p-8">
              {error}
            </div>
          ) : cropData ? (
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              {/* Crop details card */}
              <div className="bg-white rounded-lg border border-[#cfcfcf] p-4 md:p-6 flex-1">
                <h2 className="text-lg font-semibold mb-4 text-black">Crop to Review</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-[#898989]">Crop name</span>
                    <span className="font-medium text-black">{cropData.cropName}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-[#898989]">Farm name</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-black">{cropData.farmPropertyId?.farmName || 'N/A'}</span>
                      {cropData.farmPropertyId?._id && (
                        <Link 
                          href={`/dashboard/reviewer/farm/${cropData.farmPropertyId._id}`}
                          className="px-3 py-1 bg-[#f6fded] text-[#003024] rounded-md text-sm hover:bg-[#e9f8d5]"
                        >
                          View Farm
                        </Link>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-[#898989]">Growth stage</span>
                    <span className="font-medium text-black">{cropData.growthStage}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-[#898989]">Farm location</span>
                    <span className="font-medium text-black">{cropData.farmPropertyId?.location || 'N/A'}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-[#898989]">Planting date</span>
                    <span className="font-medium text-black">
                      {new Date(cropData.plantingDate).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-[#898989]">Expected harvest date</span>
                    <span className="font-medium text-black">{cropData.expectedHarvestingDate}</span>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-[#898989] mb-2">Notes</span>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-black">{cropData.preNotes || 'No notes provided'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Instructions card */}
              <div className="bg-white rounded-lg border border-[#cfcfcf] p-4 md:p-6 flex-1">
                <h2 className="text-lg font-semibold mb-4 text-black">Agent Instructions</h2>
                
                <ol className="list-decimal pl-5 space-y-2 mb-6 text-[#898989]">
                  <li>Check submitted logs, images, and farming methods.</li>
                  <li>Approve if the crop meets standards. Request updates if needed.</li>
                  <li>Confirm harvest details and final images.</li>
                  <li>Once approved, generate a unique harvest code and QR code.</li>
                  <li>Crops move through statuses: In Progress → Verified / Rejected.</li>
                </ol>
                
                <div className="flex gap-4 mt-6">
                  <button 
                    onClick={handleReject}
                    className="flex-1 py-3 border border-[#003024] rounded-lg text-center font-medium text-black"
                  >
                    Reject
                  </button>
                  <button 
                    onClick={handleApprove}
                    className="flex-1 py-3 bg-[#a5eb4c] text-[#003024] rounded-lg text-center font-medium text-black hover:bg-[#96d645]"
                  >
                    Approve
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center p-8">
              <p>No crop data found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}