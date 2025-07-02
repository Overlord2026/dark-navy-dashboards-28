
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { usePrivateEquityAccounts } from "@/hooks/usePrivateEquityAccounts";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export const PrivateEquityAccountsList = () => {
  const { accounts, loading, deleteAccount } = usePrivateEquityAccounts();
  const isMobile = useIsMobile();

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this private equity account?')) {
      await deleteAccount(id);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatOwnership = (percentage?: number) => {
    if (!percentage) return 'N/A';
    return `${percentage}%`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="text-sm text-muted-foreground">Loading private equity accounts...</div>
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="text-center py-4">
        <p className={cn(
          "text-muted-foreground",
          isMobile ? "text-sm" : "text-base"
        )}>
          No private equity accounts added yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {accounts.map((account) => (
        <div
          key={account.id}
          className={cn(
            "flex items-center justify-between p-3 border rounded-lg",
            isMobile ? "flex-col gap-2" : "flex-row"
          )}
        >
          <div className={cn(
            "flex-1",
            isMobile ? "w-full text-center" : "text-left"
          )}>
            <div className={cn(
              "font-medium",
              isMobile ? "text-sm" : "text-base"
            )}>
              {account.entity_name}
            </div>
            <div className={cn(
              "text-muted-foreground",
              isMobile ? "text-xs" : "text-sm"
            )}>
              {account.entity_type} • Ownership: {formatOwnership(account.ownership_percentage)}
            </div>
          </div>
          
          <div className={cn(
            "flex items-center gap-2",
            isMobile ? "w-full justify-between" : "justify-end"
          )}>
            <span className={cn(
              "font-semibold",
              isMobile ? "text-sm" : "text-base"
            )}>
              {formatCurrency(account.valuation)}
            </span>
            
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size={isMobile ? "sm" : "default"}
                className={cn(
                  "p-2",
                  isMobile ? "h-8 w-8" : "h-9 w-9"
                )}
                onClick={() => handleDelete(account.id)}
              >
                <Trash2 className={cn(
                  isMobile ? "h-3 w-3" : "h-4 w-4"
                )} />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
