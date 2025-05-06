
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { SidebarSection } from "./SidebarSection";
import { UserProfileSection } from "./UserProfileSection";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { 
  LayoutDashboard, 
  User, 
  FileText, 
  Settings, 
  TrendingUp, 
  Folder, 
  LifeBuoy, 
  BadgeHelp, 
  BarChartHorizontal, 
  Network, 
  Users, 
  Boxes 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export const navigationItems = [
  {
    id: "home",
    title: "Home",
    icon: LayoutDashboard,
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    id: "personal",
    title: "Personal",
    icon: User,
    items: [
      {
        label: "Profile",
        href: "/profile",
        icon: User,
      },
      {
        label: "Documents",
        href: "/documents",
        icon: FileText,
      },
    ],
  },
  {
    id: "wealth",
    title: "Wealth",
    icon: TrendingUp,
    items: [
      {
        label: "Investments",
        href: "/investments",
        icon: TrendingUp,
      },
      {
        label: "Properties",
        href: "/properties",
        icon: Folder,
      },
    ],
  },
  {
    id: "support",
    title: "Support",
    icon: LifeBuoy,
    items: [
      {
        label: "Help",
        href: "/help",
        icon: LifeBuoy,
      },
      {
        label: "FAQ",
        href: "/faq",
        icon: BadgeHelp,
      },
    ],
  },
  {
    id: "admin",
    title: "Admin",
    icon: BarChartHorizontal,
    items: [
      {
        label: "Diagnostics",
        href: "/system-diagnostics",
        icon: BarChartHorizontal,
      },
    ],
  },
  {
    id: "integration",
    title: "Integration",
    icon: Network,
    items: [
      {
        label: "Project Integration",
        href: "/project-integration",
        icon: Network,
      },
      {
        label: "Connected Users",
        href: "/connected-users",
        icon: Users,
      },
      {
        label: "Marketplace",
        href: "/marketplace",
        icon: Boxes,
      },
    ],
  },
  {
    id: "settings",
    title: "Settings",
    icon: Settings,
    items: [
      {
        label: "Settings",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
];

export const EnhancedSidebar: React.FC = () => {
  const [openSections, setOpenSections] = useState<string[]>(["home", "integration"]);
  const [isCollapsed, setIsCollapsed] = useLocalStorage("sidebarCollapsed", false);

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (isCollapsed) {
    return (
      <div className="w-16 h-full flex flex-col bg-sidebar border-r border-border">
        <div className="p-4 flex justify-center border-b border-border">
          <Button
            variant="ghost"
            size="sm"
            className="p-1"
            onClick={toggleSidebar}
            aria-label="Expand sidebar"
          >
            <ChevronRight size={18} />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          {navigationItems.map(section => (
            <div key={section.id} className="flex justify-center p-2 mb-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                title={section.title}
              >
                <section.icon size={18} />
              </Button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 h-full flex flex-col bg-sidebar border-r border-border">
      <div className="p-4 flex justify-between items-center border-b border-border">
        <h1 className="font-semibold text-foreground">Navigation</h1>
        <Button
          variant="ghost"
          size="sm"
          className="p-1"
          onClick={toggleSidebar}
          aria-label="Collapse sidebar"
        >
          <ChevronLeft size={18} />
        </Button>
      </div>
      
      <UserProfileSection />
      
      <div className="flex-1 overflow-y-auto p-3">
        {navigationItems.map(section => (
          <SidebarSection
            key={section.id}
            title={section.title}
            icon={section.icon}
            items={section.items}
            isOpen={openSections.includes(section.id)}
            onToggle={() => toggleSection(section.id)}
          />
        ))}
      </div>
    </div>
  );
};
