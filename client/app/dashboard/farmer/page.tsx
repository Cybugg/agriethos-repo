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
       </section>
{/* ########################################################################################################### */}
      {/* Section Two */}
      <section className='flex gap-8 items-start mt-6 '>
        {/* Crop log */}
     <div className='min-h-[440px] w-full rounded-lg border-[0.75px] border-grey-200 p-4'>
<div className='flex items-center justify-between'>
  {/* Title */}
<div className='text-xl'>
Crop Growth
</div>
<div className='flex gap-2'>
<div className='py-1 px-2 rounded-lg border border-grey-200 cursor-pointer text-grey-700'>
<select id="crop" name="crop" className='bg-white'>
  <option value="tomatoes">Tomatoes</option>
  <option value="yam">Yam</option>
  <option value="corn">Corn</option>
  <option value="cassava">Cassava</option>
</select>
</div>
<div className='py-1 px-2 rounded-lg border border-grey-200 cursor-pointer text-grey-700'>
<select id="crop" name="crop" className='bg-white'>
  <option value="tomatoes">This Week</option>
  <option value="tomatoes">This Month</option>
  <option value="yam">This Year</option>
</select>  </div>
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
<div className='text-grey-600'>
Location
</div>
<div>
Osun, Nigeria
</div>
</div>
{/* Variable */}
<div className='flex items-center justify-between'>
  {/* Variable Name */}
<div className='text-grey-600'>
Date
</div>
<div>
3rd April, 2025
</div>
</div>
{/* Variable */}
<div className='flex items-center justify-between'>
  {/* Variable Name */}
<div className='text-grey-600'>
Temperature(Min/Max)
</div>
<div>
24°C/34°C
</div>
</div>
{/* Variable */}
<div className='flex items-center justify-between'>
  {/* Variable Name */}
<div className='text-grey-600'>
Rainfall Forecast
</div>
<div>
Light rain by afternoon
</div>
</div>
{/* Variable */}
<div className='flex items-center justify-between'>
  {/* Variable Name */}
<div className='text-grey-600'>
Wind
</div>
<div>
Moderate breeze
</div>
</div>
{/* Variable */}
<div className='flex items-center justify-between'>
  {/* Variable Name */}
<div className='text-grey-600'>
Humidity 
</div>
<div>
78%
</div>
</div>
{/* Variable */}
<div className='flex items-center justify-between'>
  {/* Variable Name */}
<div className='text-grey-600'>
Sunlight Duration
</div>
<div>
8 hours
</div>
</div>
{/* Variable */}
<div className='flex items-center justify-between'>
  {/* Variable Name */}
<div className='text-grey-600'>
Dew Point
</div>
<div>
20°C
</div>
</div>
{/* Variable */}
<div className='flex items-center justify-between'>
  {/* Variable Name */}
<div className='text-grey-600'>
Extreme Weather Alert
</div>
<div>
None
</div>
</div>
</div>
    </div>
      </section>
{/* ############################################################################################### */}
      {/* Section three */}
      <section className='flex gap-8 mt-6'>
        {/* Recent Crop Logs */}
        <div className=' w-[448px] rounded-lg border-[0.75px] border-grey-200 p-4 gap-6 flex flex-col h-[250px]'>
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
<div className='text-grey-600'>
Crop Name/Growth Stage
</div>
<div>
Corn/Pre-harvest
</div>
</div>
{/* Variable */}
<div className='flex items-center justify-between'>
  {/* Variable Name */}
<div className='text-grey-600'>
Date
</div>
<div>
3rd April, 2025
</div>
</div>
{/* Variable */}
<div className='flex items-center justify-between'>
  {/* Variable Name */}
<div className='text-grey-600'>
Time
</div>
<div>
14:39PM
</div>
</div>
{/* Variable */}
<div className='flex items-center justify-between'>
  {/* Variable Name */}
<div className='text-grey-600'>
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
        {/* /////////////////////////////////////////////////////////////////////////////////// */}
        {/* Verification status */}
        <div className=' w-full rounded-lg border-[0.75px] border-grey-200 p-4 gap-6 flex flex-col max-h-[300px]  overflow-scroll'>
        <div className='flex items-center justify-between'>
        {/* Title */}
        <div className='text-xl'>
        Verifaction Status
        </div>
        </div>
        {/* Verification variables */}
<div className='flex flex-col gap-4 w-full items-  justify-center '>
{/* Variable <header>*/}
<div className='flex items-center w-full  justify-between '>
  {/* Variable Name */}
<div className='text-grey-600  w-full'>
Entry Name
</div>
<div className='text-grey-600 w-full'>
Blockchain Hash
</div>
<div className='text-grey-600  w-full'>
Verification Status
</div>
<div className='text-grey-600 w-full'>

</div>
</div>
{/* Variable */}
<div className='flex items-center justify-between '>
  {/* Variable Name */}
<div className=' w-full'>
Corn Pre-harvest
</div>
<div className=' w-full'>
0xA4B5...F7D2
</div>
<div className='w-full'>
  <button className='bg-[#F2FEF2] px-2 py-1 gap-1 flex items-center text-success-500 rounded-2xl border border-[#149414] '>
<Image src={"/icons/success.svg"} alt='success img' width={16} height={16} />
<div className='text-xs'>Success</div>
</button>
</div>

{/* Verification Link */}
<div className='w-full'>
<Image src={"/icons/link.svg"} alt='success img' width={24} height={24} />
</div>
</div>
{/* Variable */}
<div className='flex items-center justify-between '>
  {/* Variable Name */}
<div className=' w-full'>
Corn Pre-harvest
</div>
<div className=' w-full'>
0xA4B5...F7D2
</div>
<div className='w-full'>
  <button className='bg-[#FFF1F1] px-2 py-1 gap-1 flex items-center text-error-500 rounded-2xl border border-[#e30e0e] '>
<Image src={"/icons/fail.svg"} alt='rejection img' width={16} height={16} />
<div className='text-xs'>Rejected</div>
</button>
</div>

{/* Verification Link */}
<div className='w-full'>
<Image src={"/icons/link.svg"} alt='success img' width={24} height={24} />
</div>
</div>
{/* Variable */}
<div className='flex items-center justify-between '>
  {/* Variable Name */}
<div className=' w-full'>
Tomato Post-harvest
</div>
<div className=' w-full'>
0xA4B5...F7D2
</div>
<div className='w-full'>
  <button className='bg-[#FFF9E6] px-2 py-1 gap-1 flex items-center text-warning-600 rounded-2xl border border-[#e8b400] '>
<Image src={"/icons/pending.svg"} alt='Pending img' width={16} height={16} />
<div className='text-xs'>Pending</div>
</button>
</div>

{/* Verification Link */}
<div className='w-full'>
<Image src={"/icons/link.svg"} alt='success img' width={24} height={24} />
</div>
</div>
{/* Variable */}
<div className='flex items-center justify-between '>
  {/* Variable Name */}
<div className=' w-full'>
Ground Pre-harvest
</div>
<div className=' w-full'>
0xA4B5...F7D2
</div>
<div className='w-full'>
  <button className='bg-[#FFF9E6] px-2 py-1 gap-1 flex items-center text-warning-600 rounded-2xl border border-[#e8b400] '>
<Image src={"/icons/pending.svg"} alt='Pending img' width={16} height={16} />
<div className='text-xs'>Pending</div>
</button>
</div>

{/* Verification Link */}
<div className='w-full'>
<Image src={"/icons/link.svg"} alt='success img' width={24} height={24} />
</div>
</div>
{/* Variable */}
<div className='flex items-center justify-between '>
  {/* Variable Name */}
<div className=' w-full'>
Corn Post-harvest
</div>
<div className=' w-full'>
0xA4B5...F7D2
</div>
<div className='w-full'>
  <button className='bg-[#F2FEF2] px-2 py-1 gap-1 flex items-center text-success-500 rounded-2xl border border-[#149414] '>
<Image src={"/icons/success.svg"} alt='success img' width={16} height={16} />
<div className='text-xs'>Success</div>
</button>
</div>

{/* Verification Link */}
<div className='w-full'>
<Image src={"/icons/link.svg"} alt='success img' width={24} height={24} />
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
  