
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, ArrowLeft } from "lucide-react";
import { useLiabilities } from "@/context/LiabilitiesContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface AddLiabilityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const liabilityTypes = [
  { value: "Auto", label: "Auto" },
  { value: "Mortgage", label: "Mortgage" },
  { value: "Student", label: "Student" },
  { value: "Consumer", label: "Consumer" },
  { value: "Credit Line", label: "Credit Line" },
  { value: "Other", label: "Other" },
];

export const AddLiabilityDialog = ({ open, onOpenChange }: AddLiabilityDialogProps) => {
  const isMobile = useIsMobile();
  const { addLiability } = useLiabilities();
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [currentBalance, setCurrentBalance] = useState("");
  const [originalLoanAmount, setOriginalLoanAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setName("");
    setType("");
    setCurrentBalance("");
    setOriginalLoanAmount("");
    setStartDate("");
    setEndDate("");
    setMonthlyPayment("");
    setInterestRate("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !type || !currentBalance) {
      return;
    }

    const numericCurrentBalance = parseFloat(currentBalance);
    if (isNaN(numericCurrentBalance) || numericCurrentBalance < 0) {
      return;
    }

    setIsSubmitting(true);

    const liabilityData: any = {
      name: name.trim(),
      type: type,
      current_balance: numericCurrentBalance
    };

    // Add optional fields if they have valid values
    if (originalLoanAmount && originalLoanAmount.trim()) {
      const numericOriginalAmount = parseFloat(originalLoanAmount);
      if (!isNaN(numericOriginalAmount) && numericOriginalAmount > 0) {
        liabilityData.original_loan_amount = numericOriginalAmount;
      }
    }

    if (startDate && startDate.trim()) {
      liabilityData.start_date = startDate;
    }

    if (endDate && endDate.trim()) {
      liabilityData.end_date = endDate;
    }

    if (monthlyPayment && monthlyPayment.trim()) {
      const numericMonthlyPayment = parseFloat(monthlyPayment);
      if (!isNaN(numericMonthlyPayment) && numericMonthlyPayment > 0) {
        liabilityData.monthly_payment = numericMonthlyPayment;
      }
    }

    if (interestRate && interestRate.trim()) {
      const numericInterestRate = parseFloat(interestRate);
      if (!isNaN(numericInterestRate) && numericInterestRate >= 0) {
        liabilityData.interest_rate = numericInterestRate;
      }
    }

    const success = await addLiability(liabilityData);
    if (success) {
      resetForm();
      onOpenChange(false);
    }
    
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("sm:max-w-[550px] p-0 overflow-hidden bg-card border border-border/50 shadow-2xl", isMobile && "mx-4")}>
        <div className="relative">
          {/* Header with gradient background */}
          <div className="relative px-8 py-5 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent border-b border-border/30">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-50" />
            <DialogHeader className="relative">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <CreditCard className="h-6 w-6" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-semibold text-foreground tracking-tight">
                    Add New Liability
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Track your debts and loan obligations
                  </p>
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* Form content */}
          <div className="p-7 max-h-[70vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-base font-medium text-foreground">Liability Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Chase Mortgage, Car Loan"
                  className="h-12 border-border/50 bg-background hover:border-primary/30 focus:border-primary/50 transition-colors duration-200"
                  required
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="type" className="text-base font-medium text-foreground">Liability Type</Label>
                <Select value={type} onValueChange={setType} required>
                  <SelectTrigger className="h-12 border-border/50 bg-background hover:border-primary/30 transition-colors duration-200">
                    <SelectValue placeholder="Select liability type" />
                  </SelectTrigger>
                  <SelectContent>
                    {liabilityTypes.map((liabilityType) => (
                      <SelectItem key={liabilityType.value} value={liabilityType.value}>
                        {liabilityType.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="current-balance" className="text-base font-medium text-foreground">Current Balance</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="current-balance"
                    type="number"
                    step="0.01"
                    min="0"
                    value={currentBalance}
                    onChange={(e) => setCurrentBalance(e.target.value)}
                    placeholder="0.00"
                    className="h-12 pl-8 border-border/50 bg-background hover:border-primary/30 focus:border-primary/50 transition-colors duration-200"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="original-loan-amount" className="text-base font-medium text-foreground">
                  Original Loan Amount <span className="text-muted-foreground text-sm font-normal">(Optional)</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="original-loan-amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={originalLoanAmount}
                    onChange={(e) => setOriginalLoanAmount(e.target.value)}
                    placeholder="0.00"
                    className="h-12 pl-8 border-border/50 bg-background hover:border-primary/30 focus:border-primary/50 transition-colors duration-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="start-date" className="text-base font-medium text-foreground">
                    Start Date <span className="text-muted-foreground text-sm font-normal">(Optional)</span>
                  </Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-12 border-border/50 bg-background hover:border-primary/30 focus:border-primary/50 transition-colors duration-200"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="end-date" className="text-base font-medium text-foreground">
                    End Date <span className="text-muted-foreground text-sm font-normal">(Optional)</span>
                  </Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="h-12 border-border/50 bg-background hover:border-primary/30 focus:border-primary/50 transition-colors duration-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="monthly-payment" className="text-base font-medium text-foreground">
                    Monthly Payment <span className="text-muted-foreground text-sm font-normal">(Optional)</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="monthly-payment"
                      type="number"
                      step="0.01"
                      min="0"
                      value={monthlyPayment}
                      onChange={(e) => setMonthlyPayment(e.target.value)}
                      placeholder="0.00"
                      className="h-12 pl-8 border-border/50 bg-background hover:border-primary/30 focus:border-primary/50 transition-colors duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="interest-rate" className="text-base font-medium text-foreground">
                    Interest Rate <span className="text-muted-foreground text-sm font-normal">(Optional)</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="interest-rate"
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                      placeholder="0.00"
                      className="h-12 pr-8 border-border/50 bg-background hover:border-primary/30 focus:border-primary/50 transition-colors duration-200"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">%</span>
                  </div>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="pt-5 border-t border-border/30">
                <div className={cn("flex gap-3", isMobile ? "flex-col" : "flex-row justify-end")}>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    disabled={isSubmitting}
                    className={cn(
                      "h-12 px-6 border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200",
                      isMobile && "w-full"
                    )}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={cn(
                      "h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200",
                      "shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30",
                      isMobile && "w-full"
                    )}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Adding...
                      </div>
                    ) : (
                      'Add Liability'
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
