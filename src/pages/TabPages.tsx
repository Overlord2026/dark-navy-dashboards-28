
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import HomeTab from "@/components/navigation/tabs/HomeTab";
import AccountsTab from "@/components/navigation/tabs/AccountsTab";
import EducationTab from "@/components/navigation/tabs/EducationTab";
import CollaborationTab from "@/components/navigation/tabs/CollaborationTab";
import SettingsTab from "@/components/navigation/tabs/SettingsTab";
import { Card, CardContent } from "@/components/ui/card";

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
    <ThreeColumnLayout title="Education & Solutions" activeMainItem="education">
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
        <Card>
          <CardContent className="p-6">
            <p>Family wealth planning and management tools will be displayed here.</p>
          </CardContent>
        </Card>
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
        <Card>
          <CardContent className="p-6">
            <SettingsTab />
          </CardContent>
        </Card>
      </div>
    </ThreeColumnLayout>
  );
};

// Add a missing FamilyWealthTab.tsx file since it's referenced in NavigationRegistry.ts
<lov-write file_path="src/components/navigation/tabs/FamilyWealthTab.tsx">
import React from "react";
import { HomeIcon, PiggyBankIcon, ArrowRightLeft, Building, Receipt } from "lucide-react";
import { NavItem } from "@/types/navigation";

export const familyWealthNavItems: NavItem[] = [
  { 
    title: "Financial Plans", 
    href: "/financial-plans", 
    icon: HomeIcon 
  },
  { 
    title: "Cash Management", 
    href: "/banking/cash-management", 
    icon: PiggyBankIcon
  },
  { 
    title: "Transfers", 
    href: "/transfers", 
    icon: ArrowRightLeft 
  },
  { 
    title: "Properties", 
    href: "/properties", 
    icon: Building 
  },
  { 
    title: "Bill Pay", 
    href: "/billpay", 
    icon: Receipt 
  }
];

const FamilyWealthTab = () => {
  return (
    <div className="family-wealth-tab">
      {/* Additional family wealth tab specific UI can be added here */}
    </div>
  );
};

export default FamilyWealthTab;
