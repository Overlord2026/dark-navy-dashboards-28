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
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const additionalInfoSchema = z.object({
  citizenshipStatus: z.string().min(1, { message: "Citizenship status is required." }),
  ssn: z.string().min(9, { message: "SSN or ITIN must be at least 9 digits." }),
  incomeRange: z.string().min(1, { message: "Income range is required." }),
  netWorth: z.string().min(1, { message: "Net worth is required." }),
  investorType: z.string().min(1, { message: "Investor type is required." }),
  investingObjective: z.string().min(1, { message: "Investing objective is required." }),
  taxBracketCapital: z.string().min(1, { message: "Tax bracket for capital gains is required." }),
  taxBracketIncome: z.string().min(1, { message: "Tax bracket for income is required." }),
});

export function AdditionalInfoForm({ onSave }: { onSave: () => void }) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  
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
    },
  });

  React.useEffect(() => {
    const loadExistingData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        console.log("Loading additional info for user:", user.id);
        
        const { data, error } = await supabase
          .from('user_additional_info')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (error) {
          console.error("Error loading additional info:", error);
          toast.error("Failed to load existing information");
        } else if (data) {
          console.log("Loaded additional info:", data);
          form.reset({
            citizenshipStatus: data.citizenship_status || "",
            ssn: data.ssn || "",
            incomeRange: data.income_range || "",
            netWorth: data.net_worth || "",
            investorType: data.investor_type || "",
            investingObjective: data.investing_objective || "",
            taxBracketCapital: data.tax_bracket_capital || "",
            taxBracketIncome: data.tax_bracket_income || "",
          });
        } else {
          console.log("No existing additional info found");
        }
      } catch (error) {
        console.error("Unexpected error loading additional info:", error);
        toast.error("Failed to load existing information");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadExistingData();
  }, [user, form]);

  async function onSubmit(values: z.infer<typeof additionalInfoSchema>) {
    if (!user) {
      toast.error("User not authenticated");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Saving additional info:", values);
      
      // First, check if a record exists
      const { data: existingData } = await supabase
        .from('user_additional_info')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      const additionalInfoData = {
        user_id: user.id,
        citizenship_status: values.citizenshipStatus,
        ssn: values.ssn,
        income_range: values.incomeRange,
        net_worth: values.netWorth,
        investor_type: values.investorType,
        investing_objective: values.investingObjective,
        tax_bracket_capital: values.taxBracketCapital,
        tax_bracket_income: values.taxBracketIncome,
        updated_at: new Date().toISOString(),
      };

      let error;

      if (existingData) {
        // Update existing record
        console.log("Updating existing additional info record");
        const { error: updateError } = await supabase
          .from('user_additional_info')
          .update(additionalInfoData)
          .eq('user_id', user.id);
        error = updateError;
      } else {
        // Insert new record
        console.log("Creating new additional info record");
        const { error: insertError } = await supabase
          .from('user_additional_info')
          .insert([additionalInfoData]);
        error = insertError;
      }

      if (error) {
        console.error("Database operation error:", error);
        toast.error("Failed to save additional information");
      } else {
        console.log("Additional info saved successfully");
        toast.success("Additional information saved successfully");
        onSave();
      }
    } catch (error) {
      console.error("Unexpected error saving additional info:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white mb-2">Additional Information</h2>
          <p className="text-sm text-gray-400">Loading your information...</p>
        </div>
      </div>
    );
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-transparent border-gray-700 text-white">
                        <SelectValue placeholder="Select citizenship status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[#0F0F2D] border-gray-700 text-white">
                      <SelectItem value="us-citizen">US Citizen</SelectItem>
                      <SelectItem value="permanent-resident">Permanent Resident</SelectItem>
                      <SelectItem value="non-resident-alien">Non-Resident Alien</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
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
                  <FormLabel className="text-gray-400">SSN (or ITIN)</FormLabel>
                  <FormControl>
                    <Input 
                      type="password"
                      placeholder="SSN or ITIN" 
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
                  <FormLabel className="text-gray-400">Income Range</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
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
                      <SelectItem value="500k-1m">$500,000 - $1,000,000</SelectItem>
                      <SelectItem value="over-1m">Over $1,000,000</SelectItem>
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
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                      <Input 
                        placeholder="Net worth" 
                        {...field} 
                        className="pl-8 bg-transparent border-gray-700 text-white focus:border-blue-500"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="investorType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">Investor Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-transparent border-gray-700 text-white">
                        <SelectValue placeholder="Select investor type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[#0F0F2D] border-gray-700 text-white">
                      <SelectItem value="conservative">Conservative</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="aggressive">Aggressive</SelectItem>
                      <SelectItem value="accredited">Accredited Investor</SelectItem>
                      <SelectItem value="qualified-purchaser">Qualified Purchaser</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="investingObjective"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">Investing Objective</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-transparent border-gray-700 text-white">
                        <SelectValue placeholder="Select investing objective" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[#0F0F2D] border-gray-700 text-white">
                      <SelectItem value="capital-preservation">Capital Preservation</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="growth">Growth</SelectItem>
                      <SelectItem value="aggressive-growth">Aggressive Growth</SelectItem>
                      <SelectItem value="speculation">Speculation</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="taxBracketCapital"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">Tax Bracket (long-term capital gains)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        placeholder="Tax bracket" 
                        {...field} 
                        className="pr-8 bg-transparent border-gray-700 text-white focus:border-blue-500"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="taxBracketIncome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">Tax Bracket (ordinary income)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        placeholder="Tax bracket" 
                        {...field} 
                        className="pr-8 bg-transparent border-gray-700 text-white focus:border-blue-500"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
          </div>
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {isSubmitting ? "Saving..." : "Save Additional Information"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
