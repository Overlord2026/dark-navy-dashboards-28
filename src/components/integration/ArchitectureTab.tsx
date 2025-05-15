
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { SupabaseRequiredNotice } from './SupabaseRequiredNotice';

export const ArchitectureTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">System Architecture</h2>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" /> 
          Export Architecture Diagram
        </Button>
      </div>
      
      <SupabaseRequiredNotice />
      
      <Card>
        <CardHeader>
          <CardTitle>Architecture Overview</CardTitle>
          <CardDescription>
            Key components and relationships in your Family Office system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center bg-muted p-8 rounded-md min-h-[300px]">
            <div className="text-center">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Architecture diagram will be displayed here.
              </p>
              <Button className="mt-4">Generate Architecture Diagram</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Data Flow</CardTitle>
            <CardDescription>How data moves between components</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Client data ingestion through API gateways</li>
              <li>Secure data transformation pipeline</li>
              <li>Database storage with row-level security</li>
              <li>Reporting and analytics data flows</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Integration Points</CardTitle>
            <CardDescription>External system connections</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Financial data providers via secure APIs</li>
              <li>Document management system integration</li>
              <li>Compliance system connections</li>
              <li>Client portal authentication</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
