import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Calendar, Trash2, Plus, Edit, Check, X, ArrowRight, ArrowLeft } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ProjectionPreviewChart } from "./ProjectionPreviewChart";
import { StepsOverview } from "./StepsOverview";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface CreatePlanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePlan: (planName: string, planData: any) => void;
  onSaveDraft?: (draftData: any) => void;
  draftData?: any;
}

const planBasicsSchema = z.object({
  planName: z.string().min(1, "Plan name is required"),
  targetRetirementAge: z.string().optional(),
  spouseRetirementAge: z.string().optional(),
});

const goalSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Goal title is required"),
  targetDate: z.string().optional(),
  targetAmount: z.string().optional(),
  priority: z.string().optional(),
  description: z.string().optional(),
});

const incomeItemSchema = z.object({
  id: z.string(),
  source: z.string().min(1, "Income source is required"),
  amount: z.string().min(1, "Amount is required"),
  frequency: z.string(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  notes: z.string().optional(),
});

const expenseItemSchema = z.object({
  id: z.string(),
  category: z.string().min(1, "Expense category is required"),
  amount: z.string().min(1, "Amount is required"),
  frequency: z.string(),
  isEssential: z.boolean().optional(),
  notes: z.string().optional(),
});

const projectionsSchema = z.object({
  expectedReturnRate: z.string().min(1, "Expected return rate is required"),
  inflationRate: z.string().min(1, "Inflation rate is required"),
  riskTolerance: z.string().min(1, "Risk tolerance is required"),
  lifeExpectancy: z.string().optional(),
});

type PlanBasicsFormValues = z.infer<typeof planBasicsSchema>;
type GoalFormValues = z.infer<typeof goalSchema>;
type IncomeItemFormValues = z.infer<typeof incomeItemSchema>;
type ExpenseItemFormValues = z.infer<typeof expenseItemSchema>;
type ProjectionsFormValues = z.infer<typeof projectionsSchema>;

interface Goal {
  id: string;
  title: string;
  targetDate?: string;
  targetAmount?: string;
  priority?: string;
  description?: string;
  isEditing?: boolean;
}

interface IncomeItem {
  id: string;
  source: string;
  amount: string;
  frequency: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
}

interface ExpenseItem {
  id: string;
  category: string;
  amount: string;
  frequency: string;
  isEssential?: boolean;
  notes?: string;
}

export function CreatePlanDialog({ isOpen, onClose, onCreatePlan, onSaveDraft, draftData }: CreatePlanDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6; // Increased from 5 to 6
  const [goals, setGoals] = useState<Goal[]>([]);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [isGoalFormOpen, setIsGoalFormOpen] = useState(false);
  
  const [incomeItems, setIncomeItems] = useState<IncomeItem[]>([]);
  const [expenseItems, setExpenseItems] = useState<ExpenseItem[]>([]);
  const [editingIncome, setEditingIncome] = useState<IncomeItem | null>(null);
  const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(null);
  const [isIncomeFormOpen, setIsIncomeFormOpen] = useState(false);
  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false);
  
  const [successRate, setSuccessRate] = useState(70);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [planData, setPlanData] = useState({
    basics: null,
    goals: [],
    incomeItems: [],
    expenseItems: [],
    projections: null,
    successRate: 0
  });

  useEffect(() => {
    if (draftData) {
      if (draftData.name) {
        basicsForm.setValue("planName", draftData.name);
      }
      
      if (draftData.goals && Array.isArray(draftData.goals)) {
        setGoals(draftData.goals);
      }
      
      if (draftData.income) {
        setIncomeItems(draftData.income.items || []);
      }
      
      if (draftData.expenses) {
        setExpenseItems(draftData.expenses.items || []);
      }
      
      if (draftData.step) {
        setCurrentStep(draftData.step);
      }
    }
  }, [draftData]);

  const basicsForm = useForm<PlanBasicsFormValues>({
    resolver: zodResolver(planBasicsSchema),
    defaultValues: {
      planName: "",
      targetRetirementAge: "",
      spouseRetirementAge: "",
    },
  });

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

  const incomeForm = useForm<IncomeItemFormValues>({
    resolver: zodResolver(incomeItemSchema),
    defaultValues: {
      id: "",
      source: "",
      amount: "",
      frequency: "Monthly",
      startDate: "",
      endDate: "",
      notes: "",
    },
  });

  const expenseForm = useForm<ExpenseItemFormValues>({
    resolver: zodResolver(expenseItemSchema),
    defaultValues: {
      id: "",
      category: "",
      amount: "",
      frequency: "Monthly",
      isEssential: false,
      notes: "",
    },
  });
  
  const projectionsForm = useForm<ProjectionsFormValues>({
    resolver: zodResolver(projectionsSchema),
    defaultValues: {
      expectedReturnRate: "7",
      inflationRate: "2.5",
      riskTolerance: "Moderate",
      lifeExpectancy: "",
    },
  });

  useEffect(() => {
    if (currentStep === 2) {
      setPlanData(prev => ({
        ...prev,
        basics: basicsForm.getValues()
      }));
    } else if (currentStep === 3) {
      setPlanData(prev => ({
        ...prev,
        goals: [...goals]
      }));
    } else if (currentStep === 4) {
      setPlanData(prev => ({
        ...prev,
        incomeItems: [...incomeItems],
        expenseItems: [...expenseItems]
      }));
    } else if (currentStep === 5) {
      setPlanData(prev => ({
        ...prev,
        projections: projectionsForm.getValues()
      }));
    } else if (currentStep === 6) {
      setPlanData(prev => ({
        ...prev,
        successRate: successRate
      }));
    }
  }, [currentStep, goals, incomeItems, expenseItems, successRate]);

  const handleBasicsSubmit = (values: PlanBasicsFormValues) => {
    setPlanData(prev => ({
      ...prev,
      basics: values
    }));
    setCurrentStep(3); // Skip overview step if coming from basics
  };

  const handleGoalSubmit = (values: GoalFormValues) => {
    if (editingGoal) {
      setGoals(goals.map(goal => 
        goal.id === values.id ? {
          id: values.id,
          title: values.title,
          targetDate: values.targetDate,
          targetAmount: values.targetAmount,
          priority: values.priority || "Medium",
          description: values.description,
          isEditing: false
        } : goal
      ));
    } else {
      const newGoal: Goal = {
        id: values.id,
        title: values.title,
        targetDate: values.targetDate,
        targetAmount: values.targetAmount,
        priority: values.priority || "Medium",
        description: values.description
      };
      setGoals([...goals, newGoal]);
    }
    
    closeGoalForm();
  };

  const handleIncomeSubmit = (values: IncomeItemFormValues) => {
    if (editingIncome) {
      setIncomeItems(incomeItems.map(item => 
        item.id === values.id ? {
          id: values.id,
          source: values.source,
          amount: values.amount,
          frequency: values.frequency,
          startDate: values.startDate,
          endDate: values.endDate,
          notes: values.notes
        } : item
      ));
    } else {
      const newIncome: IncomeItem = {
        id: values.id,
        source: values.source,
        amount: values.amount,
        frequency: values.frequency,
        startDate: values.startDate,
        endDate: values.endDate,
        notes: values.notes
      };
      setIncomeItems([...incomeItems, newIncome]);
    }
    
    closeIncomeForm();
  };

  const handleExpenseSubmit = (values: ExpenseItemFormValues) => {
    if (editingExpense) {
      setExpenseItems(expenseItems.map(item => 
        item.id === values.id ? {
          id: values.id,
          category: values.category,
          amount: values.amount,
          frequency: values.frequency,
          isEssential: values.isEssential,
          notes: values.notes
        } : item
      ));
    } else {
      const newExpense: ExpenseItem = {
        id: values.id,
        category: values.category,
        amount: values.amount,
        frequency: values.frequency,
        isEssential: values.isEssential,
        notes: values.notes
      };
      setExpenseItems([...expenseItems, newExpense]);
    }
    
    closeExpenseForm();
  };

  const handleProjectionsSubmit = (values: ProjectionsFormValues) => {
    const returnRate = parseFloat(values.expectedReturnRate);
    const inflation = parseFloat(values.inflationRate);
    const riskModifier = 
      values.riskTolerance === "Conservative" ? 0.7 :
      values.riskTolerance === "Moderate" ? 1.0 :
      values.riskTolerance === "Aggressive" ? 1.3 : 1.0;
      
    const calculatedRate = Math.min(95, Math.max(5, 
      (returnRate - inflation) * 10 * riskModifier
    ));
    
    setSuccessRate(Math.round(calculatedRate));
    setCurrentStep(5);
  };

  const handleFinalSubmit = () => {
    const planName = planData.basics?.planName || basicsForm.getValues().planName;
    onCreatePlan(planName, {
      basics: planData.basics,
      goals: planData.goals,
      incomeItems: planData.incomeItems,
      expenseItems: planData.expenseItems, 
      projections: planData.projections,
      successRate: planData.successRate
    });
    resetAndClose();
  };

  const resetAndClose = () => {
    basicsForm.reset();
    goalForm.reset();
    incomeForm.reset();
    expenseForm.reset();
    projectionsForm.reset();
    setGoals([]);
    setIncomeItems([]);
    setExpenseItems([]);
    setCurrentStep(1);
    setIsDraftSaved(false);
    setPlanData({
      basics: null,
      goals: [],
      incomeItems: [],
      expenseItems: [],
      projections: null,
      successRate: 0
    });
    onClose();
  };

  const handleGoBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    return isNaN(num) ? "" : `$${num.toLocaleString()}`;
  };

  const calculateNetMonthly = () => {
    const monthlyIncome = incomeItems.reduce((total, item) => {
      const amount = parseFloat(item.amount) || 0;
      const multiplier = 
        item.frequency === "Annually" ? 1/12 :
        item.frequency === "Quarterly" ? 1/3 :
        item.frequency === "Bi-weekly" ? 26/12 :
        item.frequency === "Weekly" ? 52/12 : 1;
      return total + (amount * multiplier);
    }, 0);
    
    const monthlyExpenses = expenseItems.reduce((total, item) => {
      const amount = parseFloat(item.amount) || 0;
      const multiplier = 
        item.frequency === "Annually" ? 1/12 :
        item.frequency === "Quarterly" ? 1/3 :
        item.frequency === "Bi-weekly" ? 26/12 :
        item.frequency === "Weekly" ? 52/12 : 1;
      return total + (amount * multiplier);
    }, 0);
    
    return {
      income: monthlyIncome,
      expenses: monthlyExpenses,
      net: monthlyIncome - monthlyExpenses
    };
  };

  const openGoalForm = (goal?: Goal) => {
    if (goal) {
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

  const removeGoal = (goalId: string) => {
    setGoals(goals.filter(goal => goal.id !== goalId));
  };

  const openIncomeForm = (income?: IncomeItem) => {
    if (income) {
      setEditingIncome(income);
      incomeForm.reset({
        id: income.id,
        source: income.source,
        amount: income.amount,
        frequency: income.frequency,
        startDate: income.startDate || "",
        endDate: income.endDate || "",
        notes: income.notes || "",
      });
    } else {
      setEditingIncome(null);
      incomeForm.reset({
        id: `income-${Date.now()}`,
        source: "",
        amount: "",
        frequency: "Monthly",
        startDate: "",
        endDate: "",
        notes: "",
      });
    }
    setIsIncomeFormOpen(true);
  };

  const closeIncomeForm = () => {
    setIsIncomeFormOpen(false);
    setEditingIncome(null);
    incomeForm.reset();
  };

  const removeIncome = (incomeId: string) => {
    setIncomeItems(incomeItems.filter(item => item.id !== incomeId));
  };

  const openExpenseForm = (expense?: ExpenseItem) => {
    if (expense) {
      setEditingExpense(expense);
      expenseForm.reset({
        id: expense.id,
        category: expense.category,
        amount: expense.amount,
        frequency: expense.frequency,
        isEssential: expense.isEssential || false,
        notes: expense.notes || "",
      });
    } else {
      setEditingExpense(null);
      expenseForm.reset({
        id: `expense-${Date.now()}`,
        category: "",
        amount: "",
        frequency: "Monthly",
        isEssential: false,
        notes: "",
      });
    }
    setIsExpenseFormOpen(true);
  };

  const closeExpenseForm = () => {
    setIsExpenseFormOpen(false);
    setEditingExpense(null);
    expenseForm.reset();
  };

  const removeExpense = (expenseId: string) => {
    setExpenseItems(expenseItems.filter(item => item.id !== expenseId));
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Overview of Steps";
      case 2: return "Basics";
      case 3: return "Goals";
      case 4: return "Income & Expenses";
      case 5: return "Projections";
      case 6: return "Summary";
      default: return "Plan Wizard";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "Here's an overview of the plan creation process. Follow these steps to create your financial plan.";
      case 2:
        return "Let's set up your plan. Start by giving it a name.";
      case 3:
        return "Define your financial goals for this plan.";
      case 4:
        return "Add your income sources and expenses to complete your plan.";
      case 5:
        return "Set assumptions for future projections and growth.";
      case 6:
        return "Review your plan details before creating it.";
      default:
        return "";
    }
  };

  const handleDialogClose = (open: boolean) => {
    if (!open && !isDraftSaved && currentStep > 1 && planData.basics?.planName) {
      if (onSaveDraft) {
        const draftName = `${planData.basics.planName} (Draft)`;
        onSaveDraft({
          name: planData.basics.planName,
          step: currentStep,
          goals: goals,
          income: incomeItems.length > 0 ? { items: incomeItems } : null,
          expenses: expenseItems.length > 0 ? { items: expenseItems } : null,
          projections: currentStep >= 5 ? planData.projections : null
        });
        setIsDraftSaved(true);
        toast.info("Your progress has been saved as a draft");
      }
    }
    
    if (!open) {
      resetAndClose();
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="bg-[#0F0F2D] text-[#E2E2E2] border border-border/30 sm:max-w-[600px] min-h-[400px] transition-all duration-300">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Plan Wizard - Step {currentStep}: {getStepTitle()}
            </DialogTitle>
            <DialogDescription className="text-sm text-[#E2E2E2]/70">
              {getStepDescription()}
            </DialogDescription>
          </DialogHeader>
          
          <div className={cn("transition-opacity duration-300", { "animate-in fade-in": true })}>
            {currentStep === 1 && (
              <div className="space-y-6">
                <StepsOverview />
                
                <DialogFooter className="pt-4 flex justify-between w-full">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={resetAndClose}
                  >
                    Exit
                  </Button>
                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      onClick={handleNext}
                    >
                      Continue
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </DialogFooter>
              </div>
            )}
            
            {currentStep === 2 && (
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
                            placeholder="e.g., Pedro Gomez Retirement" 
                            className="bg-background/50 border-border/30"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-[#E2E2E2]/70">
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
                  
                  <DialogFooter className="pt-4 flex justify-between w-full">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleGoBack}
                    >
                      Back
                    </Button>
                    <Button type="submit">
                      Continue
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            )}
            
            {currentStep === 3 && (
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
                
                <DialogFooter className="pt-4 flex justify-between w-full">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleGoBack}
                  >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Back
                  </Button>
                  <Button 
                    type="button" 
                    onClick={handleNext}
                  >
                    Continue
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </DialogFooter>
              </div>
            )}
            
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium">Income Sources</h3>
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="outline" 
                      className="gap-1"
                      onClick={() => openIncomeForm()}
                    >
                      <Plus className="h-4 w-4" />
                      Add Income
                    </Button>
                  </div>
                  
                  {incomeItems.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground bg-background/30 rounded-md border border-border/20">
                      <p className="text-sm">No income sources added.</p>
                      <p className="text-xs">Add your salary, investments, and other income sources.</p>
                    </div>
                  ) : (
                    <div className="overflow-auto max-h-[200px] border border-border/30 rounded-md">
                      <Table className="min-w-full">
                        <TableHeader className="bg-background/20">
                          <TableRow>
                            <TableHead className="w-1/3">Source</TableHead>
                            <TableHead className="w-1/4">Amount</TableHead>
                            <TableHead className="w-1/4">Frequency</TableHead>
                            <TableHead className="w-1/6 text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {incomeItems.map((income) => (
                            <TableRow key={income.id} className="border-b border-border/20">
                              <TableCell className="font-medium">{income.source}</TableCell>
                              <TableCell>{formatCurrency(income.amount)}</TableCell>
                              <TableCell>{income.frequency}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-1">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-7 w-7" 
                                    onClick={() => openIncomeForm(income)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-7 w-7 text-red-400 hover:text-red-300" 
                                    onClick={() => removeIncome(income.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium">Expenses</h3>
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="outline" 
                      className="gap-1"
                      onClick={() => openExpenseForm()}
                    >
                      <Plus className="h-4 w-4" />
                      Add Expense
                    </Button>
                  </div>
                  
                  {expenseItems.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground bg-background/30 rounded-md border border-border/20">
                      <p className="text-sm">No expenses added yet.</p>
                      <p className="text-xs">Add your mortgage, insurance, and other regular expenses.</p>
                    </div>
                  ) : (
                    <div className="overflow-auto max-h-[200px] border border-border/30 rounded-md">
                      <Table className="min-w-full">
                        <TableHeader className="bg-background/20">
                          <TableRow>
                            <TableHead className="w-1/3">Category</TableHead>
                            <TableHead className="w-1/4">Amount</TableHead>
                            <TableHead className="w-1/4">Frequency</TableHead>
                            <TableHead className="w-1/6 text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {expenseItems.map((expense) => (
                            <TableRow key={expense.id} className="border-b border-border/20">
                              <TableCell className="font-medium">{expense.category}</TableCell>
                              <TableCell>{formatCurrency(expense.amount)}</TableCell>
                              <TableCell>{expense.frequency}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-1">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-7 w-7" 
                                    onClick={() => openExpenseForm(expense)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-7 w-7 text-red-400 hover:text-red-300" 
                                    onClick={() => removeExpense(expense.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground">
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-sm font-normal"
                    onClick={() => {/* Future enhancement: Advanced income/expense categories */}}
                  >
                    Add expense categories
                  </Button> or refine your financial tracking with custom categories.
                </p>
                
                <DialogFooter className="pt-4 flex justify-between w-full">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleGoBack}
                  >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Back
                  </Button>
                  <Button 
                    type="button" 
                    onClick={handleNext}
                  >
                    Continue
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </DialogFooter>
              </div>
            )}
            
            {currentStep === 5 && (
              <Form {...projectionsForm}>
                <form onSubmit={projectionsForm.handleSubmit(handleProjectionsSubmit)} className="space-y-4">
                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2">Investment Assumptions</h3>
                    <p className="text-xs text-muted-foreground">
