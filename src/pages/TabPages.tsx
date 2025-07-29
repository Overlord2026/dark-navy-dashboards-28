
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import HomeTab from "@/components/navigation/tabs/HomeTab";
import AccountsTab from "@/components/navigation/tabs/AccountsTab";
import EducationTab from "@/components/navigation/tabs/EducationTab";
import CollaborationTab from "@/components/navigation/tabs/CollaborationTab";
import SettingsTab from "@/components/navigation/tabs/SettingsTab";
import FamilyWealthTab from "@/components/navigation/tabs/FamilyWealthTab";
import { Card, CardContent } from "@/components/ui/card";
import { IntegrationsPanel } from "@/components/integrations/IntegrationsPanel";

// This file implements the tab page components referenced in routes-addition.tsx

export const HomePage = () => {
  return (
    <ThreeColumnLayout title="Home" activeMainItem="home">
      <div className="container p-6">
        <h1 className="text-2xl font-bold mb-6">Home Dashboard</h1>
        <HomeTab />
      </div>
    </ThreeColumnLayout>
  );
};

export const AccountsPage = () => {
  return (
    <ThreeColumnLayout title="Accounts" activeMainItem="accounts">
      <div className="container p-6">
        <h1 className="text-2xl font-bold mb-6">Accounts Overview</h1>
        <Card>
          <CardContent className="p-6">
            <AccountsTab />
          </CardContent>
        </Card>
      </div>
    </ThreeColumnLayout>
  );
};

export const EducationPage = () => {
  return (
    <ThreeColumnLayout title="Education & Solutions" activeMainItem="education-solutions">
      <div className="container p-6">
        <h1 className="text-2xl font-bold mb-6">Education Center</h1>
        <Card>
          <CardContent className="p-6">
            <EducationTab />
          </CardContent>
        </Card>
      </div>
    </ThreeColumnLayout>
  );
};

export const FamilyWealthPage = () => {
  return (
    <ThreeColumnLayout title="Family Wealth" activeMainItem="family-wealth">
      <div className="container p-6">
        <h1 className="text-2xl font-bold mb-6">Family Wealth Management</h1>
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <FamilyWealthTab />
            </CardContent>
          </Card>
          <IntegrationsPanel 
            title="Wealth Management Integrations"
            description="Connect with custodians and portfolio management platforms"
          />
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export const CollaborationPage = () => {
  return (
    <ThreeColumnLayout title="Collaboration" activeMainItem="collaboration">
      <div className="container p-6">
        <h1 className="text-2xl font-bold mb-6">Collaboration Tools</h1>
        <Card>
          <CardContent className="p-6">
            <CollaborationTab />
          </CardContent>
        </Card>
      </div>
    </ThreeColumnLayout>
  );
};

export const SettingsPage = () => {
  return (
    <ThreeColumnLayout title="Settings" activeMainItem="settings">
      <div className="container p-6">
        <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <SettingsTab />
            </CardContent>
          </Card>
          <IntegrationsPanel 
            title="Professional Service Integrations"
            description="Connect with your CPA, attorney, and other professional service providers"
          />
        </div>
      </div>
    </ThreeColumnLayout>
  );
};
