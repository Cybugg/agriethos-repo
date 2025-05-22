// Admins dashboard

"use client"

import { useEffect, useState } from "react";
import { useNavContext } from "./NavContext";
import { useAdminAuth } from "@/app/Context/AdminAuthContext";
import { BsPerson } from "react-icons/bs";
import Loader from "@/app/components/loader";
import { useRouter } from "next/navigation";



interface overview {
  [key:string]:string
}
interface admin{
  name : string;
  [key:string]:string
}


export default function Home() {
  const [admins,setAdmins] = useState<admin[]>([]);
  const [agents,setAgents] = useState<admin[]>([]);
  
  const {setCurrentPage,setMobileDisplay} = useNavContext();
  const {address, logout} = useAdminAuth()
  const [displayLogout,setDisplayLogout] = useState<boolean>(false);
  const [overview, setOverview] = useState<overview|undefined>(undefined);
  const {user,isLoginStatusLoading} = useAdminAuth();
  const [ loadingAgents,setLoadingAgents] = useState<boolean>(true);
  const [ loadingAdmins,setLoadingAdmins] = useState<boolean>(true);

  const router = useRouter();
  // Route protection
  useEffect(
    ()=> {
      if(!isLoginStatusLoading && (!user  || !address|| user && user.role !== "admin")){
        router.replace("/auth/admin")
      }
    },[user,address]
  )

  useEffect(
    ()=>{
   const fetchOverview = async ()=>{
    try{
      const result = await fetch("http://localhost:5000/api/admin/overview"+(user && user._id));
      const {data} = await result.json();
      if(!result.ok){
        console.log("Error:Cannot fetch overview")
      }
      console.log(data)
      setOverview(data);
    }
    catch(err){
      console.log(err)
    }

   }
   fetchOverview();
    },[user]
  )
       // to fetch admins properties and set it to state
          useEffect(
            ()=>{
              const fetchAdmins = async()=>{
                  try{
                    if(user){
                       const result = await fetch("http://localhost:5000/api/admin/admins/"+user._id);
                       const {data} = await result.json();
                       setAdmins(data);
                       data && setLoadingAdmins(false);
                    }
                   
                  }
                  catch(err){
                    console.log(err);
                  }
              };
              fetchAdmins();
            },[user]);
             // to fetch agents properties and set it to state
             useEffect(
              ()=>{
                const fetchAgents = async()=>{
                    try{
                      if(user){
                         const result = await fetch("http://localhost:5000/api/admin/agents/"+user._id);
                         const {data} = await result.json();
                         setAgents(data);
                         data && setLoadingAgents(false);
                      }
                     
                    }
                    catch(err){
                      console.log(err);
                    }
                };
                fetchAgents();
              },[user]);

   useEffect(()=>{
          setCurrentPage("home");
          setMobileDisplay(false);
        },[])
  
        // to fetch farm properties and set it to state
  

    return (
      <div className="text-sm md:text-md min-h-screen px-[32px] py-[80px] bg-white text-black">
        {/* Header and Descriptive Text */}
        <div className='flex items-start justify-between'>
     <div className='flex flex-col gap-2'>
        <div className='text-xl font-semibold lg:font-normal lg:text-2xl'>
          Home
        </div>
        <div className='text-grey-600'>
        <span className="text-primary-700">{user? user.name:"user"}</span>, welcome to overview of Agriethos
        </div>
   </div>
       <div className='flex gap-2 items-center'>
       <div className='px-2 py-1 border border-gray-500 text-gray-600 rounded-full cursor-pointer' onClick={()=> window.location.reload()}>
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
       <section className='flex flex-col lg:flex-row mt-[32px] w-full border-[0.75px] border-grey-200 rounded-lg'>
        
             {/* Item 2 */}
             <div className='flex flex-col gap-[24px] w-full py-[32px] px-[24px] lg:border-r-[0.75px] border-b-[0.75px] lg:border-b-0 border-grey-200'>
          <div className='flex'>
           <div className='text-sm text-grey-400'>
          Farmers's registered
          </div>
         
          </div>
          <div className='text-2xl '>
            {overview?overview.farmersNo:<div className="bg-gray-100 w-8 h-8"></div>}
          </div>
        </div>
             {/* Item 3 */}
             <div className='flex flex-col gap-[24px] w-full py-[32px] px-[24px] lg:border-r-[0.75px] border-b-[0.75px] lg:border-b-0 border-grey-200'>
          <div className='flex items-center justify-between'>
           <div className='text-sm text-grey-400'>
       Active Reviewers
          </div>
          <div className='text-sm text-grey-400'>
            
          </div >
          </div>
          <div className='text-2xl '>
   {overview?overview.reviewersNo:<div className="bg-gray-100 w-8 h-8"></div>}
          </div>
        </div>
             {/* Item 4 */}
             <div className='flex flex-col gap-[24px] w-full py-[32px] px-[24px]'>
          <div className='flex'>
           <div className='text-sm text-grey-400'>
          Total Admins
          </div>
      
          </div>
          <div className='text-2xl '>
           {overview?overview.adminsNo:<div className="bg-gray-100 w-8 h-8"></div>}
          </div>
        </div>
             {/* Item 4 */}
             <div className='flex flex-col gap-[24px] w-full py-[32px] px-[24px]'>
          <div className='flex'>
           <div className='text-sm text-grey-400'>
          Total Crops Submitted
          </div>
      
          </div>
          <div className='text-2xl '>
           {overview?overview.cropsNo:<div className="bg-gray-100 w-8 h-8"></div>}
          </div>
        </div>
       </section>
{/* ########################################################################################################### */}
     <section>
        {/* Header */}
        <div className="mt-12 text-xl px-2 py-1">
            Agents
        </div>

        <div className="flex flex-col gap-2">
            {/* Title */}
      <div className='bg-gray-100 gap-24 flex items-center text-center justify-between w-full px-2 py-1 border-b '>
          {/* S/N */}
      <div  className='basis-1/5 flex items-center justify-center '>
 S/N
      </div>
        {/* Variable Name */}
      <div className='text-grey-900 basis-1/5 '>
    Address
      </div>
    
      <div className='text-grey-900 basis-1/5 '>
      Name
      </div>
      <div className='text-grey-900 basis-1/5 '>
      Date Created
      </div>

      </div>
      {/* Body */}
      <div className="max-h-96 min-h-24   overflow-y-scroll w-full">
      {agents[0] && agents.map((ele,ind)=>(
    <div className=' hover:bg-gray-100 gap-24 flex items-center text-center justify-between w-full px-2 py-2 ' key={ind*526+123}>
          {/* S/N */}
      <div  className='basis-1/4 flex items-start justify-center '>
     {ind+1}
      </div>
        {/* Variable Name */}
      <div className='text-grey-900 basis-1/4 overflow-x-scroll '>
      {ele && ele.walletAddress} 
      </div>
    
      <div className='text-grey-900 basis-1/4 overflow-x-scroll '>
      {ele && ele.name}
      </div>
      <div className='text-grey-900 basis-1/4 overflow-x-scroll '>
      {ele && ele.createdAt}
      </div>

      </div>
  ))}
  {!agents && <div className="flex items-center p-12 text-gray-600 justify-center w-full ">
        No Agents added yet
        </div>}
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
{/* ########################################################################################################### */}
     <section>
        {/* Header */}
        <div className="mt-12 text-xl px-2 py-1">
            Admins
        </div>

        <div className="flex flex-col gap-2">
            {/* Title */}
      <div className='bg-gray-100 gap-24 flex items-center text-center justify-between w-full px-2 py-1 border-b '>
          {/* S/N */}
      <div  className='basis-1/5 flex items-center justify-center '>
 S/N
      </div>
        {/* Variable Name */}
      <div className='text-grey-900 basis-1/5 '>
    Address
      </div>
    
      <div className='text-grey-900 basis-1/5 '>
      Name
      </div>
      <div className='text-grey-900 basis-1/5 '>
      Date Created
      </div>

      </div>
      {/* Body */}
      <div className="max-h-96 min-h-24   overflow-y-scroll w-full">

{admins && admins.map((ele,ind)=>(
  <div className=' hover:bg-gray-100 gap-24 flex items-center text-center justify-between w-full px-2 py-2 ' key={ind*526+123}>
        {/* S/N */}
    <div  className='basis-1/4 flex items-start justify-center '>
   {ind+1}
    </div>
      {/* Variable Name */}
    <div className='text-grey-900 basis-1/4 overflow-x-scroll '>
    {ele && ele.walletAddress} 
    </div>
  
    <div className='text-grey-900 basis-1/4 overflow-x-scroll '>
    {ele && ele.name} {user &&user._id === ele._id && "(You)"}
    </div>
    <div className='text-grey-900 basis-1/4 overflow-x-scroll '>
    {ele && ele.createdAt}
    </div>

    </div>
))}
{!admins && <div className="flex items-center p-12 text-gray-600 justify-center w-full ">
      No Admin added yet
      </div>}
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
{/* ############################################################################################### */}


</div>
    );
  }
  