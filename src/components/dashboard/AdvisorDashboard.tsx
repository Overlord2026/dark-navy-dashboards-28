
import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";
import { BookIcon, ArrowRightIcon, UsersIcon, BarChart3Icon } from "lucide-react";
import { AssetsSummary } from "./AssetsSummary";

interface AdvisorDashboardProps {
  segment?: string;
}

export function AdvisorDashboard({ segment }: AdvisorDashboardProps) {
  const { profile, loading } = useProfile();

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="space-y-6">
        {/* Client Assets Summary */}
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Client Assets</CardTitle>
            <BarChart3Icon className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 p-6 rounded-md text-center">
              <p className="text-muted-foreground">Connect your client accounts to see their assets here</p>
              <div className="mt-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                <p className="text-center">Your clients' Plaid-connected assets will appear here</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="ml-auto flex items-center gap-2">
              View Client Accounts
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        {/* Two side-by-side cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Education & Solutions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookIcon className="h-5 w-5 text-primary" />
                Advisor Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Access educational materials and resources to better serve your clients.
              </p>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto flex items-center gap-2" variant="outline">
                Resource Center
                <ArrowRightIcon className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
          
          {/* Client Management Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UsersIcon className="h-5 w-5 text-primary" />
                Client Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Manage your client relationships and portfolios
              </p>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto" variant="default">
                View Clients
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AdvisorDashboard;
