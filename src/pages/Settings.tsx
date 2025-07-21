
import React from "react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  User, 
  Shield, 
  Users, 
  UserCheck, 
  Bell, 
  CreditCard, 
  Link as LinkIcon,
  Database,
  HelpCircle,
  AlertTriangle
} from "lucide-react";
import { useUser } from "@/context/UserContext";
import { ProfileIdentitySection } from "@/components/settings/ProfileIdentitySection";
import { SecurityLoginSection } from "@/components/settings/SecurityLoginSection";
import { FamilyRelationshipsSection } from "@/components/settings/FamilyRelationshipsSection";
import { ProfessionalsPermissionsSection } from "@/components/settings/ProfessionalsPermissionsSection";
import { NotificationsAlertsSection } from "@/components/settings/NotificationsAlertsSection";
import { BillingSubscriptionsSection } from "@/components/settings/BillingSubscriptionsSection";
import { IntegrationsAccountsSection } from "@/components/settings/IntegrationsAccountsSection";
import { DataPrivacySection } from "@/components/settings/DataPrivacySection";
import { SupportHelpSection } from "@/components/settings/SupportHelpSection";
import { DangerZoneSection } from "@/components/settings/DangerZoneSection";

const Settings = () => {
  const { userProfile } = useUser();
  
  // Determine which tabs to show based on user role
  const isClient = userProfile?.role === 'client';
  const isProfessional = ['advisor', 'accountant', 'attorney', 'consultant'].includes(userProfile?.role || '');
  const isAdmin = ['admin', 'tenant_admin', 'system_administrator'].includes(userProfile?.role || '');

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account, privacy, and preferences
        </p>
      </div>
      
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 lg:grid-cols-10 h-auto gap-2">
          <TabsTrigger value="profile" className="flex flex-col items-center gap-1 py-3 px-2">
            <User className="h-4 w-4" />
            <span className="text-xs">Profile</span>
          </TabsTrigger>
          
          <TabsTrigger value="security" className="flex flex-col items-center gap-1 py-3 px-2">
            <Shield className="h-4 w-4" />
            <span className="text-xs">Security</span>
          </TabsTrigger>
          
          <TabsTrigger value="family" className="flex flex-col items-center gap-1 py-3 px-2">
            <Users className="h-4 w-4" />
            <span className="text-xs">Family</span>
          </TabsTrigger>
          
          <TabsTrigger value="professionals" className="flex flex-col items-center gap-1 py-3 px-2">
            <UserCheck className="h-4 w-4" />
            <span className="text-xs">Team</span>
          </TabsTrigger>
          
          <TabsTrigger value="notifications" className="flex flex-col items-center gap-1 py-3 px-2">
            <Bell className="h-4 w-4" />
            <span className="text-xs">Alerts</span>
          </TabsTrigger>
          
          {(isProfessional || isAdmin) && (
            <TabsTrigger value="billing" className="flex flex-col items-center gap-1 py-3 px-2">
              <CreditCard className="h-4 w-4" />
              <span className="text-xs">Billing</span>
            </TabsTrigger>
          )}
          
          <TabsTrigger value="integrations" className="flex flex-col items-center gap-1 py-3 px-2">
            <LinkIcon className="h-4 w-4" />
            <span className="text-xs">Accounts</span>
          </TabsTrigger>
          
          <TabsTrigger value="privacy" className="flex flex-col items-center gap-1 py-3 px-2">
            <Database className="h-4 w-4" />
            <span className="text-xs">Privacy</span>
          </TabsTrigger>
          
          <TabsTrigger value="support" className="flex flex-col items-center gap-1 py-3 px-2">
            <HelpCircle className="h-4 w-4" />
            <span className="text-xs">Support</span>
          </TabsTrigger>
          
          <TabsTrigger value="danger" className="flex flex-col items-center gap-1 py-3 px-2 text-destructive">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-xs">Danger</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <ProfileIdentitySection />
        </TabsContent>
        
        <TabsContent value="security">
          <SecurityLoginSection />
        </TabsContent>
        
        <TabsContent value="family">
          <FamilyRelationshipsSection />
        </TabsContent>
        
        <TabsContent value="professionals">
          <ProfessionalsPermissionsSection />
        </TabsContent>
        
        <TabsContent value="notifications">
          <NotificationsAlertsSection />
        </TabsContent>
        
        {(isProfessional || isAdmin) && (
          <TabsContent value="billing">
            <BillingSubscriptionsSection />
          </TabsContent>
        )}
        
        <TabsContent value="integrations">
          <IntegrationsAccountsSection />
        </TabsContent>
        
        <TabsContent value="privacy">
          <DataPrivacySection />
        </TabsContent>
        
        <TabsContent value="support">
          <SupportHelpSection />
        </TabsContent>
        
        <TabsContent value="danger">
          <DangerZoneSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
