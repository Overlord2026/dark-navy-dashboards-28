
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ChevronLeft, ChevronRight, Save, PieChart, LineChart, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Define form validation schema
const formSchema = z.object({
  portfolioName: z.string().min(3, {
    message: "Portfolio name must be at least 3 characters.",
  }),
  objective: z.enum(["growth", "income", "balanced"]),
  timeHorizon: z.number().min(1).max(30),
  riskTolerance: z.enum(["low", "medium-low", "medium", "medium-high", "high"]),
  initialInvestment: z.number().min(1000),
});

type FormValues = z.infer<typeof formSchema>;

const PortfolioBuilder = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  
  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      portfolioName: "Personal Growth Portfolio",
      objective: "growth",
      timeHorizon: 15,
      riskTolerance: "medium",
      initialInvestment: 25000,
    },
  });

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate("/investments");
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const onSubmit = (data: FormValues) => {
    toast.success("Portfolio created successfully!");
    console.log("Portfolio data:", data);
    // In a real implementation, this would save the portfolio and navigate
    setTimeout(() => {
      navigate("/investments");
    }, 1500);
  };

  return (
    <ThreeColumnLayout activeMainItem="investments" title="Portfolio Builder">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={handleBack} className="flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" /> 
            {step === 1 ? "Back to Investments" : "Previous Step"}
          </Button>
          <div className="text-sm text-muted-foreground">
            Step {step} of {totalSteps}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left sidebar */}
          <div className="w-full md:w-1/3 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl">Build Your Portfolio</CardTitle>
                  <Briefcase className="h-8 w-8 text-primary" />
                </div>
                <CardDescription>
                  Customize your investment strategy based on your goals and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className={`flex items-center gap-3 p-3 rounded-md transition-colors ${step === 1 ? 'bg-primary/10 text-primary' : ''}`}>
                    <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${step === 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      1
                    </div>
                    <div>Portfolio Basics</div>
                  </div>
                  
                  <div className={`flex items-center gap-3 p-3 rounded-md transition-colors ${step === 2 ? 'bg-primary/10 text-primary' : ''}`}>
                    <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${step === 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      2
                    </div>
                    <div>Risk & Objectives</div>
                  </div>
                  
                  <div className={`flex items-center gap-3 p-3 rounded-md transition-colors ${step === 3 ? 'bg-primary/10 text-primary' : ''}`}>
                    <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${step === 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      3
                    </div>
                    <div>Asset Allocation</div>
                  </div>
                  
                  <div className={`flex items-center gap-3 p-3 rounded-md transition-colors ${step === 4 ? 'bg-primary/10 text-primary' : ''}`}>
                    <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${step === 4 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      4
                    </div>
                    <div>Review & Confirm</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Boutique Family Office</CardTitle>
                <CardDescription>Custom Portfolio Creation</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="text-sm text-muted-foreground space-y-4">
                  <p>
                    Our team of investment professionals specializes in creating bespoke investment portfolios tailored to your unique financial goals.
                  </p>
                  <p>
                    With decades of experience navigating complex markets, we offer sophisticated strategies typically reserved for ultra-high-net-worth families.
                  </p>
                  <Button variant="outline" className="w-full mt-2" onClick={() => toast.success("Opening scheduler for consultation")}>
                    Schedule a Consultation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main content */}
          <div className="w-full md:w-2/3">
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">
                  {step === 1 && "Define the basics of your new portfolio"}
                  {step === 2 && "Set your risk profile and investment objectives"}
                  {step === 3 && "Customize your asset allocation"}
                  {step === 4 && "Review and confirm your portfolio"}
                </CardTitle>
                <CardDescription>
                  {step === 1 && "Let's start by naming your portfolio and setting fundamental parameters"}
                  {step === 2 && "Define your risk tolerance and investment timeframe"}
                  {step === 3 && "Adjust the allocation between different asset classes"}
                  {step === 4 && "Check all details before finalizing your portfolio"}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* Step 1: Portfolio Basics */}
                    {step === 1 && (
                      <>
                        <FormField
                          control={form.control}
                          name="portfolioName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Portfolio Name</FormLabel>
                              <FormControl>
                                <Input placeholder="My Investment Portfolio" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="initialInvestment"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Initial Investment Amount ($)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="25000" 
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="objective"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Investment Objective</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select your investment objective" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="growth">Growth - Focus on capital appreciation</SelectItem>
                                  <SelectItem value="income">Income - Focus on regular income</SelectItem>
                                  <SelectItem value="balanced">Balanced - Balance of growth and income</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex justify-end">
                          <Button type="button" onClick={handleNext} className="flex items-center gap-1">
                            Next Step <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                    
                    {/* Step 2: Risk Profile */}
                    {step === 2 && (
                      <>
                        <FormField
                          control={form.control}
                          name="riskTolerance"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Risk Tolerance</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select your risk tolerance" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="low">Low - Capital preservation is priority</SelectItem>
                                  <SelectItem value="medium-low">Medium-Low - Some volatility acceptable</SelectItem>
                                  <SelectItem value="medium">Medium - Balanced risk and return</SelectItem>
                                  <SelectItem value="medium-high">Medium-High - Higher volatility for growth</SelectItem>
                                  <SelectItem value="high">High - Maximum growth with significant volatility</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="timeHorizon"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Investment Time Horizon (Years): {field.value}</FormLabel>
                              <FormControl>
                                <div className="space-y-4">
                                  <Slider
                                    min={1}
                                    max={30}
                                    step={1}
                                    value={[field.value]}
                                    onValueChange={(value) => field.onChange(value[0])}
                                  />
                                  <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Short Term</span>
                                    <span>Medium Term</span>
                                    <span>Long Term</span>
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex justify-between">
                          <Button type="button" variant="outline" onClick={handleBack}>
                            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                          </Button>
                          <Button type="button" onClick={handleNext} className="flex items-center gap-1">
                            Next Step <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                    
                    {/* Step 3: Asset Allocation */}
                    {step === 3 && (
                      <>
                        <div className="space-y-8">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">US Equities: 45%</label>
                            <Slider
                              min={0}
                              max={100}
                              step={5}
                              defaultValue={[45]}
                              onValueChange={(value) => console.log("US Equities:", value[0])}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">International Equities: 25%</label>
                            <Slider
                              min={0}
                              max={100}
                              step={5}
                              defaultValue={[25]}
                              onValueChange={(value) => console.log("International Equities:", value[0])}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Fixed Income: 20%</label>
                            <Slider
                              min={0}
                              max={100}
                              step={5}
                              defaultValue={[20]}
                              onValueChange={(value) => console.log("Fixed Income:", value[0])}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Alternative Investments: 8%</label>
                            <Slider
                              min={0}
                              max={100}
                              step={5}
                              defaultValue={[8]}
                              onValueChange={(value) => console.log("Alternative Investments:", value[0])}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Cash & Equivalents: 2%</label>
                            <Slider
                              min={0}
                              max={100}
                              step={5}
                              defaultValue={[2]}
                              onValueChange={(value) => console.log("Cash:", value[0])}
                            />
                          </div>
                          
                          <div className="h-48 flex items-center justify-center bg-muted/20 rounded-md">
                            <div className="text-center text-muted-foreground">
                              <PieChart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                              <p>Asset allocation visualization</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between">
                          <Button type="button" variant="outline" onClick={handleBack}>
                            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                          </Button>
                          <Button type="button" onClick={handleNext} className="flex items-center gap-1">
                            Review Portfolio <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                    
                    {/* Step 4: Review and Confirm */}
                    {step === 4 && (
                      <>
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground">Portfolio Name</h3>
                              <p className="font-medium">{form.getValues().portfolioName}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground">Initial Investment</h3>
                              <p className="font-medium">${form.getValues().initialInvestment.toLocaleString()}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground">Investment Objective</h3>
                              <p className="font-medium capitalize">{form.getValues().objective}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground">Risk Tolerance</h3>
                              <p className="font-medium capitalize">{form.getValues().riskTolerance.replace('-', ' ')}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground">Time Horizon</h3>
                              <p className="font-medium">{form.getValues().timeHorizon} years</p>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-3">Asset Allocation</h3>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm">US Equities</span>
                                <span className="text-sm font-medium">45%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">International Equities</span>
                                <span className="text-sm font-medium">25%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">Fixed Income</span>
                                <span className="text-sm font-medium">20%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">Alternative Investments</span>
                                <span className="text-sm font-medium">8%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">Cash & Equivalents</span>
                                <span className="text-sm font-medium">2%</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="h-48 flex items-center justify-center bg-muted/20 rounded-md">
                            <div className="text-center text-muted-foreground">
                              <LineChart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                              <p>Portfolio projection visualization</p>
                              <p className="text-xs mt-1">Expected annual return: 8.4%</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between">
                          <Button type="button" variant="outline" onClick={handleBack}>
                            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                          </Button>
                          <Button type="submit" className="flex items-center gap-1">
                            <Save className="h-4 w-4 mr-1" /> Create Portfolio
                          </Button>
                        </div>
                      </>
                    )}
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default PortfolioBuilder;
