import { useState } from "react"
import { 
  Home, 
  Users, 
  Mic, 
  FileText, 
  Layout, 
  TrendingUp, 
  Calendar,
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"

// Simple sidebar implementation without complex dependencies
import { cn } from "@/lib/utils"

const platformItems = [
  { title: "Dashboard", url: "/pros/advisors/platform", icon: Home },
  { title: "Prospects", url: "/pros/advisors/platform/prospects", icon: Users },
  { title: "Recordings", url: "/pros/advisors/platform/recordings", icon: Mic },
  { title: "Questionnaires", url: "/pros/advisors/platform/questionnaires", icon: FileText },
  { title: "Templates", url: "/pros/advisors/platform/templates", icon: Layout },
  { title: "ROI Tracker", url: "/pros/advisors/platform/roi", icon: TrendingUp },
  { title: "Calendar", url: "/pros/advisors/platform/calendar", icon: Calendar },
]

const settingsItems = [
  { title: "Platform Settings", url: "/pros/advisors/platform/settings", icon: Settings },
  { title: "Social Settings", url: "/pros/advisors/platform/settings/social", icon: Settings },
]

export function AdvisorPlatformSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const currentPath = location.pathname

  const isActive = (path: string) => currentPath === path

  return (
    <div className={cn(
      "bg-bfo-navy border-r border-bfo-gold/20 flex flex-col h-full transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 border-b border-bfo-gold/20 flex justify-end">
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {platformItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            className={cn(
              "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group",
              isActive(item.url) 
                ? "bg-bfo-gold/10 text-bfo-gold border border-bfo-gold/30" 
                : "hover:bg-white/5 text-white/70 hover:text-white"
            )}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && (
              <span className="font-medium text-sm">{item.title}</span>
            )}
          </NavLink>
        ))}
        
        <div className="pt-4 mt-4 border-t border-bfo-gold/20">
          {settingsItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.url}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200",
                isActive(item.url) 
                  ? "bg-bfo-gold/10 text-bfo-gold border border-bfo-gold/30" 
                  : "hover:bg-white/5 text-white/70 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <span className="font-medium text-sm">{item.title}</span>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}