
import React, { useState } from "react";
import { User, ChevronDown, LogOut, UserIcon, PhoneIcon, FileTextIcon, UsersIcon, BuildingIcon, PaletteIcon } from "lucide-react";
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
    if (itemId === "logout") {
      handleLogout();
    } else {
      onMenuItemClick?.(itemId);
    }
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
          <DropdownMenuItem onClick={() => handleMenuItemClick('investor-profile')}>
            <UserIcon className="h-4 w-4 mr-2" />
            Investor Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleMenuItemClick('contact-information')}>
            <PhoneIcon className="h-4 w-4 mr-2" />
            Contact Information
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleMenuItemClick('additional-information')}>
            <FileTextIcon className="h-4 w-4 mr-2" />
            Additional Information
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleMenuItemClick('beneficiaries')}>
            <UsersIcon className="h-4 w-4 mr-2" />
            Beneficiaries
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleMenuItemClick('affiliations')}>
            <BuildingIcon className="h-4 w-4 mr-2" />
            Affiliations
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleMenuItemClick('trusts')}>
            <BuildingIcon className="h-4 w-4 mr-2" />
            Trusts
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleMenuItemClick('change-theme')}>
            <PaletteIcon className="h-4 w-4 mr-2" />
            Change Theme
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => handleMenuItemClick('logout')}
            disabled={isLoggingOut}
            className="text-red-600 focus:text-red-600"
          >
            <LogOut className="h-4 w-4 mr-2" />
            {isLoggingOut ? "Logging out..." : "Logout"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
