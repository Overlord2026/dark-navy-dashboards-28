
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SupabaseRequiredNotice } from "@/components/integration/SupabaseRequiredNotice";

export const ApiIntegrationsTab = () => {
  const apiIntegrations = [
    {
      id: "1",
      name: "Client Data API",
      status: "active",
      endpoints: 12,
      lastUsed: "3 hours ago"
    },
    {
      id: "2",
      name: "Document Sharing API",
      status: "active",
      endpoints: 8,
      lastUsed: "1 day ago"
    },
    {
      id: "3",
      name: "Analytics API",
      status: "inactive",
      endpoints: 6,
      lastUsed: "14 days ago"
    }
  ];

  return (
    <div className="space-y-6">
      <SupabaseRequiredNotice />
      
      <Card>
        <CardHeader>
          <CardTitle>API Integrations</CardTitle>
          <CardDescription>
            Manage API connections with the Family Office Marketplace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apiIntegrations.map((api) => (
              <div key={api.id} className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{api.name}</span>
                    <Badge variant={api.status === "active" ? "default" : "secondary"} className="text-xs">
                      {api.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {api.endpoints} endpoints • Last used {api.lastUsed}
                  </div>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
