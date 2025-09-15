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
  ChevronDown,
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
]

export function AdvisorPlatformSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const currentPath = location.pathname

  const isActive = (path: string) => currentPath === path

  return (
    <div className={cn("bg-background border-r flex flex-col h-full", collapsed ? "w-14" : "w-60")}>
      <div className="p-4 border-b">
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-muted rounded-lg"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {platformItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
              isActive(item.url) ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            )}
          >
            <item.icon className="w-4 h-4" />
            {!collapsed && <span>{item.title}</span>}
          </NavLink>
        ))}
        
        <div className="pt-4 mt-4 border-t">
          {settingsItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.url}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                isActive(item.url) ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              )}
            >
              <item.icon className="w-4 h-4" />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}