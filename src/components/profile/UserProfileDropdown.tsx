
import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { 
  UserIcon,
  PhoneIcon,
  FileTextIcon,
  UsersIcon,
  BuildingIcon,
  LockIcon,
  PaletteIcon,
  LogOutIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { OnboardingSidePanel } from "@/components/onboarding/OnboardingSidePanel";
import { ThemeDialog } from "@/components/ui/ThemeDialog";
import { useUser } from "@/context/UserContext";

interface UserProfileDropdownProps {
  onOpenForm: (formId: string) => void;
}

export const UserProfileDropdown = ({ onOpenForm }: UserProfileDropdownProps) => {
  const { userProfile } = useUser();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isThemeDialogOpen, setIsThemeDialogOpen] = useState(false);
  const [activePanelForm, setActivePanelForm] = useState("investor-profile");
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownKey, setDropdownKey] = useState(Date.now());
  
  // Force refresh when profile changes
  useEffect(() => {
    console.log("UserProfileDropdown: UserProfile changed, refreshing", userProfile);
    setDropdownKey(Date.now());
  }, [userProfile]);
  
  // Hardcoded initials for Tom Brady
  const initials = "TB";
  
  const menuItems = [
    { id: "investor-profile", label: "Investor Profile", icon: UserIcon },
    { id: "contact-information", label: "Contact Information", icon: PhoneIcon },
    { id: "additional-information", label: "Additional Information", icon: FileTextIcon },
    { id: "beneficiaries", label: "Beneficiaries", icon: UsersIcon },
    { id: "affiliations", label: "Affiliations", icon: BuildingIcon },
    { id: "trusts", label: "Trusts", icon: BuildingIcon },
    { id: "security-access", label: "Security & Access", icon: LockIcon },
    { id: "change-theme", label: "Change Theme", icon: PaletteIcon },
    { id: "log-out", label: "Log Out", icon: LogOutIcon },
  ];

  const handleMenuItemClick = (itemId: string) => {
    console.log(`Dropdown menu item clicked: ${itemId}`);
    
    if (itemId === "change-theme") {
      // Open theme dialog
      setIsThemeDialogOpen(true);
    } else if (itemId === "log-out") {
      // Handle log out action
      onOpenForm(itemId);
    } else {
      // Open the side panel with the selected form
      setActivePanelForm(itemId);
      setIsPanelOpen(true);
    }
    
    // Close the dropdown after selection
    setIsOpen(false);
  };

  // Handle clicking outside to close the dropdown
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    // If opening and panel is open, close the panel
    if (open && isPanelOpen) {
      setIsPanelOpen(false);
    }
  };

  return (
    <div key={dropdownKey} className="fixed top-0 left-0 z-40 w-[220px] pt-4 px-5">
      <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger 
          className="flex items-center justify-between w-full py-2 hover:bg-[#1c2e4a] rounded-md transition-colors cursor-pointer"
          onClick={() => setIsOpen(!isOpen)} // Explicit toggle on click
        >
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-[#FFC107] flex items-center justify-center text-white font-medium mr-3">
              {initials}
            </div>
            <span className="font-medium text-white">Tom Brady</span>
          </div>
          <ChevronRight className={`h-4 w-4 text-white/70 transition-transform duration-200 ${isOpen ? 'rotate-[270deg]' : 'rotate-90'}`} />
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          className="w-[220px] bg-[#0F0F2D] border-gray-800 text-white z-50"
          align="start"
          sideOffset={5}
          alignOffset={0}
          forceMount
        >
          {menuItems.slice(0, 7).map((item) => {
            const Icon = item.icon;
            return (
              <DropdownMenuItem 
                key={item.id}
                onClick={() => handleMenuItemClick(item.id)}
                className="py-2.5 cursor-pointer hover:bg-[#1c2e4a]"
                onSelect={(event) => {
                  // Prevent default selection behavior
                  event.preventDefault();
                }}
              >
                <Icon className="h-4 w-4 mr-2" />
                <span>{item.label}</span>
              </DropdownMenuItem>
            );
          })}
          <DropdownMenuSeparator className="bg-gray-700" />
          {menuItems.slice(7).map((item) => {
            const Icon = item.icon;
            return (
              <DropdownMenuItem 
                key={item.id}
                onClick={() => handleMenuItemClick(item.id)}
                className="py-2.5 cursor-pointer hover:bg-[#1c2e4a]"
                onSelect={(event) => {
                  // Prevent default selection behavior
                  event.preventDefault();
                }}
              >
                <Icon className="h-4 w-4 mr-2" />
                <span>{item.label}</span>
              </DropdownMenuItem>
            );
          })}
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
