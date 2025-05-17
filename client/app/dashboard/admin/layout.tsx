// Admins dashboard
// app/dashboard/layout.tsx
import React from "react";
import Navbar from "./components/Navbar";
import { NavProvider } from "./NavContext";




export default function DashboardLayout({ children }: { children: React.ReactNode }) {
 
  return (
    <NavProvider> 
       <div className="flex bg-white">
      <Navbar />
      <main className="lg:ml-[352px] flex-1 bg-white ">
        {children}
        </main>
    </div>
    </NavProvider>
   
  );
}
