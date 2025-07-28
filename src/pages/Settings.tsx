
import React, { useState, useMemo, useCallback } from "react";
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
import { SettingsErrorBoundary } from "@/components/settings/SettingsErrorBoundary";
import { SettingsPerformanceMonitor } from "@/components/debug/SettingsPerformanceMonitor";
import { useSettings } from "@/hooks/useSettings";
import { MobileResponsiveTable } from "@/components/ui/responsive-chart";
import {
  SettingsHeaderSkeleton,
  SettingsTabsSkeleton,
  ProfileSectionSkeleton,
  SecuritySectionSkeleton,
  BillingSectionSkeleton,
  NotificationsSectionSkeleton
} from "@/components/ui/skeletons/SettingsSkeletons";

const Settings = () => {
  const { userProfile } = useUser();
  const {
    settings,
    loading,
    saving,
    apiCallsCount,
    saveOperations,
    loadingStates
  } = useSettings();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [sectionsLoaded, setSectionsLoaded] = useState(0);
  
  // Memoized role checks
  const roleChecks = useMemo(() => ({
    isClient: userProfile?.role === 'client',
    isProfessional: ['advisor', 'accountant', 'attorney', 'consultant'].includes(userProfile?.role || ''),
    isAdmin: ['admin', 'tenant_admin', 'system_administrator'].includes(userProfile?.role || '')
  }), [userProfile?.role]);

  // Optimized tab change handler
  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
    setSectionsLoaded(prev => prev + 1);
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8 max-w-6xl">
        <SettingsHeaderSkeleton />
        <SettingsTabsSkeleton />
      </div>
    );
  }

  return (
    <SettingsErrorBoundary>
      <div className="container mx-auto py-8 max-w-6xl">
        {/* Performance Monitor - Dev Only */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6">
            <SettingsPerformanceMonitor
              activeTab={activeTab}
              sectionsLoaded={sectionsLoaded}
              saveOperations={saveOperations}
              apiCallsCount={apiCallsCount}
              loadingStates={loadingStates}
            />
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account, privacy, and preferences
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <MobileResponsiveTable>
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
              
              {(roleChecks.isProfessional || roleChecks.isAdmin) && (
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
          </MobileResponsiveTable>
          
          <TabsContent value="profile">
            <SettingsErrorBoundary section="Profile">
              <ProfileIdentitySection />
            </SettingsErrorBoundary>
          </TabsContent>
          
          <TabsContent value="security">
            <SettingsErrorBoundary section="Security">
              <SecurityLoginSection />
            </SettingsErrorBoundary>
          </TabsContent>
          
          <TabsContent value="family">
            <SettingsErrorBoundary section="Family">
              <FamilyRelationshipsSection />
            </SettingsErrorBoundary>
          </TabsContent>
          
          <TabsContent value="professionals">
            <SettingsErrorBoundary section="Professionals">
              <ProfessionalsPermissionsSection />
            </SettingsErrorBoundary>
          </TabsContent>
          
          <TabsContent value="notifications">
            <SettingsErrorBoundary section="Notifications">
              <NotificationsAlertsSection />
            </SettingsErrorBoundary>
          </TabsContent>
          
          {(roleChecks.isProfessional || roleChecks.isAdmin) && (
            <TabsContent value="billing">
              <SettingsErrorBoundary section="Billing">
                <BillingSubscriptionsSection />
              </SettingsErrorBoundary>
            </TabsContent>
          )}
          
          <TabsContent value="integrations">
            <SettingsErrorBoundary section="Integrations">
              <IntegrationsAccountsSection />
            </SettingsErrorBoundary>
          </TabsContent>
          
          <TabsContent value="privacy">
            <SettingsErrorBoundary section="Privacy">
              <DataPrivacySection />
            </SettingsErrorBoundary>
          </TabsContent>
          
          <TabsContent value="support">
            <SettingsErrorBoundary section="Support">
              <SupportHelpSection />
            </SettingsErrorBoundary>
          </TabsContent>
          
          <TabsContent value="danger">
            <SettingsErrorBoundary section="Danger Zone">
              <DangerZoneSection />
            </SettingsErrorBoundary>
          </TabsContent>
        </Tabs>
      </div>
    </SettingsErrorBoundary>
  );
};

export default Settings;
