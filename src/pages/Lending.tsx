
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";

const Lending = () => {
  return (
    <ThreeColumnLayout activeMainItem="lending" title="Lending">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-semibold mb-6">Lending</h1>
        <div className="dashboard-card p-6">
          <p>Your lending information will appear here.</p>
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default Lending;
