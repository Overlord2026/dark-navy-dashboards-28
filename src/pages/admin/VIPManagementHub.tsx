import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VIPOnboardingEngine } from '@/components/vip/VIPOnboardingEngine';
import { VIPBulkManager } from '@/components/admin/VIPBulkManager';
import { VIPFoundersWall } from '@/components/vip/VIPFoundersWall';
import { VIPTrainingManuals } from '@/components/admin/VIPTrainingManuals';
import { AdvisorOnboardingSlides } from '@/components/advisor/AdvisorOnboardingSlides';
import { AdvisorVIPLaunchKit } from '@/components/advisor/AdvisorVIPLaunchKit';
import { CPAOnboardingSlides } from '@/components/cpa/CPAOnboardingSlides';
import { AttorneyOnboardingSlides } from '@/components/attorney/AttorneyOnboardingSlides';
import { HealthcareOnboardingSlides } from '@/components/healthcare/HealthcareOnboardingSlides';
import { HealthcareVIPLaunchKit } from '@/components/healthcare/HealthcareVIPLaunchKit';
import { RealEstateOnboardingSlides } from '@/components/realestate/RealEstateOnboardingSlides';
import { RealEstateVIPLaunchKit } from '@/components/realestate/RealEstateVIPLaunchKit';
import { InsuranceOnboardingSlides } from '@/components/insurance/InsuranceOnboardingSlides';
import { InsuranceVIPLaunchKit } from '@/components/insurance/InsuranceVIPLaunchKit';
import { InsuranceAgentsOnboardingSlides } from '@/components/insurance/InsuranceAgentsOnboardingSlides';
import { InsuranceAgentsVIPLaunchKit } from '@/components/insurance/InsuranceAgentsVIPLaunchKit';

import { HealthcareInnovatorsOnboardingSlides } from '@/components/healthcare/HealthcareInnovatorsOnboardingSlides';
import { HealthcareInnovatorsVIPLaunchKit } from '@/components/healthcare/HealthcareInnovatorsVIPLaunchKit';
import { HealthcareExecutivesOnboardingSlides } from '@/components/healthcare/HealthcareExecutivesOnboardingSlides';
import { HealthcareExecutivesVIPLaunchKit } from '@/components/healthcare/HealthcareExecutivesVIPLaunchKit';
import { FamilyOfficeExecutivesOnboardingSlides } from '@/components/familyoffice/FamilyOfficeExecutivesOnboardingSlides';
import { AdminSystemChecklist } from '@/components/admin/AdminSystemChecklist';
import { Crown, Upload, Users, Trophy, BookOpen, Heart, Building, Shield, Microscope } from 'lucide-react';

export const VIPManagementHub: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <Crown className="h-8 w-8 text-gold" />
        <div>
          <h1 className="text-3xl font-bold">VIP Management Hub</h1>
          <p className="text-muted-foreground">
            Complete VIP onboarding, management, and training center
          </p>
        </div>
      </div>

      <Tabs defaultValue="bulk-manager" className="space-y-6">
        <TabsList className="grid w-full grid-cols-8 lg:grid-cols-16">
          <TabsTrigger value="bulk-manager" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Bulk Manager
          </TabsTrigger>
          <TabsTrigger value="advisor-launch" className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            Advisor Launch
          </TabsTrigger>
          <TabsTrigger value="advisor-slides" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Advisor Slides
          </TabsTrigger>
          <TabsTrigger value="cpa-slides" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            CPA Slides
          </TabsTrigger>
          <TabsTrigger value="attorney-slides" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Attorney Slides
          </TabsTrigger>
          <TabsTrigger value="healthcare-slides" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Healthcare Slides
          </TabsTrigger>
          <TabsTrigger value="healthcare-launch" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Healthcare Launch
          </TabsTrigger>
          <TabsTrigger value="realestate-slides" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Real Estate Slides
          </TabsTrigger>
          <TabsTrigger value="realestate-launch" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Real Estate Launch
          </TabsTrigger>
          <TabsTrigger value="insurance-slides" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Insurance Slides
          </TabsTrigger>
          <TabsTrigger value="insurance-launch" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Insurance Launch
          </TabsTrigger>
          <TabsTrigger value="agents-slides" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Agents Slides
          </TabsTrigger>
          <TabsTrigger value="agents-launch" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Agents Launch
          </TabsTrigger>
          <TabsTrigger value="innovators-slides" className="flex items-center gap-2">
            <Microscope className="h-4 w-4" />
            Healthcare Innovators
          </TabsTrigger>
          <TabsTrigger value="innovators-launch" className="flex items-center gap-2">
            <Microscope className="h-4 w-4" />
            Innovators Launch
          </TabsTrigger>
          <TabsTrigger value="executives-slides" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Executives Slides
          </TabsTrigger>
          <TabsTrigger value="executives-launch" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Executives Launch
          </TabsTrigger>
          <TabsTrigger value="familyoffice-slides" className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            Family Office Slides
          </TabsTrigger>
          <TabsTrigger value="onboarding" className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            VIP Engine
          </TabsTrigger>
          <TabsTrigger value="founders-wall" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Founders Wall
          </TabsTrigger>
          <TabsTrigger value="training" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Training Center
          </TabsTrigger>
          <TabsTrigger value="admin-checklist" className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            Admin Checklist
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bulk-manager">
          <VIPBulkManager />
        </TabsContent>

        <TabsContent value="advisor-launch">
          <AdvisorVIPLaunchKit />
        </TabsContent>

        <TabsContent value="advisor-slides">
          <AdvisorOnboardingSlides />
        </TabsContent>

        <TabsContent value="cpa-slides">
          <CPAOnboardingSlides />
        </TabsContent>

        <TabsContent value="attorney-slides">
          <AttorneyOnboardingSlides />
        </TabsContent>

        <TabsContent value="healthcare-slides">
          <HealthcareOnboardingSlides />
        </TabsContent>

        <TabsContent value="healthcare-launch">
          <HealthcareVIPLaunchKit />
        </TabsContent>

        <TabsContent value="realestate-slides">
          <RealEstateOnboardingSlides />
        </TabsContent>

        <TabsContent value="realestate-launch">
          <RealEstateVIPLaunchKit />
        </TabsContent>

        <TabsContent value="insurance-slides">
          <InsuranceOnboardingSlides />
        </TabsContent>

        <TabsContent value="insurance-launch">
          <InsuranceVIPLaunchKit />
        </TabsContent>

        <TabsContent value="agents-slides">
          <InsuranceAgentsOnboardingSlides />
        </TabsContent>

        <TabsContent value="agents-launch">
          <InsuranceAgentsVIPLaunchKit />
        </TabsContent>

        <TabsContent value="innovators-slides">
          <HealthcareInnovatorsOnboardingSlides />
        </TabsContent>

        <TabsContent value="innovators-launch">
          <HealthcareInnovatorsVIPLaunchKit />
        </TabsContent>

        <TabsContent value="executives-slides">
          <HealthcareExecutivesOnboardingSlides />
        </TabsContent>

        <TabsContent value="executives-launch">
          <HealthcareExecutivesVIPLaunchKit />
        </TabsContent>

        <TabsContent value="familyoffice-slides">
          <FamilyOfficeExecutivesOnboardingSlides />
        </TabsContent>

        <TabsContent value="onboarding">
          <VIPOnboardingEngine />
        </TabsContent>

        <TabsContent value="training">
          <VIPTrainingManuals />
        </TabsContent>

        <TabsContent value="founders-wall">
          <VIPFoundersWall />
        </TabsContent>

        <TabsContent value="admin-checklist">
          <AdminSystemChecklist />
        </TabsContent>

        <TabsContent value="analytics">
          <div className="text-center py-12">
            <Crown className="h-16 w-16 mx-auto text-gold mb-4" />
            <h2 className="text-2xl font-bold mb-2">VIP Analytics Dashboard</h2>
            <p className="text-muted-foreground">
              Advanced analytics and reporting for VIP performance coming soon...
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};