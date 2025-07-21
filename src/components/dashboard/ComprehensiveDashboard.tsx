import React from "react";
import { 
  TrendingUp, 
  DollarSign, 
  PiggyBank, 
  CreditCard, 
  Target, 
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatters";
import { useNavigate } from "react-router-dom";
import { useDashboardData } from "@/hooks/useDashboardData";
import { AssetAllocationChart } from "./AssetAllocationChart";

interface MetricCardProps {
  title: string;
  value: string;
  change?: number;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  onClick?: () => void;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon, trend = "neutral", onClick }) => {
  const getTrendColor = () => {
    switch (trend) {
      case "up": return "text-emerald-500";
      case "down": return "text-red-500";
      default: return "text-muted-foreground";
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up": return <ArrowUpRight className="h-4 w-4" />;
      case "down": return <ArrowDownRight className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <Card className="hover-scale cursor-pointer transition-all hover:shadow-lg" onClick={onClick}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              {icon}
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-2xl font-bold">{value}</p>
            </div>
          </div>
          {change !== undefined && (
            <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
              {getTrendIcon()}
              <span className="text-sm font-medium">{Math.abs(change)}%</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface GoalProgressCardProps {
  title: string;
  current: number;
  target: number;
  deadline: string;
  status: "on_track" | "behind" | "completed";
}

const GoalProgressCard: React.FC<GoalProgressCardProps> = ({ title, current, target, deadline, status }) => {
  const progress = Math.min((current / target) * 100, 100);
  
  const getStatusConfig = () => {
    switch (status) {
      case "completed":
        return { color: "bg-emerald-500", icon: <CheckCircle className="h-4 w-4" />, text: "Completed" };
      case "on_track":
        return { color: "bg-blue-500", icon: <Clock className="h-4 w-4" />, text: "On Track" };
      case "behind":
        return { color: "bg-amber-500", icon: <AlertCircle className="h-4 w-4" />, text: "Behind" };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">{title}</h3>
          <Badge variant="secondary" className="flex items-center space-x-1">
            {statusConfig.icon}
            <span>{statusConfig.text}</span>
          </Badge>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>{formatCurrency(current)}</span>
            <span className="text-muted-foreground">{formatCurrency(target)}</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{progress.toFixed(1)}% complete</span>
            <span>Due: {deadline}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const ComprehensiveDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { metrics, assetBreakdown, loading } = useDashboardData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3">Loading dashboard...</span>
      </div>
    );
  }

  const sampleGoals = [
    {
      title: "Emergency Fund",
      current: 85000,
      target: 100000,
      deadline: "Dec 2024",
      status: "on_track" as const
    },
    {
      title: "Retirement Savings",
      current: 450000,
      target: 500000,
      deadline: "Dec 2025",
      status: "behind" as const
    },
    {
      title: "Home Down Payment",
      current: 120000,
      target: 120000,
      deadline: "Completed",
      status: "completed" as const
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Financial Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Your comprehensive financial overview and progress tracking
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => navigate('/goals')}>
            <Target className="h-4 w-4 mr-2" />
            View Goals
          </Button>
          <Button onClick={() => navigate('/accounts-tab')}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Manage Accounts
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Net Worth"
          value={formatCurrency(metrics.netWorth)}
          change={metrics.netWorthGrowth}
          trend={metrics.netWorthGrowth > 0 ? "up" : metrics.netWorthGrowth < 0 ? "down" : "neutral"}
          icon={<DollarSign className="h-5 w-5 text-primary" />}
          onClick={() => navigate('/accounts-tab')}
        />
        <MetricCard
          title="Total Assets"
          value={formatCurrency(metrics.totalAssets)}
          change={metrics.assetGrowth}
          trend={metrics.assetGrowth > 0 ? "up" : "down"}
          icon={<TrendingUp className="h-5 w-5 text-emerald-500" />}
          onClick={() => navigate('/accounts-tab')}
        />
        <MetricCard
          title="Monthly Savings"
          value={formatCurrency(12500)}
          change={8.3}
          trend="up"
          icon={<PiggyBank className="h-5 w-5 text-blue-500" />}
        />
        <MetricCard
          title="Total Liabilities"
          value={formatCurrency(metrics.totalLiabilities)}
          change={metrics.liabilityGrowth}
          trend={metrics.liabilityGrowth < 0 ? "up" : "down"}
          icon={<CreditCard className="h-5 w-5 text-amber-500" />}
        />
      </div>

      {/* Charts and Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Allocation Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Asset Allocation</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AssetAllocationChart 
              realEstate={assetBreakdown.realEstate}
              vehicles={assetBreakdown.vehicles}
              investments={assetBreakdown.investments}
              cash={assetBreakdown.cash}
              retirement={assetBreakdown.retirement}
              collectibles={assetBreakdown.collectibles}
              digital={assetBreakdown.digital}
              other={assetBreakdown.other}
              totalValue={metrics.totalAssets}
            />
          </CardContent>
        </Card>

        {/* Monthly Cash Flow */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Monthly Cash Flow</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Income</span>
                <span className="font-semibold text-emerald-500">+{formatCurrency(18500)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Expenses</span>
                <span className="font-semibold text-red-500">-{formatCurrency(6000)}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Net Cash Flow</span>
                  <span className="font-bold text-lg text-emerald-500">+{formatCurrency(12500)}</span>
                </div>
              </div>
              <Progress value={67.6} className="h-2" />
              <p className="text-sm text-muted-foreground">67.6% savings rate this month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals Progress Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Goal Progress</h2>
          <Button variant="outline" onClick={() => navigate('/goals')}>
            <Target className="h-4 w-4 mr-2" />
            View All Goals
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleGoals.map((goal, index) => (
            <GoalProgressCard key={index} {...goal} />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto p-4 flex-col space-y-2" onClick={() => navigate('/goals/create')}>
              <Target className="h-6 w-6" />
              <span>Create Goal</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col space-y-2" onClick={() => navigate('/accounts-tab')}>
              <PiggyBank className="h-6 w-6" />
              <span>Add Account</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
              <Calendar className="h-6 w-6" />
              <span>Schedule Review</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col space-y-2" onClick={() => navigate('/education-tab')}>
              <BarChart3 className="h-6 w-6" />
              <span>Learn More</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};