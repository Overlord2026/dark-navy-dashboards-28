
import React from "react";
import { Share2, MessageSquare, Users, Network } from "lucide-react";
import { NavItem } from "@/types/navigation";

export const collaborationNavItems: NavItem[] = [
  {
    id: "integration",
    title: "Project Integration",
    href: "/integration",
    icon: Share2,
  },
  {
    id: "messages",
    title: "Messages",
    href: "/messages",
    icon: MessageSquare,
  },
  {
    id: "team",
    title: "Team",
    href: "/team",
    icon: Users,
  },
  {
    id: "network",
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
