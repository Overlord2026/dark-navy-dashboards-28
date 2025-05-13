
import React from 'react';
import { ConnectedBadge } from "@/components/integration/ConnectedBadge";
import { useLocation } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Settings } from 'lucide-react';

export default function DashboardHeader() {
  const location = useLocation();
  const { userProfile, logout } = useUser();
  const isIntegrated = true; // In a real app, this would be determined by an API check
  const showConnectedBadge = isIntegrated && location.pathname !== '/integration';
  
  return (
    <div className="flex items-center justify-between px-6 h-16 border-b">
      <div>
        <h2 className="text-xl font-bold">Family Office Marketplace</h2>
      </div>
      <div className="flex items-center space-x-4">
        {showConnectedBadge && <ConnectedBadge />}
        <UserAccountMenu userProfile={userProfile} onLogout={logout} />
      </div>
    </div>
  );
}

function UserAccountMenu({ userProfile, onLogout }) {
  const initials = userProfile?.displayName 
    ? `${userProfile.displayName.charAt(0).toUpperCase()}${userProfile.displayName.charAt(1).toUpperCase()}`
    : userProfile?.firstName && userProfile?.lastName
      ? `${userProfile.firstName.charAt(0).toUpperCase()}${userProfile.lastName.charAt(0).toUpperCase()}`
      : "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="focus:outline-none">
          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarImage src={userProfile?.avatar_url} alt={userProfile?.displayName || "User"} />
            <AvatarFallback className="bg-primary text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          {userProfile?.displayName || userProfile?.name || "User"}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href="/profile" className="flex items-center cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Profile
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="/settings" className="flex items-center cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} className="flex items-center cursor-pointer text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
