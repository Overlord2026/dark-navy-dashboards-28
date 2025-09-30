import React from 'react';
import { Link } from 'react-router-dom';
import { getFlag } from '@/config/flags';
import { Button } from '@/components/ui/button';
import { Monitor } from 'lucide-react';

export function AdminHeaderEnvLink() {
  // Only show if admin tools are enabled
  if (!getFlag('ADMIN_TOOLS_ENABLED')) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      asChild
      className="text-xs"
      style={{ 
        color: '#D4AF37',
        borderColor: '#D4AF37'
      }}
    >
      <Link to="/admin/env" className="flex items-center gap-1">
        <Monitor className="h-3 w-3" />
        Env
      </Link>
    </Button>
  );
}