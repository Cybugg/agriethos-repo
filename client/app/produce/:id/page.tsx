"use client"
import IndexNavbar from "@/app/components/indexNavbar";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function Home() {
   const [mobileDisplay,setMobileDisplay] = useState(false);
  return (
    <div className="bg-white h-screen flex w-full">
<div className="flex bg-white w-full">
<IndexNavbar currentPage="home" mobileDisplay={false} setMobileDisplay={setMobileDisplay}/>
<main className="lg:ml-[352px] w-full flex-1 bg-white ">

        
</main>
</div>

</div>
  );
}

