import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  CreditCard, 
  Shield, 
  Bell, 
  Palette, 
  HelpCircle, 
  FileText,
  Settings,
  ChevronLeft,
  Users,
  Building,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';

interface SettingsLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const SettingsLayout: React.FC<SettingsLayoutProps> = ({
  children,
  activeTab,
  onTabChange
}) => {
  const { user } = useAuth();
  const { subscriptionPlan } = useSubscriptionAccess();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Determine user role for role-specific features
  const userRole = user?.user_metadata?.role || 'client';
  const isAdvisor = userRole === 'advisor' || userRole === 'admin';
  const isAdmin = userRole === 'admin' || userRole === 'system_administrator';

  const settingsSections = [
    {
      id: 'account',
      label: 'Account',
      icon: User,
      description: 'Profile and basic settings'
    },
    {
      id: 'subscription',
      label: 'Subscription',
      icon: CreditCard,
      description: 'Plan and billing management',
      badge: subscriptionPlan?.tier || 'basic'
    },
    {
      id: 'security',
      label: 'Security',
      icon: Shield,
      description: '2FA, passwords, sessions'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      description: 'Email, SMS, push preferences'
    },
    {
      id: 'personalization',
      label: 'Personalization',
      icon: Palette,
      description: 'Theme, dashboard, privacy'
    },
    ...(isAdvisor ? [{
      id: 'team',
      label: 'Team Management',
      icon: Users,
      description: 'Manage team members and permissions'
    }] : []),
    ...(userRole === 'system_administrator' ? [{
      id: 'integrations',
      label: 'Integration Management',
      icon: ExternalLink,
      description: 'Manage external partner integrations'
    }] : []),
    ...(isAdmin ? [{
      id: 'admin',
      label: 'Admin Settings',
      icon: Building,
      description: 'Compliance, audit logs, admin controls'
    }] : []),
    {
      id: 'support',
      label: 'Support & Help',
      icon: HelpCircle,
      description: 'Get help and contact support'
    },
    {
      id: 'legal',
      label: 'Legal & Data',
      icon: FileText,
      description: 'Privacy, terms, data management'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="md:hidden border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => window.history.back()}
              className="p-2"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="font-semibold">Settings</h1>
              <p className="text-xs text-muted-foreground">
                {settingsSections.find(s => s.id === activeTab)?.label}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {settingsSections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <Button
                        key={section.id}
                        variant={activeTab === section.id ? "secondary" : "ghost"}
                        className="w-full justify-start h-auto p-3"
                        onClick={() => onTabChange(section.id)}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <Icon className="h-4 w-4 flex-shrink-0" />
                          <div className="text-left flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium truncate">{section.label}</span>
                              {section.badge && (
                                <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                                  {section.badge}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              {section.description}
                            </p>
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <div className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-20">
              <div className="fixed inset-x-0 top-16 bottom-0 bg-background border-t">
                <div className="p-4">
                  <h2 className="font-semibold mb-4">Settings Menu</h2>
                  <nav className="space-y-1">
                    {settingsSections.map((section) => {
                      const Icon = section.icon;
                      return (
                        <Button
                          key={section.id}
                          variant={activeTab === section.id ? "secondary" : "ghost"}
                          className="w-full justify-start h-auto p-3"
                          onClick={() => {
                            onTabChange(section.id);
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <Icon className="h-4 w-4 flex-shrink-0" />
                            <div className="text-left flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{section.label}</span>
                                {section.badge && (
                                  <Badge variant="secondary" className="text-xs">
                                    {section.badge}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {section.description}
                              </p>
                            </div>
                          </div>
                        </Button>
                      );
                    })}
                  </nav>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="lg:col-span-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};