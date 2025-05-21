"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";

interface User {
  _id: string;
  walletAddress?: string;
  email?: string;
  newUser: string;
  role: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  loading: boolean;
  isLoginStatusLoading: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string, confirmPassword: string) => Promise<void>;
  updateUserStatus: (userId: string, newUserStatus: string) => Promise<void>;
  verifyAuth: () => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const API_BASE_URL = "http://localhost:5000/api";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoginStatusLoading, setIsLoginStatusLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [authInitialized, setAuthInitialized] = useState<boolean>(false);

  const router = useRouter();

  // Check for token in localStorage on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        
        if (storedToken) {
          setToken(storedToken);
          // Verify the token on server
          const isValid = await verifyStoredToken(storedToken);
          
          if (!isValid) {
            // If token is invalid, clear everything
            handleLogout();
          }
        } else {
          // No token found, clear everything
          setToken(null);
          setUser(null);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        // On error, clear everything
        handleLogout();
      } finally {
        setIsLoginStatusLoading(false);
        setAuthInitialized(true);
      }
    };

    initAuth();
  }, []);

  // Verify stored token with server
  const verifyStoredToken = async (storedToken: string): Promise<boolean> => {
    try {
      const data = await apiClient('/auth/verify', {
        headers: {
          Authorization: `Bearer ${storedToken}`
        }
      });
      
      if (data.success) {
        // Update token and user state
        setToken(data.data.token);
        setUser(data.data.user);
        localStorage.setItem("token", data.data.token);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Token verification error:", error);
      return false;
    }
  };

  // Public method to verify authentication
  const verifyAuth = async (): Promise<boolean> => {
    if (!token) return false;
    return await verifyStoredToken(token);
  };

  // Handle wallet connection and login
  const connectWallet = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (!(window as any).ethereum) {
        throw new Error("Please install MetaMask");
      }

      // Create provider and get signer
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      // Request nonce from server
      const nonceResponse = await fetch(`${API_BASE_URL}/auth/request-nonce`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
      
      if (!nonceResponse.ok) {
        const errorData = await nonceResponse.json();
        throw new Error(errorData.error || "Failed to get nonce");
      }
      
      const { nonce, timestamp } = await nonceResponse.json();

      // Sign message with nonce
      const message = `Welcome to AgriEthos 🌱

Sign this message to verify you own this wallet and authenticate securely.

Wallet Address: ${address}
Nonce: ${nonce}
Timestamp: ${timestamp}

This request will not trigger a blockchain transaction or cost any gas.

Only sign this message if you trust AgriEthos.`;

      const signature = await signer.signMessage(message);

      // Verify signature on server
      const loginResponse = await fetch(`${API_BASE_URL}/auth/wallet-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, signature }),
      });

      if (!loginResponse.ok) {
        const errorData = await loginResponse.json();
        throw new Error(errorData.error || "Login failed");
      }

      const loginData = await loginResponse.json();
      
      if (!loginData.success) {
        throw new Error(loginData.message || "Login failed");
      }

      // Save auth data
      setToken(loginData.data.token);
      setUser(loginData.data.user);
      localStorage.setItem("token", loginData.data.token);

      // Handle redirection based on user status
      handleAuthSuccess(loginData.data.user);
      
      return loginData;
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Email registration
  const registerWithEmail = async (email: string, password: string, confirmPassword: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, confirmPassword }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || "Registration failed");
      }
      
      // Save auth data
      setToken(data.data.token);
      setUser(data.data.user);
      localStorage.setItem("token", data.data.token);

      // Handle redirection based on user status
      handleAuthSuccess(data.data.user);
      
      return data;
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Email login
  const loginWithEmail = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || "Login failed");
      }
      
      // Save auth data
      setToken(data.data.token);
      setUser(data.data.user);
      localStorage.setItem("token", data.data.token);

      // Handle redirection based on user status
      handleAuthSuccess(data.data.user);
      
      return data;
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update user status on server (e.g., after onboarding)
  const updateUserStatus = async (userId: string, newUserStatus: string) => {
    if (!token) {
      throw new Error("Not authenticated");
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/update-status/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ newUser: newUserStatus }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user status");
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || "Failed to update user status");
      }
      
      // Update token and user with fresh data
      setToken(data.data.token);
      setUser(data.data.user);
      localStorage.setItem("token", data.data.token);
      
      return data;
    } catch (error) {
      console.error("Error updating user status:", error);
      throw error;
    }
  };

  // Handle redirection after successful auth
  const handleAuthSuccess = (authUser: User) => {
    if (authUser.newUser === "true") {
      router.push("/onboard");
    } else {
      router.push("/dashboard/farmer");
    }
  };

  // Handle logout
  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  const logout = () => {
    handleLogout();
    router.replace("/auth");
  };

  const value = {
    token,
    user,
    loading,
    isLoginStatusLoading,
    error,
    connectWallet,
    loginWithEmail,
    registerWithEmail,
    updateUserStatus,
    verifyAuth,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
