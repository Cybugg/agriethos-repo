"use client"
import ImageUploader from "@/app/components/imageUploader";
import { useAuth } from "@/app/Context/AuthContext";
import axios from "axios";
import Image from "next/image";
import React, { useState} from "react";


interface props {
    setDisplayUpgradeCrop:(boolVal:boolean)=>void
    setAlertCreate:(boolVal:boolean)=>void
    setAlertErrorCreate:(boolVal:boolean)=>void
    setCrops:React.Dispatch<React.SetStateAction<crop[]>>
    setSelectedCrop:React.Dispatch<React.SetStateAction<crop|undefined>>
    selectedCrop:crop | undefined
}


interface FarmFormData {
    harvestingDate:string
    storageMethod:string
    postNotes:string
    growthStage:string
    quantityHarvested:string
    unit:string
    [key:string]:string
}
interface crop {
    cropName:string;
    images:string[]
    [key:string]:string | string[];
}
const UpgradeCrop:React.FC<props> = ({setDisplayUpgradeCrop, setAlertCreate,setCrops,setAlertErrorCreate, selectedCrop, setSelectedCrop}) => {
      const [formData, setFormData] = useState<FarmFormData>({
        harvestingDate:"",
        storageMethod:"",
        postNotes:"",
        growthStage:"",
        quantityHarvested:"",
        unit:""
      })
      const [images, setImages] = useState<File[]>([]);
      const {farmerId} = useAuth();
      
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
   
   
    if(!formData.harvestingDate||!formData.postNotes ||!formData.growthStage ||!formData.storageMethod||!formData.quantityHarvested||!formData.unit){
        alert("Fill out all fields")
       console.log("Fill out all fields")
      return
    } 
    try {
      const data = new FormData();
      
      // Append text fields
      if(farmerId){data.append('farmerId',farmerId?.toString());}
      data.append('harvestingDate', formData.harvestingDate);
      data.append('postNotes', formData.postNotes);
      data.append('growthStage', formData.growthStage);
      data.append('storageMethod', formData.storageMethod);
      data.append('quantityHarvested', formData.quantityHarvested);
      data.append('unit', formData.unit);
      images.forEach((img) => data.append('images', img));
    
      console.log('Submitting farm data*****:', data);

      const res = await axios.put('http://localhost:5000/api/crops/upgrade/'+selectedCrop?._id, data, {headers: {
          'Content-Type': 'multipart/form-data',
        }});
 
     
    
      const result = await res.data;
      setCrops(pre => [result.data,...pre]);
      setDisplayUpgradeCrop(false);
      setAlertCreate(true)
      setSelectedCrop(undefined)
      window.location.reload()
      console.log('Upload result:', result);
    
    
    } catch (err) {
      setAlertErrorCreate(true)
      console.error('Upload failed:', err);
    }

  };
    return (
        <div className="z-50 h-screen fixed flex items-center justify-center w-full bg-black bg-opacity-10 backdrop-blur-lg text-black p-8">

            {/* Add overview form */}
   <div className="p-6 bg-white w-full lg:max-w-[511px] flex flex-col items-center justify-center gap-8 lg:mr-80 ">
    {/* Title */}
    <div className="flex w-full h-full justify-between items-center">
     <div className="text-lg">
      Upgrade Crop <span className="font-bold">{`: ${selectedCrop?.cropName}`}</span>
     </div>
    <div className="cursor-pointer" onClick={()=>setDisplayUpgradeCrop(false)}>
      <Image src="/icons/cancel.svg" alt="cancel" width={24} height={24} />
    </div>
    </div>    
{/* Form  */}
<div className="w-full flex flex-col gap-6">
{/* item 1*/}

<div className="flex flex-col gap-1">
    <div className="text-grey-600 text-xs">
        Harvesting Date<span className="text-error-500">*</span> :
        </div>
<div className="border-[0.75px] border-[#CFCFCF] p-3 rounded-lg w-full">
   <input type="date" placeholder="" name="harvestingDate" className="w-full outline-none"   onChange={handleChange}  />
</div></div>

{/* item 2*/}

<div className="flex flex-col gap-1">
    <div className="text-grey-600 text-xs">
        Storage Method<span className="text-error-500">*</span> :
        </div>
   <div className="border-[0.75px] border-[#CFCFCF] p-3 rounded-lg w-full">
   <select
  id="storageMethod"
  name="storageMethod"
  value={formData.storageMethod}
  onChange={handleChange}
  className="w-full bg-white "
>
  <option value="">Select storage method</option>
  <option value="cold storage">Cold Storage</option>
  <option value="dry storage">Dry Storage</option>
  <option value="silo">Silo</option>
  <option value="warehouse">Warehouse</option>
  <option value="refrigeration">Refrigeration</option>
  <option value="airtight containers">Airtight Containers</option>
  <option value="traditional granary">Traditional Granary</option>
</select>
</div> 
</div>



{/* item 3*/}

<div className="flex flex-col gap-1">
    <div className="text-grey-600 text-xs">
        Crop growth stage<span className="text-error-500">*</span> :
        </div>
<div className="p-3 rounded-lg w-full flex justify-between items-center border-[0.75px] border-[#CFCFCF]">
  <select id={"growthStage"} name="growthStage" onChange={handleChange} className="bg-white outline-none border-none text-black w-full "  defaultValue={""} >
    <option disabled  value={""}>Select stage</option>
    <option   value={"post-harvest"}>Post-harvest</option>
    {/* <option   value={"post-harvest"}>Post-harvest</option> */}
  </select>
</div></div>
{/* item 4*/}
<div className="flex flex-col gap-1">
    <div className="text-grey-600 text-xs">
        Quantity harvested<span className="text-error-500">*</span> :
        </div>
<div className="p-3 rounded-lg w-full flex justify-between items-center border-[0.75px] border-[#CFCFCF]">
<select
  id="quantityHarvested"
  name="quantityHarvested"
  value={formData.quantityHarvested}
  onChange={handleChange}
 className="w-full bg-white "
>
  <option value="">Select quantity</option>
  {[...Array(1000)].map((_, i) => (
    <option key={i + 1} value={i + 1}>
      {i + 1}
    </option>
  ))}
</select>
</div></div>
{/* item 5*/}
<div className="flex flex-col gap-1">
    <div className="text-grey-600 text-xs">
        unit<span className="text-error-500">*</span> :
        </div>
<div className="p-3 rounded-lg w-full flex justify-between items-center border-[0.75px] border-[#CFCFCF]">
<select
  id="unit"
  name="unit"
  value={formData.unit}
  onChange={handleChange}
  className="w-full bg-white "
>
  <option value="">Select unit</option>
  <option value="kg">Kilograms (kg)</option>
  <option value="ton">Tons</option>
  <option value="crates">Crates</option>
  <option value="bags">Bags</option>
  <option value="bunches">Bunches</option>
  <option value="liters">Liters</option>
</select>
</div></div>
{/* item 6*/}

<div className="flex flex-col gap-1">
    <div className="text-grey-600 text-xs">
       Post-Notes<span className="text-error-500">*</span> :
        </div>
   <div className="border-[0.75px] border-[#CFCFCF] p-3 rounded-lg w-full">
   <textarea id={"postNotes"} name="postNotes" onChange={handleChange} className="bg-white outline-none border-none text-black w-full border"   defaultValue={""} >
   </textarea>
</div> 
</div>

{/* item7 */}
<div className="flex flex-col gap-1">
    <div className="text-grey-600 text-xs">
       Image of crop<span className="text-error-500">*</span> :
        </div>
   <div className="w-full">
   <ImageUploader setImages={setImages} />
</div> 
</div>


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
<button className="bg-primary-500 text-center p-3 rounded-lg w-full" onClick={()=> handleSubmit()}>
  Submit
</button>

</div>
   </div>
        </div>
    )
}

export default UpgradeCrop;