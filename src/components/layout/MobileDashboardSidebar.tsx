
import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { MainNavItem, SidebarNavItem } from "@/types";
import GoldTreeLogo from "@/assets/logo-gold-tree.svg";

interface MobileDashboardSidebarProps {
  mainNavigationItems: MainNavItem[];
  sidebarNavigationItems: SidebarNavItem[];
}

export function MobileDashboardSidebar({ 
  mainNavigationItems,
  sidebarNavigationItems 
}: MobileDashboardSidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[80%] sm:w-[350px] p-0">
        <div className="h-full flex flex-col">
          <div className="p-4">
            <Link to="/" className="flex items-center" onClick={() => setOpen(false)}>
              <img 
                src={GoldTreeLogo} 
                alt="Gold Tree Logo" 
                className="h-10 w-auto"
              />
              <span className="text-lg font-semibold ml-2">Family Office</span>
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto py-2">
            <div className="px-4 py-2">
              <h2 className="text-sm font-semibold">Main Navigation</h2>
              <div className="mt-2 space-y-1">
                {mainNavigationItems.map((item) => {
                  const Icon = item.icon;
                  
                  return (
                    <Link
                      key={item.id}
                      to={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted"
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 px-4 py-2">
              <h2 className="text-sm font-semibold">Settings</h2>
              <div className="mt-2 space-y-1">
                {sidebarNavigationItems.map((item) => {
                  const Icon = item.icon;
                  
                  return (
                    <Link
                      key={item.id}
                      to={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted"
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
