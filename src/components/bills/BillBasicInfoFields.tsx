
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BillCategory } from "@/types/bill";

interface BillBasicInfoFieldsProps {
  name: string;
  amount: string;
  dueDate: string;
  category: BillCategory;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCategoryChange: (value: BillCategory) => void;
}

export function BillBasicInfoFields({
  name,
  amount,
  dueDate,
  category,
  handleChange,
  handleCategoryChange,
}: BillBasicInfoFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="name">Bill Name *</Label>
        <Input 
          id="name"
          name="name"
          placeholder="Electric Bill"
          value={name}
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
          value={amount}
          onChange={handleChange}
          type="number"
          step="0.01"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dueDate">Due Date *</Label>
        <Input 
          id="dueDate"
          name="dueDate"
          type="date"
          value={dueDate}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Select 
          value={category} 
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
  );
}
