
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Database } from 'lucide-react';

export const SupabaseRequiredNotice: React.FC = () => {
  return (
    <Alert>
      <Database className="h-4 w-4" />
      <AlertTitle>Connected to Supabase</AlertTitle>
      <AlertDescription>
        This feature uses Supabase for database storage, user authentication, and API functionality. 
        Additional configuration may be required in the Supabase dashboard.
      </AlertDescription>
    </Alert>
  );
};
