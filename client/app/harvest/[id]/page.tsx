"use client"
import IndexNavbar from "@/app/components/indexNavbar";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { IoMdArrowRoundBack } from "react-icons/io";
import Link from "next/link";
import ImageViewer from "@/app/components/imageViewer";
import { useAuth } from "@/app/Context/AuthContext";
import Image from "next/image";


interface crop{
    cropName:string
    images:string[]
    [key:string]:string|string[]|any
}

export default function Home() {
   const [mobileDisplay,setMobileDisplay] = useState(false);
   const [crop, setCrop] =useState<crop|undefined>(undefined)
   const {user} = useAuth()
   const { id } = useParams();
   const router = useRouter();

  //  function getGridCols(count:number) {
  //   switch (count) {
  //     case 1:
  //       return 'grid-cols-1';
  //     case 2:
  //       return 'grid-cols-2';
  //     case 3:
  //       return 'grid-cols-2 md:grid-cols-3';
  //     case 4:
  //     default:
  //       return 'grid-cols-2 md:grid-cols-4';
  //   }
  // }
  //  let's fetch the crop details  
  useEffect(
    ()=>{
        const fetchCrop =async()=>{
            const result =  await fetch("https://api.agriethos.com/api/crops/"+id);
            const {data,message} =  await result.json();
            if(!result.ok ){
                console.log("Error:",message)
                return
            }
            setCrop(data);
        } 
        fetchCrop();
    },[crop,id]
  )

  const [selectedImages, setSelectedImages] = useState<string[]>([""]);

  useEffect(
    ()=>{
      if(crop){
        setSelectedImages(crop.images);
      }
    },[crop]

  )
  const [isViewerOpen, setIsViewerOpen] = useState(false);
        const [currentIndex, setCurrentIndex] = useState(0);
      
        const openViewer = (index: number) => {
          setCurrentIndex(index);
          setIsViewerOpen(true);
        };
      
        const next = () =>selectedImages && selectedImages && setCurrentIndex((prev) => (prev + 1) % selectedImages.length);
        const prev = () =>selectedImages && selectedImages && setCurrentIndex((prev) => (prev - 1 + selectedImages.length) % selectedImages.length);

  return (
    <div className="bg-white h-screen flex w-full">
<div className="flex bg-white w-full">
<IndexNavbar currentPage="home" mobileDisplay={mobileDisplay} setMobileDisplay={setMobileDisplay}/>
<main className="lg:ml-[352px] w-full flex-1 bg-white ">
  <div className="text-sm md:text-md min-h-screen px-[32px] py-5 lg:py-[80px]  bg-white text-black w-full">
   {/* Header */}
    <div className='flex flex-col gap-2 '>
      <div className="flex items-center justify-between gap-3">
   <div className='text-xl font-semibold lg:font-normal lg:text-2xl flex gap-5 items-center '>
          <div className="border p-2 rounded-full text-xl cursor-pointer" onClick={()=> router.back()}><IoMdArrowRoundBack/></div>  <div>About this harvest</div> 
           </div>
              {/* Signin */}
    {!user && <Link href={`/auth`} className={`group relative flex items-center text-black justify-start rounded-lg cursor-pointer transition gap-[12px] p-[12px] ${"border border-[#a5eb4c] bg-primary-500  text-md"}`}>
   <div>
   {"Sign in"}  
   </div>
  </Link>}
      </div>
        
          </div>
          <div className="flex gap-2 my-2">
             {crop?.farmPropertyId?._id && (
            <div className="my-3">
               <Link 
                            href={`/harvest/farm/${crop?.farmPropertyId._id}`}
                            className="px-3 py-1 bg-white text-black rounded-md text-sm border border-black "
                          >
                           Click to View Farm 
                          </Link>
            </div>
                         
                        )}
                        {crop?.blockchainTxHash && (
            <div className="my-3">
               <Link 
                            href={`https://sepolia.etherscan.io/tx/${crop.blockchainTxHash}`}
                            className="px-3 py-1 bg-white text-black rounded-md text-sm border border-black "
                          >
                           View on etherscan
                          </Link>
            </div>
                         
                        )}  
          </div>
       
<div className="w-full" >
         {crop?.cropName &&
          <div className="flex flex-col xl:flex-row justify-between  gap-32 items-start w-full">
             {/* left-Body of the main page */}
                      <div className="flex basis-1/3 flex-col text-lg w-full border border-gray-200 p-5 rounded-2xl">
                        <div className="font-semibold my-3g">Pre-harvest details:</div>
       
                  <div className="space-y-4 mt-2">
                    <div className="flex justify-between">
                      <span className="text-[#898989]">Crop name</span>
                      <span className="font-medium text-black">{crop?.cropName}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-[#898989]">Farm name</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-black">{crop?.farmPropertyId?.farmName || 'N/A'}</span>
                        
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-[#898989]">Growth stage</span>
                      <span className="font-medium text-black ">{crop?.growthStage}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-[#898989]">Farm location</span>
                      <span className="font-medium text-black">{crop?.farmPropertyId?.location || 'N/A'}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-[#898989]">Planting date</span>
                      <span className="font-medium text-black">
                        {new Date(crop?.plantingDate).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-[#898989]">Expected harvest date</span>
                      <span className="font-medium text-black">{crop?.expectedHarvestingDate}</span>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-[#898989] mb-2">Pre-harvest notes</span>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-black">{crop?.preNotes || 'No notes provided'}</span>
                      </div>
                    </div>
                    <div className="font-semibold my-3 mt-5">Post-harvest details:</div>
                    {<div className='space-y-4'>
                      <div className="flex justify-between">
                      <span className="text-[#898989]">Harvesting Date</span>
                      <div className="  rounded-lg">
                        <span className="font-medium text-black">{crop?.harvestingDate.slice(0,10) || 'No harvest date provided'}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#898989]">Storage Method</span>
                      <div className="  rounded-lg">
                        <span className="font-medium text-black">{crop?.storageMethod || 'No storage method provided'}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#898989]">Quantity Harvested</span>
                      <div className="  rounded-lg">
                        <span className="font-medium text-black">{crop?.quantityHarvested || 'No quantity provided'}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#898989]">Unit</span>
                      <div className="  rounded-lg">
                        <span className="font-medium text-black">{crop?.unit || 'No notes provided'}</span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[#898989] mb-2">Post-harvest notes</span>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-black">{crop?.postNotes || 'No notes provided'}</span>
                      </div>
                    </div>
                    </div>
                     }

                     {/* {crop?.preHarvestAgent && (
                      <div className="flex justify-between">
                        <span className="text-[#898989]">Pre-harvest Reviewer</span>
                        <span className="font-medium text-black">{crop.preHarvestAgent.slice(0, 6)}...{crop.preHarvestAgent.slice(-4)}</span>
                      </div>
                    )}

                    {crop?.postHarvestAgent && (
                      <div className="flex justify-between">
                        <span className="text-[#898989]">Post-harvest Reviewer</span>
                        <span className="font-medium text-black">{crop.postHarvestAgent.slice(0, 6)}...{crop.postHarvestAgent.slice(-4)}</span>
                      </div>
                    )} */}
</div>
          </div>

          {/* Images */}
          <div className='flex gap-4 basis-2/3 w-full'>
            <div className={`grid grid-cols-1 xl:grid-cols-2 gap-5`}>
 {crop && crop.images[0] && crop.images.map((img:string, idx:number) => (
        <Image
        height={100}
        width={100}
          key={idx}
          src={img}
          alt={`thumb-${idx}`}
          className="w-full object-cover h-72  rounded-lg cursor-pointer"
          onClick={() => openViewer(idx)}
        />
      ))}
            </div>


      {isViewerOpen && (
        <ImageViewer
          images={crop && crop.images}
          currentIndex={currentIndex}
          onClose={() => setIsViewerOpen(false)}
          onNext={next}
          onPrev={prev}
        />
      )}
</div>
          </div>}
</div>
  </div> 
</main>
</div>

</div>
  );
}

