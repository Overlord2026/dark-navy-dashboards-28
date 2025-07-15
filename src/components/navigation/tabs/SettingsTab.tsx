
import React from "react";
import { UserIcon, HeartHandshakeIcon } from "lucide-react";
import { NavItem } from "@/types/navigation";

export const settingsNavItems: NavItem[] = [
  { 
    title: "Help", 
    href: "/help-center", 
    icon: HeartHandshakeIcon 
  },
  { 
    title: "Settings", 
    href: "/settings", 
    icon: UserIcon 
  }
];

const SettingsTab = () => {
  return (
    <div className="settings-tab">
      {/* Additional settings tab specific UI can be added here */}
    </div>
  );
};

export default SettingsTab;
