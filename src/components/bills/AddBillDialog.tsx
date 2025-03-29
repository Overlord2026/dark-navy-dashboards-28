
import React, { useState } from "react";
import { useBills } from "@/hooks/useBills";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Bill, BillCategory, BillStatus } from "@/types/bill";
import { toast } from "sonner";

interface AddBillDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddBillDialog({ isOpen, onOpenChange }: AddBillDialogProps) {
  const { addBill } = useBills();
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    dueDate: "",
    category: "" as BillCategory,
    status: "Upcoming" as BillStatus,
    paymentAccount: "",
    recurring: false,
    recurringPeriod: "Monthly" as "Weekly" | "Monthly" | "Quarterly" | "Annually",
    autoPay: false,
    notes: "",
    provider: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleCategoryChange = (value: BillCategory) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleStatusChange = (value: BillStatus) => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  const handlePeriodChange = (value: "Weekly" | "Monthly" | "Quarterly" | "Annually") => {
    setFormData((prev) => ({ ...prev, recurringPeriod: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      amount: "",
      dueDate: "",
      category: "" as BillCategory,
      status: "Upcoming" as BillStatus,
      paymentAccount: "",
      recurring: false,
      recurringPeriod: "Monthly",
      autoPay: false,
      notes: "",
      provider: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error("Bill name is required");
      return;
    }
    
    if (!formData.amount || isNaN(parseFloat(formData.amount))) {
      toast.error("Valid amount is required");
      return;
    }
    
    if (!formData.dueDate) {
      toast.error("Due date is required");
      return;
    }
    
    if (!formData.category) {
      toast.error("Category is required");
      return;
    }

    // Create new bill with a random ID
    const newBill: Bill = {
      id: `bill-${Math.random().toString(36).substring(2, 9)}`,
      name: formData.name,
      amount: parseFloat(formData.amount),
      dueDate: formData.dueDate,
      category: formData.category,
      status: formData.status,
      paymentAccount: formData.paymentAccount || undefined,
      recurring: formData.recurring,
      recurringPeriod: formData.recurring ? formData.recurringPeriod : undefined,
      autoPay: formData.autoPay,
      notes: formData.notes || undefined,
      provider: formData.provider || undefined,
    };

    addBill(newBill);
    
    toast.success("Bill added successfully");
    
    // Reset form and close dialog
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Add Bill</DialogTitle>
          <DialogDescription>
            Add a new bill to your bills tracker.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Bill Name *</Label>
              <Input 
                id="name"
                name="name"
                placeholder="Electric Bill"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <Input 
                id="amount"
                name="amount"
                placeholder="0.00"
                value={formData.amount}
                onChange={handleChange}
                type="number"
                step="0.01"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date *</Label>
              <Input 
                id="dueDate"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => handleCategoryChange(value as BillCategory)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Housing">Housing</SelectItem>
                  <SelectItem value="Utilities">Utilities</SelectItem>
                  <SelectItem value="Insurance">Insurance</SelectItem>
                  <SelectItem value="Subscriptions">Subscriptions</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Transportation">Transportation</SelectItem>
                  <SelectItem value="Loans">Loans</SelectItem>
                  <SelectItem value="Credit Card">Credit Card</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleStatusChange(value as BillStatus)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Upcoming">Upcoming</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="paymentAccount">Payment Account</Label>
              <Input 
                id="paymentAccount"
                name="paymentAccount"
                placeholder="Checking Account"
                value={formData.paymentAccount}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2 h-10">
              <Checkbox 
                id="recurring" 
                checked={formData.recurring}
                onCheckedChange={(checked) => handleCheckboxChange("recurring", !!checked)}
              />
              <Label htmlFor="recurring">Recurring Bill</Label>
            </div>
            
            {formData.recurring && (
              <div className="space-y-2">
                <Label htmlFor="recurringPeriod">Recurring Period</Label>
                <Select 
                  value={formData.recurringPeriod} 
                  onValueChange={(value) => handlePeriodChange(value as "Weekly" | "Monthly" | "Quarterly" | "Annually")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                    <SelectItem value="Annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="autoPay" 
              checked={formData.autoPay}
              onCheckedChange={(checked) => handleCheckboxChange("autoPay", !!checked)}
            />
            <Label htmlFor="autoPay">Auto-Pay Enabled</Label>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="provider">Provider/Company</Label>
            <Input 
              id="provider"
              name="provider"
              placeholder="Provider name"
              value={formData.provider}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea 
              id="notes"
              name="notes"
              placeholder="Add any notes about this bill..."
              value={formData.notes}
              onChange={handleChange}
              className="min-h-[80px]"
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Bill</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
