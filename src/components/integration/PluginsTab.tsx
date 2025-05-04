
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Download, Settings } from "lucide-react";

export const PluginsTab = () => {
  const plugins = [
    {
      id: "1",
      name: "Document Sync",
      description: "Synchronize documents across connected projects",
      enabled: true,
      version: "1.2.0"
    },
    {
      id: "2",
      name: "Client Notifications",
      description: "Unified notification system for client communications",
      enabled: true,
      version: "2.0.1"
    },
    {
      id: "3",
      name: "Analytics Dashboard",
      description: "Cross-platform analytics for Family Office services",
      enabled: false,
      version: "1.0.3"
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Marketplace Plugins</CardTitle>
              <CardDescription>
                Extend your platform with Family Office Marketplace plugins
              </CardDescription>
            </div>
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Get More Plugins
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {plugins.map((plugin) => (
              <div key={plugin.id} className="flex items-center justify-between p-4 border rounded-md">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{plugin.name}</h4>
                    <Badge variant="outline" className="text-xs">v{plugin.version}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{plugin.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={plugin.enabled} />
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
