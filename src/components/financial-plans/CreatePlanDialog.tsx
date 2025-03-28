
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CreatePlanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePlan: (planName: string) => void;
}

export function CreatePlanDialog({ isOpen, onClose, onCreatePlan }: CreatePlanDialogProps) {
  const [planName, setPlanName] = useState("");

  const handleSubmit = () => {
    if (planName.trim()) {
      onCreatePlan(planName);
      setPlanName("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0F1C2E] border border-border/30 sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">New Plan</DialogTitle>
          <p className="text-sm text-muted-foreground">To get started, name your new plan.</p>
        </DialogHeader>
        
        <div className="py-4">
          <label className="text-sm font-medium mb-2 block">Plan Name</label>
          <Input
            placeholder="Enter a name for your financial plan"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            className="bg-background/50 border-border/30"
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
