"use client"
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { PiPlant } from 'react-icons/pi'
import { ArrowLeft } from 'lucide-react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { useAgentAuth } from '@/app/Context/AgentAuthContext'

function Page() {
  const [farm, setFarm] = useState<any>(null) // Add a more specific type if you have one for FarmProperty
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const params = useParams()
  const id = params.id as string // This 'id' is the farmPropertyId from the URL
     const {address, user, logout,isLoginStatusLoading} = useAgentAuth();
  
       const router = useRouter();
       // Route protection
       useEffect(
         ()=> {
           if(!isLoginStatusLoading && (!user  || !address )){
             router.replace("/auth/reviewer")
           }
         },[user,address,,isLoginStatusLoading]
       )

  useEffect(() => {
    const fetchFarmDetails = async () => {
      if (!id) {
        setError("Farm ID is missing.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        // Use the new backend endpoint to fetch farm by its property ID
        const response = await axios.get(`https://agriethos-9wy5.onrender.com/api/farm/farm-properties/property/${id}`);
        
        // The backend directly returns the farm object on success
        if (response.data) {
          setFarm(response.data);
        } else {
          // This case might not be hit if axios throws for non-2xx responses
          setError('Failed to load farm details: No data received');
        }
      } catch (err: any) {
        console.error('Error fetching farm details:', err);
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setError('Farm not found.');
        } else {
          setError('Failed to load farm details. Please check the console.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFarmDetails();
  }, [id]);

  // Capitalize first character helper
  function CFL(string_?: string): string {
    if (!string_) return "" 
    return string_.charAt(0).toUpperCase() + string_.slice(1)
  }

  // Convert string to boolean helper
  const str2Bool = (val?: string): boolean | undefined => {
    if (val === "true") return true;
    if (val === "false") return false;
    return undefined;
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading farm data...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
  }

  if (!farm) {
    return <div className="flex justify-center items-center h-screen">No farm data available.</div>;
  }

  return (
    <div className="text-sm md:text-lg min-h-screen px-[32px] py-[80px] bg-white text-black">
      {/* Header and Descriptive Text */}
      <div className='flex items-start justify-between'>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-3'>
             <div className="border  p-2 text-black rounded-full text-xl cursor-pointer" onClick={()=> router.back()}><IoMdArrowRoundBack/></div>
            <div className='text-xl font-semibold lg:font-normal lg:text-2xl'>
              Farm Details
            </div>
          </div>
          <div className='text-grey-600'>
            View farm information
          </div>
          <div className='flex gap-2 text-primary-700 font-bold mt-2'>
            <PiPlant /> <div>{CFL(farm.farmName)}</div>
          </div>
        </div>
      </div>

      {/* Section One */}
      <section className='flex flex-col lg:flex-row gap-8 items-start mt-6'>
        {/* Farm Overview */}
        <div className='w-full rounded-lg border-[0.75px] border-grey-200 p-4 gap-6 flex flex-col'>
          <div className='flex items-center justify-between'>
            <div className='text-lg font-semibold lg:font-normal lg:text-xl'>
              Farm Overview
            </div>
          </div>
          <div className='flex flex-col gap-4 w-full justify-between'>
            <div className='flex items-center justify-between'>
              <div className='text-grey-600'>Location</div>
              <div>{CFL(farm.location)}</div>
            </div>
            <div className='flex items-center justify-between'>
              <div className='text-grey-600'>Size</div>
              <div>{farm.size || "0"} acres</div>
            </div>
            <div className='flex items-center justify-between'>
              <div className='text-grey-600'>Farm Type</div>
              <div>{CFL(farm.farmType)}</div>
            </div>
            <div className='flex items-center justify-between'>
              <div className='text-grey-600'>Soil Type</div>
              <div>{CFL(farm.soilType)}</div>
            </div>
            <div className='flex items-center justify-between'>
              <div className='text-grey-600'>Water Source</div>
              <div>{CFL(farm.waterSource)}</div>
            </div>
          </div>
        </div>

        {/* Farming Methods */}
        <div className='w-full rounded-lg border-[0.75px] border-grey-200 p-4 gap-6 flex flex-col'>
          <div className='flex items-center justify-between'>
            <div className='text-lg font-semibold lg:font-normal lg:text-xl'>
              Farming Methods
            </div>
          </div>
          <div className='flex flex-col gap-4 w-full justify-between'>
            <div className='flex items-center justify-between'>
              <div className='text-grey-600'>Fertilizer type</div>
              <div>{CFL(farm.fertilizerType)}</div>
            </div>
            <div className='flex items-center justify-between'>
              <div className='text-grey-600'>Irrigation method</div>
              <div>{CFL(farm.irrigationType)}</div>
            </div>
            <div className='flex items-center justify-between'>
              <div className='text-grey-600'>Pesticide usage</div>
              <div>{str2Bool(farm.pesticideUsage) ? "Used" : "Not Used"}</div>
            </div>
            <div className='flex items-center justify-between'>
              <div className='text-grey-600'>Cover crops</div>
              <div>{str2Bool(farm.coverCrops) ? "Used" : "Not Used"}</div>
            </div>
            <div className='flex items-center justify-between'>
              <div className='text-grey-600'>Companion planting</div>
              <div>{str2Bool(farm.companionPlanting) ? "Used" : "Not Used"}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section two - Farm Images */}
      {farm.images && farm.images.length > 0 && (
        <section className='mt-6 rounded-lg border-[0.75px] border-grey-200 p-4 flex flex-col gap-6'>
          <div className='flex items-center justify-between'>
            <div className='text-lg font-semibold lg:font-normal lg:text-xl'>
              Farm Images
            </div>
          </div>
          <div className='w-full gap-6 grid grid-cols-1 md:grid-cols-2'>
            {farm.images.map((url: string, ind: number) => (
              <div className='w-full' key={ind}>
                <Image 
                  src={url} 
                  alt={`Farm image ${ind + 1}`} 
                  className='w-full h-64 md:h-96 bg-grey-500 object-cover rounded-lg' 
                  width={500} 
                  height={400}
                  priority={ind < 2} // Prioritize loading for above-the-fold images
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default Page