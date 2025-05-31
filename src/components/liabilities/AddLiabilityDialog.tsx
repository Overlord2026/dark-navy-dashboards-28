
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
  { value: "mortgage", label: "Mortgage" },
  { value: "auto_loan", label: "Auto Loan" },
  { value: "personal_loan", label: "Personal Loan" },
  { value: "student_loan", label: "Student Loan" },
  { value: "credit_card", label: "Credit Card" },
  { value: "line_of_credit", label: "Line of Credit" },
  { value: "business_loan", label: "Business Loan" },
  { value: "other", label: "Other" },
];

export const AddLiabilityDialog = ({ open, onOpenChange, onLiabilityAdded }: AddLiabilityDialogProps) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please log in to add liabilities");
      return;
    }

    if (!name.trim() || !type || !amount) {
      toast.error("Please fill in all fields");
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount < 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('user_liabilities')
        .insert({
          user_id: user.id,
          name: name.trim(),
          type,
          amount: numericAmount
        });

      if (error) {
        console.error('Error adding liability:', error);
        toast.error("Failed to add liability");
        return;
      }

      toast.success("Liability added successfully");
      setName("");
      setType("");
      setAmount("");
      onLiabilityAdded();
      onOpenChange(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to add liability");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Liability</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
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
            <Label htmlFor="type">Type</Label>
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
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
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
