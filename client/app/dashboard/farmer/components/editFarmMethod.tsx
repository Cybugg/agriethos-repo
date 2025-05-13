"use client"
import Switch from "@/app/components/switch";
import Image from "next/image";
import React, {ReactNode} from "react";



interface props {
    setEditOverview: (data:boolean) => void 
    setEditMethod: (data:boolean) => void 
}

const EditFarmMethod:React.FC<props> = ({setEditMethod}) => {
    return (
        <div className="z-50 h-screen fixed flex items-center justify-center w-full bg-black bg-opacity-10 backdrop-blur-lg text-black p-8">

            {/* edit overview form */}
   <div className="p-6 bg-white w-full lg:max-w-[511px] flex flex-col items-center justify-center gap-8 lg:mr-80 ">
    {/* Title */}
    <div className="flex w-full h-full justify-between items-center">
     <div className="text-lg">
      Edit Farm Methods
     </div>
    <div className="cursor-pointer" onClick={()=>setEditMethod(false)}>
      <Image src="/icons/cancel.svg" alt="cancel" width={24} height={24} />
    </div>
    </div>    
{/* Form  */}
<div className="w-full flex flex-col gap-6">
{/* item 1*/}
<div className="flex flex-col gap-1">
    <div className="text-grey-600 text-xs">
        Fertilizer type:
        </div>
<div className="border-[0.75px] border-[#CFCFCF] p-3 rounded-lg w-full">
    <select id="fertilizer-type" name="fertilizer_type" defaultValue={""}  className="bg-white outline-none border-none text-black w-full">
        <option value={""} disabled  className="bg-white text-black" >Fertilizer type</option>
        <option value={"organic"} className="bg-white text-black" >Organice</option>
        <option value={"synthetic"} className="bg-white text-black" >synthetic</option>
        <option value={"none"} className="bg-white text-black" >None</option>
    </select>
</div>
</div>
{/* item 2*/}
<div className="flex flex-col gap-1">
    <div className="text-grey-600 text-xs">
        Irrigation method:
        </div>
<div className="border-[0.75px] border-[#CFCFCF] p-3 rounded-lg w-full">
    <select id="irrigation" name="irrigation_mthod" defaultValue={""} className="bg-white outline-none border-none text-black w-full">
        <option value={""} disabled  className="bg-white text-black" >Irrigation method</option>
        <option value={"sprinkler"} className="bg-white text-black" >Sprinkler</option>
        <option value={"drip"} className="bg-white text-black" >Drip</option>
        <option value={"flood"} className="bg-white text-black" >Flood</option>
        <option value={"rain-fed"} className="bg-white text-black" >Rain-fed</option>
        <option value={"none"} className="bg-white text-black" >None</option>
    </select>
</div>
</div>
{/* item 3*/}
<div className=" p-3 rounded-lg w-full flex justify-between items-center">
    {/* label */}
   <div>
   Pesticide usage
   </div>
   {/* switch */}
   <div>
<Switch isOn={false} handleToggle={()=>{}} />
   </div>
</div>
{/* item 4*/}
<div className=" p-3 rounded-lg w-full flex justify-between items-center">
     {/* label */}
   <div>
   Cover crops used 
   </div>
   {/* switch */}
   <div>
   <Switch isOn={false} handleToggle={()=>{}} />
   </div>
</div>
{/* item 5*/}
<div className=" p-3 rounded-lg w-full flex justify-between items-center">
   {/* label */}
   <div>
Companion planting
   </div>
   {/* switch */}
   <div>
   <Switch isOn={false} handleToggle={()=>{}} />
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

export default EditFarmMethod;