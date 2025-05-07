
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, FileText } from "lucide-react";

export const ResourcesCard: React.FC = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Estate Planning Resources</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Educational Resources</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-primary hover:underline flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Estate Planning Guide
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </li>
            <li>
              <a href="#" className="text-primary hover:underline flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Will & Trust Basics
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </li>
            <li>
              <a href="#" className="text-primary hover:underline flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Power of Attorney Guide
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Professional Assistance</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-primary hover:underline flex items-center">
                Find an Estate Attorney
              </a>
            </li>
            <li>
              <a href="#" className="text-primary hover:underline flex items-center">
                Schedule a Planning Session
              </a>
            </li>
          </ul>
        </div>
        
        <Button className="w-full mt-4" variant="outline">
          Download Complete Resource Kit
        </Button>
      </CardContent>
    </Card>
  );
};
