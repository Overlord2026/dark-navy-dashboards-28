
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Navigation } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { NavigationDiagnosticModule } from "./NavigationDiagnosticModule";
import { useUser } from "@/context/UserContext";

interface QuickNavigationCheckProps {
  buttonText?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "marketplace";
  size?: "default" | "sm" | "lg" | "icon";
}

export function QuickNavigationCheck({ 
  buttonText = "Check Navigation", 
  variant = "outline",
  size = "sm"
}: QuickNavigationCheckProps) {
  const [open, setOpen] = useState(false);
  const { userProfile } = useUser();
  
  // Check if user is an admin
  const userRole = userProfile?.role || "client";
  const isAdmin = userRole === "admin" || userRole === "system_administrator";
  
  // Don't render anything for non-admin users
  if (!isAdmin) {
    return null;
  }
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className="gap-2">
          <Navigation className="h-4 w-4" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Admin Tools: Navigation Health Check</DialogTitle>
          <DialogDescription>
            Verify all navigation routes are working properly before making changes
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <NavigationDiagnosticModule />
        </div>
      </DialogContent>
    </Dialog>
  );
}
