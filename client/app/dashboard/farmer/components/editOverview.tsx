"use client"
import { useAuth } from "@/app/Context/AuthContext";
import { useFarm } from "@/app/Context/FarmContext";
import axios from "axios";
import Image from "next/image";
import React, {ReactNode, useEffect, useState} from "react";
import { useRouter } from "next/navigation";

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

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe",
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara",
  "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau",
  "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];
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
  const {farm,setFarm} = useFarm();

  const fullUrl = window.location.href;
  useEffect(()=>{
 !isLoginStatusLoading &&farm && setFormData({
    farmName:farm.farmName,
    location: farm.location,
    size: farm.size,
    farmType: farm.farmType,
    waterSource: farm.waterSource,
    soilType:farm.soilType
  })
  },[]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
      ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      };

      const router = useRouter();


      const handleSubmit = async () => {
        setLoading(true);
        console.log('Submitting farm data:', formData);
       
        // Validate required fields
        if(!formData.farmType || !formData.location || !formData.size || 
           !formData.soilType || !formData.waterSource || !formData.farmName) {
          alert("Fill out all fields");
          setLoading(false);
          return;
        } 
        
        if(formData.size && !Number(formData.size)) {
          alert("Farm size must be a number");
          setLoading(false);
          return;
        }
        
        try {
          console.log('Sending data to server:', JSON.stringify(formData, null, 2));
          
          if(farm) {
            const res = await fetch(`https://agriethos-9wy5.onrender.com/api/farm/farm-properties/${farm._id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(formData),
            });
            
            if (!res.ok) {
              const errorText = await res.text();
              throw new Error(`Server responded with ${res.status}: ${errorText}`);
            }
            
            const result = await res.json();
            console.log('Upload result:', result);
            
            setFarm(result.data || result);
            setEditOverview(false);
            window.location.reload();
          }
        } catch (err) {
          console.error('Upload failed:', err);
          alert(`Failed to update: ${err}`);
        } finally {
          setLoading(false);
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
        Farm Name :
        </div>
<div className="border-[0.75px] border-[#CFCFCF] p-3 rounded-lg w-full">
<input type="text" value={formData.farmName??""} placeholder="Farm size in acres"  className="w-full outline-none" name="farmName" onChange={handleChange}/>
</div></div>
{/* item 2.5*/}
<div className="flex flex-col gap-1">
    <div className="text-grey-600 text-xs">
        Location:
        </div>
<div className="border-[0.75px] border-[#CFCFCF] p-3 rounded-lg w-full">
<select
        id="location"
        name="location"
        value={formData.location}
        onChange={handleChange}
        className="bg-white rounded px-3 py-2 w-full"
      >
        <option value="">Select a Location</option>
        {NIGERIAN_STATES.map((state) => (
          <option key={state} value={`${state}, Nigeria`}>
            {state}, Nigeria
          </option>
        ))}
      </select>
</div></div>
{/* item 2.5*/}
<div className="flex flex-col gap-1">
    <div className="text-grey-600 text-xs">
        Farm size {"(in acres)"}:
        </div>
<div className="border-[0.75px] border-[#CFCFCF] p-3 rounded-lg w-full">
<select
  id="size"
  name="size"
  value={formData.size}
  onChange={handleChange}
 className="w-full bg-white "
>
<option value="">Select size (hectares)</option>
  {Array.from({ length: 200 }, (_, i) => {
    const value = (i + 1) * 0.5;
    return (
      <option key={value} value={value}>
        {value}
      </option>
    );
  })}

</select>
</div></div>
{/* item 3*/}
<div className="flex flex-col gap-1">
    <div className="text-grey-600 text-xs">
        Farm type:
        </div>
<div className="border-[0.75px] border-[#CFCFCF] p-3 rounded-lg w-full">
    <select id="location" name="farmType"   className="bg-white outline-none border-none text-black w-full" value={formData.farmType??""} onChange={handleChange}>
        <option value={""} disabled  className="bg-white text-black" >Select one</option>
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
    <select id="location" name="soilType"  onChange={handleChange} value={formData.soilType??"N/A"} className="bg-white outline-none border-none text-black w-full">
        <option value={""} disabled  className="bg-white text-black" >Select one</option>
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
    <select id="location" name="waterSource" value={formData.waterSource??""}  className="bg-white outline-none border-none text-black w-full" onChange={handleChange}>
        <option value={""} disabled  className="bg-white text-black" >Select one</option>
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