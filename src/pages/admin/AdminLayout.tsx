import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home,
  Users, 
  UserCheck,
  Building,
  Heart,
  CreditCard,
  TrendingUp,
  Shield,
  Activity,
  LogOut,
  Monitor
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { userProfile } = useUser();
  const location = useLocation();

  const isSuperAdmin = userProfile?.role === 'system_administrator';
  const isSingleTenant = false; // TODO: Get from config

  const navItems = [
    { href: '/admin-portal', icon: Home, label: 'Dashboard' },
    { href: '/admin-portal/users', icon: Users, label: 'Users & Advisors' },
    { href: '/admin-portal/clients', icon: UserCheck, label: 'Clients & Prospects' },
    ...(isSingleTenant ? [] : [{ href: '/admin-portal/tenants', icon: Building, label: 'Tenants' }]),
    { href: '/admin-portal/health', icon: Heart, label: 'Health & LTC Module' },
    { href: '/admin-portal/billing', icon: CreditCard, label: 'Billing & Licensing' },
    { href: '/admin-portal/referrals', icon: TrendingUp, label: 'Referrals & Overrides' },
    { href: '/admin-portal/compliance', icon: Shield, label: 'Compliance & Audit' },
    { href: '/admin-portal/system-health', icon: Activity, label: 'System Diagnostics' },
  ];

  const getEnvironmentBadge = () => {
    const hostname = window.location.hostname;
    if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800">DEV</Badge>;
    }
    if (hostname.includes('lovable.app')) {
      return <Badge variant="outline" className="bg-green-100 text-green-800">PREVIEW</Badge>;
    }
    return <Badge variant="default">PROD</Badge>;
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top Bar */}
      <header className="bg-card border-b sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-foreground">Admin Console</h1>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center space-x-3">
              {getEnvironmentBadge()}
              <span className="text-sm text-muted-foreground">
                Tenant: Main • {userProfile?.role === 'system_administrator' ? 'Super Admin' : 
                userProfile?.role === 'tenant_admin' ? 'Tenant Admin' : 'Admin'}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{userProfile?.email}</span>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/">
                <LogOut className="h-4 w-4 mr-2" />
                Exit Console
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Sidebar */}
        <aside className="w-64 bg-card border-r overflow-auto">
          <div className="p-4">
            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors text-sm",
                      isActive 
                        ? "bg-primary text-primary-foreground shadow-sm" 
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-background">
          <div className="p-6">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
}