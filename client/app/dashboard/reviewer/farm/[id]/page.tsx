"use client"
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { PiPlant } from 'react-icons/pi'
import { ArrowLeft } from 'lucide-react'
import axios from 'axios'

function Page() {
  const [farm, setFarm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const params = useParams()
  const id = params.id

  // Fetch farm data based on ID from URL params
  useEffect(() => {
    const fetchFarm = async () => {
      try {
        setLoading(true)
        // Since the crop data includes farmPropertyId populated data
        // Let's try to get it via the crop endpoint
        const response = await axios.get(`http://localhost:5000/api/crops/${id}`)
        
        if (response.data && response.data.data && response.data.data.farmPropertyId) {
          // If we get crop data with farmPropertyId, use that to fetch farm details
          const farmId = response.data.data.farmPropertyId._id || response.data.data.farmPropertyId
          const farmResponse = await axios.get(`http://localhost:5000/api/farm/farm-properties/${farmId}`)
          setFarm(farmResponse.data)
        } else {
          setError('Could not retrieve farm information from crop data')
        }
        setLoading(false)
      } catch (err) {
        console.error('Error fetching farm data:', err)
        setError('Failed to load farm data')
        setLoading(false)
      }
    }

    if (id) {
      fetchFarm()
    }
  }, [id])

  // Capitalize first character helper
  function CFL(string_) {
    if (!string_) return "" 
    return string_.charAt(0).toUpperCase() + string_.slice(1)
  }

  // Convert string to boolean helper
  const str2Bool = (val) => {
    return val === "true" ? true : val === "false" ? false : undefined
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading farm data...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
  }

  return (
    <div className="text-sm md:text-md min-h-screen px-[32px] py-[80px] bg-white text-black">
      {/* Header and Descriptive Text */}
      <div className='flex items-start justify-between'>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-3'>
            <Link href="/dashboard/reviewer" className="p-2 rounded-full hover:bg-[#f6fded] text-[#003024]">
              <ArrowLeft size={20} />
            </Link>
            <div className='text-xl font-semibold lg:font-normal lg:text-2xl'>
              Farm Details
            </div>
          </div>
          <div className='text-grey-600'>
            View farm information
          </div>
          <div className='flex gap-2 text-primary-700 font-bold'>
            <PiPlant /> <div>{CFL(farm ? farm.farmName : "N/A")}</div>
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
          {/* lists of farm variables */}
          <div className='flex flex-col gap-4 w-full justify-between'>
            <div className='flex items-center justify-between'>
              <div className='text-grey-600'>Location</div>
              <div>{CFL(farm ? farm.location : "N/A")}</div>
            </div>
            <div className='flex items-center justify-between'>
              <div className='text-grey-600'>Size</div>
              <div>{(farm ? farm.size : "0")} acres</div>
            </div>
            <div className='flex items-center justify-between'>
              <div className='text-grey-600'>Farm Type</div>
              <div>{CFL(farm ? farm.farmType : "N/A")}</div>
            </div>
            <div className='flex items-center justify-between'>
              <div className='text-grey-600'>Soil Type</div>
              <div>{CFL(farm ? farm.soilType : "N/A")}</div>
            </div>
            <div className='flex items-center justify-between'>
              <div className='text-grey-600'>Water Source</div>
              <div>{CFL(farm ? farm.waterSource : "N/A")}</div>
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
          {/* lists of farm variables */}
          <div className='flex flex-col gap-4 w-full justify-between'>
            <div className='flex items-center justify-between'>
              <div className='text-grey-600'>Fertilizer type</div>
              <div>{CFL(farm ? farm.fertilizerType : "N/A")}</div>
            </div>
            <div className='flex items-center justify-between'>
              <div className='text-grey-600'>Irrigation method</div>
              <div>{CFL(farm ? farm.irrigationType : "N/A")}</div>
            </div>
            <div className='flex items-center justify-between'>
              <div className='text-grey-600'>Pesticide usage</div>
              <div>{farm && str2Bool(farm.pesticideUsage) ? CFL("used") : "N/A"}</div>
            </div>
            <div className='flex items-center justify-between'>
              <div className='text-grey-600'>Cover crops</div>
              <div>{farm && str2Bool(farm.coverCrops) ? CFL("used") : "N/A"}</div>
            </div>
            <div className='flex items-center justify-between'>
              <div className='text-grey-600'>Companion planting</div>
              <div>{farm && str2Bool(farm.companionPlanting) ? CFL("used") : "N/A"}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section two - Farm Images */}
      {farm && farm.images && farm.images.length > 0 && (
        <section className='mt-6 rounded-lg border-[0.75px] border-grey-200 p-4 flex flex-col gap-6'>
          <div className='flex items-center justify-between'>
            <div className='text-lg font-semibold lg:font-normal lg:text-xl'>
              Farm Images
            </div>
          </div>
          <div className='w-full gap-6 grid grid-cols-1 lg:grid-cols-2'>
            {farm.images.map((url, ind) => (
              <div className='w-50' key={ind}>
                <Image 
                  src={url} 
                  alt={`Farm image ${ind+1}`} 
                  className='w-full h-96 bg-grey-500 object-cover rounded-lg' 
                  width={500} 
                  height={400}
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