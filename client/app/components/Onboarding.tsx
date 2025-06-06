'use client';
import { useEffect, useState } from 'react';
import Switch from './switch';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';
import { useRouter } from 'next/navigation';
import Alert from './alert';
import Confirm from './confirm';
import ImageUploader from './imageUploader';
import Image from 'next/image';

interface FarmFormData {
    farmName: string,
    location: string,
    size: string,
    farmType: string,
    waterSource: string,
    soilType: string,
    irrigationType: string,
    fertilizerType: string,
    pesticideUsage: boolean,
    coverCrops:boolean,
    companionPlanting:boolean,
    images: File[];
}
const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe",
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara",
  "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau",
  "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];
const steps = ['Basic Information', 'More information', 'Farming style','Farm Practices','Upload Images'];

export default function FarmOnboardingForm() {
  const {farmerId,user,email,setNewUser} = useAuth();
  const [formData, setFormData] = useState<FarmFormData>({
    farmName: "",
    location: "",
    size: "",
    farmType: "",
    waterSource: "",
    soilType: "",
    irrigationType: "",
    fertilizerType: "",
    pesticideUsage: false,
    coverCrops:false,
    companionPlanting:false,
    images: []
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [successSub, setSuccessSub] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("");
  const [errorSub, setErrorSub] = useState<boolean>(false);
  const [showConfirm,setShowConfirm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();


  useEffect(
    ()=>{
      if(!farmerId || !email || !user)router.replace("/auth");

    },[farmerId,email,user,router]
  )
  function boolToStr (arg:boolean){
    return arg === true? "true" : "false";
  }

  const [currentStep, setCurrentStep] = useState(0);

  const totalSteps = steps.length;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

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
   
    if(!boolToStr(formData.companionPlanting)||!boolToStr(formData.coverCrops)||!formData.farmName ||!formData.farmType||!formData.fertilizerType||!selectedFiles||!formData.irrigationType||!formData.location||!boolToStr(formData.pesticideUsage)||!formData.size||!formData.soilType||!formData.waterSource){
      alert("Fill out all fields")
      console.log("Fill out all fields")
      return;
    } if (selectedFiles.length !=4) {
      alert('You must upload 4 images');
      return;
    }
    try {
      const data = new FormData();
      
      // Append text fields
      if(farmerId) data.append('farmerId',farmerId.toString())
      data.append('farmName', formData.farmName);
      data.append('location', formData.location);
      data.append('size', formData.size);
      data.append('farmType', formData.farmType);
      data.append('waterSource', formData.waterSource);
      data.append('soilType', formData.soilType);
      data.append('irrigationType', formData.irrigationType);
      data.append('fertilizerType', formData.fertilizerType);
      data.append('pesticideUsage',boolToStr(formData.pesticideUsage));
      data.append('coverCrops',boolToStr(formData.coverCrops)); 
      data.append('companionPlanting',boolToStr(formData.companionPlanting));
     
      // Append multiple images correctly
      selectedFiles.forEach((file: File) => {
        data.append('images', file); // 'images' must match backend field
      });
    
      const res = await axios.post('http://localhost:5000/api/farm/farm-properties', data, {headers: {
          'Content-Type': 'multipart/form-data',
        }});
    
     
    
      const result = await res.data;
      console.log('Upload result:', result);
      setSuccessSub(true);
      setNewUser("false")
      setMsg(res.data.message)
      router.replace("/dashboard/farmer");
    
    } catch (err) {
      console.error('Upload failed:', err);
      setCurrentStep(0)
      setMsg("Something just happended, don't fret and try again. ")
      setShowConfirm(false)
    } 

  };

  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="max-w-xl max-h-screen mx-auto mt-36 p-6 w-full md:min-w-[500px] rounded bg-white">
      {showConfirm &&<Confirm loading={loading} onCancel={()=>setShowConfirm(false)} onConfirm={handleSubmit} mainMsg=' Have you confirmed that every details you provided are correct?' subMsg='Submissions are subjected to review'/>} 
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-500 h-2 rounded-full transition-all"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2 text-center">
          Step {currentStep + 1} of {totalSteps} - {steps[currentStep]}
        </p>
      </div>

      {/* Step Content */}
      {currentStep === 0 && (
        <div className="space-y-4 w-full">
            <div className='text-3xl py-12 text-center'>
                What&apos;s the name of your farm?
                </div>
          <input
            type="text"
            name="farmName"
            placeholder="e.g Jameo Farm"
            value={formData.farmName}
            onChange={handleChange}
            className="w-full border p-2 rounded outline-none"
          />
       
          
        </div>
      )}
        {currentStep === 1 && (
        <div className="space-y-4 w-full">
            <div className='text-3xl py-12 text-center'>
                A bit more about your farm...
                </div>
                <div className="flex flex-col gap-1">
    <div className="text-grey-600 text-xs">
        Location:
        </div>
        <div className='border-[0.75px] text-grey-700 border-[#CFCFCF] p-2 rounded  w-full'> <select
        id="location"
        name="location"
        value={formData.location}
        onChange={handleChange}
        className="bg-white rounded  w-full"
      >
        <option value="">Select a Location</option>
        {NIGERIAN_STATES.map((state) => (
          <option key={state} value={`${state}, Nigeria`}>
            {state}, Nigeria
          </option>
        ))}
      </select></div>
       </div>
                    <div className="flex flex-col gap-1">
    <div className="text-grey-600 text-xs">
    Farm size {"(in acres)"}:
        </div>
        <div className='border-[0.75px] text-grey-700 border-[#CFCFCF] p-2 rounded  w-full'>    <select
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
</select></div>
      
          </div>
                    <div className="">
    <span className="text-grey-600 text-xs">
        Farm type:
        </span>
     
<div className="border-[0.75px] border-[#CFCFCF] p-2 rounded  w-full">
    <select id="farmType" value={formData.farmType} name="farmType" defaultValue={""} onChange={handleChange} className="bg-white outline-none border-none w-full text-gray-600" >
        <option className='bg-white text-black' value={""} disabled   >Select one</option>
        <option className='bg-white text-black' value={"organic"} >Organic farming</option>
        <option className='bg-white text-black' value={"conventional"} >Conventional farming</option>
        <option className='bg-white text-black' value={"hydroponic"} >Hydroponic farming</option>
        <option className='bg-white text-black' value={"vertical"} >Vertical farming</option>
        <option className='bg-white text-black' value={"aquaponic"} >Aquaponic farming</option>
        <option className='bg-white text-black' value={"industrial"} >Industrial farming</option>
    </select>
</div></div>
        </div>
      )}


      {currentStep === 2 && (
        <div className="space-y-4 w-full">
        {/* Soil Type */}
            <div className="">
<span className="text-grey-600 text-xs">
Soil type:
    </span>
 
    <div className="border-[0.75px] border-[#CFCFCF] p-3 rounded-lg w-full">
    <select id="location" value={formData.soilType} name="soilType" defaultValue={""}   onChange={handleChange} className="bg-white outline-none border-none text-gray-600 w-full">
        <option className='bg-white text-black' value={""} disabled   >Select one</option>
        <option className='bg-white text-black' value={"sandy"} >Sandy soil</option>
        <option className='bg-white text-black' value={"clay"} >Clay soil</option>
        <option className='bg-white text-black' value={"loamy"} >Loamy soil</option>
        <option className='bg-white text-black' value={"peaty"} >peaty soil</option>
        <option className='bg-white text-black' value={"chalk"} >Chalk soil</option>
        <option className='bg-white text-black' value={"silt"} >Silt soil</option>
    </select>
</div></div>       
        {/* Fertilizer Type */}
        <div className="">
<span className="text-grey-600 text-xs">
Fertilizer type:
    </span>
 
    <div className="border-[0.75px] border-[#CFCFCF] p-3 rounded-lg w-full">
    <select id="location" name="fertilizerType" value={formData.fertilizerType} defaultValue={""}   onChange={handleChange} className="bg-white outline-none border-none text-gray-600 w-full">
    <option value={""} disabled  className="bg-white text-black" >Select one</option>
        <option value={"organic"} className="bg-white text-black" >Organic</option>
        <option value={"synthetic"} className="bg-white text-black" >synthetic</option>
        <option value={"none"} className="bg-white text-black" >None</option>
    </select>
</div></div>      
{/* Water Source */}
<div className="">
<span className="text-grey-600 text-xs">
Water source:
    </span>
 
    <div className="border-[0.75px] border-[#CFCFCF] p-3 rounded-lg w-full">
    <select id="location" name="waterSource" defaultValue={""} value={formData.waterSource}  onChange={handleChange} className="bg-white outline-none border-none text-gray-600 w-full">
        <option  value={""} disabled  className="bg-white text-black" >Select one</option>
        <option  value={"surface water"} className="bg-white text-black" >Surface water e.g rivers</option>
        <option  value={"ground water"} className="bg-white text-black" >Ground water e.g wells, boreholes, etc</option>
        <option  value={"rain water"} className="bg-white text-black" >Rain water</option>
        <option  value={"irrigation"} className="bg-white text-black" >Irrigation</option>
    </select>
</div></div>
{/* Fertilizer type  */}

                <div className="">
<span className="text-grey-600 text-xs">
Irrigation method:
    </span>
 
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
    </div>
      )}

{/* Pesticide Usage */}
{currentStep === 3 && (
        <div className="space-y-4">
        {/* item 3*/}
<div className=" p-3 rounded-lg w-full flex justify-between items-center text-gray-600">
    {/* label */}
   <div>
   Pesticide usage
   </div>
   {/* switch */}
   <div>
<Switch isOn={formData.pesticideUsage} handleToggle={()=>{setFormData(prev =>({...prev,pesticideUsage:!prev.pesticideUsage}))}} />
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
   <Switch isOn={formData.coverCrops} handleToggle={()=>{setFormData(prev =>({...prev,coverCrops:!prev.coverCrops}))}} />
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
   <Switch isOn={formData.companionPlanting} handleToggle={()=>{setFormData(prev =>({...prev,companionPlanting:!prev.companionPlanting}))}} />
   </div>
</div>
        </div>
      )}

{currentStep === 4 && (
        <div className="space-y-4">

          <div className="h-full w-full flex flex-col items-center justify-center gap-2 p-5">
          
      <div className='text-3xl py-12 text-center '>
   Share 4  Images of Farm
                </div>
         {/* Upload area */}
<div className="h-full w-full flex flex-col items-center justify-center gap-2 p-5">
<ImageUploader setImages={setSelectedFiles} />


<div className="text-xs text-grey-500">
Note: You are required to upload 4 images of your farm
</div>
</div>
          </div>
         
          {formData.images.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.images.map((file, index) => (
                <Image
                  key={index}
                  src={URL.createObjectURL(file)}
                  alt={`Farm Image ${index + 1}`}
                  className="w-24 h-24 object-cover rounded"
                 height={96} width={96}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-6 flex justify-between">
        {currentStep > 0 && (
          <button
            onClick={handleBack}
            className="border  mr-5   text-black px-4 py-2 rounded hover:bg-primary-400"
          >
            Back
          </button>
        )}
        {currentStep < totalSteps - 1 ? (
          <button
            onClick={handleNext}
            className="bg-primary-500 text-black w-full px-4 py-2 rounded  ml-auto"
          >
            Continue
          </button>
        ) : (
          <button
            onClick={()=>setShowConfirm(true)}
            className="bg-primary-500 text-black w-full px-4 py-2 rounded  ml-auto cursor-pointer"
          >
            Submit
          </button>
        )}
      </div>
      {successSub && <Alert message={msg} onClose={()=> setSuccessSub(false)} color='text-green-800'  background='bg-green-100' />}
      {errorSub && <Alert message={msg}onClose={()=> setErrorSub(false)} color='text-red-800'  background='bg-red-100' />}
    </div>
  );
}
