// Admins dashboard

"use client"

import { useEffect } from "react";
import { useNavContext } from "../NavContext";
import Image from "next/image";




export default function Home() {

  const {setCurrentPage,setMobileDisplay} = useNavContext();


   useEffect(()=>{
          setCurrentPage("manage");
          setMobileDisplay(false);
        },[])
  
        // to fetch farm properties and set it to state
  

    return (
      <div className="text-sm md:text-md min-h-screen px-[32px] py-[80px] bg-white text-black">
        {/* Header and Descriptive Text */}
        <div className='flex items-start justify-between'>
     <div className='flex flex-col gap-2'>
        <div className='text-xl font-semibold lg:font-normal lg:text-2xl'>
          Manage users
        </div>
      
   </div>
       <div className='flex gap-2 items-center'>
       <div className='px-2 py-1 border border-gray-600 rounded-full cursor-pointer' onClick={()=> window.location.reload()}>
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
            Reviewers
        </div>
         <div className='py-1 px-2 rounded-lg border border-grey-200 cursor-pointer text-grey-700 flex items-center gap-2' onClick={()=>""}>
              <Image src={"/icons/plus.svg"} alt='edit img' width={24} height={24} /> <span className='hidden lg:block'>Add Reviwer</span> 
             </div>
        </div>
        

        <div className="flex flex-col gap-2">
            {/* Title */}
      <div className='bg-gray-100 gap-24 flex items-center text-center justify-between w-full px-2 py-1 border-b '>
          {/* S/N */}
      <div  className='basis-1/5 flex items-center justify-center '>
 S/N
      </div>
        {/* Variable Name */}
      <div className='text-grey-900 basis-1/5 '>
    Address
      </div>
    
      <div className='text-grey-900 basis-1/5 '>
      Name
      </div>
      <div className='text-grey-900 basis-1/5 '>
      Date Created
      </div>

      </div>
      {/* Body */}

        </div>
     </section>
{/* ############################################################################################### */}
<section>
        {/* Header */}
        <div className="flex items-center justify-between">
<div className="mt-12 text-xl px-2 py-1">
            Admins
        </div>
         <div className='py-1 px-2 rounded-lg border border-grey-200 cursor-pointer text-grey-700 flex items-center gap-2' onClick={()=>""}>
              <Image src={"/icons/plus.svg"} alt='edit img' width={24} height={24} /> <span className='hidden lg:block'>Add Admins</span> 
             </div>
        </div>
        

        <div className="flex flex-col gap-2">
            {/* Title */}
      <div className='bg-gray-100 gap-24 flex items-center text-center justify-between w-full px-2 py-1 border-b '>
          {/* S/N */}
      <div  className='basis-1/5 flex items-center justify-center '>
 S/N
      </div>
        {/* Variable Name */}
      <div className='text-grey-900 basis-1/5 '>
    Address
      </div>
    
      <div className='text-grey-900 basis-1/5 '>
      Name
      </div>
      <div className='text-grey-900 basis-1/5 '>
      Date Created
      </div>

      </div>
      {/* Body */}

        </div>
     </section>

</div>
    );
  }
  