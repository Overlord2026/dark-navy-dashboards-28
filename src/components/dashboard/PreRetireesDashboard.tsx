
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card } from "@/components/ui/card";
import { useProfile } from "@/hooks/useProfile";

interface PreRetireesDashboardProps {
  segment?: string;
}

export function PreRetireesDashboard({ segment }: PreRetireesDashboardProps) {
  const { profile, loading } = useProfile();

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Animated Header Banner */}
      <div className="mb-8 p-6 bg-[#1a202c] rounded-lg shadow-md">
        <div className="flexLet me create an integration page to build on the provided project integration components.

<lov-code>
I'll create a new Integration page that will use the existing scaffolding for the Project Integration section:

<lov-write file_path="src/pages/Integration.tsx">
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConnectedProjectsTab } from "@/components/integration/ConnectedProjectsTab";
import { ArchitectureTab } from "@/components/integration/ArchitectureTab";
import { ApiIntegrationsTab } from "@/components/integration/ApiIntegrationsTab";
import { PluginsTab } from "@/components/integration/PluginsTab";
import { motion } from "framer-motion";
import { SupabaseRequiredNotice } from "@/components/integration/SupabaseRequiredNotice";
import { useProfile } from "@/hooks/useProfile";

export default function Integration() {
  const [activeTab, setActiveTab] = useState("connected-projects");
  const { profile, loading } = useProfile();
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <ThreeColumnLayout 
      title="Integration"
      activeMainItem="integration"
    >
      <motion.div 
        className="space-y-6 px-1"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">
              Family Office Marketplace Integration
            </h1>
            <p className="text-muted-foreground">
              Connect your instance with the Family Office Marketplace ecosystem to unlock additional capabilities,
              share data securely with approved providers, and access specialized services.
            </p>
          </div>
          
          <SupabaseRequiredNotice />

          <div className="mt-6">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid grid-cols-4 w-full mb-6">
                <TabsTrigger value="connected-projects">Connected Projects</TabsTrigger>
                <TabsTrigger value="architecture">Architecture</TabsTrigger>
                <TabsTrigger value="api-integrations">API Integrations</TabsTrigger>
                <TabsTrigger value="plugins">Plugins</TabsTrigger>
              </TabsList>
              
              <TabsContent value="connected-projects">
                <ConnectedProjectsTab />
              </TabsContent>
              
              <TabsContent value="architecture">
                <ArchitectureTab />
              </TabsContent>
              
              <TabsContent value="api-integrations">
                <ApiIntegrationsTab />
              </TabsContent>
              
              <TabsContent value="plugins">
                <PluginsTab />
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </motion.div>
    </ThreeColumnLayout>
  );
}
