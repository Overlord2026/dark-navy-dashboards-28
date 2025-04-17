
import { DashboardMetricCard } from "./DashboardMetricCard";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";

interface FinancialOverviewProps {
  showBusinessMetrics?: boolean;
}

export const FinancialOverview = ({ showBusinessMetrics = false }: FinancialOverviewProps) => {
  const { metrics, updateMetric, updateTarget } = useDashboardMetrics();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <DashboardMetricCard
        metric={metrics.income}
        onUpdate={(value) => updateMetric('income', value)}
        onTargetUpdate={(target) => updateTarget('income', target)}
      />
      
      <DashboardMetricCard
        metric={metrics.expenses}
        onUpdate={(value) => updateMetric('expenses', value)}
        onTargetUpdate={(target) => updateTarget('expenses', target)}
      />
      
      <DashboardMetricCard
        metric={metrics.cashFlow}
        onUpdate={(value) => updateMetric('cashFlow', value)}
        onTargetUpdate={(target) => updateTarget('cashFlow', target)}
      />
      
      <DashboardMetricCard
        metric={metrics.savingsRate}
        onUpdate={(value) => updateMetric('savingsRate', value)}
        onTargetUpdate={(target) => updateTarget('savingsRate', target)}
      />
    </div>
  );
};
