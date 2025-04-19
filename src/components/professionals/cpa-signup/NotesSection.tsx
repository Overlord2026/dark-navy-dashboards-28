
import React from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { CPAFormValues } from "./FormSchema";

interface NotesSectionProps {
  form: UseFormReturn<CPAFormValues>;
}

export function NotesSection({ form }: NotesSectionProps) {
  return (
    <FormField
      control={form.control}
      name="notes"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Additional Information (Optional)</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Share additional details about your practice, experience, or services..."
              className="min-h-[100px]"
              {...field}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
