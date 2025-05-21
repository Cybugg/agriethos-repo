'use client';

import { useAuth } from '../Context/AuthContext';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Loader from '../components/loader';
import { useRouter } from "next/navigation";
import Alert from '../components/alert';

export default function Page() {
  const [activeTab, setActiveTab] = useState<"wallet" | "email" | "register">("wallet");
  const [authOpLoading, setAuthOpLoading] = useState(false);
  
  const { 
    user,
    loading: contextLoading,
    isLoginStatusLoading,
    error: contextError,
    connectWallet: connectWalletFromContext,
    loginWithEmail,
    registerWithEmail
  } = useAuth();
  
  const [msg, setMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');
  
  // For email auth forms
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const router = useRouter();

  // Check authentication status and redirect if needed
  useEffect(() => {
    if (isLoginStatusLoading) {
      return; // Wait for auth state to load
    }

    if (user) {
      // User is authenticated, redirect based on onboarding status
      if (user.newUser === "false") {
        router.replace("/dashboard/farmer");
      } else if (user.newUser === "true") {
        router.replace("/onboard");
      }
    }
  }, [isLoginStatusLoading, user, router]);

  const handleWalletLogin = async () => {
    setAuthOpLoading(true);
    setMsg("");
    setSuccessMsg("");
    
    try {
      await connectWalletFromContext();
      // Redirection handled by auth context
      setSuccessMsg("Wallet connection successful!");
    } catch (err: any) {
      setMsg(err.message || "Wallet login failed");
    } finally {
      setAuthOpLoading(false);
    }
  };
  
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthOpLoading(true);
    setMsg("");
    setSuccessMsg("");
    
    try {
      await loginWithEmail(email, password);
      // Redirection handled by auth context
      setSuccessMsg("Login successful!");
    } catch (error: any) {
      setMsg(error.message || "Login failed");
    } finally {
      setAuthOpLoading(false);
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthOpLoading(true);
    setMsg("");
    setSuccessMsg("");
    
    if (password !== confirmPassword) {
      setMsg("Passwords do not match");
      setAuthOpLoading(false);
      return;
    }
    
    try {
      await registerWithEmail(email, password, confirmPassword);
      // Redirection handled by auth context
      setSuccessMsg("Registration successful!");
    } catch (error: any) {
      setMsg(error.message || "Registration failed");
    } finally {
      setAuthOpLoading(false);
    }
  };

  // Show loading state when checking authentication
  if (isLoginStatusLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  // If user is authenticated but not yet redirected
  if (user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div>Redirecting...</div>
      </div>
    );
  }

  // Auth page UI for unauthenticated users
  return (
    <div className='flex w-full'>
      <div className='w-full h-screen object-cover hidden lg:block bg-black'>
        <Image src={"/static/auth.jpg"} width={500} height={500} className='w-full h-screen object-cover hidden lg:block opacity-90' loading='lazy' alt='alt-image' />
      </div>
     
      <div className="h-screen w-full flex flex-col gap-1 bg-white items-center justify-center text-black">
        <div className='flex flex-col gap-5 h-full mt-[-200px] max-w-[500px] w-full items-center justify-center'>
          <Image src={"/icons/logo.svg"} alt="logo" width={46} height={61.5} />
          <h2 className="text-3xl">Welcome to Agriethos</h2>
          <div className='italic'>Sign in to grow trust with every harvest.</div>
          
          <div className="flex border-b border-gray-200 w-full justify-center mt-2">
            <button
              className={`px-4 py-2 font-medium ${activeTab === "wallet" ? "border-b-2 border-primary-600 text-primary-600" : "text-gray-500"}`}
              onClick={() => setActiveTab("wallet")}
            >
              Wallet Login
            </button>
            <button
              className={`px-4 py-2 font-medium ${activeTab === "email" ? "border-b-2 border-primary-600 text-primary-600" : "text-gray-500"}`}
              onClick={() => setActiveTab("email")}
            >
              Email Login
            </button>
            <button
              className={`px-4 py-2 font-medium ${activeTab === "register" ? "border-b-2 border-primary-600 text-primary-600" : "text-gray-500"}`}
              onClick={() => setActiveTab("register")}
            >
              Register
            </button>
          </div>

          {activeTab === "wallet" && (
            <button
              onClick={handleWalletLogin}
              className="px-4 mt-5 w-full py-2 bg-primary-600 text-black rounded"
              disabled={authOpLoading || contextLoading}
            >
              {(authOpLoading || contextLoading) ? <Loader /> : 
                <div className='flex items-center justify-center gap-1'>
                  <div>Connect with Metamask</div>
                  <Image src={"/icons/metamask.png"} alt="metamask" width={18} height={14} />
                </div>
              }
            </button>
          )}

          {activeTab === "email" && (
            <form onSubmit={handleEmailLogin} className="w-full mt-4 space-y-4">
              <div>
                <input
                  type="email" placeholder="Email address"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-600"
                  value={email} onChange={(e) => setEmail(e.target.value)} required
                />
              </div>
              <div>
                <input
                  type="password" placeholder="Password"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-600"
                  value={password} onChange={(e) => setPassword(e.target.value)} required
                />
              </div>
              <button 
                type="submit" 
                className="px-4 w-full py-2 bg-primary-600 text-black rounded" 
                disabled={authOpLoading || contextLoading}
              >
                {(authOpLoading || contextLoading) ? <Loader /> : "Sign in with Email"}
              </button>
            </form>
          )}

          {activeTab === "register" && (
            <form onSubmit={handleRegister} className="w-full mt-4 space-y-4">
              <div>
                <input
                  type="email" placeholder="Email address"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-600"
                  value={email} onChange={(e) => setEmail(e.target.value)} required
                />
              </div>
              <div>
                <input
                  type="password" placeholder="Password"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-600"
                  value={password} onChange={(e) => setPassword(e.target.value)} required
                />
              </div>
              <div>
                <input
                  type="password" placeholder="Confirm Password"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-600"
                  value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                />
              </div>
              <button 
                type="submit" 
                className="px-4 w-full py-2 bg-primary-600 text-black rounded" 
                disabled={authOpLoading || contextLoading}
              >
                {(authOpLoading || contextLoading) ? <Loader /> : "Register with Email"}
              </button>
            </form>
          )}
        </div>
        
        {successMsg && 
          <Alert 
            message={successMsg}
            color='text-green-800' 
            background='bg-green-100' 
            onClose={() => setSuccessMsg('')}
          />
        }
        
        {(msg || contextError) && 
          <Alert 
            message={msg || contextError || ""}
            color='text-red-800'
            background='bg-red-100'
            onClose={() => {
              setMsg('');
            }}
          />
        }
      </div>
    </div>
  );
}
