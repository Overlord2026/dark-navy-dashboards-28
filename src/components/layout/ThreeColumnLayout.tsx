
import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon, UserIcon, UsersIcon, FileIcon, HomeIcon, BarChart3Icon, ShieldIcon, PiggyBankIcon, CreditCardIcon, WalletIcon, ArrowRightLeftIcon, ReceiptIcon, ShareIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

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
}

const mainMenuItems = [
  { id: "home", label: "Home", icon: HomeIcon },
  { id: "accounts", label: "Accounts", icon: WalletIcon },
  { id: "documents", label: "Documents", icon: FileIcon },
  { id: "sharing", label: "Sharing", icon: ShareIcon },
  { id: "financial-plans", label: "Financial Plans", icon: BarChart3Icon },
  { id: "investments", label: "Investments", icon: PiggyBankIcon },
  { id: "insurance", label: "Insurance", icon: ShieldIcon },
  { id: "lending", label: "Lending", icon: CreditCardIcon },
  { id: "cash-management", label: "Cash Management", icon: WalletIcon },
  { id: "transfers", label: "Transfers", icon: ArrowRightLeftIcon },
  { id: "tax-budgets", label: "Tax Budgets", icon: ReceiptIcon },
];

const defaultSecondaryMenuItems: MenuItem[] = [
  { id: "all-documents", name: "All Documents", active: true },
  { id: "tax-documents", name: "Tax Documents" },
  { id: "statements", name: "Statements" },
  { id: "reports", name: "Reports" },
  { id: "agreements", name: "Agreements" },
  { id: "shared-docs", name: "Shared Documents" },
];

export function ThreeColumnLayout({ 
  children, 
  title = "BFO CFO Dashboard", 
  activeMainItem = "documents",
  activeSecondaryItem = "all-documents",
  secondaryMenuItems = defaultSecondaryMenuItems
}: ThreeColumnLayoutProps) {
  const [mainSidebarCollapsed, setMainSidebarCollapsed] = useState(false);
  const [secondarySidebarCollapsed, setSecondarySidebarCollapsed] = useState(false);

  const toggleMainSidebar = () => {
    setMainSidebarCollapsed(!mainSidebarCollapsed);
  };

  const toggleSecondarySidebar = () => {
    setSecondarySidebarCollapsed(!secondarySidebarCollapsed);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Primary Sidebar */}
      <aside
        className={cn(
          "h-screen flex flex-col bg-[#0F0F2D] transition-all duration-300 ease-in-out z-30",
          mainSidebarCollapsed ? "w-[70px]" : "w-[220px]"
        )}
      >
        <div className="flex items-center h-[60px] px-4 border-b border-white/10">
          {!mainSidebarCollapsed ? (
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-md bg-accent flex items-center justify-center mr-2">
                <span className="font-semibold text-white">F</span>
              </div>
              <span className="font-semibold text-white truncate">Farther</span>
            </div>
          ) : (
            <div className="h-8 w-8 rounded-md bg-accent flex items-center justify-center mx-auto">
              <span className="font-semibold text-white">F</span>
            </div>
          )}
        </div>

        <div className="flex-1 py-4 overflow-y-auto">
          <nav className="px-2 space-y-1">
            {mainMenuItems.map((item) => {
              const Icon = item.icon || (() => <span>{item.id.charAt(0).toUpperCase()}</span>);
              return (
                <a
                  key={item.id}
                  href={`/${item.id !== 'home' ? item.id : ''}`}
                  className={cn(
                    "group flex items-center py-2 px-3 rounded-md transition-colors",
                    "hover:bg-white/10",
                    item.id === activeMainItem || item.active
                      ? "bg-white/20 text-white"
                      : "text-gray-300"
                  )}
                >
                  <Icon className={cn("h-5 w-5", !mainSidebarCollapsed && "mr-3")} />
                  {!mainSidebarCollapsed && <span>{item.label}</span>}
                </a>
              );
            })}
          </nav>
        </div>

        <div className="p-3 border-t border-white/10 m-2 rounded-md bg-white/5">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-accent/30 flex items-center justify-center">
              <UserIcon className="h-4 w-4 text-white" />
            </div>
            {!mainSidebarCollapsed && (
              <div className="ml-2">
                <p className="text-xs text-white font-medium">Advisor:</p>
                <p className="text-xs text-white/80">Daniel Herrera</p>
              </div>
            )}
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute top-[70px] right-0 translate-x-1/2 h-8 w-8 rounded-full bg-background border border-border text-foreground hover:bg-accent hover:text-white z-40"
          onClick={toggleMainSidebar}
        >
          {mainSidebarCollapsed ? (
            <ChevronRightIcon className="h-4 w-4" />
          ) : (
            <ChevronLeftIcon className="h-4 w-4" />
          )}
        </Button>
      </aside>

      {/* Secondary Sidebar */}
      <aside
        className={cn(
          "h-screen flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out z-20",
          secondarySidebarCollapsed ? "w-[0px]" : "w-[200px]"
        )}
      >
        <div className="flex items-center h-[60px] px-4 border-b border-sidebar-border">
          {!secondarySidebarCollapsed && (
            <span className="font-medium text-sidebar-foreground truncate">Sections</span>
          )}
        </div>

        {!secondarySidebarCollapsed && (
          <>
            <div className="flex-1 py-4 overflow-y-auto">
              <nav className="px-2 space-y-1">
                {secondaryMenuItems.map((item) => (
                  <a
                    key={item.id}
                    href={`/${activeMainItem}/${item.id}`}
                    className={cn(
                      "group flex items-center py-2 px-3 rounded-md transition-colors",
                      "hover:bg-sidebar-accent",
                      item.id === activeSecondaryItem || item.active
                        ? "bg-sidebar-accent text-sidebar-primary"
                        : "text-sidebar-foreground"
                    )}
                  >
                    <span>{item.name || item.label}</span>
                  </a>
                ))}
              </nav>
            </div>
          </>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="absolute top-[70px] left-[220px] ml-0.5 h-8 w-8 rounded-full bg-background border border-border text-foreground hover:bg-accent hover:text-white z-40"
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="w-full px-4 py-3 flex items-center justify-between border-b border-border/70 bg-background/95 backdrop-blur-sm z-10">
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
