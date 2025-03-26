
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";

const Investments = () => {
  return (
    <ThreeColumnLayout activeMainItem="investments" title="Investments">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-semibold mb-6">Investments</h1>
        <div className="dashboard-card p-6">
          <p>Your investments will appear here.</p>
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default Investments;
