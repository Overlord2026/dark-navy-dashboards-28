import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { usePublicStocks } from "@/hooks/usePublicStocks";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export const PublicStocksList = () => {
  const { stocks, loading, deleteStock } = usePublicStocks();
  const isMobile = useIsMobile();

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this public stock?')) {
      await deleteStock(id);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="text-sm text-muted-foreground">Loading public stocks...</div>
      </div>
    );
  }

  if (stocks.length === 0) {
    return (
      <div className="text-center py-4">
        <p className={cn(
          "text-muted-foreground",
          isMobile ? "text-sm" : "text-base"
        )}>
          No public stocks added yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {stocks.map((stock) => (
        <div
          key={stock.id}
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
              {stock.company_name} ({stock.ticker_symbol})
            </div>
            <div className={cn(
              "text-muted-foreground",
              isMobile ? "text-xs" : "text-sm"
            )}>
              {stock.number_of_shares} shares @ {formatCurrency(stock.price_per_share)}
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
              {formatCurrency(stock.total_value)}
            </span>
            
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size={isMobile ? "sm" : "default"}
                className={cn(
                  "p-2",
                  isMobile ? "h-8 w-8" : "h-9 w-9"
                )}
                onClick={() => handleDelete(stock.id)}
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