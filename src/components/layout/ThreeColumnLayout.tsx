import { ReactNode, useState } from "react";
import * as React from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  UserIcon, 
  HomeIcon,
  BarChart3Icon, 
  ShieldIcon, 
  BanknoteIcon, 
  WalletIcon, 
  FileTextIcon, 
  ShareIcon, 
  GraduationCapIcon,
  BookOpenIcon,
  UserRoundIcon,
  CoinsIcon,
  ChevronDown,
  ChevronRight,
  BuildingIcon,
  Users2Icon,
  HeartHandshakeIcon,
  VaultIcon,
  LineChartIcon,
  CircleDollarSignIcon,
  ArchiveIcon,
  PieChart,
  ArrowRightLeft,
  Calculator,
  Receipt
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
  subItems?: MainMenuItem[];
};

type NavCategory = {
  id: string;
  label: string;
  items: MainMenuItem[];
  defaultExpanded?: boolean;
};

const CustomHomeIcon: React.FC = () => (
  <img 
    src="/lovable-uploads/e4ac2159-1b66-4f15-9257-68a0f00c8311.png" 
    alt="Home"
    className="h-5 w-5"
  />
);

const navigationCategories: NavCategory[] = [
  {
    id: "home",
    label: "Home",
    defaultExpanded: true,
    items: [
      { id: "home", label: "Home", icon: CustomHomeIcon, href: "/" },
    ]
  },
  {
    id: "education-solutions",
    label: "Education & Solutions",
    defaultExpanded: true,
    items: [
      { id: "education", label: "Education Center", icon: GraduationCapIcon, href: "/education" },
      { id: "investments", label: "Investments", icon: BarChart3Icon, href: "/investments" },
      { id: "tax-planning", label: "Tax Planning", icon: PieChart, href: "/education/tax-planning" },
      { id: "insurance", label: "Insurance", icon: ShieldIcon, href: "/insurance" },
      { id: "lending", label: "Lending", icon: BanknoteIcon, href: "/lending" },
      { id: "estate-planning", label: "Estate Planning", icon: ArchiveIcon, href: "/estate-planning" },
    ]
  },
  {
    id: "family-wealth",
    label: "Family Wealth",
    defaultExpanded: true,
    items: [
      { id: "financial-plans", label: "Financial Plans", icon: LineChartIcon, href: "/financial-plans" },
      { id: "accounts", label: "Accounts Overview", icon: WalletIcon, href: "/accounts" },
      { id: "cash-management", label: "Cash Management", icon: BanknoteIcon, href: "/cash-management" },
      { id: "tax-budgets", label: "Tax & Budgets", icon: Calculator, href: "/tax-budgets" },
      { id: "transfers", label: "Transfers", icon: ArrowRightLeft, href: "/transfers" },
      { id: "legacy-vault", label: "Secure Family Vault", icon: VaultIcon, href: "/legacy-vault" },
      { id: "social-security", label: "Social Security", icon: CircleDollarSignIcon, href: "/social-security" },
      { id: "properties", label: "Real Estate & Properties", icon: BuildingIcon, href: "/properties" },
      { id: "billpay", label: "Bill Pay", icon: Receipt, href: "/billpay" },
    ]
  },
  {
    id: "collaboration",
    label: "Collaboration & Sharing",
    items: [
      { id: "documents", label: "Document Sharing", icon: FileTextIcon, href: "/documents" },
      { id: "professionals", label: "Professional Access", icon: Users2Icon, href: "/professionals" },
      { id: "sharing", label: "Family Member Access", icon: ShareIcon, href: "/sharing" },
    ]
  },
];

const accountsSubMenuItems: MenuItem[] = [];

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
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(
    navigationCategories.reduce((acc, category) => {
      acc[category.id] = category.defaultExpanded ?? false;
      return acc;
    }, {} as Record<string, boolean>)
  );
  
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

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
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
      <div className="w-full flex justify-center items-center py-2 border-b z-50 bg-inherit sticky top-0" style={{ borderColor: isLightTheme ? '#DCD8C0' : 'rgba(255,255,255,0.1)' }}>
        <Header />
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        <aside
          className={cn(
            "flex flex-col transition-all duration-300 ease-in-out z-30",
            mainSidebarCollapsed ? "w-[70px]" : "w-[220px]",
            isLightTheme ? "bg-[#F9F7E8] border-r border-[#DCD8C0]" : "bg-[#1B1B32] border-r border-white/10"
          )}
        >
          <div className="flex flex-col h-full">
            <div className={`px-4 ${isLightTheme ? 'border-[#DCD8C0]' : 'border-white/10'} mt-2 mb-2`}>
              <UserProfileSection onMenuItemClick={handleProfileMenuItemClick} showLogo={false} />
            </div>
            
            <div className="overflow-y-auto mt-0 flex-1">
              <nav className="px-2 space-y-1">
                {navigationCategories.map((category) => (
                  <div key={category.id} className="mb-2">
                    {!mainSidebarCollapsed && (
                      <Collapsible
                        open={expandedCategories[category.id]}
                        onOpenChange={() => toggleCategory(category.id)}
                      >
                        <CollapsibleTrigger asChild>
                          <div className={`flex items-center justify-between p-2 text-xs uppercase tracking-wider font-semibold ${isLightTheme ? 'text-[#222222]/70' : 'text-[#E2E2E2]/70'} cursor-pointer`}>
                            <span>{category.label}</span>
                            <div>
                              {expandedCategories[category.id] ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </div>
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-1.5">
                          {category.items.map((item) => {
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
                                  isLightTheme ? "hover:bg-[#E9E7D8] hover:border-primary" : "hover:bg-sidebar-accent hover:border-primary"
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
                                <span className="whitespace-nowrap overflow-hidden text-ellipsis">{item.label}</span>
                              </Link>
                            );
                          })}
                        </CollapsibleContent>
                      </Collapsible>
                    )}
                    
                    {mainSidebarCollapsed && (
                      <>
                        {category.items.map((item) => {
                          const isActive = item.id === currentPath;
                          const Icon = item.icon;
                          
                          return (
                            <Link
                              key={item.id}
                              to={item.href}
                              className={cn(
                                "group flex justify-center items-center py-2 px-2 my-2 rounded-md transition-colors text-[14px] border",
                                isActive
                                  ? isLightTheme 
                                    ? "bg-[#E9E7D8] text-[#222222] font-medium border-primary" 
                                    : "bg-sidebar-accent text-accent border-primary"
                                  : isLightTheme ? "text-[#222222] border-transparent" : "text-[#E2E2E2] border-transparent",
                                isLightTheme ? "hover:bg-[#E9E7D8] hover:border-primary" : "hover:bg-sidebar-accent hover:border-primary"
                              )}
                              title={item.label}
                            >
                              {typeof Icon === 'function' ? (
                                <div className={`flex items-center justify-center rounded-sm p-0.5 ${isLightTheme ? 'bg-[#222222]' : 'bg-black'}`}>
                                  <Icon />
                                </div>
                              ) : (
                                <Icon 
                                  className="h-5 w-5" 
                                  style={{ 
                                    backgroundColor: isLightTheme ? '#222222' : '#000', 
                                    padding: '2px', 
                                    borderRadius: '2px' 
                                  }} 
                                />
                              )}
                            </Link>
                          );
                        })}
                      </>
                    )}
                  </div>
                ))}
              </nav>
            </div>
            
            <div className={`px-4 mt-auto mb-3 ${isLightTheme ? 'border-[#DCD8C0]' : 'border-white/10'}`}>
              <AdvisorSection 
                advisorInfo={advisorInfo} 
                onViewProfile={handleViewProfile} 
                onBookSession={handleBookSession} 
                collapsed={mainSidebarCollapsed} 
              />
            </div>
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
            </div>
          ) : null}
          
          <main className="flex-1 overflow-y-auto p-3 font-sans w-full">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">{title}</h1>
              <TutorialButton tabId={currentPath} size="default" variant="default" />
            </div>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
