
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Database, Users, Lock, Server, Layers, CloudCog, Network } from "lucide-react";

export function ArchitectureTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            Family Office Architecture
          </CardTitle>
          <CardDescription>
            Overview of the current system architecture connecting all projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-background p-6 rounded-md border border-dashed">
            <div className="relative">
              {/* Architecture diagram would be here - for now using a simple placeholder */}
              <div className="flex flex-col items-center gap-8">
                <div className="w-full bg-blue-500/10 p-4 rounded-md border border-blue-500/30 text-center">
                  <p className="font-medium">Client Portals Layer</p>
                  <div className="mt-3 flex justify-center gap-4">
                    <Badge variant="outline" className="bg-blue-500/10">Aspiring</Badge>
                    <Badge variant="outline" className="bg-amber-500/10">Retirees</Badge>
                    <Badge variant="outline" className="bg-indigo-500/10">UHNW</Badge>
                  </div>
                </div>
                
                <Network className="h-6 w-6 text-gray-400" />
                
                <div className="w-full bg-primary/10 p-4 rounded-md border border-primary/30 text-center">
                  <p className="font-medium">Integration & Authentication Layer</p>
                  <div className="mt-3 flex justify-center gap-4">
                    <Badge variant="outline" className="bg-primary/10">Supabase</Badge>
                    <Badge variant="outline" className="bg-primary/10">API Gateway</Badge>
                  </div>
                </div>
                
                <Network className="h-6 w-6 text-gray-400" />
                
                <div className="w-full bg-green-500/10 p-4 rounded-md border border-green-500/30 text-center">
                  <p className="font-medium">Advisor & Admin Layer</p>
                  <div className="mt-3 flex justify-center gap-4">
                    <Badge variant="outline" className="bg-green-500/10">Admin Portal</Badge>
                    <Badge variant="outline" className="bg-green-500/10">Advisor Dashboard</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            <div className="p-4 border rounded-md flex items-start gap-3">
              <Database className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h3 className="font-medium">Shared Database</h3>
                <p className="text-sm text-muted-foreground">Centralized data storage for all portals</p>
              </div>
            </div>
            
            <div className="p-4 border rounded-md flex items-start gap-3">
              <Lock className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <h3 className="font-medium">Unified Authentication</h3>
                <p className="text-sm text-muted-foreground">Single sign-on across all platforms</p>
              </div>
            </div>
            
            <div className="p-4 border rounded-md flex items-start gap-3">
              <Server className="h-5 w-5 text-indigo-500 mt-0.5" />
              <div>
                <h3 className="font-medium">Microservices</h3>
                <p className="text-sm text-muted-foreground">Specialized services for each segment</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Architecture Documentation</CardTitle>
          <CardDescription>Technical resources and documentation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full justify-start">
            <CloudCog className="mr-2 h-4 w-4" />
            Infrastructure Diagram
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Database className="mr-2 h-4 w-4" />
            Database Schema
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Network className="mr-2 h-4 w-4" />
            API Documentation
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
