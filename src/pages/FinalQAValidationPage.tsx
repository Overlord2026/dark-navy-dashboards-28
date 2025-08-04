import React from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { DashboardHeader } from '@/components/ui/DashboardHeader';
import { ComprehensivePersonaQARunner } from '@/components/qa/ComprehensivePersonaQARunner';
import { ProductionReadinessChecker } from '@/components/production/ProductionReadinessChecker';
import { ComplianceGoLiveChecklist } from '@/components/compliance/ComplianceGoLiveChecklist';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function FinalQAValidationPage() {
  return (
    <ThreeColumnLayout title="Final Production Validation">
      <div className="space-y-6">
        <DashboardHeader 
          heading="🚀 Final Production Readiness Validation"
          text="Comprehensive production readiness check including security, performance, QA testing, and deployment validation."
        />
        
        <Tabs defaultValue="compliance-golive" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="compliance-golive">Compliance Go-Live</TabsTrigger>
            <TabsTrigger value="production">Production Readiness</TabsTrigger>
            <TabsTrigger value="persona-qa">Persona QA Testing</TabsTrigger>
          </TabsList>

          <TabsContent value="compliance-golive" className="space-y-6">
            <ComplianceGoLiveChecklist />
          </TabsContent>

          <TabsContent value="production" className="space-y-6">
            <ProductionReadinessChecker />
          </TabsContent>

          <TabsContent value="persona-qa" className="space-y-6">
            <ComprehensivePersonaQARunner />
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
}