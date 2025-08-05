import { Shield, Award, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PatentBadgeProps {
  variant?: "horizontal" | "vertical" | "mini";
  innovation?: string;
  className?: string;
}

export function PatentPendingBadge({ variant = "horizontal", innovation, className = "" }: PatentBadgeProps) {
  const baseClasses = "inline-flex items-center gap-2 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 text-white font-semibold shadow-lg";
  
  if (variant === "mini") {
    return (
      <Badge className={`${baseClasses} px-2 py-1 text-xs ${className}`}>
        <Shield className="h-3 w-3" />
        Patent Pending
      </Badge>
    );
  }

  if (variant === "vertical") {
    return (
      <div className={`${baseClasses} flex-col text-center px-4 py-3 rounded-lg ${className}`}>
        <div className="flex items-center gap-2 mb-1">
          <Award className="h-5 w-5" />
          <Zap className="h-4 w-4" />
        </div>
        <div className="text-sm font-bold">PATENT</div>
        <div className="text-xs">PENDING</div>
        {innovation && (
          <div className="text-xs mt-1 opacity-90 font-normal">
            {innovation}
          </div>
        )}
        <div className="text-xs opacity-75 mt-1">Family Office Platform™</div>
      </div>
    );
  }

  return (
    <div className={`${baseClasses} px-4 py-2 rounded-full ${className}`}>
      <Shield className="h-4 w-4" />
      <span className="text-sm">
        Patent Pending
        {innovation && ` • ${innovation}`}
      </span>
      <Award className="h-4 w-4" />
    </div>
  );
}

export function AllPatentBadges() {
  const innovations = [
    "Legacy Vault™",
    "SWAG Score™", 
    "AI Avatars",
    "Family Office Platform™"
  ];

  return (
    <div className="space-y-6 p-6">
      <h3 className="text-lg font-semibold">Patent Pending Badges</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Horizontal Badges</h4>
          <div className="flex flex-wrap gap-3">
            <PatentPendingBadge />
            {innovations.map(innovation => (
              <PatentPendingBadge key={innovation} innovation={innovation} />
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Vertical Badges</h4>
          <div className="flex gap-4">
            <PatentPendingBadge variant="vertical" />
            <PatentPendingBadge variant="vertical" innovation="Legacy Vault™" />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Mini Badges</h4>
          <div className="flex flex-wrap gap-2">
            {innovations.map(innovation => (
              <PatentPendingBadge key={innovation} variant="mini" innovation={innovation} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}