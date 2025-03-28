
import React, { useState } from "react";
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
import { AdvisorSection } from "@/components/profile/AdvisorSection";

type NavItem = {
  icon: React.ElementType | React.FC;
  label: string;
  href: string;
  active?: boolean;
};

// Custom Home Icon component with the tree logo
const CustomHomeIcon: React.FC = () => (
  <img 
    src="/lovable-uploads/e4ac2159-1b66-4f15-9257-68a0f00c8311.png" 
    alt="Home"
    className="h-5 w-5 mr-1"
  />
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

// Sample advisor information
const advisorInfo = {
  name: "Charles Bryant",
  title: "Senior Financial Advisor",
  location: "New York, NY",
  email: "charles.bryant@example.com",
  phone: "(555) 123-4567",
  office: "Main Office",
  bio: "Charles has over 15 years of experience in financial planning and wealth management."
};

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleViewProfile = (tabId: string) => {
    console.log("View profile tab:", tabId);
    // Navigate to advisor profile or open a modal
  };

  const handleBookSession = () => {
    console.log("Book session clicked");
    // Open booking calendar or external link
  };

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
              src="/lovable-uploads/6b80c4ed-a513-491e-b6f8-1a78c48dced5.png" 
              alt="Boutique Family Office Logo" 
              className="h-10 w-auto" 
            />
          </div>
        ) : (
          <div className="flex items-center justify-center w-full">
            <img 
              src="/lovable-uploads/6b80c4ed-a513-491e-b6f8-1a78c48dced5.png" 
              alt="Boutique Family Office Logo" 
              className="h-14 w-auto" 
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
                  ? "bg-black text-white" 
                  : "text-sidebar-foreground"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {typeof item.icon === "function" ? (
                <div className="flex items-center justify-center bg-black rounded-sm p-0.5 mr-3">
                  <item.icon />
                </div>
              ) : (
                <item.icon className="h-5 w-5 mr-3 flex-shrink-0 bg-black p-0.5 rounded-sm" />
              )}
              {!collapsed && <span className="whitespace-nowrap overflow-hidden text-ellipsis">{item.label}</span>}
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
              <item.icon className="h-5 w-5 mr-3 flex-shrink-0 bg-black p-0.5 rounded-sm" />
              {!collapsed && <span className="whitespace-nowrap overflow-hidden text-ellipsis">{item.label}</span>}
            </a>
          ))}
        </nav>
      </div>

      {/* Advisor Section */}
      {!collapsed && (
        <AdvisorSection 
          advisorInfo={advisorInfo}
          onViewProfile={handleViewProfile}
          onBookSession={handleBookSession}
        />
      )}

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
}
