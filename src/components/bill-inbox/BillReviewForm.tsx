
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { AIConfidenceIndicator } from "./AIConfidenceIndicator";

// Define the schema for the form
const billFormSchema = z.object({
  vendorName: z.string().min(1, "Vendor name is required"),
  amount: z.coerce.number().min(0.01, "Amount must be greater than zero"),
  dueDate: z.string().min(1, "Due date is required"),
  category: z.string().min(1, "Category is required"),
});

// Define the type for the form values
export type BillFormData = z.infer<typeof billFormSchema>;

// Define the type for the parsed data
interface ParsedField {
  value: string | number;
  confidence: number;
}

interface ParsedBillData {
  vendorName: ParsedField;
  amount: ParsedField;
  dueDate: ParsedField;
  category: ParsedField;
  billImage?: string;
}

interface BillReviewFormProps {
  parsedData: ParsedBillData;
  onConfirm: (data: BillFormData) => void;
  onCancel: () => void;
}

// Category options for the form
const BILL_CATEGORIES = [
  { value: "Utilities", label: "Utilities" },
  { value: "Rent", label: "Rent" },
  { value: "Insurance", label: "Insurance" },
  { value: "Subscriptions", label: "Subscriptions" },
  { value: "Office Supplies", label: "Office Supplies" },
  { value: "Telecommunications", label: "Telecommunications" },
  { value: "Transportation", label: "Transportation" },
  { value: "Healthcare", label: "Healthcare" },
  { value: "Other", label: "Other" },
];

export function BillReviewForm({ parsedData, onConfirm, onCancel }: BillReviewFormProps) {
  // Setup the form with the initial values from the parsed data
  const form = useForm<BillFormData>({
    resolver: zodResolver(billFormSchema),
    defaultValues: {
      vendorName: parsedData.vendorName.value.toString(),
      amount: typeof parsedData.amount.value === "number" 
        ? parsedData.amount.value 
        : parseFloat(parsedData.amount.value),
      dueDate: parsedData.dueDate.value.toString(),
      category: parsedData.category.value.toString(),
    },
  });

  // Function to get the confidence level based on the score
  const getConfidenceLevel = (score: number) => {
    if (score >= 85) return "high";
    if (score >= 70) return "medium";
    return "low";
  };

  // Handle form submission
  const onSubmit = (data: BillFormData) => {
    onConfirm(data);
  };

  return (
    <div className="space-y-6">
      {parsedData.billImage && (
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-center">
              <img 
                src={parsedData.billImage} 
                alt="Bill preview" 
                className="max-h-64 object-contain border rounded"
              />
            </div>
          </CardContent>
        </Card>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="vendorName"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Vendor Name</FormLabel>
                  <AIConfidenceIndicator 
                    level={getConfidenceLevel(parsedData.vendorName.confidence)}
                    score={parsedData.vendorName.confidence}
                    className="w-24"
                  />
                </div>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Amount</FormLabel>
                  <AIConfidenceIndicator 
                    level={getConfidenceLevel(parsedData.amount.confidence)}
                    score={parsedData.amount.confidence}
                    className="w-24"
                  />
                </div>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                    <Input {...field} className="pl-8" type="number" step="0.01" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Due Date</FormLabel>
                  <AIConfidenceIndicator 
                    level={getConfidenceLevel(parsedData.dueDate.confidence)}
                    score={parsedData.dueDate.confidence}
                    className="w-24"
                  />
                </div>
                <FormControl>
                  <Input {...field} type="date" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Category</FormLabel>
                  <AIConfidenceIndicator 
                    level={getConfidenceLevel(parsedData.category.confidence)}
                    score={parsedData.category.confidence}
                    className="w-24"
                  />
                </div>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {BILL_CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              Confirm & Process
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
