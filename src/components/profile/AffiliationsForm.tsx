
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { X } from "lucide-react";

const formSchema = z.object({
  stockExchangeOrFinra: z.enum(["Yes", "No"]),
  publicCompany: z.enum(["Yes", "No"]),
  usPoliticallyExposed: z.enum(["Yes", "No"]),
  awmEmployee: z.enum(["Yes", "No"]),
  custodian: z.enum(["Yes", "No"]),
  brokerDealer: z.enum(["Yes", "No"]),
  familyBrokerDealer: z.enum(["Yes", "No"]),
});

export function AffiliationsForm({ onSave }: { onSave: () => void }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      stockExchangeOrFinra: "No",
      publicCompany: "No",
      usPoliticallyExposed: "No",
      awmEmployee: "No",
      custodian: "No",
      brokerDealer: "No",
      familyBrokerDealer: "No",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    onSave();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-2">Provide your affiliation information</h2>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="stockExchangeOrFinra"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-white">Are you affiliated with a stock exchange or FINRA?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-4"
                  >
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Yes" className="border-white text-white" />
                      </FormControl>
                      <FormLabel className="font-normal text-white">Yes</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="No" className="border-white text-white" />
                      </FormControl>
                      <FormLabel className="font-normal text-white">No</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="publicCompany"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-white">Are you affiliated with a Public Company</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-4"
                  >
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Yes" className="border-white text-white" />
                      </FormControl>
                      <FormLabel className="font-normal text-white">Yes</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="No" className="border-white text-white" />
                      </FormControl>
                      <FormLabel className="font-normal text-white">No</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="usPoliticallyExposed"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-white">Are you a US official/politically exposed person?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-4"
                  >
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Yes" className="border-white text-white" />
                      </FormControl>
                      <FormLabel className="font-normal text-white">Yes</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="No" className="border-white text-white" />
                      </FormControl>
                      <FormLabel className="font-normal text-white">No</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="awmEmployee"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-white">Are you related to a AWM Employee?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-4"
                  >
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Yes" className="border-white text-white" />
                      </FormControl>
                      <FormLabel className="font-normal text-white">Yes</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="No" className="border-white text-white" />
                      </FormControl>
                      <FormLabel className="font-normal text-white">No</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="custodian"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-white">Are you an employee or affiliated with a custodian?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-4"
                  >
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Yes" className="border-white text-white" />
                      </FormControl>
                      <FormLabel className="font-normal text-white">Yes</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="No" className="border-white text-white" />
                      </FormControl>
                      <FormLabel className="font-normal text-white">No</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="brokerDealer"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-white">Are you an employee or affiliated with a broker-dealer?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-4"
                  >
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Yes" className="border-white text-white" />
                      </FormControl>
                      <FormLabel className="font-normal text-white">Yes</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="No" className="border-white text-white" />
                      </FormControl>
                      <FormLabel className="font-normal text-white">No</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="familyBrokerDealer"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-white">Is a family member affiliated with a broker-dealer?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-4"
                  >
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Yes" className="border-white text-white" />
                      </FormControl>
                      <FormLabel className="font-normal text-white">Yes</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="No" className="border-white text-white" />
                      </FormControl>
                      <FormLabel className="font-normal text-white">No</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              className="bg-white text-[#0F0F2D] hover:bg-white/90"
            >
              Save
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
