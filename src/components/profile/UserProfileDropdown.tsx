
import { useState } from "react";
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

interface UserProfileDropdownProps {
  onOpenForm: (formId: string) => void;
}

export const UserProfileDropdown = ({ onOpenForm }: UserProfileDropdownProps) => {
  const menuItems = [
    { id: "profile", label: "Profile", icon: UserIcon },
    { id: "contact-info", label: "Contact Info", icon: PhoneIcon },
    { id: "additional-info", label: "Additional Info", icon: FileTextIcon },
    { id: "beneficiaries", label: "Beneficiaries", icon: UsersIcon },
    { id: "affiliations", label: "Affiliations", icon: BuildingIcon },
    { id: "trusts", label: "Trusts", icon: BuildingIcon },
    { id: "security-access", label: "Security & Access", icon: LockIcon },
    { id: "change-theme", label: "Change Theme", icon: PaletteIcon },
    { id: "log-out", label: "Log Out", icon: LogOutIcon },
  ];

  return (
    <div className="fixed top-0 left-0 z-40 w-[220px] pt-4 px-5">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center justify-between w-full py-2 hover:bg-[#1c2e4a] rounded-md transition-colors cursor-pointer">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white font-medium mr-3">
              AG
            </div>
            <span className="font-medium">Antonio Gomez</span>
          </div>
          <ChevronRight className="h-4 w-4 rotate-90" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[220px] bg-[#0a1021] border-gray-700 text-white">
          {menuItems.slice(0, 7).map((item) => {
            const Icon = item.icon;
            return (
              <DropdownMenuItem 
                key={item.id}
                onClick={() => onOpenForm(item.id)}
                className="py-2.5 cursor-pointer hover:bg-[#1c2e4a]"
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
                className="py-2.5 cursor-pointer hover:bg-[#1c2e4a]"
              >
                <Icon className="h-4 w-4 mr-2" />
                <span>{item.label}</span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
