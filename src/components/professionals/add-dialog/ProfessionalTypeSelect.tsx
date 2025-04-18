
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProfessionalType } from "@/types/professional";

interface ProfessionalTypeSelectProps {
  value: ProfessionalType;
  onValueChange: (value: ProfessionalType) => void;
}

export function ProfessionalTypeSelect({ value, onValueChange }: ProfessionalTypeSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="type">Type *</Label>
      <Select value={value} onValueChange={onValueChange} required>
        <SelectTrigger>
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Tax Professional / Accountant">Tax Professional / Accountant</SelectItem>
          <SelectItem value="Estate Planning Attorney">Estate Planning Attorney</SelectItem>
          <SelectItem value="Financial Advisor">Financial Advisor</SelectItem>
          <SelectItem value="Real Estate Agent / Property Manager">Real Estate Agent / Property Manager</SelectItem>
          <SelectItem value="Insurance / LTC Specialist">Insurance / LTC Specialist</SelectItem>
          <SelectItem value="Mortgage Broker">Mortgage Broker</SelectItem>
          <SelectItem value="Auto Insurance Provider">Auto Insurance Provider</SelectItem>
          <SelectItem value="Physician">Physician</SelectItem>
          <SelectItem value="Dentist">Dentist</SelectItem>
          <SelectItem value="Banker">Banker</SelectItem>
          <SelectItem value="Consultant">Consultant</SelectItem>
          <SelectItem value="Service Professional">Service Professional</SelectItem>
          <SelectItem value="Other">Other</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
