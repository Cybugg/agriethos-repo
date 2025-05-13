'use client'
import { useRouter } from 'next/navigation';
import React, {createContext, useContext, useState, useEffect, ReactNode, Children} from "react";

interface AuthContextType {
  newUser: string | null
  setNewUser: (person: string | null) => void
  farmerId: string | null
  setFarmerId: (farmerId: string | null) => void
  address: string | null
  setAddress: (address: string | null) => void
  isLoginStatusLoading:boolean
  logout: () => void
  user: User | null
  setUser: (user: User | null) => void
}

export interface User {
  farmerId: string;
  walletAddress: string;
  email: string;
  nounce:string;
  newUser:string
  role:string;
  [key: string]: any;
}

const AuthContext = createContext<AuthContextType >({
  user:  null,
  setUser: () => {},
  newUser: null,
  setNewUser: () => {},
  address: null,
  setAddress: () => {},
  farmerId: null,
  setFarmerId: () => {},
  logout: () => {},
  isLoginStatusLoading: true, 
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [farmerId, setFarmerId] = useState<string | null>(null);
  const [newUser, setNewUser] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoginStatusLoading,setLoginStatusLoading] = useState<boolean>(true);
  const router = useRouter();

  //  Get stored address if stored in local storage
  useEffect(() => {
    const storedAddr = localStorage.getItem('walletAddress')
    setLoginStatusLoading(false);
    if (storedAddr) setAddress(storedAddr)
      const storedId = localStorage.getItem('farmerId')
    if (storedId) setFarmerId(storedId)
      const storedUserType = localStorage.getItem('newUser')
    if (storedUserType) setNewUser(storedUserType)
      const storedUserPack = localStorage.getItem('userPack')
    if (storedUserPack) setNewUser(JSON.parse(storedUserPack))
  }, [])

  // handle wallet address
  const handleSetAddress = (addr: string | null) => {
    setAddress(addr);
  
    if (addr) localStorage.setItem('walletAddress', addr)
    else localStorage.removeItem('walletAddress')

  }

// handle farmer ID
const handleSetId = ( id: string | null) => {
 
  setFarmerId(id);

  if (id) localStorage.setItem('farmerId', id)
    else localStorage.removeItem('farmerId')
}
  const logout = () => {
    setAddress(null);
    setFarmerId(null);
    localStorage.removeItem("farmerId")
    localStorage.removeItem("walletAddress")
    localStorage.removeItem("newUser")
    router.replace('/auth');
  };
  // handle farmer ID
const handleNewUser = ( newPerson: string | null) => {
 
  setNewUser(newPerson);

  if (newPerson) localStorage.setItem('newUser', newPerson)
    else localStorage.removeItem('newUser')
}
   // handle user-pack 
const handleUserPack = ( userPack: User | null) => {
 
  setUser(userPack);

  if (userPack) localStorage.setItem('userPack', JSON.stringify(userPack))
    else localStorage.removeItem('newUser')
}
  return (<AuthContext.Provider value={{ address, setAddress: handleSetAddress, farmerId, setFarmerId:handleSetId, logout, isLoginStatusLoading, newUser, setNewUser:handleNewUser,user, setUser:handleUserPack }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
