import React from 'react';
import { Calculator, FileText, Users, BookOpen, CheckSquare, BarChart3 } from 'lucide-react';

export const accountantNav = [
  { title: 'Tax Planning', href: '/accountant/tax-planning', icon: Calculator },
  { title: 'Audit Preparation', href: '/accountant/audit-prep', icon: CheckSquare },
  { title: 'Compliance', href: '/accountant/compliance', icon: FileText },
  { title: 'Client Management', href: '/accountant/clients', icon: Users },
  { title: 'Ledger', href: '/accountant/ledger', icon: BookOpen },
  { title: 'Statements', href: '/accountant/statements', icon: BarChart3 }
];

interface AccountantNavigationProps {
  className?: string;
}

export function AccountantNavigation({ className = "" }: AccountantNavigationProps) {
  return (
    <nav className={`space-y-2 ${className}`}>
      {accountantNav.map((item, index) => (
        <a
          key={index}
          href={item.href}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
        >
          <item.icon className="h-4 w-4" />
          {item.title}
        </a>
      ))}
    </nav>
  );
}