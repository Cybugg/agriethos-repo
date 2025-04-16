"use client"
import React, { useEffect } from 'react'
import { useNavContext } from '../NavContext';
import Image from 'next/image';
import EditOverview from '../components/editOverview';

function page() {
      const {setCurrentPage,setMobileDisplay} = useNavContext();
    
      useEffect(()=>{
        setCurrentPage("farm");
        setMobileDisplay(false);
      },[])
  return (
    <div> 
        {/* Pop ups */}
      {/* Edit overview */}
      {/* <EditOverview /> */}
 <div className="text-sm md:text-md min-h-screen px-[32px] py-[80px] bg-white text-black">
    
           {/* Header and Descriptive Text */}
           <div className='flex items-start justify-between'>
        <div className='flex flex-col gap-2'>
           <div className='text-xl font-semibold lg:font-normal lg:text-2xl'>
             My Farm
           </div>
           <div className='text-grey-600'>
             Manage and update your farm details
           </div>
          </div>
             <div className='flex gap-2 items-center'>
                                           <button className='px-2 py-1 border-2 border-[#a5eb4c] rounded-2xl hidden lg:block'>Add Wallet</button>
                                   <Image src={"/icons/bell.svg"} alt="bell" width={24} height={24} className="cursor-pointer hidden lg:block" />
                                   <Image src={"/icons/burger.svg"} alt="burger" width={24} height={24} className="cursor-pointer lg:hidden"  onClick={()=>setMobileDisplay(true)} />
                                          </div>
           </div>

   {/* ########################################################################################################### */}
         {/* Section One */}
         <section className='flex flex-col lg:flex-row gap-8 items-start mt-6 '>
   
    {/* ////////////////////////////////////////////////////////////////////////////////////////////// */}
           {/* Farm Overview */}
        <div className=' w-full rounded-lg border-[0.75px] border-grey-200 p-4 gap-6 flex flex-col'>
   <div className='flex items-center justify-between'>
     {/* Title */}
   <div className='text-lg font-semibold lg:font-normal lg:text-xl'>
   Farm Overview
   </div>
   <div className='flex gap-2'>
 
   <div className='py-1 px-2 rounded-lg border border-grey-200 cursor-pointer text-grey-700 flex gap-2'>
   <Image src={"/icons/edit.png"} alt='edit img' width={24} height={24} /> <span className='hidden lg:block'>Edit</span>
  </div>
   </div>
   </div>
    {/* lists of farm variables */}
    <div className='flex flex-col gap-4 w-full justify-between'>
   
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
   Size
   </div>
   <div>
   25 acres
   </div>
   </div>
   {/* Variable */}
   <div className='flex items-center justify-between'>
     {/* Variable Name */}
   <div className='text-grey-600'>
   farm Type
   </div>
   <div>
   N/A
   </div>
   </div>
   {/* Variable */}
   <div className='flex items-center justify-between'>
     {/* Variable Name */}
   <div className='text-grey-600'>
   Soil Type
   </div>
   <div>
 N/A
   </div>
   </div>
   {/* Variable */}
   <div className='flex items-center justify-between'>
     {/* Variable Name */}
   <div className='text-grey-600'>
   Water Source
   </div>
   <div>
   N/A
   </div>
   </div>
   </div>
       </div>
       {/* //////////////////////////////////////////////////////////////////////////////////// */}
             {/* Farming Methods */}
             <div className=' w-full rounded-lg border-[0.75px] border-grey-200 p-4 gap-6 flex flex-col'>
   <div className='flex items-center justify-between'>
     {/* Title */}
   <div className='text-lg font-semibold lg:font-normal lg:text-xl'>
   Farming Methods
   </div>
   <div className='flex gap-2'>
 
   <div className='py-1 px-2 rounded-lg border border-grey-200 cursor-pointer text-grey-700 flex gap-2'>
   <Image src={"/icons/edit.png"} alt='edit img' width={24} height={24} /> <span className='hidden lg:block'>Edit </span>
  </div>
   </div>
   </div>
    {/* lists of farm variables */}
    <div className='flex flex-col gap-4 w-full justify-between'>
   
   {/* Variable */}
   <div className='flex items-center justify-between'>
     {/* Variable Name */}
   <div className='text-grey-600'>
   Fertilizer type
   </div>
   <div>
   N/A
   </div>
   </div>
   {/* Variable */}
   <div className='flex items-center justify-between'>
     {/* Variable Name */}
   <div className='text-grey-600'>
   Irrigation method
   </div>
   <div>
   N/A
   </div>
   </div>
   {/* Variable */}
   <div className='flex items-center justify-between'>
     {/* Variable Name */}
   <div className='text-grey-600'>
   Pesticide usage
   </div>
   <div>
   N/A
   </div>
   </div>
   {/* Variable */}
   <div className='flex items-center justify-between'>
     {/* Variable Name */}
   <div className='text-grey-600'>
   Cover crops used
   </div>
   <div>
   N/A
   </div>
   </div>
   {/* Variable */}
   <div className='flex items-center justify-between'>
     {/* Variable Name */}
   <div className='text-grey-600'>
   Companion planting
   </div>
   <div>
 N/A
   </div>
   </div>
   </div>
       </div>
         </section>
   {/* ############################################################################################### */}
         {/* Section two */}
         <section className='mt-6 rounded-lg border-[0.75px] border-grey-200 p-4 flex flex-col gap-6'>
         <div className='flex items-center justify-between'>
     {/* Title */}
   <div className='text-lg font-semibold lg:font-normal lg:text-xl'>
   Farm Images
   </div>
   <div className='flex gap-2'>
 
   <div className='py-1 px-2 rounded-lg border border-grey-200 cursor-pointer text-grey-700 flex gap-2'>
   <Image src={"/icons/edit.png"} alt='edit img' width={24} height={24} /> <span className='hidden lg:block'>Edit Images</span>
  </div>
   </div>
   </div>
           {/* Farm Images */}
           <div className=' w-full gap-6 grid grid-cols-1 lg:grid-cols-2'>
            <div className='w-50'>
  <Image src={"/static/farm1.png"} alt='img' className='w-full h-96 bg-grey-500 object-cover rounded-lg' width={100} height={100}/>
            </div>
            <div className='w-50'>
  <Image src={"/static/farm2.png"} alt='img' className='w-full h-96 bg-grey-500 object-cover rounded-lg' width={100} height={100}/>
            </div>
            <div className='w-50'>
  <Image src={"/static/farm3.png"} alt='img' className='w-full h-96 bg-grey-500 object-cover rounded-lg' width={100} height={100}/>
            </div>
            <div className='w-50'>
  <Image src={"/static/farm4.png"} alt='img' className='w-full h-96 bg-grey-500 object-cover rounded-lg' width={100} height={100}/>
            </div>
           </div>
         </section>
         </div>
    </div>
    
  )
}

export default page;