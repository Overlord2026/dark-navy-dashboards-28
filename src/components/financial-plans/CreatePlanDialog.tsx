import { useState } from "react";
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
import { cn } from "@/lib/utils";

interface CreatePlanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePlan: (planName: string) => void;
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

export function CreatePlanDialog({ isOpen, onClose, onCreatePlan }: CreatePlanDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
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

  const handleBasicsSubmit = (values: PlanBasicsFormValues) => {
    setCurrentStep(2);
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
    onCreatePlan(basicsForm.getValues().planName);
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

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) resetAndClose();
      }}>
        <DialogContent className="bg-[#0F0F2D] text-[#E2E2E2] border border-border/30 sm:max-w-[600px] min-h-[400px] transition-all duration-300">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Plan Wizard - Step {currentStep}: {
                currentStep === 1 ? "Basics" : 
                currentStep === 2 ? "Goals" : 
                currentStep === 3 ? "Income & Expenses" : 
                currentStep === 4 ? "Projections" : 
                "Summary"
              }
            </DialogTitle>
            <DialogDescription className="text-sm text-[#E2E2E2]/70">
              {currentStep === 1 
                ? "Let's set up your plan. Start by giving it a name." 
                : currentStep === 2
                ? "Define your financial goals for this plan."
                : currentStep === 3
                ? "Add your income sources and expenses to complete your plan."
                : currentStep === 4
                ? "Set assumptions for future projections and growth."
                : "Review your plan details before creating it."}
            </DialogDescription>
          </DialogHeader>
          
          <div className={cn("transition-opacity duration-300", { "animate-in fade-in": true })}>
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
                  
                  <DialogFooter className="pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={resetAndClose}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      Continue
                      <ArrowRight className="ml-1 h-4 w-4" />
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
            
            {currentStep === 3 && (
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
                
                <DialogFooter className="pt-4">
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
              <Form {...projectionsForm}>
                <form onSubmit={projectionsForm.handleSubmit(handleProjectionsSubmit)} className="space-y-4">
                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2">Investment Assumptions</h3>
                    <p className="text-xs text-muted-foreground">
                      These assumptions will affect your projected net worth and chance of success.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={projectionsForm.control}
                      name="expectedReturnRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expected Return (%)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.1"
                              placeholder="7"
                              className="bg-background/50 border-border/30"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-xs">
                            Average annual return on investments
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={projectionsForm.control}
                      name="inflationRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Inflation Rate (%)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              step="0.1"
                              placeholder="2.5"
                              className="bg-background/50 border-border/30"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-xs">
                            Expected annual inflation
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={projectionsForm.control}
                    name="riskTolerance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Risk Tolerance</FormLabel>
                        <FormControl>
                          <select
                            className="bg-background/50 border border-border/30 rounded-md px-3 py-2 w-full text-sm"
                            {...field}
                          >
                            <option value="Conservative">Conservative</option>
                            <option value="Moderate">Moderate</option>
                            <option value="Aggressive">Aggressive</option>
                          </select>
                        </FormControl>
                        <FormDescription className="text-xs">
                          Your comfort level with investment risk
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={projectionsForm.control}
                    name="lifeExpectancy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Life Expectancy (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            placeholder="85"
                            className="bg-background/50 border-border/30"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Age to plan for in retirement calculations
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="mt-6 mb-4">
                    <h3 className="text-sm font-medium mb-2">Projection Preview</h3>
                    <div className="bg-background/30 rounded-md p-4 h-[180px] border border-border/20">
                      <ProjectionPreviewChart 
                        expectedReturn={parseFloat(projectionsForm.watch("expectedReturnRate") || "7")}
                        inflation={parseFloat(projectionsForm.watch("inflationRate") || "2.5")}
                        riskTolerance={projectionsForm.watch("riskTolerance") || "Moderate"}
                        monthlyNetSavings={calculateNetMonthly().net}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      This is a simplified projection based on your inputs. Actual results may vary.
                    </p>
                  </div>
                  
                  <DialogFooter className="pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleGoBack}
                    >
                      <ArrowLeft className="mr-1 h-4 w-4" />
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
            
            {currentStep === 5 && (
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
                  
                  <div className="border-b border-border/30 pb-2">
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
                  
                  <div className="border-b border-border/30 pb-2">
                    <h3 className="text-sm font-medium mb-2">Income & Expenses</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Income Sources: {incomeItems.length}</p>
                        {incomeItems.length > 0 ? (
                          <ul className="text-xs space-y-1">
                            {incomeItems.map(income => (
                              <li key={income.id}>
                                {income.source}: {formatCurrency(income.amount)} ({income.frequency})
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs text-muted-foreground">None defined</p>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Expenses: {expenseItems.length}</p>
                        {expenseItems.length > 0 ? (
                          <ul className="text-xs space-y-1">
                            {expenseItems.map(expense => (
                              <li key={expense.id}>
                                {expense.category}: {formatCurrency(expense.amount)} ({expense.frequency})
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs text-muted-foreground">None defined</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-b border-border/30 pb-2">
                    <h3 className="text-sm font-medium mb-2">Projections</h3>
                    <div className="flex justify-between">
                      <div>
                        <p className="text-xs">
                          <span className="text-muted-foreground">Expected Return:</span> {projectionsForm.getValues().expectedReturnRate}%
                        </p>
                        <p className="text-xs">
                          <span className="text-muted-foreground">Inflation:</span> {projectionsForm.getValues().inflationRate}%
                        </p>
                        <p className="text-xs">
                          <span className="text-muted-foreground">Risk Tolerance:</span> {projectionsForm.getValues().riskTolerance}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Chance of Success</p>
                        <p className="text-lg font-semibold text-green-400">{successRate}%</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <DialogFooter className="pt-4">
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
                    onClick={handleFinalSubmit}
                  >
                    Create Plan
                  </Button>
                </DialogFooter>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
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
      
      <Sheet open={isIncomeFormOpen} onOpenChange={setIsIncomeFormOpen}>
        <SheetContent className="bg-[#0F1C2E] border-l border-border/30 w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="text-xl font-semibold">
              {editingIncome ? "Edit Income Source" : "Add Income Source"}
            </SheetTitle>
          </SheetHeader>
          
          <Form {...incomeForm}>
            <form onSubmit={incomeForm.handleSubmit(handleIncomeSubmit)} className="space-y-4 mt-6">
              <FormField
                control={incomeForm.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Income Source</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Salary, Rental Income" 
                        className="bg-background/50 border-border/30"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={incomeForm.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        placeholder="e.g., 5000" 
                        className="bg-background/50 border-border/30"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={incomeForm.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frequency</FormLabel>
                    <FormControl>
                      <select
                        className="bg-background/50 border border-border/30 rounded-md px-3 py-2 w-full text-sm"
                        {...field}
                      >
                        <option value="Monthly">Monthly</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Bi-weekly">Bi-weekly</option>
                        <option value="Quarterly">Quarterly</option>
                        <option value="Annually">Annually</option>
                        <option value="One-time">One-time</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={incomeForm.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="date"
                          className="bg-background/50 border-border/30"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={incomeForm.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="date"
                          className="bg-background/50 border-border/30"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={incomeForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Add any additional details about this income source" 
                        className="bg-background/50 border-border/30"
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
                  onClick={closeIncomeForm}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingIncome ? "Update Income" : "Add Income"}
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
      
      <Sheet open={isExpenseFormOpen} onOpenChange={setIsExpenseFormOpen}>
        <SheetContent className="bg-[#0F1C2E] border-l border-border/30 w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="text-xl font-semibold">
              {editingExpense ? "Edit Expense" : "Add Expense"}
            </SheetTitle>
          </SheetHeader>
          
          <Form {...expenseForm}>
            <form onSubmit={expenseForm.handleSubmit(handleExpenseSubmit)} className="space-y-4 mt-6">
              <FormField
                control={expenseForm.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expense Category</FormLabel>
                    <FormControl>
                      <select 
                        className="bg-background/50 border border-border/30 rounded-md px-3 py-2 w-full text-sm"
                        {...field}
                      >
                        <option value="">Select a category</option>
                        <option value="Housing">Housing</option>
                        <option value="Transportation">Transportation</option>
                        <option value="Food">Food</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Insurance">Insurance</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Debt Payments">Debt Payments</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Education">Education</option>
                        <option value="Personal Care">Personal Care</option>
                        <option value="Other">Other</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={expenseForm.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        placeholder="e.g., 1500" 
                        className="bg-background/50 border-border/30"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={expenseForm.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frequency</FormLabel>
                    <FormControl>
                      <select
                        className="bg-background/50 border border-border/30 rounded-md px-3 py-2 w-full text-sm"
                        {...field}
                      >
                        <option value="Monthly">Monthly</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Bi-weekly">Bi-weekly</option>
                        <option value="Quarterly">Quarterly</option>
                        <option value="Annually">Annually</option>
                        <option value="One-time">One-time</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={expenseForm.control}
                name="isEssential"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-border/30 p-4">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Essential Expense</FormLabel>
                      <FormDescription>
                        Mark this if the expense is necessary and cannot be reduced
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={expenseForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Add any additional details about this expense" 
                        className="bg-background/50 border-border/30"
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
                  onClick={closeExpenseForm}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingExpense ? "Update Expense" : "Add Expense"}
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </>
  );
}
