"use client"
import React, { useEffect } from 'react'
import { useNavContext } from '../NavContext';
import Image from 'next/image';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import AddCrop from '../components/addCrops';

// Define the type for a single data item
interface PieDataItem {
  name: string;
  value: number;
}

// Define props type
interface PieChartComponentProps {
  data: PieDataItem[];
}

// Custom color palette
const COLORS = ['#149414', '#ffc600', '#e30e0e', '#FF8042'];

// Sample Data
const sampleData = [
  { name: 'Success', value: 60 },
  { name: 'Pending', value: 30 },
  { name: 'Rejected', value: 10 },
];

function page() {
      const {setCurrentPage,setMobileDisplay} = useNavContext();
    
      useEffect(()=>{
        setCurrentPage("logs");
        setMobileDisplay(false);
      },[])
      
  return (
    <div>
       <AddCrop />
<div className="text-sm md:text-md min-h-screen px-[32px] py-[80px] bg-white text-black">
       
              {/* Header and Descriptive Text */}
              <div className='flex items-start justify-between'>
           <div className='flex flex-col gap-2'>
              <div className='text-xl font-semibold lg:font-normal lg:text-2xl'>
                Crop Logs
              </div>
              <div className='text-grey-600'>
                Keep track of every farming activity
              </div>
             </div>
              <div className='flex gap-2 items-center'>
                                 {/* <button className='px-2 py-1 border-2 border-[#a5eb4c] rounded-2xl hidden lg:block'>Add Wallet</button> */}
                         <Image src={"/icons/bell.svg"} alt="bell" width={24} height={24} className="cursor-pointer hidden lg:block" />
                         <Image src={"/icons/burger.svg"} alt="menu" width={24} height={24} className="cursor-pointer lg:hidden"  onClick={()=>setMobileDisplay(true)}/>
                                </div>
              </div>
   
      {/* ########################################################################################################### */}
            {/* Section One */}
            <section className=' mt-6 '>
       {/* ////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* */}
           <div className='w-full rounded-lg border-[0.75px] border-grey-200 p-4 gap-6 flex flex-col justify-center items-start lg:max-h-[400px] overflow-y-scroll'>
      <div className='flex items-center justify-between w-full'>
        {/* Title */}
      <div className='text-lg font-semibold lg:font-normal lg:text-xl'>
      Crops Growth & Tracking
      </div>
      <div className='flex gap-2'>
    
      <div className='py-1 px-2 rounded-lg border border-grey-200 cursor-pointer text-grey-700 flex items-center gap-2'>
      <Image src={"/icons/plus.svg"} alt='edit img' width={24} height={24} /> <span className='hidden lg:block'>Add Crop</span> 
     </div>
      </div>
      </div>
       {/* lists of farm variables */}
       <div className='flex flex-col gap-4 w-full justify-between'>
      
      {/* Variable */}
      <div className='hover:bg-gray-100 gap-24 flex items-center text-center justify-between w-full'>
        {/* Variable Name */}
      <div className='text-grey-600 basis-1/3 '>
    Crop Name
      </div>
    
      <div className='text-grey-600 basis-1/3 '>
      Growth Stage
      </div>
    
      <div className='text-grey-600 basis-1/3 '>
      Crop Status
      </div>
      </div>
       {/* Variable */}
       <div className='hover:bg-gray-100 gap-24 flex items-center  justify-between w-full text-center'>
        {/* Variable Name */}
      <div className=' basis-1/3 flex items-center justify-center '>
    Strawberry
      </div>
   
      <div className=' basis-1/3 flex items-center justify-center  '>
      Pre-harvest
      </div>
   
      <div className='  basis-1/3 flex items-center justify-center '>
           <button className='bg-white  px-2 py-1 gap-1 flex items-center text-success-500 rounded-2xl border border-[#149414] '>
<div className='text-xs'>Update</div>
</button>
      </div>
      </div>
       {/* Variable */}
       <div className='hover:bg-gray-100 text-center gap-24 flex items-center justify-between'>
        {/* Variable Name */}
      <div className='basis-1/3 flex items-center justify-center '>
    Banana
      </div>
      
      <div className='basis-1/3 flex items-center justify-center '>
      Pre-harvest
      </div>
<div className='basis-1/3 flex items-center justify-center '>
     <button className='bg-white  px-2 py-1 gap-1 flex items-center text-success-500 rounded-2xl border border-[#149414] '>
<div className='text-xs'>Update</div>
</button>
</div>
     
      </div>
       {/* Variable */}
       <div className='hover:bg-gray-100 text-center gap-24 flex items-center justify-between'>
        {/* Variable Name */}
      <div className='basis-1/3 flex items-center justify-center '>
    Yam
      </div>
     
      <div className='basis-1/3 flex items-center justify-center '>
      Pre-harvest
      </div>
     
      <div className='basis-1/3 flex items-center justify-center '>
     under review
      </div>
      </div>
       {/* Variable */}
       <div className='hover:bg-gray-100 text-center gap-24 flex items-center justify-between'>
        {/* Variable Name */}
      <div className='basis-1/3 flex items-center justify-center '>
    Tomato
      </div>
   
      <div className='basis-1/3 flex items-center justify-center '>
      Pre-harvest
      </div>
    
      <div className='basis-1/3 flex items-center justify-center  text-error-500'>
     Rejected
      </div>
      </div>
       {/* Variable */}
       <div className='hover:bg-gray-100 text-center gap-24 flex items-center justify-between '>
        {/* Variable Name */}
      <div className='basis-1/3 flex items-center justify-center '>
    Corn
      </div>
  
      <div className='basis-1/3 flex items-center justify-center '>
      Post-harvest
      </div>
      
      <div className='basis-1/3   flex items-center justify-center'>
      <button className='bg-[#F2FEF2]  px-2 py-1 gap-1 flex items-center text-success-500 rounded-2xl border border-[#149414] '>
<Image src={"/icons/success.svg"} alt='success img' width={16} height={16} />
<div className='text-xs'>Success</div>
</button>
      </div>
      </div>
      </div>
          </div>
            </section>
      {/* ############################################################################################### */}
            {/* Section two */}
            <section className='mt-6 flex flex-col lg:flex-row gap-8 items-start '>
  <div className=' w-full rounded-lg border-[0.75px] border-grey-200 p-4 gap-6 flex flex-col max-h-[350px]  overflow-y-scroll'>
        <div className='flex items-center justify-between'>
        {/* Title */}
        <div className='text-lg font-semibold lg:font-normal lg:text-xl'>
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
<span className='hidden lg:block'>Verification</span> Status
</div>
<div className='text-grey-600 w-full'>
</div>
</div>
{/* Variable */}
<div className='hover:bg-gray-100 gap-24 flex items-center justify-between '>
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
  <button className='hover:underline text-black font-bold'>
  <span className='lg:hidden'>QR Code</span><span className='hidden lg:block'>View QR Code</span>
</button>
</div>
</div>
{/* Variable */}
<div className='hover:bg-gray-100 gap-24 flex items-center justify-between '>
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
  <button className='hover:underline text-black font-bold'>
<span className='lg:hidden'>Reverify</span><span className='hidden lg:block'>Request Re-verification </span>
</button>
</div>
</div>
{/* Variable */}
<div className='hover:bg-gray-100 gap-24 flex items-center justify-between '>
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
  <button className='hover:underline text-black font-bold'>

</button>
</div>
</div>
{/* Variable */}
<div className='hover:bg-gray-100 gap-24 flex items-center justify-between '>
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
  <button className='hover:underline text-black font-bold'>

</button>
</div>
</div>
{/* Variable */}
<div className='hover:bg-gray-100 gap-24 flex items-center justify-between '>
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
  <button className='hover:underline text-black font-bold'>
<span className='lg:hidden'>QR Code</span><span className='hidden lg:block'>View QR Code</span>
</button>
</div>
</div>
        <div>
     </div>
     </div>
        </div>

        {/* Verification Statistics */}
        <div className=' w-full lg:basis-2/5 rounded-lg border-[0.75px] border-grey-200 p-4 gap-6 flex flex-col  '>
        <div className='flex items-center justify-between'>
        {/* Title */}
        <div className='text-lg font-semibold lg:font-normal lg:text-xl'>
        Verifications Statistics
        </div>
        </div>
        {/* Pie-chart */}
<div className='flex flex-col gap-4 w-full justify-center '>
<ResponsiveContainer width="100%" height={300}>
      <PieChart>
        {/* Pie component for data rendering */}
        <Pie
          data={sampleData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label
        >
          {/* Map through data to assign colors */}
          {sampleData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
     </div>
        </div>
            </section>
            </div>
    </div>
       
  )
}

export default page;