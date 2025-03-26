
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";

const Insurance = () => {
  return (
    <ThreeColumnLayout activeMainItem="insurance" title="Insurance">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-semibold mb-6">Insurance</h1>
        <div className="dashboard-card p-6">
          <p>Your insurance policies will appear here.</p>
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default Insurance;
