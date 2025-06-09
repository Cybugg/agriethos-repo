"use client"
// Farmers dashboard
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useNavContext } from './NavContext';
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/Context/AuthContext';

import { PiPlant } from 'react-icons/pi';
import { useFarm } from '@/app/Context/FarmContext';
import Loader from '@/app/components/loader';
import Weather from './components/weather';
import { CiMail } from 'react-icons/ci';
import Alert from '@/app/components/alert';

import { GrUpdate } from 'react-icons/gr';
import DisplayQRCode from './components/qrcodePreview';

// Define the shape of the chart data
interface GrowthDataPoint {
  time: string;
  preHarvest: number;
  postHarvest: number;
}
// Dashboard overview data-shape 
interface Overview {
  cropsLen:string;
  location:string;
  size:string;
  hashLen:string;
}

// Define available crop types
type CropType = 'maize' | 'rice';
type RangeType = 'week' | 'month' | 'year';

// Mock dataset
const cropData: Record<CropType, Record<RangeType, GrowthDataPoint[]>> = {
  maize: {
    week: [
      { time: 'Mon', preHarvest: 20, postHarvest: 5 },
      { time: 'Tue', preHarvest: 35, postHarvest: 10 },
      { time: 'Wed', preHarvest: 50, postHarvest: 15 },
      { time: 'Thu', preHarvest: 65, postHarvest: 20 },
      { time: 'Fri', preHarvest: 80, postHarvest: 25 },
    ],
    month: [
      { time: 'Week 1', preHarvest: 30, postHarvest: 10 },
      { time: 'Week 2', preHarvest: 60, postHarvest: 15 },
      { time: 'Week 3', preHarvest: 90, postHarvest: 20 },
      { time: 'Week 4', preHarvest: 100, postHarvest: 30 },
    ],
    year: [
      { time: 'Q1', preHarvest: 25, postHarvest: 5 },
      { time: 'Q2', preHarvest: 50, postHarvest: 20 },
      { time: 'Q3', preHarvest: 75, postHarvest: 40 },
      { time: 'Q4', preHarvest: 100, postHarvest: 60 },
    ],
  },
  rice: {
    week: [
      { time: 'Mon', preHarvest: 10, postHarvest: 2 },
      { time: 'Tue', preHarvest: 25, postHarvest: 5 },
      { time: 'Wed', preHarvest: 40, postHarvest: 10 },
      { time: 'Thu', preHarvest: 60, postHarvest: 15 },
      { time: 'Fri', preHarvest: 80, postHarvest: 18 },
    ],
    month: [
      { time: 'Week 1', preHarvest: 20, postHarvest: 8 },
      { time: 'Week 2', preHarvest: 50, postHarvest: 15 },
      { time: 'Week 3', preHarvest: 70, postHarvest: 25 },
      { time: 'Week 4', preHarvest: 100, postHarvest: 35 },
    ],
    year: [
      { time: 'Q1', preHarvest: 20, postHarvest: 5 },
      { time: 'Q2', preHarvest: 45, postHarvest: 15 },
      { time: 'Q3', preHarvest: 75, postHarvest: 30 },
      { time: 'Q4', preHarvest: 100, postHarvest: 50 },
    ],
  },
};
interface CropData {
  farmerId: string;
  farmPropertyId: string;
  cropName: string;
  plantingDate: Date;
  harvestingDate?: Date;
  growthStage: 'pre-harvest' | 'post-harvest';
  verificationStatus: VerificationStatus;
}

interface ChartData {
  name: string;
  value: number;
}
interface QRCode {
  cropName: string
  cropId:string
 
}type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'toUpgrade';

// Custom color palette
const COLORS = ['#149414', '#ffc600', '#e30e0e', '#FF8042'];

// Sample Data
const sampleData = [
  { name: 'Success', value: 60 },
  { name: 'Pending', value: 30 },
  { name: 'Rejected', value: 10 },
];

interface StatusData {
  name:string;
  value:number
}

export default function Home() {
   const [showQRCode,setShowQRCode] = useState<boolean>(false)
    const [loadingCrop, setLoadingData]=useState<boolean>(true);
  const [selectedCrop, setSelectedCrop] = useState<CropType>('maize');
  const [selectedRange, setSelectedRange] = useState<RangeType>('week');
  const [displayLogout,setDisplayLogout] = useState<boolean>(false);
  const [error,setError] = useState<boolean>(false);
  const [msg,setMsg] = useState<string>("");
  const {setCurrentPage,setMobileDisplay} = useNavContext();
  const { address, isLoginStatusLoading,farmerId,newUser,user,email} = useAuth();
 const [overview, setOverview] = useState<Overview>();
 const [crops, setCrops] = useState<any[]>([]);
  const router = useRouter();
  const { farm, setFarm } = useFarm();
  const data = cropData[selectedCrop][selectedRange];
   const [statusData,setStatusData] = useState<StatusData[]>([])
    const [QRCodeData,setQRCodeData] = useState<QRCode>({
          cropName:"",
          cropId:""
        })
  

  // Route protection
  useEffect(() => {

    if (!isLoginStatusLoading && !email ) {router.push('/auth')}
    if(!isLoginStatusLoading && farmerId && newUser ==="true"){router.push('/onboard');
       console.log("new user ni") }
       console.log(newUser)
  }, [address,farmerId,isLoginStatusLoading,newUser,router,email])


// Set the navbar active value to homr
   useEffect(()=>{
          setCurrentPage("home");
          setMobileDisplay(false);
        },[address,email,setCurrentPage,setMobileDisplay])
  
        // to fetch farm properties and set it to state
  useEffect(() => {
    setSelectedCrop("maize");
    setSelectedRange("week");
    if (!isLoginStatusLoading && user) {
      const fetchFarm = async () => {
        try {
          console.log('Fetching farm data for user ID:', user._id);
          const res = await fetch(`https://api.agriethos.com/api/farm/farm-properties/${user._id}`);
          const data = await res.json();
          if (!res.ok) {
            const errorText = await res.text();
            setMsg("FETCH ERROR")
            throw new Error(`Failed to fetch: ${res.status} ${errorText}`);
          }
          
      
          console.log('Farm data received:', data);
          setFarm(data);
        } catch (err) {
          console.error('Error fetching farm data:', err);
        }
      };

      fetchFarm();
    }
  }, [user, isLoginStatusLoading,setFarm]);

  // Fetch overview data

  useEffect(()=>{
    const fetchOverview = async () =>{
      try{const res = await fetch("https://api.agriethos.com/api/crops/overview/"+farmerId)
      const json = await res.json();

      if(!res.ok || json.message !== "success"){
        console.log("Unable to fetch overview data")
      }
      setOverview(json.data);}
      catch(err){
        console.log(err);
      }
    };
    fetchOverview();
  },[setOverview,farmerId])


           // fetch crop details
        useEffect(
          ()=>{
            const fetchCrops = async() =>{
              try{
                const res = await fetch("https://api.agriethos.com/api/crops/farmer/"+farmerId) 
                const {data} = await res.json();
                setCrops(data);
                console.log(data);
                if(data && res.ok){ setLoadingData(false)}
              }
              catch(err){
                console.log(err)
              }
            };
           if(farmerId) {fetchCrops();} 
          },[farmerId,setCrops,setLoadingData]
        )

        //  function for the pie chart togenerate summary of the verication status
            const generateStatusSummary = (data: CropData[]): ChartData[] => {
              const statusMap: Record<VerificationStatus, string> = {
                verified: 'Success',
                pending: 'Pending',
                rejected: 'Rejected',
                toUpgrade: 'To Upgrade',
              };
            
              const countMap: Record<VerificationStatus, number> = {
                verified: 0,
                pending: 0,
                rejected: 0,
                toUpgrade: 0,
              };
            
              data.forEach((item) => {
                countMap[item.verificationStatus]++;
              });
            
              return (Object.keys(statusMap) as VerificationStatus[]).map((key) => ({
                name: statusMap[key],
                value: countMap[key],
              }));
            };
        //  To set the Pie-chart data
              useEffect(
                ()=>{
                  
                  if(crops){
                    const dataPack = generateStatusSummary(crops);
                    setStatusData(dataPack);
                    console.log(dataPack)
                  }
                },[crops]
              )

  // to fetch overview
  // useEffect(() => {
    
  //   });


//   const connectWallet = async () =>{
//       if (!(window as any).ethereum) return alert("Please install MetaMask");
//       // Provider for the EVM wallet
//  const provider = new ethers.BrowserProvider((window as any).ethereum);
//  // client 
//  const signer = await provider.getSigner();

//  const addr = await signer.getAddress();
//     if(user && user._id){
//   // send request to get Nonce and transaction timestamp (addr as payload)
// const resNonce = await fetch("https://api.agriethos.com/api/auth/request-nonce/"+user._id, {
// method: "PUT",
// headers: { "Content-Type": "application/json" },
// body: JSON.stringify({ address: addr }),
// });
// // Parse Nonce data
// const { nonce, timestamp } = await resNonce.json();
// console.log(nonce)

// const message = `Welcome to AgriEthos 🌱

// Sign this message to verify you own this wallet and authenticate securely.

// Wallet Address: ${addr}
// Nonce: ${nonce}
// Timestamp: ${timestamp}

// This request will not trigger a blockchain transaction or cost any gas.

// Only sign this message if you trust AgriEthos.
// `;
// console.log(addr,nonce,timestamp)
// const signature = await signer.signMessage(message);

// const resLogin = await fetch("https://api.agriethos.com/api/auth/wallet-login/"+user._id, {
// method: "POST",
// headers: { "Content-Type": "application/json" },
// body: JSON.stringify({ address: addr, signature }),
// }); 
// const loginData = await resLogin.json();
// const {address,farmerId,newUser,userPack} = await loginData.data
// if (loginData.success && resLogin.ok) {
// console.log("✅ Login successful!");
 
//  setAddress(address);
 


// } else {
// console.log(loginData.error || "Login failed.");
// setMsg(loginData.message)
// setError(true)
// }

//     }
       
    
//   }
    return (
      <div>  {showQRCode && <DisplayQRCode setShowQRCode={setShowQRCode} cropName={QRCodeData.cropName}  cropId={QRCodeData.cropId}/>}<div className="text-sm md:text-md min-h-screen px-[32px] py-5 lg:py-[80px] bg-white text-black">
     
    <div className='flex gap-2 items-center w-full justify-end lg:hidden my-2'>
                
                                         {/* Email */}
                                         { email?   <button className='px-2 py-1 border-2  border-[#a5eb4c] rounded-2xl  lg:block text-grey-800'>
                                     
                                     <div className='flex items-center justify-center gap-2 relative' onClick={()=> setDisplayLogout(!displayLogout)}>  <div className='text-grey-800 text-lg'><CiMail /></div> <div>{email && email.slice(0,6)}...{email&&email.slice(-4)}</div>
                                     <div className='absolute bottom-[-150%] w-full flex flex-col bg-grey-100'>
                                     
                                     </div>
                                     </div> 
                                        
                                        </button>:<button className='px-2 py-1 border-2 w-full border-[#a5eb4c] rounded-2xl  lg:block text-grey-800'><div className='flex items-center justify-center gap-2 relative' >Add Email</div></button>}
                             
             <Image src={"/icons/bell.svg"} alt="bell" width={24} height={24} className="cursor-pointer hidden lg:block" />
             <Image src={"/icons/burger.svg"} alt="menu" width={50} height={50} className="cursor-pointer lg:hidden"  onClick={()=>setMobileDisplay(true)}/>
                    </div>
    {/* Header and Descriptive Text */}
    <div className='flex items-start justify-between w-full'>
 <div className='flex flex-col gap-2'>
    <div className='text-xl font-semibold lg:font-normal lg:text-2xl'>
      Home
    </div>
    <div className='text-grey-600 hidden lg:block'>
      Your farm at a glance
    </div>
    <div className='flex my-2 gap-2 text-primary-700  font-bold'>
   
        <PiPlant /> <div>{farm?farm.farmName:<div className='w-8 h-8 bg-gray-100'></div>}</div>
    
    </div>
   </div>
   <div className='lg:flex gap-2 items-center  hidden '>
   <div className='px-2 py-1 border  border-gray-500 text-gray-600 rounded-full cursor-pointer hidden lg:block' onClick={()=> window.location.reload()}>
    Reload
   </div>
               {/* { address?   <button className='px-2 py-1 border-2 w-full border-[#a5eb4c] rounded-2xl  lg:block text-grey-800'>
               
                <div className='flex items-center justify-center gap-2 relative' onClick={()=> setDisplayLogout(!displayLogout)}>  <div className='text-grey-800 text-lg'><BsWallet /></div> <div>{address && address.slice(0,6)}...{address&&address.slice(-4)}</div>
                <div className='absolute bottom-[-150%] w-full flex flex-col bg-grey-100'>
                   { displayLogout && address && <div className='text-black bg-primary-500 py-1 px-2' onClick={()=> setAddress(null)}>
                      Disconnect
                    </div>}
                </div>
                </div> 
                   
                   </button>:<button className='px-2 py-1 border-2 w-full border-[#a5eb4c] rounded-2xl  lg:block text-grey-800'><div className='flex items-center justify-center gap-2 relative' onClick={()=>connectWallet()} >Connect Wallet</div></button>} */}
                   {/* Email */}
                   { email?   <button className='px-2 py-1 border-2 w-full border-[#a5eb4c] rounded-2xl  lg:block text-grey-800'>
               
               <div className='flex items-center justify-center gap-2 relative' onClick={()=> setDisplayLogout(!displayLogout)}>  <div className='text-grey-800 text-lg'><CiMail /></div> <div>{email && email.slice(0,6)}...{email&&email.slice(-4)}</div>
               <div className='absolute bottom-[-150%] w-full flex flex-col bg-grey-100'>
               
               </div>
               </div> 
                  
                  </button>:<button className='px-2 py-1 border-2 w-full border-[#a5eb4c] rounded-2xl  lg:block text-grey-800'><div className='flex items-center justify-center gap-2 relative' >Add Email</div></button>}
       
        <Image src={"/icons/bell.svg"} alt="bell" width={24} height={24} className="cursor-pointer hidden lg:block" />
        <Image src={"/icons/burger.svg"} alt="burger" width={40} height={40} className="cursor-pointer t lg:hidden" onClick={()=>setMobileDisplay(true)}/>
               </div>
    </div>
   {/* Section One */}
   {/* Overview Stats */}
   <section className='flex flex-col lg:flex-row mt-[32px] w-full border-[0.75px] border-grey-200 rounded-lg'>
    {/* Item 1 */}
    <div className='flex flex-col gap-[24px] w-full py-[32px] px-[24px]  lg:border-r-[0.75px] border-b-[0.75px] lg:border-b-0 border-grey-200'>
      <div className='flex items-center justify-between'>
       <div className='text-sm text-grey-400'>
        Total Active Crops
      </div>
      <div className='text-success-500 '>
         +%
      </div >
      </div>
      <div className=' text-2xl '>
        {overview?overview.cropsLen:<div className='w-8 h-8 bg-gray-100'></div>}
      </div>
    </div>
         {/* Item 2 */}
         <div className='flex flex-col gap-[24px] w-full py-[32px] px-[24px] lg:border-r-[0.75px] border-b-[0.75px] lg:border-b-0 border-grey-200'>
      <div className='flex'>
       <div className='text-sm text-grey-400'>
      Farm Location
      </div>
     
      </div>
      <div className='text-2xl '>
        {overview?overview.location : <div className='w-8 h-8 bg-gray-100'></div>}
      </div>
    </div>
         {/* Item 3 */}
         <div className='flex flex-col gap-[24px] w-full py-[32px] px-[24px] lg:border-r-[0.75px] border-b-[0.75px] lg:border-b-0 border-grey-200'>
      <div className='flex items-center justify-between'>
       <div className='text-sm text-grey-400'>
   Farm Size
      </div>
      <div className='text-sm text-grey-400'>
        
      </div >
      </div>
      <div className='text-2xl '>
      {overview?overview.size:<div className='w-8 h-8 bg-gray-100'></div>} {overview&& overview.size && "Hectares"}
      </div>
    </div>
         {/* Item 4 */}
         <div className='flex flex-col gap-[24px] w-full py-[32px] px-[24px]'>
      <div className='flex'>
       <div className='text-sm text-grey-400'>
       Verified Blockchain Entries
      </div>
  
      </div>
      <div className='text-2xl '>
        {overview?overview.hashLen : <div className='w-8 h-8 bg-gray-100'></div>}
      </div>
    </div>
   </section>
{/* ########################################################################################################### */}
  {/* Section Two */}
  <section className='lg:flex  lg:flex-row gap-8 items-start mt-6 '>

{/* ////////////////////////////////////////////////////////////////////////////////////////////// */}
    {/* Crop log */}
 <div className='min-h-[440px] w-full rounded-lg border-[0.75px] border-grey-200 p-4 hidden lg:block'>
<div className='lg:flex items-center justify-between '>
{/* Title */}
<div className='text-lg font-semibold lg:font-normal lg:text-xl'>
Crop Growth
</div>
<div className='flex gap-2'>
<div className='py-1 px-2 rounded-lg border border-grey-200 cursor-pointer text-grey-700'>
<select id="crop" name="crop" className='bg-white'>
<option value="tomatoes">Tomatoes</option>
<option value="yam">Yam</option>
<option value="corn">Corn</option>
<option value="cassava">Cassava</option>
</select>
</div>
<div className='py-1 px-2 rounded-lg border border-grey-200 cursor-pointer text-grey-700'>
<select id="crop" name="crop" className='bg-white'>
<option value="tomatoes">This Week</option>
<option value="tomatoes">This Month</option>
<option value="yam">This Year</option>
</select>  </div>
</div>
</div>
<ResponsiveContainer width="100%" height={300} className={"mt-16 hidden lg:block"}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="time" />
      <YAxis />
      <Tooltip />
      <Legend />
      {/* <Line type="monotone" dataKey="preHarvest" stroke="#00b894" name="Pre-Harvest" /> */}
      <Line type="monotone" dataKey="preHarvest" stroke="#149414" name="Pre-Harvest" />
    </LineChart>
  </ResponsiveContainer>
  <div className='text-xs text-grey-500 w-full text-center'>
    Only for demonstration purpose, this feature is coming soon.
  </div>
</div>
{/* Today's Weather */}
<div className='w-full lg:min-h-[440px] lg:w-[448px] rounded-lg border-[0.75px] border-grey-200 p-4 gap-6 flex flex-col'>
{/* Title */}
<div className='text-lg font-semibold lg:font-normal lg:text-xl'>
Today&apos;s Weather
</div>
{/* lists of weather variables */}
<div className='flex flex-col gap-4 lg:w-[416px]'>
<Weather />
</div>
</div>
  </section>
     <section className='mt-6 flex flex-col lg:flex-row gap-2 lg:gap-8 items-start  '>
    <div className=' w-full rounded-lg border-[0.75px] border-grey-200 p-4 gap-6 flex flex-col max-h-[350px]  overflow-y-scroll'>
          <div className='flex items-center justify-between'>
          {/* Title */}
          <div className='text-sm font-semibold lg:font-normal lg:text-xl'>
         Post-harvest Verifications
          </div>
          </div>
          {/* Verification variables */}
  <div className='flex flex-col gap-4 w-full   justify-center '>
  {/* Variable <header>*/}
  <div className='gap-24 flex items-center text-center justify-between w-full px-2 py-1 border-b bg-gray-100'>
    {/* Variable Name */}
  <div className='basis-1/2 lg:basis-1/3 text-grey-900 w-full text-center '>
  Crop Name
  </div>
  <div className='text-grey-900 hidden lg:block  basis-1/2 lg:basis-1/3 w-full '>
  <span className='hidden lg:block  text-center '>Verification Status</span> 
  <span className=' lg:hidden text-grey-900  basis-1/2 lg:basis-1/3 '>Status</span> 
  </div>
  <div className='text-grey-900  basis-1/2 lg:basis-1/3 w-full text-center '>
    Action
  </div>
  </div>
  
  {/* section 2 */}
  {!crops[0]&& !loadingCrop && <div className='w-full h-56 flex items-center justify-center'>No crops has reached post-harvest stage yet...</div>}
          {loadingCrop && <div className='h-56 w-full flex items-center justify-center'><Loader /></div>}
  {crops && crops.map((ele,ind)=>ele.growthStage === "post-harvest"&&<div className='relative' key={ind*2*1020}>
  {/* Variable */}
  <div className=' gap-24 flex items-center  justify-between w-full text-center my-1 '>
    {/* Variable Name */}
  <div className=' basis-1/2 lg:basis-1/3 flex items-center justify-center '>
  {ele?.cropName}
  </div>
  {ele.verificationStatus === "toUpgrade"?       <div className='  basis-1/2 lg:basis-1/3  items-center justify-center hidden lg:flex'>
             <button className='  px-2 py-1 gap-1 flex items-center text-success-500 rounded-2xl border border-[#149414] '>
             <div className="w-4 h-4"><GrUpdate /></div>
             <div className='text-xs'>Upgrade</div>
  </button>
        </div>: ele.verificationStatus === "rejected"?  <div className='basis-1/2 lg:basis-1/3 fhidden lg:flex items-center justify-center  text-error-500'>
        
        <button className=' px-2 py-1 gap-1 hidden lg:flex items-center text-error-500 rounded-2xl border border-[#e30e0e] '>
  <Image src={"/icons/fail.svg"} alt='rejection img' width={16} height={16} />
  <div className='text-xs'>Rejected</div>
  </button>
        </div>:ele.verificationStatus === "verified"? <div className='basis-1/2 lg:basis-1/3   hidden lg:flex items-center justify-center '>
        <button className='  px-2 py-1 gap-1 hidden lg:flex items-center text-success-500 rounded-2xl border border-[#149414] '>
  <Image src={"/icons/success.svg"} alt='success img' width={16} height={16} />
  <div className='text-xs'>Success</div>
  </button>
        </div>:ele.verificationStatus === "pending"?      <div className='basis-1/2 lg:basis-1/3 hidden lg:flex items-center justify-center '>
        <button className='px-2 py-1 gap-1 hidden lg:flex items-center text-warning-600 rounded-2xl border border-[#e8b400] '>
  <Image src={"/icons/pending.svg"} alt='Pending img' width={16} height={16} />
  <div className='text-xs'>Pending</div>
  </button>
        </div>:      <div className='basis-1/2 lg:basis-1/3 hidden lg:flex items-center justify-center '>
        <button className='px-2 py-1 gap-1 hidden lg:flex items-center text-warning-600 rounded-2xl border border-[#e8b400] '>
  <Image src={"/icons/pending.svg"} alt='Pending img' width={16} height={16} />
  <div className='text-xs'>Unkown</div>
  </button>
        </div>}
  {/* Verification action */}
  <div className='basis-1/2 lg:basis-1/3 flex items-center justify-center '>
  {ele.verificationStatus ==="verified"&&<button className='border border-black  px-2 font-semibold rounded-lg text-black' onClick={()=>{
    setShowQRCode(true);
    setQRCodeData(()=>({cropName:ele.cropName,cropId:ele._id}))}}>
  View QR Code
  </button>}
  </div>
  </div>
  </div>)}
  
  
  
  
          <div>
       </div>
       </div>
          </div>
  
          {/* Verification Statistics */}
          <div className=' w-full lg:basis-2/5 rounded-lg border-[0.75px] border-grey-200 p-4 gap-6 flex flex-col  '>
          <div className='flex items-center justify-between'>
          {/* Title */}
          <div className='text-sm font-semibold lg:font-normal lg:text-xl'>
          Verifications Statistics
          </div>
          </div>
          {/* Pie-chart */}
  <div className='flex flex-col gap-4 w-full justify-center '>
  <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          {/* Pie component for data rendering */}
          <Pie
            data={statusData&& statusData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {/* Map through data to assign colors */}
            {sampleData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
       </div>
          </div>
              </section>
{/* ############################################################################################### */}
  {/* Section three */}
  {/* <section className='flex flex-col lg:flex-row gap-8 mt-6'>
   
    <div className='w-full lg:w-[448px] rounded-lg border-[0.75px] border-grey-200 p-4 gap-6 flex flex-col h-[250px]'>
    <div className='flex items-center justify-between'>

    <div className='text-lg font-semibold lg:font-normal lg:text-xl'>
    Recent Crop Logs
    </div>
    </div>
 
<div className='flex flex-col gap-4 lg:w-[346px]'>


<div className='flex items-center justify-between'>

<div className='text-grey-600'>
Crop Name/Growth Stage
</div>
<div>
Corn/Pre-harvest
</div>
</div>

<div className='flex items-center justify-between'>

<div className='text-grey-600'>
Date
</div>
<div>
3rd April, 2025
</div>
</div>

<div className='flex items-center justify-between'>

<div className='text-grey-600'>
Time
</div>
<div>
14:39PM
</div>
</div>

<div className='flex items-center justify-between'>

<div className='text-grey-600'>
Verifaction Status
</div>
<div className='text-success-500'>
Success
</div>
</div>
    <div>
 </div>
 </div>
    </div>
    
    
    <div className=' w-full rounded-lg border-[0.75px] border-grey-200 p-4 gap-6 flex flex-col max-h-[350px]  overflow-y-scroll'>
    <div className='flex items-center justify-between'>

    <div className='text-lg font-semibold lg:font-normal lg:text-xl'>
    Verifaction Status
    </div>
    </div>
  
<div className='flex flex-col gap-4 w-full  justify-center '>

<div className='flex items-center w-full  justify-between '>

<div className='text-grey-600  w-full'>
Entry Name
</div>
<div className='text-grey-600 w-full hidden lg:block'>
Blockchain Hash
</div>
<div className='text-grey-600  w-full '>
Verification Status
</div>
<div className='text-grey-600 w-24'>
</div>
</div>

<div className='flex items-center justify-between '>

<div className=' w-full'>
Corn Pre-harvest
</div>
<div className=' w-full hidden lg:block'>
0xA4B5...F7D2
</div>
<div className='w-full'>
<button className='bg-[#F2FEF2] px-2 py-1 gap-1 flex items-center text-success-500 rounded-2xl border border-[#149414] '>
<Image src={"/icons/success.svg"} alt='success img' width={16} height={16} className='w-3 h-3 lg:w-4 lg:h-4' />
<div className='text-xs'>Success</div>
</button>
</div>


<div className='w-24 cursor-pointer'>
<Image src={"/icons/link.svg"} alt='success img' width={24} height={24} />
</div>
</div>

<div className='flex items-center justify-between '>

<div className=' w-full'>
Corn Pre-harvest
</div>
<div className=' w-full hidden lg:block'>
0xA4B5...F7D2
</div>
<div className='w-full'>
<button className='bg-[#FFF1F1] px-2 py-1 gap-1 flex items-center text-error-500 rounded-2xl border border-[#e30e0e] '>
<Image src={"/icons/fail.svg"} alt='rejection img' width={16} height={16} className='w-3 h-3 lg:w-4 lg:h-4' />
<div className='text-xs'>Rejected</div>
</button>
</div>


<div className='w-24 cursor-pointer'>
<Image src={"/icons/link.svg"} alt='success img' width={24} height={24} />
</div>
</div>

<div className='flex items-center justify-between '>

<div className=' w-full'>
Tomato Post-harvest
</div>
<div className=' w-full hidden lg:block'>
0xA4B5...F7D2
</div>
<div className='w-full'>
<button className='bg-[#FFF9E6] px-2 py-1 gap-1 flex items-center text-warning-600 rounded-2xl border border-[#e8b400] '>
<Image src={"/icons/pending.svg"} alt='Pending img' width={16} height={16} className='w-3 h-3 lg:w-4 lg:h-4'  />
<div className='text-xs'>Pending</div>
</button>
</div>


<div className='w-24 cursor-pointer'>
<Image src={"/icons/link.svg"} alt='success img' width={24} height={24} />
</div>
</div>

<div className='flex items-center justify-between '>

<div className=' w-full'>
Ground Pre-harvest
</div>
<div className=' w-full hidden lg:block'>
0xA4B5...F7D2
</div>
<div className='w-full'>
<button className='bg-[#FFF9E6] px-2 py-1 gap-1 flex items-center text-warning-600 rounded-2xl border border-[#e8b400] '>
<Image src={"/icons/pending.svg"} alt='Pending img' className='w-3 h-3 lg:w-4 lg:h-4' width={16} height={16}  />
<div className='text-xs'>Pending</div>
</button>
</div>


<div className='w-24 cursor-pointer'>
<Image src={"/icons/link.svg"} alt='success img' width={24} height={24} />
</div>
</div>

<div className='flex items-center justify-between '>

<div className=' w-full'>
Corn Post-harvest
</div>
<div className=' w-full hidden lg:block'>
0xA4B5...F7D2
</div>
<div className='w-full'>
<button className='bg-[#F2FEF2] px-2 py-1 gap-1 flex items-center text-success-500 rounded-2xl border border-[#149414] '>
<Image src={"/icons/success.svg"} alt='success img' width={16} height={16} className='w-3 h-3 lg:w-4 lg:h-4' />
<div className='text-xs'>Success</div>
</button>
</div>


<div className='w-24 cursor-pointer'>
<Image src={"/icons/link.svg"} alt='success img' width={24} height={24} />
</div>
</div>
    <div>
 </div>
 </div>
    </div>
  </section> */}
   {error&& <Alert message={`${msg}`} color='text-red-800' background='bg-red-100' onClose={()=> setError(false)}/>}
  </div></div>
     
    );
  }
