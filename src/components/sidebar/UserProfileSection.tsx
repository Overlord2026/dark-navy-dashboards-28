
import React, { useState } from "react";
import { ChevronDown, LogOut, UserIcon, PhoneIcon, FileTextIcon, UsersIcon, BuildingIcon, PaletteIcon } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { ProfileSlidePanel } from "@/components/profile/ProfileSlidePanel";
import { ThemeDialog } from "@/components/ui/ThemeDialog";
import { cn } from "@/lib/utils";

interface UserProfileSectionProps {
  onMenuItemClick?: (itemId: string) => void;
  showLogo?: boolean;
}

export const UserProfileSection = ({ onMenuItemClick, showLogo = true }: UserProfileSectionProps) => {
  const { userProfile } = useUser();
  const { logout } = useAuth();
  const { theme } = useTheme();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [isThemeDialogOpen, setIsThemeDialogOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const isLightTheme = theme === "light";

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
    setIsDropdownOpen(false);
    
    if (itemId === "logout") {
      handleLogout();
      return;
    }
    
    if (itemId === "change-theme") {
      setIsThemeDialogOpen(true);
      return;
    }
    
    setActiveForm(itemId);
    setIsPanelOpen(true);
    
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

  const displayName = userProfile?.displayName || userProfile?.name || 
    `${userProfile?.firstName || ''} ${userProfile?.lastName || ''}`.trim() || 
    'User';

  const getInitials = (): string => {
    const firstName = userProfile?.firstName || '';
    const lastName = userProfile?.lastName || '';
    
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    } else if (firstName) {
      return firstName.charAt(0).toUpperCase();
    } else if (lastName) {
      return lastName.charAt(0).toUpperCase();
    } else if (displayName && displayName !== 'User') {
      const nameParts = displayName.split(' ').filter(part => part.length > 0);
      if (nameParts.length >= 2) {
        return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase();
      } else if (nameParts.length === 1) {
        return nameParts[0].charAt(0).toUpperCase();
      }
    }
    
    return 'U';
  };

  return (
    <>
      <div className={cn(
        "flex items-center justify-between p-3 rounded-lg border",
        isLightTheme 
          ? "bg-sidebar-accent border-sidebar-border" 
          : "bg-white/5 border-white/10"
      )}>
        <div className="flex items-center flex-1 min-w-0 gap-3">
          <Avatar className={cn(
            "h-8 w-8 border",
            isLightTheme 
              ? "bg-primary/20 border-primary/30" 
              : "bg-primary/20 border-primary/30"
          )}>
            <AvatarFallback className={cn(
              "text-sm font-medium",
              isLightTheme 
                ? "bg-primary/20 text-sidebar-foreground" 
                : "bg-primary/20 text-white"
            )}>
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className={cn(
              "font-medium text-base truncate",
              isLightTheme ? "text-sidebar-foreground" : "text-white"
            )}>
              {displayName}
            </p>
          </div>
        </div>
        
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn(
                "h-8 w-8 p-0 flex-shrink-0",
                isLightTheme ? "hover:bg-sidebar-accent" : "hover:bg-white/10"
              )}
            >
              <ChevronDown className={cn(
                "h-4 w-4",
                isLightTheme ? "text-sidebar-foreground" : "text-gray-300"
              )} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className={cn(
              "w-64 shadow-xl p-2 z-50",
              isLightTheme 
                ? "bg-background border-border" 
                : "bg-[#1B1B32] border-[#2A2A40] shadow-black/20"
            )}
            sideOffset={8}
          >
            <DropdownMenuItem 
              onClick={() => handleMenuItemClick('investor-profile')}
              className={cn(
                "flex items-center px-3 py-3 rounded-md cursor-pointer transition-colors",
                isLightTheme 
                  ? "hover:bg-muted focus:bg-muted" 
                  : "hover:bg-[#2A2A40] focus:bg-[#2A2A40]"
              )}
            >
              <UserIcon className="h-4 w-4 mr-3 text-blue-400" />
              <span className={cn(
                "font-medium",
                isLightTheme ? "text-foreground" : "text-white"
              )}>Investor Profile</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={() => handleMenuItemClick('contact-information')}
              className={cn(
                "flex items-center px-3 py-3 rounded-md cursor-pointer transition-colors",
                isLightTheme 
                  ? "hover:bg-muted focus:bg-muted" 
                  : "hover:bg-[#2A2A40] focus:bg-[#2A2A40]"
              )}
            >
              <PhoneIcon className="h-4 w-4 mr-3 text-green-400" />
              <span className={cn(
                "font-medium",
                isLightTheme ? "text-foreground" : "text-white"
              )}>Contact Information</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={() => handleMenuItemClick('additional-information')}
              className={cn(
                "flex items-center px-3 py-3 rounded-md cursor-pointer transition-colors",
                isLightTheme 
                  ? "hover:bg-muted focus:bg-muted" 
                  : "hover:bg-[#2A2A40] focus:bg-[#2A2A40]"
              )}
            >
              <FileTextIcon className="h-4 w-4 mr-3 text-purple-400" />
              <span className={cn(
                "font-medium",
                isLightTheme ? "text-foreground" : "text-white"
              )}>Additional Information</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={() => handleMenuItemClick('beneficiaries')}
              className={cn(
                "flex items-center px-3 py-3 rounded-md cursor-pointer transition-colors",
                isLightTheme 
                  ? "hover:bg-muted focus:bg-muted" 
                  : "hover:bg-[#2A2A40] focus:bg-[#2A2A40]"
              )}
            >
              <UsersIcon className="h-4 w-4 mr-3 text-orange-400" />
              <span className={cn(
                "font-medium",
                isLightTheme ? "text-foreground" : "text-white"
              )}>Beneficiaries</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={() => handleMenuItemClick('affiliations')}
              className={cn(
                "flex items-center px-3 py-3 rounded-md cursor-pointer transition-colors",
                isLightTheme 
                  ? "hover:bg-muted focus:bg-muted" 
                  : "hover:bg-[#2A2A40] focus:bg-[#2A2A40]"
              )}
            >
              <BuildingIcon className="h-4 w-4 mr-3 text-cyan-400" />
              <span className={cn(
                "font-medium",
                isLightTheme ? "text-foreground" : "text-white"
              )}>Affiliations</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={() => handleMenuItemClick('trusts')}
              className={cn(
                "flex items-center px-3 py-3 rounded-md cursor-pointer transition-colors",
                isLightTheme 
                  ? "hover:bg-muted focus:bg-muted" 
                  : "hover:bg-[#2A2A40] focus:bg-[#2A2A40]"
              )}
            >
              <BuildingIcon className="h-4 w-4 mr-3 text-teal-400" />
              <span className={cn(
                "font-medium",
                isLightTheme ? "text-foreground" : "text-white"
              )}>Trusts</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className={cn(
              "my-2",
              isLightTheme ? "bg-border" : "bg-gray-700"
            )} />
            
            <DropdownMenuItem 
              onClick={() => handleMenuItemClick('change-theme')}
              className={cn(
                "flex items-center px-3 py-3 rounded-md cursor-pointer transition-colors",
                isLightTheme 
                  ? "hover:bg-muted focus:bg-muted" 
                  : "hover:bg-[#2A2A40] focus:bg-[#2A2A40]"
              )}
            >
              <PaletteIcon className="h-4 w-4 mr-3 text-yellow-400" />
              <span className={cn(
                "font-medium",
                isLightTheme ? "text-foreground" : "text-white"
              )}>Change Theme</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={() => handleMenuItemClick('logout')}
              disabled={isLoggingOut}
              className={cn(
                "flex items-center px-3 py-3 rounded-md cursor-pointer transition-colors text-red-400 hover:text-red-300",
                isLightTheme 
                  ? "hover:bg-red-600/20 focus:bg-red-600/20" 
                  : "hover:bg-red-600/20 focus:bg-red-600/20"
              )}
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
