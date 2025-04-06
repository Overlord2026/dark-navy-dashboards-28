
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface EmptyAccountSectionProps {
  message: string;
  buttonText?: string;
  onAddAccount: () => void;
}

export function EmptyAccountSection({ 
  message, 
  buttonText = "Add Account", 
  onAddAccount 
}: EmptyAccountSectionProps) {
  return (
    <div className="p-4 text-center text-muted-foreground">
      <p>{message}</p>
      <Button variant="outline" className="mt-2" onClick={onAddAccount}>
        <PlusCircle className="mr-2 h-4 w-4" />
        {buttonText}
      </Button>
    </div>
  );
}
