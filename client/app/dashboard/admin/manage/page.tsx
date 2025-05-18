// Admins dashboard

"use client"

import { useEffect, useState } from "react";
import { useNavContext } from "../NavContext";
import Image from "next/image";
import AddAdminModal from "../components/addAdminModal";
import Alert from "@/app/components/alert";
import { useAdminAuth } from "@/app/Context/AdminAuthContext";


interface admin{
  name : string;
  [key:string]:string
}



export default function Home() {

  const [admins,setAdmins] = useState<admin[]>([]);
  const [ displayAddAdminModal,setDisplayAddAdminModal] = useState<boolean>();
  const [ alertCreate,setAlertCreate] = useState<boolean>();
  const [ alertErrorCreate,setAlertErrorCreate] = useState<boolean>();
  const {setCurrentPage,setMobileDisplay} = useNavContext();
  const {user} = useAdminAuth();

   useEffect(()=>{
          setCurrentPage("manage");
          setMobileDisplay(false);
        },[])
  
        // to fetch admin properties and set it to state
        useEffect(
          ()=>{
            const fetchAdmins = async()=>{
                try{
                  if(user){
                     const result = await fetch("http://localhost:5000/api/admin/admins/"+user._id);
                     const {data} = await result.json();
                     setAdmins(data);
                  }
                 
                }
                catch(err){
                  console.log(err);
                }
            };
            fetchAdmins();
          },[user]
        )
  

    return (
      <div>
      {displayAddAdminModal &&  <AddAdminModal setAdmins={setAdmins} setAlertCreate={setAlertCreate} setAlertErrorCreate={setAlertErrorCreate} setDisplayAddAdminModal={setDisplayAddAdminModal}/>}
      
 <div className="text-sm md:text-md min-h-screen px-[32px] py-[80px] bg-white text-black  ">

        {/* Header and Descriptive Text */}
        <div className='flex items-start justify-between'>
     <div className='flex flex-col gap-2'>
        <div className='text-xl font-semibold lg:font-normal lg:text-2xl'>
          Manage users
        </div>
      
   </div>
       <div className='flex gap-2 items-center'>
       <div className='px-2 py-1 border  border-gray-500 text-gray-600 rounded-full cursor-pointer' onClick={()=> window.location.reload()}>
        Reload
       </div>
                    <button className='px-2 py-1 border-2 w-full border-[#a5eb4c] rounded-2xl  lg:block text-grey-800'>
                      
            
                       
                       </button>
        
                   </div>
        </div>
       {/* Section One */}
       {/* Overview Stats */}
{/* ########################################################################################################### */}
     <section>
        {/* Header */}
        <div className="flex items-center justify-between">
<div className="mt-12 text-xl px-2 py-1">
            Agents
        </div>
         <div className='py-1 px-2 rounded-lg border border-grey-200 cursor-pointer text-grey-700 flex items-center gap-2' onClick={()=>""}>
              <Image src={"/icons/plus.svg"} alt='edit img' width={24} height={24} /> <span className='hidden lg:block'>Add agents</span> 
             </div>
        </div>
        

        <div className="flex flex-col gap-2">
            {/* Title */}
      <div className='bg-gray-100 gap-24 flex items-center text-center justify-between w-full px-2 py-1 border-b '>
          {/* S/N */}
      <div  className='basis-1/4 flex items-center justify-center '>
 S/N
      </div>
        {/* Variable Name */}
      <div className='text-grey-900 basis-1/4 overflow-x-scroll '>
    Address
      </div>
    
      <div className='text-grey-900 basis-1/4 overflow-x-scroll '>
      Name
      </div>
      <div className='text-grey-900 basis-1/4 overflow-x-scroll '>
      Date Created
      </div>

      </div>
   
      {/* Body */}
      <div className="max-h-96 min-h-24   overflow-y-scroll w-full">
        <div className="flex items-center p-12 text-gray-600 justify-center w-full ">
        No Reviewer added yet
        </div>

</div>
        </div>
     </section>
{/* ############################################################################################### */}
<section>
        {/* Header */}
        <div className="flex items-center justify-between">
<div className="mt-12 text-xl px-2 py-1">
            Admins
        </div>
         <div className='py-1 px-2 rounded-lg border border-grey-200 cursor-pointer text-grey-700 flex items-center gap-2' onClick={()=>setDisplayAddAdminModal(true)}>
              <Image src={"/icons/plus.svg"} alt='edit img' width={24} height={24} /> <span className='hidden lg:block'>Add Admin</span> 
             </div>
        </div>
        

        <div className="flex flex-col gap-2">
            {/* Title */}
      <div className='bg-gray-100 gap-24 flex items-center text-center justify-between w-full px-2 py-1 border-b '>
          {/* S/N */}
      <div  className='basis-1/4 flex items-center justify-center '>
 S/N
      </div>
        {/* Variable Name */}
      <div className='text-grey-900 basis-1/4 overflow-x-scroll '>
    Address
      </div>
    
      <div className='text-grey-900 basis-1/4 overflow-x-scroll '>
      Name
      </div>
      <div className='text-grey-900 basis-1/4 overflow-x-scroll '>
      Date Created
      </div>

      </div>
         {/* Body */}
<div className="max-h-96 min-h-24   overflow-y-scroll w-full">

  {admins && admins.map((ele,ind)=>(
    <div className=' hover:bg-gray-100 gap-24 flex items-center text-center justify-between w-full px-2 py-2 ' key={ind*526+123}>
          {/* S/N */}
      <div  className='basis-1/4 flex items-start justify-center '>
     {ind+1}
      </div>
        {/* Variable Name */}
      <div className='text-grey-900 basis-1/4 overflow-x-scroll '>
      {ele && ele.walletAddress} 
      </div>
    
      <div className='text-grey-900 basis-1/4 overflow-x-scroll '>
      {ele && ele.name}
      </div>
      <div className='text-grey-900 basis-1/4 overflow-x-scroll '>
      {ele && ele.createdAt}
      </div>

      </div>
  ))}
  {!admins && <div className="flex items-center p-12 text-gray-600 justify-center w-full ">
        No Admin added yet
        </div>}

</div>

        </div>
     </section>

</div>

   {alertCreate && <Alert message='Added successfully' onClose={()=> setAlertCreate(false)} color='text-green-800'  background='bg-green-100' />}
            {alertErrorCreate && <Alert message='Something went wrong, try again...' onClose={()=> setAlertErrorCreate(false)} color='text-red-800'  background='bg-red-100' />}
      </div>
     
    );
  }
  