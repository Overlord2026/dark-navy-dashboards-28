
import { Badge } from "@/components/ui/badge";
import { HealthcareAccessLevel } from "@/types/document";

interface PermissionBadgeProps {
  accessLevel: HealthcareAccessLevel;
  className?: string;
}

export function PermissionBadge({ accessLevel, className }: PermissionBadgeProps) {
  const getVariantAndText = (level: HealthcareAccessLevel) => {
    switch (level) {
      case "view":
        return { variant: "secondary", text: "View Only" };
      case "edit":
        return { variant: "default", text: "Can Edit" };
      case "full":
        return { variant: "destructive", text: "Full Access" };
      default:
        return { variant: "outline", text: "Unknown" };
    }
  };

  const { variant, text } = getVariantAndText(accessLevel);

  return (
    <Badge variant={variant as any} className={className}>
      {text}
    </Badge>
  );
}
