
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/context/ThemeContext";

interface AddAccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAccount: (accountData: AccountData) => void;
  accountType: string;
  sectionType: string;
}

export interface AccountData {
  id: string;
  name: string;
  accountNumber: string;
  balance: string;
  type: string;
  section: string;
  transactions?: Array<{
    date: string;
    description: string;
    amount: number;
    type: string;
  }>;
}

export function AddAccountDialog({ 
  isOpen, 
  onClose, 
  onAddAccount, 
  accountType,
  sectionType
}: AddAccountDialogProps) {
  const { toast } = useToast();
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  
  const [accountData, setAccountData] = useState<Omit<AccountData, "id">>({
    name: "",
    accountNumber: "",
    balance: "0.00",
    type: accountType,
    section: sectionType,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccountData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accountData.name.trim()) {
      toast({
        title: "Error",
        description: "Account name is required",
        variant: "destructive"
      });
      return;
    }

    // Generate a unique ID and add the account
    const newAccount: AccountData = {
      ...accountData,
      id: `account-${Date.now()}`,
      balance: accountData.balance || "0.00"
    };

    onAddAccount(newAccount);
    
    // Reset form and close dialog
    setAccountData({
      name: "",
      accountNumber: "",
      balance: "0.00",
      type: accountType,
      section: sectionType,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`sm:max-w-[425px] ${
        isLightTheme
          ? "bg-[#F9F7E8] text-[#222222] border-[#DCD8C0]"
          : "bg-[#121a2c] text-white border-gray-800"
      }`}>
        <DialogHeader>
          <DialogTitle>Add {accountType}</DialogTitle>
          <DialogDescription className={isLightTheme ? "text-[#666666]" : "text-gray-400"}>
            Enter the details for your new {accountType.toLowerCase()} account.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Account Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter account name"
                value={accountData.name}
                onChange={handleInputChange}
                className={`${
                  isLightTheme
                    ? "bg-[#E9E7D8] border-[#DCD8C0] text-[#222222]"
                    : "bg-[#1c2e4a] border-gray-700 text-white"
                }`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                name="accountNumber"
                placeholder="Enter account number (optional)"
                value={accountData.accountNumber}
                onChange={handleInputChange}
                className={`${
                  isLightTheme
                    ? "bg-[#E9E7D8] border-[#DCD8C0] text-[#222222]"
                    : "bg-[#1c2e4a] border-gray-700 text-white"
                }`}
              />
            </div>
            {sectionType !== "BFO Managed" && (
              <div className="space-y-2">
                <Label htmlFor="balance">Current Balance</Label>
                <Input
                  id="balance"
                  name="balance"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={accountData.balance}
                  onChange={handleInputChange}
                  className={`${
                    isLightTheme
                      ? "bg-[#E9E7D8] border-[#DCD8C0] text-[#222222]"
                      : "bg-[#1c2e4a] border-gray-700 text-white"
                  }`}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              className={`${
                isLightTheme
                  ? "border-[#DCD8C0] text-[#222222] hover:bg-[#E9E7D8]"
                  : "border-gray-700 text-white hover:bg-[#1c2e4a]"
              }`}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className={isLightTheme ? "bg-[#222222] text-white hover:bg-[#333333]" : ""}
            >
              Add Account
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
