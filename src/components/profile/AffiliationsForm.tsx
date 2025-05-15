
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { AlertCircle } from "lucide-react";
import { useAffiliations, Affiliation } from "@/hooks/useAffiliations";

// Define form schema with validation
const affiliationsFormSchema = z.object({
  stock_exchange_or_finra: z.boolean().default(false),
  public_company: z.boolean().default(false),
  us_politically_exposed: z.boolean().default(false),
  awm_employee: z.boolean().default(false),
  custodian: z.boolean().default(false),
  broker_dealer: z.boolean().default(false),
  family_broker_dealer: z.boolean().default(false),
});

type AffiliationFormValues = z.infer<typeof affiliationsFormSchema>;

export function AffiliationsForm({ onSave }: { onSave: () => void }) {
  const { affiliations, isLoading, error: apiError, saveAffiliations } = useAffiliations();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with resolver and default values
  const form = useForm<AffiliationFormValues>({
    resolver: zodResolver(affiliationsFormSchema),
    defaultValues: {
      stock_exchange_or_finra: false,
      public_company: false,
      us_politically_exposed: false,
      awm_employee: false,
      custodian: false,
      broker_dealer: false,
      family_broker_dealer: false,
    }
  });

  // Update form values when affiliations are loaded
  useEffect(() => {
    if (affiliations) {
      form.reset({
        stock_exchange_or_finra: affiliations.stock_exchange_or_finra || false,
        public_company: affiliations.public_company || false,
        us_politically_exposed: affiliations.us_politically_exposed || false,
        awm_employee: affiliations.awm_employee || false,
        custodian: affiliations.custodian || false,
        broker_dealer: affiliations.broker_dealer || false,
        family_broker_dealer: affiliations.family_broker_dealer || false,
      });
    }
  }, [affiliations, form]);

  // Update error state when API error changes
  useEffect(() => {
    setError(apiError);
  }, [apiError]);

  // Form submission handler
  const onSubmit = async (data: AffiliationFormValues) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const success = await saveAffiliations(data as Partial<Affiliation>);
      
      if (success) {
        toast.success("Affiliations saved successfully");
        
        // Call the onSave callback
        if (onSave) {
          setTimeout(() => onSave(), 300);
        }
      }
    } catch (err) {
      console.error("Error saving affiliations:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to save affiliations";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Affiliations</h2>
        <p className="text-sm text-muted-foreground">
          Please indicate if you have any of the following affiliations.
        </p>
      </div>
      
      {error && (
        <div className="bg-destructive/15 p-4 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 text-destructive mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <span className="ml-3">Loading affiliations...</span>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="p-4 border rounded-md bg-card space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="stock_exchange_or_finra"
                  checked={form.watch('stock_exchange_or_finra')}
                  onCheckedChange={(checked) => form.setValue('stock_exchange_or_finra', !!checked)}
                />
                <div className="space-y-1">
                  <Label htmlFor="stock_exchange_or_finra" className="font-medium">
                    Stock Exchange or FINRA
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Are you or any immediate family member employed by a stock exchange, FINRA, or similar regulatory organization?
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="public_company"
                  checked={form.watch('public_company')}
                  onCheckedChange={(checked) => form.setValue('public_company', !!checked)}
                />
                <div className="space-y-1">
                  <Label htmlFor="public_company" className="font-medium">
                    Publicly Traded Company
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Are you a director, officer, or 10% shareholder of a publicly traded company?
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="us_politically_exposed"
                  checked={form.watch('us_politically_exposed')}
                  onCheckedChange={(checked) => form.setValue('us_politically_exposed', !!checked)}
                />
                <div className="space-y-1">
                  <Label htmlFor="us_politically_exposed" className="font-medium">
                    Politically Exposed Person
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Are you or any immediate family member a senior political figure or otherwise politically exposed?
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="awm_employee"
                  checked={form.watch('awm_employee')}
                  onCheckedChange={(checked) => form.setValue('awm_employee', !!checked)}
                />
                <div className="space-y-1">
                  <Label htmlFor="awm_employee" className="font-medium">
                    AWM Employee
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Are you an employee of AWM or any related entity?
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="custodian"
                  checked={form.watch('custodian')}
                  onCheckedChange={(checked) => form.setValue('custodian', !!checked)}
                />
                <div className="space-y-1">
                  <Label htmlFor="custodian" className="font-medium">
                    Custodian Employee
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Are you an employee of a custodian, bank, or financial institution?
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="broker_dealer"
                  checked={form.watch('broker_dealer')}
                  onCheckedChange={(checked) => form.setValue('broker_dealer', !!checked)}
                />
                <div className="space-y-1">
                  <Label htmlFor="broker_dealer" className="font-medium">
                    Broker-Dealer Employee
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Are you an employee of a broker-dealer?
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="family_broker_dealer"
                  checked={form.watch('family_broker_dealer')}
                  onCheckedChange={(checked) => form.setValue('family_broker_dealer', !!checked)}
                />
                <div className="space-y-1">
                  <Label htmlFor="family_broker_dealer" className="font-medium">
                    Family Member of Broker-Dealer Employee
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Do you have an immediate family member who is an employee of a broker-dealer?
                  </p>
                </div>
              </div>
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
