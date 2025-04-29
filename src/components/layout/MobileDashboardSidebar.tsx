
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { MainNavItem, SidebarNavItem } from "@/types";

interface MobileDashboardSidebarProps {
  mainNavigationItems: MainNavItem[];
  sidebarNavigationItems: SidebarNavItem[];
}

export function MobileDashboardSidebar({
  mainNavigationItems,
  sidebarNavigationItems,
}: MobileDashboardSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Menu Button */}
      <button
        className="fixed top-4 left-4 z-50 rounded-md p-2 text-white bg-primary"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80">
          <div className="fixed inset-y-0 left-0 w-64 bg-background p-6 shadow-lg">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <img 
                  src="/lovable-uploads/3346c76f-f91c-4791-b77d-adb2f34a06af.png" 
                  alt="Boutique Family Office Logo" 
                  className="h-8 w-auto mr-2"
                />
                <span className="text-foreground text-lg font-semibold">BFO</span>
              </div>
              <button
                className="rounded-md p-1 text-foreground"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              <nav className="space-y-1">
                {mainNavigationItems.map((item) => (
                  <Link
                    key={item.id}
                    to={item.href}
                    className="flex items-center py-2 text-sm rounded-md hover:bg-accent"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon && <item.icon className="h-5 w-5 mr-3" />}
                    {item.name}
                  </Link>
                ))}
              </nav>
              
              <div className="border-t border-border pt-4">
                <nav className="space-y-1">
                  {sidebarNavigationItems.map((item) => (
                    <Link
                      key={item.id}
                      to={item.href}
                      className="flex items-center py-2 text-sm rounded-md hover:bg-accent"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.icon && <item.icon className="h-5 w-5 mr-3" />}
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
