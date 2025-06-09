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
    const originalCanvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!originalCanvas) return alert("QR code canvas not found");
  
    const originalSize = originalCanvas.width;
    const padding = 40; // white padding (around all sides)
    const finalSize = originalSize + padding * 2;
  
    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = finalSize;
    finalCanvas.height = finalSize;
    const ctx = finalCanvas.getContext("2d");
    if (!ctx) return;
  
    // Draw white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, finalSize, finalSize);
  
    // Draw QR image centered with padding
    ctx.drawImage(originalCanvas, padding, padding, originalSize, originalSize);
  
    // Trigger download
    const imageURL = finalCanvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = imageURL;
    link.download = filename;
    link.click();
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
              className="mt-4 w-full h-80 p-2 border-2 rounded-lg "
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