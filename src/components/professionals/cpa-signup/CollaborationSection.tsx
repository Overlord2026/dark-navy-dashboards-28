
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { CPAFormValues } from "./FormSchema";

interface CollaborationSectionProps {
  form: UseFormReturn<CPAFormValues>;
}

export function CollaborationSection({ form }: CollaborationSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Collaboration Preferences</h3>
      
      <FormField
        control={form.control}
        name="acceptReferrals"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Accept Referrals for Financial Planning</FormLabel>
              <FormDescription>
                Allow other professionals to refer clients to you for financial planning
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="collaborateWithRIA"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Collaborate with RIAs</FormLabel>
              <FormDescription>
                Indicate interest in collaborating with Registered Investment Advisors
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="practiceSoftware"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Practice Management/Invoicing Software (Optional)</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select software or leave blank" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="quickbooks">QuickBooks</SelectItem>
                <SelectItem value="xero">Xero</SelectItem>
                <SelectItem value="freshbooks">FreshBooks</SelectItem>
                <SelectItem value="wave">Wave</SelectItem>
                <SelectItem value="taxdome">TaxDome</SelectItem>
                <SelectItem value="canopy">Canopy</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              We can integrate with your software for seamless client management
            </FormDescription>
          </FormItem>
        )}
      />
    </div>
  );
}
