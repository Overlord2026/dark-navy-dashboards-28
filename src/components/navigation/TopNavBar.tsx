
import React from 'react';
import { useSidebar } from '@/context/SidebarContext';
import { Menu, Bell, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser } from '@/context/UserContext';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge-extended';

const TopNavBar = () => {
  const { isOpen, toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const { userProfile } = useUser();
  
  // Check if we're part of a larger ecosystem integration
  const isConnected = true; // This would typically be determined by API or context
  
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center border-b bg-background px-4 lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="mr-2"
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
      </Button>
      
      <div className="ml-auto flex items-center gap-4">
        {isConnected && (
          <Badge variant="success" className="mr-2">
            Connected
          </Badge>
        )}
        
        <div className="relative w-60 max-w-sm hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-full pl-8 md:w-60 lg:w-80"
          />
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => navigate('/notifications')}
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
            4
          </span>
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/profile')}
        >
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default TopNavBar;
