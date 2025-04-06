
import React from "react";
import { FileTextIcon, Users2Icon, ShareIcon, HeartHandshakeIcon } from "lucide-react";
import { NavItem } from "@/types/navigation";

export const collaborationNavItems: NavItem[] = [
  { 
    title: "Document Sharing", 
    href: "/documents", 
    icon: FileTextIcon 
  },
  { 
    title: "Service Professionals", 
    href: "/professionals", 
    icon: Users2Icon 
  },
  { 
    title: "Family Members", 
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
