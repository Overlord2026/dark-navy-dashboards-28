
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
    // Use a generic meeting URL that doesn't reference Farther
    window.open("https://meetings.hubspot.com/daniel-herrera1", "_blank");
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
          
          <div className="flex justify-center">
            <img 
              src="/lovable-uploads/490e61a7-2d7a-404a-b8f6-4bd3b561dc7b.png" 
              alt="Calendar Preview" 
              className="max-h-52 rounded-md border shadow-sm"
            />
          </div>
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
