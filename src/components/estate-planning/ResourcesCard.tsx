
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, FileText } from "lucide-react";

export const ResourcesCard: React.FC = () => {
  return (
    <Card className="w-full lg:w-1/4">
      <CardHeader>
        <CardTitle className="text-lg">Resources</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-medium mb-2">DIY Estate Planning</h4>
          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-between"
              onClick={() => window.open('https://trustandwill.com', '_blank')}
            >
              <span>Trust and Will</span>
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-between"
              onClick={() => window.open('https://wealth.com', '_blank')}
            >
              <span>Wealth.com</span>
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Estate Planning Guides</h4>
          <ul className="space-y-2">
            {["Estate Planning Basics", "Power of Attorney Guide", "Trust Formation"].map((guide, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm text-primary">
                <FileText className="h-4 w-4" />
                <a href="#" className="hover:underline">{guide}</a>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Get Expert Help</h4>
          <p className="text-sm text-muted-foreground mb-2">
            Need assistance with estate planning?
          </p>
          <Button className="w-full">Schedule a Consultation</Button>
        </div>
      </CardContent>
    </Card>
  );
};
