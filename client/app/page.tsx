"use client"
import Image from "next/image";
import IndexNavbar from "./components/indexNavbar";
import { useState } from "react";
import { BiSearch } from "react-icons/bi";

export default function Home() {
  const [mobileDisplay,setMobileDisplay] = useState(false)
  return (
    <div className="bg-white h-screen flex w-full">
        <div className="flex bg-white w-full">
      <IndexNavbar currentPage="home" mobileDisplay={false} setMobileDisplay={setMobileDisplay}/>
      <main className="lg:ml-[352px] w-full flex-1 bg-white ">
        <div className="text-sm md:text-md min-h-screen px-[32px] py-[80px] bg-white text-black w-full ">
                {/* Search bar */}
                
             <div className=''>
                <div className=' border-2 w-[400px] rounded-full flex gap-1 items-center justify-between px-4 py-2'>
                  <input type="Search" placeholder="search" className="outline-none  w-full "/> <BiSearch className="text-[24px] text-grey-500" />
                </div>
             
           </div>
           {/* Header */}
            <div className='flex flex-col gap-2 mt-8'>
                   <div className='text-xl font-semibold lg:font-normal lg:text-2xl'>
                     Explore
                   </div>
                   <div className='text-grey-600'>
                   Browse produce with traceable origins
                   </div>
                   <div className='flex gap-2 text-primary-700  font-bold'>
                  
                   </div>
                  </div>
               {/* Section One */}
               {/* Overview Stats */}
               <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  mt-8 w-full gap-5 '>
                
                {/* item */}
                <div className="flex flex-col p-4 border rounded-lg cursor-pointer">
                  <div className="flex justify-between py-3">
                  <div className="text-primary-700 gap-2 font-bold flex items-center justify-center">
                    <div className="rounded-full w-8 h-8 bg-blue-500 overflow-hidden">
                      <Image src={"/static/farm2.png"}alt={"pfp"} width={50} height={50} className="w-full h-full object-cover" loading="lazy"/>
                    </div>
                  <div>Jameo Farm</div>  
                  </div>
                  <div className="text-gray-600">
                  15 mins ago
                  </div>
                  </div>
                
                  <div>
                    <Image src={"/static/strawberry.png"} alt={"item"} width={280} height={200} className="w-full h-64 object-cover" />
                  </div>
                  {/* Propertie */}
                  <div className="flex flex-col mt-4 justify-center">
                    {/* Crop name */}
                    <div className="text-lg ">Strawberry</div>
                    <div className="justify-between flex item-center">
                    {/* location */}
                    <div className=" font-thin">
                      Osun, Nigeria
                    </div>
                    {/* Farm Type */}
                    <div className="text-grey-600">
                      Hydroponics Farm
                    </div>
                    </div>
                  </div>
                </div>
                   {/* item */}
                   <div className="flex flex-col p-4 border rounded-lg cursor-pointer">
                  <div className="flex justify-between py-3">
                  <div className="text-primary-700 gap-2 font-bold flex items-center justify-center">
                    <div className="rounded-full w-8 h-8 bg-blue-500 overflow-hidden">
                      <Image src={"/static/farm2.png"}alt={"pfp"} width={50} height={50} className="w-full h-full object-cover" loading="lazy"/>
                    </div>
                  <div>Jameo Farm</div>  
                  </div>
                  <div className="text-gray-600">
                  15 mins ago
                  </div>
                  </div>
                
                  <div>
                    <Image src={"/static/strawberry.png"} alt={"item"} width={280} height={200} className="w-full h-64 object-cover" />
                  </div>
                  {/* Propertie */}
                  <div className="flex flex-col mt-4 justify-center">
                    {/* Crop name */}
                    <div className="text-lg ">Strawberry</div>
                    <div className="justify-between flex item-center">
                    {/* location */}
                    <div className=" font-thin">
                      Osun, Nigeria
                    </div>
                    {/* Farm Type */}
                    <div className="text-grey-600">
                      Hydroponics Farm
                    </div>
                    </div>
                  </div>
                </div>
                   {/* item */}
                   <div className="flex flex-col p-4 border rounded-lg cursor-pointer">
                  <div className="flex justify-between py-3">
                  <div className="text-primary-700 gap-2 font-bold flex items-center justify-center">
                    <div className="rounded-full w-8 h-8 bg-blue-500 overflow-hidden">
                      <Image src={"/static/farm2.png"}alt={"pfp"} width={50} height={50} className="w-full h-full object-cover" loading="lazy"/>
                    </div>
                  <div>Jameo Farm</div>  
                  </div>
                  <div className="text-gray-600">
                  15 mins ago
                  </div>
                  </div>
                
                  <div>
                    <Image src={"/static/strawberry.png"} alt={"item"} width={280} height={200} className="w-full h-64 object-cover" />
                  </div>
                  {/* Propertie */}
                  <div className="flex flex-col mt-4 justify-center">
                    {/* Crop name */}
                    <div className="text-lg ">Strawberry</div>
                    <div className="justify-between flex item-center">
                    {/* location */}
                    <div className=" font-thin">
                      Osun, Nigeria
                    </div>
                    {/* Farm Type */}
                    <div className="text-grey-600">
                      Hydroponics Farm
                    </div>
                    </div>
                  </div>
                </div>
                
                 
                 
             
                
             </section>
        {/* ############################################################################################### */}
        
        
        </div>
        </main>
    </div>
     
    </div>
  );
}
