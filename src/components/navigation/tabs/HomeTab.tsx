
import React from "react";
import { HomeIcon } from "lucide-react";
import { NavItem, TabProps } from "@/types/navigation";
import { tabBaseStyles } from "./TabStyles";

export const homeNavItems: NavItem[] = [
  { 
    title: "Home", 
    href: "/", 
    icon: HomeIcon 
  }
];

const HomeTab = ({ className }: TabProps) => {
  return (
    <div className={`${tabBaseStyles.container} ${className}`}>
      <h2 className={tabBaseStyles.title}>Home</h2>
      <div className={tabBaseStyles.grid}>
        {homeNavItems.map((item) => (
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

export default HomeTab;
