import React from "react";
import { CheckCircle, Circle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface AccountProgressProps {
  completedAccounts: string[];
  totalAccounts: number;
  className?: string;
}

export function AccountProgress({ 
  completedAccounts, 
  totalAccounts, 
  className 
}: AccountProgressProps) {
  const completionPercentage = Math.round((completedAccounts.length / totalAccounts) * 100);
  
  const accountTypeNames = {
    "bank": "Bank Accounts",
    "credit-card": "Credit Cards",
    "investment": "Investment Accounts",
    "retirement-plan": "Retirement Plans",
    "public-stock": "Public Stock",
    "private-equity": "Private Equity",
    "digital-assets": "Digital Assets",
    "property": "Real Estate",
    "other-assets": "Other Assets",
    "liability": "Liabilities"
  };

  const allAccountTypes = Object.keys(accountTypeNames);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Account Setup Progress</h3>
          <p className="text-sm text-muted-foreground">
            You've added {completedAccounts.length} of {totalAccounts} account types
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">{completionPercentage}%</div>
          <div className="text-xs text-muted-foreground">Complete</div>
        </div>
      </div>

      <Progress value={completionPercentage} className="h-2" />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {allAccountTypes.map((accountType) => {
          const isCompleted = completedAccounts.includes(accountType);
          const displayName = accountTypeNames[accountType as keyof typeof accountTypeNames];
          
          return (
            <div
              key={accountType}
              className={cn(
                "flex items-center gap-2 p-2 rounded-lg border transition-all duration-200",
                isCompleted
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-muted/50 border-border text-muted-foreground"
              )}
            >
              {isCompleted ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <Circle className="h-4 w-4" />
              )}
              <span className="text-xs font-medium truncate">{displayName}</span>
            </div>
          );
        })}
      </div>

      {completedAccounts.length < totalAccounts && (
        <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">Complete your financial picture</p>
            <p>
              Adding more account types gives you a comprehensive view of your wealth and 
              enables advanced features like bill pay and expense optimization.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}