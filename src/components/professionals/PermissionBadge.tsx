
import React from "react";
import { Badge } from "@/components/ui/badge";
import { PermissionBadgeProps } from "./types/sharedDocuments";

export function PermissionBadge({ permission }: PermissionBadgeProps) {
  switch (permission) {
    case "view":
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">View Only</Badge>;
    case "edit":
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Edit</Badge>;
    case "full":
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Full Access</Badge>;
    case "none":
      return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">No Access</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
}
