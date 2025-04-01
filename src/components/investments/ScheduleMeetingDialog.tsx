
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarClock } from "lucide-react";
import { toast } from "sonner";

interface ScheduleMeetingDialogProps {
  assetName: string;
}

export const ScheduleMeetingDialog: React.FC<ScheduleMeetingDialogProps> = ({ assetName }) => {
  const handleOpenCalendar = () => {
    // Use the specified Calendly link for scheduling
    window.open("https://calendly.com/tonygomes/60min", "_blank");
    
    toast.success("Opening scheduling page", {
      description: `Schedule a meeting to discuss ${assetName} with your advisor.`,
      duration: 3000,
    });
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full flex items-center justify-center gap-2">
          <CalendarClock className="h-4 w-4" />
          Schedule an Appointment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Appointment with Advisor</DialogTitle>
          <DialogDescription>
            Book a consultation about {assetName} with your financial advisor.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            You'll be redirected to your advisor's calendar to select a convenient time for your meeting.
          </p>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={handleOpenCalendar}>
            Continue to Calendar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
