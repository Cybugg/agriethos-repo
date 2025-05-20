'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Menu, Bell, RefreshCw } from 'lucide-react'; // Import RefreshCw
import Link from 'next/link';
import Image from "next/image";
import { useParams, useRouter } from 'next/navigation';
import MobileNav from "../../components/MobileNav";
import axios from 'axios';
import AnimatedPopup from '@/app/components/AnimatedPopup'; // Import the new component
import ImageViewer from '@/app/components/imageViewer';

// Define a type for the popup configuration
interface PopupConfig {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function CropReviewPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [cropData, setCropData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [popupConfig, setPopupConfig] = useState<PopupConfig>({
    show: false,
    message: '',
    type: 'info',
  });
const [selectedImages, setSelectedImages] = useState<string[]>([""]);
const [isViewerOpen, setIsViewerOpen] = useState(false);
      const [currentIndex, setCurrentIndex] = useState(0);
    
      const openViewer = (index: number) => {
        setCurrentIndex(index);
        setIsViewerOpen(true);
      };
    
      const next = () =>selectedImages && selectedImages && setCurrentIndex((prev) => (prev + 1) % selectedImages.length);
      const prev = () =>selectedImages && selectedImages && setCurrentIndex((prev) => (prev - 1 + selectedImages.length) % selectedImages.length);
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  useEffect(
    ()=>{
      cropData && setSelectedImages(cropData.images);
    },[cropData]
  )

  useEffect(() => {
    const fetchCropData = async () => {
      if (!id) {
        setError("Crop ID is missing.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/crops/${id}`);
        
        if (response.data.success) {
          setCropData(response.data.data);
        } else {
          setError('Failed to load crop data: ' + (response.data.message || 'Unknown error'));
        }
      } catch (err: any) {
        console.error('Error fetching crop data:', err);
        if (axios.isAxiosError(err) && err.response) {
          setError(`Error loading crop data: ${err.response.status} - ${err.response.data.message || err.message}`);
        } else {
          setError('Error loading crop data. Please check the console.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCropData();
  }, [id]);

  const showPopup = (message: string, type: 'success' | 'error' | 'info') => {
    setPopupConfig({ show: true, message, type });
  };

  const handlePopupClose = (callback?: () => void) => {
    setPopupConfig((prev) => ({ ...prev, show: false }));
    if (callback) {
      // Allow time for fade-out animation before executing callback
      setTimeout(callback, 500);
    }
  };

  const handleReload = () => {
    router.refresh(); // Soft refresh, re-runs server components and fetches new data
    // For a hard refresh, you could use: window.location.reload();
  };

  const handleApprove = async () => {
    if (!cropData) {
      showPopup('Crop data not loaded yet.', 'error');
      return;
    }

    let newStatus = '';
    let successMessage = '';

    if (cropData.growthStage === 'pre-harvest') {
      newStatus = 'toUpgrade';
      successMessage = 'Pre-harvest approved. Farmer will be notified.';
    } else if (cropData.growthStage === 'post-harvest') {
      newStatus = 'verified';
      successMessage = 'Post-harvest approved successfully!';
    } else {
      showPopup('Unknown crop growth stage.', 'error');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:5000/api/crops/${id}`, {
        verificationStatus: newStatus
      });
      
      if (response.data.success) {
        showPopup(successMessage, 'success');
        // The navigation will happen in handlePopupClose's callback
      } else {
        showPopup('Failed to approve crop: ' + (response.data.message || 'Unknown error'), 'error');
      }
    } catch (err: any) {
      console.error('Error approving crop:', err);
      if (axios.isAxiosError(err) && err.response) {
        showPopup(`Failed to approve crop: ${err.response.status} - ${err.response.data.message || err.message}`, 'error');
      } else {
        showPopup('Failed to approve crop. Please check the console.', 'error');
      }
    }
  };

  const handleReject = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/crops/${id}`, {
        verificationStatus: 'rejected'
      });
      
      if (response.data.success) {
        showPopup('Crop rejected successfully.', 'success');
        // The navigation will happen in handlePopupClose's callback
      } else {
        showPopup('Failed to reject crop: ' + (response.data.message || 'Unknown error'), 'error');
      }
    } catch (err: any) {
      console.error('Error rejecting crop:', err);
      if (axios.isAxiosError(err) && err.response) {
        showPopup(`Failed to reject crop: ${err.response.status} - ${err.response.data.message || err.message}`, 'error');
      } else {
        showPopup('Failed to reject crop. Please check the console.', 'error');
      }
    }
  };

  return (
    <> {/* Use Fragment to wrap multiple top-level elements */}
      <AnimatedPopup
        message={popupConfig.message}
        type={popupConfig.type}
        show={popupConfig.show}
        onClose={() => {
          // Only navigate if the action was successful
          if (popupConfig.type === 'success') {
            handlePopupClose(() => router.push('/dashboard/reviewer'));
          } else {
            handlePopupClose();
          }
        }}
      />
      <div className="flex h-screen bg-white">
        {/* Mobile Nav */}
        <MobileNav 
          isOpen={mobileNavOpen} 
          onClose={() => setMobileNavOpen(false)} 
          currentPage="review" 
        />

        {/* Main content */}
        <div className="flex-1 overflow-auto mt-[55px]">
          <header className="flex justify-between items-center p-4 md:px-6 border-b border-[#cfcfcf]">
            <div className="flex items-center gap-2">
              <Link href="/dashboard/reviewer" className="p-2 rounded-full hover:bg-[#f6fded] text-[#003024]">
                <ArrowLeft size={20} className='mr-[24]' />
              </Link>
              <div>
                <h1 className="text-xl md:text-2xl font-semibold lg:font-normal text-[#000000]">Review Submission</h1>
               
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleReload}
                className="p-2 rounded-full hover:bg-[#f6fded]"
                title="Reload page"
              >
                <RefreshCw size={24} />
              </button>
              <button className="p-2 rounded-full hover:bg-[#f6fded]">
                <Bell size={24} /> {/* Replaced Image with Bell icon for consistency */}
              </button>
              <button className="md:hidden p-2 rounded-full hover:bg-[#f6fded]" onClick={() => setMobileNavOpen(true)}>
                <Menu size={24} />
              </button>
            </div>
          </header>

          {/* Main content */}
          <div className="p-4 md:p-6">
            {loading ? (
              <div className="flex justify-center text-grey-600 items-center h-64">
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
                  <h2 className="text-lg font-semibold mb-4 text-black">Crop to Review {`(${cropData.growthStage})`}</h2>
                  {cropData.farmPropertyId?._id && (
                          <Link 
                            href={`/dashboard/reviewer/farm/${cropData.farmPropertyId._id}`}
                            className="px-3 py-1 bg-[#f6fded] text-[#003024] rounded-md text-sm  border border-[#003024] "
                          >
                            View Farm Here
                          </Link>
                        )}
                  <div className="space-y-4 mt-5">
                    <div className="flex justify-between">
                      <span className="text-[#898989]">Crop name</span>
                      <span className="font-medium text-black">{cropData.cropName}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-[#898989]">Farm name</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-black">{cropData.farmPropertyId?.farmName || 'N/A'}</span>
                        
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-[#898989]">Growth stage</span>
                      <span className="font-medium text-black ">{cropData.growthStage}</span>
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
                      <span className="text-[#898989] mb-2">Pre-harvest notes</span>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-black">{cropData.preNotes || 'No notes provided'}</span>
                      </div>
                    </div>

                    {cropData.growthStage ==="post-harvest" && <div className='space-y-4'>
                      <div className="flex justify-between">
                      <span className="text-[#898989]">Harvesting Date</span>
                      <div className="  rounded-lg">
                        <span className="font-medium text-black">{cropData.harvestingDate.slice(0,10) || 'No harvest date provided'}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#898989]">Storage Method</span>
                      <div className="  rounded-lg">
                        <span className="font-medium text-black">{cropData.storageMethod || 'No storage method provided'}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#898989]">Quantity Harvested</span>
                      <div className="  rounded-lg">
                        <span className="font-medium text-black">{cropData.quantityHarvested || 'No quantity provided'}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#898989]">Unit</span>
                      <div className="  rounded-lg">
                        <span className="font-medium text-black">{cropData.unit || 'No notes provided'}</span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[#898989] mb-2">Post-harvest notes</span>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-black">{cropData.postNotes || 'No notes provided'}</span>
                      </div>
                    </div>
                    </div>
                     }
                    { cropData.images && "Images:" }
<div className='flex gap-4'>
 {cropData && cropData.images[0] && cropData.images.map((img:string, idx:number) => (
        <img
          key={idx}
          src={img}
          alt={`thumb-${idx}`}
          className="w-24 h-24 object-cover rounded cursor-pointer"
          onClick={() => openViewer(idx)}
        />
      ))}

      {isViewerOpen && (
        <ImageViewer
          images={cropData && cropData.images}
          currentIndex={currentIndex}
          onClose={() => setIsViewerOpen(false)}
          onNext={next}
          onPrev={prev}
        />
      )}
</div>
                   
                  </div>
                </div>
                
                {/* Instructions card */}
                <div className="bg-white rounded-lg border border-[#cfcfcf] p-4 md:p-6 flex-1">
                  <h2 className="text-lg font-semibold mb-4 text-black">Agent Instructions</h2>
                  
                  <ol className="list-decimal pl-5 space-y-2 mb-6 text-[#898989]">
                    <li>Ensure completeness of the submission. All required fields must be filled.</li>
                    <li>Verify authenticity of the data using available supporting documents, geotagging, images, or system records.</li>
                    <li>Validate compliance with platform guidelines, regional policies, or agricultural best practices.</li>
                    <li>Provide objective feedback or request revisions where necessary.</li>
                    <li>Approve or reject submissions based on their merit and supporting evidence.</li>
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
    </>
  );
}