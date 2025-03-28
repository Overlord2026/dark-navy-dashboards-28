
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Calendar, Trash2, Plus, Edit, Check, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";

interface CreatePlanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePlan: (planName: string) => void;
}

// Define schema for Step 1: Plan Basics
const planBasicsSchema = z.object({
  planName: z.string().min(1, "Plan name is required"),
  targetRetirementAge: z.string().optional(),
  spouseRetirementAge: z.string().optional(),
});

// Define schema for a single goal
const goalSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Goal title is required"),
  targetDate: z.string().optional(),
  targetAmount: z.string().optional(),
  priority: z.string().optional(),
  description: z.string().optional(),
});

type PlanBasicsFormValues = z.infer<typeof planBasicsSchema>;
type GoalFormValues = z.infer<typeof goalSchema>;

interface Goal {
  id: string;
  title: string;
  targetDate?: string;
  targetAmount?: string;
  priority?: string;
  description?: string;
  isEditing?: boolean;
}

export function CreatePlanDialog({ isOpen, onClose, onCreatePlan }: CreatePlanDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [goals, setGoals] = useState<Goal[]>([]);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [isGoalFormOpen, setIsGoalFormOpen] = useState(false);

  // Form for Step 1: Plan Basics
  const basicsForm = useForm<PlanBasicsFormValues>({
    resolver: zodResolver(planBasicsSchema),
    defaultValues: {
      planName: "",
      targetRetirementAge: "",
      spouseRetirementAge: "",
    },
  });

  // Form for a single goal
  const goalForm = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      id: "",
      title: "",
      targetDate: "",
      targetAmount: "",
      priority: "Medium",
      description: "",
    },
  });

  const handleBasicsSubmit = (values: PlanBasicsFormValues) => {
    // Move to next step
    setCurrentStep(2);
  };

  const handleGoalSubmit = (values: GoalFormValues) => {
    if (editingGoal) {
      // Update existing goal
      setGoals(goals.map(goal => 
        goal.id === values.id ? { ...values, isEditing: false } : goal
      ));
    } else {
      // Add new goal
      setGoals([...goals, { ...values, id: `goal-${Date.now()}` }]);
    }
    
    closeGoalForm();
  };

  const openGoalForm = (goal?: Goal) => {
    if (goal) {
      // Edit existing goal
      setEditingGoal(goal);
      goalForm.reset({
        id: goal.id,
        title: goal.title,
        targetDate: goal.targetDate || "",
        targetAmount: goal.targetAmount || "",
        priority: goal.priority || "Medium",
        description: goal.description || "",
      });
    } else {
      // Create new goal
      setEditingGoal(null);
      goalForm.reset({
        id: `goal-${Date.now()}`,
        title: "",
        targetDate: "",
        targetAmount: "",
        priority: "Medium",
        description: "",
      });
    }
    
    setIsGoalFormOpen(true);
  };

  const closeGoalForm = () => {
    setIsGoalFormOpen(false);
    setEditingGoal(null);
    goalForm.reset();
  };

  const removeGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const handleFinalSubmit = () => {
    // Final step - create the plan with goals
    onCreatePlan(basicsForm.getValues().planName);
    resetAndClose();
  };

  const resetAndClose = () => {
    basicsForm.reset();
    goalForm.reset();
    setGoals([]);
    setCurrentStep(1);
    onClose();
  };

  const handleGoBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) resetAndClose();
      }}>
        <DialogContent className="bg-[#0F1C2E] border border-border/30 sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Plan Wizard - Step {currentStep}: {currentStep === 1 ? "Basics" : currentStep === 2 ? "Goals" : "Summary"}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              {currentStep === 1 
                ? "Let's gather some basic information about your plan." 
                : currentStep === 2
                ? "Define your financial goals for this plan."
                : "Review your plan details before creating it."}
            </p>
          </DialogHeader>
          
          {currentStep === 1 && (
            <Form {...basicsForm}>
              <form onSubmit={basicsForm.handleSubmit(handleBasicsSubmit)} className="space-y-4">
                <FormField
                  control={basicsForm.control}
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={basicsForm.control}
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={basicsForm.control}
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter className="pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={resetAndClose}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Next
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
          
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">Your Financial Goals</h3>
                <Button 
                  type="button" 
                  size="sm" 
                  variant="outline" 
                  className="gap-1"
                  onClick={() => openGoalForm()}
                >
                  <Plus className="h-4 w-4" />
                  Add Goal
                </Button>
              </div>
              
              {goals.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No goals added yet.</p>
                  <p className="text-sm">Click "Add Goal" to define your first financial goal.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {goals.map((goal) => (
                    <div 
                      key={goal.id} 
                      className="bg-background/50 border border-border/30 p-3 rounded-md"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{goal.title}</h4>
                          {goal.targetDate && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Target: {goal.targetDate}
                            </p>
                          )}
                          {goal.targetAmount && (
                            <p className="text-xs text-muted-foreground">
                              Amount: ${parseInt(goal.targetAmount).toLocaleString()}
                            </p>
                          )}
                          {goal.priority && (
                            <p className="text-xs">
                              Priority: <span className={`font-medium ${
                                goal.priority === "High" ? "text-red-400" : 
                                goal.priority === "Medium" ? "text-yellow-400" : 
                                "text-green-400"
                              }`}>{goal.priority}</span>
                            </p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7" 
                            onClick={() => openGoalForm(goal)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-red-400 hover:text-red-300 hover:bg-red-900/20" 
                            onClick={() => removeGoal(goal.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <DialogFooter className="pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleGoBack}
                >
                  Back
                </Button>
                <Button 
                  type="button" 
                  onClick={handleNext}
                >
                  Next
                </Button>
              </DialogFooter>
            </div>
          )}
          
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="border-b border-border/30 pb-2">
                  <h3 className="text-sm font-medium">Plan Details</h3>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Name:</span> {basicsForm.getValues().planName}
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Retirement Age:</span> {basicsForm.getValues().targetRetirementAge || "Not specified"}
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Spouse's Retirement Age:</span> {basicsForm.getValues().spouseRetirementAge || "Not specified"}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Goals ({goals.length})</h3>
                  {goals.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No goals defined</p>
                  ) : (
                    <ul className="space-y-2">
                      {goals.map((goal) => (
                        <li key={goal.id} className="text-sm flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                          <span>{goal.title}</span>
                          {goal.targetAmount && (
                            <span className="text-muted-foreground ml-auto">${parseInt(goal.targetAmount).toLocaleString()}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              
              <DialogFooter className="pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleGoBack}
                >
                  Back
                </Button>
                <Button 
                  type="button" 
                  onClick={handleFinalSubmit}
                >
                  Create Plan
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Goal Form Sheet */}
      <Sheet open={isGoalFormOpen} onOpenChange={setIsGoalFormOpen}>
        <SheetContent className="bg-[#0F1C2E] border-l border-border/30 w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="text-xl font-semibold">
              {editingGoal ? "Edit Goal" : "Add Financial Goal"}
            </SheetTitle>
          </SheetHeader>
          
          <Form {...goalForm}>
            <form onSubmit={goalForm.handleSubmit(handleGoalSubmit)} className="space-y-4 mt-6">
              <FormField
                control={goalForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goal Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Buy a House" 
                        className="bg-background/50 border-border/30"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={goalForm.control}
                name="targetDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Date</FormLabel>
                    <FormControl>
                      <Input 
                        type="date"
                        className="bg-background/50 border-border/30"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      When do you want to achieve this goal?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={goalForm.control}
                name="targetAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Amount</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        placeholder="e.g., 20000" 
                        className="bg-background/50 border-border/30"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      How much money do you need to achieve this goal?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={goalForm.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <FormControl>
                      <select
                        className="bg-background/50 border border-border/30 rounded-md px-3 py-2 w-full text-sm"
                        {...field}
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={goalForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Add any additional details about this goal" 
                        className="bg-background/50 border-border/30 min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <SheetFooter className="mt-6 flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeGoalForm}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingGoal ? "Update Goal" : "Add Goal"}
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </>
  );
}
