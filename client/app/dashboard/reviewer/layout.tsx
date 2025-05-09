// app/dashboard/reviewer/layout.tsx
import React from "react";
import { AuthProvider } from "@/app/Context/AuthContext";
import { NavProvider } from "../farmer/NavContext";

export default function ReviewerDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <NavProvider>
        <div className="flex bg-white">
          {/* Removed the Navbar import and component */}
          <main className="flex-1 bg-white">
            {children}
          </main>
        </div>
      </NavProvider>
    </AuthProvider>
  );
}