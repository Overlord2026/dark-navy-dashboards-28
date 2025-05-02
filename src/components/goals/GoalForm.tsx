
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { DatePicker } from "@/components/ui/date-picker";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { FinancialGoal } from "@/types/goals";

const goalFormSchema = z.object({
  name: z.string().min(2, {
    message: "Goal name must be at least 2 characters.",
  }),
  targetAmount: z.coerce.number().positive({
    message: "Target amount must be a positive number.",
  }),
  currentAmount: z.coerce.number().min(0, {
    message: "Current amount must be a non-negative number.",
  }),
  priority: z.enum(['high', 'medium', 'low'], {
    required_error: "Please select a priority.",
  }),
});

interface GoalFormProps {
  onNotify: (goals: FinancialGoal[]) => Promise<void>;
}

export const GoalForm: React.FC<GoalFormProps> = ({ onNotify }) => {
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [targetDate, setTargetDate] = useState<Date>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof goalFormSchema>>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      name: "",
      targetAmount: 0,
      currentAmount: 0,
      priority: "medium",
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    const newGoal: FinancialGoal = {
      id: uuidv4(),
      name: data.name,
      targetAmount: data.targetAmount,
      currentAmount: data.currentAmount,
      targetDate: targetDate,
      priority: data.priority,
    };
    
    setGoals([...goals, newGoal]);
    form.reset();
  });

  const handleNotifyAdvisor = async () => {
    if (goals.length === 0) return;
    
    setIsSubmitting(true);
    try {
      await onNotify(goals);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const priorityColors = {
    high: "text-red-400",
    medium: "text-yellow-400",
    low: "text-green-400",
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. Retirement, New Home, Education" 
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid gap-4 md:grid-cols-3">
            <FormField
              control={form.control}
              name="targetAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Amount</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="currentAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Amount</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormItem>
              <FormLabel>Target Date</FormLabel>
              <DatePicker date={targetDate} onSelect={setTargetDate} />
            </FormItem>
          </div>
          
          <div className="flex justify-end">
            <Button type="submit">Add Goal</Button>
          </div>
        </form>
      </Form>

      {goals.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">My Goals</h3>
          <div className="space-y-3">
            {goals.map((goal) => (
              <div 
                key={goal.id} 
                className="p-3 bg-[#0F1E3A] rounded-md border border-[#2A3E5C]"
              >
                <div className="flex justify-between">
                  <h4 className="font-medium text-white">{goal.name}</h4>
                  <span className={priorityColors[goal.priority]}>
                    {goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)} Priority
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-400 grid gap-1">
                  <div className="flex justify-between">
                    <span>Target Amount:</span>
                    <span>{new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(goal.targetAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Amount:</span>
                    <span>{new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(goal.currentAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Target Date:</span>
                    <span>{goal.targetDate.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-[#2A3E5C]">
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="bg-[#9b87f5] h-2.5 rounded-full" 
                        style={{ width: `${Math.min(100, (goal.currentAmount / goal.targetAmount) * 100)}%` }}
                      />
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="ml-2"
                      onClick={() => handleRemoveGoal(goal.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-right">
            <Button 
              onClick={handleNotifyAdvisor}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Notifying...' : 'Notify My Advisor'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
