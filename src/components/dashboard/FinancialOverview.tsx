
import { TrendingUp, TrendingDown } from "lucide-react";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { Progress } from "@/components/ui/progress";

interface FinancialOverviewProps {
  showBusinessMetrics?: boolean;
}

export const FinancialOverview = ({ showBusinessMetrics = false }: FinancialOverviewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <DashboardCard
        title={showBusinessMetrics ? "Revenue" : "Income"}
        className="xl:col-span-1"
        icon={<TrendingUp className="h-5 w-5" />}
        footer={
          <div className="flex items-center justify-between text-sm">
            <span>Monthly Goal</span>
            <span className="font-medium text-green-400">
              {showBusinessMetrics ? "$124,000" : "$12,500"}
            </span>
          </div>
        }
      >
        <div className="text-3xl font-semibold mb-1">
          {showBusinessMetrics ? "$97,843" : "$9,650"}
        </div>
        <div className="flex items-center text-sm mb-3">
          <span className="text-green-400 flex items-center mr-2">
            <TrendingUp className="h-3 w-3 mr-1" />
            {showBusinessMetrics ? "8.2%" : "4.5%"}
          </span>
          <span className="text-muted-foreground">vs last month</span>
        </div>
        <Progress value={showBusinessMetrics ? 78 : 77} className="h-2 bg-muted" />
      </DashboardCard>

      <DashboardCard
        title="Expenses"
        className="xl:col-span-1"
        icon={<TrendingDown className="h-5 w-5" />}
        footer={
          <div className="flex items-center justify-between text-sm">
            <span>Monthly Budget</span>
            <span className="font-medium text-amber-400">
              {showBusinessMetrics ? "$85,000" : "$8,500"}
            </span>
          </div>
        }
      >
        <div className="text-3xl font-semibold mb-1">
          {showBusinessMetrics ? "$64,973" : "$6,473"}
        </div>
        <div className="flex items-center text-sm mb-3">
          <span className="text-amber-400 flex items-center mr-2">
            <TrendingUp className="h-3 w-3 mr-1" />
            {showBusinessMetrics ? "3.7%" : "2.9%"}
          </span>
          <span className="text-muted-foreground">vs last month</span>
        </div>
        <Progress value={showBusinessMetrics ? 76 : 76} className="h-2 bg-muted" />
      </DashboardCard>

      <DashboardCard
        title="Cash Flow"
        className="xl:col-span-1"
        icon={<TrendingUp className="h-5 w-5" />}
        footer={
          <div className="flex items-center justify-between text-sm">
            <span>Quarterly Avg</span>
            <span className="font-medium text-blue-400">
              {showBusinessMetrics ? "$29,750" : "$3,075"}
            </span>
          </div>
        }
      >
        <div className="text-3xl font-semibold mb-1">
          {showBusinessMetrics ? "$32,870" : "$3,177"}
        </div>
        <div className="flex items-center text-sm mb-3">
          <span className="text-green-400 flex items-center mr-2">
            <TrendingUp className="h-3 w-3 mr-1" />
            {showBusinessMetrics ? "12.5%" : "5.8%"}
          </span>
          <span className="text-muted-foreground">vs last quarter</span>
        </div>
        <Progress value={showBusinessMetrics ? 82 : 78} className="h-2 bg-muted" />
      </DashboardCard>

      <DashboardCard
        title={showBusinessMetrics ? "Profit Margin" : "Savings Rate"}
        className="xl:col-span-1"
        icon={<TrendingUp className="h-5 w-5" />}
        footer={
          <div className="flex items-center justify-between text-sm">
            <span>Target</span>
            <span className="font-medium text-purple-400">
              {showBusinessMetrics ? "35%" : "20%"}
            </span>
          </div>
        }
      >
        <div className="text-3xl font-semibold mb-1">
          {showBusinessMetrics ? "33.4%" : "18.5%"}
        </div>
        <div className="flex items-center text-sm mb-3">
          <span className="text-green-400 flex items-center mr-2">
            <TrendingUp className="h-3 w-3 mr-1" />
            {showBusinessMetrics ? "2.3%" : "1.2%"}
          </span>
          <span className="text-muted-foreground">vs last month</span>
        </div>
        <Progress value={showBusinessMetrics ? 75 : 80} className="h-2 bg-muted" />
      </DashboardCard>
    </div>
  );
};
