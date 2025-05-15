
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Code, Globe, AlertCircle, Check } from "lucide-react";
import { SupabaseRequiredNotice } from './SupabaseRequiredNotice';

export const ApiIntegrationsTab: React.FC = () => {
  const apis = [
    {
      id: "api-1",
      name: "Financial Data API",
      description: "Real-time market data and portfolio valuations",
      status: "active",
      endpoints: 7
    },
    {
      id: "api-2",
      name: "Document Management API",
      description: "Secure document storage and retrieval",
      status: "active",
      endpoints: 4
    },
    {
      id: "api-3",
      name: "Reporting API",
      description: "Generate and distribute client reports",
      status: "inactive",
      endpoints: 3
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">API Integrations</h2>
        <Button>Add New API</Button>
      </div>
      
      <SupabaseRequiredNotice />
      
      <div className="grid grid-cols-1 gap-6">
        {apis.map(api => (
          <Card key={api.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-primary" />
                  <CardTitle>{api.name}</CardTitle>
                </div>
                <Badge variant={api.status === 'active' ? 'success' : 'default'}>
                  {api.status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <CardDescription>{api.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm">
                <Code className="h-4 w-4 mr-1" />
                <span>{api.endpoints} Endpoints Available</span>
              </div>
              
              <div className="mt-4 space-y-2">
                {api.status === 'active' ? (
                  <div className="flex items-center text-sm text-green-600 dark:text-green-500">
                    <Check className="h-4 w-4 mr-1" />
                    <span>API is connected and functioning properly</span>
                  </div>
                ) : (
                  <div className="flex items-center text-sm text-amber-600 dark:text-amber-500">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    <span>API requires configuration</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50 flex justify-between">
              <Button variant="ghost" size="sm">
                View Documentation
              </Button>
              <Button size="sm">
                Manage API
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
