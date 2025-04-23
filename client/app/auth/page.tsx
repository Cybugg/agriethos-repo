'use client';

import { useAuth } from '../Context/AuthContext';
import { useState } from 'react';
import { ethers } from 'ethers';
import Image from 'next/image';
import Loader from '../components/loader';
import {useRouter} from "next/navigation";



export default function Page() {
  const [loading, setLoading] = useState(false);
  const { setAddress } = useAuth();
  const [msg, setMsg] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const router = useRouter();

  // onConnect getNonce -> 
  const connectWallet = async () => {
    // init
    setLoading(true);
    setMsg("");
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
    
    if (loginData.success) {
      console.log("✅ Login successful!");
        setLoading(false);
        setSuccess("sucess")
        setAddress(addr);
        router.replace("/dashboard/farmer")
        
    } else {
      setMsg(loginData.error || "Login failed.");
      setLoading(false);
    }
  };



  return (
    <div className="h-screen w-full flex flex-col gap-1 bg-white items-center justify-center text-black">
      {/* Display Element */}
      <div className='flex flex-col gap-5 h-full  mt-[-200px] max-w-[500px] w-full items-center justify-center'>
    <Image src={"/icons/logo.svg"} alt="logo" width={46} height={61.5} />
    <h2 className="text-3xl">Welcome to Agriethos</h2>
    <div className='italic'>Sign in to grow trust with every harvest.</div>
    <button
      onClick={connectWallet}
      className="px-4 mt-5 w-full py-2 bg-primary-600 text-black rounded"
    >
      {loading && success !== "successful"?<Loader />: !loading && success === "success"?"Login successful": <div className='flex items-center justify-center gap-1'><div>Connect with Metamask</div><Image src={"/icons/metamask.png"} alt="metamask" width={18} height={14} /></div>}
    </button>
      </div> 
    
    {msg && <p className="text-red-600 mt-2">{msg}</p>}
  </div>
  );
}
