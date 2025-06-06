'use client'
import { useRouter } from 'next/navigation';
import React, {createContext, useContext, useState, useEffect} from "react";

interface AuthContextType {
 

  agentId: string | null
  setAgentId: (agentId: string | null) => void
  address: string | null
  setAddress: (address: string | null) => void
  isLoginStatusLoading:boolean
  logout: () => void
  user: User | null
  setUser: (user: User | null) => void
}

export interface User {
  agentId: string;
  walletAddress: string;
  email: string;
  nounce:string;
 
  role:string;
  [key: string]: string;
}

const AuthContext = createContext<AuthContextType >({
  user:  null,
  setUser: () => {},


  address: null,
  setAddress: () => {},
  agentId: null,
  setAgentId: () => {},
  logout: () => {},
  isLoginStatusLoading: true, 
})

export const AgentAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [agentId, setAgentId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoginStatusLoading,setLoginStatusLoading] = useState<boolean>(true);
  const router = useRouter();

  //  Get stored address if stored in local storage
  useEffect(() => {
    const storedAddr = localStorage.getItem('agentAddress')
    setLoginStatusLoading(false);
    if (storedAddr) setAddress(storedAddr)
      const storedId = localStorage.getItem('agentId')
      if(storedId) setAgentId(storedId)
      const storedagentPack = localStorage.getItem('agentPack')
    if (storedagentPack) setUser(JSON.parse(storedagentPack))
  }, [])

  // handle wallet address
  const handleSetAddress = (addr: string | null) => {
    setAddress(addr);
  
    if (addr) localStorage.setItem('agentAddress', addr)
    else localStorage.removeItem('agentAddress')

  }

// handle agent ID
const handleSetId = ( id: string | null) => {
 
  setAgentId(id);

  if (id) localStorage.setItem('agentId', id)
    else localStorage.removeItem('agentId')
}
  const logout = () => {
    setAddress(null);
    setAgentId(null);
    setUser(null);
    localStorage.removeItem("agentPack")
    localStorage.removeItem("agentId")
    localStorage.removeItem("agentAddress")
    localStorage.removeItem("newUser")
    localStorage.removeItem("agentPack")
    router.replace('/auth');
  };

   // handle user-pack 
const handleAgentPack = ( agentPack: User | null) => {
 
  setUser(agentPack);

  if (agentPack) localStorage.setItem('agentPack', JSON.stringify(agentPack))
    else localStorage.removeItem('newUser')
}
  return (<AuthContext.Provider value={{ address, setAddress: handleSetAddress, agentId, setAgentId:handleSetId, logout, isLoginStatusLoading,user, setUser:handleAgentPack }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAgentAuth = () => useContext(AuthContext)
