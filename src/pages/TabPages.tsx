
import React from "react";
import { 
  HomeTab, 
  AccountsTab, 
  EducationTab, 
  FamilyWealthTab, 
  CollaborationTab, 
  SettingsTab 
} from "@/components/navigation/NavigationRegistry";
import { DashboardHeader } from "@/components/ui/DashboardHeader";

export const HomePage = () => (
  <div className="container mx-auto py-6">
    <DashboardHeader heading="Home" text="Welcome to your dashboard" />
    <HomeTab />
  </div>
);

export const AccountsPage = () => (
  <div className="container mx-auto py-6">
    <DashboardHeader heading="Accounts" text="Manage your financial accounts" />
    <AccountsTab />
  </div>
);

export const EducationPage = () => (
  <div className="container mx-auto py-6">
    <DashboardHeader heading="Education & Solutions" text="Learn about financial topics" />
    <EducationTab />
  </div>
);

export const FamilyWealthPage = () => (
  <div className="container mx-auto py-6">
    <DashboardHeader heading="Family Wealth" text="Manage your family's wealth" />
    <FamilyWealthTab />
  </div>
);

export const CollaborationPage = () => (
  <div className="container mx-auto py-6">
    <DashboardHeader heading="Collaboration & Sharing" text="Share and collaborate with others" />
    <CollaborationTab />
  </div>
);

export const SettingsPage = () => (
  <div className="container mx-auto py-6">
    <DashboardHeader heading="Settings" text="Manage your account settings" />
    <SettingsTab />
  </div>
);
