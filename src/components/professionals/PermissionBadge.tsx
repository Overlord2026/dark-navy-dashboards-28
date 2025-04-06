
import React from "react";
import { Badge } from "@/components/ui/badge";
import { PermissionBadgeProps } from "./types/sharedDocuments";

export function PermissionBadge({ permission }: PermissionBadgeProps) {
  switch (permission) {
    case "view":
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">View Only</Badge>;
    case "download":
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Download</Badge>;
    case "edit":
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Edit</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
}
