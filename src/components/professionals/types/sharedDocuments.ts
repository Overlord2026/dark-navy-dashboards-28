
import { DocumentItem, DocumentPermission, HealthcareAccessLevel } from "@/types/document";
import { Professional } from "@/types/professional";

export interface DocumentIconProps {
  type: string;
  className?: string;
}

export interface PermissionBadgeProps {
  permission: string;
}

export interface DocumentActionsProps {
  document: DocumentItem;
  onDelete: (document: DocumentItem) => void;
  onDownload: (document: DocumentItem) => void;
}

export interface EmptyDocumentsProps {
  message?: string;
  description?: string;
}
