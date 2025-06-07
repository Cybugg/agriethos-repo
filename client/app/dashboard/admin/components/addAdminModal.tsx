"use client"
import { useAdminAuth } from '@/app/Context/AdminAuthContext'
import Image from 'next/image'
import React, { useState } from 'react'

interface admin{
  name : string;
  [key:string]:string
}

interface props {
    setAdmins:React.Dispatch<React.SetStateAction<admin[]>>
    setDisplayAddAdminModal:(bool:boolean)=>void
    setAlertCreate:(boolVal:boolean)=>void
    setAlertErrorCreate:(boolVal:boolean)=>void
}

interface FarmFormData {
    name:string
    walletAddress:string
}

const AddAdminModal:React.FC<props> = ({setDisplayAddAdminModal, setAlertCreate, setAlertErrorCreate,setAdmins}) => {
     const [formData, setFormData] = useState<FarmFormData>({
        name:"",
        walletAddress:"" })
    const {user}  = useAdminAuth();

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(
            prev => ({...prev, [name]:value})
        )
    }

    const handleSubmit = async () => {
   
        // 
        if(!formData.name||!formData.walletAddress){
            alert("Fill out all fields")
           console.log("Fill out all fields")
          return
        } 

        try {
          const data = new FormData();
          
          // Append text fields
          if(user)data.append('adminId',user._id.toString());
          data.append('name', formData.name);
          data.append('walletAddress', formData.walletAddress);
        
          console.log('Submitting farm data*****:', data);
    
          const res = await fetch('https://api.agriethos.com/api/admin/create/admin', {
            method: "POST",
            body: data, 
          });
     
          const result = await res.json();
          console.log(result.data)
          if (!res.ok || result.error) {
            setAlertErrorCreate(true);
            console.error('Backend error:', result.error || result.message);
            return;
          }
           
          setAlertCreate(true);
          setAdmins((pre) => [result.data, ...pre]);
         console.log('Upload result:', result);
        setDisplayAddAdminModal(false);
        
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
         Add Admin
        </div>
       <div className="cursor-pointer" onClick={()=>setDisplayAddAdminModal(false)}>
         <Image src="/icons/cancel.svg" alt="cancel" width={24} height={24} />
       </div>
       </div>    
   {/* Form  */}
   <div className="w-full flex flex-col gap-6">
   {/* item 1*/}
   {/* Crop name */}
   <div className="flex flex-col gap-1">
       <div className="text-grey-600 text-xs">
            Name:
           </div>
   <div className="border-[0.75px] border-[#CFCFCF] p-3 rounded-lg w-full">
      <input type="text" placeholder="input name" name="name" className="w-full outline-none"  onChange={handleChange}  />
   </div></div>
   
   {/* item 2*/}
   {/* Planting date */}
   <div className="flex flex-col gap-1">
       <div className="text-grey-600 text-xs">
           Wallet Address {"(EVM)"}:
           </div>
      <div className="border-[0.75px] border-[#CFCFCF] p-3 rounded-lg w-full">
   <input type="input" placeholder="input address"name="walletAddress" className="w-full outline-none"  onChange={handleChange}   />
   </div> 
   </div>

   



   
   {/* item 6 submit*/}
   <button className="bg-primary-500 text-center p-3 rounded-lg w-full" onClick={()=> handleSubmit()}>
     Add 
   </button>
   
   </div>
      </div>
           </div>
  )
}

export default AddAdminModal