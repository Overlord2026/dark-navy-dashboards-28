import React from "react";
import { Share2, MessageSquare, Users, Network } from "lucide-react";
import { NavItem } from "@/types/navigation";

export const collaborationNavItems: NavItem[] = [
  {
    title: "Project Integration",
    href: "/integration",
    icon: Share2,
  },
  {
    title: "Messages",
    href: "/messages",
    icon: MessageSquare,
  },
  {
    title: "Team",
    href: "/team",
    icon: Users,
  },
  {
    title: "Network",
    href: "/network",
    icon: Network,
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
