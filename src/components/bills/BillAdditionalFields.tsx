
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface BillAdditionalFieldsProps {
  provider: string;
  notes: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function BillAdditionalFields({
  provider,
  notes,
  handleChange,
}: BillAdditionalFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="provider">Provider/Company</Label>
        <Input 
          id="provider"
          name="provider"
          placeholder="Provider name"
          value={provider}
          onChange={handleChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea 
          id="notes"
          name="notes"
          placeholder="Add any notes about this bill..."
          value={notes}
          onChange={handleChange}
          className="min-h-[80px]"
        />
      </div>
    </>
  );
}
