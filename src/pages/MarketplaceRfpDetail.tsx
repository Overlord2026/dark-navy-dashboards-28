
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { RfpDetailView } from "@/components/marketplace/RfpDetailView";

export default function MarketplaceRfpDetail() {
  const { id } = useParams();
  
  return (
    <ThreeColumnLayout title="RFP Details - Family Office Marketplace">
      <div className="space-y-6 px-4 py-6 max-w-7xl mx-auto">
        <div className="flex flex-col gap-2">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" asChild className="gap-1">
              <Link to="/marketplace/rfp">
                <ArrowLeft className="h-4 w-4" />
                Back to RFPs
              </Link>
            </Button>
          </div>
          
          <h1 className="text-3xl font-bold tracking-tight">Request for Proposal</h1>
          <p className="text-muted-foreground">
            Submit your proposal to this RFP to connect with potential clients and grow your business.
          </p>
        </div>
        
        <RfpDetailView rfpId={id} />
      </div>
    </ThreeColumnLayout>
  );
}
