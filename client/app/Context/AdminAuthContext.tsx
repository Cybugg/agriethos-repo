'use client'
import { useRouter } from 'next/navigation';
import React, {createContext, useContext, useState, useEffect, ReactNode, Children} from "react";

interface AuthContextType {
 

  adminId: string | null
  setAdminId: (adminId: string | null) => void
  address: string | null
  setAddress: (address: string | null) => void
  isLoginStatusLoading:boolean
  logout: () => void
  user: User | null
  setUser: (user: User | null) => void
}

export interface User {
  adminId: string;
  walletAddress: string;
  email: string;
  nounce:string;
 
  role:string;
  [key: string]: any;
}

const AuthContext = createContext<AuthContextType >({
  user:  null,
  setUser: () => {},


  address: null,
  setAddress: () => {},
  adminId: null,
  setAdminId: () => {},
  logout: () => {},
  isLoginStatusLoading: true, 
})

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoginStatusLoading,setLoginStatusLoading] = useState<boolean>(true);
  const router = useRouter();

  //  Get stored address if stored in local storage
  useEffect(() => {
    const storedAddr = localStorage.getItem('adminAddress')
    setLoginStatusLoading(false);
    if (storedAddr) setAddress(storedAddr)
      const storedId = localStorage.getItem('adminId')
  
      const storedAdminPack = localStorage.getItem('AdminPack')
    if (storedAdminPack) setUser(JSON.parse(storedAdminPack))
  }, [])

  // handle wallet address
  const handleSetAddress = (addr: string | null) => {
    setAddress(addr);
  
    if (addr) localStorage.setItem('adminAddress', addr)
    else localStorage.removeItem('adminAddress')

  }

// handle Admin ID
const handleSetId = ( id: string | null) => {
 
  setAdminId(id);

  if (id) localStorage.setItem('adminId', id)
    else localStorage.removeItem('adminId')
}
  const logout = () => {
    setAddress(null);
    setAdminId(null);
    localStorage.removeItem("adminId")
    localStorage.removeItem("adminAddress")
    localStorage.removeItem("newUser")
    localStorage.removeItem("AdminPack")
    router.replace('/auth');
  };

   // handle user-pack 
const handleAdminPack = ( AdminPack: User | null) => {
 
  setUser(AdminPack);

  if (AdminPack) localStorage.setItem('AdminPack', JSON.stringify(AdminPack))
    else localStorage.removeItem('newUser')
}
  return (<AuthContext.Provider value={{ address, setAddress: handleSetAddress, adminId, setAdminId:handleSetId, logout, isLoginStatusLoading,user, setUser:handleAdminPack }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAdminAuth = () => useContext(AuthContext)
