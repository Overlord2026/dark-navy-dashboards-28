import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Lock, FileCheck, Eye, Users } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const SecurityPrivacyBadges: React.FC = () => {
  const badges = [
    {
      icon: Shield,
      label: "256-bit SSL",
      description: "All data transmitted with bank-level encryption",
      color: "text-green-500"
    },
    {
      icon: Lock,
      label: "SOC 2 Type II",
      description: "Independently audited security controls",
      color: "text-blue-500"
    },
    {
      icon: FileCheck,
      label: "GDPR Compliant",
      description: "Full privacy protection and data rights",
      color: "text-purple-500"
    },
    {
      icon: Eye,
      label: "Zero Knowledge",
      description: "We cannot access your banking credentials",
      color: "text-orange-500"
    },
    {
      icon: Users,
      label: "Audit Trail",
      description: "Complete transaction and access logging",
      color: "text-teal-500"
    }
  ];

  return (
    <TooltipProvider>
      <Card className="bg-muted/20 border-green-200">
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-muted-foreground mr-2">Protected by:</span>
            {badges.map((badge, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Badge variant="secondary" className="flex items-center gap-1 cursor-help">
                    <badge.icon className={`h-3 w-3 ${badge.color}`} />
                    {badge.label}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{badge.description}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};