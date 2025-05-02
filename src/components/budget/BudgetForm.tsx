
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { BudgetCategory } from "@/types/budget";

const budgetFormSchema = z.object({
  name: z.string().min(2, {
    message: "Category name must be at least 2 characters.",
  }),
  amount: z.coerce.number().positive({
    message: "Amount must be a positive number.",
  }),
  timeframe: z.enum(['monthly', 'yearly'], {
    required_error: "Please select a timeframe.",
  }),
});

interface BudgetFormProps {
  onNotify: (categories: BudgetCategory[]) => Promise<void>;
}

export const BudgetForm: React.FC<BudgetFormProps> = ({ onNotify }) => {
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof budgetFormSchema>>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      name: "",
      amount: 0,
      timeframe: "monthly",
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    const newCategory: BudgetCategory = {
      id: uuidv4(),
      name: data.name,
      amount: data.amount,
      timeframe: data.timeframe,
    };
    
    setCategories([...categories, newCategory]);
    form.reset();
  });

  const handleNotifyAdvisor = async () => {
    if (categories.length === 0) return;
    
    setIsSubmitting(true);
    try {
      await onNotify(categories);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveCategory = (id: string) => {
    setCategories(categories.filter(category => category.id !== id));
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Category Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g. Housing, Transportation, Food" 
                    {...field} 
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
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
            name="timeframe"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Timeframe</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          
          <div className="md:col-span-4 flex justify-end">
            <Button type="submit">Add Category</Button>
          </div>
        </form>
      </Form>

      {categories.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">Budget Categories</h3>
          <div className="space-y-3">
            {categories.map((category) => (
              <div 
                key={category.id} 
                className="flex justify-between items-center p-3 bg-[#0F1E3A] rounded-md border border-[#2A3E5C]"
              >
                <div>
                  <p className="font-medium text-white">{category.name}</p>
                  <p className="text-sm text-gray-400">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(category.amount)} 
                    {' '}
                    ({category.timeframe})
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleRemoveCategory(category.id)}
                >
                  Remove
                </Button>
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
