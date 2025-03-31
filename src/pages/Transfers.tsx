
import { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { ArrowLeft, ChevronDown, Info, CheckCircle, CircleDollarSign, ArrowRightLeft, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type TransferStep = "selection" | "deposit" | "withdrawal" | "schedule";
type AccountType = string;
type TransferFrequency = "one-time" | "weekly" | "monthly" | "quarterly" | "annually";

const Transfers = () => {
  const [currentStep, setCurrentStep] = useState<TransferStep>("selection");
  const [selectedAccount, setSelectedAccount] = useState<AccountType | null>(null);
  const [destinationAccount, setDestinationAccount] = useState<AccountType | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [showNewTransferDialog, setShowNewTransferDialog] = useState(false);
  const [showNewScheduleDialog, setShowNewScheduleDialog] = useState(false);
  const [transferFrequency, setTransferFrequency] = useState<TransferFrequency>("one-time");
  const [yearSelection, setYearSelection] = useState<string>("2025");

  const handleBack = () => {
    if (currentStep === "selection") return;
    setCurrentStep("selection");
  };

  const handleTransferTypeSelect = (type: TransferStep) => {
    if (type === "deposit" || type === "withdrawal" || type === "schedule") {
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

  const handleDestinationAccountSelect = (value: string) => {
    setDestinationAccount(value);
  };

  const handleFrequencySelect = (value: TransferFrequency) => {
    setTransferFrequency(value);
  };

  const handleYearSelect = (year: string) => {
    setYearSelection(year);
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
    toast.success(`${currentStep === "deposit" ? "Deposit" : currentStep === "withdrawal" ? "Withdrawal" : "Scheduled transfer"} request submitted`, {
      description: `Your request for $${amount} has been submitted and is being processed.`,
    });

    // Reset form
    setAmount("");
    setSelectedAccount(null);
    setDestinationAccount(null);
    setCurrentStep("selection");
    setShowNewTransferDialog(false);
    setShowNewScheduleDialog(false);
  };

  const renderTransferCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mt-10">
      <Card className="bg-[#0a1629] border-gray-800 text-white hover:border-gray-700 transition-all">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CircleDollarSign className="h-6 w-6" />
            Current Transfer Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between py-2 border-b border-gray-800">
            <span>Pending Transfers</span>
            <span className="font-medium">0</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-800">
            <span>Recent Transfers</span>
            <span className="font-medium">0</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Total Transferred This Month</span>
            <span className="font-medium">$0.00</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#0a1629] border-gray-800 text-white hover:border-gray-700 transition-all">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-6 w-6" />
            New Transfer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 mb-4">Initiate a new one-time transfer between your accounts</p>
        </CardContent>
        <CardFooter className="justify-end pt-2">
          <Button onClick={() => setShowNewTransferDialog(true)} className="bg-gray-200 text-black hover:bg-gray-300">
            New Transfer
          </Button>
        </CardFooter>
      </Card>

      <Card className="bg-[#0a1629] border-gray-800 text-white hover:border-gray-700 transition-all">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-6 w-6" />
            Scheduled Transfers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 mb-4">Set up recurring transfers between your accounts</p>
        </CardContent>
        <CardFooter className="justify-end pt-2">
          <Button onClick={() => setShowNewScheduleDialog(true)} className="bg-gray-200 text-black hover:bg-gray-300">
            Schedule Transfer
          </Button>
        </CardFooter>
      </Card>

      <Card className="bg-[#0a1629] border-gray-800 text-white hover:border-gray-700 transition-all">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-6 w-6" />
            Transfer Scenarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 mb-4">Test different transfer scenarios and options</p>
        </CardContent>
        <CardFooter className="justify-end pt-2">
          <Button onClick={() => handleTransferTypeSelect("deposit")} className="bg-gray-200 text-black hover:bg-gray-300">
            New Scenario
          </Button>
        </CardFooter>
      </Card>
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

  const renderNewTransferDialog = () => (
    <Dialog open={showNewTransferDialog} onOpenChange={setShowNewTransferDialog}>
      <DialogContent className="bg-[#001029] text-white border border-gray-800 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">New Transfer</DialogTitle>
          <DialogDescription className="text-gray-400">
            Transfer funds between your accounts
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-gray-300">From Account</Label>
            <Select onValueChange={handleAccountSelect}>
              <SelectTrigger className="bg-[#0a1629] border-gray-700 text-white">
                <SelectValue placeholder="Select source account" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="checking">Checking Account</SelectItem>
                <SelectItem value="savings">Savings Account</SelectItem>
                <SelectItem value="investment">Investment Account</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">To Account</Label>
            <Select onValueChange={handleDestinationAccountSelect}>
              <SelectTrigger className="bg-[#0a1629] border-gray-700 text-white">
                <SelectValue placeholder="Select destination account" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="checking">Checking Account</SelectItem>
                <SelectItem value="savings">Savings Account</SelectItem>
                <SelectItem value="investment">Investment Account</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-gray-300 flex items-center gap-2">
              Amount
              <span className="flex items-center justify-center rounded-full bg-gray-700 text-white h-5 w-5 text-xs">i</span>
            </Label>
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
        </div>
        
        <div className="flex justify-end gap-2">
          <Button 
            variant="ghost" 
            onClick={() => setShowNewTransferDialog(false)}
            className="text-gray-400 hover:text-white"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-gray-200 text-black hover:bg-gray-300"
          >
            Transfer Funds
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const renderScheduleTransferDialog = () => (
    <Dialog open={showNewScheduleDialog} onOpenChange={setShowNewScheduleDialog}>
      <DialogContent className="bg-[#001029] text-white border border-gray-800 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Schedule Transfer</DialogTitle>
          <DialogDescription className="text-gray-400">
            Set up recurring transfers between your accounts
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-gray-300">From Account</Label>
            <Select onValueChange={handleAccountSelect}>
              <SelectTrigger className="bg-[#0a1629] border-gray-700 text-white">
                <SelectValue placeholder="Select source account" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="checking">Checking Account</SelectItem>
                <SelectItem value="savings">Savings Account</SelectItem>
                <SelectItem value="investment">Investment Account</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">To Account</Label>
            <Select onValueChange={handleDestinationAccountSelect}>
              <SelectTrigger className="bg-[#0a1629] border-gray-700 text-white">
                <SelectValue placeholder="Select destination account" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="checking">Checking Account</SelectItem>
                <SelectItem value="savings">Savings Account</SelectItem>
                <SelectItem value="investment">Investment Account</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-gray-300">Frequency</Label>
            <Select onValueChange={(val) => handleFrequencySelect(val as TransferFrequency)}>
              <SelectTrigger className="bg-[#0a1629] border-gray-700 text-white">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="one-time">One-time</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="annually">Annually</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-gray-300 flex items-center gap-2">
              Amount
              <span className="flex items-center justify-center rounded-full bg-gray-700 text-white h-5 w-5 text-xs">i</span>
            </Label>
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
        </div>
        
        <div className="flex justify-end gap-2">
          <Button 
            variant="ghost" 
            onClick={() => setShowNewScheduleDialog(false)}
            className="text-gray-400 hover:text-white"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-gray-200 text-black hover:bg-gray-300"
          >
            Schedule Transfer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const renderYearSelectionDialog = () => (
    <Dialog open={currentStep === "schedule"} onOpenChange={() => setCurrentStep("selection")}>
      <DialogContent className="bg-[#001029] text-white border border-gray-800 max-w-5xl">
        <DialogHeader>
          <div className="text-sm text-gray-400">Set a Transfer Schedule</div>
          <DialogTitle className="text-3xl font-semibold">Select Year</DialogTitle>
        </DialogHeader>
        
        <div className="py-8 flex flex-col lg:flex-row gap-6">
          <div className="lg:w-3/4 space-y-6 bg-[#000f21] p-6 rounded-lg border border-gray-800">
            <h3 className="text-xl">Transfer Year</h3>
            
            <div className="space-y-4">
              <div 
                className={cn(
                  "p-5 border rounded-md flex items-center gap-3 cursor-pointer transition-colors",
                  yearSelection === "2025" 
                    ? "bg-[#0a1629] border-green-500" 
                    : "bg-[#0a1629] border-gray-800 hover:border-gray-700"
                )}
                onClick={() => handleYearSelect("2025")}
              >
                {yearSelection === "2025" && <CheckCircle className="h-5 w-5 text-green-500" />}
                {yearSelection !== "2025" && <div className="h-5 w-5 rounded-full border border-gray-600" />}
                <span className="text-lg">2025 (Current Year)</span>
              </div>
              
              <div 
                className={cn(
                  "p-5 border rounded-md flex items-center gap-3 cursor-pointer transition-colors",
                  yearSelection === "2026" 
                    ? "bg-[#0a1629] border-green-500" 
                    : "bg-[#0a1629] border-gray-800 hover:border-gray-700"
                )}
                onClick={() => handleYearSelect("2026")}
              >
                {yearSelection === "2026" && <CheckCircle className="h-5 w-5 text-green-500" />}
                {yearSelection !== "2026" && <div className="h-5 w-5 rounded-full border border-gray-600" />}
                <span className="text-lg">2026</span>
              </div>
              
              <div 
                className={cn(
                  "p-5 border rounded-md flex items-center gap-3 cursor-pointer transition-colors",
                  yearSelection === "2027" 
                    ? "bg-[#0a1629] border-green-500" 
                    : "bg-[#0a1629] border-gray-800 hover:border-gray-700"
                )}
                onClick={() => handleYearSelect("2027")}
              >
                {yearSelection === "2027" && <CheckCircle className="h-5 w-5 text-green-500" />}
                {yearSelection !== "2027" && <div className="h-5 w-5 rounded-full border border-gray-600" />}
                <span className="text-lg">2027</span>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/4 bg-[#001029] p-6 rounded-lg border border-gray-800">
            <h3 className="text-xl mb-4">Disclosure</h3>
            <p className="text-gray-400 text-sm">
              Transfers that have already been scheduled will count towards the current year's limit.
            </p>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-4">
          <Button 
            variant="ghost" 
            onClick={() => setCurrentStep("selection")}
            className="text-gray-400 hover:text-white flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-gray-200 text-black hover:bg-gray-300"
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const renderContent = () => {
    switch (currentStep) {
      case "selection":
        return renderTransferCards();
      case "deposit":
        return renderDepositForm();
      case "withdrawal":
        return renderWithdrawalForm();
      default:
        return renderTransferCards();
    }
  };

  return (
    <ThreeColumnLayout activeMainItem="transfers" title="Transfers">
      <div className="h-full bg-[#000f21] text-white animate-fade-in">
        <div className="container mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold mb-8">Transfers</h1>
          {renderContent()}
          {renderNewTransferDialog()}
          {renderScheduleTransferDialog()}
          {renderYearSelectionDialog()}
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default Transfers;
