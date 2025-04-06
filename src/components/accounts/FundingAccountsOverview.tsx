
import { Button } from "@/components/ui/button";
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
    <div className="p-4 border rounded-lg shadow-sm bg-slate-50 dark:bg-slate-900">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium flex items-center">
          <Wallet className="mr-2 h-5 w-5 text-primary" />
          Funding Accounts
        </h3>
        <div className="space-x-2">
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
      </div>
      
      <div className="space-y-2">
        {accounts.map(account => (
          <div key={account.id} className="flex justify-between items-center p-2 border rounded bg-card">
            <div className="flex items-center">
              <div className="p-1.5 bg-primary/10 rounded-full mr-3">
                {account.type === 'checking' ? 
                  <Banknote className="h-4 w-4 text-primary" /> : 
                  <Wallet className="h-4 w-4 text-primary" />
                }
              </div>
              <span>{account.name}</span>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onManageFunding}>
              <PlusCircle className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
