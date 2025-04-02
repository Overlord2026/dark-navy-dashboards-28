
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { FinancialOverview } from "@/components/dashboard/FinancialOverview";
import { NetWorthSummary } from "@/components/dashboard/NetWorthSummary";
import { ExpenseOptimizationCard } from "@/components/dashboard/ExpenseOptimizationCard";
import { TaxPlanningSummary } from "@/components/dashboard/TaxPlanningSummary";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { UpcomingBillsCard } from "@/components/dashboard/UpcomingBillsCard";
import { AdminActions } from "@/components/dashboard/AdminActions";
import { useUser } from "@/context/UserContext";

export default function Dashboard() {
  const { userProfile } = useUser();
  const isAdmin = userProfile?.role === "admin" || userProfile?.role === "system_administrator";

  return (
    <ThreeColumnLayout title="Dashboard">
      <div className="space-y-4 px-4 py-2 max-w-7xl mx-auto">
        {isAdmin && (
          <div className="mt-1">
            <AdminActions />
          </div>
        )}
        
        <div id="financial-overview-section">
          <FinancialOverview />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <NetWorthSummary />
          <div className="space-y-5">
            <ExpenseOptimizationCard />
            <TaxPlanningSummary />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <RecentActivity />
          <UpcomingBillsCard />
        </div>
      </div>
    </ThreeColumnLayout>
  );
}
