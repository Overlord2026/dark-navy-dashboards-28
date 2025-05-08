
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Database, Server, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ArchitectureTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">System Architecture</h3>
        <p className="text-sm text-muted-foreground">
          Overview of your Family Office Marketplace integration architecture
        </p>
      </div>
      
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Architecture Overview</AlertTitle>
        <AlertDescription>
          This diagram shows how your Family Office Marketplace connects with other systems
          and the data flow between components.
        </AlertDescription>
      </Alert>

      <Card className="bg-muted/30 border-dashed">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center justify-center h-80">
            {/* Architecture Diagram Placeholder */}
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 w-40 text-center">
                  <Database className="h-10 w-10 mx-auto mb-2 text-primary" />
                  <p className="font-medium">BFO System</p>
                </div>
              </div>
              
              <div className="flex justify-center gap-16">
                <div className="border border-dashed border-muted-foreground h-20 w-0"></div>
                <div className="border border-dashed border-muted-foreground h-20 w-0"></div>
              </div>
              
              <div className="flex justify-between gap-8">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 w-40 text-center">
                  <Lock className="h-10 w-10 mx-auto mb-2 text-blue-500" />
                  <p className="font-medium">Security Layer</p>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 w-40 text-center">
                  <Server className="h-10 w-10 mx-auto mb-2 text-amber-500" />
                  <p className="font-medium">API Gateway</p>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 w-40 text-center">
                  <Database className="h-10 w-10 mx-auto mb-2 text-green-500" />
                  <p className="font-medium">Data Store</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Export Diagram</Button>
        <Button variant="outline">View Documentation</Button>
      </div>
    </div>
  );
};
