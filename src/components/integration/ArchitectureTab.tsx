
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export const ArchitectureTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Architecture Overview</h2>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" /> Export Diagram
        </Button>
      </div>
      
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col items-center">
            <div className="mb-8 text-center">
              <h3 className="text-xl font-medium mb-2">Family Office Marketplace Integration Architecture</h3>
              <p className="text-muted-foreground">Current system architecture showing data flows between integrated components</p>
            </div>
            
            <div className="w-full p-6 bg-muted/20 rounded-lg border border-dashed flex flex-col items-center justify-center min-h-[400px]">
              <div className="bg-background p-4 rounded-lg shadow-sm border mb-6">
                <div className="text-center font-medium mb-2">Boutique Family Office Portal</div>
                <div className="flex gap-4 justify-center">
                  <div className="bg-primary/10 px-3 py-1 rounded text-xs">Client Dashboard</div>
                  <div className="bg-primary/10 px-3 py-1 rounded text-xs">Document Management</div>
                  <div className="bg-primary/10 px-3 py-1 rounded text-xs">Wealth Planning</div>
                </div>
              </div>
              
              <div className="w-[2px] h-8 bg-border"></div>
              <div className="bg-primary/20 p-4 rounded-lg shadow-sm border mb-2 w-64 text-center">
                <div className="font-medium">Integration Layer</div>
                <div className="text-xs text-muted-foreground mt-1">API Gateway + Authentication</div>
              </div>
              
              <div className="w-[2px] h-8 bg-border"></div>
              
              <div className="flex gap-6 justify-center items-start">
                <div className="bg-background p-3 rounded-lg shadow-sm border w-48 text-center">
                  <div className="font-medium text-sm">Investment Platform</div>
                  <div className="text-xs text-muted-foreground mt-1">Portfolio Management</div>
                </div>
                <div className="bg-background p-3 rounded-lg shadow-sm border w-48 text-center">
                  <div className="font-medium text-sm">Tax Planning Tool</div>
                  <div className="text-xs text-muted-foreground mt-1">Tax Optimization</div>
                </div>
                <div className="bg-background p-3 rounded-lg shadow-sm border border-dashed w-48 text-center">
                  <div className="font-medium text-sm text-muted-foreground">Future Integration</div>
                  <div className="text-xs text-muted-foreground mt-1">+ Add New Service</div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-sm text-muted-foreground">
              Diagram last updated: May 5, 2025
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-8">
        <h3 className="text-xl font-medium mb-4">Architecture Documentation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button variant="outline" className="justify-start h-auto py-3">
            <div className="text-left">
              <div className="font-medium">System Overview</div>
              <div className="text-xs text-muted-foreground mt-1">Technical architecture documentation</div>
            </div>
          </Button>
          <Button variant="outline" className="justify-start h-auto py-3">
            <div className="text-left">
              <div className="font-medium">API Documentation</div>
              <div className="text-xs text-muted-foreground mt-1">Integration points and methods</div>
            </div>
          </Button>
          <Button variant="outline" className="justify-start h-auto py-3">
            <div className="text-left">
              <div className="font-medium">Security Model</div>
              <div className="text-xs text-muted-foreground mt-1">Authentication and access controls</div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};
