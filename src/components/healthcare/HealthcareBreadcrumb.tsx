import React from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { getHealthcareBreadcrumbs, hasHealthcareBreadcrumbs } from '@/config/breadcrumbs/healthcare';

interface HealthcareBreadcrumbProps {
  className?: string;
}

export const HealthcareBreadcrumb: React.FC<HealthcareBreadcrumbProps> = ({ className }) => {
  const location = useLocation();
  const breadcrumbs = getHealthcareBreadcrumbs(location.pathname);

  // Don't render if no breadcrumbs are configured for this route
  if (!hasHealthcareBreadcrumbs(location.pathname) || breadcrumbs.length === 0) {
    return null;
  }

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          return (
            <React.Fragment key={breadcrumb.href}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={breadcrumb.href}>{breadcrumb.title}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};