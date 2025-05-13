
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { SidebarSection } from "@/components/sidebar/SidebarSection";
import { SidebarToggle } from "@/components/sidebar/SidebarToggle";
import { navigationItems, bottomNavigationItems, advisorNavigationItems } from "@/components/sidebar/navigationConfig";

// Create navSections from the imported navigation items
const navSections = [
  {
    id: "main",
    label: "Main Navigation",
    icon: () => null,
    items: navigationItems
  },
  {
    id: "bottom",
    label: "Settings",
    icon: () => null,
    items: bottomNavigationItems
  }
];

export const Sidebar = () => {
  const location = useLocation();
  const [openSections, setOpenSections] = useState<string[]>(["education", "planning", "wealth"]);
  const [isCollapsed, setIsCollapsed] = useLocalStorage("sidebarCollapsed", false);

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={cn("h-full flex flex-col", isCollapsed ? "w-16" : "w-64")}>
      <div className="p-4 flex justify-between items-center border-b">
        {!isCollapsed && <h1 className="font-semibold">Navigation</h1>}
        <SidebarToggle isCollapsed={isCollapsed} toggleCollapsed={toggleCollapsed} />
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {navSections.map(section => (
          <SidebarSection
            key={section.id}
            section={section}
            isOpen={openSections.includes(section.id)}
            toggleSection={toggleSection}
            isCollapsed={isCollapsed}
            currentPath={`${location.pathname}${location.search}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
