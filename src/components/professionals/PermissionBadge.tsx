
import React from "react";
import { Badge } from "@/components/ui/badge";

interface PermissionBadgeProps {
  accessLevel: string;
}

export function PermissionBadge({ accessLevel }: PermissionBadgeProps) {
  const getBadgeVariant = (level: string) => {
    switch (level) {
      case "view":
        return "secondary";
      case "download":
        return "default";
      case "edit":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getDisplayText = (level: string) => {
    switch (level) {
      case "view":
        return "View Only";
      case "download":
        return "View & Download";
      case "edit":
        return "Full Access";
      default:
        return level;
    }
  };

  return (
    <Badge variant={getBadgeVariant(accessLevel)}>
      {getDisplayText(accessLevel)}
    </Badge>
  );
}
