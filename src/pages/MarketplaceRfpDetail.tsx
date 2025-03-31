
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, DollarSign, Clock, MessageSquare } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { RfpDetailView } from "@/components/marketplace/RfpDetailView";
import { PaymentProvider } from "@/context/PaymentContext";
import { PaymentDashboard } from "@/components/marketplace/PaymentDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectManagement } from "@/components/marketplace/ProjectManagement";

export default function MarketplaceRfpDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<string>("rfp-details");
  
  return (
    <PaymentProvider>
      <ThreeColumnLayout title="RFP Details - Family Office Marketplace">
        <div className="space-y-6 px-4 py-6 max-w-7xl mx-auto">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" asChild className="gap-1">
                <Link to="/marketplace/rfp">
                  <ArrowLeft className="h-4 w-4" />
                  Back to RFPs
                </Link>
              </Button>
              
              <div className="flex gap-2">
                <Button 
                  variant={activeTab === "payments" ? "default" : "outline"}
                  size="sm"
                  className="gap-1"
                  onClick={() => setActiveTab("payments")}
                >
                  <DollarSign className="h-4 w-4" />
                  Payments
                </Button>
                
                <Button
                  variant={activeTab === "project-management" ? "default" : "outline"}
                  size="sm"
                  className="gap-1"
                  onClick={() => setActiveTab("project-management")}
                >
                  <Clock className="h-4 w-4" />
                  Project Management
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="gap-1"
                >
                  <Link to="/marketplace/payments">
                    Payment Dashboard
                  </Link>
                </Button>
              </div>
            </div>
            
            <h1 className="text-3xl font-bold tracking-tight">Request for Proposal</h1>
            <p className="text-muted-foreground">
              Submit your proposal to this RFP to connect with potential clients and grow your business.
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="rfp-details">RFP Details</TabsTrigger>
              <TabsTrigger value="project-management">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Project Management
                </span>
              </TabsTrigger>
              <TabsTrigger value="payments">
                <span className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  Payments
                </span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="rfp-details">
              <RfpDetailView rfpId={id} />
            </TabsContent>
            
            <TabsContent value="project-management">
              <ProjectManagement projectId={`proj_${id}`} />
            </TabsContent>
            
            <TabsContent value="payments">
              <PaymentDashboard projectId={`proj_${id}`} />
            </TabsContent>
          </Tabs>
        </div>
      </ThreeColumnLayout>
    </PaymentProvider>
  );
}
