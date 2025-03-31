
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  ShoppingBag, 
  FileText, 
  ChevronDown, 
  Bug, 
  Activity, 
  Landmark, 
  Home, 
  Shield 
} from "lucide-react";
import { Link } from "react-router-dom";
import { QuickDiagnosticsButton } from "@/components/diagnostics/QuickDiagnosticsButton";
import { DiagnosticsAccessButton } from "@/components/diagnostics/DiagnosticsAccessButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export const QuickActionsMenu = () => {
  const [showAllActions, setShowAllActions] = useState(false);

  // Most frequently used actions
  const primaryActions = [
    { icon: FileText, label: "Legacy Vault", path: "/legacy-vault" },
    { icon: ShoppingBag, label: "Marketplace", path: "/marketplace" },
  ];

  // Additional actions accessible via dropdown
  const secondaryActions = [
    { icon: Landmark, label: "Financial Plans", path: "/financial-plans" },
    { icon: Home, label: "Properties", path: "/properties" },
    { icon: Shield, label: "Insurance", path: "/insurance" },
  ];

  const handleQuickAction = (label: string) => {
    toast.success(`Navigating to ${label}`);
  };

  return (
    <div className="flex items-center gap-3">
      {/* Always visible primary action buttons */}
      {primaryActions.map((action) => (
        <Button 
          key={action.label} 
          variant="outline" 
          className="gap-2" 
          asChild
          onClick={() => handleQuickAction(action.label)}
        >
          <Link to={action.path}>
            <action.icon className="h-4 w-4" />
            {action.label}
          </Link>
        </Button>
      ))}

      {/* Diagnostic buttons */}
      <QuickDiagnosticsButton />
      <DiagnosticsAccessButton />

      {/* More actions dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <span>More Actions</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {secondaryActions.map((action) => (
              <DropdownMenuItem key={action.label} asChild>
                <Link 
                  to={action.path}
                  className="flex items-center gap-2 cursor-pointer w-full"
                  onClick={() => handleQuickAction(action.label)}
                >
                  <action.icon className="h-4 w-4" />
                  <span>{action.label}</span>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/system-diagnostics" className="flex items-center gap-2 cursor-pointer w-full">
              <Activity className="h-4 w-4" />
              <span>Advanced Diagnostics</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
