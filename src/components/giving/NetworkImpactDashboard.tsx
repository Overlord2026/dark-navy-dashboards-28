import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NetworkImpactSummary } from "@/hooks/useImpactReporting";
import { TrendingUp, Users, Heart, Building, Calendar } from "lucide-react";
import { format } from "date-fns";

interface NetworkImpactDashboardProps {
  networkData: NetworkImpactSummary[];
  isAdmin?: boolean;
}

export const NetworkImpactDashboard = ({ networkData, isAdmin = false }: NetworkImpactDashboardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getCurrentYearData = () => {
    const currentYear = new Date().getFullYear();
    return networkData.find(data => 
      new Date(data.period_start).getFullYear() === currentYear && 
      data.period_type === 'annual'
    );
  };

  const getLatestQuarterData = () => {
    return networkData.find(data => data.period_type === 'quarterly');
  };

  const currentYearData = getCurrentYearData();
  const quarterData = getLatestQuarterData();

  if (!currentYearData && !quarterData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Network Impact Dashboard</CardTitle>
          <CardDescription>
            No network impact data available yet. Check back after some giving activity.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const displayData = currentYearData || quarterData;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-2">
          {isAdmin ? 'Network' : 'Community'} Impact Dashboard
        </h2>
        <p className="text-muted-foreground">
          Together, we're making a difference in our community
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2">
              <Users className="h-4 w-4" />
              Families Giving
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {displayData?.total_families || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Total Donated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {formatCurrency(displayData?.total_donated || 0)}
            </div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2">
              <Heart className="h-4 w-4" />
              Charities Supported
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {displayData?.total_charities || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2">
              <Building className="h-4 w-4" />
              Projects Funded
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {displayData?.total_projects || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {displayData?.top_charities && displayData.top_charities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Top Supported Causes
            </CardTitle>
            <CardDescription>
              Most supported charities in our network
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {displayData.top_charities.slice(0, 5).map((charity: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-bold text-primary">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{charity.charity_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {charity.donor_count} {charity.donor_count === 1 ? 'family' : 'families'} supporting
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary">
                      {formatCurrency(charity.total_amount)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Reporting Period
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <div className="text-lg font-medium">
              {displayData?.period_type === 'quarterly' ? 'Latest Quarter' : 'Current Year'}
            </div>
            <div className="text-muted-foreground">
              {format(new Date(displayData?.period_start || ''), 'MMMM d, yyyy')} - {' '}
              {format(new Date(displayData?.period_end || ''), 'MMMM d, yyyy')}
            </div>
            {displayData?.calculated_at && (
              <div className="text-sm text-muted-foreground mt-2">
                Last updated: {format(new Date(displayData.calculated_at), 'MMMM d, yyyy "at" h:mm a')}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};