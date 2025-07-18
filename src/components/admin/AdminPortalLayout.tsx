import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import { 
  Settings, 
  Users, 
  BarChart3, 
  Database, 
  Shield, 
  FileText, 
  Webhook,
  Building,
  UserCheck,
  TrendingUp,
  CreditCard,
  Home,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminPortalLayoutProps {
  children?: React.ReactNode;
}

export function AdminPortalLayout({ children }: AdminPortalLayoutProps) {
  const { userProfile } = useUser();
  const location = useLocation();

  const isSuperAdmin = userProfile?.role === 'system_administrator';
  const isTenantAdmin = ['admin', 'tenant_admin'].includes(userProfile?.role || '');

  const adminNavSections = [
    {
      title: 'Overview',
      items: [
        { href: '/admin-portal', icon: Home, label: 'Dashboard', roles: ['all'] },
        { href: '/admin-portal/analytics', icon: BarChart3, label: 'Analytics', roles: ['all'] },
      ]
    },
    {
      title: 'User Management',
      items: [
        { href: '/admin-portal/users', icon: Users, label: 'Users', roles: ['all'] },
        { href: '/admin-portal/roles', icon: UserCheck, label: 'Roles & Permissions', roles: ['system_administrator'] },
        { href: '/admin-portal/tenants', icon: Building, label: 'Tenants', roles: ['system_administrator'] },
      ]
    },
    {
      title: 'Content & Resources',
      items: [
        { href: '/admin-portal/resources', icon: FileText, label: 'Resources', roles: ['all'] },
        { href: '/admin-portal/education', icon: FileText, label: 'Education Content', roles: ['all'] },
        { href: '/admin-portal/strategies', icon: TrendingUp, label: 'Investment Strategies', roles: ['all'] },
      ]
    },
    {
      title: 'Referrals & Payouts',
      items: [
        { href: '/admin-portal/referrals', icon: Users, label: 'Referral Management', roles: ['all'] },
        { href: '/admin-portal/payouts', icon: CreditCard, label: 'Payout Management', roles: ['all'] },
        { href: '/referral-analytics', icon: BarChart3, label: 'Referral Analytics', roles: ['all'] },
      ]
    },
    {
      title: 'System',
      items: [
        { href: '/admin-portal/webhooks', icon: Webhook, label: 'Webhooks', roles: ['system_administrator'] },
        { href: '/admin-portal/database', icon: Database, label: 'Database Health', roles: ['system_administrator'] },
        { href: '/admin-portal/security', icon: Shield, label: 'Security Audit', roles: ['system_administrator'] },
        { href: '/admin-portal/settings', icon: Settings, label: 'Settings', roles: ['all'] },
      ]
    }
  ];

  const canAccessItem = (item: { roles: string[] }) => {
    if (item.roles.includes('all')) return true;
    if (isSuperAdmin) return true;
    return item.roles.includes(userProfile?.role || '');
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-foreground">Admin Portal</h1>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground">
                {userProfile?.role === 'system_administrator' ? 'Super Admin' : 
                 userProfile?.role === 'tenant_admin' ? 'Tenant Admin' : 'Admin'} - {userProfile?.name || userProfile?.email}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/client-dashboard">
                <LogOut className="h-4 w-4 mr-2" />
                Exit Portal
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <aside className="w-72 bg-card border-r overflow-auto">
          <div className="p-4">
            <nav className="space-y-6">
              {adminNavSections.map((section) => (
                <div key={section.title}>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    {section.title}
                  </h3>
                  <div className="space-y-1">
                    {section.items
                      .filter(canAccessItem)
                      .map((item) => {
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
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto bg-background">
          <div className="p-6">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
}