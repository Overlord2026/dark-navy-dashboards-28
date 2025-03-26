
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const formSchema = z.object({
  citizenshipStatus: z.string().min(1, { message: "Citizenship status is required." }),
  ssn: z.string().min(1, { message: "SSN is required." }),
  incomeRange: z.string().min(1, { message: "Income range is required." }),
  netWorth: z.string().min(1, { message: "Net worth is required." }),
  investorType: z.string().min(1, { message: "Investor type is required." }),
  investingObjective: z.string().min(1, { message: "Investing objective is required." }),
  taxBracketCapital: z.string().min(1, { message: "Tax bracket is required." }),
  taxBracketIncome: z.string().min(1, { message: "Tax bracket is required." }),
  iraContribution: z.enum(["Yes", "No"]),
  employmentStatus: z.string().min(1, { message: "Employment status is required." }),
});

export function AdditionalInfoForm({ onSave }: { onSave: () => void }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      citizenshipStatus: "US",
      ssn: "000-00-0000",
      incomeRange: "500 - 1MM",
      netWorth: "0",
      investorType: "Moderate",
      investingObjective: "Both equally",
      taxBracketCapital: "20",
      taxBracketIncome: "37",
      iraContribution: "No",
      employmentStatus: "Retired",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    onSave();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Provide additional information</h2>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="citizenshipStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Citizenship Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select citizenship status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="US">US</SelectItem>
                      <SelectItem value="Permanent Resident">Permanent Resident</SelectItem>
                      <SelectItem value="Non-Resident Alien">Non-Resident Alien</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="ssn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SSN (or ITIN)</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="SSN or ITIN" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="incomeRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Income Range</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select income range" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0 - 50K">$0 - $50,000</SelectItem>
                      <SelectItem value="50K - 100K">$50,000 - $100,000</SelectItem>
                      <SelectItem value="100K - 250K">$100,000 - $250,000</SelectItem>
                      <SelectItem value="250K - 500K">$250,000 - $500,000</SelectItem>
                      <SelectItem value="500 - 1MM">$500,000 - $1,000,000</SelectItem>
                      <SelectItem value="1MM+">$1,000,000+</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="netWorth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Net Worth</FormLabel>
                  <FormControl>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
                        $
                      </span>
                      <Input 
                        className="rounded-l-none" 
                        placeholder="Net worth" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="investorType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Investor Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select investor type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Conservative">Conservative</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="Aggressive">Aggressive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="investingObjective"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Investing Objective</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select investing objective" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Growth">Growth</SelectItem>
                      <SelectItem value="Income">Income</SelectItem>
                      <SelectItem value="Both equally">Both equally</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="taxBracketCapital"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Tax Bracket (long-term capital gains)
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 ml-2 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Long-term capital gains tax rates are 0%, 15%, or 20% depending on your income.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <FormControl>
                    <div className="flex">
                      <Input 
                        className="rounded-r-none" 
                        placeholder="Tax bracket" 
                        {...field} 
                      />
                      <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-input bg-muted text-muted-foreground">
                        %
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="taxBracketIncome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Tax Bracket (ordinary income)
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 ml-2 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Ordinary income is taxed at rates from 10% to 37% depending on your income.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <FormControl>
                    <div className="flex">
                      <Input 
                        className="rounded-r-none" 
                        placeholder="Tax bracket" 
                        {...field} 
                      />
                      <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-input bg-muted text-muted-foreground">
                        %
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="iraContribution"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Have you contributed to an IRA outside of Farther this year?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-4"
                  >
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Yes" />
                      </FormControl>
                      <FormLabel className="font-normal">Yes</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="No" />
                      </FormControl>
                      <FormLabel className="font-normal">No</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="employmentStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employment Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employment status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Employed">Employed</SelectItem>
                    <SelectItem value="Self-Employed">Self-Employed</SelectItem>
                    <SelectItem value="Unemployed">Unemployed</SelectItem>
                    <SelectItem value="Retired">Retired</SelectItem>
                    <SelectItem value="Student">Student</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end">
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
