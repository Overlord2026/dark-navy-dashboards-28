import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Menu,
  Home,
  Users,
  BarChart3,
  Settings,
  Bell,
  Search,
  Plus,
  Filter,
  ChevronDown,
  Calendar,
  MessageSquare,
  Target,
  TrendingUp,
  Calculator,
  FileText,
  Briefcase,
  BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResponsiveDashboardProps {
  children: React.ReactNode;
  persona: 'advisor' | 'cpa' | 'attorney' | 'realtor' | 'consultant';
}

export function ResponsiveDashboard({ children, persona }: ResponsiveDashboardProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getPersonaNavItems = () => {
    const baseItems = [
      { id: 'overview', label: 'Overview', icon: Home },
      { id: 'pipeline', label: 'Pipeline', icon: Target },
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      { id: 'clients', label: 'Clients', icon: Users },
    ];

    switch (persona) {
      case 'advisor':
        return [
          ...baseItems,
          { id: 'portfolio', label: 'Portfolio', icon: TrendingUp },
          { id: 'compliance', label: 'Compliance', icon: Settings }
        ];
      case 'cpa':
        return [
          ...baseItems,
          { id: 'tax', label: 'Tax Tools', icon: Calculator },
          { id: 'documents', label: 'Documents', icon: FileText }
        ];
      case 'attorney':
        return [
          ...baseItems,
          { id: 'cases', label: 'Cases', icon: Briefcase },
          { id: 'contracts', label: 'Contracts', icon: FileText }
        ];
      case 'realtor':
        return [
          ...baseItems,
          { id: 'properties', label: 'Properties', icon: Home },
          { id: 'showings', label: 'Showings', icon: Calendar }
        ];
      case 'consultant':
        return [
          ...baseItems,
          { id: 'projects', label: 'Projects', icon: Briefcase },
          { id: 'resources', label: 'Resources', icon: BookOpen }
        ];
      default:
        return baseItems;
    }
  };

  const navItems = getPersonaNavItems();

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        {/* Mobile Header */}
        <header className="sticky top-0 z-50 bg-background border-b border-border px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="touch-target"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="font-semibold text-lg capitalize">{persona} Dashboard</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="touch-target">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="touch-target relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0">
                  3
                </Badge>
              </Button>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Tabs */}
        <div className="sticky top-16 z-40 bg-background border-b border-border">
          <div className="flex overflow-x-auto px-4 py-2 gap-2 scrollbar-hide">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab(item.id)}
                  className="whitespace-nowrap touch-target shrink-0"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Mobile Content */}
        <main className="p-4 pb-20">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-4 py-2 z-50">
          <div className="grid grid-cols-4 gap-2">
            <Button variant="ghost" size="sm" className="flex flex-col gap-1 h-12 touch-target">
              <Home className="h-4 w-4" />
              <span className="text-xs">Home</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex flex-col gap-1 h-12 touch-target">
              <Target className="h-4 w-4" />
              <span className="text-xs">Pipeline</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex flex-col gap-1 h-12 touch-target">
              <Users className="h-4 w-4" />
              <span className="text-xs">Clients</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex flex-col gap-1 h-12 touch-target">
              <BarChart3 className="h-4 w-4" />
              <span className="text-xs">Analytics</span>
            </Button>
          </div>
        </nav>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50">
            <div 
              className="absolute inset-0 bg-black/50" 
              onClick={() => setSidebarOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full w-80 bg-background border-r border-border p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">Menu</h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSidebarOpen(false)}
                  >
                    ×
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.id}
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                          setActiveTab(item.id);
                          setSidebarOpen(false);
                        }}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {item.label}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="w-64 border-r border-border bg-muted/10 min-h-screen">
          <div className="p-6">
            <h1 className="font-bold text-xl capitalize">{persona} Dashboard</h1>
          </div>
          
          <nav className="px-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </aside>

        {/* Desktop Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

// Mobile-optimized component utilities
export const MobileCard = ({ children, className, ...props }: any) => (
  <Card className={cn("touch-friendly", className)} {...props}>
    {children}
  </Card>
);

export const TouchButton = ({ children, className, ...props }: any) => (
  <Button className={cn("touch-target", className)} {...props}>
    {children}
  </Button>
);

export const MobileGrid = ({ children, className, ...props }: any) => (
  <div className={cn("grid gap-4 grid-cols-1 sm:grid-cols-2", className)} {...props}>
    {children}
  </div>
);

// Touch-friendly styles
export const mobileStyles = {
  touchTarget: "min-h-[44px] min-w-[44px]", // Minimum touch target size
  touchFriendly: "p-4 rounded-lg", // Larger padding for easier interaction
  scrollContainer: "overflow-x-auto scrollbar-hide", // Hide scrollbars on mobile
  mobileOnly: "block md:hidden", // Show only on mobile
  desktopOnly: "hidden md:block", // Show only on desktop
};