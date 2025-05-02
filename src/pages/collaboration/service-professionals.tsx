
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";

export default function ServiceProfessionalsCollab() {
  return (
    <ThreeColumnLayout title="Service Professionals Collaboration">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-4">Service Professionals Collaboration</h1>
        <p className="text-lg mb-6">Here advisors and families can connect with vetted service providers.</p>
        
        <div className="bg-card border rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Connect with Service Professionals</h2>
          <p className="mb-4">Collaborate with tax advisors, estate planners, attorneys, and other professionals in a secure environment.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Document Sharing</h3>
              <p className="text-sm text-muted-foreground">
                Securely share and collaborate on documents with your service professionals.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Meeting Scheduling</h3>
              <p className="text-sm text-muted-foreground">
                Schedule and manage meetings with your professional advisors.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Task Management</h3>
              <p className="text-sm text-muted-foreground">
                Track tasks and deadlines related to your professional engagements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ThreeColumnLayout>
  );
}
