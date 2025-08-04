import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
  current?: boolean;
}

interface HealthcareBreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function HealthcareBreadcrumbs({ items }: HealthcareBreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-4" aria-label="Breadcrumb">
      <Button
        variant="ghost"
        size="sm"
        className="h-auto p-1 text-muted-foreground hover:text-foreground"
        onClick={() => window.location.href = '/'}
      >
        <Home className="h-4 w-4" />
      </Button>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="h-4 w-4" />
          
          {item.current ? (
            <span className="font-medium text-foreground" aria-current="page">
              {item.label}
            </span>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-1 text-muted-foreground hover:text-foreground"
              onClick={item.onClick}
            >
              {item.label}
            </Button>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}