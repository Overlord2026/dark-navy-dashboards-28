import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import { Settings, MessageSquare, Home, Users, HelpCircle, CheckCircle, Globe, Monitor } from 'lucide-react';
import { getFlag } from '@/config/flags';
import { AdminHeaderEnvLink } from '@/components/admin/AdminHeaderEnvLink';
import PublicFlagsBadge from '@/components/admin/PublicFlagsBadge';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { userProfile } = useUser();
  const location = useLocation();

  // Check if user has admin role
  if (!userProfile || userProfile.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8 bg-card rounded-lg border">
          <h1 className="text-2xl font-bold text-destructive mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-4">You don't have permission to access this area.</p>
          <Button asChild>
            <Link to="/client-dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  const adminNavItems = [
    { href: '/admin', icon: Home, label: 'Dashboard' },
    { href: '/admin/hq', icon: Globe, label: 'HQ' },
    { href: '/admin/ready-check', icon: CheckCircle, label: 'Ready Check' },
    { href: '/admin/publish', icon: Globe, label: 'Publish' },
    { href: '/admin/env', icon: Monitor, label: 'Environment' },
    { href: '/admin/ai-marketing-engine', icon: MessageSquare, label: 'AI Marketing' },
    { href: '/admin/faqs', icon: HelpCircle, label: 'Manage FAQs' },
    { href: '/admin/users', icon: Users, label: 'Users' },
    { href: '/admin/settings', icon: Settings, label: 'Settings' },
  ].filter(item => {
    // Hide admin tools if flag is disabled
    if (!getFlag('ADMIN_TOOLS_ENABLED') && 
        ['/admin/ready-check', '/admin/publish', '/admin/qa-coverage', '/admin/env'].includes(item.href)) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-foreground">Admin Center</h1>
            <div className="h-6 w-px bg-border" />
            <span className="text-sm text-muted-foreground">Welcome, {userProfile.name || userProfile.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <AdminHeaderEnvLink />
            {getFlag('ADMIN_TOOLS_ENABLED') && <PublicFlagsBadge />}
            <Button variant="outline" size="sm" asChild>
              <Link to="/client-dashboard">Exit Admin</Link>
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