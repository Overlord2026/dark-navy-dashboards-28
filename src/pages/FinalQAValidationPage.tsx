import React from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { DashboardHeader } from '@/components/ui/DashboardHeader';
import { ComprehensivePersonaQARunner } from '@/components/qa/ComprehensivePersonaQARunner';
import { ProductionReadinessChecker } from '@/components/production/ProductionReadinessChecker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function FinalQAValidationPage() {
  return (
    <ThreeColumnLayout title="Final Production Validation">
      <div className="space-y-6">
        <DashboardHeader 
          heading="🚀 Final Production Readiness Validation"
          text="Comprehensive production readiness check including security, performance, QA testing, and deployment validation."
        />
        
        <Tabs defaultValue="production" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="production">Production Readiness</TabsTrigger>
            <TabsTrigger value="persona-qa">Persona QA Testing</TabsTrigger>
          </TabsList>

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