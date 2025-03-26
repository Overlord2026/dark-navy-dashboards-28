
import { DollarSignIcon, TrendingUpIcon, TrendingDownIcon, AlertCircleIcon } from "lucide-react";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { Progress } from "@/components/ui/progress";

export const FinancialOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      <DashboardCard
        title="Total Revenue"
        icon={<DollarSignIcon className="h-5 w-5" />}
      >
        <div className="flex flex-col">
          <div className="text-2xl font-semibold text-white">$1,243,890</div>
          <div className="flex items-center text-sm mt-1">
            <TrendingUpIcon className="h-4 w-4 mr-1 text-green-500" />
            <span className="text-green-500">+12.5%</span>
            <span className="text-muted-foreground ml-1">from last month</span>
          </div>
        </div>
      </DashboardCard>

      <DashboardCard
        title="Expenses"
        icon={<DollarSignIcon className="h-5 w-5" />}
      >
        <div className="flex flex-col">
          <div className="text-2xl font-semibold text-white">$567,324</div>
          <div className="flex items-center text-sm mt-1">
            <TrendingUpIcon className="h-4 w-4 mr-1 text-amber-500" />
            <span className="text-amber-500">+7.2%</span>
            <span className="text-muted-foreground ml-1">from last month</span>
          </div>
        </div>
      </DashboardCard>

      <DashboardCard
        title="Net Profit"
        icon={<DollarSignIcon className="h-5 w-5" />}
      >
        <div className="flex flex-col">
          <div className="text-2xl font-semibold text-white">$676,566</div>
          <div className="flex items-center text-sm mt-1">
            <TrendingUpIcon className="h-4 w-4 mr-1 text-green-500" />
            <span className="text-green-500">+18.3%</span>
            <span className="text-muted-foreground ml-1">from last month</span>
          </div>
        </div>
      </DashboardCard>

      <DashboardCard
        title="Cash Flow"
        icon={<DollarSignIcon className="h-5 w-5" />}
      >
        <div className="flex flex-col">
          <div className="text-2xl font-semibold text-white">$325,478</div>
          <div className="flex items-center text-sm mt-1">
            <TrendingDownIcon className="h-4 w-4 mr-1 text-red-500" />
            <span className="text-red-500">-3.6%</span>
            <span className="text-muted-foreground ml-1">from last month</span>
          </div>
        </div>
      </DashboardCard>

      <DashboardCard
        title="Budget Utilization"
        className="md:col-span-2"
        icon={<AlertCircleIcon className="h-5 w-5" />}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Marketing</span>
              <span className="text-sm font-medium">78%</span>
            </div>
            <Progress value={78} className="h-2" indicatorClassName="bg-blue-500" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Operations</span>
              <span className="text-sm font-medium">92%</span>
            </div>
            <Progress value={92} className="h-2" indicatorClassName="bg-amber-500" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Product Development</span>
              <span className="text-sm font-medium">45%</span>
            </div>
            <Progress value={45} className="h-2" indicatorClassName="bg-green-500" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Research</span>
              <span className="text-sm font-medium">67%</span>
            </div>
            <Progress value={67} className="h-2" indicatorClassName="bg-purple-500" />
          </div>
        </div>
      </DashboardCard>

      <DashboardCard
        title="Performance Metrics"
        className="md:col-span-2"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">ROI</p>
            <p className="text-xl font-medium text-white">24.8%</p>
            <div className="flex items-center text-xs">
              <TrendingUpIcon className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500">+2.1%</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Profit Margin</p>
            <p className="text-xl font-medium text-white">18.2%</p>
            <div className="flex items-center text-xs">
              <TrendingUpIcon className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500">+0.8%</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Burn Rate</p>
            <p className="text-xl font-medium text-white">$82k/mo</p>
            <div className="flex items-center text-xs">
              <TrendingDownIcon className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500">-5.3%</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">CAC</p>
            <p className="text-xl font-medium text-white">$342</p>
            <div className="flex items-center text-xs">
              <TrendingDownIcon className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500">-12.5%</span>
            </div>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
};
