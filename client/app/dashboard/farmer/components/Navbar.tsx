"use client"
// components/VerticalNavbar.tsx
import Image from "next/image";
import React from "react";

import { useNavContext } from "../NavContext";
import Link from "next/link";

import { LogOut } from "lucide-react";
import { useAuth } from "@/app/Context/AuthContext";

type NavItemProps = {
  icon: string;
  label: string;
  active:boolean;
  address:string;
};
type NavItemPropsMobile = {
  label: string;
  active:boolean;
  address:string;
};


const NavItem: React.FC<NavItemProps> = ({ icon, label, active, address}) => (
  <Link href={`/dashboard/farmer${address}`} className={`group relative flex items-center text-black justify-start w-full h-12 rounded-lg cursor-pointer transition gap-[12px] p-[12px]  ${active&&"bg-primary-500"}`}>
   <span><Image src={icon} alt="logo" width={24} height={24} className=""></Image>
   </span> 
   <div>
   {label}  
   </div>
  </Link>
);

const NavItemMobile: React.FC<NavItemPropsMobile> = ({ label, active, address}) => (
  <Link href={`/dashboard/farmer${address}`} className={`group relative flex items-center text-black justify-center w-full h-12 rounded-lg cursor-pointer transition gap-[12px] p-[12px]  ${active && " text-primary-500 "}`}>
   <div>
   {label}
   </div>
  </Link>
);

const Navbar: React.FC = () => {
const {currentPage,mobileDisplay,setMobileDisplay} = useNavContext();
const {logout} = useAuth()
// Hides navbar mobile

  return (
    <div>
      {/* Desktop mode */}
        <div className="h-screen hidden  w-[352px] py-[80px] px-[32px] bg-white  fixed lg:flex flex-col  gap-[40px] items-center border-r-grey-200 border-r-[0.75px] z-[999999999]">
      {/* Top: Logo or Brand */}
      <div className="flex flex-col w-full items-center space-y-4">
        <div className="text-2xl font-bold flex items-center justify-start w-full"><Image src={"/static/logo-black.png"} alt="logo" width={167} height={34.99} className=""></Image></div>
      </div>

      {/* Side Bar Nav */}
      <div className="flex flex-col w-full gap-[16px] text-black">
        <NavItem icon={"/icons/house.svg"} label="Home" active={currentPage === "home"} address="/" />
        <NavItem icon={"/icons/tree-palm.svg"} label="My Farm" active={currentPage === "farm"} address="/farm" />
        <NavItem icon={"/icons/notepad.svg"} label="Crop Logs" active={currentPage === "logs"} address="/croplogs"/>
        <NavItem icon={"/icons/explore.svg"} label="Explore" active={currentPage === "explore"} address="/explore"/>
        <NavItem icon={"/icons/settings.png"} label="Settings" active={currentPage === "settings"} address="/settings"/>
   
        <div className="group relative flex items-center text-black justify-start w-full h-12 rounded-lg cursor-pointer transition gap-[12px] p-[12px]">
      <div className="text-orange-500"><LogOut /></div> <div className="text-orange-500" onClick={()=>logout()}>Logout</div> 
        </div>
      </div> 
    </div>

    {/* Mobile mode */}
 <div className={` ${mobileDisplay? "fixed":"hidden"} h-screen w-full fixed bg-white py-5 px-[32px] z-[999999]` }>
  {/* Header */}
  <div className="flex justify-between items-center">
{/* Logo */}
<div>
<Image src={"/icons/logo.svg"} alt="logo" width={24} height={32} className="" />
</div>
{/* Cancel */}
<button onClick={()=> setMobileDisplay(false)}>
<Image src={"/icons/cancel.svg"} alt="logo" width={40} height={40} className="" />
</button>
    </div>
{/* nav links */}
<div className="h-full w-full  flex flex-col items-center text-center justify-start text-2xl gap-8 mt-[px] ">
<NavItemMobile  label="Home" active={currentPage === "home"} address="/"  />
<NavItemMobile  label="My Farm" active={currentPage === "farm"} address="/farm"  />
<NavItemMobile  label="Crop Logs" active={currentPage === "logs"} address="/croplogs" />
<NavItemMobile label="Explore" active={currentPage === "explore"} address="/explore"/>
<NavItemMobile label="Settings" active={currentPage === "settings"} address="/settings"/>
<div className="group relative flex items-center text-black justify-center w-full h-12 rounded-lg cursor-pointer transition gap-[12px] p-[12px]">
  <div className="text-orange-500" onClick={()=>logout()}>Logout</div> 
        </div>

</div>
 </div>
    </div>
  );
};

export default Navbar;
