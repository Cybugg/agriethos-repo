'use client';

import { useAuth } from '../Context/AuthContext';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Image from 'next/image';
import Loader from '../components/loader';
import {useRouter} from "next/navigation";
import Alert from '../components/alert';
import Link from 'next/link';
import { FiEye, FiEyeOff } from 'react-icons/fi';



export default function Page() {
  const [loading, setLoading] = useState(false);
  const { setAddress ,setFarmerId,setNewUser, farmerId , address,newUser,user,setUser, email} = useAuth();
  const [msg, setMsg] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [successSub, setSuccessSub] = useState<boolean>(false);
  const [warning , setWarning]= useState<boolean>(false);
  const [viewPass, setViewPass] = useState<boolean>(false);
  const [viewConfirmPass, setViewConfirmPass] = useState<boolean>(false);
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState<string>('');
  const [strength, setStrength] = useState<string>('');
  const router = useRouter();




     // Autopass already logged in users ...
     useEffect(()=>
      {
        if (address || farmerId || email){router.replace("/dashboard/farmer/")}
       
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
    const resNonce = await fetch("https://agriethos-9wy5.onrender.com/api/auth/request-nonce", {
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

    const resLogin = await fetch("https://agriethos-9wy5.onrender.com/api/auth/wallet-login", {
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

  // function for the email auth
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password: string) => {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    const mediumRegex = /^(?=.*[a-z])(?=.*\d).{6,}$/;

    if (strongRegex.test(password)) {
      setStrength('Strong');
    } else if (mediumRegex.test(password)) {
      setStrength('Medium');
    } else {
      setStrength('Weak');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    setError('');
    setSuccess('');

    const { email, password, confirmPassword } = form;

    if (!email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const res = await fetch('https://agriethos-9wy5.onrender.com/api/auth/email-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok){
        console.log(data.message)
        setMsg(data.message);
        throw new Error(data.message || 'Something went wrong');
     
        }
        setSuccessSub(true);
        console.log("Registeration success")
        setLoading(false);
      setSuccess('Sign up successful!');
       // in develoment
       localStorage.setItem("emailToVerify",form.email);
      router.replace("/registered")
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getStrengthColor = () => {
    switch (strength) {
      case 'Strong':
        return 'text-green-600';
      case 'Medium':
        return 'text-yellow-500';
      case 'Weak':
        return 'text-red-500';
      default:
        return 'text-gray-500';
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
    <h2 className="text-3xl">Welcome to Agriethos</h2>
    <div className='italic'>Be a part to grow trust with every harvest.</div>
    <div className='flex gap-2 text-xs text-grey-600'>
      <div>
        Already have an account? 
      </div>
      <Link href={"/auth"} className='text-primary-600 underline'>
        Log in
      </Link>
    </div>
    <div className='flex flex-col gap-3 w-full'>
 <button
      onClick={()=>setWarning(true)}
      className="px-4 mt-5 w-full py-2 border  text-black rounded"
    >
      {loading && success !== "successful"?<Loader />: !loading && success === "success"?"Login successful": <div className='flex items-center justify-center gap-2'><Image src={"/icons/metamask.png"} alt="metamask" width={18} height={14} /><div>Connect with Metamask</div></div>}
    </button>
    {/* <button
      
      className="px-4  w-full py-2 border boder-gray-500 text-black rounded"
    >
      { !loading && success === "success"?"Login successful": <div className='flex items-center justify-center gap-1'><Image src={"/icons/google.svg"} alt="google" width={18} height={14} /><div>Sign in with Google</div></div>}
    </button> */}
    {/* Divider */}
    <div className='  w-full py-2 flex items-center justify-between gap-3 text-black rounded'>
<div className='w-full border border-gray-200'>

</div>
<div className='text-grey-500'>
OR
</div>
<div className='w-full border border-gray-200'>

</div>
    </div>
    {/* Email Auth */}
    <div className=' w-full border boder-gray-500 text-black rounded'>
<input name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange} className='w-full p-2 px-4 outline-none'  required />
    </div>
   
    <div className=' flex gap-2 items-center  w-full  border boder-gray-500 text-black rounded'>
<input type={viewPass?'text':'password'} className='w-full bg-white p-2 outline-none px-4 ' name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange} required />
<div className='text-grey-400 px-2' onClick={()=>setViewPass(pre=>!pre)}>
{!viewPass ? <FiEye />: <FiEyeOff />}
</div>
    </div>
    {form.password && (
            <p className={`text-sm ${getStrengthColor()}`}>
              Password strength: {strength}
            </p>
          )}
    <div className=' flex gap-2 items-center  w-full border boder-gray-500 text-black rounded'>
<input type={viewConfirmPass?'text':'password'} className='w-full p-2 outline-none px-4 bg-white' name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange} required />
<div className='text-grey-400 px-2' onClick={()=>setViewConfirmPass(pre=>!pre)}>
{!viewPass ? <FiEye />: <FiEyeOff />}
</div>
    </div>
    {form.password && form.confirmPassword && form.password !== form.confirmPassword && (
            <p className={`text-sm text-red-500`}>
             Passwords do not match
            </p>
          )}
    <button
      className="px-4 mt-5 w-full py-2 bg-primary-600 text-black rounded"  onClick={handleSubmit}
    >
      {!loading && success === "success"?"Login successful": <div className='flex items-center justify-center gap-2'><div>Continue</div></div>}
    </button>

    </div>
   
      </div> 
    {successSub && <Alert message='Operation successful ...redirecting' color='text-green-800' background='bg-green-100' onClose={()=> setSuccessSub(false)}/>}
    {warning&& <Alert message='Sorry, you cannot authenticate with this method, currently...' color='text-yellow-800' background='bg-yellow-100' onClose={()=> setWarning(false)}/>}
    {msg && <p className="text-red-600 mt-2">{msg}</p>}
    {error && <p className="text-red-600 mt-2">{error}</p>}
  </div>
    </div>
  
  );
}
