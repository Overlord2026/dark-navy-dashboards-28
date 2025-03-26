
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from "lucide-react";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { Progress } from "@/components/ui/progress";

export const FinancialOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <DashboardCard
        title="Revenue"
        className="xl:col-span-1"
        icon={<ArrowTrendingUpIcon className="h-5 w-5" />}
        footer={
          <div className="flex items-center justify-between text-sm">
            <span>Monthly Goal</span>
            <span className="font-medium text-green-400">$124,000</span>
          </div>
        }
      >
        <div className="text-3xl font-semibold mb-1">$97,843</div>
        <div className="flex items-center text-sm mb-4">
          <span className="text-green-400 flex items-center mr-2">
            <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
            8.2%
          </span>
          <span className="text-muted-foreground">vs last month</span>
        </div>
        <Progress value={78} className="h-2 bg-muted" />
      </DashboardCard>

      <DashboardCard
        title="Expenses"
        className="xl:col-span-1"
        icon={<ArrowTrendingDownIcon className="h-5 w-5" />}
        footer={
          <div className="flex items-center justify-between text-sm">
            <span>Monthly Budget</span>
            <span className="font-medium text-amber-400">$85,000</span>
          </div>
        }
      >
        <div className="text-3xl font-semibold mb-1">$64,973</div>
        <div className="flex items-center text-sm mb-4">
          <span className="text-amber-400 flex items-center mr-2">
            <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
            3.7%
          </span>
          <span className="text-muted-foreground">vs last month</span>
        </div>
        <Progress value={76} className="h-2 bg-muted" />
      </DashboardCard>

      <DashboardCard
        title="Cash Flow"
        className="xl:col-span-1"
        icon={<ArrowTrendingUpIcon className="h-5 w-5" />}
        footer={
          <div className="flex items-center justify-between text-sm">
            <span>Quarterly Avg</span>
            <span className="font-medium text-blue-400">$29,750</span>
          </div>
        }
      >
        <div className="text-3xl font-semibold mb-1">$32,870</div>
        <div className="flex items-center text-sm mb-4">
          <span className="text-green-400 flex items-center mr-2">
            <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
            12.5%
          </span>
          <span className="text-muted-foreground">vs last quarter</span>
        </div>
        <Progress value={82} className="h-2 bg-muted" />
      </DashboardCard>

      <DashboardCard
        title="Profit Margin"
        className="xl:col-span-1"
        icon={<ArrowTrendingUpIcon className="h-5 w-5" />}
        footer={
          <div className="flex items-center justify-between text-sm">
            <span>Target</span>
            <span className="font-medium text-purple-400">35%</span>
          </div>
        }
      >
        <div className="text-3xl font-semibold mb-1">33.4%</div>
        <div className="flex items-center text-sm mb-4">
          <span className="text-green-400 flex items-center mr-2">
            <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
            2.3%
          </span>
          <span className="text-muted-foreground">vs last month</span>
        </div>
        <Progress value={75} className="h-2 bg-muted" />
      </DashboardCard>
    </div>
  );
};
