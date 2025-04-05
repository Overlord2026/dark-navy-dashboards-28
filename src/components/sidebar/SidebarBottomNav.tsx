
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BottomNavItem } from "@/types/navigation";

interface SidebarBottomNavProps {
  items: BottomNavItem[];
  collapsed: boolean;
  isActive: (href: string) => boolean;
  isLightTheme: boolean;
}

export const SidebarBottomNav: React.FC<SidebarBottomNavProps> = ({
  items,
  collapsed,
  isActive,
  isLightTheme
}) => {
  return (
    <div className="flex flex-col gap-1">
      {items.map((item) => (
        <Link
          key={item.id}
          to={item.href}
          className={cn(
            "flex items-center py-2 px-3 rounded-lg transition-colors",
            isActive(item.href)
              ? isLightTheme
                ? "bg-[#DCD8C0]/70 text-[#222222]"
                : "bg-white/10 text-white"
              : isLightTheme
                ? "hover:bg-[#DCD8C0]/40 text-[#222222]/90"
                : "hover:bg-white/5 text-[#E2E2E2]/90"
          )}
        >
          {item.icon && (
            <item.icon
              className={cn(
                "w-5 h-5",
                collapsed ? "" : "mr-3"
              )}
            />
          )}
          {!collapsed && <span>{item.title}</span>}
        </Link>
      ))}
    </div>
  );
};
