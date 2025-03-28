
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";

const TaxBudgets = () => {
  return (
    <ThreeColumnLayout activeMainItem="tax-budgets" title="Proactive Tax Planning">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-semibold mb-6">Proactive Tax Planning</h1>
        <div className="dashboard-card p-6">
          <p>Your tax planning information will appear here.</p>
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default TaxBudgets;
