'use client'
import { useRouter } from 'next/navigation';
import React, {createContext, useContext, useState, useEffect, ReactNode, Children} from "react";

interface AuthContextType {
  address: string | null
  setAddress: (address: string | null) => void
  isLoginStatusLoading:boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  address: null,
  setAddress: () => {},
  logout: () => {},
  isLoginStatusLoading: true, 
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null)
  const [isLoginStatusLoading,setLoginStatusLoading] = useState<boolean>(true);
  const router = useRouter();

  //  Get stored address if stored in local storage
  useEffect(() => {
    const stored = localStorage.getItem('walletAddress')
    setLoginStatusLoading(false);
    if (stored) setAddress(stored)
  }, [])

  // handle wallet address
  const handleSetAddress = (addr: string | null) => {
    setAddress(addr)
    if (addr) localStorage.setItem('walletAddress', addr)
    else localStorage.removeItem('walletAddress')
  }

  const logout = () => {
    setAddress(null);
    router.push('/login');
  };

  return (<AuthContext.Provider value={{ address, setAddress: handleSetAddress, logout, isLoginStatusLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
