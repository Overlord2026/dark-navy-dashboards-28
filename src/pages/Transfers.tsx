
import { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

type TransferStep = "selection" | "deposit" | "withdrawal";
type AccountType = string;

const Transfers = () => {
  const [currentStep, setCurrentStep] = useState<TransferStep>("selection");
  const [selectedAccount, setSelectedAccount] = useState<AccountType | null>(null);
  const [amount, setAmount] = useState<string>("");

  const handleBack = () => {
    if (currentStep === "selection") return;
    setCurrentStep("selection");
  };

  const handleTransferTypeSelect = (type: TransferStep) => {
    if (type === "deposit" || type === "withdrawal") {
      setCurrentStep(type);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove any non-numeric characters except for a decimal point
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setAmount(value);
  };

  const handleAccountSelect = (value: string) => {
    setSelectedAccount(value);
  };

  const handleSubmit = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!selectedAccount) {
      toast.error("Please select an account");
      return;
    }

    // In a real application, this would make an API call to process the transfer
    toast.success(`${currentStep === "deposit" ? "Deposit" : "Withdrawal"} request submitted`, {
      description: `Your request for $${amount} has been submitted and is being processed.`,
    });

    // Reset form
    setAmount("");
    setSelectedAccount(null);
    setCurrentStep("selection");
  };

  const renderTransferTypeSelection = () => (
    <div className="flex flex-col space-y-6 max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold text-white">Choose a transfer type</h2>
      <p className="text-gray-400">Please select where you would like to transfer money from.</p>
      
      <div className="mt-8 space-y-4">
        <button 
          onClick={() => handleTransferTypeSelect("deposit")}
          className="w-full p-5 bg-[#0a1629] hover:bg-[#121a2c] border border-gray-800 rounded-md flex items-center justify-between text-white transition-colors"
        >
          <span className="text-xl">One-time Deposit</span>
          <ChevronDown size={20} />
        </button>
        
        <button
          onClick={() => handleTransferTypeSelect("withdrawal")}
          className="w-full p-5 bg-[#0a1629] hover:bg-[#121a2c] border border-gray-800 rounded-md flex items-center justify-between text-white transition-colors"
        >
          <span className="text-xl">Withdrawal</span>
          <ChevronDown size={20} />
        </button>
      </div>
    </div>
  );

  const renderDepositForm = () => (
    <div className="flex flex-col space-y-6 max-w-3xl mx-auto mt-6">
      <div className="flex items-center mb-2">
        <Button 
          variant="ghost" 
          onClick={handleBack} 
          className="p-0 mr-2 hover:bg-transparent"
        >
          <ArrowLeft className="h-5 w-5 text-gray-400" />
        </Button>
      </div>
      
      <h2 className="text-2xl font-semibold text-white">One-time deposit</h2>
      <p className="text-gray-400">
        Looking to make a deposit into a Farther account? Simply follow the steps below to initiate the transaction.
      </p>
      
      <div className="mt-8 space-y-6">
        <div className="space-y-2">
          <label className="text-gray-400">Deposit to</label>
          <Select onValueChange={handleAccountSelect}>
            <SelectTrigger className="bg-[#0a1629] border-gray-700 text-white">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="checking">Checking Account</SelectItem>
              <SelectItem value="savings">Savings Account</SelectItem>
              <SelectItem value="investment">Investment Account</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="py-4">
          <p className="text-white font-medium">Please contact your wealth advisor to set up ACH Authorization.</p>
          <p className="text-gray-500 text-sm mt-1">If you need to change your bank account please contact your wealth advisor.</p>
        </div>
        
        <div className="space-y-2">
          <label className="text-gray-400 flex items-center gap-2">
            Amount
            <span className="flex items-center justify-center rounded-full bg-gray-700 text-white h-5 w-5 text-xs">i</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white">$</span>
            <Input 
              className="pl-8 bg-[#0a1629] border-gray-700 text-white" 
              placeholder="0.00"
              value={amount}
              onChange={handleAmountChange}
            />
          </div>
        </div>
        
        <div className="mt-2">
          <a href="#" className="text-green-500 hover:text-green-400 transition">Prefer to send a wire transfer?</a>
        </div>
        
        <div className="flex justify-between items-center pt-8">
          <Button 
            variant="ghost" 
            onClick={handleBack} 
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="bg-gray-200 text-black hover:bg-gray-300"
          >
            Deposit
          </Button>
        </div>
      </div>
    </div>
  );

  const renderWithdrawalForm = () => (
    <div className="flex flex-col space-y-6 max-w-3xl mx-auto mt-6">
      <div className="flex items-center mb-2">
        <Button 
          variant="ghost" 
          onClick={handleBack} 
          className="p-0 mr-2 hover:bg-transparent"
        >
          <ArrowLeft className="h-5 w-5 text-gray-400" />
        </Button>
      </div>
      
      <h2 className="text-2xl font-semibold text-white">Withdraw funds</h2>
      <p className="text-gray-400">
        Looking to make a withdrawal out of your Farther account? Simply follow the steps below to initiate the transaction.
      </p>
      
      <div className="mt-8 space-y-6">
        <div className="space-y-2">
          <label className="text-gray-400">Withdraw from</label>
          <Select onValueChange={handleAccountSelect}>
            <SelectTrigger className="bg-[#0a1629] border-gray-700 text-white">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="checking">Checking Account</SelectItem>
              <SelectItem value="savings">Savings Account</SelectItem>
              <SelectItem value="investment">Investment Account</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-yellow-500 text-sm mt-1">None of your accounts are eligible for ACH transfers</p>
        </div>
        
        <div className="py-4">
          <p className="text-white font-medium">Please contact your wealth advisor to set up ACH Authorization.</p>
          <p className="text-gray-500 text-sm mt-1">If you need to change your bank account please contact your wealth advisor.</p>
        </div>
        
        <div className="space-y-2">
          <label className="text-gray-400">Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white">$</span>
            <Input 
              className="pl-8 bg-[#0a1629] border-gray-700 text-white" 
              placeholder="0.00"
              value={amount}
              onChange={handleAmountChange}
            />
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-8">
          <Button 
            variant="ghost" 
            onClick={handleBack} 
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="bg-gray-200 text-black hover:bg-gray-300"
          >
            Withdraw
          </Button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentStep) {
      case "selection":
        return renderTransferTypeSelection();
      case "deposit":
        return renderDepositForm();
      case "withdrawal":
        return renderWithdrawalForm();
      default:
        return renderTransferTypeSelection();
    }
  };

  return (
    <ThreeColumnLayout activeMainItem="transfers" title="Transfers">
      <div className="h-full bg-[#000f21] text-white animate-fade-in">
        <div className="container mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold mb-8">Transfers</h1>
          {renderContent()}
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default Transfers;
