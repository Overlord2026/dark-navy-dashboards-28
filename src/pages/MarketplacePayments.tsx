
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { PaymentDashboard } from "@/components/marketplace/PaymentDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentProvider } from "@/context/PaymentContext";
import { AdminPaymentDashboard } from "@/components/marketplace/AdminPaymentDashboard";
import { usePayment } from "@/context/PaymentContext";

export default function MarketplacePayments() {
  const userRole = "client"; // In a real app, this would come from auth context
  const isAdmin = false; // In a real app, this would come from auth context
  
  return (
    <PaymentProvider>
      <ThreeColumnLayout title="Payment Management - Family Office Marketplace">
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
            
            <h1 className="text-3xl font-bold tracking-tight">Payment Management</h1>
            <p className="text-muted-foreground">
              Securely manage milestone-based payments and track project financial progress
            </p>
          </div>
          
          <Tabs defaultValue={isAdmin ? "admin" : "dashboard"}>
            <TabsList className="mb-6">
              <TabsTrigger value="dashboard">Payment Dashboard</TabsTrigger>
              {isAdmin && (
                <TabsTrigger value="admin">Admin Controls</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="dashboard">
              <PaymentDashboard isProvider={userRole === "provider"} />
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
