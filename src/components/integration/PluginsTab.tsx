
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Puzzle, DownloadCloud, Settings } from "lucide-react";
import { SupabaseRequiredNotice } from './SupabaseRequiredNotice';

export const PluginsTab: React.FC = () => {
  const plugins = [
    {
      id: "plugin-1",
      name: "Tax Document Processor",
      description: "Automatically process and categorize tax documents",
      status: "installed",
      version: "2.3.1"
    },
    {
      id: "plugin-2",
      name: "Portfolio Rebalancer",
      description: "Smart portfolio rebalancing suggestions",
      status: "available",
      version: "1.5.0"
    },
    {
      id: "plugin-3",
      name: "Compliance Checker",
      description: "Verify transactions against compliance rules",
      status: "installed",
      version: "3.0.2"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Available Plugins</h2>
        <Button>Browse Plugin Marketplace</Button>
      </div>
      
      <SupabaseRequiredNotice />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plugins.map(plugin => (
          <Card key={plugin.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <Puzzle className="h-5 w-5 mr-2 text-primary" />
                  <CardTitle className="text-base">{plugin.name}</CardTitle>
                </div>
                <Badge variant={plugin.status === 'installed' ? 'success' : 'secondary'}>
                  {plugin.status === 'installed' ? 'Installed' : 'Available'}
                </Badge>
              </div>
              <CardDescription>{plugin.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Version: {plugin.version}
              </p>
            </CardContent>
            <CardFooter className="bg-muted/50 flex justify-between">
              {plugin.status === 'installed' ? (
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4 mr-1" />
                  Configure
                </Button>
              ) : (
                <Button variant="ghost" size="sm">
                  Details
                </Button>
              )}
              
              {plugin.status === 'installed' ? (
                <Button variant="outline" size="sm">
                  Uninstall
                </Button>
              ) : (
                <Button size="sm">
                  <DownloadCloud className="h-4 w-4 mr-1" />
                  Install
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="text-center mt-8">
        <p className="text-muted-foreground">
          Don't see what you need? Create a custom plugin for your specific requirements.
        </p>
        <Button variant="outline" className="mt-2">
          Create Custom Plugin
        </Button>
      </div>
    </div>
  );
};
