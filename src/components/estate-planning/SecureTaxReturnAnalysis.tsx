
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TaxReturnUploadDialog } from "./DocumentDialogs";
import { FileText, Calendar, Upload, Check } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useTaxPlanning } from "@/hooks/useTaxPlanning";

export function SecureTaxReturnAnalysis() {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isSubmittingInterest, setIsSubmittingInterest] = useState(false);
  const { createInterest, scheduleMeeting } = useTaxPlanning();
  
  const handleRequestAnalysis = () => {
    toast({
      title: "Analysis Requested",
      description: "Your advisor will review your tax returns and provide an analysis shortly."
    });
  };
  
  const handleShowInterest = async () => {
    setIsSubmittingInterest(true);
    try {
      await createInterest({
        interest_type: 'tax_return_analysis',
        asset_name: 'Secure Tax Return Analysis',
        notes: 'Expressed interest in tax return analysis service'
      });
    } catch (error) {
      console.error('Error submitting interest:', error);
    } finally {
      setIsSubmittingInterest(false);
    }
  };
  
  const handleScheduleAppointment = () => {
    scheduleMeeting('Tax Return Analysis');
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
            <div className="relative">
              <div className="absolute -top-2 -right-2 z-10">
                <Badge variant="warning">Coming Soon</Badge>
              </div>
              <div className="opacity-60 pointer-events-none">
                <Button 
                  onClick={() => setIsUploadDialogOpen(true)}
                  className="whitespace-nowrap"
                >
                  Upload Documents
                </Button>
              </div>
            </div>
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
            <div className="relative flex-1">
              <div className="absolute -top-2 -right-2 z-10">
                <Badge variant="warning">Coming Soon</Badge>
              </div>
              <div className="opacity-60 pointer-events-none">
                <Button onClick={handleRequestAnalysis} variant="default" className="w-full">
                  Request Analysis
                </Button>
              </div>
            </div>
            <Button 
              onClick={handleShowInterest} 
              variant="outline" 
              className="flex-1"
              disabled={isSubmittingInterest}
            >
              {isSubmittingInterest ? "Submitting..." : "I'm Interested"}
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
