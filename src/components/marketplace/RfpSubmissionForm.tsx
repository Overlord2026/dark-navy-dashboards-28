
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  Pencil, 
  Clock, 
  DollarSign, 
  Users, 
  Send 
} from "lucide-react";
import { serviceCategories } from "./MarketplaceNavigation";

const rfpFormSchema = z.object({
  serviceType: z.string().min(1, { message: "Please select a service type" }),
  serviceSubcategory: z.string().optional(),
  projectTitle: z.string().min(5, {
    message: "Project title must be at least 5 characters",
  }),
  projectDescription: z.string().min(20, {
    message: "Project description must be at least 20 characters",
  }),
  expertiseLevel: z.enum(["basic", "advanced", "expert"] as const),
  timeline: z.string().min(1, { message: "Please select a timeline" }),
  budgetType: z.enum(["fixed", "range", "open"] as const),
  budgetMin: z.string().optional(),
  budgetMax: z.string().optional(),
  budgetFixed: z.string().optional(),
  visibility: z.enum(["public", "invitation"] as const),
  contactEmail: z.string().email({
    message: "Please enter a valid email address",
  }),
  contactPhone: z.string().optional(),
});

type RfpFormValues = z.infer<typeof rfpFormSchema>;

export function RfpSubmissionForm() {
  const form = useForm<RfpFormValues>({
    resolver: zodResolver(rfpFormSchema),
    defaultValues: {
      expertiseLevel: "advanced",
      budgetType: "range",
      visibility: "public",
    },
  });

  const watchServiceType = form.watch("serviceType");
  const watchBudgetType = form.watch("budgetType");
  
  // Find subcategories for the selected service type
  const subcategories = serviceCategories
    .find(cat => cat.id === watchServiceType)
    ?.subcategories || [];

  function onSubmit(data: RfpFormValues) {
    console.log("RFP Form Submission:", data);
    
    // In a real app, you would send this data to your backend
    toast.success("Your RFP has been submitted successfully", {
      description: "Service providers will be notified about your request."
    });
    
    form.reset();
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Submit a Request for Proposal (RFP)</CardTitle>
        <CardDescription>
          Complete this form to request proposals from service providers in our marketplace.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-medium">
                <Pencil className="h-5 w-5" />
                <h3>Service Details</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="serviceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a service category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {serviceCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose the type of service you need
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {watchServiceType && subcategories.length > 0 && (
                  <FormField
                    control={form.control}
                    name="serviceSubcategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Subcategory</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a subcategory" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {subcategories.map((subcategory) => (
                              <SelectItem key={subcategory.id} value={subcategory.id}>
                                {subcategory.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose a specific service subcategory
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <FormField
                control={form.control}
                name="projectTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Title</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., Estate Plan Refresh for Multi-generational Family" {...field} />
                    </FormControl>
                    <FormDescription>
                      A clear, concise title for your project
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="projectDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your project needs in detail..." 
                        className="min-h-[120px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Include important details, requirements, and any specific questions you have
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expertiseLevel"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Required Expertise Level</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="basic" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Basic - Standard service with minimal customization
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="advanced" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Advanced - Tailored service requiring specialized knowledge
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="expert" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Expert - Complex needs requiring top-tier expertise
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center gap-2 text-lg font-medium">
                <Clock className="h-5 w-5" />
                <h3>Timeline & Budget</h3>
              </div>

              <FormField
                control={form.control}
                name="timeline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Timeline</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a timeline" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="urgent">Urgent (Within 1 week)</SelectItem>
                        <SelectItem value="short">Short-term (1-4 weeks)</SelectItem>
                        <SelectItem value="medium">Medium-term (1-3 months)</SelectItem>
                        <SelectItem value="long">Long-term (3+ months)</SelectItem>
                        <SelectItem value="ongoing">Ongoing services</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      When do you need this project completed?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="budgetType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Budget Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="fixed" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Fixed Budget - Specific amount
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="range" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Budget Range - Minimum to maximum
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="open" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Open Budget - No specific amount
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchBudgetType === "fixed" && (
                <FormField
                  control={form.control}
                  name="budgetFixed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fixed Budget Amount ($)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="5000" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter your exact budget amount
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {watchBudgetType === "range" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="budgetMin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Budget ($)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="3000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="budgetMax"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Budget ($)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="7000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center gap-2 text-lg font-medium">
                <Users className="h-5 w-5" />
                <h3>Visibility & Contact</h3>
              </div>

              <FormField
                control={form.control}
                name="visibility"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>RFP Visibility</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="public" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Public - All qualified providers can view and respond
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="invitation" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Invitation Only - Only providers you select can view and respond
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your@email.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        Your primary contact email
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Phone (Optional)</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="(123) 456-7890" {...field} />
                      </FormControl>
                      <FormDescription>
                        Your phone number for providers to contact you
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" className="gap-2">
                <Send className="h-4 w-4" />
                Submit RFP
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4 text-sm text-muted-foreground">
        <p>
          After submission, you'll be able to track responses in your dashboard.
        </p>
        <div className="flex items-center gap-1">
          <DollarSign className="h-3.5 w-3.5" />
          <span>No fee to submit RFPs</span>
        </div>
      </CardFooter>
    </Card>
  );
}
