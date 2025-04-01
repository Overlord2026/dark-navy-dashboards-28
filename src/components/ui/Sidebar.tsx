
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { 
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { 
  homeNavItems,
  educationSolutionsNavItems,
  familyWealthNavItems,
  collaborationNavItems,
  bottomNavItems 
} from "@/components/navigation/NavigationConfig";
import { NavCategory, NavItem } from "@/types/navigation";
import { useTheme } from "@/context/ThemeContext";
import { UserProfileSection } from "@/components/sidebar/UserProfileSection";
import { AdvisorSection } from "@/components/profile/AdvisorSection";
import { toast } from "@/components/ui/use-toast";

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  
  // Force re-render once on component mount to ensure NavigationConfig changes are applied
  const [forceUpdate, setForceUpdate] = useState(0);
  
  useEffect(() => {
    // Force one-time update to refresh navigation
    setForceUpdate(1);
    
    // Notify user that navigation has been updated
    toast({
      title: "Navigation Updated",
      description: "The navigation menu has been refreshed with the latest structure.",
      duration: 3000,
    });
  }, []);

  // Updated navigation categories to match the requested structure
  const navigationCategories: NavCategory[] = [
    {
      id: "home",
      label: "HOME",
      items: homeNavItems,
      defaultExpanded: true
    },
    {
      id: "education-solutions",
      label: "EDUCATION & SOLUTIONS",
      items: educationSolutionsNavItems,
      defaultExpanded: true
    },
    {
      id: "family-wealth",
      label: "FAMILY WEALTH",
      items: familyWealthNavItems,
      defaultExpanded: true
    },
    {
      id: "collaboration-sharing",
      label: "COLLABORATION & SHARING",
      items: collaborationNavItems,
      defaultExpanded: true
    }
  ];

  // Initial expanded state based on defaultExpanded
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(
    navigationCategories.reduce((acc, category) => {
      acc[category.id] = category.defaultExpanded ?? false;
      return acc;
    }, {} as Record<string, boolean>)
  );

  // Track expanded submenu items
  const [expandedSubmenus, setExpandedSubmenus] = useState<Record<string, boolean>>({});

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const toggleSubmenu = (itemTitle: string) => {
    setExpandedSubmenus(prev => ({
      ...prev,
      [itemTitle]: !prev[itemTitle]
    }));
  };

  const isActive = (href: string) => {
    return location.pathname === href || 
           (href !== "/" && location.pathname.startsWith(href));
  };

  // Define these variables only once
  const advisorInfo = {
    name: "Daniel Zamora",
    title: "Senior Financial Advisor",
    email: "Daniel@awmfl.com",
    phone: "(555) 123-4567",
    location: "Sarasota, FL",
    office: "Sarasota Office",
    bio: "Daniel has over 15 years of experience in wealth management and financial planning."
  };

  const handleBookSession = () => {
    console.log("Book session clicked");
    // This would typically open a booking calendar or external link
  };

  const handleViewProfile = (tabId: string) => {
    console.log("View profile tab:", tabId);
    // Navigate to advisor profile or open a modal
  };

  const renderNavItem = (item: NavItem, hasSubmenu = false) => {
    // Check if item has submenu
    const hasSubItems = item.submenu && item.submenu.length > 0;
    const isSubmenuExpanded = expandedSubmenus[item.title] || false;

    return (
      <div key={item.title} className="mb-1">
        <div className="flex flex-col">
          <div className="flex items-center">
            <Link
              to={item.href}
              className={cn(
                "group flex items-center py-2 px-3 rounded-md transition-colors border w-full",
                isActive(item.href)
                  ? isLightTheme 
                    ? "bg-[#E9E7D8] text-[#222222] font-medium border-primary" 
                    : "bg-black text-white border-primary" 
                  : isLightTheme 
                    ? "text-[#222222] border-transparent hover:bg-[#E9E7D8] hover:border-primary" 
                    : "text-sidebar-foreground border-transparent hover:bg-sidebar-accent",
                hasSubmenu && "ml-4"
              )}
              title={collapsed ? item.title : undefined}
            >
              <item.icon 
                className={cn(
                  "h-5 w-5 flex-shrink-0", 
                  !collapsed && "mr-3"
                )} 
              />
              {!collapsed && (
                <span className="whitespace-nowrap overflow-hidden text-ellipsis flex-1">{item.title}</span>
              )}
              {!collapsed && hasSubItems && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 p-0"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleSubmenu(item.title);
                  }}
                >
                  {isSubmenuExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              )}
            </Link>
          </div>
          
          {/* Render submenu items if expanded */}
          {!collapsed && hasSubItems && isSubmenuExpanded && (
            <div className="pl-4 mt-1">
              {item.submenu!.map((subItem) => renderNavItem(subItem, true))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <aside
      className={cn(
        "flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out z-50",
        collapsed ? "w-[70px]" : "w-[240px]",
        isLightTheme ? "bg-[#F9F7E8] border-[#DCD8C0]" : "bg-[#1B1B32] border-white/10"
      )}
    >
      <div className="py-4 overflow-y-auto flex-1">
        {/* User Profile Section */}
        <div className={`px-4 ${isLightTheme ? 'border-[#DCD8C0]' : 'border-white/10'} mt-2 mb-4`}>
          <UserProfileSection showLogo={false} />
        </div>

        {/* Navigation Categories */}
        {navigationCategories.map((category) => (
          <div key={category.id} className="mb-3">
            {!collapsed && (
              <div 
                className={`flex items-center justify-between px-4 py-2 text-xs uppercase font-semibold tracking-wider ${
                  isLightTheme ? 'text-[#222222]/70' : 'text-[#E2E2E2]/70'
                }`}
                onClick={() => toggleCategory(category.id)}
                style={{ cursor: 'pointer' }}
              >
                <span>{category.label}</span>
                {expandedCategories[category.id] ? 
                  <ChevronUp className="h-4 w-4" /> : 
                  <ChevronDown className="h-4 w-4" />
                }
              </div>
            )}
            
            {(collapsed || expandedCategories[category.id]) && (
              <nav className="px-2 space-y-1 mt-1">
                {category.items.map((item) => renderNavItem(item))}
              </nav>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Navigation Section */}
      <div className="p-2 border-t mt-auto" style={{ borderColor: isLightTheme ? '#DCD8C0' : 'rgba(255,255,255,0.1)' }}>
        {/* Advisor Section */}
        <div className={`px-2 mb-3 ${isLightTheme ? 'border-[#DCD8C0]' : 'border-white/10'}`}>
          <AdvisorSection 
            advisorInfo={advisorInfo} 
            onViewProfile={handleViewProfile} 
            onBookSession={handleBookSession} 
            collapsed={collapsed} 
          />
        </div>

        <nav className="space-y-1">
          {bottomNavItems.map((item) => (
            <Link
              key={item.title}
              to={item.href}
              className={cn(
                "group flex items-center py-2 px-3 rounded-md transition-colors border",
                isActive(item.href)
                  ? isLightTheme 
                    ? "bg-[#E9E7D8] text-[#222222] font-medium border-primary" 
                    : "bg-black text-white border-primary" 
                  : isLightTheme 
                    ? "text-[#222222] border-transparent hover:bg-[#E9E7D8] hover:border-primary" 
                    : "text-sidebar-foreground border-transparent hover:bg-sidebar-accent",
              )}
              title={collapsed ? item.title : undefined}
            >
              <item.icon 
                className={cn(
                  "h-5 w-5 flex-shrink-0", 
                  !collapsed && "mr-3"
                )} 
              />
              {!collapsed && (
                <span className="whitespace-nowrap overflow-hidden text-ellipsis">{item.title}</span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* Sidebar Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 -right-4 h-8 w-8 rounded-full bg-background border border-gray-700 text-foreground hover:bg-accent hover:text-sidebar-primary-foreground"
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
