"use client"
import { useAuth } from "@/app/Context/AuthContext";
import { useFarm } from "@/app/Context/FarmContext";
import axios from "axios";
import Image from "next/image";
import React, {ReactNode, useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import Switch from "@/app/components/switch";
import { QRCodeCanvas } from 'qrcode.react';
import CopyButton from "@/app/components/copyButton";

    interface props {
    url: string
    setShowQRCode: (data:boolean) => void ;
}

const DisplayQRCode:React.FC<props> = ({setShowQRCode,url=""}) => {

    function downloadQRCode(canvasId = "qrCanvas", filename = "qrcode.png") {
        const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!canvas) return alert("QR code canvas not found");
      
        const url = canvas.toDataURL("image/png");
      
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
      }

      const router = useRouter();

      const str2Bool = (val:string)=>{
            return val==="true"? true: val==="false"?false:undefined
      };

    return (
        <div className="z-50 h-screen fixed flex items-center justify-center w-full bg-black bg-opacity-10 backdrop-blur-lg text-black p-8">
   <div className="p-6 bg-white w-full lg:max-w-[511px] flex flex-col items-center justify-center gap-8 lg:mr-80 ">
    {/* Title */}
    <div className="flex w-full h-full justify-between items-center">
     <div className="text-lg font-bold">
      QR Code for <span className="text-primary-700">Maize</span>
     </div>
    <div className="cursor-pointer" onClick={()=>setShowQRCode(false)}>
      <Image src="/icons/cancel.svg" alt="cancel" width={24} height={24} />
    </div>
    </div>    
{/* Dispplay section */}
<div className="w-full flex flex-col gap-6 items-center justify-center">
<QRCodeCanvas
              id="qrCanvas"
              value={url}
              size={220}
              bgColor="#ffffff"
              fgColor="#000000"
              className="mt-4 w-full h-80"
            />

            {/* Copy URL */}
            <div className="flex overflow-hidden rounded-lg">
            <div className=" border text-lg border-gray-400 p-5 text-black py-2 w-full">{`http://localhost:3000/harvest/`}</div>
            <CopyButton textToCopy={`http://localhost:3000/harvest/`} />
            </div>
{/* item 6 submit*/}
<button className="bg-primary-500 text-center p-3 rounded-lg w-full" onClick={() => downloadQRCode("qrCanvas", "crop_qr.png")}>
  Download QR Code
</button>
</div>
   </div>
        </div>
    )
}

export default DisplayQRCode;