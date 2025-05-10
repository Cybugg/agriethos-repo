"use client"
import Switch from "@/app/components/switch";
import Image from "next/image";
import React, {ReactNode} from "react";


const AddCrop:React.FC = () => {
    return (
        <div className="z-50 h-screen fixed flex items-center justify-center w-full bg-black bg-opacity-10 backdrop-blur-lg text-black p-8">

            {/* Add overview form */}
   <div className="p-6 bg-white w-full lg:max-w-[511px] flex flex-col items-center justify-center gap-8 lg:mr-80 ">
    {/* Title */}
    <div className="flex w-full h-full justify-between items-center">
     <div className="text-lg">
      Add Crop
     </div>
    <div className="cursor-pointer">
      <Image src="/icons/cancel.svg" alt="cancel" width={24} height={24} />
    </div>
    </div>    
{/* Form  */}
<div className="w-full flex flex-col gap-6">
{/* item 1*/}
{/* Crop name */}
<div className="flex flex-col gap-1">
    <div className="text-grey-600 text-xs">
        Crop name:
        </div>
<div className="border-[0.75px] border-[#CFCFCF] p-3 rounded-lg w-full">
   <input type="text" placeholder="Crop name"name="crop_name" className="w-full outline-none"  />
</div></div>

{/* item 2*/}
{/* Planting date */}
<div className="flex flex-col gap-1">
    <div className="text-grey-600 text-xs">
        Planting date:
        </div>
   <div className="border-[0.75px] border-[#CFCFCF] p-3 rounded-lg w-full">
<input type="date" placeholder="Planting date"name="planting_date" className="w-full outline-none"  />
</div> 
</div>
{/* item 2.5*/}
{/* Harvesting date */}
<div className="flex flex-col gap-1">
    <div className="text-grey-600 text-xs">
       Expected Harvesting date:
        </div>
   <div className="border-[0.75px] border-[#CFCFCF] p-3 rounded-lg w-full">
<input type="date" placeholder="harvesting date"name="harvesting_date" className="w-full outline-none"  />
</div> 
</div>


{/* item 3*/}
{/* Growth Stage */}
<div className="flex flex-col gap-1">
    <div className="text-grey-600 text-xs">
        Crop growth stage:
        </div>
<div className="p-3 rounded-lg w-full flex justify-between items-center border-[0.75px] border-[#CFCFCF]">
  <select id={"growth_stage"} name="growth_stage" className="bg-white outline-none border-none text-black w-full "  defaultValue={""} >
    <option disabled  value={""}>Select Crop-growth stage</option>
    <option   value={"pre-harvest"}>Pre-harvest</option>
    {/* <option   value={"post-harvest"}>Post-harvest</option> */}
  </select>
</div></div>

{/* item 4  */}
{/* Crop images */}
{/* <div className="flex flex-col items-center justify-center w-full border-[0.75px] border-[#CFCFCF] gap-6 rounded-lg text-grey-200 text-xs py-8 px-6">
    <Image src="/icons/image.svg" alt="img_icon" width={40} height={40} />
<div>
    <span className="text-primary-500  font-bold">Upload 2 images</span> or drag and drop 
</div> 
<div className=""> 
PNG, JPG up to 2MB
</div>
</div> */}

{/* item 6 submit*/}
<button className="bg-primary-500 text-center p-3 rounded-lg w-full">
  Submit
</button>

</div>
   </div>
        </div>
    )
}

export default AddCrop;