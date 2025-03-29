
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Info } from "lucide-react";
import { toast } from "sonner";

interface ScheduleMeetingDialogProps {
  assetName: string;
}

export const ScheduleMeetingDialog: React.FC<ScheduleMeetingDialogProps> = ({ assetName }) => {
  const handleOpenCalendar = () => {
    // The URL would typically come from the user's context or configuration
    window.open("https://meetings.hubspot.com/daniel-herrera1?uuid=55ab1315-5daa-4009-af29-f100ee7aae67", "_blank");
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full flex items-center justify-center gap-2">
          <Calendar className="h-4 w-4" />
          Schedule a meeting
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Meeting with Advisor</DialogTitle>
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
              src="/public/lovable-uploads/de09b008-ad83-47b7-a3bf-d51532be0261.png" 
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
