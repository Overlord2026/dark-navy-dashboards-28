
import { Button } from "@/components/ui/button";

export function SecurityForm({ onSave }: { onSave: () => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Turn On Two-Factor Authentication</h2>
        <p className="text-sm text-muted-foreground mt-1">
          For additional security, turn on Two-Factor Authentication. A code will be sent to your
          mobile device for you to enter each time you log in.
        </p>
      </div>
      
      <div className="flex justify-center py-10">
        <Button 
          size="lg"
          onClick={onSave}
        >
          Turn On Two-Factor Authentication
        </Button>
      </div>
    </div>
  );
}
