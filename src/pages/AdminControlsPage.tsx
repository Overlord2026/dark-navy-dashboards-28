import React from 'react';
import { EnhancedAdminControls } from '@/components/admin/EnhancedAdminControls';

const AdminControlsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-background to-navy">
      <div className="container mx-auto px-4 py-8">
        <EnhancedAdminControls />
      </div>
    </div>
  );
};

export default AdminControlsPage;