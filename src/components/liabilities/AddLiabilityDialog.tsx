
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface AddLiabilityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLiabilityAdded: () => void;
}

const liabilityTypes = [
  { value: "Auto", label: "Auto" },
  { value: "Mortgage", label: "Mortgage" },
  { value: "Student", label: "Student" },
  { value: "Consumer", label: "Consumer" },
  { value: "Credit Line", label: "Credit Line" },
  { value: "Other", label: "Other" },
];

export const AddLiabilityDialog = ({ open, onOpenChange, onLiabilityAdded }: AddLiabilityDialogProps) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [currentBalance, setCurrentBalance] = useState("");
  const [originalLoanAmount, setOriginalLoanAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

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
    
    if (!user) {
      toast.error("Please log in to add liabilities");
      return;
    }

    if (!name.trim() || !type || !currentBalance) {
      toast.error("Please fill in all required fields");
      return;
    }

    const numericCurrentBalance = parseFloat(currentBalance);
    if (isNaN(numericCurrentBalance) || numericCurrentBalance < 0) {
      toast.error("Please enter a valid current balance");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create the insert data object with only the required fields first
      const insertData: any = {
        user_id: user.id,
        name: name.trim(),
        type: type,
        current_balance: numericCurrentBalance
      };

      // Add optional fields only if they have valid values
      if (originalLoanAmount && originalLoanAmount.trim()) {
        const numericOriginalAmount = parseFloat(originalLoanAmount);
        if (!isNaN(numericOriginalAmount) && numericOriginalAmount > 0) {
          insertData.original_loan_amount = numericOriginalAmount;
        }
      }

      if (startDate && startDate.trim()) {
        insertData.start_date = startDate;
      }

      if (endDate && endDate.trim()) {
        insertData.end_date = endDate;
      }

      if (monthlyPayment && monthlyPayment.trim()) {
        const numericMonthlyPayment = parseFloat(monthlyPayment);
        if (!isNaN(numericMonthlyPayment) && numericMonthlyPayment > 0) {
          insertData.monthly_payment = numericMonthlyPayment;
        }
      }

      if (interestRate && interestRate.trim()) {
        const numericInterestRate = parseFloat(interestRate);
        if (!isNaN(numericInterestRate) && numericInterestRate >= 0) {
          insertData.interest_rate = numericInterestRate;
        }
      }

      console.log('Attempting to insert liability:', insertData);

      const { data, error } = await supabase
        .from('user_liabilities')
        .insert([insertData])
        .select();

      if (error) {
        console.error('Database error:', error);
        toast.error(`Failed to add liability: ${error.message}`);
        return;
      }

      console.log('Successfully added liability:', data);
      toast.success("Liability added successfully");
      resetForm();
      onLiabilityAdded();
      onOpenChange(false);
    } catch (error) {
      console.error('Unexpected error adding liability:', error);
      toast.error("An unexpected error occurred while adding the liability");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Liability</DialogTitle>
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
              {isSubmitting ? "Adding..." : "Add Liability"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
