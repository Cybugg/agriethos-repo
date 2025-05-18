// app/dashboard/reviewer/layout.tsx
import React from "react";
import { AuthProvider } from "@/app/Context/AuthContext";
import { NavProvider } from "./NavContext"; // Update import to use reviewer's NavContext
import Navbar from "./components/Navbar";

export default function ReviewerDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <NavProvider>
        <div className="flex bg-white">
          <Navbar />
          <main className="lg:ml-[352px] flex-1 bg-white">
            {children}
          </main>
        </div>
      </NavProvider>
    </AuthProvider>
  );
}