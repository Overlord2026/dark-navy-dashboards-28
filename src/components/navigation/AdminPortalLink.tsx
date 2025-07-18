
import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AdminPortalLink() {
  const { userProfile } = useUser();
  
  // Show admin portal link for any admin role
  const isAdmin = userProfile?.role && [
    'admin', 
    'system_administrator', 
    'tenant_admin'
  ].includes(userProfile.role);

  if (!isAdmin) {
    return null;
  }

  return (
    <Button variant="outline" size="sm" asChild>
      <Link to="/admin-portal" className="flex items-center gap-2">
        <Shield className="h-4 w-4" />
        Admin Portal
      </Link>
    </Button>
  );
}
