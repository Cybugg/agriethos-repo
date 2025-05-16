"use client"
import React, { useEffect, useState } from 'react'
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
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/Context/AuthContext';
import { BsPerson } from 'react-icons/bs';
import { PiPlant } from 'react-icons/pi';
import { GrUpdate } from "react-icons/gr";
import Alert from '@/app/components/alert';
import { useFarm } from '@/app/Context/FarmContext';

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


interface crops {
  cropName:string
  [key:string]:string
}

type cropData = {
    cropName:string;
    plantingDate:string;
    expectedHarvestingDate:string;
    growthStage:string;
    preNotes:string;
    [key:string]:string;
}

function page() {
      const [displayLogout,setDisplayLogout] = useState<boolean>(false);
      const [displayAddCrop,setDisplayAddCrop] = useState<boolean>(false)
      const {setCurrentPage,setMobileDisplay} = useNavContext();
      const { address, logout ,isLoginStatusLoading,newUser,farmerId} = useAuth();
      const [alertCreate, setAlertCreate] = useState(false);
      const [alertErrorCreate, setAlertErrorCreate] = useState(false);
      const [collaInd , setCollaInd] = useState<number|undefined>(undefined);
      const [crops, setCrops] = useState<any[]>([]);
      const router = useRouter();
    
      useEffect(()=>{
        setCurrentPage("logs");
        setMobileDisplay(false);
      
      },[])

      useEffect(
        ()=>{
          const fetchCrops = async() =>{
            try{
              const res = await fetch("http://localhost:5000/api/crops/farmer/"+farmerId) 
              const {data} = await res.json();
              setCrops(data);
              console.log(data)
            }
            catch(err){
              console.log(err)
            }
          };
         farmerId && fetchCrops();
        },[farmerId]
      )

         // Route protection
          useEffect(() => {
          if (!isLoginStatusLoading && !address  ) {router.push('/auth')}
          if(address && newUser ==="true"){router.push('/onboard')}
        }, [address])
      
  return (
    <div>
       {displayAddCrop && <AddCrop setDisplayAddCrop={setDisplayAddCrop} setAlertCreate={setAlertCreate} setCrops={setCrops} setAlertErrorCreate={setAlertErrorCreate} />}
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
                <div className='flex gap-2 text-primary-700 text-xs font-bold'>
                     
                          <PiPlant /> <div>Jameo Farm</div>
                      
                      </div>
             </div>
              <div className='flex gap-2 items-center'>
              <div className='px-2 py-1 border border-gray-600 rounded-full cursor-pointer' onClick={()=> window.location.reload()}>
        Reload
       </div>
                                <button className='px-2 py-1 border-2 w-full border-[#a5eb4c] rounded-2xl  lg:block text-grey-800'>
                                                                                              
              <div className='flex items-center justify-center gap-2 relative' onClick={()=> setDisplayLogout(!displayLogout)}>  <div className='text-grey-800 text-lg'><BsPerson /></div> <div>{address && address.slice(0,6)}...{address&&address.slice(-4)}</div>
             <div className='absolute bottom-[-150%] w-full flex flex-col bg-grey-100'>
{ displayLogout && <div className='text-black bg-primary-500 py-1 px-2' onClick={()=> logout()}>
  Disconnect
  </div>}
 </div>
 </div> 
                                                                                               
                                                                                               </button>
                         <Image src={"/icons/bell.svg"} alt="bell" width={24} height={24} className="cursor-pointer hidden lg:block" />
                         <Image src={"/icons/burger.svg"} alt="menu" width={24} height={24} className="cursor-pointer lg:hidden"  onClick={()=>setMobileDisplay(true)}/>
                                </div>
              </div>
   
      {/* ########################################################################################################### */}
            {/* Section One */}
            <section className=' mt-6 '>
       {/* ////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* */}
           <div className='w-full rounded-lg border-[0.75px] border-grey-200 p-4 gap-6 flex flex-col justify-start items-start  '>
      <div className='flex items-center justify-between w-full'>
        {/* Title */}
      <div className='text-lg font-semibold lg:font-normal lg:text-xl'>
      Crops Growth & Tracking
      </div>
      <div className='flex gap-2'>
    
      <div className='py-1 px-2 rounded-lg border border-grey-200 cursor-pointer text-grey-700 flex items-center gap-2' onClick={()=>setDisplayAddCrop(true)}>
      <Image src={"/icons/plus.svg"} alt='edit img' width={24} height={24} /> <span className='hidden lg:block'>Add Crop</span> 
     </div>
      </div>
      </div>
       {/* lists of farm variables */}
       <div className='flex flex-col gap-4 w-full justify-between'>
      
      {/* Variable */}
      <div className='bg-gray-100 gap-24 flex items-center text-center justify-between w-full px-2 py-1 border-b '>
          {/* S/N */}
      <div  className='basis-1/5 flex items-center justify-center '>
 S/N
      </div>
        {/* Variable Name */}
      <div className='text-grey-900 basis-1/5 '>
    Crop Name
      </div>
    
      <div className='text-grey-900 basis-1/5 '>
      Growth Stage
      </div>
      <div className='text-grey-900 basis-1/5 '>
      Date Created
      </div>
    
      <div className='text-grey-900 basis-1/5 '>
      Crop Status
      </div>
      </div>
       {/* Variable */}
       <div className='flex flex-col gap-4 w-full justify-between  max-h-[300px] overflow-y-scroll'>
             { crops && crops.map((ele,ind)=><div className='relative'> <div className='hover:bg-gray-100 gap-24 flex items-center  justify-between w-full text-center my-1' key={ind*2*1020} onClick={()=>collaInd!== ind ?setCollaInd(ind):setCollaInd(undefined)}>
           {/* s/n */}
           <div className='basis-1/5 flex items-center justify-center '>
          {ind+1}
        </div>
        {/* Variable Name */}
      <div className=' basis-1/5 flex items-center justify-center '>
 {ele.cropName}
      </div>
   
      <div className=' basis-1/5 flex items-center justify-center  '>
      {ele.growthStage}
      </div>

      <div className=' basis-1/5 flex items-center justify-center  '>
    {ele.createdAt&&ele.createdAt.slice(0,10)}
      </div>
      {/* Button arena */}
   {ele.verificationStatus === "toUpgrade"?       <div className='  basis-1/5 flex items-center justify-center '>
           <button className='bg-white  px-2 py-1 gap-1 flex items-center text-success-500 rounded-2xl border border-[#149414] hover:bg-[#1494140c]'>
           <div className="w-4 h-4"><GrUpdate /></div>
           <div className='text-xs'>Upgrade</div>
</button>
      </div>: ele.verificationStatus === "rejected"?  <div className='basis-1/5 flex items-center justify-center  text-error-500'>
      
      <button className='bg-[#FFF1F1] px-2 py-1 gap-1 flex items-center text-error-500 rounded-2xl border border-[#e30e0e] '>
<Image src={"/icons/fail.svg"} alt='rejection img' width={16} height={16} />
<div className='text-xs'>Rejected</div>
</button>
      </div>:ele.verificationStatus === "verified"? <div className='basis-1/5   flex items-center justify-center'>
      <button className='bg-[#F2FEF2]  px-2 py-1 gap-1 flex items-center text-success-500 rounded-2xl border border-[#149414] '>
<Image src={"/icons/success.svg"} alt='success img' width={16} height={16} />
<div className='text-xs'>Success</div>
</button>
      </div>:ele.verificationStatus === "pending"?      <div className='basis-1/5 flex items-center justify-center '>
      <button className='px-2 py-1 gap-1 flex items-center text-warning-600 rounded-2xl border border-[#e8b400] '>
<Image src={"/icons/pending.svg"} alt='Pending img' width={16} height={16} />
<div className='text-xs'>Pending</div>
</button>
      </div>:      <div className='basis-1/5 flex items-center justify-center '>
      <button className='px-2 py-1 gap-1 flex items-center text-warning-600 rounded-2xl border border-[#e8b400] '>
<Image src={"/icons/pending.svg"} alt='Pending img' width={16} height={16} />
<div className='text-xs'>Unkown</div>
</button>
      </div>}
      </div>
   {collaInd === ind &&   <div className='p-5 w-full flex flex-col gap-1 bg-primary-100 font-bold'>
<div>
Created at: {ele.createdAt}
</div>
<div>
Updated at: {ele.updatedAt}
</div>
<div>
Crop name: {ele.cropName}
</div>
<div>
Growth Stage: {ele.growthStage}
</div>
<div>
Planting Date: {ele.plantingDate}
</div>

<div>
Notes On Pre-harvest: {ele.growthStage}
</div>
<div>
Verification Status: {ele.verificationStatus}
</div>
      </div>}
      </div>)
}
       </div>
       {/* __v: 0
​​
_id: "6827b470490fb108f50add43"
​​
createdAt: "2025-05-16T21:56:00.011Z"
​​
cropName: "rfhbhsdbfsd"
​​
expectedHarvestingDate: "2025-05-31"
​​
farmPropertyId: Object { _id: "6820b769323b085dc0d7ac3a", farmerId: "6820b711323b085dc0d7ac34", farmName: "Collosal", … }
​​
farmerId: "6820b711323b085dc0d7ac34"
​​
growthStage: "pre-harvest"
​​
images: Array []
​​
plantingDate: "2025-05-17T00:00:00.000Z"
​​
preNotes: "sdfsdfsd"
​​
updatedAt: "2025-05-16T21:56:00.011Z"
​​
verificationStatus: "pending" */}

       {/* Variable */}
       {/* <div className='hover:bg-gray-100 text-center gap-24 flex items-center justify-between'> */}
           {/* s/n */}
           {/* <div className='basis-1/5 flex items-center justify-center '>
          3
        </div> */}
        {/* Variable Name */}
      {/* <div className='basis-1/5 flex items-center justify-center '>
    Yam
      </div>
     
      <div className='basis-1/5 flex items-center justify-center '>
      Pre-harvest
      </div>
       <div className=' basis-1/5 flex items-center justify-center  '>
      05/06/25
      </div>
      <div className='basis-1/5 flex items-center justify-center '>
      <button className='px-2 py-1 gap-1 flex items-center text-warning-600 rounded-2xl border border-[#e8b400] '>
<Image src={"/icons/pending.svg"} alt='Pending img' width={16} height={16} />
<div className='text-xs'>Pending</div>
</button>
      </div>
      </div> */}
       {/* Variable */}
       {/* <div className='hover:bg-gray-100 text-center gap-24 flex items-center justify-between'> */}
           {/* s/n */}
           {/* <div className='basis-1/5 flex items-center justify-center '>
          4
        </div> */}
        {/* Variable Name */}
      {/* <div className='basis-1/5 flex items-center justify-center '>
    Tomato
      </div>
   
      <div className='basis-1/5 flex items-center justify-center '>
      Pre-harvest
      </div>
    <div className=' basis-1/5 flex items-center justify-center  '>
      05/06/25
      </div>
      <div className='basis-1/5 flex items-center justify-center  text-error-500'>
      
      <button className='bg-[#FFF1F1] px-2 py-1 gap-1 flex items-center text-error-500 rounded-2xl border border-[#e30e0e] '>
<Image src={"/icons/fail.svg"} alt='rejection img' width={16} height={16} />
<div className='text-xs'>Rejected</div>
</button>
      </div>
      </div> */}
       {/* Variable */}
       {/* <div className='hover:bg-gray-100 text-center gap-24 flex items-center justify-between '> */}
           {/* s/n */}
           {/* <div className='basis-1/5 flex items-center justify-center '>
          5
        </div> */}
        {/* Variable Name */}
      {/* <div className='basis-1/5 flex items-center justify-center '>
    Corn
      </div> */}
  
      {/* <div className='basis-1/5 flex items-center justify-center '>
      Post-harvest
      </div>
      <div className=' basis-1/5 flex items-center justify-center  '>
      05/06/25
      </div>
      <div className='basis-1/5   flex items-center justify-center'>
      <button className='bg-[#F2FEF2]  px-2 py-1 gap-1 flex items-center text-success-500 rounded-2xl border border-[#149414] '>
<Image src={"/icons/success.svg"} alt='success img' width={16} height={16} />
<div className='text-xs'>Success</div>
</button>
      </div> */}
      {/* </div> */}
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
       Post-harvest Verifications
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
            {alertCreate && <Alert message='Crop successfully submitted for review' onClose={()=> setAlertCreate(false)} color='text-green-800'  background='bg-green-100' />}
            {alertErrorCreate && <Alert message='Something went wrong, try again...' onClose={()=> setAlertErrorCreate(false)} color='text-red-800'  background='bg-red-100' />}
    </div>
       
  )
}

export default page;