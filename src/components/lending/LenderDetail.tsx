
import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Calendar, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { InterestedButton } from "@/components/investments/InterestedButton";

interface Lender {
  id: string;
  name: string;
  category: string;
  offering: string;
  description: string;
  about: string;
  howItWorks: string;
  otherOfferings: string[];
  topUnderwriters: string[];
}

interface LenderDetailProps {
  isOpen: boolean;
  onClose: () => void;
  lender: Lender;
}

export const LenderDetail: React.FC<LenderDetailProps> = ({ isOpen, onClose, lender }) => {
  const { toast } = useToast();

  const handleScheduleMeeting = () => {
    toast({
      title: "Meeting Requested",
      description: `Your advisor has been notified about your interest in scheduling a meeting about ${lender.name} ${lender.offering}.`,
      duration: 5000,
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="flex flex-row items-start justify-between mb-5">
          <SheetTitle className="text-xl font-semibold">{lender.name}</SheetTitle>
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </SheetClose>
        </SheetHeader>
        
        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground">{lender.description}</p>
          </div>
          
          <div>
            <h3 className="font-medium text-base mb-2">About {lender.name}</h3>
            <p className="text-sm text-muted-foreground">{lender.about}</p>
          </div>
          
          <div>
            <h3 className="font-medium text-base mb-2">How It Works</h3>
            <p className="text-sm text-muted-foreground">{lender.howItWorks}</p>
          </div>
          
          <div>
            <h3 className="font-medium text-base mb-2">Ready to Get Started?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              To get started, schedule a meeting with your advisor or tell them you're interested in this offering.
            </p>
            <div className="flex gap-3">
              <InterestedButton assetName={`${lender.name} ${lender.offering}`} />
              <Button variant="outline" onClick={handleScheduleMeeting}>
                <Calendar className="h-4 w-4 mr-2" /> Schedule Appointment
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-base mb-2">Details</h3>
            
            <div className="space-y-4">
              <div className="border rounded-md p-4">
                <h4 className="text-sm font-medium mb-2">Other Offerings</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {lender.otherOfferings.map((offering, index) => (
                    <li key={index}>{offering}</li>
                  ))}
                </ul>
              </div>
              
              <div className="border rounded-md p-4">
                <h4 className="text-sm font-medium mb-2">Top Underwriters</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {lender.topUnderwriters.map((underwriter, index) => (
                    <li key={index}>{underwriter}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
