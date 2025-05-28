
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
      if (!user) return;
      
      const { data, error } = await supabase
        .from('user_affiliations')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (data && !error) {
        form.reset({
          stockExchangeOrFinra: data.stock_exchange_or_finra || false,
          publicCompany: data.public_company || false,
          usPoliticallyExposed: data.us_politically_exposed || false,
          awmEmployee: data.awm_employee || false,
          custodian: data.custodian || false,
          brokerDealer: data.broker_dealer || false,
          familyBrokerDealer: data.family_broker_dealer || false,
        });
      }
    };
    
    loadExistingData();
  }, [user, form]);

  async function onSubmit(values: z.infer<typeof affiliationsSchema>) {
    if (!user) return;
    
    const { error } = await supabase
      .from('user_affiliations')
      .upsert({
        user_id: user.id,
        stock_exchange_or_finra: values.stockExchangeOrFinra,
        public_company: values.publicCompany,
        us_politically_exposed: values.usPoliticallyExposed,
        awm_employee: values.awmEmployee,
        custodian: values.custodian,
        broker_dealer: values.brokerDealer,
        family_broker_dealer: values.familyBrokerDealer,
        updated_at: new Date().toISOString(),
      });
      
    if (error) {
      toast.error("Failed to save affiliations");
      console.error(error);
    } else {
      onSave();
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
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Save Affiliations
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
