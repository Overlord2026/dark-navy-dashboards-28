
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLiabilities, Liability } from "@/context/LiabilitiesContext";

interface EditLiabilityDialogProps {
  liability: Liability | null;
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

export const EditLiabilityDialog = ({ liability, open, onOpenChange }: EditLiabilityDialogProps) => {
  const { updateLiability } = useLiabilities();
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [currentBalance, setCurrentBalance] = useState("");
  const [originalLoanAmount, setOriginalLoanAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (liability) {
      setName(liability.name);
      setType(liability.type);
      setCurrentBalance(liability.current_balance.toString());
      setOriginalLoanAmount(liability.original_loan_amount?.toString() || "");
      setStartDate(liability.start_date || "");
      setEndDate(liability.end_date || "");
      setMonthlyPayment(liability.monthly_payment?.toString() || "");
      setInterestRate(liability.interest_rate?.toString() || "");
    }
  }, [liability]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!liability) return;

    if (!name.trim() || !type || !currentBalance) {
      return;
    }

    const numericCurrentBalance = parseFloat(currentBalance);
    if (isNaN(numericCurrentBalance) || numericCurrentBalance < 0) {
      return;
    }

    setIsSubmitting(true);

    const updates: any = {
      name: name.trim(),
      type,
      current_balance: numericCurrentBalance
    };

    // Add optional fields if they have values
    if (originalLoanAmount) {
      const numericOriginalAmount = parseFloat(originalLoanAmount);
      if (!isNaN(numericOriginalAmount)) {
        updates.original_loan_amount = numericOriginalAmount;
      }
    }

    if (startDate) updates.start_date = startDate;
    if (endDate) updates.end_date = endDate;

    if (monthlyPayment) {
      const numericMonthlyPayment = parseFloat(monthlyPayment);
      if (!isNaN(numericMonthlyPayment)) {
        updates.monthly_payment = numericMonthlyPayment;
      }
    }

    if (interestRate) {
      const numericInterestRate = parseFloat(interestRate);
      if (!isNaN(numericInterestRate)) {
        updates.interest_rate = numericInterestRate;
      }
    }

    const success = await updateLiability(liability.id, updates);
    if (success) {
      onOpenChange(false);
    }
    
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Liability</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Chase Mortgage, Car Loan"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="type">Type *</Label>
            <Select value={type} onValueChange={setType} required>
              <SelectTrigger>
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
          
          <div>
            <Label htmlFor="current-balance">Current Balance ($) *</Label>
            <Input
              id="current-balance"
              type="number"
              step="0.01"
              min="0"
              value={currentBalance}
              onChange={(e) => setCurrentBalance(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <Label htmlFor="original-loan-amount">Original Loan Amount ($)</Label>
            <Input
              id="original-loan-amount"
              type="number"
              step="0.01"
              min="0"
              value={originalLoanAmount}
              onChange={(e) => setOriginalLoanAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="monthly-payment">Monthly Payment ($)</Label>
            <Input
              id="monthly-payment"
              type="number"
              step="0.01"
              min="0"
              value={monthlyPayment}
              onChange={(e) => setMonthlyPayment(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div>
            <Label htmlFor="interest-rate">Interest Rate (%)</Label>
            <Input
              id="interest-rate"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              placeholder="0.00"
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Liability"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
