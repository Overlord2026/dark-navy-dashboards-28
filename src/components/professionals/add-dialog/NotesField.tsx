
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface NotesFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function NotesField({ value, onChange }: NotesFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="notes">Notes</Label>
      <Textarea 
        id="notes"
        name="notes"
        placeholder="Add any helpful notes about this professional..."
        value={value}
        onChange={onChange}
        className="min-h-[100px]"
      />
    </div>
  );
}
