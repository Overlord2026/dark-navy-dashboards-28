
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";

const FinancialPlans = () => {
  return (
    <ThreeColumnLayout activeMainItem="financial-plans" title="Financial Plans">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-semibold mb-6">Financial Plans</h1>
        <div className="dashboard-card p-6">
          <p>Your financial plans will appear here.</p>
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default FinancialPlans;
