
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "./Context/AuthContext";
import "./globals.css";
import { AdminAuthProvider } from "./Context/AdminAuthContext";
import { AgentAuthProvider } from "./Context/AgentAuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agriethos",
  description: "Sustainably Grown, Globally Shared",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        <AgentAuthProvider>
        <AdminAuthProvider>
        <AuthProvider>
           {children}
        </AuthProvider>
       </AdminAuthProvider>
       </AgentAuthProvider>
      </body>
    </html>
  );
}
