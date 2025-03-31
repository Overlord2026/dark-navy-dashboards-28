
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bug } from "lucide-react";
import { QuickDiagnosticsDialog } from "./QuickDiagnosticsDialog";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const QuickDiagnosticsButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
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
          </TooltipTrigger>
          <TooltipContent>
            <p>Run a quick check of your system</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <QuickDiagnosticsDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
};
