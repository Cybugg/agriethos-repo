'use client';

import { useAuth } from '../Context/AuthContext';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Image from 'next/image';
import Loader from '../components/loader';
import {useRouter} from "next/navigation";
import Alert from '../components/alert';
import Link from 'next/link';



export default function Page() {
  const [loading, setLoading] = useState(false);
  const { setAddress ,setFarmerId,setNewUser, farmerId , address,newUser,user,setUser} = useAuth();
  const [msg, setMsg] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [successSub, setSuccessSub] = useState<boolean>(false)
  const router = useRouter();




  useEffect(()=>
    {
      if (address && farmerId){router.replace("/dashboard/farmer/")}
     
    },[address,farmerId]
  )

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
    const {address,farmerId,newUser,userPack} = await loginData.data
    if (loginData.success) {
      console.log("✅ Login successful!");
        setLoading(false);
        setSuccess("sucess")
        setAddress(address);
        setFarmerId(farmerId);
        setNewUser(newUser);
        setSuccessSub(true);
        setUser(userPack)
        console.log(address,farmerId)
      if(newUser === "false")  router.replace("/dashboard/farmer")
        else if (newUser === "true") router.replace("/onboard")
    } else {
      setMsg(loginData.error || "Login failed.");
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
    <Image src={"/icons/verified.png"} alt="logo" width={46} height={61.5} />
    <h2 className="text-3xl">You have been registered</h2>
    <div className=' text-center'>You will need to sign-in in to proceed <br/>
    </div>
    <button
     
      className="px-4 mt-5 w-full py-2 bg-primary-600 text-black rounded"
    >
      {loading && success !== "successful"?<Loader />: !loading && success === "success"?"Login successful": <Link href={"/auth"} className='flex items-center justify-center gap-1'><div>Get started</div></Link>}
    </button>
      </div> 
    {successSub && <Alert message='Logged in successful ... redirecting' color='text-green-800' background='bg-green-100' onClose={()=> setSuccessSub(false)}/>}
    {msg && <p className="text-red-600 mt-2">{msg}</p>}
  </div>
    </div>
  
  );
}
