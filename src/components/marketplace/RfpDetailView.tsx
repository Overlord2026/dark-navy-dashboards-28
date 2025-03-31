
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, DollarSign, User, Users, Briefcase, Shield } from "lucide-react";
import { ProposalSubmissionForm } from "./ProposalSubmissionForm";
import { Button } from "@/components/ui/button";

interface RfpDetailViewProps {
  rfpId?: string;
}

// Sample RFP data (would be fetched from API in a real application)
const sampleRfp = {
  id: "rfp123",
  title: "Comprehensive Tax Planning for Multi-State Assets",
  serviceType: "Tax Planning",
  category: "tax-planning",
  description: "Our family has substantial assets across multiple states including real estate investments, business interests, and trust accounts. We need comprehensive tax planning to optimize our tax strategy while ensuring compliance with various state regulations.",
  expertise: "Expert",
  timeline: "3-6 months",
  budgetRange: "$10,000 - $25,000",
  budgetType: "Fixed",
  visibility: "Invitation-only",
  postedDate: "2023-07-15",
  expiryDate: "2023-08-15",
  status: "Open",
  additionalDetails: "We prefer professionals with experience in both corporate and estate tax planning. Knowledge of international tax implications would be beneficial."
};

export function RfpDetailView({ rfpId }: RfpDetailViewProps) {
  const [activeTab, setActiveTab] = useState("details");
  const [showProposalForm, setShowProposalForm] = useState(false);
  
  // In a real application, we would fetch the RFP data based on the ID
  const rfp = sampleRfp;
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{rfp.title}</CardTitle>
              <CardDescription className="mt-2">
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5" />
                    {rfp.serviceType}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5" />
                    {rfp.expertise} Level
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {rfp.timeline}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <DollarSign className="h-3.5 w-3.5" />
                    {rfp.budgetRange}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Shield className="h-3.5 w-3.5" />
                    {rfp.visibility}
                  </Badge>
                </div>
              </CardDescription>
            </div>
            
            <div className="flex items-center mt-1">
              <Badge className={`${rfp.status === "Open" ? "bg-green-500" : "bg-yellow-500"}`}>
                {rfp.status}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="details">RFP Details</TabsTrigger>
              <TabsTrigger value="submit">Submit Proposal</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Project Description</h3>
                <p className="text-muted-foreground">{rfp.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Timeline</h3>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Posted: {rfp.postedDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                    <Calendar className="h-4 w-4" />
                    <span>Response Deadline: {rfp.expiryDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                    <Clock className="h-4 w-4" />
                    <span>Expected Timeline: {rfp.timeline}</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Budget Information</h3>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span>Budget Range: {rfp.budgetRange}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                    <DollarSign className="h-4 w-4" />
                    <span>Budget Type: {rfp.budgetType}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Additional Requirements</h3>
                <p className="text-muted-foreground">{rfp.additionalDetails}</p>
              </div>
              
              <Button 
                className="w-full md:w-auto mt-4" 
                onClick={() => {
                  setActiveTab("submit");
                  setShowProposalForm(true);
                }}
              >
                Submit a Proposal
              </Button>
            </TabsContent>
            
            <TabsContent value="submit" className="space-y-4">
              {showProposalForm ? (
                <ProposalSubmissionForm rfpId={rfp.id} />
              ) : (
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium mb-2">Ready to submit your proposal?</h3>
                  <p className="text-muted-foreground mb-4">
                    Provide details about your services, pricing, timeline, and more to stand out to potential clients.
                  </p>
                  <Button onClick={() => setShowProposalForm(true)}>
                    Start Proposal
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
