import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyOverview } from "./PropertyOverview";
import { PropertyManualEntry } from "./PropertyManualEntry";
import { PropertyAnalytics } from "./PropertyAnalytics";
import { PropertyDocuments } from "./PropertyDocuments";
import { PropertyMarketplace } from "./PropertyMarketplace";
import { PropertyReminders } from "./PropertyReminders";
import { PropertyCollaboration } from "./PropertyCollaboration";
import { PropertyListingForm } from "./PropertyListingForm";
import { PropertyEducationCenter } from "./PropertyEducationCenter";
import { PropertyPersonaSwitcher } from "./PropertyPersonaSwitcher";
import { FloatingListButton } from "./FloatingListButton";
import { PropertyHero } from "./PropertyHero";
import { RealtorPracticeDashboard } from "./RealtorPracticeDashboard";
import { PropertyManagerDashboard } from "./PropertyManagerDashboard";
import { useSubscriptionAccess } from "@/hooks/useSubscriptionAccess";

interface PropertyDashboardProps {
  initialFilter?: string | null;
}

export const PropertyDashboard: React.FC<PropertyDashboardProps> = ({ initialFilter }) => {
  const { checkFeatureAccess } = useSubscriptionAccess();
  const [activeTab, setActiveTab] = useState("overview");
  const [showListingForm, setShowListingForm] = useState(false);
  const [currentPersona, setCurrentPersona] = useState<'family' | 'realtor' | 'property_manager' | 'investor'>('family');
  
  const hasPremiumAccess = checkFeatureAccess('premium');

  const handleListProperty = () => {
    setShowListingForm(true);
  };

  const handleAddProperty = () => {
    setActiveTab("properties");
  };

  // Show specialized dashboards for realtor and property manager personas
  if (currentPersona === 'realtor') {
    return (
      <div className="container mx-auto p-6">
        <RealtorPracticeDashboard />
      </div>
    );
  }

  if (currentPersona === 'property_manager') {
    return (
      <div className="container mx-auto p-6">
        <PropertyManagerDashboard />
      </div>
    );
  }
  
  if (showListingForm) {
    return (
      <div className="container mx-auto p-6">
        <PropertyListingForm onClose={() => setShowListingForm(false)} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Enhanced Hero Section */}
      <PropertyHero 
        totalProperties={3}
        totalValue={2450000}
        monthlyIncome={8500}
        onAddProperty={handleAddProperty}
        onListProperty={handleListProperty}
      />

      {/* Persona Switcher for Marketplace */}
      {activeTab === "marketplace" && (
        <div className="flex justify-center">
          <PropertyPersonaSwitcher 
            currentPersona={currentPersona}
            onPersonaChange={setCurrentPersona}
          />
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-9 gap-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="properties">My Properties</TabsTrigger>
          <TabsTrigger value="marketplace" disabled={!hasPremiumAccess}>
            Marketplace {!hasPremiumAccess && "🔒"}
          </TabsTrigger>
          <TabsTrigger value="analytics" disabled={!hasPremiumAccess}>
            Analytics {!hasPremiumAccess && "🔒"}
          </TabsTrigger>
          <TabsTrigger value="reminders">Reminders</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
          <TabsTrigger value="pros">Pro Directory</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
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

        <TabsContent value="collaboration">
          <PropertyCollaboration />
        </TabsContent>

        <TabsContent value="pros">
          <PropertyMarketplace />
        </TabsContent>

        <TabsContent value="education">
          <PropertyEducationCenter />
        </TabsContent>
      </Tabs>

      {/* Mobile Floating Action Button */}
      <FloatingListButton onClick={handleListProperty} />
    </div>
  );
};