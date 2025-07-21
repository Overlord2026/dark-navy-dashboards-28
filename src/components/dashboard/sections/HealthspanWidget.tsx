import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/formatters";
import { 
  Heart, 
  Activity, 
  Shield, 
  Calendar, 
  TrendingUp,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { HealthMetrics } from "@/types/familyOffice";

interface HealthspanWidgetProps {
  healthData: HealthMetrics;
}

export const HealthspanWidget: React.FC<HealthspanWidgetProps> = ({ healthData }) => {
  const fundingPercentage = (healthData.healthBudgetFunded / healthData.annualHealthBudget) * 100;
  const lastPhysicalDays = healthData.lastPhysical ? 
    Math.floor((new Date().getTime() - healthData.lastPhysical.getTime()) / (1000 * 60 * 60 * 24)) : 
    null;

  const getPhysicalStatus = () => {
    if (!lastPhysicalDays) return { status: "Schedule Needed", color: "bg-red-500", urgent: true };
    if (lastPhysicalDays > 365) return { status: "Overdue", color: "bg-red-500", urgent: true };
    if (lastPhysicalDays > 300) return { status: "Due Soon", color: "bg-amber-500", urgent: true };
    return { status: "Up to Date", color: "bg-emerald-500", urgent: false };
  };

  const physicalStatus = getPhysicalStatus();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Healthspan & Longevity</h2>
        <p className="text-muted-foreground">Your proactive wellness and longevity planning</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* HSA & Health Funding */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span>Health Funding Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">HSA Balance</span>
                <span className="font-bold text-lg">{formatCurrency(healthData.hsaBalance)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Annual Health Budget</span>
                <span className="text-sm">{formatCurrency(healthData.annualHealthBudget)}</span>
              </div>
              
              <Progress value={fundingPercentage} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {formatCurrency(healthData.healthBudgetFunded)} funded this year
                </span>
                <Badge variant={fundingPercentage >= 75 ? "default" : "secondary"}>
                  {fundingPercentage.toFixed(0)}% funded
                </Badge>
              </div>
            </div>

            <div className="pt-2 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Longevity Insurance</span>
                <div className="flex items-center space-x-2">
                  {healthData.longevityInsurance ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm text-emerald-600">Active</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      <span className="text-sm text-amber-600">Consider</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wellness Goals & Checkups */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-green-600" />
              <span>Wellness Tracking</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Last Physical */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Annual Physical</span>
                <Badge 
                  variant="secondary"
                  className={`${physicalStatus.color.replace('bg-', 'bg-').replace('-500', '-100')} text-foreground`}
                >
                  {physicalStatus.status}
                </Badge>
              </div>
              
              {healthData.lastPhysical && (
                <div className="text-xs text-muted-foreground">
                  Last: {healthData.lastPhysical.toLocaleDateString()}
                  {lastPhysicalDays && ` (${lastPhysicalDays} days ago)`}
                </div>
              )}
            </div>

            {/* Wellness Goals */}
            <div className="space-y-3">
              <span className="text-sm font-medium">Wellness Goals</span>
              {healthData.wellnessGoals.map((goal, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{goal.target}</span>
                    <span className="text-sm font-medium">
                      {goal.progress.toLocaleString()} {goal.unit}
                    </span>
                  </div>
                  <Progress 
                    value={goal.target === "Steps Daily" ? (goal.progress / 10000) * 100 : 
                           goal.target === "Meditation" ? (goal.progress / 30) * 100 : 
                           (goal.progress / 5) * 100} 
                    className="h-1.5" 
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Items */}
      <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-pink-100 rounded-lg">
                <Heart className="h-5 w-5 text-pink-600" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-pink-900">Recommended Actions</h3>
                <div className="space-y-1 text-sm text-pink-700">
                  {physicalStatus.urgent && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Schedule your annual physical exam</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>Consider increasing HSA contributions for tax benefits</span>
                  </div>
                  {!healthData.longevityInsurance && (
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4" />
                      <span>Explore longevity insurance options</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Explore Health Strategies
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};