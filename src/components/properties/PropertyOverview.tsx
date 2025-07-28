import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Building, 
  TrendingUp, 
  DollarSign, 
  MapPin, 
  Calendar, 
  AlertTriangle,
  Plus,
  Zap,
  FileText
} from "lucide-react";
import { useSubscriptionAccess } from "@/hooks/useSubscriptionAccess";

interface PropertyOverviewProps {
  initialFilter?: string | null;
}

export const PropertyOverview: React.FC<PropertyOverviewProps> = ({ initialFilter }) => {
  const { subscriptionPlan, checkFeatureAccess } = useSubscriptionAccess();
  const hasPremiumAccess = checkFeatureAccess('premium');

  // Mock data - in real implementation, this would come from your property management system
  const portfolioStats = {
    totalProperties: 3,
    totalValue: 2450000,
    monthlyIncome: hasPremiumAccess ? 8500 : 0,
    totalEquity: 1850000,
    occupancyRate: hasPremiumAccess ? 95 : 0,
    propertyLimit: hasPremiumAccess ? null : 3
  };

  const recentActivities = [
    { id: 1, type: "rent_received", property: "Sunset Apartment", amount: 2800, date: "2024-02-15" },
    { id: 2, type: "maintenance", property: "Downtown Condo", description: "HVAC servicing", date: "2024-02-14" },
    { id: 3, type: "lease_renewal", property: "Beach House", description: "Lease renewed for 1 year", date: "2024-02-12" }
  ];

  const upcomingReminders = [
    { id: 1, type: "insurance", property: "Sunset Apartment", dueDate: "2024-03-15", priority: "high" },
    { id: 2, type: "tax", property: "Downtown Condo", dueDate: "2024-03-20", priority: "medium" },
    { id: 3, type: "lease", property: "Beach House", dueDate: "2024-04-01", priority: "low" }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioStats.totalProperties}</div>
            <p className="text-xs text-muted-foreground">
              {portfolioStats.propertyLimit ? `Limit: ${portfolioStats.propertyLimit}` : "Unlimited"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${portfolioStats.totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +5.2% from last quarter
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${hasPremiumAccess ? portfolioStats.monthlyIncome.toLocaleString() : "0"}
            </div>
            <p className="text-xs text-muted-foreground">
              {hasPremiumAccess ? "Active rental tracking" : "Upgrade for rental analytics"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Equity</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${portfolioStats.totalEquity.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              75% loan-to-value ratio
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Premium Upgrade CTA */}
      {!hasPremiumAccess && (
        <Alert>
          <Zap className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <strong>Upgrade to Premium</strong> for unlimited properties, rental analytics, marketplace access, and advanced reporting.
            </div>
            <Button size="sm">Upgrade Now</Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Property Limit Warning */}
      {!hasPremiumAccess && portfolioStats.totalProperties >= 2 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You're approaching your property limit ({portfolioStats.totalProperties}/{portfolioStats.propertyLimit}). 
            Upgrade to add unlimited properties.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your properties</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                      {activity.type === "rent_received" && <DollarSign className="h-4 w-4 text-green-600" />}
                      {activity.type === "maintenance" && <Building className="h-4 w-4 text-orange-600" />}
                      {activity.type === "lease_renewal" && <FileText className="h-4 w-4 text-blue-600" />}
                    </div>
                    <div>
                      <p className="font-medium">{activity.property}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.amount ? `$${activity.amount}` : activity.description}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">{activity.date}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Reminders */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Reminders</CardTitle>
            <CardDescription>Important dates to remember</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingReminders.map((reminder) => (
                <div key={reminder.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{reminder.property}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {reminder.type} due
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={
                        reminder.priority === "high" ? "destructive" : 
                        reminder.priority === "medium" ? "secondary" : "outline"
                      }
                      className="text-xs"
                    >
                      {reminder.priority}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{reminder.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Plus className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Add Property</h3>
                <p className="text-sm text-muted-foreground">Add a new property to your portfolio</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`cursor-pointer hover:shadow-md transition-shadow ${!hasPremiumAccess ? 'opacity-50' : ''}`}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <TrendingUp className="h-8 w-8 text-accent" />
              <div>
                <h3 className="font-semibold">
                  View Analytics
                  {!hasPremiumAccess && <Badge variant="secondary" className="ml-2">Premium</Badge>}
                </h3>
                <p className="text-sm text-muted-foreground">Detailed performance insights</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <FileText className="h-8 w-8 text-purple-500" />
              <div>
                <h3 className="font-semibold">Manage Documents</h3>
                <p className="text-sm text-muted-foreground">Upload and organize property docs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};