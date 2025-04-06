
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ErrorSimulator } from "@/components/diagnostics/ErrorSimulator";
import { NetworkFailureSimulator } from "@/components/diagnostics/NetworkFailureSimulator";
import { LogViewer } from "@/components/diagnostics/LogViewer";

export default function ErrorSimulation() {
  return (
    <ThreeColumnLayout 
      activeMainItem="diagnostics" 
      title="Error Simulation"
    >
      <div className="space-y-6 p-4 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold">Error Simulation</h1>
          <p className="text-muted-foreground mt-1">
            Test application behavior with simulated errors and network failures
          </p>
        </div>

        <Tabs defaultValue="error-simulator" className="space-y-4">
          <TabsList>
            <TabsTrigger value="error-simulator">Error Simulator</TabsTrigger>
            <TabsTrigger value="network-simulator">Network Failures</TabsTrigger>
            <TabsTrigger value="logs">System Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="error-simulator">
            <ErrorSimulator />
          </TabsContent>
          
          <TabsContent value="network-simulator">
            <NetworkFailureSimulator />
          </TabsContent>
          
          <TabsContent value="logs">
            <LogViewer />
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
}
