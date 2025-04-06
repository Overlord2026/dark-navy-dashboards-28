
import React from "react";
import { FileTextIcon, Users2, ShareIcon } from "lucide-react";
import { NavItem } from "@/types/navigation";

export const collaborationNavItems: NavItem[] = [
  { 
    title: "Document Sharing", 
    href: "/documents", 
    icon: FileTextIcon 
  },
  { 
    title: "Professional Access", 
    href: "/professionals", 
    icon: Users2 
  },
  { 
    title: "Family Member Access", 
    href: "/sharing", 
    icon: ShareIcon 
  }
];

const CollaborationTab = () => {
  return (
    <div className="collaboration-tab">
      {/* Additional collaboration tab specific UI can be added here */}
    </div>
  );
};

export default CollaborationTab;
