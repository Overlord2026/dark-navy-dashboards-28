
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";

const Transfers = () => {
  return (
    <ThreeColumnLayout activeMainItem="transfers" title="Transfers">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-semibold mb-6">Transfers</h1>
        <div className="dashboard-card p-6">
          <p>Your transfer information will appear here.</p>
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default Transfers;
