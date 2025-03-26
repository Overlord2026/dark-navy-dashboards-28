
import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  ChevronLeftIcon,
  ChevronRightIcon,
  HomeIcon, 
  BarChart3Icon, 
  UsersIcon, 
  FolderIcon, 
  CalendarIcon, 
  SettingsIcon,
  HelpCircleIcon,
  LogOutIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";

type NavItem = {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
};

const mainNavItems: NavItem[] = [
  { icon: HomeIcon, label: "Dashboard", href: "/", active: true },
  { icon: BarChart3Icon, label: "Reports", href: "/reports" },
  { icon: UsersIcon, label: "Clients", href: "/clients" },
  { icon: FolderIcon, label: "Documents", href: "/documents" },
  { icon: CalendarIcon, label: "Calendar", href: "/calendar" },
];

const bottomNavItems: NavItem[] = [
  { icon: HelpCircleIcon, label: "Help", href: "/help" },
  { icon: SettingsIcon, label: "Settings", href: "/settings" },
  { icon: LogOutIcon, label: "Logout", href: "/logout" },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <aside
      className={cn(
        "h-screen flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
        collapsed ? "w-[70px]" : "w-[240px]"
      )}
    >
      <div className="flex items-center h-[60px] px-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-md bg-accent flex items-center justify-center mr-2">
              <img src="/lovable-uploads/90781be1-cf1d-4b67-b35a-0e5c45072062.png" alt="BFO Logo" className="h-6 w-6" />
            </div>
            <span className="font-semibold text-sidebar-foreground">Boutique Family Office</span>
          </div>
        )}
        {collapsed && (
          <div className="h-8 w-8 rounded-md bg-accent flex items-center justify-center mx-auto">
            <img src="/lovable-uploads/90781be1-cf1d-4b67-b35a-0e5c45072062.png" alt="BFO Logo" className="h-6 w-6" />
          </div>
        )}
      </div>

      <div className="flex-1 py-4 overflow-y-auto">
        <nav className="px-2 space-y-1">
          {mainNavItems.map((item, index) => (
            <a
              key={item.label}
              href={item.href}
              className={cn(
                "group flex items-center py-2 px-3 rounded-md transition-colors",
                "hover:bg-sidebar-accent",
                item.active
                  ? "bg-sidebar-accent text-accent"
                  : "text-sidebar-foreground"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </a>
          ))}
        </nav>
      </div>

      <div className="p-2 border-t border-sidebar-border">
        <nav className="space-y-1">
          {bottomNavItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="group flex items-center py-2 px-3 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            >
              <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </a>
          ))}
        </nav>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute top-[70px] -right-4 h-8 w-8 rounded-full bg-background border border-border text-foreground hover:bg-accent hover:text-sidebar-primary-foreground"
        onClick={toggleSidebar}
      >
        {collapsed ? (
          <ChevronRightIcon className="h-4 w-4" />
        ) : (
          <ChevronLeftIcon className="h-4 w-4" />
        )}
      </Button>
    </aside>
  );
};
