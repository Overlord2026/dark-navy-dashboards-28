
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, ArrowRightLeft, Banknote, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { FundingAccount } from "@/hooks/useAccountManagement";

interface FundingAccountsOverviewProps {
  accounts: FundingAccount[];
  onManageFunding: () => void;
}

export function FundingAccountsOverview({ accounts, onManageFunding }: FundingAccountsOverviewProps) {
  if (accounts.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Wallet className="mr-2 h-5 w-5 text-primary" />
            Funding Accounts
          </div>
          <span className="text-lg font-medium">$0.00</span>
        </CardTitle>
        <CardDescription>Connected funding accounts for transfers and payments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex gap-2 mb-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/cash-management?tab=funding">
                <ArrowRightLeft className="mr-2 h-4 w-4" />
                Transfers
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={onManageFunding}>
              Edit Accounts
            </Button>
          </div>
          
          <div className="space-y-2">
            {accounts.map(account => (
              <div key={account.id} className="flex justify-between items-center p-3 border rounded-lg bg-muted/50">
                <div className="flex items-center">
                  <div className="p-1.5 bg-primary/10 rounded-full mr-3">
                    {account.type === 'checking' ? 
                      <Banknote className="h-4 w-4 text-primary" /> : 
                      <Wallet className="h-4 w-4 text-primary" />
                    }
                  </div>
                  <span className="font-medium">{account.name}</span>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onManageFunding}>
                  <PlusCircle className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
