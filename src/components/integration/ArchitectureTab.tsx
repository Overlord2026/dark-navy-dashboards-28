
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Server, Layers, Network } from "lucide-react";

export function ArchitectureTab() {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        The Family Office Marketplace platform architecture provides a secure and flexible foundation
        for integrating with external systems and services.
      </p>
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Database className="h-5 w-5" />
            <div>
              <CardTitle>Data Layer</CardTitle>
              <CardDescription>Core data services and persistence</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Supabase PostgreSQL backend for relational data</li>
              <li>Real-time data synchronization</li>
              <li>Row-level security for fine-grained access control</li>
              <li>Full auditing capabilities for data changes</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Server className="h-5 w-5" />
            <div>
              <CardTitle>API Layer</CardTitle>
              <CardDescription>Integration interfaces and services</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>RESTful API endpoints for all resources</li>
              <li>GraphQL interface for complex data queries</li>
              <li>Webhook infrastructure for event-driven integrations</li>
              <li>API rate limiting and monitoring</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Layers className="h-5 w-5" />
            <div>
              <CardTitle>Application Layer</CardTitle>
              <CardDescription>Business logic and processing</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Modular service architecture</li>
              <li>Event-driven processing with message queues</li>
              <li>Scheduled tasks and background processing</li>
              <li>Extensible plugin system</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Network className="h-5 w-5" />
            <div>
              <CardTitle>Security Layer</CardTitle>
              <CardDescription>Authentication and authorization</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Supabase Auth for identity management</li>
              <li>Role-based access control (RBAC)</li>
              <li>JWT token-based API authentication</li>
              <li>Data encryption at rest and in transit</li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-muted p-4 rounded-md">
        <h3 className="text-sm font-semibold mb-2">System Requirements</h3>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <div>
            <span className="font-medium">Database:</span> PostgreSQL 14+
          </div>
          <div>
            <span className="font-medium">Auth Provider:</span> Supabase Auth
          </div>
          <div>
            <span className="font-medium">API Runtime:</span> Node.js 18+
          </div>
          <div>
            <span className="font-medium">Frontend:</span> React 18+
          </div>
        </div>
      </div>
    </div>
  );
}
