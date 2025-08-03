import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  FileText, 
  Building, 
  Scale, 
  Search 
} from 'lucide-react';

interface AttorneyNavigationProps {
  className?: string;
}

const attorneyRoutes = [
  {
    title: 'Estate Planning',
    href: '/attorney/estate-planning',
    icon: FileText,
    description: 'Wills, trusts, and estate planning services'
  },
  {
    title: 'Business Law',
    href: '/attorney/business-law',
    icon: Building,
    description: 'Corporate formation and business legal services'
  },
  {
    title: 'Contracts',
    href: '/attorney/contracts',
    icon: Scale,
    description: 'Contract drafting, review, and negotiation'
  },
  {
    title: 'Research',
    href: '/attorney/research',
    icon: Search,
    description: 'Legal research tools and resources'
  }
];

export function AttorneyNavigation({ className }: AttorneyNavigationProps) {
  const location = useLocation();

  return (
    <nav className={cn("flex flex-wrap gap-2 mb-6", className)}>
      {attorneyRoutes.map((route) => {
        const isActive = location.pathname === route.href;
        const Icon = route.icon;
        
        return (
          <Link
            key={route.href}
            to={route.href}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              isActive 
                ? "bg-primary text-primary-foreground border-primary" 
                : "bg-background border-border"
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="font-medium">{route.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}