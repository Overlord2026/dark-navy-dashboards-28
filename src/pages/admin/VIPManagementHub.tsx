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
import { Crown, Upload, Users, Trophy, BookOpen } from 'lucide-react';

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
        <TabsList className="grid w-full grid-cols-8">
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
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Analytics
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

        <TabsContent value="onboarding">
          <VIPOnboardingEngine />
        </TabsContent>

        <TabsContent value="training">
          <VIPTrainingManuals />
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