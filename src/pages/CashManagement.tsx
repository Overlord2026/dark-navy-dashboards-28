
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";

const CashManagement = () => {
  return (
    <ThreeColumnLayout activeMainItem="cash-management" title="Cash Management">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-semibold mb-6">Cash Management</h1>
        <div className="dashboard-card p-6">
          <p>Your cash management information will appear here.</p>
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default CashManagement;
