
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link2, Building2 } from "lucide-react";
import { FundingAccount } from "@/hooks/useAccountManagement";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface FundingAccountsOverviewProps {
  accounts: FundingAccount[];
  onManageFunding: () => void;
}

export const FundingAccountsOverview = ({ 
  accounts, 
  onManageFunding 
}: FundingAccountsOverviewProps) => {
  const isMobile = useIsMobile();

  return (
    <Card>
      <CardHeader className={cn(
        isMobile ? "p-4" : "p-6"
      )}>
        <div className={cn(
          "flex items-center justify-between",
          isMobile ? "flex-col gap-3 items-start" : "flex-row"
        )}>
          <div>
            <CardTitle className={cn(
              "flex items-center gap-2",
              isMobile ? "text-lg" : "text-xl"
            )}>
              <Building2 className={cn(
                "text-primary",
                isMobile ? "h-4 w-4" : "h-5 w-5"
              )} />
              Funding Accounts
            </CardTitle>
            <CardDescription className={cn(
              "mt-1",
              isMobile ? "text-xs" : "text-sm"
            )}>
              Bank accounts used for transfers and payments
            </CardDescription>
          </div>
          <Button 
            onClick={onManageFunding}
            variant="outline"
            className={cn(
              isMobile ? "w-full text-sm" : ""
            )}
          >
            <Link2 className={cn("mr-2", isMobile ? "h-3 w-3" : "h-4 w-4")} />
            Manage Funding
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className={cn(
        "border-t",
        isMobile ? "p-4" : "p-6"
      )}>
        {accounts.length > 0 ? (
          <div className={cn(
            "grid gap-3",
            isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
          )}>
            {accounts.map((account) => (
              <div 
                key={account.id}
                className={cn(
                  "p-3 rounded-lg border bg-muted/30",
                  isMobile ? "p-3" : "p-4"
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={cn(
                      "font-medium",
                      isMobile ? "text-sm" : ""
                    )}>{account.name}</p>
                    <p className={cn(
                      "text-muted-foreground capitalize",
                      isMobile ? "text-xs" : "text-sm"
                    )}>{account.type}</p>
                  </div>
                  <div className={cn(
                    "w-2 h-2 bg-green-500 rounded-full",
                    isMobile ? "w-1.5 h-1.5" : ""
                  )} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={cn(
            "text-center py-8",
            isMobile ? "py-6" : ""
          )}>
            <p className={cn(
              "text-muted-foreground mb-4",
              isMobile ? "text-sm" : ""
            )}>
              No funding accounts configured. Add one to enable transfers and payments.
            </p>
            <Button 
              onClick={onManageFunding}
              className={cn(
                isMobile ? "w-full text-sm" : ""
              )}
            >
              <Link2 className={cn("mr-2", isMobile ? "h-3 w-3" : "h-4 w-4")} />
              Add Funding Account
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
