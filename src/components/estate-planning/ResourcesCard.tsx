
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, FileText } from "lucide-react";
import { toast } from "sonner";

export const ResourcesCard: React.FC = () => {
  const handleScheduleConsultation = () => {
    // Open Calendly with Tony Gomes's link
    window.open("https://calendly.com/tonygomes/talk-with-tony", "_blank");
    
    toast.success("Opening scheduling page", {
      description: "Schedule your estate planning consultation with your advisor.",
      duration: 3000,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Resources</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-medium mb-3 text-sm">DIY Estate Planning</h4>
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-between text-sm h-auto py-2 px-3"
              onClick={() => window.open('https://trustandwill.com', '_blank')}
            >
              <span className="truncate">Trust and Will</span>
              <ExternalLink className="h-4 w-4 flex-shrink-0 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-between text-sm h-auto py-2 px-3"
              onClick={() => window.open('https://wealth.com', '_blank')}
            >
              <span className="truncate">Wealth.com</span>
              <ExternalLink className="h-4 w-4 flex-shrink-0 ml-2" />
            </Button>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-3 text-sm">Estate Planning Guides</h4>
          <ul className="space-y-2">
            {["Estate Planning Basics", "Power of Attorney Guide", "Trust Formation"].map((guide, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-primary">
                <FileText className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <a href="#" className="hover:underline leading-relaxed break-words">{guide}</a>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium mb-3 text-sm">Get Expert Help</h4>
          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
            Need assistance with estate planning?
          </p>
          <Button onClick={handleScheduleConsultation} className="w-full text-sm h-auto py-2">
            Schedule a Consultation
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
