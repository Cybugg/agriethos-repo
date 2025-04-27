"use client"
import Switch from "@/app/components/switch";
import Image from "next/image";
import React, {ReactNode} from "react";
import { BiUpload } from "react-icons/bi";
import { MdFileUpload } from "react-icons/md";


const EditFarmImage:React.FC = () => {
    return (
        <div className="z-50 h-screen fixed flex items-center justify-center w-full bg-black bg-opacity-10 backdrop-blur-lg text-black p-8">

            {/* edit overview form */}
   <div className="p-6 bg-white w-full lg:max-w-[511px] flex flex-col items-center justify-center gap-8 lg:mr-80 ">
    {/* Title */}
    <div className="flex w-full h-full justify-between items-center">
     <div className="text-lg">
      Edit Farm Images
     </div>
    <div className="cursor-pointer">
      <Image src="/icons/cancel.svg" alt="cancel" width={24} height={24} />
    </div>
    </div>    
{/* Form  */}
<div className="w-full flex flex-col gap-6">

{/* Upload area */}
<div className="h-full w-full flex flex-col items-center justify-center gap-2 p-5">


<button className="border-[0.75px] border-[#CFCFCF] p-3 text-grey-600 rounded-2xl flex items-center gap-2">
Upload  <span className="font-bold ">4</span>Images <BiUpload className="text-2xl text-primary-500"/>
</button>
<div className="text-xs text-grey-500">
Note: You are required to upload 4 images of your farm
</div>
</div>



{/* item 6 submit*/}
<button className="bg-primary-500 text-center p-3 rounded-lg w-full">
  Save
</button>
</div>
   </div>
        </div>
    )
}

export default EditFarmImage;