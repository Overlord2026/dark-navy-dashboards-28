
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  CreditCard, 
  ArrowRightLeft, 
  FileText, 
  MoreHorizontal,
  User,
  UserPlus,
  Palette,
  Shield,
  LogOut,
  ChevronRight,
  Plus
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface MobileLayoutProps {
  children: React.ReactNode;
  title: string;
  showAddButton?: boolean;
  onAddButtonClick?: () => void;
}

export function MobileLayout({ 
  children, 
  title, 
  showAddButton = false,
  onAddButtonClick
}: MobileLayoutProps) {
  const location = useLocation();
  const { theme } = useTheme();
  const { userProfile } = useUser();
  const isMobile = useIsMobile();
  
  // If not on mobile, render the regular layout
  if (!isMobile) {
    return <>{children}</>;
  }

  const isActive = (path: string) => {
    return location.pathname === path || 
      (path !== "/" && location.pathname.startsWith(path));
  };

  return (
    <div className="flex flex-col h-screen bg-[#12121C] text-white overflow-hidden">
      {/* Mobile Status Bar */}
      <div className="w-full flex justify-between items-center px-4 py-2 bg-[#0D0D15]">
        <div className="text-xl font-bold">5:49</div>
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="h-3 w-1 bg-gray-400 rounded-sm"></div>
            <div className="h-4 w-1 bg-gray-400 rounded-sm"></div>
            <div className="h-5 w-1 bg-gray-400 rounded-sm"></div>
            <div className="h-6 w-1 bg-gray-400 rounded-sm"></div>
          </div>
          <div className="text-sm">5G</div>
          <div className="w-8 h-4 border border-gray-400 rounded-sm relative">
            <div className="absolute top-0.5 bottom-0.5 left-0.5 right-1 bg-gray-400 rounded-sm"></div>
          </div>
        </div>
      </div>
      
      {/* Page Header */}
      <header className="w-full flex justify-between items-center py-4 px-4 bg-[#12121C] border-b border-gray-800">
        <h1 className="text-2xl font-bold">{title}</h1>
        {showAddButton && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onAddButtonClick}
            className="text-white"
          >
            <Plus className="h-6 w-6" />
          </Button>
        )}
      </header>
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>
      
      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0D0D15] border-t border-gray-800 py-2">
        <div className="flex justify-around items-center">
          <NavItem 
            icon={<Home className="h-6 w-6" />} 
            label="Home" 
            href="/" 
            isActive={isActive('/')} 
          />
          <NavItem 
            icon={<CreditCard className="h-6 w-6" />} 
            label="Accounts" 
            href="/accounts" 
            isActive={isActive('/accounts')} 
          />
          <NavItem 
            icon={<ArrowRightLeft className="h-6 w-6" />} 
            label="Transfers" 
            href="/transfers" 
            isActive={isActive('/transfers')} 
          />
          <NavItem 
            icon={<FileText className="h-6 w-6" />} 
            label="Documents" 
            href="/documents" 
            isActive={isActive('/documents')} 
          />
          <NavItem 
            icon={<MoreHorizontal className="h-6 w-6" />} 
            label="More" 
            href="/more" 
            isActive={isActive('/more') || isActive('/tax-planning')} 
          />
        </div>
      </nav>
    </div>
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive: boolean;
}

function NavItem({ icon, label, href, isActive }: NavItemProps) {
  return (
    <Link
      to={href}
      className={`flex flex-col items-center justify-center px-3 ${
        isActive ? 'text-white' : 'text-gray-400'
      }`}
    >
      <div className="mb-1">{icon}</div>
      <span className="text-xs">{label}</span>
    </Link>
  );
}
