'use client';

import { useAuth } from '../Context/AuthContext';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Loader from '../components/loader';
import {useRouter} from "next/navigation";
import Alert from '../components/alert';
import Link from 'next/link';
import { FiEye, FiEyeOff } from 'react-icons/fi';



export default function Page() {
  const [loading, setLoading] = useState(false);
  const { setFarmerId,setNewUser, farmerId , setUser,setEmail, email} = useAuth();
  const [msg, setMsg] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [successSub, setSuccessSub] = useState<boolean>(false);
  const [warning , setWarning]= useState<boolean>(false);
  const [viewPass, setViewPass] = useState<boolean>(false);
  const [form,setForm]=useState({email:"",password:""})
  const router = useRouter();

  
  // Autopass already logged in users ...
  useEffect(()=>
    {
      if ( farmerId && email){router.replace("/dashboard/farmer/")}
     
    },[email,farmerId, router]
  )

  // Change event function for the form
  const handleChange  = (e:React.ChangeEvent<HTMLInputElement>)=>{
    const {name,value} = e.target;
    setForm(prev => ({...prev,[name]:value}))
  }

// log in function using email

const signInWithEmail = async()=>{ 
 
    try{
      const res = await fetch("https://api.agriethos.com/api/auth/email-login",{
        headers:{"Content-Type":"application/json"},
        method:"POST",
        body:JSON.stringify({email:form.email,password:form.password})
      })
      const resJSON = await res.json();
      const {email,farmerId,newUser,userPack} = await resJSON.data;

      if(!resJSON.sucess){
        console.log("Cannot login user")
       setError(true)
       setMsg(resJSON.message || "Error while signing in")
        return;
      }
      if ( resJSON.success) {
        console.log("✅ Login successful!");
          setEmail(email)
          setLoading(false);
          setSuccess("sucess")
          setFarmerId(farmerId);
          setNewUser(newUser);
          setSuccessSub(true);
          setUser(userPack)
          console.log(email,farmerId,newUser)
        if(newUser === "false")  router.replace("/dashboard/farmer")
          else if (newUser === "true") router.replace("/onboard")
      } else {
        setMsg(resJSON.message || "Login failed.");
        setLoading(false);
        setError(true);
      }
    }
    catch(err){
      console.log(err,"Actually showing the errors");
      setError(true)
       setMsg( "Something went wrong")
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
    <div className='italic'>Sign in to grow trust with every harvest.</div>
    <div className='flex gap-2 text-xs text-grey-600'>
      <div>
        Don&apos;t have an account? 
      </div>
      <Link href={"/register"} className='text-primary-600 underline'>
        Register
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
      {!loading && success === "success"?"Login successful": <div className='flex items-center justify-center gap-1'><Image src={"/icons/google.svg"} alt="google" width={18} height={14} /><div>Sign in with Google</div></div>}
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
<input type='email' value={form.email} onChange={handleChange} name='email' className='w-full p-2 px-4 outline-none' placeholder='Email' required />
    </div>
    <div className=' flex gap-2 items-center  w-full  border boder-gray-500 text-black rounded'>
<input type={viewPass?'text':'password'} className='w-full p-2 outline-none px-4 ' placeholder='Password' value={form.password} onChange={handleChange} name='password'  required />
<div className='text-grey-400 px-2' onClick={()=>setViewPass(pre=>!pre)}>
{!viewPass ? <FiEye />: <FiEyeOff />}
</div>
    </div>
    <button
    onClick={()=> signInWithEmail()}
      className="px-4 mt-5 w-full py-2 bg-primary-600 text-black rounded"
    >
      { !loading && success === "success"?"Login successful": <div className='flex items-center justify-center gap-2'><div>Sign in</div></div>}
    </button>

    </div>
   
      </div> 
    {successSub && <Alert message='Logged in successfully ...redirecting' color='text-green-800' background='bg-green-100' onClose={()=> setSuccessSub(false)}/>}
    {warning&& <Alert message='Sorry, you cannot authenticate with this method, currently...' color='text-yellow-800' background='bg-yellow-100' onClose={()=> setWarning(false)}/>}
    {error&& <Alert message={"Error:Check credentials or network connection"} color='text-red-800' background='bg-red-100' onClose={()=> setError(false)}/>}
    {msg && <p className="text-red-600 mt-2">{msg}</p>}
  </div>
    </div>
  
  );
}
