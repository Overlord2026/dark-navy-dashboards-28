import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { IntegrationTestSuite } from '@/components/testing/IntegrationTestSuite';
import { ConsultantCoachInsuranceQATest } from '@/components/qa/ConsultantCoachInsuranceQATest';
import { ComprehensiveQATestSuite } from '@/components/qa/ComprehensiveQATestSuite';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function IntegrationTestPage() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary-dark to-surface">
        <div className="container mx-auto p-6">
          <Tabs defaultValue="integration" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="integration">Production Readiness Tests</TabsTrigger>
              <TabsTrigger value="persona-qa">Consultant/Coach/Insurance QA</TabsTrigger>
              <TabsTrigger value="comprehensive">Comprehensive QA Suite</TabsTrigger>
            </TabsList>
            
            <TabsContent value="integration">
              <IntegrationTestSuite />
            </TabsContent>
            
            <TabsContent value="persona-qa">
              <ConsultantCoachInsuranceQATest />
            </TabsContent>
            
            <TabsContent value="comprehensive">
              <ComprehensiveQATestSuite />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}