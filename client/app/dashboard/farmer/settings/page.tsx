"use client"
import Image from "next/image";

import { useEffect, useState } from "react";


import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { useNavContext } from "../NavContext";
import { useAuth } from "@/app/Context/AuthContext";

import { CiMail } from "react-icons/ci";
import { useRouter } from "next/navigation";

import { FiEye, FiEyeOff } from "react-icons/fi";
import Alert from "@/app/components/alert";

dayjs.extend(relativeTime);




export default function Home() {
  

  const [loading, setLoading] = useState(false);
 const {setCurrentPage,setMobileDisplay} = useNavContext();
 const [msg, setMsg] = useState<string>('');
 const [success, setSuccess] = useState<string>('');
 const [successSub, setSuccessSub] = useState<boolean>(false);
 const [warning , setWarning]= useState<boolean>(false);
 const { address, isLoginStatusLoading,newUser,email,user} = useAuth();
 const [displayLogout,setDisplayLogout] = useState<boolean>(false);
 const [viewPass, setViewPass] = useState<boolean>(false);
 const [viewNewPass, setViewNewPass] = useState<boolean>(false);
 const [strength, setStrength] = useState<string>('');
 const [form, setForm] = useState({  password: '', newPassword: '' });
//  const [error, setError] = useState<string>('');
const router = useRouter();

   // Route protection
    useEffect(() => {
    if (!isLoginStatusLoading  && !email ) {router.push('/auth')}
    if(user && newUser ==="true"){router.push('/onboard')}
  }, [email,isLoginStatusLoading,router,user,newUser])
  
    useEffect(()=>{
          setCurrentPage("settings");
          setMobileDisplay(false);
        
        },[setCurrentPage,setMobileDisplay])

        if (!isLoginStatusLoading && !address && !email ) {router.push('/auth')}
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
        
 // function for the email auth
 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (name === 'newPassword') {
      checkPasswordStrength(value);
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

  
//   const connectWallet = async () =>{
//         if (!(window as any).ethereum) return alert("Please install MetaMask");
      
//           // Provider for the EVM wallet
//           const provider = new ethers.BrowserProvider((window as any).ethereum);
//           // client 
//           const signer = await provider.getSigner();
      
//           const addr = await signer.getAddress();
  
//            // send request to get Nonce and transaction timestamp (addr as payload)
//       const resNonce = await fetch("http://localhost:5000/api/auth/request-nonce", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ address: addr }),
//       });
//      // Parse Nonce data
//       const { nonce, timestamp } = await resNonce.json();
//       console.log(nonce)
  
//       const message = `Welcome to AgriEthos 🌱
  
//   Sign this message to verify you own this wallet and authenticate securely.
  
//   Wallet Address: ${addr}
//   Nonce: ${nonce}
//   Timestamp: ${timestamp}
  
//   This request will not trigger a blockchain transaction or cost any gas.
  
//   Only sign this message if you trust AgriEthos.
//     `;
//     console.log(addr,nonce,timestamp)
//       const signature = await signer.signMessage(message);
  
//       const resLogin = await fetch("http://localhost:5000/api/auth/wallet-login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ address: addr, signature }),
//       }); 
//       const loginData = await resLogin.json();
//       const {address,farmerId,newUser,userPack} = await loginData.data
//       if (loginData.success) {
//         console.log("✅ Login successful!");
        
//           setAddress(address);
        
        
//       } else {
//         console.log(loginData.error || "Login failed.");
        
//       }
      
//     }


const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    // setError('');
    setSuccess('');
    setLoading(true)
    const { password, newPassword } = form;

    if (!password || !newPassword) {
      // setError('All fields are required.');
      return;
    }


    try {
      const res = await fetch('http://localhost:5000/api/auth/changePass/'+(user && user._id), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword, prevPassword:password}),
      });

      const data = await res.json();

      if (!res.ok){
        console.log(data.message)
        setMsg(data.message);
        throw new Error(data.message || 'Something went wrong');
     
        }
        setSuccessSub(true);
        console.log("Update success111111111111111")
        setLoading(false);
      setSuccess('Update successful!');
      setForm(prev =>{
        prev.password = "";
        prev.newPassword = "";
        return prev;
      })
      router.refresh()
       
    } catch (err) {
      // setError(err.message);
      console.log(err);
    }
  };

  return (
 
<main className=" w-full bg-white ">
<div className="text-sm md:text-md min-h-screen px-[35px] py-5 lg:py-[80px] bg-white text-black w-full ">
   <div className='flex gap-2 items-center w-full justify-end lg:hidden my-2'>
                     
                                              {/* Email */}
                                              { email?   <button className='px-2 py-1 border-2  border-[#a5eb4c] rounded-2xl  lg:block text-grey-800'>
                                          
                                          <div className='flex items-center justify-center gap-2 relative' onClick={()=> setDisplayLogout(!displayLogout)}>  <div className='text-grey-800 text-lg'><CiMail /></div> <div>{email && email.slice(0,6)}...{email&&email.slice(-4)}</div>
                                          <div className='absolute bottom-[-150%] w-full flex flex-col bg-grey-100'>
                                          
                                          </div>
                                          </div> 
                                             
                                             </button>:<button className='px-2 py-1 border-2 w-full border-[#a5eb4c] rounded-2xl  lg:block text-grey-800'><div className='flex items-center justify-center gap-2 relative' >Add Email</div></button>}
                                  
                  <Image src={"/icons/bell.svg"} alt="bell" width={24} height={24} className="cursor-pointer hidden lg:block" />
                  <Image src={"/icons/burger.svg"} alt="menu" width={40} height={40} className="cursor-pointer lg:hidden"  onClick={()=>setMobileDisplay(true)}/>
                         </div>
                  {/* Header and Descriptive Text */}
                  <div className='flex items-center justify-between'>
               <div className='flex flex-col gap-2 items-start justify-center'>
                  <div className='text-xl font-semibold lg:font-normal lg:text-2xl'>
                   Settings
                  </div>
                  <div className='text-grey-600 hidden lg:block'>
                    Manage user settings
                  </div>
                 
                 </div>
                    <div className='lg:flex gap-2 items-center hidden'>
                    <div className='px-2 py-1 border  border-gray-500 text-gray-600 rounded-full cursor-pointer hidden lg:block' onClick={()=> window.location.reload()}>
               Reload
              </div>
                                                {/* { address?   <button className='px-2 py-1 border-2 w-full border-[#a5eb4c] rounded-2xl  lg:block text-grey-800'>
                                                                  
                                                                   <div className='flex items-center justify-center gap-2 relative' onClick={()=> setDisplayLogout(!displayLogout)}>  <div className='text-grey-800 text-lg'><BsWallet /></div> <div>{address && address.slice(0,6)}...{address&&address.slice(-4)}</div>
                                                                   <div className='absolute bottom-[-150%] w-full flex flex-col bg-grey-100'>
                                                                      { displayLogout && address && <div className='text-black bg-primary-500 py-1 px-2' onClick={()=> setAddress(null)}>
                                                                         Disconnect
                                                                       </div>}
                                                                   </div>
                                                                   </div> 
                                                                      
                                                                      </button>:<button className='px-2 py-1 border-2 w-full border-[#a5eb4c] rounded-2xl  lg:block text-grey-800'><div  onClick={()=>connectWallet()} className='flex items-center justify-center gap-2 relative' >Connect Wallet</div></button>} */}
                                                                      {/* Email */}
                                                                      { email?   <button className='px-2 py-1 border-2 w-full border-[#a5eb4c] rounded-2xl  lg:block text-grey-800'>
                                                                  
                                                                  <div className='flex items-center justify-center gap-2 relative' onClick={()=> setDisplayLogout(!displayLogout)}>  <div className='text-grey-800 text-lg'><CiMail /></div> <div>{email && email.slice(0,6)}...{email&&email.slice(-4)}</div>
                                                                  <div className='absolute bottom-[-150%] w-full flex flex-col bg-grey-100'>
                                                                  
                                                                  </div>
                                                                  </div> 
                                                                     
                                                                     </button>:<button className='px-2 py-1 border-2 w-full border-[#a5eb4c] rounded-2xl  lg:block text-grey-800'><div className='flex items-center justify-center gap-2 relative' >Add Email</div></button>}
                                                          
                                          <Image src={"/icons/bell.svg"} alt="bell" width={24} height={24} className="cursor-pointer hidden lg:block" />
                                          <Image src={"/icons/burger.svg"} alt="burger" width={70} height={70} className="cursor-pointer t lg:hidden" onClick={()=>setMobileDisplay(true)}/>
                                                 </div>
                  </div>
       
   {/* Header */}
    <div className='flex flex-col gap-2 my-8'>
           <div className='text-xl font-semibold lg:font-normal lg:text-2xl'>
             Change password
           </div>
          </div>
       {/* Section One */}
       <section className=' w-full lg:w-96 flex flex-col gap-2'>
        
        {/* item */}
        <div className="flex flex-col gap-1">
        {form.password && <div className="text-grey-600 text-xs">
       Old Password :
        </div>}
    <div className=' flex gap-2 items-center  w-full  border boder-gray-500 text-black rounded'>
<input type={viewPass?'text':'password'} className='w-full bg-white p-2 outline-none px-4 ' name="password"
            placeholder="Old password"
            value={form.password}
            onChange={handleChange} required />

<div className='text-grey-400 px-2' onClick={()=>setViewPass(pre=>!pre)}>
{!viewPass ? <FiEye />: <FiEyeOff />}
</div>
    </div></div>
       {/* item */}
       <div className="flex flex-col gap-1">
   {form.newPassword && <div className="text-grey-600 text-xs">
       New Password :
        </div>}
        <div className=' flex gap-2 items-center  w-full  border boder-gray-500 text-black rounded'>
<input type={viewNewPass?'text':'password'} className='w-full bg-white p-2 outline-none px-4 ' name="newPassword"
            placeholder="New Password"
            value={form.newPassword}
            onChange={handleChange} required />
<div className='text-grey-400 px-2' onClick={()=>setViewNewPass(pre=>!pre)}>
{!viewPass ? <FiEye />: <FiEyeOff />}
</div>
    </div> {form.newPassword && (
            <p className={`text-sm ${getStrengthColor()}`}>
              Password strength: {strength}
            </p>
          )}
            <button
      className="px-4 mt-5 w-full py-2 bg-primary-600 text-black rounded"  onClick={handleSubmit}
    >
      {!loading && success === "success"?"Login successful": <div className='flex items-center justify-center gap-2'><div>Continue</div></div>}
    </button>
          </div>
          {successSub && <Alert message={success} color='text-green-800' background='bg-green-100' onClose={()=> setSuccessSub(false)}/>}
    {warning&& <Alert message='' color='text-yellow-800' background='bg-yellow-100' onClose={()=> setWarning(false)}/>}
    {msg && <p className="text-red-600 mt-2">{msg}</p>}
    {/* {error && <p className="text-red-600 mt-2">{error}</p>} */}
     </section>
{/* ############################################################################################### */}


</div>

        
</main>

  );
}

