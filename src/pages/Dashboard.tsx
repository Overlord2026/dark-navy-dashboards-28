
import { DashboardMetricsCards } from "@/components/dashboard/DashboardMetricsCards";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { AssetAllocationChart } from "@/components/dashboard/AssetAllocationChart";
import { NetWorthSummary } from "@/components/dashboard/NetWorthSummary";
import { TaxPlanningSummary } from "@/components/dashboard/TaxPlanningSummary";
import { FinancialOverview } from "@/components/dashboard/FinancialOverview";
import { QuickActionsMenu } from "@/components/dashboard/QuickActionsMenu";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { useDashboardData } from "@/hooks/useDashboardData";

export default function Dashboard() {
  const { metrics, assetBreakdown, loading } = useDashboardData();

  if (loading) {
    return (
      <ThreeColumnLayout activeMainItem="dashboard">
        <div className="container mx-auto p-6 space-y-6 max-w-7xl">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3">Loading dashboard...</span>
          </div>
        </div>
      </ThreeColumnLayout>
    );
  }

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
