import { DashboardMetricsCards } from "@/components/dashboard/DashboardMetricsCards";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { AssetAllocationChart } from "@/components/dashboard/AssetAllocationChart";
import { NetWorthSummary } from "@/components/dashboard/NetWorthSummary";
import { TaxPlanningSummary } from "@/components/dashboard/TaxPlanningSummary";
import { FinancialOverview } from "@/components/dashboard/FinancialOverview";
import { QuickActionsMenu } from "@/components/dashboard/QuickActionsMenu";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";

export default function Dashboard() {
  return (
    <ThreeColumnLayout activeMainItem="dashboard">
      <div className="container mx-auto p-6 space-y-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl lg:text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground text-sm lg:text-base">
              Welcome back! Here's an overview of your portfolio.
            </p>
          </div>
          <QuickActionsMenu />
        </div>

        <DashboardMetricsCards />

        <div className="grid gap-6 lg:grid-cols-7">
          <div className="lg:col-span-4 space-y-6">
            <FinancialOverview />
            <AssetAllocationChart />
          </div>
          
          <div className="lg:col-span-3 space-y-6">
            <NetWorthSummary />
            <TaxPlanningSummary />
            <RecentActivity />
          </div>
        </div>
      </div>
    </ThreeColumnLayout>
  );
}
