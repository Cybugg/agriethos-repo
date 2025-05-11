'use client';

import { useState } from 'react';
import Image from "next/image";
import { Button } from "@/app/components/button";
import Link from "next/link";
import { Menu } from "lucide-react";
import MobileNav from "./components/MobileNav";

export default function Home() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex h-screen bg-white">
      {/* Mobile Nav */}
      <MobileNav 
        isOpen={mobileNavOpen} 
        onClose={() => setMobileNavOpen(false)} 
        currentPage="home" 
      />

      {/* Sidebar - Hidden on mobile */}
      <div className="hidden md:flex md:w-[317px] border-r border-[#cfcfcf] flex-col">
        <div className="p-6">
          <Image src="/icons/agriethos-logo-3-1-2.png" alt="Agriethos Logo" width={40} height={40} className="mb-8" />
          Agriethos
        </div>
        <nav className="flex flex-col px-4 gap-2">
          <Link href="/dashboard/reviewer" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#a5eb4c] text-[#003024] font-medium">
            <Image 
              src="/icons/ph-house-line-fill.svg" 
              alt="Home Icon" 
              width={20} 
              height={20} 
            />
            Home
          </Link>
          <Link
            href="/dashboard/reviewer/history"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#898989] hover:bg-[#f6fded] transition-colors"
          >
            <Image 
              src="/icons/ph-clock-countdown-light.svg" 
              alt="History Icon" 
              width={20} 
              height={20} 
            />
            History
          </Link>
          <Link
            href="/dashboard/reviewer/statistics"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#898989] hover:bg-[#f6fded] transition-colors"
          >
            <Image 
              src="/icons/ph-chart-line-light.svg" 
              alt="Statistics Icon" 
              width={20} 
              height={20} 
            />
            Statistics
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="flex justify-between items-center p-4 md:p-6 border-b border-[#cfcfcf]">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-[#000000]">Home</h1>
            <p className="text-sm md:text-base text-[#898989]">Manage all crop submissions.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-[#f6fded]">
              <Image src="/icons/bell.svg" alt="Notifications" width={24} height={24} />
            </button>
            <button className="md:hidden p-2 rounded-full hover:bg-[#f6fded]" onClick={() => setMobileNavOpen(true)}>
              <Menu size={24} />
            </button>
          </div>
        </header>

        <main className="p-4 md:p-6">
          <div className="space-y-4">
            {/* Farm entries - stack vertically on mobile */}
            {/* Farm Entry 1 */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border rounded-lg border-[#cfcfcf]">
              <div className="flex items-center gap-4 mb-3 md:mb-0">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src="/icons/rectangle-20.svg"
                    alt="Active Farms"
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-black">Active Farms</h3>
                  <p className="text-sm text-[#898989]">Osun, Nigeria</p>
                </div>
              </div>
              <div className="flex items-center justify-between md:justify-end w-full md:w-auto">
                <div className="md:w-[120px] md:mx-8 text-center my-3 md:my-0">
                  <span className="font-medium text-black">Tomatoes</span>
                </div>
                <div className="flex flex-col md:flex-row items-end md:items-center gap-2 md:gap-4">
                  <span className="px-3 py-1 text-sm rounded-full bg-[#f6fded] text-[#96d645]">Pre-harvest</span>
                  <div className="flex gap-2 mt-2 md:mt-0">
                    <Button
                      variant="outline"
                      className="w-[100px] md:w-[121px] h-[40px] md:h-[43px] text-sm rounded-lg border-[0.75px] border-[#003024] text-black hover:bg-[#f6fded] hover:text-[#003024] px-2 py-2 md:py-3"
                    >
                      Skip
                    </Button>
                    <Link href="/dashboard/reviewer/review/1">
                      <Button className="w-[100px] md:w-[121px] h-[40px] md:h-[43px] text-sm rounded-lg bg-[#a5eb4c] text-[#003024] hover:bg-[#96d645] px-2 py-2 md:py-3">
                        Review
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Farm Entry 2 */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border rounded-lg border-[#cfcfcf]">
              <div className="flex items-center gap-4 mb-3 md:mb-0">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src="/static/farm1.png"
                    alt="God's Grace Farms"
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-black">God's Grace Farms</h3>
                  <p className="text-sm text-[#898989]">Lagos, Nigeria</p>
                </div>
              </div>
              <div className="flex items-center justify-between md:justify-end w-full md:w-auto">
                <div className="md:w-[120px] md:mx-8 text-center my-3 md:my-0">
                  <span className="font-medium text-black">Lettuce</span>
                </div>
                <div className="flex flex-col md:flex-row items-end md:items-center gap-2 md:gap-4">
                  <span className="px-3 py-1 text-sm rounded-full bg-[#f6fded] text-[#96d645]">Pre-harvest</span>
                  <div className="flex gap-2 mt-2 md:mt-0">
                    <Button
                      variant="outline"
                      className="w-[100px] md:w-[121px] h-[40px] md:h-[43px] text-sm rounded-lg border-[0.75px] border-[#003024] text-black hover:bg-[#f6fded] hover:text-[#003024] px-2 py-2 md:py-3"
                    >
                      Skip
                    </Button>
                    <Link href="/dashboard/reviewer/review/2">
                      <Button className="w-[100px] md:w-[121px] h-[40px] md:h-[43px] text-sm rounded-lg bg-[#a5eb4c] text-[#003024] hover:bg-[#96d645] px-2 py-2 md:py-3">
                        Review
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Farm Entry 3 */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border rounded-lg border-[#cfcfcf]">
              <div className="flex items-center gap-4 mb-3 md:mb-0">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src="/icons/rectangle-20-2.svg"
                    alt="Greenland Farm"
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-black">Greenland Farm</h3>
                  <p className="text-sm text-[#898989]">Pretoria, South Africa</p>
                </div>
              </div>
              <div className="flex items-center justify-between md:justify-end w-full md:w-auto">
                <div className="md:w-[120px] md:mx-8 text-center my-3 md:my-0">
                  <span className="font-medium text-black">Strawberry</span>
                </div>
                <div className="flex flex-col md:flex-row items-end md:items-center gap-2 md:gap-4">
                  <span className="px-3 py-1 text-sm rounded-full bg-[#f0f4f3] text-[#898989]">Post-harvest</span>
                  <div className="flex gap-2 mt-2 md:mt-0">
                    <Button
                      variant="outline"
                      className="w-[100px] md:w-[121px] h-[40px] md:h-[43px] text-sm rounded-lg border-[0.75px] border-[#003024] text-black hover:bg-[#f6fded] hover:text-[#003024] px-2 py-2 md:py-3"
                    >
                      Skip
                    </Button>
                    <Button className="w-[100px] md:w-[121px] h-[40px] md:h-[43px] text-sm rounded-lg bg-[#a5eb4c] text-[#003024] hover:bg-[#96d645] px-2 py-2 md:py-3">
                      Review
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Farm Entry 4 */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border rounded-lg border-[#cfcfcf]">
              <div className="flex items-center gap-4 mb-3 md:mb-0">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src="/icons/rectangle-20.svg"
                    alt="Active Farms"
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-black">Active Farms</h3>
                  <p className="text-sm text-[#898989]">Osun, Nigeria</p>
                </div>
              </div>
              <div className="flex items-center justify-between md:justify-end w-full md:w-auto">
                <div className="md:w-[120px] md:mx-8 text-center my-3 md:my-0">
                  <span className="font-medium text-black">Maize</span>
                </div>
                <div className="flex flex-col md:flex-row items-end md:items-center gap-2 md:gap-4">
                  <span className="px-3 py-1 text-sm rounded-full bg-[#f0f4f3] text-[#898989]">Post-harvest</span>
                  <div className="flex gap-2 mt-2 md:mt-0">
                    <Button
                      variant="outline"
                      className="w-[100px] md:w-[121px] h-[40px] md:h-[43px] text-sm rounded-lg border-[0.75px] border-[#003024] text-black hover:bg-[#f6fded] hover:text-[#003024] px-2 py-2 md:py-3"
                    >
                      Skip
                    </Button>
                    <Button className="w-[100px] md:w-[121px] h-[40px] md:h-[43px] text-sm rounded-lg bg-[#a5eb4c] text-[#003024] hover:bg-[#96d645] px-2 py-2 md:py-3">
                      Review
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
