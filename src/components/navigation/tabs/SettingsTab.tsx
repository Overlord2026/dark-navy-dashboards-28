
import React from "react";
import { UserIcon, HeartHandshakeIcon, Shield } from "lucide-react";
import { NavItem } from "@/types/navigation";

export const settingsNavItems: NavItem[] = [
  { 
    title: "Help", 
    href: "/help", 
    icon: HeartHandshakeIcon 
  },
  { 
    title: "Settings", 
    href: "/settings", 
    icon: UserIcon,
    items: [
      { title: "General", href: "/settings" },
      { title: "Security", href: "/setup-2fa" },
    ]
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
