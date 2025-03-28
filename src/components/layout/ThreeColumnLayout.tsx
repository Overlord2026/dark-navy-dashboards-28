
import { ReactNode, useState } from "react";
import * as React from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  UserIcon, 
  UsersIcon, 
  FileIcon, 
  BarChart3Icon, 
  ShieldIcon, 
  PiggyBankIcon, 
  CreditCardIcon, 
  WalletIcon, 
  ArrowRightLeftIcon, 
  ReceiptIcon, 
  ShareIcon, 
  GraduationCapIcon,
  BookOpenIcon,
  CalendarIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserProfileSection } from "@/components/sidebar/UserProfileSection";
import { Header } from "@/components/ui/Header";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AdvisorSection } from "@/components/profile/AdvisorSection";

type MenuItem = {
  id: string;
  label?: string;
  name?: string;
  active?: boolean;
};

interface ThreeColumnLayoutProps {
  children: ReactNode;
  title?: string;
  activeMainItem?: string;
  activeSecondaryItem?: string;
  secondaryMenuItems?: MenuItem[];
  breadcrumbs?: { name: string; href: string; active?: boolean }[];
}

type MainMenuItem = {
  id: string;
  label: string;
  icon: React.ElementType | React.FC;
  href: string;
  active?: boolean;
};

const CustomHomeIcon: React.FC = () => (
  <img 
    src="/lovable-uploads/e4ac2159-1b66-4f15-9257-68a0f00c8311.png" 
    alt="Home"
    className="h-5 w-5"
  />
);

const mainMenuItems: MainMenuItem[] = [
  { id: "home", label: "Home", icon: CustomHomeIcon, href: "/" },
  { id: "education", label: "Education", icon: GraduationCapIcon, href: "/education" },
  { id: "vault", label: "Legacy Vault", icon: BookOpenIcon, href: "/vault" },
  { id: "accounts", label: "Accounts", icon: WalletIcon, href: "/accounts" },
  { id: "sharing", label: "Sharing", icon: ShareIcon, href: "/sharing" },
  { id: "financial-plans", label: "Financial Plans", icon: BarChart3Icon, href: "/financial-plans" },
  { id: "investments", label: "Investments", icon: PiggyBankIcon, href: "/investments" },
  { id: "insurance", label: "Insurance", icon: ShieldIcon, href: "/insurance" },
  { id: "lending", label: "Lending", icon: CreditCardIcon, href: "/lending" },
  { id: "cash-management", label: "Cash Management", icon: WalletIcon, href: "/cash-management" },
  { id: "transfers", label: "Transfers", icon: ArrowRightLeftIcon, href: "/transfers" },
  { id: "tax-budgets", label: "Tax Budgets", icon: ReceiptIcon, href: "/tax-budgets" },
];

const accountsSubMenuItems: MenuItem[] = [
  { id: "all-accounts", name: "All Accounts", active: true },
  { id: "checking", name: "Checking" },
  { id: "savings", name: "Savings" },
  { id: "investment", name: "Investment" },
  { id: "retirement", name: "Retirement" },
];

const sharingSubMenuItems: MenuItem[] = [
  { id: "shared-with-me", name: "Shared With Me", active: true },
  { id: "shared-by-me", name: "Shared By Me" },
  { id: "collaborators", name: "Collaborators" },
];

const educationSubMenuItems: MenuItem[] = [
  { id: "all-courses", name: "All Courses", active: true },
  { id: "financial-basics", name: "Financial Basics" },
  { id: "investing", name: "Investing" },
  { id: "retirement", name: "Retirement" },
  { id: "premium", name: "Premium Courses" },
];

const getSecondaryMenuItems = (activeMainItem: string): MenuItem[] => {
  switch (activeMainItem) {
    case "accounts":
      return accountsSubMenuItems;
    case "sharing":
      return sharingSubMenuItems;
    case "education":
      return educationSubMenuItems;
    default:
      return [];
  }
};

export function ThreeColumnLayout({ 
  children, 
  title = "Dashboard", 
  activeMainItem = "home",
  activeSecondaryItem = "",
  secondaryMenuItems,
  breadcrumbs
}: ThreeColumnLayoutProps) {
  const [mainSidebarCollapsed, setMainSidebarCollapsed] = useState(false);
  const [secondarySidebarCollapsed, setSecondarySidebarCollapsed] = useState(false);
  const [showAdvisorInfo, setShowAdvisorInfo] = useState(false);
  
  const advisorInfo = {
    name: "Charles Bryant",
    title: "Senior Financial Advisor",
    email: "charles.bryant@example.com",
    phone: "(555) 123-4567",
    location: "New York, NY",
    office: "Manhattan Office",
    bio: "Charles has over 15 years of experience in wealth management and financial planning."
  };

  const handleBookSession = () => {
    console.log("Book session clicked");
    // This would typically open a booking calendar or external link
  };

  const handleViewProfile = (tabId: string) => {
    console.log("View profile tab:", tabId);
    // Navigate to advisor profile or open a modal
  };

  const { theme } = useTheme();
  const { userProfile } = useUser();
  
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const sectionId = params.sectionId || activeSecondaryItem;
  
  const menuItems = secondaryMenuItems || getSecondaryMenuItems(activeMainItem);
  
  const hasSecondaryMenu = menuItems.length > 0;
  const isLightTheme = theme === "light";
  const isHomePage = location.pathname === "/";

  const getCurrentPath = () => {
    const path = location.pathname.split('/')[1];
    return path === '' ? 'home' : path;
  };

  const currentPath = getCurrentPath();

  const toggleMainSidebar = () => {
    setMainSidebarCollapsed(!mainSidebarCollapsed);
  };

  const toggleSecondarySidebar = () => {
    setSecondarySidebarCollapsed(!secondarySidebarCollapsed);
  };

  const handleProfileMenuItemClick = (itemId: string) => {
    console.log(`Profile menu item clicked in layout: ${itemId}`);
    
    if (itemId === "profile") {
      navigate("/");
    } else if (itemId === "settings") {
      navigate("/settings");
    } else if (itemId === "log-out") {
      console.log("Logging out...");
    }
  };

  return (
    <div className={`flex flex-col h-screen overflow-hidden ${isLightTheme ? 'bg-[#F9F7E8]' : 'bg-[#12121C]'}`}>
      {/* Logo Section - isolated, with clear boundary */}
      <div className="w-full flex justify-center items-center py-3 border-b z-50 bg-inherit" style={{ borderColor: isLightTheme ? '#DCD8C0' : 'rgba(255,255,255,0.1)' }}>
        <div className="flex justify-center items-center w-full h-full">
          <img 
            src="/lovable-uploads/3346c76f-f91c-4791-b77d-adb2f34a06af.png" 
            alt="Boutique Family Office Logo" 
            className="h-16 w-auto"
          />
        </div>
      </div>
      
      {/* Content Section - positioned directly below logo section */}
      <div className="flex flex-1 overflow-hidden">
        <aside
          className={cn(
            "flex flex-col transition-all duration-300 ease-in-out z-30",
            mainSidebarCollapsed ? "w-[70px]" : "w-[220px]",
            isLightTheme ? "bg-[#F9F7E8] border-r border-[#DCD8C0]" : "bg-[#1B1B32] border-r border-white/10"
          )}
        >
          <div className="flex flex-col h-full">
            {!mainSidebarCollapsed && (
              <div className="border-b border-sidebar-border">
                <UserProfileSection onMenuItemClick={handleProfileMenuItemClick} showLogo={false} />
              </div>
            )}
            
            <div className="overflow-y-auto mt-1 flex-1">
              <nav className="px-4 space-y-1.5">
                {mainMenuItems.map((item) => {
                  const isActive = item.id === currentPath;
                  const Icon = item.icon;
                  
                  return (
                    <Link
                      key={item.id}
                      to={item.href}
                      className={cn(
                        "group flex items-center py-2 px-3 rounded-md transition-colors text-[14px] whitespace-nowrap border",
                        isActive
                          ? isLightTheme ? "bg-[#E9E7D8] text-[#222222] font-medium border-primary" : "bg-black text-[#E2E2E2] font-medium border-primary"
                          : isLightTheme ? "text-[#222222] border-transparent" : "text-[#E2E2E2] border-transparent",
                        isLightTheme ? "hover:bg-[#E9E7D8] hover:border-primary" : "hover:bg-white/10 hover:border-primary"
                      )}
                    >
                      {typeof Icon === 'function' ? (
                        <div className={`flex items-center justify-center rounded-sm p-0.5 mr-3 ${isLightTheme ? 'bg-[#222222]' : 'bg-black'}`}>
                          <Icon />
                        </div>
                      ) : (
                        <Icon 
                          className={cn("h-5 w-5", !mainSidebarCollapsed && "mr-3")} 
                          style={{ 
                            backgroundColor: isLightTheme ? '#222222' : '#000', 
                            padding: '2px', 
                            borderRadius: '2px' 
                          }} 
                        />
                      )}
                      {!mainSidebarCollapsed && (
                        <span className="whitespace-nowrap overflow-hidden text-ellipsis">{item.label}</span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
            
            <AdvisorSection 
              advisorInfo={advisorInfo}
              onViewProfile={handleViewProfile}
              onBookSession={handleBookSession}
              collapsed={mainSidebarCollapsed}
            />
          </div>
        </aside>

        {hasSecondaryMenu && (
          <aside
            className={cn(
              "flex flex-col transition-all duration-300 ease-in-out z-20",
              secondarySidebarCollapsed ? "w-[0px]" : "w-[200px]",
              isLightTheme ? "bg-[#F9F7E8] border-r border-[#DCD8C0]" : "bg-[#1B1B32] border-r border-sidebar-border"
            )}
          >
            <div className={`flex items-center h-[70px] px-6 border-b ${isLightTheme ? 'border-[#DCD8C0]' : 'border-sidebar-border'}`}>
              {!secondarySidebarCollapsed && (
                <span className={`font-medium truncate ${isLightTheme ? 'text-[#222222]' : 'text-[#E2E2E2]'}`}>Sections</span>
              )}
            </div>

            {!secondarySidebarCollapsed && (
              <div className="flex-1 py-6 overflow-y-auto">
                <nav className="px-4 space-y-2">
                  {menuItems.map((item) => (
                    <Link
                      key={item.id}
                      to={`/${activeMainItem}/${item.id}`}
                      className={cn(
                        "group flex items-center py-2 px-3 rounded-md transition-colors text-[14px] border",
                        item.id === sectionId || item.active
                          ? isLightTheme 
                            ? "bg-[#E9E7D8] text-[#222222] font-medium border-primary" 
                            : "bg-sidebar-accent text-accent border-primary"
                          : isLightTheme ? "text-[#222222] border-transparent" : "text-[#E2E2E2] border-transparent",
                        isLightTheme ? "hover:bg-[#E9E7D8] hover:border-primary" : "hover:bg-sidebar-accent hover:border-primary"
                      )}
                    >
                      <span>{item.name || item.label}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            )}
          </aside>
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          {isHomePage ? (
            <div className="flex flex-col items-center w-full">
              {/* Removed p-8 to eliminate extra padding/gap */}
            </div>
          ) : null}
          
          <main className="flex-1 overflow-y-auto p-4 font-sans w-full">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
