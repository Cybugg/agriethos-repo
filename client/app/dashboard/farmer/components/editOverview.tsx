"use client"
import Image from "next/image";
import React, {ReactNode} from "react";


const EditOverview:React.FC = () => {
    return (
        <div className="z-50 h-screen fixed flex items-center justify-center w-full bg-black bg-opacity-10 backdrop-blur-lg text-black p-8">

            {/* edit overview form */}
   <div className="p-6 bg-white w-full lg:max-w-[511px] flex flex-col items-center justify-center gap-8 lg:mr-80 ">
    {/* Title */}
    <div className="flex w-full h-full justify-between items-center">
     <div className="text-lg">
      Edit Farm Overview
     </div>
    <div className="cursor-pointer">
      <Image src="/icons/cancel.svg" alt="cancel" width={24} height={24} />
    </div>
    </div>    
{/* Form  */}
<div className="w-full flex flex-col gap-6">
{/* item 1*/}
<div className="border-[0.75px] border-[#CFCFCF] p-3 rounded-lg w-full">
    <select id="location" name="country" defaultValue={""}  className="bg-white outline-none border-none text-black w-full">
        <option value={""} disabled  className="bg-white text-black" >Country</option>
        <option value={"NG"} className="bg-white text-black" >Nigeria</option>
    </select>
</div>

{/* item 2*/}
<div className="border-[0.75px] border-[#CFCFCF] p-3 rounded-lg w-full">
    <select id="location" name="state" defaultValue={""} className="bg-white outline-none border-none text-black w-full">
        <option value={""} disabled  className="bg-white text-black" >State</option>
        <option value={"Osun"} className="bg-white text-black" >Osun</option>
    </select>
</div>
{/* item 2.5*/}
<div className="border-[0.75px] border-[#CFCFCF] p-3 rounded-lg w-full">
<input type="number" placeholder="Farm size in acres" className="w-full outline-none"/>
</div>
{/* item 3*/}
<div className="border-[0.75px] border-[#CFCFCF] p-3 rounded-lg w-full">
    <select id="location" name="farm" defaultValue={""}  className="bg-white outline-none border-none text-black w-full">
        <option value={""} disabled  className="bg-white text-black" >Farm type</option>
        <option value={"organic"} >Organic farming</option>
        <option value={"conventional"} >Conventional farming</option>
        <option value={"hydroponic"} >Hydroponic farming</option>
        <option value={"vertical"} >Vertical farming</option>
        <option value={"qquaponic"} >Aquaponic farming</option>
        <option value={"industrial"} >Industrial farming</option>
    </select>
</div>
{/* item 4*/}
<div className="border-[0.75px] border-[#CFCFCF] p-3 rounded-lg w-full">
    <select id="location" name="soil" defaultValue={""} className="bg-white outline-none border-none text-black w-full">
        <option value={""} disabled  className="bg-white text-black" >Soil type</option>
        <option value={"sandy"} >Sandy soil</option>
        <option value={"clay"} >Clay soil</option>
        <option value={"loamy"} >Loamy soil</option>
        <option value={"peaty"} >peaty soil</option>
        <option value={"chalk"} >Chalk soil</option>
        <option value={"silt"} >Silt soil</option>
    </select>
</div>
{/* item 5*/}
<div className="border-[0.75px] border-[#CFCFCF] p-3 rounded-lg w-full">
    <select id="location" name="water" defaultValue={""}  className="bg-white outline-none border-none text-black w-full">
        <option value={""} disabled  className="bg-white text-black" >Water source</option>
        <option value={"surface water"} className="bg-white text-black" >Surface water e.g rivers</option>
        <option value={"ground water"} className="bg-white text-black" >Ground water e.g wells, boreholes, etc</option>
        <option value={"rain water"} className="bg-white text-black" >Rain water</option>
        <option value={"irrigation"} className="bg-white text-black" >Irrigation</option>
    </select>
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

export default EditOverview;