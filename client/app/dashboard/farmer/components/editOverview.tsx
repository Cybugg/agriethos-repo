"use client"
import { useAuth } from "@/app/Context/AuthContext";
import { useFarm } from "@/app/Context/FarmContext";
import axios from "axios";
import Image from "next/image";
import React, {ReactNode, useEffect, useState} from "react";


    interface props {
    setEditOverview: (data:boolean) => void 
    setEditMethod: (data:boolean) => void 
}
    interface FarmFormData {
    farmName:string
    location: string,
    size: string,
    farmType: string,
    waterSource: string,
    soilType: string,
    [key:string]:any
}
const EditOverview:React.FC<props> = ({setEditOverview}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FarmFormData>({
    farmName:"",
    location: "",
    size: "",
    farmType: "",
    waterSource: "",
    soilType:""
  });



  const {isLoginStatusLoading} = useAuth();
  const {farm} = useFarm();

  useEffect(()=>{
 !isLoginStatusLoading &&farm && setFormData({
    farmName:farm.farmName,
    location: farm.location,
    size: farm.size,
    farmType: farm.farmType,
    waterSource: farm.waterSource,
    soilType:farm.soilType
  })
  },[isLoginStatusLoading,farm]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
      ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      };



      const handleSubmit = async () => {
        setLoading(true);
        console.log('Submitting farm data:', formData);
       
        if(!formData.farmType||!formData.location||!formData.size||!formData.soilType||!formData.waterSource||!formData.farmName){
          alert("Fill out all fields")
          console.log("Fill out all fields")
          return;
        } 
        try {
          const data = new FormData();
          
          // Append text fields
          data.append("farmName",formData.farmName)
          data.append('location', formData.location);
          data.append('size', formData.size);
          data.append('farmType', formData.farmType);
          data.append('waterSource', formData.waterSource);
          data.append('soilType', formData.soilType);
         
         
          // Append multiple images correctly
       
        
        //   const res = await axios.post('http://localhost:5000/api/farm/farm-properties', data, {headers: {
        //       'Content-Type': 'multipart/form-data',
        //     }});
        
         
        
        //   const result = await res.data;
        //   console.log('Upload result:', result);
         
         setEditOverview(false);
        
        } catch (err) {
          console.error('Upload failed:', err);
        } 
    
      };

    return (
        <div className="z-50 h-screen fixed flex items-center justify-center w-full bg-black bg-opacity-10 backdrop-blur-lg text-black p-8">

            {/* edit overview form */}
   <div className="p-6 bg-white w-full lg:max-w-[511px] flex flex-col items-center justify-center gap-8 lg:mr-80 ">
    {/* Title */}
    <div className="flex w-full h-full justify-between items-center">
     <div className="text-lg">
      Edit Farm Overview
     </div>
    <div className="cursor-pointer" onClick={()=>setEditOverview(false)}>
      <Image src="/icons/cancel.svg" alt="cancel" width={24} height={24} />
    </div>
    </div>    
{/* Form  */}
<div className="w-full flex flex-col gap-6">
{/* item 1*/}
{/* <div className="flex flex-col gap-1">
    <div className="text-grey-600 text-xs">
        Country:
        </div>
<div className="border-[0.75px] border-[#CFCFCF] p-3 rounded-lg w-full">
    <select id="country" name="country" defaultValue={""}  className="bg-white outline-none border-none text-black w-full">
        <option value={""} disabled  className="bg-white text-black" >Country</option>
        <option value={"NG"} className="bg-white text-black" >Nigeria</option>
    </select>
</div>
</div> */}
{/* item 2*/}
{/* <div className="flex flex-col gap-1">
    <div className="text-grey-600 text-xs">
        State:
        </div>
<div className="border-[0.75px] border-[#CFCFCF] p-3 rounded-lg w-full">
    <select id="state" name="state" defaultValue={""} className="bg-white outline-none border-none text-black w-full">
        <option value={""} disabled  className="bg-white text-black" >State</option>
        <option value={"OS"} className="bg-white text-black" >Osun</option>
    </select>
</div></div> */}
{/* item 2.5*/}
<div className="flex flex-col gap-1">
    <div className="text-grey-600 text-xs">
        Farm size {"(in acres)"}:
        </div>
<div className="border-[0.75px] border-[#CFCFCF] p-3 rounded-lg w-full">
<input type="text" placeholder="Farm size in acres" defaultValue={farm?farm.size:""} className="w-full outline-none" name="size" onChange={handleChange}/>
</div></div>
{/* item 3*/}
<div className="flex flex-col gap-1">
    <div className="text-grey-600 text-xs">
        Farm type:
        </div>
<div className="border-[0.75px] border-[#CFCFCF] p-3 rounded-lg w-full">
    <select id="location" name="farmType" defaultValue={farm&&farm.farmType}  className="bg-white outline-none border-none text-black w-full" onChange={handleChange}>
        <option value={""} disabled  className="bg-white text-black" >Farm type</option>
        <option value={"organic"} >Organic farming</option>
        <option value={"conventional"} >Conventional farming</option>
        <option value={"hydroponic"} >Hydroponic farming</option>
        <option value={"vertical"} >Vertical farming</option>
        <option value={"aquaponic"} >Aquaponic farming</option>
        <option value={"industrial"} >Industrial farming</option>
    </select>
</div></div>
{/* item 4*/}
<div className="flex flex-col gap-1">
    <div className="text-grey-600 text-xs">
        Soil type:
        </div>
<div className="border-[0.75px] border-[#CFCFCF] p-3 rounded-lg w-full">
    <select id="location" name="soilType" defaultValue={farm&&farm.soilType} onChange={handleChange}className="bg-white outline-none border-none text-black w-full">
        <option value={""} disabled  className="bg-white text-black" >Soil type</option>
        <option value={"sandy"} >Sandy soil</option>
        <option value={"clay"} >Clay soil</option>
        <option value={"loamy"} >Loamy soil</option>
        <option value={"peaty"} >peaty soil</option>
        <option value={"chalk"} >Chalk soil</option>
        <option value={"silt"} >Silt soil</option>
    </select>
</div></div>
{/* item 5*/}
<div className="flex flex-col gap-1">
    <div className="text-grey-600 text-xs">
        Water source:
        </div>
<div className="border-[0.75px] border-[#CFCFCF] p-3 rounded-lg w-full">
    <select id="location" name="waterSource" defaultValue={farm&&farm.waterSource}  className="bg-white outline-none border-none text-black w-full" onChange={handleChange}>
        <option value={""} disabled  className="bg-white text-black" >Water source</option>
        <option value={"surface water"} className="bg-white text-black" >Surface water e.g rivers</option>
        <option value={"ground water"} className="bg-white text-black" >Ground water e.g wells, boreholes, etc</option>
        <option value={"rain water"} className="bg-white text-black" >Rain water</option>
        <option value={"irrigation"} className="bg-white text-black" >Irrigation</option>
    </select>
</div></div>
{/* item 6 submit*/}
<button className="bg-primary-500 text-center p-3 rounded-lg w-full" onClick={handleSubmit}>
  Save
</button>
</div>
   </div>
        </div>
    )
}

export default EditOverview;