
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import { 
  Settings, 
  MessageSquare, 
  Home, 
  Users, 
  HelpCircle, 
  Shield,
  Monitor,
  Activity,
  Zap,
  AlertTriangle,
  BarChart3,
  ArrowLeft,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminPortalLayoutProps {
  children: React.ReactNode;
}

export function AdminPortalLayout({ children }: AdminPortalLayoutProps) {
  const { userProfile } = useUser();
  const location = useLocation();

  // Check if user has admin role
  if (!userProfile || !['admin', 'system_administrator', 'tenant_admin', 'superadmin'].includes(userProfile.role || '')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8 bg-card rounded-lg border">
          <h1 className="text-2xl font-bold text-destructive mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-4">You don't have permission to access this area.</p>
          <Button asChild>
            <Link to="/login">Return to Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  const adminNavItems = [
    { href: '/admin-portal', icon: Home, label: 'Dashboard' },
    { href: '/admin/diagnostics', icon: Activity, label: 'Diagnostics' },
    { href: '/admin-portal/edge-functions', icon: Zap, label: 'Edge Functions' },
    { href: '/admin-portal/system-health', icon: Monitor, label: 'System Health' },
    { href: '/admin-portal/analytics', icon: BarChart3, label: 'Analytics' },
    { href: '/admin-portal/compliance', icon: Shield, label: 'Compliance' },
    { href: '/admin-portal/users', icon: Users, label: 'Users' },
    { href: '/admin-portal/faqs', icon: HelpCircle, label: 'Manage FAQs' },
    { href: '/admin-portal/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-foreground">Admin Portal</h1>
            <div className="h-6 w-px bg-border" />
            <span className="text-sm text-muted-foreground">Welcome, {userProfile.displayName || userProfile.email}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" asChild>
              <Link to="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Main App
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Goals & Aspirations
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/login">Exit Admin</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r p-4">
          <nav className="space-y-2">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
