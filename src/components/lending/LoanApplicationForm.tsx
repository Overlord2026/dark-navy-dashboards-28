
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const loanApplicationSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
  
  // Financial Information
  annualIncome: z.string().min(1, { message: "Annual income is required." }),
  employmentStatus: z.string().min(1, { message: "Employment status is required." }),
  creditScore: z.string().min(1, { message: "Credit score range is required." }),
  
  // Loan Details
  loanAmount: z.string().min(1, { message: "Loan amount is required." }),
  loanPurpose: z.string().min(1, { message: "Loan purpose is required." }),
  loanTerm: z.string().min(1, { message: "Loan term is required." }),
  
  // Additional Information
  additionalInfo: z.string().optional(),
  
  // Consent
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions.",
  }),
});

type LoanApplicationFormValues = z.infer<typeof loanApplicationSchema>;

interface LoanApplicationFormProps {
  loanType: string;
  onProgress: (progress: number) => void;
  onComplete: (data: LoanApplicationFormValues) => void;
  onCancel: () => void;
}

export function LoanApplicationForm({ loanType, onProgress, onComplete, onCancel }: LoanApplicationFormProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  
  const form = useForm<LoanApplicationFormValues>({
    resolver: zodResolver(loanApplicationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      annualIncome: "",
      employmentStatus: "",
      creditScore: "",
      loanAmount: "",
      loanPurpose: "",
      loanTerm: "",
      additionalInfo: "",
      agreeToTerms: false,
    },
  });
  
  const getLoanTypeName = () => {
    switch(loanType) {
      case "mortgage": return "Mortgage";
      case "commercial": return "Commercial Real Estate Loan";
      case "auto": return "Auto Loan";
      case "business": return "Business Loan";
      case "personal": return "Personal Loan";
      default: return "Loan";
    }
  };
  
  const handleSubmitStep = () => {
    const nextStep = step + 1;
    if (nextStep <= totalSteps) {
      setStep(nextStep);
      const progressPercentage = Math.round((nextStep / totalSteps) * 75) + 25;
      onProgress(progressPercentage);
    } else {
      // Final submission
      form.handleSubmit((data) => {
        onProgress(100);
        onComplete(data);
      })();
    }
  };
  
  const goToPreviousStep = () => {
    const prevStep = step - 1;
    if (prevStep >= 1) {
      setStep(prevStep);
      const progressPercentage = Math.round((prevStep / totalSteps) * 75) + 25;
      onProgress(progressPercentage);
    }
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium mb-2">{getLoanTypeName()} Application</h2>
      
      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-sm font-medium uppercase text-muted-foreground mb-4">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="First name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-sm font-medium uppercase text-muted-foreground mb-4">Financial Information</h3>
              
              <FormField
                control={form.control}
                name="annualIncome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Income</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Annual income" 
                        {...field} 
                        type="number" 
                        min="0"
                        step="1000"
                      />
                    </FormControl>
                    <FormDescription>
                      Enter your annual income before taxes.
                    </FormDescription>
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
                        <SelectItem value="employed-full-time">Employed Full-Time</SelectItem>
                        <SelectItem value="employed-part-time">Employed Part-Time</SelectItem>
                        <SelectItem value="self-employed">Self-Employed</SelectItem>
                        <SelectItem value="retired">Retired</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="unemployed">Unemployed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="creditScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Credit Score Range</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select credit score range" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent (750+)</SelectItem>
                        <SelectItem value="good">Good (700-749)</SelectItem>
                        <SelectItem value="fair">Fair (650-699)</SelectItem>
                        <SelectItem value="poor">Poor (600-649)</SelectItem>
                        <SelectItem value="very-poor">Very Poor (below 600)</SelectItem>
                        <SelectItem value="unknown">I don't know</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-sm font-medium uppercase text-muted-foreground mb-4">Loan Details</h3>
              
              <FormField
                control={form.control}
                name="loanAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loan Amount ($)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter loan amount" 
                        {...field} 
                        type="number" 
                        min="1000"
                        step="1000"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="loanPurpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loan Purpose</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select loan purpose" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {loanType === "mortgage" && (
                          <>
                            <SelectItem value="purchase">Home Purchase</SelectItem>
                            <SelectItem value="refinance">Refinance</SelectItem>
                            <SelectItem value="home-equity">Home Equity</SelectItem>
                            <SelectItem value="construction">Construction</SelectItem>
                          </>
                        )}
                        
                        {loanType === "auto" && (
                          <>
                            <SelectItem value="new-purchase">New Vehicle Purchase</SelectItem>
                            <SelectItem value="used-purchase">Used Vehicle Purchase</SelectItem>
                            <SelectItem value="refinance">Refinance</SelectItem>
                          </>
                        )}
                        
                        {loanType === "business" && (
                          <>
                            <SelectItem value="working-capital">Working Capital</SelectItem>
                            <SelectItem value="equipment">Equipment Purchase</SelectItem>
                            <SelectItem value="expansion">Business Expansion</SelectItem>
                            <SelectItem value="inventory">Inventory</SelectItem>
                          </>
                        )}
                        
                        {loanType === "commercial" && (
                          <>
                            <SelectItem value="purchase">Property Purchase</SelectItem>
                            <SelectItem value="refinance">Refinance</SelectItem>
                            <SelectItem value="development">Development</SelectItem>
                            <SelectItem value="renovation">Renovation</SelectItem>
                          </>
                        )}
                        
                        {loanType === "personal" && (
                          <>
                            <SelectItem value="debt-consolidation">Debt Consolidation</SelectItem>
                            <SelectItem value="major-purchase">Major Purchase</SelectItem>
                            <SelectItem value="home-improvement">Home Improvement</SelectItem>
                            <SelectItem value="medical">Medical Expenses</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="loanTerm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loan Term (Years)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select loan term" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {loanType === "mortgage" && (
                          <>
                            <SelectItem value="15">15 Years</SelectItem>
                            <SelectItem value="20">20 Years</SelectItem>
                            <SelectItem value="30">30 Years</SelectItem>
                          </>
                        )}
                        
                        {loanType === "auto" && (
                          <>
                            <SelectItem value="3">3 Years</SelectItem>
                            <SelectItem value="4">4 Years</SelectItem>
                            <SelectItem value="5">5 Years</SelectItem>
                            <SelectItem value="6">6 Years</SelectItem>
                            <SelectItem value="7">7 Years</SelectItem>
                          </>
                        )}
                        
                        {loanType === "personal" && (
                          <>
                            <SelectItem value="1">1 Year</SelectItem>
                            <SelectItem value="2">2 Years</SelectItem>
                            <SelectItem value="3">3 Years</SelectItem>
                            <SelectItem value="4">4 Years</SelectItem>
                            <SelectItem value="5">5 Years</SelectItem>
                          </>
                        )}
                        
                        {(loanType === "business" || loanType === "commercial") && (
                          <>
                            <SelectItem value="5">5 Years</SelectItem>
                            <SelectItem value="7">7 Years</SelectItem>
                            <SelectItem value="10">10 Years</SelectItem>
                            <SelectItem value="15">15 Years</SelectItem>
                            <SelectItem value="20">20 Years</SelectItem>
                            <SelectItem value="25">25 Years</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="additionalInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Information (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Provide any additional information that may be relevant to your application" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          
          {step === 4 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-sm font-medium uppercase text-muted-foreground mb-4">Review & Submit</h3>
              
              <div className="rounded-lg border p-4 space-y-4">
                <div>
                  <h4 className="text-sm font-medium">Loan Type</h4>
                  <p>{getLoanTypeName()}</p>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium">Personal Information</h4>
                  <p className="text-sm">
                    {form.getValues("firstName")} {form.getValues("lastName")}
                  </p>
                  <p className="text-sm">Email: {form.getValues("email")}</p>
                  <p className="text-sm">Phone: {form.getValues("phone")}</p>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium">Financial Information</h4>
                  <p className="text-sm">Annual Income: ${form.getValues("annualIncome")}</p>
                  <p className="text-sm">Employment Status: {form.getValues("employmentStatus")}</p>
                  <p className="text-sm">Credit Score: {form.getValues("creditScore")}</p>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium">Loan Details</h4>
                  <p className="text-sm">Amount: ${form.getValues("loanAmount")}</p>
                  <p className="text-sm">Purpose: {form.getValues("loanPurpose")}</p>
                  <p className="text-sm">Term: {form.getValues("loanTerm")} years</p>
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="agreeToTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I agree to the terms and conditions
                      </FormLabel>
                      <FormDescription>
                        By submitting this application, you agree to our privacy policy and loan terms.
                      </FormDescription>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          )}
          
          <div className="flex justify-between mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={step === 1 ? onCancel : goToPreviousStep}
            >
              {step === 1 ? "Cancel" : "Back"}
            </Button>
            
            <Button
              type="button"
              onClick={handleSubmitStep}
              disabled={step === 4 && !form.getValues("agreeToTerms")}
            >
              {step < totalSteps ? "Continue" : "Submit Application"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
