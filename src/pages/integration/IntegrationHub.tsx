
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SupabaseRequiredNotice } from "@/components/integration/SupabaseRequiredNotice";

export function IntegrationHub() {
  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">API Integrations</h1>
        
        <SupabaseRequiredNotice />
        
        <Tabs defaultValue="available" className="mt-8">
          <TabsList>
            <TabsTrigger value="available">Available Integrations</TabsTrigger>
            <TabsTrigger value="connected">Connected</TabsTrigger>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="available" className="space-y-6 mt-6">
            <Card>
              <CardContent className="pt-6">
                <p>Available API integrations will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="connected" className="space-y-6 mt-6">
            <Card>
              <CardContent className="pt-6">
                <p>Connected API integrations will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="configuration" className="space-y-6 mt-6">
            <Card>
              <CardContent className="pt-6">
                <p>API configurations will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default IntegrationHub;
