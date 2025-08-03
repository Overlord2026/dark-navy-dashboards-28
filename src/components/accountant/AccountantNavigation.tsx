import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Calculator, 
  FileSpreadsheet, 
  Shield, 
  Users, 
  BookOpen, 
  FileText,
  CheckSquare,
  Home
} from 'lucide-react';

export const accountantNav = [
  { title: 'Dashboard', href: '/accountant-dashboard', icon: Home },
  { title: 'Tax Planning', href: '/accountant/tax-planning', icon: Calculator },
  { title: 'Audit Preparation', href: '/accountant/audit-prep', icon: CheckSquare },
  { title: 'Compliance', href: '/accountant/compliance', icon: Shield },
  { title: 'Client Management', href: '/accountant/clients', icon: Users },
  { title: 'Ledger', href: '/accountant/ledger', icon: BookOpen },
  { title: 'Statements', href: '/accountant/statements', icon: FileText }
];

export function AccountantNavigation() {
  const location = useLocation();

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            Accounting Tools
          </h3>
          {accountantNav.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </NavLink>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}