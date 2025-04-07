
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarClock } from "lucide-react";
import { toast } from "sonner";

export interface ScheduleMeetingDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  assetName: string;
}

export const ScheduleMeetingDialog: React.FC<ScheduleMeetingDialogProps> = ({
  open,
  onOpenChange,
  assetName
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    } else {
      setIsOpen(newOpen);
    }
  };
  
  const handleSchedule = () => {
    // In a real app, this would integrate with a scheduling service
    toast.success("Meeting request sent", {
      description: `We'll reach out to you shortly to schedule a consultation about ${assetName}.`,
    });
    handleOpenChange(false);
  };
  
  // Determine which open state to use (controlled vs uncontrolled)
  const dialogOpen = open !== undefined ? open : isOpen;
  
  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      {/* Only render the trigger if we're not in controlled mode */}
      {open === undefined && (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4" />
            Schedule Meeting
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule a Consultation</DialogTitle>
          <DialogDescription>
            Speak with an advisor about {assetName || "investment options"}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Our team will contact you within 24 hours to schedule a convenient time for your consultation.
          </p>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSchedule} className="gap-2">
            <CalendarClock className="h-4 w-4" />
            Request Consultation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleMeetingDialog;
