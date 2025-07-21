import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/formatters";
import { TrendingUp, TrendingDown, Heart, Target, Shield } from "lucide-react";
import { FamilyOfficeData } from "@/types/familyOffice";
import { useDashboardData } from "@/hooks/useDashboardData";

interface PersonalizedWelcomeProps {
  familyData: FamilyOfficeData;
}

export const PersonalizedWelcome: React.FC<PersonalizedWelcomeProps> = ({ familyData }) => {
  const { metrics } = useDashboardData();
  
  const getRetirementStatus = () => {
    if (familyData.retirementReadiness.score >= 80) {
      return { status: "On Track", color: "bg-emerald-500", icon: <Target className="h-4 w-4" /> };
    } else if (familyData.retirementReadiness.score >= 60) {
      return { status: "Needs Review", color: "bg-amber-500", icon: <Shield className="h-4 w-4" /> };
    } else {
      return { status: "Behind Schedule", color: "bg-red-500", icon: <TrendingDown className="h-4 w-4" /> };
    }
  };

  const retirementStatus = getRetirementStatus();
  const monthlyIncome = familyData.incomeStreams.reduce((sum, stream) => {
    const monthlyAmount = stream.frequency === 'monthly' ? stream.amount : 
                         stream.frequency === 'quarterly' ? stream.amount / 3 :
                         stream.amount / 12;
    return sum + monthlyAmount;
  }, 0);

  const savingsRate = ((monthlyIncome - 6000) / monthlyIncome) * 100; // Assuming $6k monthly expenses

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-background p-6 border">
        <div className="relative z-10">
          <h1 className="text-2xl font-bold mb-2">
            Welcome back, {familyData.personalInfo.name}! ✨
          </h1>
          <p className="text-muted-foreground">
            Here's your family's big-picture progress and what's happening next.
          </p>
        </div>
        {familyData.personalInfo.familyImage && (
          <div className="absolute right-4 top-4 w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
            <Heart className="h-8 w-8 text-primary" />
          </div>
        )}
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Net Worth */}
        <Card className="hover-scale">
          <CardContent className="p-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Net Worth</p>
              <p className="text-2xl font-bold">{formatCurrency(metrics.netWorth)}</p>
              <div className="flex items-center space-x-1 text-emerald-600">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">+{metrics.netWorthGrowth.toFixed(1)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Investable Assets */}
        <Card className="hover-scale">
          <CardContent className="p-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Investable Assets</p>
              <p className="text-2xl font-bold">{formatCurrency(metrics.totalAssets * 0.75)}</p>
              <div className="flex items-center space-x-1 text-blue-600">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">+{metrics.assetGrowth.toFixed(1)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Savings Rate */}
        <Card className="hover-scale">
          <CardContent className="p-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Savings Rate</p>
              <p className="text-2xl font-bold">{savingsRate.toFixed(0)}%</p>
              <Badge 
                variant="secondary" 
                className={savingsRate >= 20 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}
              >
                {savingsRate >= 20 ? "On Track" : "Review Needed"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Retirement Readiness */}
        <Card className="hover-scale">
          <CardContent className="p-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Retirement Readiness</p>
              <p className="text-2xl font-bold">{familyData.retirementReadiness.score}%</p>
              <Badge 
                variant="secondary" 
                className={`${retirementStatus.color.replace('bg-', 'bg-').replace('-500', '-100')} text-foreground`}
              >
                <span className="flex items-center space-x-1">
                  {retirementStatus.icon}
                  <span>{retirementStatus.status}</span>
                </span>
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Health/Longevity Score */}
        <Card className="hover-scale">
          <CardContent className="p-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Health Fund</p>
              <p className="text-2xl font-bold">{formatCurrency(familyData.health.hsaBalance)}</p>
              <div className="flex items-center space-x-1 text-purple-600">
                <Heart className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {((familyData.health.healthBudgetFunded / familyData.health.annualHealthBudget) * 100).toFixed(0)}% funded
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};