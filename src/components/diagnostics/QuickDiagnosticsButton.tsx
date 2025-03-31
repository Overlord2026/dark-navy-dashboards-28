
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bug } from "lucide-react";
import { QuickDiagnosticsDialog } from "./QuickDiagnosticsDialog";
import { toast } from "sonner";

export const QuickDiagnosticsButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="gap-2"
        onClick={() => {
          setIsDialogOpen(true);
          toast.success("Diagnostics tool opened");
        }}
      >
        <Bug className="h-4 w-4" />
        <span>Run Diagnostics</span>
      </Button>
      
      <QuickDiagnosticsDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
};
