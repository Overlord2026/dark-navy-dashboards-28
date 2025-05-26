
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { RfpSubmissionForm } from "@/components/marketplace/RfpSubmissionForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function MarketplaceRfp() {
  return (
    <ThreeColumnLayout title="Submit RFP - Family Office Marketplace">
      <div className="space-y-6 px-4 py-6 max-w-7xl mx-auto">
        <div className="flex flex-col gap-2">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" asChild className="gap-1">
              <Link to="/marketplace">
                <ArrowLeft className="h-4 w-4" />
                Back to Marketplace
              </Link>
            </Button>
          </div>
          
          <h1 className="text-3xl font-bold tracking-tight">Submit a Request for Proposal</h1>
          <p className="text-muted-foreground">
            Connect with the right service providers by submitting a detailed request for your specific needs.
          </p>
        </div>
        
        <RfpSubmissionForm />
        
        <div className="bg-muted/50 rounded-lg p-4 text-sm">
          <h3 className="font-medium mb-2">Benefits of Submitting an RFP</h3>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>Receive tailored proposals from multiple qualified providers</li>
            <li>Compare expertise, approaches, and pricing in one place</li>
            <li>Save time by clearly communicating your requirements once</li>
            <li>Find the best match for your specific family office needs</li>
          </ul>
        </div>
      </div>
    </ThreeColumnLayout>
  );
}
