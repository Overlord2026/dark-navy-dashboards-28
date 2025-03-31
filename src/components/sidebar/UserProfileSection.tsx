
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { OnboardingSidePanel } from "@/components/onboarding/OnboardingSidePanel";
import { ThemeDialog } from "@/components/ui/ThemeDialog";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";

interface UserProfileSectionProps {
  onMenuItemClick?: (itemId: string) => void;
  showLogo?: boolean;
}

export const UserProfileSection = ({ 
  onMenuItemClick,
  showLogo = true
}: UserProfileSectionProps) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  
  // Hardcoded values for Tom Brady
  const avatarInitials = "TB"; 
  const userName = "Tom Brady"; // Always Tom Brady
  
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isThemeDialogOpen, setIsThemeDialogOpen] = useState(false);
  const [activePanelForm, setActivePanelForm] = useState("investor-profile");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const menuItems = [
    { id: "investor-profile", label: "Investor Profile" },
    { id: "contact-information", label: "Contact Information" },
    { id: "additional-information", label: "Additional Information" },
    { id: "beneficiaries", label: "Beneficiaries" },
    { id: "affiliations", label: "Affiliations" },
    { id: "trusts", label: "Trusts" },
    { id: "security-access", label: "Security & Access" },
    { id: "change-theme", label: "Change Theme" },
    { id: "log-out", label: "Log Out" },
  ];

  const handleMenuItemClick = (itemId: string) => {
    console.log(`Profile menu item clicked in sidebar: ${itemId}`);
    
    if (itemId === "change-theme") {
      // Open theme dialog
      setIsThemeDialogOpen(true);
    } else if (itemId === "log-out") {
      // Handle log out action
      toast.success("You have been successfully logged out");
      navigate("/home");
      if (onMenuItemClick) {
        onMenuItemClick(itemId);
      }
    } else {
      // Open the side panel with the selected form
      setActivePanelForm(itemId);
      setIsPanelOpen(true);
    }
    
    // Close dropdown after selection
    setIsDropdownOpen(false);
  };

  // Handle open state change
  const handleOpenChange = (open: boolean) => {
    setIsDropdownOpen(open);
    // If opening and panel is open, close the panel
    if (open && isPanelOpen) {
      setIsPanelOpen(false);
    }
  };

  return (
    <div className={`px-0 ${isLightTheme ? 'border-[#DCD8C0]' : 'border-white/10'}`}>
      {/* Optional logo above the user profile dropdown */}
      {showLogo && (
        <div className="mb-2 flex justify-center">
          <img 
            src="/lovable-uploads/3346c76f-f91c-4791-b77d-adb2f34a06af.png" 
            alt="Boutique Family Office Logo" 
            className="h-16 w-auto"
          />
        </div>
      )}
      
      <DropdownMenu open={isDropdownOpen} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger 
          className={`flex items-center justify-between w-full mx-0 py-2 px-4 rounded-none transition-colors cursor-pointer border-y ${
            isLightTheme 
              ? 'hover:bg-[#E9E7D8] text-[#222222] border-gray-400 shadow-sm' 
              : 'hover:bg-white/5 text-white border-gray-600/50 shadow-sm'
          }`}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <div className="flex items-center">
            <div className="h-9 w-9 rounded-full bg-[#FFC107] flex items-center justify-center mr-3 text-white font-medium border border-gray-600">
              {avatarInitials}
            </div>
            <span className="font-medium text-base">{userName}</span>
          </div>
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isLightTheme ? 'text-[#222222]/70' : 'text-white/70'} ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          className={`w-[220px] z-50 ${
            isLightTheme 
              ? 'bg-[#F9F7E8] border-[#DCD8C0] text-[#222222]' 
              : 'bg-[#0F0F2D] border-gray-700 text-white'
          }`}
          align="end"
          forceMount
        >
          {menuItems.slice(0, 7).map((item) => (
            <DropdownMenuItem 
              key={item.id}
              onClick={() => handleMenuItemClick(item.id)}
              className={`py-2 cursor-pointer ${
                isLightTheme 
                  ? 'hover:bg-[#E9E7D8]' 
                  : 'hover:bg-white/10'
              }`}
              onSelect={(event) => {
                // Prevent default selection behavior
                event.preventDefault();
              }}
            >
              <span>{item.label}</span>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator className={isLightTheme ? "bg-[#DCD8C0]" : "bg-gray-700"} />
          {menuItems.slice(7).map((item) => (
            <DropdownMenuItem 
              key={item.id}
              onClick={() => handleMenuItemClick(item.id)}
              className={`py-2 cursor-pointer ${
                isLightTheme 
                  ? 'hover:bg-[#E9E7D8]' 
                  : 'hover:bg-white/10'
              }`}
              onSelect={(event) => {
                // Prevent default selection behavior
                event.preventDefault();
              }}
            >
              <span>{item.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <OnboardingSidePanel 
        isOpen={isPanelOpen} 
        onOpenChange={setIsPanelOpen}
        initialFormId={activePanelForm}
      />

      <ThemeDialog
        open={isThemeDialogOpen}
        onOpenChange={setIsThemeDialogOpen}
      />
    </div>
  );
};
