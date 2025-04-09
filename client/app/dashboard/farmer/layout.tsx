// app/dashboard/layout.tsx
import React from "react";
import VerticalNavbar from "./components/VerticalNavbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <VerticalNavbar />
      <main className="ml-[352px] flex-1">{children}</main>
    </div>
  );
}
