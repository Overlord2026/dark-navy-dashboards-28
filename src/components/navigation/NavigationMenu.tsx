
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { navigationCategories } from "@/config/navigation";

export const NavigationMenu = () => {
  const location = useLocation();
  
  return (
    <nav className="space-y-4">
      {navigationCategories.map((category) => (
        <div key={category.id} className="space-y-2">
          <h2 className="px-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            {category.label}
          </h2>
          <div className="space-y-1">
            {category.items.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive 
                      ? "bg-accent text-accent-foreground" 
                      : "hover:bg-accent hover:text-accent-foreground",
                    item.disabled && "pointer-events-none opacity-60"
                  )}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
};
