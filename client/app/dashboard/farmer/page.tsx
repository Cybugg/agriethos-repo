// Farmers dashboard
import React from 'react'

export default function Home() {
    return (
      <div className="h-screen px-[32px] py-[80px] bg-white text-black">
        {/* Header and Descriptive Text */}
       <div className='flex flex-col gap-2'>
        <div className='text-2xl'>
          Home
        </div>
        <div className='text-grey-600'>
          Your farm at a glance
        </div>
       </div>
       {/* Overview Stats */}
       <div className='flex mt-[32px] w-full border-[0.75px] border-grey-200 rounded-lg'>
        {/* Item 1 */}
        <div className='flex flex-col gap-[24px] w-full py-[32px] px-[24px]  border-r-[0.75px] border-grey-200'>
          <div className='flex items-center justify-between'>
           <div className='text-sm text-grey-400'>
            Total Active Crops
          </div>
          <div className='text-success-500 '>
             +20%
          </div >
          </div>
          <div className='text-2xl'>
            4
          </div>
        </div>
             {/* Item 2 */}
             <div className='flex flex-col gap-[24px] w-full py-[32px] px-[24px] border-r-[0.75px] border-grey-200'>
          <div className='flex'>
           <div className='text-sm text-grey-400'>
          Farm Location
          </div>
         
          </div>
          <div className='text-2xl'>
            Osun, Nigeria
          </div>
        </div>
             {/* Item 3 */}
             <div className='flex flex-col gap-[24px] w-full py-[32px] px-[24px] border-r-[0.75px] border-grey-200'>
          <div className='flex items-center justify-between'>
           <div className='text-sm text-grey-400'>
       Last Logged Activity
          </div>
          <div className='text-sm text-grey-400'>
             2 Days ago
          </div >
          </div>
          <div className='text-2xl'>
          Corn/Pre-harvest
          </div>
        </div>
             {/* Item 4 */}
             <div className='flex flex-col gap-[24px] w-full py-[32px] px-[24px]'>
          <div className='flex'>
           <div className='text-sm text-grey-400'>
           Verified Blockchain Entries
          </div>
      
          </div>
          <div className='text-2xl'>
            11
          </div>
        </div>
       </div>
      </div>
    );
  }
  