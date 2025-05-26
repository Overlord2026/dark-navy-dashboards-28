
import React, { useState } from "react";
import { User, ChevronDown, LogOut } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface UserProfileSectionProps {
  onMenuItemClick?: (itemId: string) => void;
  showLogo?: boolean;
}

export const UserProfileSection = ({ onMenuItemClick, showLogo = true }: UserProfileSectionProps) => {
  const { userProfile } = useUser();
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Error logging out");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleMenuItemClick = (itemId: string) => {
    onMenuItemClick?.(itemId);
  };

  return (
    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <User className="h-4 w-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {userProfile?.displayName || userProfile?.name || 'User'}
          </p>
          <p className="text-xs text-gray-300 truncate capitalize">
            {userProfile?.role || 'Client'}
          </p>
        </div>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <ChevronDown className="h-4 w-4 text-gray-300" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => handleMenuItemClick('profile')}>
            Profile Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleMenuItemClick('account')}>
            Account Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="text-red-600 focus:text-red-600"
          >
            <LogOut className="h-4 w-4 mr-2" />
            {isLoggingOut ? "Logging out..." : "Log out"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
