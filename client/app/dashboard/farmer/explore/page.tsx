"use client"
import Image from "next/image";

import { useCallback, useEffect, useRef, useState } from "react";
import { BiSearch } from "react-icons/bi";

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Loader from "../../../components/loader";
import Link from "next/link";
import { useNavContext } from "../NavContext";
import { useAuth } from "@/app/Context/AuthContext";
import { BsPerson, BsWallet } from "react-icons/bs";
import { CiMail } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";

dayjs.extend(relativeTime);
// capitalize first character
function CFL(string_: string | undefined | null) {
  if (!string_) return ""; // Return empty string or fallback
  return string_.charAt(0).toUpperCase() + string_.slice(1);
}
type Crop = {
  _id: string;
  name: string;
  description: string;
};


export default function Home() {
  
  const [crops, setCrops] = useState<Crop[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const [searchQuery, setSearchQuery] = useState(""); // 🔍 
 const {setCurrentPage,setMobileDisplay} = useNavContext();
 const { address, logout ,isLoginStatusLoading,newUser,farmerId, setAddress,email,user} = useAuth();
 const [displayLogout,setDisplayLogout] = useState<boolean>(false);
const router = useRouter();
   // Route protection
    useEffect(() => {
    if (!isLoginStatusLoading  && !email ) {router.push('/auth')}
    if(user && newUser ==="true"){router.push('/onboard')}
  }, [email])
    useEffect(()=>{
          setCurrentPage("explore");
          setMobileDisplay(false);
        
        },[])

        if (!isLoginStatusLoading && !address && !email ) {router.push('/auth')}

  const fetchCrops = async (pageNum: number, search: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/crops/verified?page=${pageNum}&limit=10&search=${encodeURIComponent(
          search
        )}`
      );
      const json = await res.json();
      if (Array.isArray(json.data)) {
        if (pageNum === 1) {
          setCrops(json.data); // New search: replace
        } else {
          setCrops((prev) => [...prev, ...json.data]); // Append for scroll
        }
        setHasMore(json.data.length > 0);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    setPage(1);
    fetchCrops(1, searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (page === 1) return; // already fetched in searchQuery effect
    fetchCrops(page, searchQuery);
  }, [page]);

  const lastItemRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const connectWallet = async () =>{
        if (!(window as any).ethereum) return alert("Please install MetaMask");
      
          // Provider for the EVM wallet
          const provider = new ethers.BrowserProvider((window as any).ethereum);
          // client 
          const signer = await provider.getSigner();
      
          const addr = await signer.getAddress();
  
           // send request to get Nonce and transaction timestamp (addr as payload)
      const resNonce = await fetch("http://localhost:5000/api/auth/request-nonce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: addr }),
      });
     // Parse Nonce data
      const { nonce, timestamp } = await resNonce.json();
      console.log(nonce)
  
      const message = `Welcome to AgriEthos 🌱
  
  Sign this message to verify you own this wallet and authenticate securely.
  
  Wallet Address: ${addr}
  Nonce: ${nonce}
  Timestamp: ${timestamp}
  
  This request will not trigger a blockchain transaction or cost any gas.
  
  Only sign this message if you trust AgriEthos.
    `;
    console.log(addr,nonce,timestamp)
      const signature = await signer.signMessage(message);
  
      const resLogin = await fetch("http://localhost:5000/api/auth/wallet-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: addr, signature }),
      }); 
      const loginData = await resLogin.json();
      const {address,farmerId,newUser,userPack} = await loginData.data
      if (loginData.success) {
        console.log("✅ Login successful!");
        
          setAddress(address);
        
        
      } else {
        console.log(loginData.error || "Login failed.");
        
      }
      
    }
  return (
 
<main className=" w-full flex-1 bg-white ">
<div className="text-sm md:text-md min-h-screen px-[32px] py-5 lg:py-[80px]  bg-white text-black w-full ">

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
        {/* Search bar */}
        
     <div className='flex w-full gap-4 justify-between'>
        <div className=' border-2 w-full lg:w-[400px] rounded-full flex gap-1 items-center justify-between px-4 py-2'>
          <input type="search" placeholder="Search" className="outline-none  w-full "    value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}/> <BiSearch className="text-[24px] text-grey-500" />
        </div>
            <div className='lg:flex gap-2 items-center hidden'>
               
                                    {/* { address?   <button className='px-2 py-1 border-2 w-full border-[#a5eb4c] rounded-2xl  lg:block text-grey-800'>
                                                      
                                                       <div className='flex items-center justify-center gap-2 relative' onClick={()=> setDisplayLogout(!displayLogout)}>  <div className='text-grey-800 text-lg'><BsWallet /></div> <div>{address && address.slice(0,6)}...{address&&address.slice(-4)}</div>
                                                       <div className='absolute bottom-[-150%] w-full flex flex-col bg-grey-100'>
                                                          { displayLogout && address && <div className='text-black bg-primary-500 py-1 px-2' onClick={()=> setAddress(null)}>
                                                             Disconnect
                                                           </div>}
                                                       </div>
                                                       </div> 
                                                          
                                                          </button>:<button className='px-2 py-1 border-2 w-full border-[#a5eb4c] rounded-2xl  lg:block text-grey-800'><div className='flex items-center justify-center gap-2 relative'  onClick={()=>connectWallet()} >Connect Wallet</div></button>} */}
                                                          {/* Email */}
                                                          { email?   <button className='px-2 py-1 border-2 w-full border-[#a5eb4c] rounded-2xl  lg:block text-grey-800'>
                                                      
                                                      <div className='flex items-center justify-center gap-2 relative' onClick={()=> setDisplayLogout(!displayLogout)}>  <div className='text-grey-800 text-lg'><CiMail /></div> <div>{email && email.slice(0,6)}...{email&&email.slice(-4)}</div>
                                                      <div className='absolute bottom-[-150%] w-full flex flex-col bg-grey-100'>
                                                      
                                                      </div>
                                                      </div> 
                                                         
                                                         </button>:<button className='px-2 py-1 border-2 w-full border-[#a5eb4c] rounded-2xl  lg:block text-grey-800'><div className='flex items-center justify-center gap-2 relative' >Add Email</div></button>}
                                              
                              <Image src={"/icons/bell.svg"} alt="bell" width={24} height={24} className="cursor-pointer hidden lg:block" />
                              <Image src={"/icons/burger.svg"} alt="menu" width={40} height={40} className="cursor-pointer lg:hidden"  onClick={()=>setMobileDisplay(true)}/>
                                     </div>
   </div>
   {/* Header */}
    <div className='flex flex-col gap-2 mt-8'>
           <div className='text-xl font-semibold lg:font-normal lg:text-2xl'>
             Explore
           </div>
           <div className='text-grey-600'>
           Browse produce with traceable origins
           </div>
           <div className='flex gap-2 text-primary-700  font-bold'>
          
           </div>
          </div>
       {/* Section One */}
       {/* Overview Stats */}
       <section className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3  mt-8 w-full gap-5 h-full'>
        
        {/* item */}
       {crops[0] && crops.map((ele:any,idx)=>{
        const isLast = idx === crops.length - 1;
        return(<div className="flex flex-col p-4 border rounded-lg cursor-pointer"  key={idx}
      ref={isLast ? lastItemRef : null}  >
        <Link href={"/harvest/"+ele?._id}>
                 <div className="flex justify-between py-3">
          <div className=" gap-2 font-bold flex items-center justify-center">
            <div className="rounded-full w-8 h-8 bg-blue-500 overflow-hidden">
              <Image src={ele && ele.farmPropertyId.images[0]}alt={"pfp"} width={50} height={50} className="w-full h-full object-cover" loading="lazy"/>
            </div>
            <div className="flex flex-col gap-1">
               <div className="text-primary-700">{ele && ele.farmPropertyId.farmName}</div>
              <div className="text-xs text-grey-900">
              {/* location */}
            <div className=" font-thin">
           { ele.farmPropertyId.location}
            </div>
              </div>
            </div>
           
          </div>
          <div className="text-gray-600">
          {dayjs(ele?.createdAt).fromNow()}
          </div>
          </div>
        
        {ele && ele.images[0]?  <div>
            <Image src={ele && ele.images[0]} alt={""} width={280} height={200} className="w-full h-64 object-cover" />
          </div>:<div className="bg-gray-200 w-full h-64"></div>}     {/* Propertie */}
          <div className="flex flex-col mt-4 justify-center">
            {/* Crop name */}
            <div className="text-lg ">{ele.cropName}</div>
            <div className="justify-between flex item-center">
           
            {/* Farm Type */}
            <div className="text-grey-600">
           {CFL(ele && ele.farmPropertyId.farmType)} Farm
            </div>
            </div>
            
            {/* Blockchain verification link */}
            {/* {ele.blockchainTxHash && (
              <div className="mt-2">
                <a
                  href={`https://sepolia.etherscan.io/tx/${ele.blockchainTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  🔗 View on Blockchain
                </a>
              </div>
            )} */}
          </div>
        </Link>
   
     
        </div>)}) }
           
            
        
        
         
         
     
        
     </section>
{/* ############################################################################################### */}

{loading && <div className="text-center  w-full h-full flex items-center justify-center mt-56"><Loader /></div>}
        {!hasMore && !loading && <p className="text-center mt-4 text-gray-500"></p>}
</div>

        
</main>

  );
}

