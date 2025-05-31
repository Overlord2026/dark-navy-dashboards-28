import React, { useState } from "react";
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
import { useInvestmentMeetings } from "@/hooks/useInvestmentMeetings";
import { useAuth } from "@/context/AuthContext";

interface ScheduleMeetingDialogProps {
  offeringId?: string;
  assetName: string;
  consultationType?: "investment" | "estate" | "tax" | "general";
}

export const ScheduleMeetingDialog: React.FC<ScheduleMeetingDialogProps> = ({ 
  offeringId,
  assetName,
  consultationType = "investment" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { scheduleMeeting } = useInvestmentMeetings();
  const { user } = useAuth();

  // Helper function to check if string is a valid UUID
  const isValidUUID = (str: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  };

  const handleSchedule = async () => {
    if (!user) {
      toast.error("Please log in to schedule a meeting");
      return;
    }

    setIsLoading(true);

    try {
      // Log the scheduling action using a valid audit event type
      auditLog.log(
        user.id,
        "system_change",
        "success",
        {
          resourceType: "investment_meeting",
          resourceId: offeringId || assetName,
          details: {
            action: "schedule_consultation",
            assetName,
            consultationType,
            offeringId
          }
        }
      );

      // Only save meeting request to database if offeringId is a valid UUID
      if (offeringId && isValidUUID(offeringId)) {
        await scheduleMeeting({
          offering_id: offeringId,
          consultation_type: consultationType,
          notes: `Meeting request for ${assetName}`
        });
      }
      
      // Open Calendly in a new tab
      window.open("https://calendly.com/tonygomes/60min", "_blank");
      
      // Show success toast
      toast.success("Meeting request saved and scheduling page opened", {
        description: `Schedule a consultation about ${assetName} with your advisor.`,
      });
      
      // Close the dialog
      setIsOpen(false);
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      toast.error("Failed to save meeting request. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
          Schedule Meeting
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
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSchedule} className="gap-2" disabled={isLoading}>
            <CalendarClock className="h-4 w-4" />
            {isLoading ? "Scheduling..." : "Schedule Meeting"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
