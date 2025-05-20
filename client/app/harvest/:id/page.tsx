"use client"
import IndexNavbar from "@/app/components/indexNavbar";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { BiLeftArrow } from "react-icons/bi";


interface crop{
    cropName:string
    images:string[]
    [key:string]:string|string[]
}

export default function Home() {
   const [mobileDisplay,setMobileDisplay] = useState(false);
   const [crop, setCrop] =useState(undefined)
   const { id } = useParams();
   const router = useRouter();

  //  let's fetch the crop details  
  useEffect(
    ()=>{
        const fetchCrop =async()=>{
            const result =  await fetch("http://localhost:5000/api/crops/"+id);
            const {data,message} =  await result.json();
            if(!result.ok ){
                console.log("Error:",message)
                return
            }
            setCrop(data);
        } 
        fetchCrop();
    },[]
  )

  return (
    <div className="bg-white h-screen flex w-full">
<div className="flex bg-white w-full">
<IndexNavbar currentPage="home" mobileDisplay={false} setMobileDisplay={setMobileDisplay}/>
<main className="lg:ml-[352px] w-full flex-1 bg-white ">
   {/* Header */}
    <div className='flex flex-col gap-2 mt-8'>
           <div className='text-xl font-semibold lg:font-normal lg:text-2xl flex gap-1'>
          <div className="border p-2 rounded-full"><BiLeftArrow/></div>  <div>About this harvest</div> 
           </div>
           <div className='text-grey-600'>
           Browse produce with traceable origins
           </div>
           <div className='flex gap-2 text-primary-700  font-bold'>
          
           </div>
          </div>
        
</main>
</div>

</div>
  );
}

