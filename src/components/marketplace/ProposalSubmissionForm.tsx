
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, DollarSign, FileText, MessageSquare, Upload } from "lucide-react";
import { FileUpload } from "@/components/ui/file-upload";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";

// Define the form schema
const proposalSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  servicesDescription: z.string().min(50, "Description must be at least 50 characters"),
  workPlan: z.string().min(50, "Work plan must be at least 50 characters"),
  pricingType: z.enum(["hourly", "fixed", "custom"]),
  pricingAmount: z.string().optional(),
  pricingDetails: z.string().min(10, "Please provide pricing details"),
  estimatedTimeline: z.string().min(2, "Please specify an estimated timeline"),
  milestones: z.string().min(10, "Please provide at least one milestone"),
  additionalInfo: z.string().optional(),
  contactEmail: z.string().email("Please enter a valid email"),
  contactPhone: z.string().optional(),
});

type ProposalFormValues = z.infer<typeof proposalSchema>;

interface ProposalSubmissionFormProps {
  rfpId: string;
}

export function ProposalSubmissionForm({ rfpId }: ProposalSubmissionFormProps) {
  const [supportingDocs, setSupportingDocs] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize the form
  const form = useForm<ProposalFormValues>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      title: "",
      servicesDescription: "",
      workPlan: "",
      pricingType: "fixed",
      pricingAmount: "",
      pricingDetails: "",
      estimatedTimeline: "",
      milestones: "",
      additionalInfo: "",
      contactEmail: "",
      contactPhone: "",
    },
  });
  
  // Handle file upload
  const handleFileChange = (file: File) => {
    setSupportingDocs([...supportingDocs, file]);
  };
  
  // Remove a file from the list
  const removeFile = (index: number) => {
    const newFiles = [...supportingDocs];
    newFiles.splice(index, 1);
    setSupportingDocs(newFiles);
  };
  
  // Handle form submission
  const onSubmit = (data: ProposalFormValues) => {
    setIsSubmitting(true);
    
    // This would be an API call in a real application
    setTimeout(() => {
      console.log("Proposal data:", data);
      console.log("Supporting documents:", supportingDocs);
      
      // Show success message
      toast.success("Proposal submitted successfully!", {
        description: "The client will be notified of your proposal.",
      });
      
      setIsSubmitting(false);
      form.reset();
      setSupportingDocs([]);
    }, 1500);
  };
  
  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Basic Proposal Information */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Proposal Details</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Provide an overview of your proposed services and approach.
              </p>
            </div>
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proposal Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Comprehensive Tax Planning Solution" {...field} />
                  </FormControl>
                  <FormDescription>
                    A clear, concise title for your proposal.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="servicesDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proposed Services</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the services you're offering..." 
                      className="min-h-[120px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Detail the specific services you'll provide to address the client's needs.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="workPlan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detailed Work Plan</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Outline your approach and methodology..." 
                      className="min-h-[120px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Outline your approach, methodology, and key deliverables.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <Separator className="my-8" />
          
          {/* Pricing Section */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium flex items-center">
                <DollarSign className="h-5 w-5 mr-1" />
                Pricing and Payment Structure
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Clearly define your pricing model and payment terms.
              </p>
            </div>
            
            <FormField
              control={form.control}
              name="pricingType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pricing Model</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="hourly" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Hourly Rate
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="fixed" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Fixed Price
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="custom" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Custom Structure
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {form.watch("pricingType") !== "custom" && (
              <FormField
                control={form.control}
                name="pricingAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {form.watch("pricingType") === "hourly" 
                        ? "Hourly Rate ($)" 
                        : "Fixed Price ($)"}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 250" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="pricingDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pricing Details</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Explain your pricing structure, payment schedule, etc..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Provide details about payment schedule, terms, and any additional costs.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <Separator className="my-8" />
          
          {/* Timeline Section */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium flex items-center">
                <Clock className="h-5 w-5 mr-1" />
                Timeline and Milestones
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Define the project timeline and key milestones.
              </p>
            </div>
            
            <FormField
              control={form.control}
              name="estimatedTimeline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated Timeline</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 3 months" {...field} />
                  </FormControl>
                  <FormDescription>
                    The estimated duration to complete the project.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="milestones"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key Milestones</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="List key project milestones and their timelines..." 
                      className="min-h-[120px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    List the major milestones and their expected completion dates.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <Separator className="my-8" />
          
          {/* Supporting Documents */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium flex items-center">
                <FileText className="h-5 w-5 mr-1" />
                Supporting Documents
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Upload case studies, client references, or other relevant documents.
              </p>
            </div>
            
            <div className="space-y-4">
              <FileUpload 
                onFileChange={handleFileChange}
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                maxSize={10 * 1024 * 1024} // 10MB
              />
              
              {supportingDocs.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Uploaded Documents</p>
                  {supportingDocs.map((file, index) => (
                    <Card key={index} className="p-0">
                      <CardContent className="flex items-center justify-between p-3">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeFile(index)}
                          className="h-8 w-8 p-0"
                        >
                          &times;
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
            
            <FormField
              control={form.control}
              name="additionalInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Information</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any other relevant information to support your proposal..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Provide any other relevant information that supports your proposal.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <Separator className="my-8" />
          
          {/* Contact Information */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium flex items-center">
                <MessageSquare className="h-5 w-5 mr-1" />
                Communication Options
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Provide your preferred contact information for client communication.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your-email@example.com" {...field} />
                    </FormControl>
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
                      <Input placeholder="(123) 456-7890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4 text-sm">
              <h4 className="font-medium mb-2">Consultation Scheduling</h4>
              <p className="text-muted-foreground mb-3">
                Would you like to offer a free consultation to discuss the proposal in detail?
              </p>
              <Button variant="outline" className="gap-2">
                <Calendar className="h-4 w-4" />
                Add Availability for Consultations
              </Button>
            </div>
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-end">
            <Button type="button" variant="outline">
              Save as Draft
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Proposal"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
