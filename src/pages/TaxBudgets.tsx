
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";

const TaxBudgets = () => {
  return (
    <ThreeColumnLayout activeMainItem="tax-budgets" title="Tax Budgets">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-semibold mb-6">Tax Budgets</h1>
        <div className="dashboard-card p-6">
          <p>Your tax and budget information will appear here.</p>
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default TaxBudgets;
