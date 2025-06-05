'use client';

import { useState } from 'react';
import { ethers } from 'ethers';



export default function Page() {
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [msg, setMsg] = useState<string>('');


  // onConnect getNonce -> 
  const connectWallet = async () => {
    if (!(window as any).ethereum) return alert("Please install MetaMask");

    // Provider for the EVM wallet
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    // client 
    const signer = await provider.getSigner();

    const addr = await signer.getAddress();

    setAddress(addr);

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

Wallet Address: ${address}
Nonce: ${nonce}
Timestamp: ${timestamp}

This request will not trigger a blockchain transaction or cost any gas.

Only sign this message if you trust AgriEthos.
  `;
    const signature = await signer.signMessage(message);

    const resLogin = await fetch("https://agriethos-9wy5.onrender.com/api/auth/wallet-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address: addr, signature }),
    }); 
    const loginData = await resLogin.json();
    
    if (loginData.success) {
      alert("✅ Login successful!");
    } else {
      setMsg(loginData.error || "Login failed.");
    }
  };

  // const handleLogin = async () => {
  //   try {
  //     setLoading(true);
  //     if (!window.ethereum) {
  //       throw new Error('MetaMask not installed');
  //     }

  //     // Create an instance of the EVM provider
  //     const provider = new ethers.BrowserProvider(window.ethereum);
  //     const signer = await provider.getSigner();
  //     const address = await signer.getAddress();
  //     const signature = await signer.signMessage('Log in to AgriEthos');

  //     const response = await fetch('https://agriethos-9wy5.onrender.com/api/auth/wallet-login', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({ address, signature })
  //     });

  //     const data = await response.json();

  //     if (!response.ok) {
  //       throw new Error(data.error || 'Login failed');
  //     }

  //     setMsg(`✅ Logged in as: ${data.data.walletAddress}`);
  //   } catch (err) {
  //     console.error('Login Error:', err);
  //     setMsg(`❌ ${err}`);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="p-4">
    <h2 className="text-xl mb-4">Farmer Wallet Login</h2>
    <button
      onClick={connectWallet}
      className="px-4 py-2 bg-green-600 text-white rounded"
    >
      Connect Wallet & Login
    </button>
    {msg && <p className="text-red-600 mt-2">{msg}</p>}
  </div>
  );
}
