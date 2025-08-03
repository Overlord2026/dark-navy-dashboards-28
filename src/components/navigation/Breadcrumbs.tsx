import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href: string;
  active?: boolean;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const location = useLocation();
  
  // Generate breadcrumbs automatically if not provided
  const breadcrumbs = items || generateBreadcrumbs(location.pathname);

  return (
    <nav className={cn("flex items-center space-x-1 text-sm text-muted-foreground mb-4", className)}>
      <Link 
        to="/" 
        className="flex items-center hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>
      
      {breadcrumbs.map((item, index) => (
        <React.Fragment key={item.href}>
          <ChevronRight className="h-4 w-4" />
          {item.active || index === breadcrumbs.length - 1 ? (
            <span className="font-medium text-foreground">{item.label}</span>
          ) : (
            <Link 
              to={item.href}
              className="hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];
  
  // Build breadcrumbs based on path segments
  let currentPath = '';
  
  for (let i = 0; i < segments.length; i++) {
    currentPath += `/${segments[i]}`;
    const segment = segments[i];
    
    // Convert segment to readable label
    const label = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    breadcrumbs.push({
      label,
      href: currentPath,
      active: i === segments.length - 1
    });
  }
  
  return breadcrumbs;
}