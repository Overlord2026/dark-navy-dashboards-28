
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
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const affiliationsSchema = z.object({
  stockExchangeOrFinra: z.boolean().default(false),
  publicCompany: z.boolean().default(false),
  usPoliticallyExposed: z.boolean().default(false),
  awmEmployee: z.boolean().default(false),
  custodian: z.boolean().default(false),
  brokerDealer: z.boolean().default(false),
  familyBrokerDealer: z.boolean().default(false),
});

export function AffiliationsFormNew({ onSave }: { onSave: () => void }) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [existingRecordId, setExistingRecordId] = React.useState<string | null>(null);
  
  const form = useForm<z.infer<typeof affiliationsSchema>>({
    resolver: zodResolver(affiliationsSchema),
    defaultValues: {
      stockExchangeOrFinra: false,
      publicCompany: false,
      usPoliticallyExposed: false,
      awmEmployee: false,
      custodian: false,
      brokerDealer: false,
      familyBrokerDealer: false,
    },
  });

  React.useEffect(() => {
    const loadExistingData = async () => {
      if (!user) {
        console.log('No user found, skipping data load');
        return;
      }
      
      console.log('Loading affiliations data for user:', user.id);
      
      try {
        const { data, error } = await supabase
          .from('user_affiliations')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (error) {
          console.error('Error loading affiliations:', error);
          return;
        }
        
        if (data) {
          console.log('Loaded affiliations data:', data);
          setExistingRecordId(data.id); // Store the existing record ID
          form.reset({
            stockExchangeOrFinra: data.stock_exchange_or_finra || false,
            publicCompany: data.public_company || false,
            usPoliticallyExposed: data.us_politically_exposed || false,
            awmEmployee: data.awm_employee || false,
            custodian: data.custodian || false,
            brokerDealer: data.broker_dealer || false,
            familyBrokerDealer: data.family_broker_dealer || false,
          });
        } else {
          console.log('No existing affiliations data found');
          setExistingRecordId(null);
        }
      } catch (error) {
        console.error('Error in loadExistingData:', error);
      }
    };
    
    loadExistingData();
  }, [user, form]);

  async function onSubmit(values: z.infer<typeof affiliationsSchema>) {
    if (!user) {
      toast.error("You must be logged in to save affiliations");
      return;
    }
    
    setIsLoading(true);
    console.log('Saving affiliations data:', values);
    
    try {
      const affiliationData = {
        user_id: user.id,
        stock_exchange_or_finra: values.stockExchangeOrFinra,
        public_company: values.publicCompany,
        us_politically_exposed: values.usPoliticallyExposed,
        awm_employee: values.awmEmployee,
        custodian: values.custodian,
        broker_dealer: values.brokerDealer,
        family_broker_dealer: values.familyBrokerDealer,
        updated_at: new Date().toISOString(),
      };
      
      console.log('Submitting affiliations data:', affiliationData);
      
      let result;
      
      if (existingRecordId) {
        // Update existing record
        result = await supabase
          .from('user_affiliations')
          .update(affiliationData)
          .eq('id', existingRecordId)
          .select();
      } else {
        // Insert new record
        result = await supabase
          .from('user_affiliations')
          .insert(affiliationData)
          .select();
      }
      
      const { data, error } = result;
        
      if (error) {
        console.error('Supabase error saving affiliations:', error);
        toast.error(`Failed to save affiliations: ${error.message}`);
        return;
      }
      
      console.log('Successfully saved affiliations:', data);
      
      // Update the existing record ID if we just created a new record
      if (!existingRecordId && data && data.length > 0) {
        setExistingRecordId(data[0].id);
      }
      
      toast.success("Affiliations saved successfully");
      onSave();
    } catch (error) {
      console.error('Unexpected error saving affiliations:', error);
      toast.error("An unexpected error occurred while saving affiliations");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-2">Affiliations</h2>
        <p className="text-sm text-gray-400">Please indicate any relevant affiliations or relationships.</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="stockExchangeOrFinra"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-gray-700 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="border-gray-700"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-white">
                      Stock Exchange or FINRA Member
                    </FormLabel>
                    <p className="text-sm text-gray-400">
                      Are you associated with a stock exchange or FINRA member organization?
                    </p>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="publicCompany"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-gray-700 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="border-gray-700"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-white">
                      Public Company Affiliation
                    </FormLabel>
                    <p className="text-sm text-gray-400">
                      Are you affiliated with a publicly traded company?
                    </p>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="usPoliticallyExposed"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-gray-700 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="border-gray-700"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-white">
                      Politically Exposed Person (US)
                    </FormLabel>
                    <p className="text-sm text-gray-400">
                      Are you a politically exposed person in the United States?
                    </p>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="awmEmployee"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-gray-700 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="border-gray-700"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-white">
                      Asset/Wealth Management Employee
                    </FormLabel>
                    <p className="text-sm text-gray-400">
                      Are you an employee of an asset or wealth management company?
                    </p>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="custodian"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-gray-700 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="border-gray-700"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-white">
                      Custodian Affiliation
                    </FormLabel>
                    <p className="text-sm text-gray-400">
                      Are you affiliated with a custodial institution?
                    </p>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="brokerDealer"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-gray-700 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="border-gray-700"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-white">
                      Broker-Dealer Affiliation
                    </FormLabel>
                    <p className="text-sm text-gray-400">
                      Are you affiliated with a broker-dealer?
                    </p>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="familyBrokerDealer"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-gray-700 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="border-gray-700"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-white">
                      Family Member Broker-Dealer
                    </FormLabel>
                    <p className="text-sm text-gray-400">
                      Is any family member affiliated with a broker-dealer?
                    </p>
                  </div>
                </FormItem>
              )}
            />
          </div>
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {isLoading ? "Saving..." : "Save Affiliations"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
