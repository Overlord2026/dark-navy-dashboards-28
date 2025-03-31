
import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Bug, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { QuickDiagnosticsButton } from "@/components/diagnostics/QuickDiagnosticsButton";
import { DiagnosticsAccessButton } from "@/components/diagnostics/DiagnosticsAccessButton";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";

export const QuickActionsMenu = () => {
  const { userProfile } = useUser();
  const userRole = userProfile?.role || "client";
  const isAdmin = userRole === "admin" || userRole === "system_administrator";

  const handleQuickAction = (label: string) => {
    toast.success(`Navigating to ${label}`);
  };

  return (
    <div className="flex items-center justify-center gap-4 w-full">
      {/* Marketplace button - visible to all roles */}
      <Button 
        variant="outline" 
        className="gap-2" 
        asChild
        onClick={() => handleQuickAction("Marketplace")}
      >
        <Link to="/marketplace">
          <ShoppingBag className="h-4 w-4" />
          Marketplace
        </Link>
      </Button>

      {/* Diagnostic buttons - only visible to admin roles */}
      {isAdmin && (
        <>
          <QuickDiagnosticsButton />
          <DiagnosticsAccessButton />
        </>
      )}
    </div>
  );
};
