import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  ChevronLeftIcon,
  ChevronRightIcon,
  BarChart3Icon, 
  UsersIcon, 
  FileIcon, 
  CalendarIcon, 
  SettingsIcon,
  HelpCircleIcon,
  LogOutIcon,
  HomeIcon,
  BuildingIcon,
  KeyIcon,
  MapPinIcon,
  LandmarkIcon,
  CoinsIcon,
  CircleDollarSign,
  FileTextIcon,
  ShareIcon,
  LineChartIcon,
  ShieldIcon,
  BanknoteIcon,
  ArrowLeftRightIcon,
  CalculatorIcon,
  ShoppingBag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

type NavItem = {
  icon: React.ElementType | React.FC;
  label: string;
  href: string;
};

const mainNavItems: NavItem[] = [
  { icon: HomeIcon, label: "Dashboard", href: "/" },
  { icon: CircleDollarSign, label: "Accounts", href: "/accounts" },
  { icon: FileTextIcon, label: "Documents", href: "/documents" },
  { icon: ShareIcon, label: "Sharing", href: "/sharing" },
  { icon: LineChartIcon, label: "Financial Plans", href: "/financial-plans" },
  { icon: BarChart3Icon, label: "Investments", href: "/investments" },
  { icon: ShieldIcon, label: "Insurance", href: "/insurance" },
  { icon: BanknoteIcon, label: "Lending", href: "/lending" },
  { icon: CoinsIcon, label: "Cash Management", href: "/cash-management" },
  { icon: ArrowLeftRightIcon, label: "Transfers", href: "/transfers" },
  { icon: CalculatorIcon, label: "Tax & Budgets", href: "/tax-budgets" },
  { icon: ShoppingBag, label: "Marketplace", href: "/marketplace" },
];

const propertiesNavItems: NavItem[] = [
  { icon: HomeIcon, label: "Properties", href: "/properties" },
  { icon: BuildingIcon, label: "Buildings", href: "/properties?filter=buildings" },
  { icon: KeyIcon, label: "Rentals", href: "/properties?filter=rentals" },
  { icon: MapPinIcon, label: "Locations", href: "/properties?filter=locations" },
  { icon: LandmarkIcon, label: "Investments", href: "/properties?filter=investments" },
];

const bottomNavItems: NavItem[] = [
  { icon: HelpCircleIcon, label: "Help", href: "/help" },
  { icon: SettingsIcon, label: "Settings", href: "/settings" },
  { icon: LogOutIcon, label: "Logout", href: "/logout" },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const isActive = (href: string) => {
    return location.pathname === href || 
           (href !== "/" && location.pathname.startsWith(href));
  };

  return (
    <aside
      className={cn(
        "flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
        collapsed ? "w-[70px]" : "w-[240px]"
      )}
    >
      <div className="py-4 overflow-y-auto">
        <nav className="px-2 space-y-1">
          {mainNavItems.map((item, index) => (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                "group flex items-center py-2 px-3 rounded-md transition-colors",
                "hover:bg-sidebar-accent",
                isActive(item.href)
                  ? "bg-black text-white" 
                  : "text-sidebar-foreground"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <item.icon className="h-5 w-5 mr-3 flex-shrink-0 bg-black p-0.5 rounded-sm" />
              {!collapsed && <span className="whitespace-nowrap overflow-hidden text-ellipsis">{item.label}</span>}
            </Link>
          ))}
        </nav>
        
        {/* Properties Management Section */}
        {!collapsed && (
          <div className="mt-6 px-3">
            <h3 className="px-2 text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider">
              Properties Management
            </h3>
          </div>
        )}
        <nav className="mt-2 px-2 space-y-1">
          {propertiesNavItems.map((item, index) => (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                "group flex items-center py-2 px-3 rounded-md transition-colors",
                "hover:bg-sidebar-accent",
                isActive(item.href)
                  ? "bg-black text-white" 
                  : "text-sidebar-foreground"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <item.icon className="h-5 w-5 mr-3 flex-shrink-0 bg-black p-0.5 rounded-sm" />
              {!collapsed && <span className="whitespace-nowrap overflow-hidden text-ellipsis">{item.label}</span>}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-2 border-t border-sidebar-border mt-auto">
        <nav className="space-y-1">
          {bottomNavItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="group flex items-center py-2 px-3 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors border border-gray-700"
            >
              <item.icon className="h-5 w-5 mr-3 flex-shrink-0 bg-black p-0.5 rounded-sm" />
              {!collapsed && <span className="whitespace-nowrap overflow-hidden text-ellipsis">{item.label}</span>}
            </Link>
          ))}
        </nav>
      </div>

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
