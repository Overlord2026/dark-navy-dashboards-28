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
  LogOut,
  Crown,
  ShoppingCart,
  GraduationCap,
  Palette,
  BookOpen,
  HeadphonesIcon,
  ClipboardCheck,
  FileSearch
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
      ]
    },
    {
      title: 'Manage',
      items: [
        { href: '/admin-portal/advisors', icon: Users, label: 'Advisors/Teams', roles: ['all'] },
        { href: '/admin-portal/clients', icon: UserCheck, label: 'Clients/Prospects', roles: ['all'] },
        { href: '/admin-portal/resources', icon: FileText, label: 'Resources', roles: ['all'] },
        { href: '/admin-portal/marketplace', icon: ShoppingCart, label: 'Marketplace', roles: ['all'] },
        { href: '/admin-portal/premium-features', icon: Crown, label: 'Premium Features', roles: ['all'] },
      ]
    },
    {
      title: 'Business',
      items: [
        { href: '/admin-portal/billing', icon: CreditCard, label: 'Billing & Licensing', roles: ['all'] },
        { href: '/admin-portal/branding', icon: Palette, label: 'Branding', roles: ['all'] },
        { href: '/admin-portal/referrals', icon: TrendingUp, label: 'Referrals & Compensation', roles: ['all'] },
      ]
    },
    {
      title: 'Help & Security',
      items: [
        { href: '/admin-portal/training', icon: GraduationCap, label: 'Training & Support', roles: ['all'] },
        { href: '/admin-portal/compliance', icon: ClipboardCheck, label: 'Compliance', roles: ['all'] },
        { href: '/admin-portal/audit-logs', icon: FileSearch, label: 'Audit Logs', roles: ['all'] },
        { href: '/admin-portal/settings', icon: Settings, label: 'Settings', roles: ['all'] },
        { href: '/admin-portal/tenants', icon: Building, label: 'Tenants', roles: ['system_administrator'] },
        { href: '/admin-portal/webhooks', icon: Webhook, label: 'Webhooks', roles: ['system_administrator'] },
        { href: '/admin-portal/database', icon: Database, label: 'Database Health', roles: ['system_administrator'] },
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