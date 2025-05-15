
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SupabaseRequiredNotice } from './SupabaseRequiredNotice';

export const ApiIntegrationsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">API Integrations</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> 
          Add Integration
        </Button>
      </div>
      
      <SupabaseRequiredNotice />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Data Providers</CardTitle>
            <CardDescription>Connect to financial data sources</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Enhance your application with real-time financial data from trusted providers.
            </p>
            <Button variant="outline" size="sm">Configure Data Sources</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Authentication</CardTitle>
            <CardDescription>Integrate with identity providers</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Connect to SSO and other authentication providers.
            </p>
            <Button variant="outline" size="sm">Configure Auth</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Payment Gateways</CardTitle>
            <CardDescription>Connect payment processing services</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Integrate with payment processors to enable financial transactions.
            </p>
            <Button variant="outline" size="sm">Configure Payments</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Document Services</CardTitle>
            <CardDescription>Connect to document processing APIs</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Add document generation, signing, and verification capabilities.
            </p>
            <Button variant="outline" size="sm">Configure Document Services</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
