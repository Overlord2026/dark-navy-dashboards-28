
import { ReactNode, useState } from "react";
import * as React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
  GraduationCapIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserProfileSection } from "@/components/sidebar/UserProfileSection";
import { Header } from "@/components/ui/Header";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";

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
  { id: "documents", label: "Documents", icon: FileIcon, href: "/documents" },
  { id: "sharing", label: "Sharing", icon: ShareIcon, href: "/sharing" },
  { id: "education", label: "Education", icon: GraduationCapIcon, href: "/education" },
  { id: "financial-plans", label: "Financial Plans", icon: BarChart3Icon, href: "/financial-plans" },
  { id: "investments", label: "Investments", icon: PiggyBankIcon, href: "/investments" },
  { id: "insurance", label: "Insurance", icon: ShieldIcon, href: "/insurance" },
  { id: "lending", label: "Lending", icon: CreditCardIcon, href: "/lending" },
  { id: "cash-management", label: "Cash Management", icon: WalletIcon, href: "/cash-management" },
  { id: "transfers", label: "Transfers", icon: ArrowRightLeftIcon, href: "/transfers" },
  { id: "tax-budgets", label: "Tax Budgets", icon: ReceiptIcon, href: "/tax-budgets" },
];

const documentSubMenuItems: MenuItem[] = [
  { id: "all-documents", name: "All Documents", active: true },
  { id: "business-ownership", name: "Business Ownership" },
  { id: "education", name: "Education" },
  { id: "estate-planning", name: "Estate Planning" },
  { id: "insurance-policies", name: "Insurance Policies" },
  { id: "leases", name: "Leases" },
  { id: "taxes", name: "Taxes" },
  { id: "trusts", name: "Trusts" },
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
    case "documents":
      return documentSubMenuItems;
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
  activeMainItem = "documents",
  activeSecondaryItem = "all-documents",
  secondaryMenuItems,
  breadcrumbs
}: ThreeColumnLayoutProps) {
  const [mainSidebarCollapsed, setMainSidebarCollapsed] = useState(false);
  const [secondarySidebarCollapsed, setSecondarySidebarCollapsed] = useState(false);
  const { theme } = useTheme();
  const { userProfile } = useUser();
  
  const params = useParams();
  const navigate = useNavigate();
  
  const sectionId = params.sectionId || activeSecondaryItem;
  
  const menuItems = secondaryMenuItems || getSecondaryMenuItems(activeMainItem);
  
  const hasSecondaryMenu = menuItems.length > 0;
  const isLightTheme = theme === "light";

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
          "h-screen flex flex-col transition-all duration-300 ease-in-out z-30",
          mainSidebarCollapsed ? "w-[70px]" : "w-[220px]",
          isLightTheme ? "bg-[#F9F7E8] border-r border-[#DCD8C0]" : "bg-[#1B1B32] border-r border-white/10"
        )}
      >
        <div className={`flex items-center justify-center h-[70px] px-6 border-b ${isLightTheme ? 'border-[#DCD8C0]' : 'border-white/10'}`}>
          {mainSidebarCollapsed ? (
            <div className="w-12 h-12 flex items-center justify-center">
              <img 
                src="/lovable-uploads/3346c76f-f91c-4791-b77d-adb2f34a06af.png" 
                alt="Boutique Family Office" 
                className="h-10 w-auto" 
              />
            </div>
          ) : (
            <div className="flex items-center justify-center w-full">
              <img 
                src="/lovable-uploads/3346c76f-f91c-4791-b77d-adb2f34a06af.png" 
                alt="Boutique Family Office" 
                className="h-14 w-auto" 
              />
            </div>
          )}
        </div>

        {!mainSidebarCollapsed && (
          <UserProfileSection onMenuItemClick={handleProfileMenuItemClick} showLogo={false} />
        )}

        <div className="flex-1 py-6 overflow-y-auto">
          <nav className="px-4 space-y-2">
            {mainMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === activeMainItem;
              return (
                <Link
                  key={item.id}
                  to={item.href}
                  className={cn(
                    "group flex items-center py-2 px-3 rounded-md transition-colors text-[14px] whitespace-nowrap",
                    "hover:bg-white/10",
                    isActive
                      ? isLightTheme ? "bg-[#E9E7D8] text-[#222222]" : "bg-black text-[#E2E2E2]"
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
          className={`absolute top-[70px] right-0 translate-x-1/2 h-8 w-8 rounded-full bg-background border border-border text-foreground hover:bg-accent hover:text-sidebar-primary-foreground z-40 ${isLightTheme ? 'bg-[#F9F7E8] text-[#222222] border-[#DCD8C0]' : ''}`}
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
            "h-screen flex flex-col transition-all duration-300 ease-in-out z-20",
            secondarySidebarCollapsed ? "w-[0px]" : "w-[200px]",
            isLightTheme ? "bg-[#F9F7E8] border-r border-[#DCD8C0]" : "bg-[#1B1B32] border-r border-sidebar-border"
          )}
        >
          <div className={`flex items-center h-[70px] px-6 border-b ${isLightTheme ? 'border-[#DCD8C0]' : 'border-sidebar-border'}`}>
            {!secondarySidebarCollapsed && (
              <span className={`font-medium truncate pt-4 ${isLightTheme ? 'text-[#222222]' : 'text-[#E2E2E2]'}`}>Sections</span>
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
            className={`absolute top-[70px] h-8 w-8 rounded-full border text-foreground z-40 ${
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
        <div className="flex justify-center py-4">
          <img 
            src="/lovable-uploads/3346c76f-f91c-4791-b77d-adb2f34a06af.png" 
            alt="Boutique Family Office Logo" 
            className="h-20 w-auto"
          />
        </div>
        <h1 className={`text-[24px] font-semibold p-6 pb-0 ${isLightTheme ? 'text-[#222222]' : 'text-[#E2E2E2]'}`}>{title}</h1>
        <main className="flex-1 overflow-y-auto p-6 pt-3 font-sans">
          {children}
        </main>
      </div>
    </div>
  );
}

// Re-add the getSecondaryMenuItems function
const getSecondaryMenuItems = (activeMainItem: string): MenuItem[] => {
  switch (activeMainItem) {
    case "documents":
      return [
        { id: "all-documents", name: "All Documents", active: true },
        { id: "business-ownership", name: "Business Ownership" },
        { id: "education", name: "Education" },
        { id: "estate-planning", name: "Estate Planning" },
        { id: "insurance-policies", name: "Insurance Policies" },
        { id: "leases", name: "Leases" },
        { id: "taxes", name: "Taxes" },
        { id: "trusts", name: "Trusts" },
      ];
    case "accounts":
      return [
        { id: "all-accounts", name: "All Accounts", active: true },
        { id: "checking", name: "Checking" },
        { id: "savings", name: "Savings" },
        { id: "investment", name: "Investment" },
        { id: "retirement", name: "Retirement" },
      ];
    case "sharing":
      return [
        { id: "shared-with-me", name: "Shared With Me", active: true },
        { id: "shared-by-me", name: "Shared By Me" },
        { id: "collaborators", name: "Collaborators" },
      ];
    case "education":
      return [
        { id: "all-courses", name: "All Courses", active: true },
        { id: "financial-basics", name: "Financial Basics" },
        { id: "investing", name: "Investing" },
        { id: "retirement", name: "Retirement" },
        { id: "premium", name: "Premium Courses" },
      ];
    default:
      return [];
  }
};
