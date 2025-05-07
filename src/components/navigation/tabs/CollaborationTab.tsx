import React from "react";
import { Share2, Users2 } from "lucide-react";
import { NavItem } from "@/types/navigation";

export const collaborationNavItems: NavItem[] = [
  {
    title: "Family Collaboration",
    href: "/sharing",
    icon: Share2,
  },
  {
    title: "Professional Collaboration",
    href: "/professionals",
    icon: Users2,
  }
];

const CollaborationTab = () => {
  return (
    <div className="collaboration-tab">
      {/* Collaboration tab specific UI can be added here */}
    </div>
  );
};

export default CollaborationTab;
