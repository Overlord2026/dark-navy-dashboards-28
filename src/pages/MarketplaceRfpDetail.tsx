
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, DollarSign } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { RfpDetailView } from "@/components/marketplace/RfpDetailView";
import { PaymentProvider } from "@/context/PaymentContext";
import { PaymentDashboard } from "@/components/marketplace/PaymentDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MarketplaceRfpDetail() {
  const { id } = useParams();
  const [showPayments, setShowPayments] = useState(false);
  
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
                  variant={showPayments ? "default" : "outline"}
                  size="sm"
                  className="gap-1"
                  onClick={() => setShowPayments(true)}
                >
                  <DollarSign className="h-4 w-4" />
                  View Payments
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
          
          {showPayments ? (
            <div className="space-y-6">
              <Tabs defaultValue="project-payments">
                <TabsList className="mb-4">
                  <TabsTrigger value="project-payments">Project Payments</TabsTrigger>
                  <TabsTrigger value="rfp-details" onClick={() => setShowPayments(false)}>RFP Details</TabsTrigger>
                </TabsList>
                
                <TabsContent value="project-payments">
                  <PaymentDashboard projectId={`proj_${id}`} />
                </TabsContent>
                
                <TabsContent value="rfp-details">
                  <RfpDetailView rfpId={id} />
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <RfpDetailView rfpId={id} />
          )}
        </div>
      </ThreeColumnLayout>
    </PaymentProvider>
  );
}
