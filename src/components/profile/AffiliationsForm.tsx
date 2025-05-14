
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import { AlertCircle } from "lucide-react";

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
  const { userProfile } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [affiliationId, setAffiliationId] = useState<string | null>(null);

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

  // Load affiliations from Supabase on component mount
  useEffect(() => {
    const loadAffiliations = async () => {
      if (!userProfile?.id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('user_affiliations')
          .select('*')
          .eq('user_id', userProfile.id)
          .single();
          
        if (error && error.code !== 'PGRST116') { // Not found error
          console.error("Error loading affiliations:", error);
          setError("Failed to load affiliations");
          return;
        }
        
        if (data) {
          setAffiliationId(data.id);
          form.reset({
            stock_exchange_or_finra: data.stock_exchange_or_finra || false,
            public_company: data.public_company || false,
            us_politically_exposed: data.us_politically_exposed || false,
            awm_employee: data.awm_employee || false,
            custodian: data.custodian || false,
            broker_dealer: data.broker_dealer || false,
            family_broker_dealer: data.family_broker_dealer || false,
          });
        }
      } catch (err) {
        console.error("Unexpected error loading affiliations:", err);
        setError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAffiliations();
  }, [userProfile?.id, form]);

  // Form submission handler
  const onSubmit = async (data: AffiliationFormValues) => {
    if (!userProfile?.id) {
      toast.error("You must be logged in to save affiliations");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const affiliationData = {
        ...data,
        user_id: userProfile.id,
        id: affiliationId || undefined
      };
      
      const { error: upsertError } = await supabase
        .from('user_affiliations')
        .upsert([affiliationData], { onConflict: 'user_id' });
      
      if (upsertError) {
        throw new Error(upsertError.message);
      }
      
      // If this was a new record, get the ID for future updates
      if (!affiliationId) {
        const { data: newData, error: fetchError } = await supabase
          .from('user_affiliations')
          .select('id')
          .eq('user_id', userProfile.id)
          .single();
          
        if (!fetchError && newData) {
          setAffiliationId(newData.id);
        }
      }
      
      toast.success("Affiliations saved successfully");
      
      // Call the onSave callback
      if (onSave) {
        setTimeout(() => onSave(), 300);
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
