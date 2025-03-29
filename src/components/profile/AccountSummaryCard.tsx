
import { DashboardCard } from "@/components/ui/DashboardCard";

export const AccountSummaryCard = () => {
  return (
    <DashboardCard title="Account Summary" className="min-h-[300px]">
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground text-center">
          No Account Summary<br />
          <span className="text-sm">Complete the setup checklist to connect a BFO managed account.</span>
        </p>
      </div>
    </DashboardCard>
  );
};
