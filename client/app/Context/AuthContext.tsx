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
}

const AuthContext = createContext<AuthContextType>({
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
    router.push('/auth');
  };
  // handle farmer ID
const handleNewUser = ( newPerson: string | null) => {
 
  setNewUser(newPerson);

  if (newPerson) localStorage.setItem('newUser', newPerson)
    else localStorage.removeItem('newUser')
}
 
  return (<AuthContext.Provider value={{ address, setAddress: handleSetAddress, farmerId, setFarmerId:handleSetId, logout, isLoginStatusLoading, newUser, setNewUser:handleNewUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
