
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const additionalInfoSchema = z.object({
  citizenshipStatus: z.string().min(1, { message: "Citizenship status is required." }),
  ssn: z.string().min(9, { message: "SSN must be at least 9 digits." }),
  incomeRange: z.string().min(1, { message: "Income range is required." }),
  netWorth: z.string().min(1, { message: "Net worth is required." }),
  investorType: z.string().min(1, { message: "Investor type is required." }),
  investingObjective: z.string().min(1, { message: "Investing objective is required." }),
  taxBracketCapital: z.string().min(1, { message: "Tax bracket for capital gains is required." }),
  taxBracketIncome: z.string().min(1, { message: "Tax bracket for income is required." }),
  iraContribution: z.boolean().default(false),
  employmentStatus: z.string().min(1, { message: "Employment status is required." }),
});

export function AdditionalInfoForm({ onSave }: { onSave: () => void }) {
  const { user } = useAuth();
  
  const form = useForm<z.infer<typeof additionalInfoSchema>>({
    resolver: zodResolver(additionalInfoSchema),
    defaultValues: {
      citizenshipStatus: "",
      ssn: "",
      incomeRange: "",
      netWorth: "",
      investorType: "",
      investingObjective: "",
      taxBracketCapital: "",
      taxBracketIncome: "",
      iraContribution: false,
      employmentStatus: "",
    },
  });

  React.useEffect(() => {
    const loadExistingData = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('user_additional_info')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (data && !error) {
        form.reset({
          citizenshipStatus: data.citizenship_status || "",
          ssn: data.ssn || "",
          incomeRange: data.income_range || "",
          netWorth: data.net_worth || "",
          investorType: data.investor_type || "",
          investingObjective: data.investing_objective || "",
          taxBracketCapital: data.tax_bracket_capital || "",
          taxBracketIncome: data.tax_bracket_income || "",
          iraContribution: data.ira_contribution || false,
          employmentStatus: data.employment_status || "",
        });
      }
    };
    
    loadExistingData();
  }, [user, form]);

  async function onSubmit(values: z.infer<typeof additionalInfoSchema>) {
    if (!user) return;
    
    const { error } = await supabase
      .from('user_additional_info')
      .upsert({
        user_id: user.id,
        citizenship_status: values.citizenshipStatus,
        ssn: values.ssn,
        income_range: values.incomeRange,
        net_worth: values.netWorth,
        investor_type: values.investorType,
        investing_objective: values.investingObjective,
        tax_bracket_capital: values.taxBracketCapital,
        tax_bracket_income: values.taxBracketIncome,
        ira_contribution: values.iraContribution,
        employment_status: values.employmentStatus,
        updated_at: new Date().toISOString(),
      });
      
    if (error) {
      toast.error("Failed to save additional information");
      console.error(error);
    } else {
      onSave();
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-2">Additional Information</h2>
        <p className="text-sm text-gray-400">Please provide additional details about your financial situation.</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="citizenshipStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">Citizenship Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-transparent border-gray-700 text-white">
                        <SelectValue placeholder="Select citizenship status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[#0F0F2D] border-gray-700 text-white">
                      <SelectItem value="us-citizen">US Citizen</SelectItem>
                      <SelectItem value="permanent-resident">Permanent Resident</SelectItem>
                      <SelectItem value="non-resident">Non-Resident</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="ssn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">SSN</FormLabel>
                  <FormControl>
                    <Input 
                      type="password"
                      placeholder="Social Security Number" 
                      {...field} 
                      className="bg-transparent border-gray-700 text-white focus:border-blue-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="incomeRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">Annual Income Range</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-transparent border-gray-700 text-white">
                        <SelectValue placeholder="Select income range" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[#0F0F2D] border-gray-700 text-white">
                      <SelectItem value="under-50k">Under $50,000</SelectItem>
                      <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                      <SelectItem value="100k-250k">$100,000 - $250,000</SelectItem>
                      <SelectItem value="250k-500k">$250,000 - $500,000</SelectItem>
                      <SelectItem value="over-500k">Over $500,000</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="netWorth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">Net Worth</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-transparent border-gray-700 text-white">
                        <SelectValue placeholder="Select net worth range" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[#0F0F2D] border-gray-700 text-white">
                      <SelectItem value="under-100k">Under $100,000</SelectItem>
                      <SelectItem value="100k-500k">$100,000 - $500,000</SelectItem>
                      <SelectItem value="500k-1m">$500,000 - $1,000,000</SelectItem>
                      <SelectItem value="1m-5m">$1,000,000 - $5,000,000</SelectItem>
                      <SelectItem value="over-5m">Over $5,000,000</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="employmentStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">Employment Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-transparent border-gray-700 text-white">
                        <SelectValue placeholder="Select employment status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[#0F0F2D] border-gray-700 text-white">
                      <SelectItem value="employed">Employed</SelectItem>
                      <SelectItem value="self-employed">Self-Employed</SelectItem>
                      <SelectItem value="retired">Retired</SelectItem>
                      <SelectItem value="unemployed">Unemployed</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="iraContribution"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="border-gray-700"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-gray-400">
                    I contribute to an IRA
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Save Additional Information
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
