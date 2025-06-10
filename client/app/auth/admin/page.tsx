'use client';

import { useAdminAuth } from '../../Context/AdminAuthContext';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Image from 'next/image';
import Loader from '../../components/loader';
import {useRouter} from "next/navigation";
import Alert from '../../components/alert';



export default function Page() {
  const [loading, setLoading] = useState(false);
  const { setAddress ,setAdminId, address,user,setUser,isLoginStatusLoading} = useAdminAuth();
  const [msg, setMsg] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [successSub, setSuccessSub] = useState<boolean>(false)
  const router = useRouter();




  useEffect(()=>
    {
      if (isLoginStatusLoading &&address  && user && user.role ==="admin"){router.replace("/dashboard/admin/")}
     
    },[address,user,router]
  )

  // onConnect getNonce -> 
  const connectWallet = async () => {
    // init
    setLoading(true);
    setMsg("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(window as any).ethereum) return alert("Please install MetaMask");

    // Provider for the EVM wallet
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    // client 
    const signer = await provider.getSigner();

    const addr = await signer.getAddress();

    

    // send request to get Nonce and transaction timestamp (addr as payload)
    const resNonce = await fetch("https://api.agriethos.com/api/admin/request-nonce", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ walletAddress: addr }),
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

    const resLogin = await fetch("https://api.agriethos.com/api/admin/wallet-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address: addr, signature }),
    }); 
    const loginData = await resLogin.json();
    const {admin} = await loginData.data
    if(!resLogin.ok || loginData.error! || !nonce){
      setMsg(loginData.error || "Login failed... try again");
      console.error('Backend error:', loginData.error || loginData.message);
      setLoading(false);
      return;
    }
    if (loginData.success && admin.role === "admin") {
      console.log("✅ Login successful!");
        setLoading(false);
        setSuccess("sucess")
        setAddress(admin.walletAddress);
        console.log(address)
        console.log(admin)
        setSuccessSub(true);
        setAdminId(admin._id)
        setUser(admin)
        console.log(admin)
      router.replace("/dashboard/admin")
        
    } else {
      setMsg(loginData.error || "Login failed... try again");
      setLoading(false);
      
    }
  };



  return (
    <div className='flex w-full'>
      <div className='w-full h-screen object-cover hidden lg:block bg-black'>
         <Image src={"/static/auth.jpg"} width={500} height={500} className='w-full h-screen object-cover hidden lg:block opacity-90'  loading='lazy' alt='alt-image' />
      </div>
     
  <div className="h-screen w-full flex flex-col gap-1 bg-white items-center justify-center text-black p-5">
      {/* Display Element */}
      <div className='flex flex-col gap-5 h-full  mt-[-200px] max-w-[500px] w-full items-center justify-center'>
    <Image src={"/icons/logo.svg"} alt="logo" width={46} height={61.5} />
    <h2 className="text-3xl">Admin</h2>
    <div className='italic'>Sign in to grow trust with every harvest.</div>
    <button
      onClick={connectWallet}
      className="px-4 mt-5 w-full py-2 bg-primary-600 text-black rounded"
    >
      {loading && success !== "successful"?<Loader />: !loading && success === "success"?"Login successful": <div className='flex items-center justify-center gap-1'><div>Connect with Metamask</div><Image src={"/icons/metamask.png"} alt="metamask" width={18} height={14} /></div>}
    </button>
      </div> 
    {successSub && <Alert message='Logged in successful ... redirecting' onClose={()=> setSuccessSub(false)} color='text-green-800' background='bg-green-100'/>}
    {msg && <p className="text-red-600 mt-2">{msg}</p>}
  </div>
    </div>
  
  );
}
