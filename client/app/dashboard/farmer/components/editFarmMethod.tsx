"use client"
import { useAuth } from "@/app/Context/AuthContext";
import { useFarm } from "@/app/Context/FarmContext";
import axios from "axios";
import Image from "next/image";
import React, {ReactNode, useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import Switch from "@/app/components/switch";

    interface props {
    setEditOverview: (data:boolean) => void 
    setEditMethod: (data:boolean) => void 
}
    interface FarmFormData {
        irrigationType: string,
        fertilizerType: string,
        pesticideUsage: string,
        coverCrops:string,
        companionPlanting:string,
    [key:string]:any
}
const EditFarmMethod:React.FC<props> = ({setEditMethod}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FarmFormData>({
    irrigationType: "",
    fertilizerType: "",
    pesticideUsage: "false",
    coverCrops:"false",
    companionPlanting:"false",
  });



  const {isLoginStatusLoading} = useAuth();
  const {farm,setFarm} = useFarm();

  const fullUrl = window.location.href;
  useEffect(()=>{
 !isLoginStatusLoading &&farm && setFormData({
    irrigationType:  farm.irrigationType,
    fertilizerType:  farm.fertilizerType,
    pesticideUsage:   farm.pesticideUsage,
    coverCrops: farm.coverCrops,
    companionPlanting: farm.companionPlanting,
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
       
        if(!(formData.companionPlanting)||!(formData.coverCrops)||!(formData.pesticideUsage)||!formData.fertilizerType||!formData.irrigationType){
          alert("Fill out all fields")
          console.log("Fill out all fields")
          return;
        } 
   
        try {
          const data = new FormData();
          
          // Append text fields
          data.append('irrigationType', formData.irrigationType);
          data.append('fertilizerType', formData.fertilizerType);
          data.append('pesticideUsage',(formData.pesticideUsage));
          data.append('coverCrops',(formData.coverCrops)); 
          data.append('companionPlanting',(formData.companionPlanting));
         
         
         
            console.log(data);
        if(farm){
             const res = await fetch(`http://localhost:5000/api/farm/farm-properties/${farm._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
              });
          const result = await res.json();
          console.log(result)
          console.log(result)
          console.log(result)
           setFarm(result);
          console.log('Upload result:', result);
          result && window.location.reload();
         setEditMethod(false);
        }
         
        
        } catch (err) {
          console.error('Upload failed:', err);
        } 
    
      };


      const str2Bool = (val:string)=>{
            return val==="true"? true: val==="false"?false:undefined
      };

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
       Irrigation method:
        </div>
    <div className="border-[0.75px] border-[#CFCFCF] p-3 rounded-lg w-full">
    <select id="irrigation" name="irrigationType" defaultValue={""} value={formData.irrigationType}   onChange={handleChange} className="bg-white outline-none border-none text-gray-600 w-full">
        <option  value={""} disabled  className="bg-white text-black" >Select one</option>
        <option  value={"sprinkler"} className="bg-white text-black" >Sprinkler</option>
        <option  value={"drip"} className="bg-white text-black" >Drip</option>
        <option  value={"flood"} className="bg-white text-black" >Flood</option>
        <option  value={"rain-fed"} className="bg-white text-black" >Rain-fed</option>
        <option  value={"none"} className="bg-white text-black" >None</option>
    </select>
</div></div>

{/* item 4*/}
<div className="flex flex-col gap-1">
    <div className="text-grey-600 text-xs">
        Fertilizer type:
        </div>
    <div className="border-[0.75px] border-[#CFCFCF] p-3 rounded-lg w-full">
    <select 
  id="location" 
  name="fertilizerType" 
  value={formData.fertilizerType || ""} 
  className="bg-white outline-none border-none text-gray-600 w-full"
  onChange={handleChange}
>
  <option value="" disabled className="bg-white text-black">Select one</option>
  <option value="organic" className="bg-white text-black">Organic</option>
  <option value="synthetic" className="bg-white text-black">synthetic</option>
  <option value="none" className="bg-white text-black">None</option>
</select>
</div></div>

      <div className="space-y-4">
        {/* item 3*/}
<div className=" p-3 rounded-lg w-full flex justify-between items-center text-gray-600">
    {/* label */}
   <div>
   Pesticide usage
   </div>
   {/* switch */}
   <div>
<Switch isOn={str2Bool(formData.pesticideUsage)} handleToggle={()=>{setFormData(prev =>({...prev,pesticideUsage:prev.pesticideUsage==="true"?"false":"true"}))}} />
   </div>
</div>
{/* item 4*/}
<div className=" p-3 rounded-lg w-full flex justify-between items-center text-gray-600">
     {/* label */}
   <div>
   Cover crops used 
   </div>
   {/* switch */}
   <div>
   <Switch isOn={str2Bool(formData.coverCrops)} handleToggle={()=>{setFormData(prev =>({...prev,coverCrops:prev.coverCrops==="true"?"false":"true"}))}} />
   </div>
</div>
{/* item 5*/}
<div className=" p-3 rounded-lg w-full flex justify-between items-center text-gray-600">
   {/* label */}
   <div>
Companion planting
   </div>
   {/* switch */}
   <div>
   <Switch isOn={str2Bool(formData.companionPlanting)} handleToggle={()=>{setFormData(prev =>({...prev,companionPlanting:prev.companionPlanting==="true"?"false":"true"}))}} />
   </div>
</div>
        </div>
{/* item 6 submit*/}
<button className="bg-primary-500 text-center p-3 rounded-lg w-full" onClick={handleSubmit}>
  Save
</button>
</div>
   </div>
        </div>
    )
}

export default EditFarmMethod;