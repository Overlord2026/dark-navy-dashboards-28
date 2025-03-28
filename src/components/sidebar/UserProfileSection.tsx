
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

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
  const menuItems = [
    { id: "profile", label: "Profile" },
    { id: "contact-info", label: "Contact Info" },
    { id: "additional-info", label: "Additional Info" },
    { id: "security-access", label: "Security & Access" },
    { id: "change-theme", label: "Change Theme" },
    { id: "log-out", label: "Log Out" },
  ];

  const handleMenuItemClick = (itemId: string) => {
    if (onMenuItemClick) {
      onMenuItemClick(itemId);
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
          className="w-[200px] bg-[#1E1E30] border-gray-700 text-white"
          align="end"
        >
          {menuItems.slice(0, 4).map((item) => (
            <DropdownMenuItem 
              key={item.id}
              onClick={() => handleMenuItemClick(item.id)}
              className="py-2.5 cursor-pointer hover:bg-white/10"
            >
              <span>{item.label}</span>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator className="bg-gray-700" />
          {menuItems.slice(4).map((item) => (
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
    </div>
  );
};
