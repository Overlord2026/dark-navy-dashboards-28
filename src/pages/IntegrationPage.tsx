
import React, { useState, useEffect } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConnectedProjectsTab } from "@/components/integration/ConnectedProjectsTab";
import { ArchitectureTab } from "@/components/integration/ArchitectureTab";
import { ApiIntegrationsTab } from "@/components/integration/ApiIntegrationsTab";
import { PluginsTab } from "@/components/integration/PluginsTab";
import { ConnectedBadge } from "@/components/integration/ConnectedBadge";
import { testApiIntegrations } from "@/services/diagnostics/apiIntegrationTests";
import { ApiIntegrationTestResult } from "@/services/diagnostics/types";
import { apiSecurity } from "@/services/api/security/apiSecurityService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiSecurityDemo } from "@/components/integration/ApiSecurityDemo";
import { Button } from "@/components/ui/button";
import { Shield, AlertCircle } from "lucide-react";

export default function IntegrationPage() {
  const [activeTab, setActiveTab] = useState("connected");
  const [apiTests, setApiTests] = useState<ApiIntegrationTestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [circuitStatus, setCircuitStatus] = useState<Record<string, any>>({});
  
  useEffect(() => {
    // Run API tests when component mounts
    const runTests = async () => {
      setLoading(true);
      try {
        const results = testApiIntegrations();
        setApiTests(results);
      } catch (error) {
        console.error("Error running API tests:", error);
      } finally {
        setLoading(false);
      }
    };
    
    runTests();
    
    // Update circuit status every 5 seconds
    const intervalId = setInterval(() => {
      setCircuitStatus(apiSecurity.getCircuitStatus());
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Count API issues
  const apiIssues = apiTests.filter(test => test.status === "error" || test.status === "warning").length;
  
  return (
    <ThreeColumnLayout activeMainItem="integration">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold">Project Integration</h1>
            <ConnectedBadge />
          </div>
          
          {apiIssues > 0 && (
            <div className="flex items-center mt-2 md:mt-0 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
              <AlertCircle className="h-4 w-4 mr-1" />
              {apiIssues} API {apiIssues === 1 ? 'issue' : 'issues'} detected
            </div>
          )}
        </div>
        
        <Card className="border-green-100 bg-green-50">
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <CardTitle className="text-green-700">Enhanced API Security Enabled</CardTitle>
            </div>
            <CardDescription className="text-green-600">
              This project is using enhanced API security features including circuit breakers, PII protection,
              and resilient API clients.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end">
              <Button variant="outline" size="sm" className="text-green-700 border-green-300 hover:bg-green-100">
                View Security Settings
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="connected" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="connected">Connected Projects</TabsTrigger>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="apis">API Integrations</TabsTrigger>
            <TabsTrigger value="plugins">Plugins</TabsTrigger>
          </TabsList>
          
          <TabsContent value="connected" className="space-y-4">
            <ConnectedProjectsTab />
          </TabsContent>
          
          <TabsContent value="architecture" className="space-y-4">
            <ArchitectureTab />
          </TabsContent>
          
          <TabsContent value="apis" className="space-y-4">
            <ApiIntegrationsTab />
            <ApiSecurityDemo 
              apiTests={apiTests} 
              loading={loading} 
              circuitStatus={circuitStatus} 
              onResetCircuit={(name) => {
                apiSecurity.resetCircuit(name);
                setCircuitStatus(apiSecurity.getCircuitStatus());
              }}
            />
          </TabsContent>
          
          <TabsContent value="plugins" className="space-y-4">
            <PluginsTab />
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
}
