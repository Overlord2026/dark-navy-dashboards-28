
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface CreatePlanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePlan: (planName: string) => void;
}

// Define schema for Step 1
const planBasicsSchema = z.object({
  planName: z.string().min(1, "Plan name is required"),
  targetRetirementAge: z.string().optional(),
  spouseRetirementAge: z.string().optional(),
});

type PlanBasicsFormValues = z.infer<typeof planBasicsSchema>;

export function CreatePlanDialog({ isOpen, onClose, onCreatePlan }: CreatePlanDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;

  const form = useForm<PlanBasicsFormValues>({
    resolver: zodResolver(planBasicsSchema),
    defaultValues: {
      planName: "",
      targetRetirementAge: "",
      spouseRetirementAge: "",
    },
  });

  const handleSubmit = (values: PlanBasicsFormValues) => {
    if (currentStep < totalSteps) {
      // Move to next step
      setCurrentStep(currentStep + 1);
    } else {
      // Final step - create the plan
      onCreatePlan(values.planName);
      resetAndClose();
    }
  };

  const resetAndClose = () => {
    form.reset();
    setCurrentStep(1);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) resetAndClose();
    }}>
      <DialogContent className="bg-[#0F1C2E] border border-border/30 sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Plan Wizard - Step {currentStep}: {currentStep === 1 ? "Basics" : "Goals"}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {currentStep === 1 
              ? "Let's gather some basic information about your plan." 
              : "Let's set up your financial goals."}
          </p>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {currentStep === 1 && (
              <>
                <FormField
                  control={form.control}
                  name="planName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plan Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Retirement Plan" 
                          className="bg-background/50 border-border/30"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Give your financial plan a descriptive name
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="targetRetirementAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Retirement Age</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="e.g., 65" 
                          className="bg-background/50 border-border/30"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="spouseRetirementAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Spouse's Retirement Age (if applicable)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="e.g., 65" 
                          className="bg-background/50 border-border/30"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </>
            )}
            
            {currentStep === 2 && (
              <div className="py-4">
                <p className="text-sm text-muted-foreground">
                  This step would contain fields for setting financial goals.
                  For now, we'll just use this as a placeholder for future functionality.
                </p>
              </div>
            )}
            
            <DialogFooter className="pt-4">
              {currentStep > 1 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  Back
                </Button>
              )}
              <Button 
                type="button" 
                variant="outline" 
                onClick={resetAndClose}
              >
                Cancel
              </Button>
              <Button type="submit">
                {currentStep < totalSteps ? "Next" : "Create Plan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
