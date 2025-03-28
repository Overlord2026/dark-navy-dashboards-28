
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
import { useNavigate } from "react-router-dom";

interface UserProfileSectionProps {
  userName: string;
  avatarInitials: string;
  onMenuItemClick?: (itemId: string) => void;
}

export const UserProfileSection = ({ 
  userName, 
  avatarInitials,
  onMenuItemClick 
}: UserProfileSectionProps) => {
  const navigate = useNavigate();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activePanelForm, setActivePanelForm] = useState("investor-profile");

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
    
    if (itemId === "change-theme" || itemId === "log-out") {
      // Handle non-form items
      if (onMenuItemClick) {
        onMenuItemClick(itemId);
      }
    } else {
      // Open the side panel with the selected form
      setActivePanelForm(itemId);
      setIsPanelOpen(true);
    }
  };

  return (
    <div className="px-4 py-3 border-b border-white/10">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center justify-between w-full py-2 hover:bg-white/5 rounded-md transition-colors cursor-pointer">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-white font-medium mr-3">
              {avatarInitials}
            </div>
            <span className="font-medium text-white text-base">{userName}</span>
          </div>
          <ChevronDown className="h-4 w-4 text-white/70" />
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-[220px] bg-[#0F0F2D] border-gray-700 text-white z-50"
          align="end"
        >
          {menuItems.slice(0, 7).map((item) => (
            <DropdownMenuItem 
              key={item.id}
              onClick={() => handleMenuItemClick(item.id)}
              className="py-2.5 cursor-pointer hover:bg-white/10"
            >
              <span>{item.label}</span>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator className="bg-gray-700" />
          {menuItems.slice(7).map((item) => (
            <DropdownMenuItem 
              key={item.id}
              onClick={() => handleMenuItemClick(item.id)}
              className="py-2.5 cursor-pointer hover:bg-white/10"
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
    </div>
  );
};
