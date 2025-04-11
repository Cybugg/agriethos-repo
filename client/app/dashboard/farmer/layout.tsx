// app/dashboard/layout.tsx
import React from "react";
import VerticalNavbar from "./components/VerticalNavbar";
import { NavProvider } from "./NavContext";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
 
  return (
    <NavProvider>
       <div className="flex bg-white">
      <VerticalNavbar />
      <main className="ml-[352px] flex-1 bg-white ">{children}</main>
    </div>
    </NavProvider>
   
  );
}
