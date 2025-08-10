import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MainLayout } from '@/components/layout/MainLayout';
import { AICFODashboard } from '@/components/executive/AICFODashboard';
import { AICMODashboard } from '@/components/executive/AICMODashboard';
import { AICOODashboard } from '@/components/executive/AICOODashboard';
import { AICTODashboard } from '@/components/executive/AICTODashboard';

export default function ExecutiveSuite() {
  const [activeTab, setActiveTab] = useState("ai-cfo");

  return (
    <MainLayout>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            AI Executive Suite
          </h1>
          <p className="text-lg text-muted-foreground">
            Boutique Family Office™ — AI-powered executive intelligence and automation
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-muted/50 border border-border/30 rounded-xl p-1">
            <TabsTrigger 
              value="ai-cfo" 
              className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-lg"
            >
              AI CFO
            </TabsTrigger>
            <TabsTrigger 
              value="ai-cmo"
              className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-lg"
            >
              AI CMO
            </TabsTrigger>
            <TabsTrigger 
              value="ai-coo"
              className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-lg"
            >
              AI COO
            </TabsTrigger>
            <TabsTrigger 
              value="ai-cto"
              className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-lg"
            >
              AI CTO
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ai-cfo" className="space-y-6">
            <AICFODashboard />
          </TabsContent>

          <TabsContent value="ai-cmo" className="space-y-6">
            <AICMODashboard />
          </TabsContent>

          <TabsContent value="ai-coo" className="space-y-6">
            <AICOODashboard />
          </TabsContent>

          <TabsContent value="ai-cto" className="space-y-6">
            <AICTODashboard />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}