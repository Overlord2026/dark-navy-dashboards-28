import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navigationTabs = [
  { id: 'home', label: 'Home', route: '/client-dashboard' },
  { id: 'education', label: 'Education', route: '/education' },
  { id: 'investments', label: 'Investments', route: '/investments' },
  { id: 'lending', label: 'Lending', route: '/lending' },
  { id: 'insurance', label: 'Insurance', route: '/insurance' },
  { id: 'estate', label: 'Estate', route: '/estate' },
  { id: 'health', label: 'Health', route: '/healthcare' },
  { id: 'marketplace', label: 'Marketplace', route: '/marketplace' },
  { id: 'profile', label: 'Profile', route: '/profile' }
];

export const TopNavigationBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = () => {
    const path = location.pathname;
    
    // Check for exact matches first
    const exactMatch = navigationTabs.find(tab => tab.route === path);
    if (exactMatch) return exactMatch.id;
    
    // Check for partial matches
    if (path.startsWith('/education')) return 'education';
    if (path.startsWith('/investments')) return 'investments';
    if (path.startsWith('/lending')) return 'lending';
    if (path.startsWith('/insurance')) return 'insurance';
    if (path.startsWith('/estate')) return 'estate';
    if (path.startsWith('/healthcare')) return 'health';
    if (path.startsWith('/marketplace')) return 'marketplace';
    if (path.startsWith('/profile')) return 'profile';
    
    return 'home';
  };

  const activeTab = getActiveTab();

  const handleTabClick = (tab: typeof navigationTabs[0]) => {
    navigate(tab.route);
  };

  return (
    <div className="w-full bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center space-x-1 overflow-x-auto">
            {navigationTabs.map((tab) => (
              <Button
                key={tab.id}
                variant="ghost"
                size="sm"
                onClick={() => handleTabClick(tab)}
                className={cn(
                  "flex-shrink-0 px-4 py-2 text-sm font-medium transition-colors",
                  activeTab === tab.id
                    ? "text-primary border-b-2 border-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {tab.label}
              </Button>
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                // Save and continue later functionality
                console.log('Save progress');
              }}
            >
              Save & Continue Later
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};