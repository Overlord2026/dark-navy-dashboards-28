
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { PaymentDashboard } from "@/components/marketplace/PaymentDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentProvider } from "@/context/PaymentContext";
import { AdminPaymentDashboard } from "@/components/marketplace/AdminPaymentDashboard";
import { useUser } from "@/context/UserContext";
import { PerformanceDashboard } from "@/components/marketplace/PerformanceDashboard";

export default function MarketplacePayments() {
  const { userProfile } = useUser();
  // Check if the user is a service provider rather than a client
  const isProvider = userProfile.role === "advisor" || userProfile.role === "consultant"; 
  const isAdmin = userProfile.role === "admin" || userProfile.role === "system_administrator";
  
  return (
    <PaymentProvider>
      <ThreeColumnLayout title="Payment & Project Management - Family Office Marketplace">
        <div className="space-y-6 px-4 py-6 max-w-7xl mx-auto">
          <div className="flex flex-col gap-2">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" asChild className="gap-1">
                <Link to="/marketplace">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Marketplace
                </Link>
              </Button>
            </div>
            
            <h1 className="text-3xl font-bold tracking-tight">Project & Payment Management</h1>
            <p className="text-muted-foreground">
              Track project progress, manage milestones, and securely handle payments
            </p>
          </div>
          
          <Tabs defaultValue="performance">
            <TabsList className="mb-6">
              <TabsTrigger value="performance">Performance Dashboard</TabsTrigger>
              <TabsTrigger value="payments">Payment Details</TabsTrigger>
              {isAdmin && (
                <TabsTrigger value="admin">Admin Controls</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="performance">
              <PerformanceDashboard isProvider={isProvider} />
            </TabsContent>
            
            <TabsContent value="payments">
              <PaymentDashboard isProvider={isProvider} />
            </TabsContent>
            
            {isAdmin && (
              <TabsContent value="admin">
                <AdminPaymentDashboard />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </ThreeColumnLayout>
    </PaymentProvider>
  );
}
