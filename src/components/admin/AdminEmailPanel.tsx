import React from 'react';
import { EmailSequenceManager } from '@/components/automation/EmailSequenceManager';
import { PersonaFAQ } from '@/components/help/PersonaFAQ';
import { DemoVideoAutomation } from '@/components/automation/DemoVideoAutomation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const AdminEmailPanel = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Email & Engagement Automation</h1>
      
      <Tabs defaultValue="sequences" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sequences">Email Sequences</TabsTrigger>
          <TabsTrigger value="demos">Demo Automation</TabsTrigger>
          <TabsTrigger value="faq">FAQ Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sequences" className="space-y-4">
          <EmailSequenceManager />
        </TabsContent>
        
        <TabsContent value="demos" className="space-y-4">
          <DemoVideoAutomation userPersona="advisor" />
        </TabsContent>
        
        <TabsContent value="faq" className="space-y-4">
          <PersonaFAQ userPersona="advisor" isVIP={true} />
        </TabsContent>
      </Tabs>
    </div>
  );
};