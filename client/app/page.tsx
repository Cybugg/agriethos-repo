"use client"
import Image from "next/image";
import IndexNavbar from "./components/indexNavbar";
import { useCallback, useEffect, useRef, useState } from "react";
import { BiSearch } from "react-icons/bi";

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Loader from "./components/loader";
import Link from "next/link";

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
  const [mobileDisplay,setMobileDisplay] = useState(false);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const [searchQuery, setSearchQuery] = useState(""); // 🔍 

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
  return (
    <div className="bg-white h-screen flex w-full">
<div className="flex bg-white w-full">
<IndexNavbar currentPage="home" mobileDisplay={false} setMobileDisplay={setMobileDisplay}/>
<main className="lg:ml-[352px] w-full flex-1 bg-white ">
<div className="text-sm md:text-md min-h-screen px-[32px] py-[80px] bg-white text-black w-full ">
       
     <div className='flex items-center justify-between gap-3'>
       {/* Search bar */}
        <div className=' border-2 w-[400px] rounded-full flex gap-1 items-center justify-between px-4 py-2'>
          <input type="search" placeholder="Search" className="outline-none  w-full "    value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}/> <BiSearch className="text-[24px] text-grey-500" />
        </div>
     {/* Signin */}
     <Link href={`/auth`} className={`group relative flex items-center text-black justify-start rounded-lg cursor-pointer transition gap-[12px] p-[12px] ${"border border-[#a5eb4c] bg-primary-500  text-md"}`}>
   <div>
   {"Sign in"}  
   </div>
  </Link>
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
        
          <div>
            <Image src={ele && ele.images[0]} alt={"item"} width={280} height={200} className="w-full h-64 object-cover" />
          </div>     {/* Propertie */}
          <div className="flex flex-col mt-4 justify-center">
            {/* Crop name */}
            <div className="text-lg ">{ele.cropName}</div>
            <div className="justify-between flex item-center">
           
            {/* Farm Type */}
            <div className="text-grey-600">
           {CFL(ele && ele.farmPropertyId.farmType)} Farm
            </div>
            </div>
          </div>
        </Link>
   
     
        </div>)}) }
           
            
        
        
         
         
     
        
     </section>
{/* ############################################################################################### */}

{loading && <div className="text-center  w-full h-full flex items-center justify-center mt-56"><Loader /></div>}
        {!hasMore && !loading && <p className="text-center mt-4 text-gray-500"></p>}
</div>

        
</main>
</div>

</div>
  );
}

