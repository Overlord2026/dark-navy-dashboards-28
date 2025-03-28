
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Info } from "lucide-react";
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
  type: "Living" | "Healthcare" | "Education" | "Other" | "Taxes and fees" | "Debt" | "Alimony";
  period: "Before Retirement" | "After Retirement";
  amount: number;
  owner: string;
  paymentAccount?: string;
  annualIncrease?: string;
  repeats?: string;
  starts?: string;
  ends?: string;
  approach?: string;
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

  // Update form data when expense changes
  useEffect(() => {
    if (expense) {
      setFormData(expense);
    } else {
      // Reset form to defaults if no expense is provided
      setFormData({
        id: `expense-${Date.now()}`,
        name: "",
        type: "Healthcare",
        period: "Before Retirement",
        amount: 0,
        owner: "Antonio Gomez",
      });
    }
  }, [expense, isOpen]);

  const handleChange = (field: keyof ExpenseData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  if (!isOpen) return null;

  // Determine the title and subtitle based on the expense type and period
  const getTitle = () => {
    return `${formData.type} Expense`;
  };

  const getSubtitle = () => {
    return formData.period;
  };

  // Conditional info message for Living expenses
  const showLivingExpensesInfo = formData.type === "Living";

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="w-full max-w-md bg-[#0a1022] border-l border-blue-900/30 overflow-y-auto">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-blue-900/30 relative">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
            <h2 className="text-2xl font-semibold text-white">{getTitle()}</h2>
            <p className="text-sm text-gray-400">{getSubtitle()}</p>
          </div>

          <div className="flex-1 p-6 space-y-6">
            {showLivingExpensesInfo && (
              <div className="bg-blue-950 border border-blue-800 rounded-md p-4 flex items-start space-x-3">
                <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-300">
                  Do not include any debt payments (e.g. mortgage) in living expenses.
                </p>
              </div>
            )}

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder={`${formData.type} Expenses ${formData.period}`}
                    className="bg-[#1A2333] border-blue-900/30 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Owner</label>
                  <Select
                    value={formData.owner}
                    onValueChange={(value) => handleChange("owner", value)}
                  >
                    <SelectTrigger className="bg-[#1A2333] border-blue-900/30 text-white">
                      <SelectValue placeholder="Select owner" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0A1022] border-blue-900/30">
                      <SelectItem value="Antonio Gomez">Antonio Gomez</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">
                    {formData.type === "Living" ? "Monthly Amount" : "Amount"}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      $
                    </span>
                    <Input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => handleChange("amount", parseFloat(e.target.value) || 0)}
                      className="pl-8 bg-[#1A2333] border-blue-900/30 text-white"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Payment Account</label>
                  <Select
                    value={formData.paymentAccount}
                    onValueChange={(value) => handleChange("paymentAccount", value)}
                  >
                    <SelectTrigger className="bg-[#1A2333] border-blue-900/30 text-white">
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0A1022] border-blue-900/30">
                      <SelectItem value="Checking Account">Checking Account</SelectItem>
                      <SelectItem value="Savings Account">Savings Account</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Annual Increase</label>
                  <Select
                    value={formData.annualIncrease || "None"}
                    onValueChange={(value) => handleChange("annualIncrease", value)}
                  >
                    <SelectTrigger className="bg-[#1A2333] border-blue-900/30 text-white">
                      <SelectValue placeholder="None" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0A1022] border-blue-900/30">
                      <SelectItem value="None">None</SelectItem>
                      <SelectItem value="2%">2%</SelectItem>
                      <SelectItem value="3%">3%</SelectItem>
                      <SelectItem value="4%">4%</SelectItem>
                      <SelectItem value="5%">5%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.type === "Living" && (
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Approach</label>
                    <Select
                      value={formData.approach || "Simple"}
                      onValueChange={(value) => handleChange("approach", value)}
                    >
                      <SelectTrigger className="bg-[#1A2333] border-blue-900/30 text-white">
                        <SelectValue placeholder="Simple" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0A1022] border-blue-900/30">
                        <SelectItem value="Simple">Simple</SelectItem>
                        <SelectItem value="Detailed">Detailed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Repeats</label>
                <Select
                  value={formData.repeats || "Every Month"}
                  onValueChange={(value) => handleChange("repeats", value)}
                >
                  <SelectTrigger className="bg-[#1A2333] border-blue-900/30 text-white">
                    <SelectValue placeholder="Every Month" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0A1022] border-blue-900/30">
                    <SelectItem value="Every Month">Every Month</SelectItem>
                    <SelectItem value="Every Quarter">Every Quarter</SelectItem>
                    <SelectItem value="Every Year">Every Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Starts</label>
                <Select
                  value={formData.starts || (formData.period === "After Retirement" ? "Your Retirement" : "Already Started")}
                  onValueChange={(value) => handleChange("starts", value)}
                >
                  <SelectTrigger className="bg-[#1A2333] border-blue-900/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0A1022] border-blue-900/30">
                    <SelectItem value="Already Started">Already Started</SelectItem>
                    <SelectItem value="Your Retirement">Your Retirement</SelectItem>
                    <SelectItem value="In 5 Years">In 5 Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Ends</label>
                <Select
                  value={formData.ends || (formData.period === "Before Retirement" ? "Your Retirement" : "End of Your Planning Horizon")}
                  onValueChange={(value) => handleChange("ends", value)}
                >
                  <SelectTrigger className="bg-[#1A2333] border-blue-900/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0A1022] border-blue-900/30">
                    <SelectItem value="Your Retirement">Your Retirement</SelectItem>
                    <SelectItem value="End of Your Planning Horizon">End of Your Planning Horizon</SelectItem>
                    <SelectItem value="In 10 Years">In 10 Years</SelectItem>
                    <SelectItem value="In 20 Years">In 20 Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-end p-6 border-t border-blue-900/30 gap-2">
            <Button variant="outline" onClick={onClose} className="text-white border-gray-700 hover:bg-gray-800">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
