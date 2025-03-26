
import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  ChevronLeftIcon,
  ChevronRightIcon,
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
  icon: React.ElementType | React.FC;
  label: string;
  href: string;
  active?: boolean;
};

// Custom Home Icon component with the tree logo
const CustomHomeIcon: React.FC = () => (
  <div className="flex items-center justify-center bg-black rounded-full h-5 w-5 mr-1">
    <img 
      src="/lovable-uploads/e4ac2159-1b66-4f15-9257-68a0f00c8311.png" 
      alt="Home"
      className="h-4 w-4"
    />
  </div>
);

const mainNavItems: NavItem[] = [
  { icon: CustomHomeIcon, label: "Dashboard", href: "/", active: true },
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

  // Rich gold color to match logo
  const goldIconColor = "#d4af37";

  return (
    <aside
      className={cn(
        "h-screen flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
        collapsed ? "w-[70px]" : "w-[240px]"
      )}
    >
      <div className="flex items-center justify-center h-[70px] px-4 border-b border-sidebar-border">
        {collapsed ? (
          <div className="w-12 h-12 flex items-center justify-center">
            <img 
              src="/lovable-uploads/9d138e85-d6e9-4083-ad34-147b3fc524ab.png" 
              alt="Advanced Wealth Management Logo" 
              className="h-8" 
            />
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <img 
              src="/lovable-uploads/9d138e85-d6e9-4083-ad34-147b3fc524ab.png" 
              alt="Advanced Wealth Management Logo" 
              className="h-10" 
            />
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
              {typeof item.icon === "function" ? (
                <item.icon />
              ) : (
                <item.icon className="h-5 w-5 mr-3 flex-shrink-0" style={{ color: goldIconColor }} />
              )}
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
              <item.icon className="h-5 w-5 mr-3 flex-shrink-0" style={{ color: goldIconColor }} />
              {!collapsed && <span>{item.label}</span>}
            </a>
          ))}
        </nav>
      </div>

      <div className="p-3 border-t border-sidebar-border m-2 rounded-md bg-sidebar-accent/30">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-accent/30 flex items-center justify-center">
            <UsersIcon className="h-4 w-4 text-accent" />
          </div>
          {!collapsed && (
            <div className="ml-2">
              <p className="text-xs text-sidebar-foreground font-medium">Advisor:</p>
              <p className="text-xs text-sidebar-foreground/80">Charles Bryant</p>
            </div>
          )}
        </div>
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
