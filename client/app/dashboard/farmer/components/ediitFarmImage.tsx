"use client"
import Alert from "@/app/components/alert";
import ImageUploader from "@/app/components/imageUploader";
import Loader from "@/app/components/loader";
import Switch from "@/app/components/switch";
import { useFarm } from "@/app/Context/FarmContext";
import axios from "axios";
import Image from "next/image";
import React, {ReactNode, useState} from "react";
import { BiUpload } from "react-icons/bi";
import { MdFileUpload } from "react-icons/md";


interface props {
  setEditImage: (data:boolean) => void }
  
const EditFarmImage:React.FC<props> = ({setEditImage}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const {farm} = useFarm();
  const [msg, setMsg] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [successSub, setSuccessSub] = useState<boolean>(false);
  const [warning , setWarning]= useState<boolean>(false);

  const handleUpload = async () => {
    if (!selectedFiles) return;
    if(selectedFiles.length !== 4){
      alert("Exactly, 4 Images of your farm is required")
      return;
    }
    const formData = new FormData();
    Array.from(selectedFiles).forEach(file => {
      formData.append('images', file);
    });

    try {
      setLoading(true);
      const res = await axios.put(
        `http://localhost:5000/api/farm/images/${farm&&farm._id}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
        
      );
      const result = await res.data;
    setMsg(res.data.message)
    setSuccess(res.data.message)
      console.log('Upload success:', res.data);
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setLoading(false);
      window.location.reload()
    }
  };
    return (
        <div className="z-50 h-screen fixed flex items-center justify-center w-full bg-black bg-opacity-10 backdrop-blur-lg text-black p-8">

            {/* edit overview form */}
   <div className="p-6 bg-white w-full lg:max-w-[511px] flex flex-col items-center justify-center gap-8 lg:mr-80 ">
    {/* Title */}
    <div className="flex w-full h-full justify-between items-center">
     <div className="text-lg">
      Edit Farm Images 
     </div>
    <div className="cursor-pointer" onClick={()=>setEditImage(false)}>
      <Image src="/icons/cancel.svg" alt="cancel" width={24} height={24} />
    </div>
    </div>    
{/* Form  */}
<div className="w-full flex flex-col gap-6">

{/* Upload area */}
<div className="h-full w-full flex flex-col items-center justify-center gap-2 p-5">
<ImageUploader setImages={setSelectedFiles} />


<div className="text-xs text-grey-500">
Note: You are required to upload 4 images of your farm
</div>
</div>



{/* item 6 submit*/}
<button className="bg-primary-500 text-center p-3 rounded-lg w-full" onClick={()=>handleUpload()}>
 {loading?<Loader/> :" Save"}
</button>
</div>
   </div>
   {successSub && <Alert message={success} color='text-green-800' background='bg-green-100' onClose={()=> setSuccessSub(false)}/>}
   {warning&& <Alert message='' color='text-yellow-800' background='bg-yellow-100' onClose={()=> setWarning(false)}/>}
        </div>
    )
}

export default EditFarmImage;