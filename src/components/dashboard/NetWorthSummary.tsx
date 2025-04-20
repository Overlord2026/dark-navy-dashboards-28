import React, { ReactNode } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { useNetWorth } from "@/contexts/NetWorthContext";
import { useUser } from "@/contexts/UserContext";

interface NetWorthSummaryProps {
  children?: ReactNode;
}

export const NetWorthSummary: React.FC<NetWorthSummaryProps> = ({ children }) => {
  const { totalAssetValue, totalLiabilityValue } = useNetWorth();
  const { userProfile } = useUser();

  const netWorth = totalAssetValue - totalLiabilityValue;

  return (
    <Card className="bg-[#0a1021] text-white border-none shadow-xl">
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Net Worth</h2>
          <Button variant="secondary" size="sm">
            View Report <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="mt-4">
          <div className="text-3xl font-bold tracking-tight">${netWorth.toLocaleString()}</div>
          <p className="text-sm text-muted-foreground">
            As of today
          </p>
        </div>
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Total Assets</span>
            <span className="font-medium text-sm">${totalAssetValue.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Total Liabilities</span>
            <span className="font-medium text-sm">${totalLiabilityValue.toLocaleString()}</span>
          </div>
        </div>
        {children}
      </div>
    </Card>
  );
};
