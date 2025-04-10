// Farmers dashboard
import Image from 'next/image';
import React from 'react'

export default function Home() {
    return (
      <div className="min-h-screen px-[32px] py-[80px] bg-white text-black">
        {/* Header and Descriptive Text */}
        <div className='flex items-start justify-between'>
     <div className='flex flex-col gap-2'>
        <div className='text-2xl'>
          Home
        </div>
        <div className='text-grey-600'>
          Your farm at a glance
        </div>
       </div>
       <div>
<Image src={"/icons/bell.svg"} alt="bell" width={24} height={24} className="cursor-pointer"></Image>
       </div>
        </div>
       {/* Section One */}
       {/* Overview Stats */}
       <section className='flex mt-[32px] w-full border-[0.75px] border-grey-200 rounded-lg'>
        {/* Item 1 */}
        <div className='flex flex-col gap-[24px] w-full py-[32px] px-[24px]  border-r-[0.75px] border-grey-200'>
          <div className='flex items-center justify-between'>
           <div className='text-sm text-grey-200'>
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
           <div className='text-sm text-grey-200'>
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
           <div className='text-sm text-grey-200'>
       Last Logged Activity
          </div>
          <div className='text-sm text-grey-200'>
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
           <div className='text-sm text-grey-200'>
           Verified Blockchain Entries
          </div>
      
          </div>
          <div className='text-2xl'>
            11
          </div>
        </div>
       </section>

      {/* Section Two */}
      <section className='flex gap-5 items-start mt-6 '>
        {/* Crop log */}
     <div className='min-h-[440px] w-full rounded-lg border-[0.75px] border-grey-200 p-4'>
<div className='flex items-center justify-between'>
  {/* Title */}
<div className='text-xl'>
Crop Growth
</div>
<div>

</div>
</div>
    </div>
    {/* Today's Weather */}
    <div className='min-h-[440px] w-[448px] rounded-lg border-[0.75px] border-grey-200 p-4 gap-6 flex flex-col'>
{/* Title */}
<div className='text-xl'>
  Today's Weather
</div>
{/* lists of weather variables */}
<div className='flex flex-col gap-4 w-[416px]'>

{/* Variable */}
<div className='flex items-center justify-between'>
  {/* Variable Name */}
<div className='text-grey-200'>
Location
</div>
<div>
Osun, Nigeria
</div>
</div>
{/* Variable */}
<div className='flex items-center justify-between'>
  {/* Variable Name */}
<div className='text-grey-200'>
Date
</div>
<div>
3rd April, 2025
</div>
</div>
{/* Variable */}
<div className='flex items-center justify-between'>
  {/* Variable Name */}
<div className='text-grey-200'>
Temperature(Min/Max)
</div>
<div>
24°C/34°C
</div>
</div>
{/* Variable */}
<div className='flex items-center justify-between'>
  {/* Variable Name */}
<div className='text-grey-200'>
Rainfall Forecast
</div>
<div>
Light rain by afternoon
</div>
</div>
{/* Variable */}
<div className='flex items-center justify-between'>
  {/* Variable Name */}
<div className='text-grey-200'>
Wind
</div>
<div>
Moderate breeze
</div>
</div>
{/* Variable */}
<div className='flex items-center justify-between'>
  {/* Variable Name */}
<div className='text-grey-200'>
Humidity 
</div>
<div>
78%
</div>
</div>
{/* Variable */}
<div className='flex items-center justify-between'>
  {/* Variable Name */}
<div className='text-grey-200'>
Sunlight Duration
</div>
<div>
8 hours
</div>
</div>
{/* Variable */}
<div className='flex items-center justify-between'>
  {/* Variable Name */}
<div className='text-grey-200'>
Dew Point
</div>
<div>
20°C
</div>
</div>
{/* Variable */}
<div className='flex items-center justify-between'>
  {/* Variable Name */}
<div className='text-grey-200'>
Extreme Weather Alert
</div>
<div>
None
</div>
</div>
</div>
    </div>
      </section>

      {/* Section three */}
      <section className='flex gap-5 mt-6'>
        {/* Recent Crop Logs */}
        <div className=' w-[448px] rounded-lg border-[0.75px] border-grey-200 p-4 gap-6 flex flex-col '>
        <div className='flex items-center justify-between'>
        {/* Title */}
        <div className='text-xl'>
        Recent Crop Logs
        </div>
        </div>
        {/* Crop Log variables */}
<div className='flex flex-col gap-4 w-[346px]'>

{/* Variable */}
<div className='flex items-center justify-between'>
  {/* Variable Name */}
<div className='text-grey-200'>
Crop Name/Growth Stage
</div>
<div>
Corn/Pre-harvest
</div>
</div>
{/* Variable */}
<div className='flex items-center justify-between'>
  {/* Variable Name */}
<div className='text-grey-200'>
Date
</div>
<div>
3rd April, 2025
</div>
</div>
{/* Variable */}
<div className='flex items-center justify-between'>
  {/* Variable Name */}
<div className='text-grey-200'>
Time
</div>
<div>
14:39PM
</div>
</div>
{/* Variable */}
<div className='flex items-center justify-between'>
  {/* Variable Name */}
<div className='text-grey-200'>
Verifaction Status
</div>
<div className='text-success-500'>
Success
</div>
</div>

        <div>
     </div>
     </div>
        </div>
        {/* Verification status */}
        <div className=' w-full rounded-lg border-[0.75px] border-grey-200 p-4 gap-6 flex flex-col max-h-[400px]'>
        <div className='flex items-center justify-between'>
        {/* Title */}
        <div className='text-xl'>
        Verifaction Status
        </div>
        </div>
        {/* Verification variables */}
<div className='flex flex-col gap-4 w-full'>

{/* Variable */}
<div className='flex items-center justify-between text-center'>
  {/* Variable Name */}
<div className='text-grey-200'>
Entry Name
</div>
<div className='text-grey-200'>
Blockchain Hash
</div>
<div className='text-grey-200'>
Verification Status
</div>
<div className='text-grey-200'>
</div>
</div>
{/* Variable */}
<div className='flex items-center justify-between text-center'>
  {/* Variable Name */}
<div className=''>
Corn Pre-harvest
</div>
<div className=''>
0xA4B5...F7D2
</div>
<div className=''>
Verification Status
</div>
<div className=''>
</div>
</div>
{/* Variable */}
<div className='flex items-center justify-between text-center'>
  {/* Variable Name */}
<div className=''>
Entry Name
</div>
<div className=''>
Blockchain Hash
</div>
<div className=''>
Verification Status
</div>
<div className=''>
</div>
</div>
{/* Variable */}
<div className='flex items-center justify-between text-center'>
  {/* Variable Name */}
<div className=''>
Entry Name
</div>
<div className=''>
Blockchain Hash
</div>
<div className=''>
Verification Status
</div>
<div className=''>
</div>
</div>
{/* Variable */}
<div className='flex items-center justify-between text-center'>
  {/* Variable Name */}
<div className=''>
Entry Name
</div>
<div className=''>
Blockchain Hash
</div>
<div className=''>
Verification Status
</div>
<div className=''>
</div>
</div>
        <div>
     </div>
     </div>
      
        </div>
      </section>
      </div>
    );
  }
  