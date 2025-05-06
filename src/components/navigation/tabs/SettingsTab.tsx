
import React from "react";
import { UserIcon, HeartHandshakeIcon } from "lucide-react";
import { NavItem } from "@/types/navigation";

export const settingsNavItems: NavItem[] = [
  { 
    id: "help",
    title: "Help", 
    href: "/help", 
    icon: HeartHandshakeIcon 
  },
  { 
    id: "settings",
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
