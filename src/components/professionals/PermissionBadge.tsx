
import React from "react";
import { Badge } from "@/components/ui/badge";
import { PermissionBadgeProps } from "./types/sharedDocuments";
import { HealthcareAccessLevel } from "@/types/document";

export function PermissionBadge({ permission }: PermissionBadgeProps) {
  // Cast the permission to HealthcareAccessLevel or default to "view" if invalid
  const accessLevel = isValidAccessLevel(permission) ? permission as HealthcareAccessLevel : "view";
  
  switch (accessLevel) {
    case "view":
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">View Only</Badge>;
    case "edit":
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Edit</Badge>;
    case "full":
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Full Access</Badge>;
    case "none":
      return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">No Access</Badge>;
    case "admin":
      return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Admin</Badge>;
    case "restricted":
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Restricted</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
}

// Helper function to validate permission values
function isValidAccessLevel(permission: string): boolean {
  return ["none", "view", "edit", "full", "admin", "restricted"].includes(permission);
}
