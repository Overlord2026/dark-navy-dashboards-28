
import React from "react";
import { Link } from "react-router-dom";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { useLocation, useSearchParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookIcon, ArrowRightIcon } from "lucide-react";
import { AssetsSummary } from "@/components/dashboard/AssetsSummary";
import { SegmentAwareHero } from "@/components/dashboard/SegmentAwareHero";

export default function Dashboard() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const segment = searchParams.get('segment');
  
  // Segment-specific dashboard content will be handled by the SegmentAwareHero component
  
  return (
    <ThreeColumnLayout activeMainItem="dashboard">
      <div className="space-y-6">
        {/* Add segment-aware hero section */}
        <SegmentAwareHero />
        
        {/* Assets Summary */}
        <AssetsSummary />
        
        {/* Two side-by-side cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Education & Solutions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookIcon className="h-5 w-5 text-primary" />
                Learning Modules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Explore our learning center to build your financial knowledge.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                className="ml-auto flex items-center gap-2" 
                variant="outline"
                asChild
              >
                <Link to="/education">
                  Go to Education Center
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          {/* My Profile & Trial Card */}
          <Card>
            <CardHeader>
              <CardTitle>90-Day Trial</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Start your free 90-day trial
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                className="ml-auto" 
                variant="default"
                asChild
              >
                <Link to="/auth">
                  Create Your Profile
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </ThreeColumnLayout>
  );
}
