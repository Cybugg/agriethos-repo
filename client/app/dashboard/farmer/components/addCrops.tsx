"use client"
import { useAuth } from "@/app/Context/AuthContext";
import axios from "axios";
import Image from "next/image";
import React, {useState} from "react";


interface crop {
  cropName:string;
  images:string[]
  [key: string]: string | string[];
}
interface props {
    setDisplayAddCrop:(boolVal:boolean)=>void
    setAlertCreate:(boolVal:boolean)=>void
    setAlertErrorCreate:(boolVal:boolean)=>void
    setCrops:React.Dispatch<React.SetStateAction<crop[]>>}


interface FarmFormData {
    cropName:string
    plantingDate:string
    expectedHarvestingDate:string
    growthStage:string
    preNotes:string
    [key:string]:string
}

const AddCrop:React.FC<props> = ({setDisplayAddCrop, setAlertCreate,setCrops,setAlertErrorCreate}) => {
      const [formData, setFormData] = useState<FarmFormData>({
        cropName:"",
        plantingDate:"",
        expectedHarvestingDate:"",
        growthStage:"",
        preNotes:""
      })
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
   
   
    if(!formData.cropName||!formData.expectedHarvestingDate ||!formData.growthStage ||!formData.plantingDate||!formData.preNotes){
        alert("Fill out all fields")
       console.log("Fill out all fields")
      return
    } 
    try {
      const data = new FormData();
      
      // Append text fields
      if(farmerId) data.append('farmerId',farmerId.toString());
      data.append('cropName', formData.cropName);
      data.append('expectedHarvestingDate', formData.expectedHarvestingDate);
      data.append('growthStage', formData.growthStage);
      data.append('plantingDate', formData.plantingDate);
      data.append('preNotes', formData.preNotes);
    
      console.log('Submitting farm data*****:', data);

      const res = await axios.post('https://api.agriethos.com/api/crops/', data, {headers: {
          'Content-Type': 'multipart/form-data',
        }});
 
     
    
      const result = await res.data;
      setCrops(pre => [result.data,...pre]);
      setDisplayAddCrop(false);
      setAlertCreate(true)
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
      Add Crop
     </div>
    <div className="cursor-pointer" onClick={()=>setDisplayAddCrop(false)}>
      <Image src="/icons/cancel.svg" alt="cancel" width={24} height={24} />
    </div>
    </div>    
{/* Form  */}
<div className="w-full flex flex-col gap-6">
{/* item 1*/}
{/* Crop name */}
<div className="flex flex-col gap-1">
    <div className="text-grey-600 text-xs">
        Crop name <span className="text-error-500">*</span> :
        </div>
<div className="border-[0.75px] border-[#CFCFCF] p-3 rounded-lg w-full">
   <input type="text" placeholder="Crop name" name="cropName" className="w-full outline-none"   onChange={handleChange}  />
</div></div>

{/* item 2*/}
{/* Planting date */}
<div className="flex flex-col gap-1">
    <div className="text-grey-600 text-xs">
        Planting date:
        </div>
   <div className="border-[0.75px] border-[#CFCFCF] p-3 rounded-lg w-full">
<input type="date" placeholder="Planting date"name="plantingDate" className="w-full outline-none"  onChange={handleChange}   />
</div> 
</div>
{/* item 2.5*/}
{/* Harvesting date */}
<div className="flex flex-col gap-1">
    <div className="text-grey-600 text-xs">
       Expected Harvesting date <span className="text-error-500">*</span> :
        </div>
   <div className="border-[0.75px] border-[#CFCFCF] p-3 rounded-lg w-full">
<input type="date" placeholder="Expected harvesting date" name="expectedHarvestingDate" className="w-full outline-none"  onChange={handleChange}   />
</div> 
</div>


{/* item 3*/}
{/* Growth Stage */}
<div className="flex flex-col gap-1">
    <div className="text-grey-600 text-xs">
        Crop growth stage <span className="text-error-500">*</span> :
        </div>
<div className="p-3 rounded-lg w-full flex justify-between items-center border-[0.75px] border-[#CFCFCF]">
  <select id={"growthStage"} name="growthStage" onChange={handleChange} className="bg-white outline-none border-none text-black w-full "  defaultValue={""} >
    <option disabled  value={""}>Select</option>
    <option   value={"pre-harvest"}>Pre-harvest</option>
    {/* <option   value={"post-harvest"}>Post-harvest</option> */}
  </select>
</div></div>
{/* item 3*/}
{/* Growth Stage */}
<div className="flex flex-col gap-1">
    <div className="text-grey-600 text-xs">
        Notes {"(Brief description)"} <span className="text-error-500">*</span> :
        </div>
<div className="p-3 rounded-lg w-full flex justify-between items-center border-[0.75px] border-[#CFCFCF]">
  <textarea id={"preNotes"} name="preNotes" onChange={handleChange} className="bg-white outline-none border-none text-black w-full border"   defaultValue={""} >
  </textarea>
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
<button className="bg-primary-500 text-center p-3 rounded-lg w-full" onClick={()=> handleSubmit()}>
  Submit
</button>

</div>
   </div>
        </div>
    )
}

export default AddCrop;