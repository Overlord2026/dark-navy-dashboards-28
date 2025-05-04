
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export function ArchitectureTab() {
  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Architecture Diagram</AlertTitle>
        <AlertDescription>
          This diagram shows how your project connects to other systems in the Family Office ecosystem.
        </AlertDescription>
      </Alert>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center p-8 bg-muted rounded-md">
            <div className="text-center">
              <h3 className="mb-2 font-semibold">System Architecture Diagram</h3>
              <div className="w-full h-[400px] flex items-center justify-center bg-card border rounded-md p-4">
                {/* In a real implementation, this would be an actual architecture diagram */}
                <div className="space-y-4 text-center">
                  <p className="text-muted-foreground">
                    Integration architecture visualization will appear here
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Showing connections between Family Office modules, API endpoints, and external services
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <h3 className="font-medium mb-2">Core Systems</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center justify-between">
              <span>Family Office Core</span>
              <span className="text-green-500 text-xs font-medium">Connected</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Client Portal</span>
              <span className="text-green-500 text-xs font-medium">Connected</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Document Management</span>
              <span className="text-yellow-500 text-xs font-medium">Partial</span>
            </li>
          </ul>
        </Card>
        
        <Card className="p-4">
          <h3 className="font-medium mb-2">External Interfaces</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center justify-between">
              <span>Banking APIs</span>
              <span className="text-green-500 text-xs font-medium">Connected</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Market Data</span>
              <span className="text-green-500 text-xs font-medium">Connected</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Regulatory Filing</span>
              <span className="text-red-500 text-xs font-medium">Not Connected</span>
            </li>
          </ul>
        </Card>
        
        <Card className="p-4">
          <h3 className="font-medium mb-2">Security Systems</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center justify-between">
              <span>Audit Logging</span>
              <span className="text-green-500 text-xs font-medium">Connected</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Identity Provider</span>
              <span className="text-green-500 text-xs font-medium">Connected</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Encryption Gateway</span>
              <span className="text-red-500 text-xs font-medium">Not Connected</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
