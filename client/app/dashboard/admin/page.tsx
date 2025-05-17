// Admins dashboard

"use client"

import { useEffect } from "react";
import { useNavContext } from "./NavContext";




export default function Home() {

  const {setCurrentPage,setMobileDisplay} = useNavContext();


   useEffect(()=>{
          setCurrentPage("home");
          setMobileDisplay(false);
        },[])
  
        // to fetch farm properties and set it to state
  

    return (
      <div className="text-sm md:text-md min-h-screen px-[32px] py-[80px] bg-white text-black">
        {/* Header and Descriptive Text */}
        <div className='flex items-start justify-between'>
     <div className='flex flex-col gap-2'>
        <div className='text-xl font-semibold lg:font-normal lg:text-2xl'>
          Home
        </div>
        <div className='text-grey-600'>
         An Overview of Agriethos
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
       <section className='flex flex-col lg:flex-row mt-[32px] w-full border-[0.75px] border-grey-200 rounded-lg'>
        
             {/* Item 2 */}
             <div className='flex flex-col gap-[24px] w-full py-[32px] px-[24px] lg:border-r-[0.75px] border-b-[0.75px] lg:border-b-0 border-grey-200'>
          <div className='flex'>
           <div className='text-sm text-grey-400'>
          Farmers's registered
          </div>
         
          </div>
          <div className='text-2xl '>
            123
          </div>
        </div>
             {/* Item 3 */}
             <div className='flex flex-col gap-[24px] w-full py-[32px] px-[24px] lg:border-r-[0.75px] border-b-[0.75px] lg:border-b-0 border-grey-200'>
          <div className='flex items-center justify-between'>
           <div className='text-sm text-grey-400'>
       Active Reviewers
          </div>
          <div className='text-sm text-grey-400'>
            
          </div >
          </div>
          <div className='text-2xl '>
      4
          </div>
        </div>
             {/* Item 4 */}
             <div className='flex flex-col gap-[24px] w-full py-[32px] px-[24px]'>
          <div className='flex'>
           <div className='text-sm text-grey-400'>
          Total Admins
          </div>
      
          </div>
          <div className='text-2xl '>
            0
          </div>
        </div>
             {/* Item 4 */}
             <div className='flex flex-col gap-[24px] w-full py-[32px] px-[24px]'>
          <div className='flex'>
           <div className='text-sm text-grey-400'>
          Total Crops Submitted
          </div>
      
          </div>
          <div className='text-2xl '>
            17
          </div>
        </div>
       </section>
{/* ########################################################################################################### */}
     <section>
        {/* Header */}
        <div className="mt-12 text-xl px-2 py-1">
            Reviewers
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

</div>
    );
  }
  