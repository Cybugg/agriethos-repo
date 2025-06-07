"use client"

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { QRCodeCanvas } from 'qrcode.react';
import CopyButton from "@/app/components/copyButton";
import axios from "axios";
import Loader from "@/app/components/loader";

    interface props {
    cropName: string
    cropId:string
    setShowQRCode: (data:boolean) => void ;
}

const DisplayQRCode:React.FC<props> = ({setShowQRCode,cropName,cropId}) => {

  const [shortURL, setShortURL] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(
    ()=>{
      const shortenURL = async () => {
        if (!cropId) return;
    
        try {
          setLoading(true);
          const res = await axios.get(`https://tinyurl.com/api-create.php?url=${`https://app.agriethos.com/harvest/${cropId}`}`);
          console.log(res.data);
          setShortURL(res.data);
          setLoading(false);
        } catch (err) {
          console.error("Error shortening URL", err);
          setShortURL("Failed to load link. Try again.");
         
        }
      };
      shortenURL();
    },[setLoading,setShortURL,cropId]
  )

    function downloadQRCode(canvasId = "qrCanvas", filename = "qrcode.png") {
        const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!canvas) return alert("QR code canvas not found");
      
        const url = canvas.toDataURL("image/png");
      
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
      }

      

    return (
        <div className="z-50 h-screen fixed flex items-center justify-center w-full bg-black bg-opacity-10 backdrop-blur-lg text-black p-8">
   <div className="p-6 bg-white w-full lg:max-w-[511px] flex flex-col items-center justify-center gap-8 lg:mr-80 ">
    {/* Title */}
    <div className="flex w-full h-full justify-between items-center">
     <div className="text-lg font-bold">
      QR Code for <span className="text-primary-700">{cropName}</span>
     </div>
    <div className="cursor-pointer" onClick={()=>setShowQRCode(false)}>
      <Image src="/icons/cancel.svg" alt="cancel" width={24} height={24} />
    </div>
    </div>    
{/* Dispplay section */}
<div className="w-full flex flex-col gap-6 items-center justify-center">
{loading?<Loader />:<QRCodeCanvas
              id="qrCanvas"
              value={shortURL}
              size={220}
              bgColor="#ffffff"
              fgColor="#000000"
              className="mt-4 w-full h-80"
            />}

            {/* Copy URL */}
          {!loading &&  <div className="flex overflow-hidden rounded-lg">
            <div className=" border text-lg border-gray-400 p-5 text-black py-2 w-full">{shortURL}</div>
            <CopyButton textToCopy={shortURL} />
            </div>}
{/* item 6 submit*/}
{!loading && <button className="bg-primary-500 text-center p-3 rounded-lg w-full" onClick={() => downloadQRCode("qrCanvas", "crop_qr.png")}>
  Download QR Code
</button>}
</div>
   </div>
        </div>
    )
}

export default DisplayQRCode;