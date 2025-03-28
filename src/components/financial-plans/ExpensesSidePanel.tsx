
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface ExpenseData {
  id: string;
  name: string;
  type: "Living" | "Healthcare" | "Education" | "Other";
  period: "Before Retirement" | "After Retirement";
  amount: number;
  owner: string;
  paymentAccount?: string;
  annualIncrease?: string;
  repeats?: string;
  starts?: string;
  ends?: string;
}

interface ExpensesSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  expense?: ExpenseData | null;
  onSave: (expense: ExpenseData) => void;
}

export const ExpensesSidePanel = ({ isOpen, onClose, expense, onSave }: ExpensesSidePanelProps) => {
  const [formData, setFormData] = useState<ExpenseData>(
    expense || {
      id: `expense-${Date.now()}`,
      name: "",
      type: "Healthcare",
      period: "Before Retirement",
      amount: 0,
      owner: "Antonio Gomez",
    }
  );

  const handleChange = (field: keyof ExpenseData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  // Determine the title based on the expense type
  const panelTitle = `${formData.type} Expense`;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="w-full max-w-md bg-[#0D1426] border-l border-blue-900/30 overflow-y-auto animate-in slide-in-from-right">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-6 border-b border-blue-900/30">
            <h2 className="text-xl font-semibold">{panelTitle}</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 p-6 space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Owner</label>
                  <Select
                    value={formData.owner}
                    onValueChange={(value) => handleChange("owner", value)}
                  >
                    <SelectTrigger className="bg-[#1A2333] border-blue-900/30">
                      <SelectValue placeholder="Select owner" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A2333] border-blue-900/30">
                      <SelectItem value="Antonio Gomez">Antonio Gomez</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder={`${formData.type} Expenses ${formData.period}`}
                    className="bg-[#1A2333] border-blue-900/30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => handleChange("amount", parseFloat(e.target.value) || 0)}
                    className="pl-8 bg-[#1A2333] border-blue-900/30"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Payment Account</label>
                <Select
                  value={formData.paymentAccount}
                  onValueChange={(value) => handleChange("paymentAccount", value)}
                >
                  <SelectTrigger className="bg-[#1A2333] border-blue-900/30">
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A2333] border-blue-900/30">
                    <SelectItem value="Checking Account">Checking Account</SelectItem>
                    <SelectItem value="Savings Account">Savings Account</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Annual Increase</label>
                <Select
                  value={formData.annualIncrease || "None"}
                  onValueChange={(value) => handleChange("annualIncrease", value)}
                >
                  <SelectTrigger className="bg-[#1A2333] border-blue-900/30">
                    <SelectValue placeholder="Select increase rate" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A2333] border-blue-900/30">
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="2%">2%</SelectItem>
                    <SelectItem value="3%">3%</SelectItem>
                    <SelectItem value="4%">4%</SelectItem>
                    <SelectItem value="5%">5%</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Repeats</label>
                <Select
                  value={formData.repeats || "Every Month"}
                  onValueChange={(value) => handleChange("repeats", value)}
                >
                  <SelectTrigger className="bg-[#1A2333] border-blue-900/30">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A2333] border-blue-900/30">
                    <SelectItem value="Every Month">Every Month</SelectItem>
                    <SelectItem value="Every Quarter">Every Quarter</SelectItem>
                    <SelectItem value="Every Year">Every Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Starts</label>
                <Select
                  value={formData.starts || "Your Retirement"}
                  onValueChange={(value) => handleChange("starts", value)}
                >
                  <SelectTrigger className="bg-[#1A2333] border-blue-900/30">
                    <SelectValue placeholder="Select start date" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A2333] border-blue-900/30">
                    <SelectItem value="Today">Today</SelectItem>
                    <SelectItem value="Your Retirement">Your Retirement</SelectItem>
                    <SelectItem value="In 5 Years">In 5 Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Ends</label>
                <Select
                  value={formData.ends || "End of Your Planning Horizon"}
                  onValueChange={(value) => handleChange("ends", value)}
                >
                  <SelectTrigger className="bg-[#1A2333] border-blue-900/30">
                    <SelectValue placeholder="Select end date" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A2333] border-blue-900/30">
                    <SelectItem value="End of Your Planning Horizon">End of Your Planning Horizon</SelectItem>
                    <SelectItem value="In 10 Years">In 10 Years</SelectItem>
                    <SelectItem value="In 20 Years">In 20 Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-between p-6 border-t border-blue-900/30">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Save</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
