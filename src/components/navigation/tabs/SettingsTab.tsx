
import React from "react";
import { UserIcon, HeartHandshakeIcon } from "lucide-react";
import { NavItem, TabProps } from "@/types/navigation";
import { tabBaseStyles } from "./TabStyles";

export const settingsNavItems: NavItem[] = [
  { 
    title: "Help", 
    href: "/help", 
    icon: HeartHandshakeIcon 
  },
  { 
    title: "Settings", 
    href: "/settings", 
    icon: UserIcon 
  }
];

const SettingsTab = ({ className }: TabProps) => {
  return (
    <div className={`${tabBaseStyles.container} ${className}`}>
      <h2 className={tabBaseStyles.title}>Settings</h2>
      <div className={tabBaseStyles.grid}>
        {settingsNavItems.map((item) => (
          <a 
            key={item.href} 
            href={item.href}
            className={tabBaseStyles.item}
          >
            {item.icon && <item.icon className={tabBaseStyles.icon} />}
            <span>{item.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default SettingsTab;
