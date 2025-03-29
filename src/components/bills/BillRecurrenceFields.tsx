
import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BillRecurrenceFieldsProps {
  recurring: boolean;
  recurringPeriod: "Weekly" | "Monthly" | "Quarterly" | "Annually";
  autoPay: boolean;
  handleCheckboxChange: (name: string, checked: boolean) => void;
  handlePeriodChange: (value: "Weekly" | "Monthly" | "Quarterly" | "Annually") => void;
}

export function BillRecurrenceFields({
  recurring,
  recurringPeriod,
  autoPay,
  handleCheckboxChange,
  handlePeriodChange,
}: BillRecurrenceFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2 h-10">
          <Checkbox 
            id="recurring" 
            checked={recurring}
            onCheckedChange={(checked) => handleCheckboxChange("recurring", !!checked)}
          />
          <Label htmlFor="recurring">Recurring Bill</Label>
        </div>
        
        {recurring && (
          <div className="space-y-2">
            <Label htmlFor="recurringPeriod">Recurring Period</Label>
            <Select 
              value={recurringPeriod} 
              onValueChange={handlePeriodChange}
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
          checked={autoPay}
          onCheckedChange={(checked) => handleCheckboxChange("autoPay", !!checked)}
        />
        <Label htmlFor="autoPay">Auto-Pay Enabled</Label>
      </div>
    </>
  );
}
