import Image from "next/image"
import { Button } from "@/app/components/button"

export default function Home() {
  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-[317px] border-r border-[#cfcfcf] flex flex-col">
        <div className="p-6">
          <Image src="/icons/agriethos-logo-3-1-2.png" alt="Agriethos Logo" width={40} height={40} className="mb-8" />
          Agriethos
        </div>
        <nav className="flex flex-col px-4 gap-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#a5eb4c] text-[#003024] font-medium">
            <Image 
              src="/icons/ph-house-line-fill.svg" 
              alt="Home Icon" 
              width={20} 
              height={20} 
            />
            Home
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#898989] hover:bg-[#f6fded] transition-colors"
          >
            <Image 
              src="/icons/ph-clock-countdown-light.svg" 
              alt="History Icon" 
              width={20} 
              height={20} 
            />
            History
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#898989] hover:bg-[#f6fded] transition-colors"
          >
            <Image 
              src="/icons/ph-chart-line-light.svg" 
              alt="Statistics Icon" 
              width={20} 
              height={20} 
            />
            Statistics
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="flex justify-between items-center p-6 border-b border-[#cfcfcf]">
          <div>
            <h1 className="text-2xl font-semibold text-[#000000]">Home</h1>
            <p className="text-[#898989]">Manage all crop submissions.</p>
          </div>
          <button className="p-2 rounded-full hover:bg-[#f6fded]">
            <Image src="/icons/bell.svg" alt="Notifications" width={24} height={24} />
          </button>
        </header>

        <main className="p-6">
          <div className="space-y-4">
            {/* Farm Entry 1 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
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
              <div className="w-[120px] mx-8 text-right">
                <span className="font-medium text-black">Tomatoes</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 text-sm rounded-full bg-[#f6fded] text-[#96d645]">Pre-harvest</span>
                <Button
                  variant="outline"
                  className="w-[121px] h-[43px] rounded-lg border-[0.75px] border-[#003024] text-black hover:bg-[#f6fded] hover:text-[#003024] px-2 py-3"
                >
                  Skip
                </Button>
                <Button className="w-[121px] h-[43px] rounded-lg bg-[#a5eb4c] text-[#003024] hover:bg-[#96d645] px-2 py-3">
                  Review
                </Button>
              </div>
            </div>

            {/* Farm Entry 2 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
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
              <div className="w-[120px] mx-8 text-right">
                <span className="font-medium text-black">Lettuce</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 text-sm rounded-full bg-[#f6fded] text-[#96d645]">Pre-harvest</span>
                <Button
                  variant="outline"
                  className="w-[121px] h-[43px] rounded-lg border-[0.75px] border-[#003024] text-black hover:bg-[#f6fded] hover:text-[#003024] px-2 py-3"
                >
                  Skip
                </Button>
                <Button className="w-[121px] h-[43px] rounded-lg bg-[#a5eb4c] text-[#003024] hover:bg-[#96d645] px-2 py-3">
                  Review
                </Button>
              </div>
            </div>

            {/* Farm Entry 3 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
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
              <div className="w-[120px] mx-8 text-right">
                <span className="font-medium text-black">Strawberry</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 text-sm rounded-full bg-[#f0f4f3] text-[#898989]">Post-harvest</span>
                <Button
                  variant="outline"
                  className="w-[121px] h-[43px] rounded-lg border-[0.75px] border-[#003024] text-black hover:bg-[#f6fded] hover:text-[#003024] px-2 py-3"
                >
                  Skip
                </Button>
                <Button className="w-[121px] h-[43px] rounded-lg bg-[#a5eb4c] text-[#003024] hover:bg-[#96d645] px-2 py-3">
                  Review
                </Button>
              </div>
            </div>

            {/* Farm Entry 4 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
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
              <div className="w-[120px] mx-8 text-right">
                <span className="font-medium text-black">Maize</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 text-sm rounded-full bg-[#f0f4f3] text-[#898989]">Post-harvest</span>
                <Button
                  variant="outline"
                  className="w-[121px] h-[43px] rounded-lg border-[0.75px] border-[#003024] text-black hover:bg-[#f6fded] hover:text-[#003024] px-2 py-3"
                >
                  Skip
                </Button>
                <Button className="w-[121px] h-[43px] rounded-lg bg-[#a5eb4c] text-[#003024] hover:bg-[#96d645] px-2 py-3">
                  Review
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
