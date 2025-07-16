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
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-foreground">Account Setup Progress</h3>
          <p className="text-base text-foreground font-medium">
            You've added {completedAccounts.length} of {totalAccounts} account types
          </p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-foreground">{completionPercentage}%</div>
          <div className="text-base text-foreground font-medium">Complete</div>
        </div>
      </div>

      <Progress value={completionPercentage} className="h-4" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allAccountTypes.map((accountType) => {
          const isCompleted = completedAccounts.includes(accountType);
          const displayName = accountTypeNames[accountType as keyof typeof accountTypeNames];
          
          return (
            <div
              key={accountType}
              className={cn(
                "flex items-center gap-3 p-4 rounded-lg border-2 transition-all duration-200",
                isCompleted
                  ? "bg-success/20 border-success text-success-foreground"
                  : "bg-card border-border text-foreground"
              )}
            >
              {isCompleted ? (
                <CheckCircle className="h-6 w-6 text-success" />
              ) : (
                <Circle className="h-6 w-6 text-muted-foreground" />
              )}
              <span className="text-base font-semibold">{displayName}</span>
            </div>
          );
        })}
      </div>

      {completedAccounts.length < totalAccounts && (
        <div className="flex items-start gap-3 p-6 bg-card border-2 border-warning rounded-lg">
          <Info className="h-6 w-6 text-warning mt-1 flex-shrink-0" />
          <div className="text-base text-foreground">
            <p className="font-bold mb-2">Complete your financial picture</p>
            <p className="leading-relaxed">
              Adding more account types gives you a comprehensive view of your wealth and 
              enables advanced features like bill pay and expense optimization.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}