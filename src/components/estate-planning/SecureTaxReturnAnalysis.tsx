
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TaxReturnUploadDialog } from "./DocumentDialogs";
import { FileText, Calendar, Upload, Check } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export function SecureTaxReturnAnalysis() {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  
  const handleRequestAnalysis = () => {
    // Simulate notifying the advisor
    console.log("Notifying advisor about tax return analysis request");
    
    toast({
      title: "Analysis Requested",
      description: "Your advisor has been notified and will review your tax returns shortly.",
      duration: 5000,
    });
  };
  
  const handleShowInterest = () => {
    // Simulate notifying the advisor
    console.log("Notifying advisor about interest in tax return analysis");
    
    toast({
      title: "Interest Noted",
      description: "Your advisor has been notified about your interest in tax return analysis and will contact you soon.",
      duration: 5000,
    });
  };
  
  const handleScheduleAppointment = () => {
    window.open("https://calendly.com/tonygomes/60min", "_blank");
    toast({
      title: "Opening Scheduling Page",
      description: "Schedule a meeting to discuss tax return analysis with your advisor.",
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Secure Tax Return Analysis
        </CardTitle>
        <CardDescription>
          Upload your tax returns securely for professional review and optimization suggestions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-primary/5 rounded-md p-4 border border-primary/10 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Upload className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Upload Tax Returns</h4>
                <p className="text-sm text-muted-foreground">
                  Securely upload your tax returns for professional review
                </p>
              </div>
            </div>
            <Button 
              onClick={() => setIsUploadDialogOpen(true)}
              className="whitespace-nowrap"
            >
              Upload Documents
            </Button>
          </div>
          
          <div className="text-sm space-y-2 border-b pb-4">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span>Secure and confidential document handling</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span>Expert review by qualified tax professionals</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span>Personalized tax optimization strategies</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button onClick={handleRequestAnalysis} variant="default" className="flex-1">
              Request Analysis
            </Button>
            <Button onClick={handleShowInterest} variant="outline" className="flex-1">
              I'm Interested
            </Button>
            <Button onClick={handleScheduleAppointment} className="flex-1 bg-[#1B1B32] text-white hover:bg-[#2D2D4A]">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Appointment
            </Button>
          </div>
        </div>
      </CardContent>
      
      <TaxReturnUploadDialog 
        open={isUploadDialogOpen} 
        onClose={() => setIsUploadDialogOpen(false)} 
      />
    </Card>
  );
}
