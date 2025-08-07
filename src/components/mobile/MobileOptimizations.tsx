import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Smartphone, 
  Monitor, 
  Tablet, 
  Menu, 
  X,
  ChevronDown,
  Settings,
  User,
  Bell,
  Search,
  Plus,
  Home,
  BarChart3,
  Users,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileOptimizationsProps {
  children: React.ReactNode;
  className?: string;
}

export const MobileOptimizations: React.FC<MobileOptimizationsProps> = ({ 
  children, 
  className 
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div className={cn("relative", className)}>
      {/* Mobile Header */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            <h1 className="font-semibold truncate">Boutique Family Office</h1>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed left-0 top-0 bottom-0 z-50 w-64 bg-background border-r">
            <MobileSidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </>
      )}

      {/* Main Content */}
      <div className={cn(
        "transition-all duration-300",
        isMobile && "pt-16", // Account for fixed header
        className
      )}>
        {children}
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && <MobileBottomNav />}
    </div>
  );
};

const MobileSidebar: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const navigation = [
    { name: "Dashboard", icon: Home, href: "/" },
    { name: "Analytics", icon: BarChart3, href: "/analytics" },
    { name: "Contacts", icon: Users, href: "/contacts" },
    { name: "Documents", icon: FileText, href: "/documents" },
    { name: "Settings", icon: Settings, href: "/settings" }
  ];

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-semibold">Menu</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <nav className="flex-1 space-y-2">
        {navigation.map((item) => (
          <Button
            key={item.name}
            variant="ghost"
            className="w-full justify-start gap-3"
            onClick={onClose}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Button>
        ))}
      </nav>
      
      <div className="border-t pt-4">
        <Button variant="ghost" className="w-full justify-start gap-3">
          <User className="h-4 w-4" />
          Profile
        </Button>
      </div>
    </div>
  );
};

const MobileBottomNav: React.FC = () => {
  const [activeTab, setActiveTab] = useState("home");
  
  const tabs = [
    { id: "home", icon: Home, label: "Home" },
    { id: "analytics", icon: BarChart3, label: "Analytics" },
    { id: "contacts", icon: Users, label: "Contacts" },
    { id: "add", icon: Plus, label: "Add" },
    { id: "profile", icon: User, label: "Profile" }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t">
      <div className="grid grid-cols-5 h-16">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 transition-colors",
              activeTab === tab.id
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className={cn(
              "h-5 w-5",
              tab.id === "add" && "h-6 w-6"
            )} />
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Mobile-optimized components
export const MobileCard: React.FC<{
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, description, children, className }) => {
  return (
    <Card className={cn("m-4", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && (
          <CardDescription className="text-sm">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  );
};

export const MobileActionButton: React.FC<{
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  variant?: "default" | "outline" | "ghost";
  className?: string;
}> = ({ icon: Icon, label, onClick, variant = "default", className }) => {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      className={cn("h-auto py-3 px-4 flex-col gap-2", className)}
    >
      <Icon className="h-5 w-5" />
      <span className="text-xs">{label}</span>
    </Button>
  );
};

export const MobileGrid: React.FC<{
  children: React.ReactNode;
  cols?: 2 | 3 | 4;
  className?: string;
}> = ({ children, cols = 2, className }) => {
  return (
    <div className={cn(
      "grid gap-4 p-4",
      cols === 2 && "grid-cols-2",
      cols === 3 && "grid-cols-3", 
      cols === 4 && "grid-cols-2 sm:grid-cols-4",
      className
    )}>
      {children}
    </div>
  );
};

// Responsive wrapper for existing components
export const ResponsiveWrapper: React.FC<{
  children: React.ReactNode;
  mobileComponent?: React.ReactNode;
  tabletComponent?: React.ReactNode;
}> = ({ children, mobileComponent, tabletComponent }) => {
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 768) {
        setScreenSize('mobile');
      } else if (window.innerWidth < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (screenSize === 'mobile' && mobileComponent) {
    return <>{mobileComponent}</>;
  }

  if (screenSize === 'tablet' && tabletComponent) {
    return <>{tabletComponent}</>;
  }

  return <>{children}</>;
};

// Device preview component for testing
export const DevicePreview: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  return (
    <div className="p-6 bg-muted/50 min-h-screen">
      <div className="flex items-center justify-center gap-4 mb-6">
        <Button
          variant={device === 'mobile' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setDevice('mobile')}
          className="gap-2"
        >
          <Smartphone className="h-4 w-4" />
          Mobile
        </Button>
        <Button
          variant={device === 'tablet' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setDevice('tablet')}
          className="gap-2"
        >
          <Tablet className="h-4 w-4" />
          Tablet
        </Button>
        <Button
          variant={device === 'desktop' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setDevice('desktop')}
          className="gap-2"
        >
          <Monitor className="h-4 w-4" />
          Desktop
        </Button>
      </div>

      <div className="flex justify-center">
        <div className={cn(
          "bg-background border rounded-lg overflow-hidden transition-all duration-300",
          device === 'mobile' && "w-[375px] h-[667px]",
          device === 'tablet' && "w-[768px] h-[1024px]",
          device === 'desktop' && "w-full max-w-6xl min-h-[800px]"
        )}>
          <div className={cn(
            "h-full overflow-auto",
            device !== 'desktop' && "scale-75 origin-top-left"
          )}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};