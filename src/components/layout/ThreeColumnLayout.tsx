import { ReactNode, useState } from "react";
import * as React from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
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
  { id: "accounts", label: "Accounts", icon: WalletIcon, href: "/accounts" },
  { id: "sharing", label: "Sharing", icon: ShareIcon, href: "/sharing" },
  { id: "education", label: "Education", icon: GraduationCapIcon, href: "/education" },
  { id: "financial-plans", label: "Financial Plans", icon: BarChart3Icon, href: "/financial-plans" },
  { id: "investments", label: "Investments", icon: PiggyBankIcon, href: "/investments" },
  { id: "insurance", label: "Insurance", icon: ShieldIcon, href: "/insurance" },
  { id: "lending", label: "Lending", icon: CreditCardIcon, href: "/lending" },
  { id: "cash-management", label: "Cash Management", icon: WalletIcon, href: "/cash-management" },
  { id: "transfers", label: "Transfers", icon: ArrowRightLeftIcon, href: "/transfers" },
  { id: "tax-budgets", label: "Tax Budgets", icon: ReceiptIcon, href: "/tax-budgets" },
  { id: "vault", label: "Legacy Vault", icon: BookOpenIcon, href: "/vault" },
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
    location: "New York, NY"
  };

  const handleBookSession = () => {
    console.log("Book session clicked");
    // This would typically open a booking calendar or external link
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
    <div className={`flex h-screen overflow-hidden ${isLightTheme ? 'bg-[#F9F7E8]' : 'bg-[#12121C]'}`}>
      <aside
        className={cn(
          "h-screen flex flex-col transition-all duration-300 ease-in-out z-30 pt-0",
          mainSidebarCollapsed ? "w-[70px]" : "w-[220px]",
          isLightTheme ? "bg-[#F9F7E8] border-r border-[#DCD8C0]" : "bg-[#1B1B32] border-r border-white/10"
        )}
      >
        {!mainSidebarCollapsed && (
          <div className="border-b border-sidebar-border">
            <UserProfileSection onMenuItemClick={handleProfileMenuItemClick} showLogo={false} />
          </div>
        )}
        
        <div className="flex-1 overflow-y-auto pt-[130px]">
          <nav className="px-4 space-y-2">
            {mainMenuItems.map((item) => {
              if (item.id === "education") return null;

              const isActive = item.id === currentPath;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.id}
                  to={item.href}
                  className={cn(
                    "group flex items-center py-2 px-3 rounded-md transition-colors text-[14px] whitespace-nowrap",
                    "hover:bg-white/10",
                    isActive
                      ? isLightTheme ? "bg-[#E9E7D8] text-[#222222] font-medium" : "bg-black text-[#E2E2E2] font-medium"
                      : isLightTheme ? "text-[#222222]" : "text-[#E2E2E2]",
                    isLightTheme ? "hover:bg-[#E9E7D8]" : "hover:bg-white/10"
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

        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-6 right-0 translate-x-1/2 h-8 w-8 rounded-full bg-background border border-border text-foreground hover:bg-accent hover:text-sidebar-primary-foreground z-40 ${isLightTheme ? 'bg-[#F9F7E8] text-[#222222] border-[#DCD8C0]' : ''}`}
          onClick={toggleMainSidebar}
        >
          {mainSidebarCollapsed ? (
            <ChevronRightIcon className="h-4 w-4" />
          ) : (
            <ChevronLeftIcon className="h-4 w-4" />
          )}
        </Button>
      </aside>

      {hasSecondaryMenu && (
        <aside
          className={cn(
            "h-screen flex flex-col transition-all duration-300 ease-in-out z-20 pt-[130px]",
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
                      "group flex items-center py-2 px-3 rounded-md transition-colors text-[14px]",
                      isLightTheme ? "hover:bg-[#E9E7D8]" : "hover:bg-sidebar-accent",
                      item.id === sectionId || item.active
                        ? isLightTheme 
                          ? "bg-[#E9E7D8] text-[#222222] font-medium" 
                          : "bg-sidebar-accent text-accent"
                        : isLightTheme ? "text-[#222222]" : "text-[#E2E2E2]"
                    )}
                  >
                    <span>{item.name || item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-[130px] h-8 w-8 rounded-full border text-foreground z-40 ${
              isLightTheme 
                ? 'bg-[#F9F7E8] text-[#222222] border-[#DCD8C0] hover:bg-[#E9E7D8]' 
                : 'bg-background border-border hover:bg-accent hover:text-sidebar-primary-foreground'
            }`}
            style={{ 
              left: mainSidebarCollapsed ? '70px' : '220px',
              opacity: secondarySidebarCollapsed ? 0.5 : 1
            }}
            onClick={toggleSecondarySidebar}
          >
            {secondarySidebarCollapsed ? (
              <ChevronRightIcon className="h-4 w-4" />
            ) : (
              <ChevronLeftIcon className="h-4 w-4" />
            )}
          </Button>
        </aside>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {isHomePage ? (
          <div className="flex flex-col items-start py-6 px-8">
            <div className="flex justify-center items-center space-x-6 mb-8 w-full">
              <Link to="/education" className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-100 transition-colors">
                <GraduationCapIcon className="h-5 w-5" />
                <span className="font-medium">Education Center</span>
              </Link>
              
              <img 
                src="/lovable-uploads/3346c76f-f91c-4791-b77d-adb2f34a06af.png" 
                alt="Boutique Family Office Logo" 
                className="h-20 w-auto"
              />
              
              <Link to="/vault" className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-100 transition-colors">
                <BookOpenIcon className="h-5 w-5" />
                <span className="font-medium">Legacy Vault</span>
              </Link>
            </div>
            
            <div className="flex justify-start items-center space-x-10 mb-4 pl-4">
              <Link to="/profile" className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-100 transition-colors">
                <UserIcon className="h-5 w-5" />
                <span className="font-medium">Client Profile</span>
              </Link>
              
              <Popover open={showAdvisorInfo} onOpenChange={setShowAdvisorInfo}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-100 transition-colors">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8 border-2 border-gray-700">
                        <AvatarFallback className="bg-primary/20 text-primary">CB</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">Advisor Profile</span>
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent 
                  className="w-80 bg-gray-900 border border-gray-700 text-white p-0 shadow-lg"
                  align="center"
                >
                  <div className="flex flex-col">
                    <div className="p-4 border-b border-gray-700 flex items-center space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback className="bg-primary/20 text-primary text-xl">CB</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold">{advisorInfo.name}</h3>
                        <p className="text-sm text-gray-400">{advisorInfo.title}</p>
                        <p className="text-sm text-gray-400">{advisorInfo.location}</p>
                      </div>
                    </div>
                    
                    <div className="p-4 space-y-3">
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="h-4 w-4 text-gray-400" />
                        <Button 
                          variant="outline" 
                          className="w-full justify-start border-gray-700 hover:bg-gray-800 text-white"
                          onClick={handleBookSession}
                        >
                          Schedule an Appointment
                        </Button>
                      </div>
                      
                      <div className="pt-2 border-t border-gray-700 space-y-1.5">
                        <p className="text-sm">
                          <span className="text-gray-400">Email: </span>
                          <a href={`mailto:${advisorInfo.email}`} className="text-blue-400 hover:underline">
                            {advisorInfo.email}
                          </a>
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-400">Phone: </span>
                          <a href={`tel:${advisorInfo.phone}`} className="text-blue-400 hover:underline">
                            {advisorInfo.phone}
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-4">
            <img 
              src="/lovable-uploads/3346c76f-f91c-4791-b77d-adb2f34a06af.png" 
              alt="Boutique Family Office Logo" 
              className="h-20 w-auto"
            />
          </div>
        )}
        
        <main className="flex-1 overflow-y-auto p-6 pl-10 font-sans">
          {children}
        </main>
      </div>
    </div>
  );
}
