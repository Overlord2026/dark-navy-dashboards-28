import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyOverview } from "./PropertyOverview";
import { PropertyManualEntry } from "./PropertyManualEntry";
import { PropertyAnalytics } from "./PropertyAnalytics";
import { PropertyDocuments } from "./PropertyDocuments";
import { PropertyMarketplace } from "./PropertyMarketplace";
import { PropertyReminders } from "./PropertyReminders";
import { useSubscriptionAccess } from "@/hooks/useSubscriptionAccess";

interface PropertyDashboardProps {
  initialFilter?: string | null;
}

export const PropertyDashboard: React.FC<PropertyDashboardProps> = ({ initialFilter }) => {
  const { checkFeatureAccess } = useSubscriptionAccess();
  const [activeTab, setActiveTab] = useState("overview");
  
  const hasPremiumAccess = checkFeatureAccess('premium_property_features');
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Property Management</h1>
          <p className="text-muted-foreground">Organize and optimize your real estate portfolio</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="reminders">Reminders</TabsTrigger>
          <TabsTrigger value="analytics" disabled={!hasPremiumAccess}>
            Analytics {!hasPremiumAccess && "🔒"}
          </TabsTrigger>
          <TabsTrigger value="marketplace" disabled={!hasPremiumAccess}>
            Marketplace {!hasPremiumAccess && "🔒"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <PropertyOverview initialFilter={initialFilter} />
        </TabsContent>

        <TabsContent value="properties">
          <PropertyManualEntry />
        </TabsContent>

        <TabsContent value="documents">
          <PropertyDocuments />
        </TabsContent>

        <TabsContent value="reminders">
          <PropertyReminders />
        </TabsContent>

        <TabsContent value="analytics">
          <PropertyAnalytics />
        </TabsContent>

        <TabsContent value="marketplace">
          <PropertyMarketplace />
        </TabsContent>
      </Tabs>
    </div>
  );
};