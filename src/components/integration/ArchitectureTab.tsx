
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export const ArchitectureTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>System Architecture</CardTitle>
          <CardDescription>
            Overview of the integration architecture for the Family Office Marketplace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Architecture Overview</AlertTitle>
              <AlertDescription>
                This view provides a visual representation of how your project connects with other components 
                in the Family Office Marketplace ecosystem.
              </AlertDescription>
            </Alert>
          </div>
          
          <div className="border rounded-md p-8 flex items-center justify-center text-center h-64 bg-muted/30">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Architecture Diagram</h3>
              <p className="text-muted-foreground">
                The architecture diagram visualization will be available in the next update.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
