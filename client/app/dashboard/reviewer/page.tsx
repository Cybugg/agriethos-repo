'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import { Button } from "@/app/components/button";
import Link from "next/link";
import { Menu } from "lucide-react";
import MobileNav from "./components/MobileNav";
import axios from 'axios';
import { useNavContext } from './NavContext';

// Define interfaces for type safety
interface FarmProperty {
  _id: string;
  farmName: string;
  location: string;
}

interface Farmer {
  _id: string;
  walletAddress: string;
}

interface PendingCrop {
  _id: string;
  cropName: string;
  farmerId: Farmer;
  farmPropertyId: FarmProperty;
  growthStage: string;
  plantingDate: string;
  expectedHarvestingDate: string;
  preNotes: string;
  verificationStatus: string;
  createdAt: string;
  [key:string]:any;
}

export default function Home() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [pendingCrops, setPendingCrops] = useState<PendingCrop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
   const {setCurrentPage,setMobileDisplay} = useNavContext();


   //Navbar default settings
   useEffect(()=>{
            setCurrentPage("home");
            setMobileDisplay(false);
          },[])

  // Fetch pending crops when component mounts
  useEffect(() => {
    const fetchPendingCrops = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/crops/pending');
        setPendingCrops(response.data.data);
      } catch (err) {
        console.error('Error fetching pending crops:', err);
        setError('Failed to load pending crops');
      } finally {
        setLoading(false);
      }
    };

    fetchPendingCrops();
  }, []);

  return (
    <div className="flex h-screen bg-white">
      {/* Mobile Nav */}
      <MobileNav 
        isOpen={mobileNavOpen} 
        onClose={() => setMobileNavOpen(false)} 
        currentPage="home" 
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto mt-[55px]">
        <header className="flex justify-between items-center p-4 md:px-8  ">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold lg:font-normal text-[#000000]">Home</h1>
            <p className="text-sm md:text-base text-[#898989]">Manage all crop submissions.</p>
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

        <main className="p-4 md:p-6">
          {loading ? (
            <div className="flex text-grey-600 justify-center items-center h-64">
              <p>Loading pending submissions...</p>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center">
              {error}
            </div>
          ) : pendingCrops.length === 0 ? (
            <div className="text-center p-8">
              <p>No pending crops to review at this time.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Map through pending crops */}
              {pendingCrops.map((crop) => (
                <div key={crop._id} className="flex flex-col md:flex-row md:items-center md:justify-between p-4 rounded-lg px-4 hover:bg-gray-100">
                  <div className="flex basis-1/4 items-center gap-4 mb-3 md:mb-0">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <Image
                        src={crop?crop.farmPropertyId.images[0]:""} // Default farm image
                        alt={crop.farmPropertyId?.farmName || "Farm"}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                        loading='lazy'
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-black">{crop.farmPropertyId?.farmName || "Unknown Farm"}</h3>
                      <p className="text-sm text-[#898989]">{crop.farmPropertyId?.location || "Unknown Location"}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end w-full ">
                    <div className="w-full basis-1/3 md:mx-8 text-start my-3 md:my-0">
                      <span className="font-medium text-black mr-[170px]">{crop.cropName}</span>
                    </div>
                    <div className="flex flex-col md:flex-row items-end md:items-center gap-2 md:gap-32">
                      <span className={"px-3 basis-1/3 py-1 text-sm rounded-full bg-[#f6fded] border border-[#96d645] text-[#75a736]"}>
                        {crop.growthStage === 'pre-harvest' ? 'Pre-harvest' : 'Post-harvest'}
                      </span>
                      <div className="flex basis-1/3 w-full gap-2 mt-2 md:mt-0">
                        {/* <Button
                          variant="outline"
                          className="w-[100px] md:w-[121px] h-[40px] md:h-[43px] text-sm rounded-lg border-[0.75px] border-[#003024] text-black hover:bg-[#f6fded] hover:text-[#003024] px-2 py-2 md:py-3 md:gap-24 mr-[30px]"
                        >
                          Skip
                        </Button> */}
                        <Link href={`/dashboard/reviewer/review/${crop._id}`}>
                          <Button className="w-[100px] md:w-[121px] h-[40px] md:h-[43px] text-sm rounded-lg bg-[#a5eb4c] text-[#003024]  px-2 py-2 md:py-3 ">
                            Review
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
