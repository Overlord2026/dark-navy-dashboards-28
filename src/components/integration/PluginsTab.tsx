
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Download, ToggleLeft } from "lucide-react";
import { SupabaseRequiredNotice } from './SupabaseRequiredNotice';

export const PluginsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Plugins</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> 
          Add Plugin
        </Button>
      </div>
      
      <SupabaseRequiredNotice />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Investment Analytics</CardTitle>
            <CardDescription>Performance tracking & portfolio analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Real-time investment performance tracking and portfolio analytics engine.
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="bg-green-500/20 text-green-600 text-xs py-1 px-2 rounded-full">
                Active
              </span>
              <span className="text-xs text-muted-foreground">v2.1.3</span>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-2 flex justify-between">
            <Button variant="ghost" size="sm">Configure</Button>
            <Button variant="ghost" size="sm">
              <ToggleLeft className="h-4 w-4 mr-1" />
              Disable
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Tax Document Generator</CardTitle>
            <CardDescription>Create tax forms & statements</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Generate tax documents and statements compliant with IRS requirements.
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="bg-red-500/20 text-red-600 text-xs py-1 px-2 rounded-full">
                Inactive
              </span>
              <span className="text-xs text-muted-foreground">v1.5.0</span>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-2 flex justify-between">
            <Button variant="ghost" size="sm">Configure</Button>
            <Button variant="ghost" size="sm">
              <ToggleLeft className="h-4 w-4 mr-1" />
              Enable
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Compliance Checker</CardTitle>
            <CardDescription>Regulatory compliance scanning</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Automatically check portfolio holdings against regulatory requirements.
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="bg-yellow-500/20 text-yellow-600 text-xs py-1 px-2 rounded-full">
                Pending Setup
              </span>
              <span className="text-xs text-muted-foreground">v3.0.1</span>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-2 flex justify-between">
            <Button variant="ghost" size="sm">Setup</Button>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Update
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
