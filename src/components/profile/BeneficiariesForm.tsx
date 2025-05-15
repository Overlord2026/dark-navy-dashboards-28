
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Trash2, Plus, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useBeneficiaries, Beneficiary } from "@/hooks/useBeneficiaries";

// Define form schema with validation
const beneficiarySchema = z.object({
  first_name: z.string().min(2, { message: "First name must be at least 2 characters" }),
  last_name: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  relationship: z.string().min(1, { message: "Please select a relationship" }),
  date_of_birth: z.string().optional(),
  ssn: z.string().optional(),
  email: z.string().email({ message: "Invalid email address" }).optional().or(z.literal('')),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip_code: z.string().optional(),
});

const beneficiariesFormSchema = z.object({
  beneficiaries: z.array(beneficiarySchema).min(1, { message: "At least one beneficiary is required" }),
});

type BeneficiaryFormValues = z.infer<typeof beneficiariesFormSchema>;

export function BeneficiariesForm({ onSave }: { onSave: () => void }) {
  const { beneficiaries, isLoading, error: apiError, saveBeneficiaries } = useBeneficiaries();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with resolver and default values
  const form = useForm<BeneficiaryFormValues>({
    resolver: zodResolver(beneficiariesFormSchema),
    defaultValues: {
      beneficiaries: beneficiaries.length > 0 
        ? beneficiaries 
        : [{ first_name: "", last_name: "", relationship: "" }]
    }
  });

  // Set up field array for beneficiaries
  const { fields, append, remove } = useFieldArray({
    name: "beneficiaries",
    control: form.control,
  });

  // Form submission handler
  const onSubmit: SubmitHandler<BeneficiaryFormValues> = async (data) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const success = await saveBeneficiaries(data.beneficiaries as Beneficiary[]);
      
      if (success) {
        toast.success("Beneficiaries saved successfully");
        
        // Call the onSave callback
        if (onSave) {
          setTimeout(() => onSave(), 300);
        }
      }
    } catch (err) {
      console.error("Error saving beneficiaries:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to save beneficiaries";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Beneficiaries</h2>
        <p className="text-sm text-muted-foreground">
          Add and manage your account beneficiaries.
        </p>
      </div>
      
      {(error || apiError) && (
        <div className="bg-destructive/15 p-4 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 text-destructive mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-destructive">{error || apiError}</p>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <span className="ml-3">Loading beneficiaries...</span>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6">
              {fields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-md bg-card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Beneficiary {index + 1}</h3>
                    {fields.length > 1 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`beneficiaries.${index}.first_name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Jane" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`beneficiaries.${index}.last_name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`beneficiaries.${index}.relationship`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Relationship *</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select relationship" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="spouse">Spouse</SelectItem>
                              <SelectItem value="child">Child</SelectItem>
                              <SelectItem value="parent">Parent</SelectItem>
                              <SelectItem value="sibling">Sibling</SelectItem>
                              <SelectItem value="friend">Friend</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`beneficiaries.${index}.date_of_birth`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`beneficiaries.${index}.email`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="jane@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`beneficiaries.${index}.address`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main St" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`beneficiaries.${index}.city`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="New York" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`beneficiaries.${index}.state`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input placeholder="NY" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`beneficiaries.${index}.zip_code`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ZIP Code</FormLabel>
                          <FormControl>
                            <Input placeholder="10001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ 
                  first_name: "", 
                  last_name: "", 
                  relationship: "" 
                })}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Beneficiary
              </Button>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
