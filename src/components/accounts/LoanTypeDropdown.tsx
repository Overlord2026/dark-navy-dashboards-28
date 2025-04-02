
import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface LoanTypeDropdownProps {
  value: string;
  onValueChange: (value: string) => void;
}

const loanTypes = [
  { value: "mortgage", label: "Mortgage" },
  { value: "auto", label: "Auto Loan" },
  { value: "personal", label: "Personal Loan" },
  { value: "student", label: "Student Loan" },
  { value: "heloc", label: "HELOC" },
  { value: "business", label: "Business Loan" },
  { value: "other", label: "Other" },
];

export const LoanTypeDropdown = ({ value, onValueChange }: LoanTypeDropdownProps) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select loan type" />
      </SelectTrigger>
      <SelectContent>
        {loanTypes.map((type) => (
          <SelectItem key={type.value} value={type.value}>
            {type.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
