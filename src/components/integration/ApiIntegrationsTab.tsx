
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, PlusCircle } from "lucide-react";

export const ApiIntegrationsTab = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">API Integrations</h2>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Integration
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Financial Data API
              <Badge className="bg-green-500">Active</Badge>
            </CardTitle>
            <CardDescription>Real-time market data feed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center">
                <CheckCircle2 className="text-green-500 h-4 w-4 mr-2" />
                <span className="text-sm">Authentication configured</span>
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="text-green-500 h-4 w-4 mr-2" />
                <span className="text-sm">Rate limiting enabled</span>
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="text-green-500 h-4 w-4 mr-2" />
                <span className="text-sm">Webhooks configured</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" size="sm">Documentation</Button>
            <Button variant="default" size="sm">Manage</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              CRM Integration
              <Badge className="bg-amber-500 text-amber-950">Setup Required</Badge>
            </CardTitle>
            <CardDescription>Client relationship data sync</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center">
                <CheckCircle2 className="text-green-500 h-4 w-4 mr-2" />
                <span className="text-sm">Authentication configured</span>
              </div>
              <div className="flex items-center">
                <XCircle className="text-red-500 h-4 w-4 mr-2" />
                <span className="text-sm">Data mapping incomplete</span>
              </div>
              <div className="flex items-center">
                <XCircle className="text-red-500 h-4 w-4 mr-2" />
                <span className="text-sm">Webhooks not configured</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" size="sm">Documentation</Button>
            <Button variant="default" size="sm">Complete Setup</Button>
          </CardFooter>
        </Card>
        
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Add New API Integration</CardTitle>
            <CardDescription>Connect to third-party services</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Button variant="outline" className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              Connect API
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
