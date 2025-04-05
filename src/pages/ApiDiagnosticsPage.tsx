
import React, { useEffect } from "react";
import { DashboardHeader } from "@/components/ui/DashboardHeader";
import { ApiDiagnosticRunner } from "@/components/diagnostics/ApiDiagnosticRunner"; 
import { ApiEndpointDiagnostics } from "@/components/diagnostics/ApiEndpointDiagnostics";
import { ApiIntegrationTests } from "@/components/diagnostics/ApiIntegrationTests";
import { useUser } from "@/context/UserContext";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { testApiIntegrations } from "@/services/diagnostics/apiIntegrationTests";

const ApiDiagnosticsPage: React.FC = () => {
  // Check if user has admin permissions
  const { userProfile } = useUser();
  const userRole = userProfile?.role || "client";
  const isAdmin = userRole === "admin" || userRole === "system_administrator" || userRole === "developer";
  
  // Simulate API integration tests data
  const apiIntegrationTestsData = testApiIntegrations().map((test, index) => ({
    id: `api-integration-${index}`,
    ...test
  }));
  
  // If not admin or developer, redirect to dashboard with error message
  if (!isAdmin) {
    toast.error("You don't have permission to access API Diagnostics");
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <DashboardHeader 
        heading="API Diagnostics & Documentation" 
        text="Tools for testing, documenting, and implementing API endpoints"
      />
      
      <Tabs defaultValue="diagnostics" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="diagnostics">API Diagnostics</TabsTrigger>
          <TabsTrigger value="runner">API Runner</TabsTrigger>
          <TabsTrigger value="integrations">Integration Tests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="diagnostics">
          <div className="grid grid-cols-1 gap-6">
            <ApiEndpointDiagnostics />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">API Implementation Guide</CardTitle>
                <CardDescription>
                  Best practices for implementing backend API endpoints
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 border rounded-md">
                      <h3 className="font-medium mb-2">Response Format</h3>
                      <pre className="text-xs bg-zinc-950 text-zinc-50 p-3 rounded">
{`{
  "success": true|false,
  "data": { /* your data */ },
  "message": "Success/error message",
  "error": "Error details if success is false"
}`}
                      </pre>
                    </div>
                    <div className="p-4 border rounded-md">
                      <h3 className="font-medium mb-2">Error Handling</h3>
                      <p className="text-sm mb-2">All API endpoints should:</p>
                      <ul className="text-sm list-disc list-inside space-y-1">
                        <li>Use appropriate HTTP status codes</li>
                        <li>Return consistent error messages</li>
                        <li>Include error details when appropriate</li>
                        <li>Log errors on the server side</li>
                      </ul>
                    </div>
                    <div className="p-4 border rounded-md">
                      <h3 className="font-medium mb-2">Authentication</h3>
                      <p className="text-sm mb-2">Implement JWT-based authentication:</p>
                      <ul className="text-sm list-disc list-inside space-y-1">
                        <li>Validate tokens on each request</li>
                        <li>Check permissions based on user role</li>
                        <li>Return 401 for invalid/missing tokens</li>
                        <li>Return 403 for insufficient permissions</li>
                      </ul>
                    </div>
                    <div className="p-4 border rounded-md">
                      <h3 className="font-medium mb-2">Validation</h3>
                      <p className="text-sm mb-2">Always validate:</p>
                      <ul className="text-sm list-disc list-inside space-y-1">
                        <li>Request parameters and query strings</li>
                        <li>Request body for POST/PUT/PATCH</li>
                        <li>Return 400 for invalid requests</li>
                        <li>Provide specific validation error messages</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="runner">
          <ApiDiagnosticRunner />
        </TabsContent>
        
        <TabsContent value="integrations">
          <ApiIntegrationTests 
            tests={apiIntegrationTestsData} 
            onRefresh={() => toast.success("Refreshed integration tests")}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApiDiagnosticsPage;
