
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function ArchitectureTab() {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">System Architecture</h2>
        <p className="text-muted-foreground">
          Overview of the integrated Family Office platform architecture
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Architecture Diagram</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="border border-dashed border-muted-foreground p-8 rounded-lg w-full max-w-4xl">
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <p className="text-muted-foreground text-center mb-4">Architecture diagram placeholder</p>
              <p className="text-sm text-center text-muted-foreground">
                This will display a visual representation of how all Family Office applications are interconnected
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Data Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 list-disc pl-5">
              <li>Centralized authentication and authorization</li>
              <li>Secure data exchange between applications</li>
              <li>Real-time updates across connected platforms</li>
              <li>Standardized API protocols for consistency</li>
              <li>Encrypted data transmission for sensitive information</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Infrastructure</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 list-disc pl-5">
              <li>Cloud-based distributed architecture</li>
              <li>High-availability deployment configuration</li>
              <li>Automated scaling to handle increased workloads</li>
              <li>Disaster recovery with multi-region redundancy</li>
              <li>Continuous monitoring and alerting system</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
