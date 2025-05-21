"use client"
import React, { useEffect, useState } from 'react'
import { useNavContext } from '../NavContext';
import Image from 'next/image';
import EditOverview from '../components/editOverview';
import EditFarmMethod from '../components/editFarmMethod';
import EditFarmImage from '../components/ediitFarmImage';
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/Context/AuthContext';
import { BsPerson } from 'react-icons/bs';
import { PiPlant } from 'react-icons/pi';
import { useFarm } from '@/app/Context/FarmContext';
import Alert from '@/app/components/alert';

function page() {
    const [displayLogout,setDisplayLogout] = useState<boolean>(false);
    const [editOverview, setEditOverview] = useState<boolean | null>(false);
    const [editMethod, setEditMethod] = useState<boolean| null>(false);
      const {setCurrentPage,setMobileDisplay} = useNavContext();
      const [alertSub, setAlertSub] = useState<boolean>(false);
        const { address, logout ,isLoginStatusLoading,farmerId, newUser, user} = useAuth();
          const { farm, setFarm } = useFarm();
        const router = useRouter();

    // Route protection
    useEffect(() => {
    if (!isLoginStatusLoading && !address  ) {router.push('/auth')}
    if(address && newUser ==="true"){router.push('/onboard')}
  }, [address])

      useEffect(()=>{
        setCurrentPage("farm");
        setMobileDisplay(false);
      },[])
      
      useEffect(() => {
        if(!farm && user && !isLoginStatusLoading){
          const fetchFarm = async () => {
            try {
              const res = await fetch('http://localhost:5000/api/farm/farm-properties/'+user._id);
              if (!res.ok) throw new Error('Failed to fetch');
              const data = await res.json();
              console.log(data);
              console.log(data["images"][0])
              setFarm(data); // assuming  backend sends a valid farm object
            } catch (err) {
              console.error('Error fetching farm data:', err);
            }
          };
      
          fetchFarm();
        }
        }
          , [farmerId,farm,setFarm]);
          // capitalize first character
          function CFL(string_: string | undefined | null) {
  if (!string_) return ""; // Return empty string or fallback
  return string_.charAt(0).toUpperCase() + string_.slice(1);
}

const str2Bool = (val:string)=>{
  return val==="true"? true: val==="false"?false:undefined
};


  return (
    <div className='relative'> 
        {/* Pop ups */}
      {/* Edit overview */}
   {( editOverview &&  <EditOverview setEditMethod={setEditMethod} setEditOverview={setEditOverview}  />)}
     {editMethod && <EditFarmMethod setEditMethod={setEditMethod} setEditOverview={setEditOverview} />}
      {/* <EditFarmImage /> */}
 <div className="text-sm md:text-md min-h-screen px-[32px] py-[80px] bg-white text-black ml-[]">
    
           {/* Header and Descriptive Text */}
           <div className='flex items-start justify-between'>
        <div className='flex flex-col gap-2'>
           <div className='text-xl font-semibold lg:font-normal lg:text-2xl'>
             My Farm
           </div>
           <div className='text-grey-600'>
             Manage and update your farm details
           </div>
             <div className='flex gap-2 text-primary-700  font-bold'>
                  
                       <PiPlant /> <div>{farm?CFL(farm?farm.farmName:"N/A"):<div className='w-12 h-4 bg-gray-100'></div>}</div>
                   
                   </div>
          </div>
             <div className='flex gap-2 items-center'>
             <div className='px-2 py-1 border  border-gray-500 text-gray-600 rounded-full cursor-pointer' onClick={()=> window.location.reload()}>
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
                                   <Image src={"/icons/burger.svg"} alt="burger" width={40} height={40} className="cursor-pointer lg:hidden"  onClick={()=>setMobileDisplay(true)} />
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
 
   <div className='py-1 px-2 rounded-lg border border-grey-200 cursor-pointer text-grey-700 flex gap-2' onClick={()=>setEditOverview(true)}>
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
   {farm?CFL(farm?farm.location:"N/A"):<div className='w-12 h-4 bg-gray-100'></div>}
   </div>
   </div>
   {/* Variable */}
   <div className='flex items-center justify-between'>
     {/* Variable Name */}
   <div className='text-grey-600'>
   Size
   </div>
   <div>
   {(farm?farm.size:<div className='w-12 h-4 bg-gray-100'></div>)} {farm&&farm.size&&"acres"}
   </div>
   </div>
   {/* Variable */}
   <div className='flex items-center justify-between'>
     {/* Variable Name */}
   <div className='text-grey-600'>
   farm Type
   </div>
   <div>
   {farm?CFL(farm?farm.farmType:"N/A"):<div className='w-12 h-4 bg-gray-100'></div>}
   </div>
   </div>
   {/* Variable */}
   <div className='flex items-center justify-between'>
     {/* Variable Name */}
   <div className='text-grey-600'>
   Soil Type
   </div>
   <div>
{farm?CFL(farm?farm.soilType:"N/A"):<div className='w-12 h-4 bg-gray-100'></div>}
   </div>
   </div>
   {/* Variable */}
   <div className='flex items-center justify-between'>
     {/* Variable Name */}
   <div className='text-grey-600'>
   Water Source
   </div>
   <div>
  {farm?CFL(farm?farm.waterSource:"N/A"):<div className='w-12 h-4 bg-gray-100'></div>}
   </div>
   </div>
   </div>
       </div>
       {/* //////////////////////////////////////////////////////////////////////////////////// */}
             {/* Farming Methods */}
             <div className=' w-full rounded-lg border-[0.75px] border-grey-200 p-4 gap-6 flex flex-col'>
   <div className='flex items-center justify-between' onClick={()=>setEditMethod(true)}>
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
  {farm?CFL(farm?farm.fertilizerType:"N/A"):<div className='w-12 h-4 bg-gray-100'></div>}
   </div>
   </div>
   {/* Variable */}
   <div className='flex items-center justify-between'>
     {/* Variable Name */}
   <div className='text-grey-600'>
   Irrigation method
   </div>
   <div>
  {farm?CFL(farm?farm.irrigationType:"N/A"):<div className='w-12 h-4 bg-gray-100'></div>}
   </div>
   </div>
   {/* Variable */}
   <div className='flex items-center justify-between'>
     {/* Variable Name */}
   <div className='text-grey-600'>
   Pesticide usage
   </div>
   <div>
  {farm&&str2Bool(farm.pesticideUsage)?CFL("used"):<div className='w-12 h-4 bg-gray-100'></div>}
   </div>
   </div>
   {/* Variable */}
   <div className='flex items-center justify-between'>
     {/* Variable Name */}
   <div className='text-grey-600'>
   Cover crops 
   </div>
   <div>
  {farm && str2Bool(farm.coverCrops)?CFL("used"):<div className='w-12 h-4 bg-gray-100'></div>}
   </div>
   </div>
   {/* Variable */}
   <div className='flex items-center justify-between'>
     {/* Variable Name */}
   <div className='text-grey-600'>
   Companion planting
   </div>
   <div>
{farm&& str2Bool(farm.companionPlanting)?CFL("used"):<div className='w-12 h-4 bg-gray-100'></div>}
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
 
   <div className='py-1 px-2 rounded-lg border border-grey-200 cursor-pointer text-grey-700 flex gap-2' onClick={()=>setAlertSub(true)}>
   <Image src={"/icons/edit.png"} alt='edit img' width={24} height={24} /> <span className='hidden lg:block'>Edit Images</span>
  </div>
   </div>
   </div>
           {/* Farm Images */}
           <div className=' w-full gap-6 grid grid-cols-1 lg:grid-cols-2'>
            
              {farm && farm.images && farm["images"].map((url:string,ind:number) => <div className='w-50'  key={ind}><Image src={url} alt='img' className='w-full h-96 bg-grey-500 object-cover rounded-lg' width={100} height={100}/> </div>
 )}


           </div>
        { !farm &&  <div className=' w-full gap-6 grid grid-cols-1 lg:grid-cols-2'>
           <div className={'w-50 '}  ><div className='w-full h-96 bg-grey-100 object-cover rounded-lg'> </div></div>
           <div className={'w-50 '}  ><div className='w-full h-96 bg-grey-100 object-cover rounded-lg'> </div></div>
           <div className={'w-50 '}  ><div className='w-full h-96 bg-grey-100 object-cover rounded-lg'> </div></div>
           <div className={'w-50 '}  ><div className='w-full h-96 bg-grey-100 object-cover rounded-lg'> </div></div>
</div>
}
         </section>
         </div>
         {alertSub && <Alert message='Sorry, you cannot make changes to your farm images at the moment...' onClose={()=> setAlertSub(false)} color='text-yellow-800'  background='bg-yellow-100' />}
    </div>
    
  )
}

export default page;