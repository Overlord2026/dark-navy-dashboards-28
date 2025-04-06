
import { Button } from "@/components/ui/button";
import { Wallet, PlusCircle } from "lucide-react";

interface AccountsHeaderProps {
  onAddAccount: () => void;
  onManageFunding: () => void;
}

export function AccountsHeader({ onAddAccount, onManageFunding }: AccountsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Accounts</h1>
        <p className="text-muted-foreground">Manage all your financial accounts in one place</p>
      </div>
      <div className="space-x-3">
        <Button onClick={onManageFunding} variant="outline">
          <Wallet className="mr-2 h-4 w-4" />
          Manage Funding
        </Button>
        <Button onClick={onAddAccount}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Account
        </Button>
      </div>
    </div>
  );
}
