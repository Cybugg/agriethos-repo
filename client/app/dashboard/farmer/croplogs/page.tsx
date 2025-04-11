"use client"
import React, { useEffect } from 'react'
import { useNavContext } from '../NavContext';
import Image from 'next/image';

function page() {
      const {setCurrentPage} = useNavContext();
    
      useEffect(()=>{
        setCurrentPage("logs")
      },[])
  return (
       <div className="min-h-screen px-[32px] py-[80px] bg-white text-black">
              {/* Header and Descriptive Text */}
              <div className='flex items-start justify-between'>
           <div className='flex flex-col gap-2'>
              <div className='text-2xl'>
                Crop Logs
              </div>
              <div className='text-grey-600'>
                Keep track of every farming activity
              </div>
             </div>
             <div className='flex gap-2 items-center'>
              <button className='px-2 py-1 border-2 border-[#a5eb4c] rounded-2xl'>Connect Wallet</button>
      <Image src={"/icons/bell.svg"} alt="bell" width={24} height={24} className="cursor-pointer"></Image>
             </div>
              </div>
   
      {/* ########################################################################################################### */}
            {/* Section One */}
            <section className=' mt-6 '>
       {/* ////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* */}
           <div className=' w-full rounded-lg border-[0.75px] border-grey-200 p-4 gap-6 flex flex-col justify-center items-start max-h-[400px] overflow-scroll'>
      <div className='flex items-center justify-between w-full'>
        {/* Title */}
      <div className='text-xl'>
      Crops Growth & Tracking
      </div>
      <div className='flex gap-2'>
    
      <div className='py-1 px-2 rounded-lg border border-grey-200 cursor-pointer text-grey-700 flex gap-2'>
      <Image src={"/icons/plus.svg"} alt='edit img' width={24} height={24} /> Add Crop
     </div>
      </div>
      </div>
       {/* lists of farm variables */}
       <div className='flex flex-col gap-4 w-full justify-between '>
      
      {/* Variable */}
      <div className='flex items-center justify-between'>
        {/* Variable Name */}
      <div className='text-grey-600 w-full'>
    Crop Name
      </div>
      <div className='text-grey-600 w-full'>
      Planning Date
      </div>
      <div className='text-grey-600 w-full'>
      Growth Stage
      </div>
      <div className='text-grey-600 w-full'>
      Harvest Date
      </div>
      <div className='text-grey-600 w-full'>
      Images
      </div>
      <div className='text-grey-600 w-24'>
      
      </div>
      </div>
       {/* Variable */}
       <div className='flex items-center justify-between'>
        {/* Variable Name */}
      <div className='w-full'>
    Strawberry
      </div>
      <div className='w-full'>
      2 April, 2025
      </div>
      <div className='w-full'>
      Pre-harvest
      </div>
      <div className='w-full'>
      3 December, 2025
      </div>
      <div className='text-success-700 w-full font-bold cursor-pointer hover:underline'>
     <span className='hover:underline'>View Images</span>
      </div>
      <div className='w-24'>
      <Image src={"/icons/edit.png"} className='cursor-pointer' alt='edit img' width={24} height={24} />
      </div>
      </div>
       {/* Variable */}
       <div className='flex items-center justify-between'>
        {/* Variable Name */}
      <div className='w-full'>
    Banana
      </div>
      <div className='w-full'>
      8 April, 2025
      </div>
      <div className='w-full'>
      Pre-harvest
      </div>
      <div className='w-full'>
    3 june, 2025
      </div>
      <div className='text-success-700 w-full font-bold cursor-pointer hover:underline'>
     <span className='hover:underline'>View Images</span>
      </div>
      <div className='w-24'>
      <Image src={"/icons/edit.png"} className='cursor-pointer' alt='edit img' width={24} height={24} />
      </div>
      </div>
       {/* Variable */}
       <div className='flex items-center justify-between'>
        {/* Variable Name */}
      <div className='w-full'>
    Yam
      </div>
      <div className='w-full'>
      2 April, 2025
      </div>
      <div className='w-full'>
      Pre-harvest
      </div>
      <div className='w-full'>
      7 Augusr, 2025
      </div>
      <div className='text-success-700 w-full font-bold cursor-pointer hover:underline'>
     <span className='hover:underline'>View Images</span>
      </div>
      <div className='w-24'>
      <Image src={"/icons/edit.png"} className='cursor-pointer' alt='edit img' width={24} height={24} />
      </div>
      </div>
       {/* Variable */}
       <div className='flex items-center justify-between'>
        {/* Variable Name */}
      <div className='w-full'>
    Tomato
      </div>
      <div className='w-full'>
      4 january, 2025
      </div>
      <div className='w-full'>
      Pre-harvest
      </div>
      <div className='w-full'>
      3 June, 2025
      </div>
      <div className='text-success-700 w-full font-bold cursor-pointer hover:underline'>
     <span className='hover:underline'>View Images</span>
      </div>
      <div className='w-24'>
      <Image src={"/icons/edit.png"} className='cursor-pointer' alt='edit img' width={24} height={24} />
      </div>
      </div>
       {/* Variable */}
       <div className='flex items-center justify-between'>
        {/* Variable Name */}
      <div className='w-full'>
    Corn
      </div>
      <div className='w-full'>
      16 Febuary, 2025
      </div>
      <div className='w-full'>
      Post-harvest
      </div>
      <div className='w-full'>
      2 April, 2025
      </div>
      <div className='text-success-700 w-full font-bold cursor-pointer hover:underline'>
     <span className='hover:underline'>View Images</span>
      </div>
      <div className='w-24'>
      <Image src={"/icons/edit.png"} className='cursor-pointer' alt='edit img' width={24} height={24} />
      </div>
      </div>
      </div>
          </div>
            </section>
      {/* ############################################################################################### */}
            {/* Section two */}
            <section className='mt-6 flex gap-8 items-start '>
  <div className=' w-full rounded-lg border-[0.75px] border-grey-200 p-4 gap-6 flex flex-col max-h-[350px]  overflow-scroll'>
        <div className='flex items-center justify-between'>
        {/* Title */}
        <div className='text-xl'>
        Verifications
        </div>
        </div>
        {/* Verification variables */}
<div className='flex flex-col gap-4 w-full items-  justify-center '>
{/* Variable <header>*/}
<div className='flex items-center w-full  justify-between '>
  {/* Variable Name */}
<div className='text-grey-600  w-full'>
Crop Name
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
Strawberry
</div>
<div className='w-full'>
  <button className='bg-[#F2FEF2] px-2 py-1 gap-1 flex items-center text-success-500 rounded-2xl border border-[#149414] '>
<Image src={"/icons/success.svg"} alt='success img' width={16} height={16} />
<div className='text-xs'>Success</div>
</button>
</div>
{/* Verification action */}
<div className='w-full'>
  <button className='hover:underline text-black'>
View QR Code
</button>
</div>
</div>
{/* Variable */}
<div className='flex items-center justify-between '>
  {/* Variable Name */}
<div className=' w-full'>
Corn Pre-harvest
</div>
<div className='w-full'>
  <button className='bg-[#FFF1F1] px-2 py-1 gap-1 flex items-center text-error-500 rounded-2xl border border-[#e30e0e] '>
<Image src={"/icons/fail.svg"} alt='rejection img' width={16} height={16} />
<div className='text-xs'>Rejected</div>
</button>
</div>
{/* Verification action */}
<div className='w-full'>
  <button className='hover:underline text-black'>
Request Re-verification
</button>
</div>
</div>
{/* Variable */}
<div className='flex items-center justify-between '>
  {/* Variable Name */}
<div className=' w-full'>
Tomato Post-harvest
</div>
<div className='w-full'>
  <button className='bg-[#FFF9E6] px-2 py-1 gap-1 flex items-center text-warning-600 rounded-2xl border border-[#e8b400] '>
<Image src={"/icons/pending.svg"} alt='Pending img' width={16} height={16} />
<div className='text-xs'>Pending</div>
</button>
</div>
{/* Verification action */}
<div className='w-full'>
  <button className='hover:underline text-black'>

</button>
</div>
</div>
{/* Variable */}
<div className='flex items-center justify-between '>
  {/* Variable Name */}
<div className=' w-full'>
Ground Pre-harvest
</div>
<div className='w-full'>
  <button className='bg-[#FFF9E6] px-2 py-1 gap-1 flex items-center text-warning-600 rounded-2xl border border-[#e8b400] '>
<Image src={"/icons/pending.svg"} alt='Pending img' width={16} height={16} />
<div className='text-xs'>Pending</div>
</button>
</div>
{/* Verification action */}
<div className='w-full'>
  <button className='hover:underline text-black'>

</button>
</div>
</div>
{/* Variable */}
<div className='flex items-center justify-between '>
  {/* Variable Name */}
<div className=' w-full'>
Corn Post-harvest
</div>
<div className='w-full'>
  <button className='bg-[#F2FEF2] px-2 py-1 gap-1 flex items-center text-success-500 rounded-2xl border border-[#149414] '>
<Image src={"/icons/success.svg"} alt='success img' width={16} height={16} />
<div className='text-xs'>Success</div>
</button>
</div>
{/* Verification action */}
<div className='w-full'>
  <button className='hover:underline text-black'>
View QR Code
</button>
</div>
</div>
        <div>
     </div>
     </div>
        </div>

        {/* Verification Statistics */}
        <div className=' w-full basis-2/5 rounded-lg border-[0.75px] border-grey-200 p-4 gap-6 flex flex-col max-h-[350px]  overflow-scroll'>
        <div className='flex items-center justify-between'>
        {/* Title */}
        <div className='text-xl'>
        Verifications Statistics
        </div>
        </div>
        {/* Pie-chart */}
<div className='flex flex-col gap-4 w-full items-  justify-center '>
     </div>
     {/* Labels */}
     <div className='flex items-center justify-between'>
{/* item */}
<div className='gap-2 flex items-center'>
<div className='p-2 rounded-full h-2 w-2 bg-success-500'>

</div>
<div>
  Success
</div>
</div>
{/* item */}
<div className='gap-2 flex items-center'>
<div className='p-2 rounded-full h-2 w-2 bg-warning-500'>

</div>
<div>
  Pending
</div>
</div>
{/* item */}
<div className='gap-2 flex items-center'>
<div className='p-2 rounded-full h-2 w-2 bg-error-500'>
</div>
<div>
  Rejected
</div>
</div>
     </div>
        </div>
            </section>
            </div>
  )
}

export default page;