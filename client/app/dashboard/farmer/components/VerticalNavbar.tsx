"use client"
// components/VerticalNavbar.tsx
import Image from "next/image";
import React from "react";
import { FaHome, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useNavContext } from "../NavContext";
import Link from "next/link";

type NavItemProps = {
  icon: string;
  label: string;
  active:boolean;
  address:string;
};

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, address}) => (
  <Link href={`/dashboard/farmer${address}`} className={`group relative flex items-center justify-start w-full h-12 rounded-lg cursor-pointer transition gap-[12px] p-[12px]  ${active&&"bg-primary-500 "}`}>
   <span><Image src={icon} alt="logo" width={24} height={24} className=""></Image>
   </span> 
   <div>
   {label}
   </div>
  </Link>
);

const VerticalNavbar: React.FC = () => {
const {currentPage} = useNavContext();
  return (
    <div className="h-screen w-[352px] py-[80px] px-[32px] bg-white  fixed flex flex-col  gap-[40px] items-center border-r-grey-200 border-r-[0.75px] ">
      {/* Top: Logo or Brand */}
      <div className="flex flex-col w-full items-center space-y-4">
        <div className="text-2xl font-bold flex items-center justify-start w-full"><Image src={"/static/logo-black.png"} alt="logo" width={167} height={34.99} className=""></Image></div>
      </div>

      {/* Side Bar Nav */}
      <div className="flex flex-col w-full gap-[16px] text-black">
        <NavItem icon={"/icons/house.svg"} label="Home" active={currentPage === "home"} address="/" />
        <NavItem icon={"/icons/tree-palm.svg"} label="My Farm" active={currentPage === "farm"} address="/farm" />
        <NavItem icon={"/icons/notepad.svg"} label="Crop Logs" active={currentPage === "logs"} address="/croplogs"/>
      </div>
    </div>
  );
};

export default VerticalNavbar;
