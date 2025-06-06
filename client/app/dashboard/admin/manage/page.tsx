// Admins dashboard

"use client"

import { useEffect, useState } from "react";
import { useNavContext } from "../NavContext";
import Image from "next/image";
import AddAdminModal from "../components/addAdminModal";
import Alert from "@/app/components/alert";
import { useAdminAuth } from "@/app/Context/AdminAuthContext";
import AddAgentModal from "../components/addAgentModal";
import { BsPerson } from "react-icons/bs";
import Loader from "@/app/components/loader";
import { useRouter } from "next/navigation";


interface admin{
  name : string;
  [key:string]:string
}
interface agent{
  name : string;
  [key:string]:string
}



export default function Home() {

  const [agents,setAgents] = useState<agent[]>([]);
  const [admins,setAdmins] = useState<admin[]>([]);
  const [displayLogout,setDisplayLogout] = useState<boolean>(false);
  const [ displayAddAdminModal,setDisplayAddAdminModal] = useState<boolean>();
  const [ displayAddAgentModal,setDisplayAddAgentModal] = useState<boolean>();
  const [ alertCreate,setAlertCreate] = useState<boolean>();
  const [ alertErrorCreate,setAlertErrorCreate] = useState<boolean>();
  const {setCurrentPage,setMobileDisplay} = useNavContext();
  const {user,address, logout, isLoginStatusLoading} = useAdminAuth();
  const [ loadingAgents,setLoadingAgents] = useState<boolean>(true);
  const [ loadingAdmins,setLoadingAdmins] = useState<boolean>(true);

    const router = useRouter();
    // Route protection
    useEffect(
      ()=> {
        if(!isLoginStatusLoading && (!user  || !address|| user && user.role !== "admin")){
          router.replace("/auth/admin")
        }
      },[user,address,isLoginStatusLoading,router]
    )
   useEffect(()=>{
          setCurrentPage("manage");
          setMobileDisplay(false);
        },[setCurrentPage,setMobileDisplay])
  
        // to fetch admins properties and set it to state
        useEffect(
          ()=>{
            const fetchAdmins = async()=>{
                try{
                  if(user){
                     const result = await fetch("http://localhost:5000/api/admin/admins/"+user._id);
                     const {data} = await result.json();
                     setAdmins(data);
                     if(data){
                      setLoadingAdmins(false);
                     }
                  }
                 
                }
                catch(err){
                  console.log(err);
                }
            };
            fetchAdmins();
          },[user]
        )
 // to fetch agents properties and set it to state
 useEffect(
  ()=>{
    const fetchAgents = async()=>{
        try{
          if(user){
             const result = await fetch("http://localhost:5000/api/admin/agents/"+user._id);
             const {data} = await result.json();
             setAgents(data);
            if(data) setLoadingAgents(false);
          } 
        }
        catch(err){
          console.log(err);
        }
    };
    fetchAgents();
  },[user]);
  

    return (
      <div>
      {displayAddAdminModal &&  <AddAdminModal setAdmins={setAdmins} setAlertCreate={setAlertCreate} setAlertErrorCreate={setAlertErrorCreate} setDisplayAddAdminModal={setDisplayAddAdminModal}/>}
      {displayAddAgentModal &&  <AddAgentModal setAgents={setAgents} setAlertCreate={setAlertCreate} setAlertErrorCreate={setAlertErrorCreate} setDisplayAddAgentModal={setDisplayAddAgentModal}/>}
      
 <div className="text-sm md:text-md min-h-screen px-[32px] py-5 lg:p-[80px] bg-white text-black  ">
  <div className="flex w-full justify-end my-1">
 <Image src={"/icons/burger.svg"} alt="menu" width={40} height={40} className="cursor-pointer lg:hidden"  onClick={()=>setMobileDisplay(true)}/>
  </div>

        {/* Header and Descriptive Text */}
        <div className='flex items-start justify-between'>
     <div className='flex flex-col gap-2'>
        <div className='text-xl font-semibold lg:font-normal lg:text-2xl'>
          Manage users
        </div>
      
   </div>
       <div className='flex gap-2 items-center'>
       <div className='px-2 py-1 border  border-gray-500 text-gray-600 rounded-full cursor-pointer' onClick={()=> window.location.reload()}>
        Reload
       </div>
                    <button className='px-2 py-1 border-2 w-full border-[#a5eb4c] rounded-2xl  lg:block text-grey-800'>
                      
              <div className='flex items-center justify-center gap-2 relative' onClick={()=> setDisplayLogout(!displayLogout)}>  <div className='text-grey-800 text-lg'><BsPerson /></div> <div>{address && address.slice(0,6)}...{address&&address.slice(-4)}</div>
                                                       <div className='absolute bottom-[-150%] w-full flex flex-col bg-grey-100'>
                                                          { displayLogout && address && <div className='text-black bg-primary-500 py-1 px-2' onClick={()=> logout()}>
                                                             Disconnect
                                                           </div>}
                                                       </div>
                                                       </div> 
                       
                       </button>
        
                   </div>
        </div>
       {/* Section One */}
       {/* Overview Stats */}
{/* ########################################################################################################### */}
     <section>
        {/* Header */}
        <div className="flex items-center justify-between">
<div className="mt-12 text-xl px-2 py-1">
            Agents
        </div>
         <div className='py-1 px-2 rounded-lg border border-grey-200 cursor-pointer text-grey-700 flex items-center gap-2' onClick={()=>setDisplayAddAgentModal(true)}>
              <Image src={"/icons/plus.svg"} alt='edit img' width={24} height={24} /> <span className='hidden lg:block'>Add agents</span> 
             </div>
        </div>
        

        <div className="flex flex-col gap-2">
            {/* Title */}
      <div className='bg-gray-100 gap-24 flex items-center text-center justify-between w-full px-2 py-1 border-b '>
          {/* S/N */}
      <div  className='basis-1/2 hidden lg:flex lg:basis-1/5  items-center justify-center '>
 S/N
      </div>
        {/* Variable Name */}
      <div className='text-grey-900 basis-1/2 lg:basis-1/5 '>
    Address
      </div>
    
      <div className='text-grey-900 basis-1/2 lg:basis-1/5 '>
      Name
      </div>
      <div className='text-grey-900 hidden lg:flex basis-1/2 lg:basis-1/5 '>
      Date Created
      </div>

      </div>
      {/* Body */}
      <div className="max-h-96 min-h-24   overflow-y-scroll w-full">
      {agents && agents[0] && agents.map((ele,ind)=>(
    <div className=' hover:bg-gray-100 gap-24 flex items-center text-center justify-between w-full px-2 py-2 ' key={ind*526+123}>
          {/* S/N */}
      <div  className= 'basis-1/2 lg:basis-1/5 hidden lg:flex items-start justify-center '>
     {ind+1}
      </div>
        {/* Variable Name */}
      <div className='text-grey-900 max-w-24 lg:max-w-full  basis-1/2 lg:basis-1/5 overflow-x-scroll '>
      {ele && ele.walletAddress} 
      </div>
    
      <div className='text-grey-900  basis-1/2 lg:basis-1/5 overflow-x-scroll '>
      {ele && ele.name}
      </div>
      <div className='text-grey-900 hidden lg:flex  basis-1/2 lg:basis-1/5 overflow-x-scroll '>
      {ele && ele.createdAt}
      </div>

      </div>
  ))}

        {!agents && <div className="flex items-center p-12 text-gray-600 justify-center w-full ">
                No Agents added yet
                </div>}
                {loadingAgents && <div className="flex flex-col gap-2 items-center p-12 text-gray-600 justify-center w-full h-full ">
              <Loader />
              <div>
                Loading data...
                </div>
                </div>}
</div>
        </div>
     </section>
{/* ############################################################################################### */}
<section>
        {/* Header */}
        <div className="flex items-center justify-between">
<div className="mt-12 text-xl px-2 py-1">
            Admins
        </div>
         <div className='py-1 px-2 rounded-lg border border-grey-200 cursor-pointer text-grey-700 flex items-center gap-2' onClick={()=>setDisplayAddAdminModal(true)}>
              <Image src={"/icons/plus.svg"} alt='edit img' width={24} height={24} /> <span className='hidden lg:block'>Add Admin</span> 
             </div>
        </div>
        

        <div className="flex flex-col gap-2">
            {/* Title */}
      <div className='bg-gray-100 gap-24 flex items-center text-center justify-between w-full px-2 py-1 border-b '>
          {/* S/N */}
      <div  className='basis-1/2 hidden lg:flex lg:basis-1/5 items-center justify-center '>
 S/N
      </div>
        {/* Variable Name */}
      <div className='text-grey-900  basis-1/2 lg:basis-1/5 '>
    Address
      </div>
    
      <div className='text-grey-900 basis-1/2 lg:basis-1/5 '>
      Name
      </div>
      <div className='text-grey-900 hidden lg:flex basis-1/2 lg:basis-1/5 '>
      Date Created
      </div>

      </div>
      {/* Body */}
      <div className="max-h-96 min-h-24   overflow-y-scroll w-full">

{admins && admins.map((ele,ind)=>(
  <div className=' hover:bg-gray-100 gap-24 flex items-center text-center justify-between w-full px-2 py-2 ' key={ind*526+123}>
        {/* S/N */}
    <div  className= 'hidden lg:flex basis-1/2 lg:basis-1/5  items-start justify-center '>
   {ind+1}
    </div>
      {/* Variable Name */}
    <div className='text-grey-900 max-w-24 lg:max-w-full basis-1/2 lg:basis-1/5 overflow-x-scroll '>
    {ele && ele.walletAddress} 
    </div>
  
    <div className='text-grey-900  basis-1/2 lg:basis-1/5 overflow-x-scroll '>
    {ele && ele.name} {user &&user._id === ele._id && "(You)"}
    </div>
    <div className='text-grey-900 hidden lg:flex  basis-1/2 lg:basis-1/5 overflow-x-scroll '>
    {ele && ele.createdAt}
    </div>

    </div>
))}

       {!admins && <div className="flex items-center p-12 text-gray-600 justify-center w-full ">
              No Admin added yet
              </div>}
              {loadingAdmins && <div className="flex flex-col items-center p-12 text-gray-600 justify-center w-full h-full ">
            <Loader />
            <div>
              Loading data...
              </div>
              </div>}

</div>
        </div>
     </section>

</div>

   {alertCreate && <Alert message='Added successfully' onClose={()=> setAlertCreate(false)} color='text-green-800'  background='bg-green-100' />}
            {alertErrorCreate && <Alert message='Something went wrong, try again...' onClose={()=> setAlertErrorCreate(false)} color='text-red-800'  background='bg-red-100' />}
      </div>
     
    );
  }
  