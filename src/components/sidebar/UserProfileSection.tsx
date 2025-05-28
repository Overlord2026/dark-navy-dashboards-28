
import React, { useState } from "react";
import { ChevronDown, LogOut, UserIcon, PhoneIcon, FileTextIcon, UsersIcon, BuildingIcon, PaletteIcon } from "lucide-react";
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
import { ProfileSlidePanel } from "@/components/profile/ProfileSlidePanel";
import { ThemeDialog } from "@/components/ui/ThemeDialog";

interface UserProfileSectionProps {
  onMenuItemClick?: (itemId: string) => void;
  showLogo?: boolean;
}

export const UserProfileSection = ({ onMenuItemClick, showLogo = true }: UserProfileSectionProps) => {
  const { userProfile } = useUser();
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [isThemeDialogOpen, setIsThemeDialogOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setIsDropdownOpen(false);
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
    // Close dropdown immediately
    setIsDropdownOpen(false);
    
    if (itemId === "logout") {
      handleLogout();
      return;
    }
    
    if (itemId === "change-theme") {
      setIsThemeDialogOpen(true);
      return;
    }
    
    // For profile forms, open the sliding panel
    setActiveForm(itemId);
    setIsPanelOpen(true);
    
    // Call the original callback if provided
    if (onMenuItemClick) {
      onMenuItemClick(itemId);
    }
  };

  const handlePanelOpenChange = (open: boolean) => {
    setIsPanelOpen(open);
    if (!open) {
      setActiveForm(null);
    }
  };

  // Get display name with fallback
  const displayName = userProfile?.displayName || userProfile?.name || 
    `${userProfile?.firstName || ''} ${userProfile?.lastName || ''}`.trim() || 
    'User';

  return (
    <>
      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
        <div className="flex items-center flex-1 min-w-0">
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium text-sm truncate">
              {displayName}
            </p>
          </div>
        </div>
        
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-white/10 flex-shrink-0">
              <ChevronDown className="h-4 w-4 text-gray-300" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-64 bg-[#1B1B32] border-[#2A2A40] shadow-xl shadow-black/20 p-2 z-50"
            sideOffset={8}
          >
            <DropdownMenuItem 
              onClick={() => handleMenuItemClick('investor-profile')}
              className="flex items-center px-3 py-3 rounded-md hover:bg-[#2A2A40] focus:bg-[#2A2A40] cursor-pointer transition-colors"
            >
              <UserIcon className="h-4 w-4 mr-3 text-blue-400" />
              <span className="text-white font-medium">Investor Profile</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={() => handleMenuItemClick('contact-information')}
              className="flex items-center px-3 py-3 rounded-md hover:bg-[#2A2A40] focus:bg-[#2A2A40] cursor-pointer transition-colors"
            >
              <PhoneIcon className="h-4 w-4 mr-3 text-green-400" />
              <span className="text-white font-medium">Contact Information</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={() => handleMenuItemClick('additional-information')}
              className="flex items-center px-3 py-3 rounded-md hover:bg-[#2A2A40] focus:bg-[#2A2A40] cursor-pointer transition-colors"
            >
              <FileTextIcon className="h-4 w-4 mr-3 text-purple-400" />
              <span className="text-white font-medium">Additional Information</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={() => handleMenuItemClick('beneficiaries')}
              className="flex items-center px-3 py-3 rounded-md hover:bg-[#2A2A40] focus:bg-[#2A2A40] cursor-pointer transition-colors"
            >
              <UsersIcon className="h-4 w-4 mr-3 text-orange-400" />
              <span className="text-white font-medium">Beneficiaries</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={() => handleMenuItemClick('affiliations')}
              className="flex items-center px-3 py-3 rounded-md hover:bg-[#2A2A40] focus:bg-[#2A2A40] cursor-pointer transition-colors"
            >
              <BuildingIcon className="h-4 w-4 mr-3 text-cyan-400" />
              <span className="text-white font-medium">Affiliations</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={() => handleMenuItemClick('trusts')}
              className="flex items-center px-3 py-3 rounded-md hover:bg-[#2A2A40] focus:bg-[#2A2A40] cursor-pointer transition-colors"
            >
              <BuildingIcon className="h-4 w-4 mr-3 text-teal-400" />
              <span className="text-white font-medium">Trusts</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="bg-gray-700 my-2" />
            
            <DropdownMenuItem 
              onClick={() => handleMenuItemClick('change-theme')}
              className="flex items-center px-3 py-3 rounded-md hover:bg-[#2A2A40] focus:bg-[#2A2A40] cursor-pointer transition-colors"
            >
              <PaletteIcon className="h-4 w-4 mr-3 text-yellow-400" />
              <span className="text-white font-medium">Change Theme</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={() => handleMenuItemClick('logout')}
              disabled={isLoggingOut}
              className="flex items-center px-3 py-3 rounded-md hover:bg-red-600/20 focus:bg-red-600/20 cursor-pointer transition-colors text-red-400 hover:text-red-300"
            >
              <LogOut className="h-4 w-4 mr-3" />
              <span className="font-medium">{isLoggingOut ? "Logging out..." : "Logout"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ProfileSlidePanel 
        isOpen={isPanelOpen}
        onOpenChange={handlePanelOpenChange}
        activeForm={activeForm}
      />

      <ThemeDialog
        open={isThemeDialogOpen}
        onOpenChange={setIsThemeDialogOpen}
      />
    </>
  );
};
