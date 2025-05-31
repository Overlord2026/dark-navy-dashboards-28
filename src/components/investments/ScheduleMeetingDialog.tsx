
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CalendarClock, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { auditLog } from "@/services/auditLog/auditLogService";

interface ScheduleMeetingDialogProps {
  assetName: string;
  consultationType?: "investment" | "estate" | "tax" | "general";
}

export const ScheduleMeetingDialog: React.FC<ScheduleMeetingDialogProps> = ({ 
  assetName,
  consultationType = "investment" 
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSchedule = () => {
    // Log the scheduling action
    const userId = "current-user"; // In a real app, this would come from auth context
    
    auditLog.log(
      userId,
      "document_access",
      "success",
      {
        resourceType: "investment_scheduling",
        resourceId: assetName,
        details: {
          action: "schedule_consultation",
          assetName,
          consultationType
        }
      }
    );
    
    // Open Calendly in a new tab
    window.open("https://calendly.com/tonygomes/60min", "_blank");
    
    // Show success toast
    toast.success("Opening scheduling page", {
      description: `Schedule a consultation about ${assetName} with your advisor.`,
    });
    
    // Close the dialog
    setIsOpen(false);
  };
  
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const getConsultationTypeLabel = () => {
    switch (consultationType) {
      case "investment": return "investment";
      case "estate": return "estate planning";
      case "tax": return "tax strategy";
      case "general": return "financial planning";
      default: return "investment";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="gap-2">
          <CalendarClock className="h-4 w-4" />
          Schedule Appointment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule a Consultation</DialogTitle>
          <DialogDescription>
            Discuss {assetName} with a financial advisor to determine if it's suitable for your portfolio.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            <div className="bg-muted rounded-lg p-4">
              <h4 className="font-medium mb-2">Benefits of a {getConsultationTypeLabel()} consultation:</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Get personalized advice tailored to your financial situation</li>
                <li>Understand the risks and potential returns of this investment</li>
                <li>Learn how it fits within your overall portfolio strategy</li>
                <li>Explore tax implications and structuring options</li>
              </ul>
            </div>
            <p className="text-sm text-muted-foreground">
              Your advisor will help you evaluate this opportunity and determine if it aligns with your financial goals and risk tolerance.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSchedule} className="gap-2">
            <CalendarClock className="h-4 w-4" />
            Schedule Meeting
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
