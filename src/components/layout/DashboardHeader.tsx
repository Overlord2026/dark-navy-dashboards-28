
import React from 'react';
import { ConnectedBadge } from "@/components/integration/ConnectedBadge";
import { useLocation } from 'react-router-dom';

export default function DashboardHeader() {
  const location = useLocation();
  const isIntegrated = true; // In a real app, this would be determined by an API check
  const showConnectedBadge = isIntegrated && location.pathname !== '/integration';
  
  return (
    <div className="flex items-center justify-between px-6 h-16 border-b">
      <div>
        <h2 className="text-xl font-bold">Family Office Marketplace</h2>
      </div>
      <div className="flex items-center space-x-4">
        {showConnectedBadge && <ConnectedBadge />}
        <UserAccountMenu />
      </div>
    </div>
  );
}

// Placeholder component - In a real app, you'd import this from elsewhere
function UserAccountMenu() {
  return (
    <div className="rounded-full h-8 w-8 bg-gray-300 flex items-center justify-center">
      <span className="text-sm">AB</span>
    </div>
  );
}
