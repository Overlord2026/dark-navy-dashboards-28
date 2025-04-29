
import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";
import { useIsMobile } from "@/hooks/use-mobile";
import { BookIcon, ArrowRightIcon } from "lucide-react";
import { AssetsSummary } from "./AssetsSummary";

interface AspiringDashboardProps {
  segment?: string;
}

export function AspiringDashboard({ segment }: AspiringDashboardProps) {
  const { profile, loading } = useProfile();
  const isMobile = useIsMobile();

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="space-y-6">
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
              <Button className="ml-auto flex items-center gap-2" variant="outline">
                Go to Education Center
                <ArrowRightIcon className="h-4 w-4" />
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
              <Button className="ml-auto" variant="default">
                Create Your Profile
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AspiringDashboard;
