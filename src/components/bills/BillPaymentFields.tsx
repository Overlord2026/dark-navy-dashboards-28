
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BillStatus } from "@/types/bill";

interface BillPaymentFieldsProps {
  status: BillStatus;
  paymentAccount: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleStatusChange: (value: BillStatus) => void;
}

export function BillPaymentFields({
  status,
  paymentAccount,
  handleChange,
  handleStatusChange,
}: BillPaymentFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select 
          value={status} 
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
          value={paymentAccount}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
