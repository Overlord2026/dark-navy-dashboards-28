import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Database, Shield, Users, Settings, FileText, MessageSquare, FileX } from 'lucide-react';

const adminNavItems = [
  {
    title: 'Database',
    href: '/admin/db/migrations',
    icon: Database,
    description: 'Migration status and database health'
  },
  {
    title: 'Security',
    href: '/admin/security',
    icon: Shield,
    description: 'Security audit and compliance'
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users,
    description: 'User management and roles'
  },
  {
    title: 'IP HQ',
    href: '/admin/hq/ip',
    icon: MessageSquare,
    description: 'AIES messaging console'
  },
  {
    title: 'IP Ledger',
    href: '/admin/hq/ip-ledger',
    icon: FileX,
    description: 'IP filings and patent tracking'
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    description: 'System configuration'
  }
];

export default function AdminNav() {
  const location = useLocation();

  return (
    <nav className="space-y-2">
      {adminNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;
        
        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
              isActive 
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            <div>
              <div className="font-medium">{item.title}</div>
              <div className="text-xs opacity-75">{item.description}</div>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}