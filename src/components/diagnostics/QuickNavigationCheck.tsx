
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Navigation } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import NavigationDiagnosticModule from "./NavigationDiagnosticModule";

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
          <DialogTitle>Navigation Health Check</DialogTitle>
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
