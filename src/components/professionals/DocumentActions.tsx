
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, ShieldCheck, Trash2 } from "lucide-react";
import { DocumentActionsProps } from "./types/sharedDocuments";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

export function DocumentActions({ document, onDelete, onDownload }: DocumentActionsProps) {
  return (
    <div className="flex justify-end gap-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={() => onDownload(document)}>
              <Download className="h-4 w-4 text-muted-foreground" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Download</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon">
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Manage Permissions</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={() => onDelete(document)}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Remove Sharing</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
