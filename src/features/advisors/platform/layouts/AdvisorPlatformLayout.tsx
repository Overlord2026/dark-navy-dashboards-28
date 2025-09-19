import { Outlet } from "react-router-dom"
import { AdvisorPlatformSidebar } from "../components/AdvisorPlatformSidebar"
import { Bell, HelpCircle, Menu } from "lucide-react"
import { useState } from "react"

export function AdvisorPlatformLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex w-full bg-bfo-navy-dark">
      <AdvisorPlatformSidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Professional Header */}
        <header className="h-16 flex items-center justify-between bg-bfo-navy border-b border-bfo-gold/20 px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-white/70 hover:text-white transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-bfo-gold text-xl font-semibold tracking-wide">
              ADVISOR PLATFORM
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="p-2 text-white/70 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 text-white/70 hover:text-white transition-colors">
              <HelpCircle className="w-5 h-5" />
            </button>
            <span className="text-white/60 text-sm">Help</span>
          </div>
        </header>
        
        <main className="flex-1 bg-bfo-navy-dark">
          <Outlet />
        </main>
      </div>
    </div>
  )
}