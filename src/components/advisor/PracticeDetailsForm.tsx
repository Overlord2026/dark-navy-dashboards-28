
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/ui/file-upload";

const practiceFormSchema = z.object({
  firmName: z.string().min(2, "Firm name must be at least 2 characters"),
  address: z.string().min(5, "Address is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Valid email is required"),
  website: z.string().url("Valid website URL is required").optional().or(z.literal("")),
  description: z.string().optional(),
  logo: z.any().optional(),
});

type PracticeFormValues = z.infer<typeof practiceFormSchema>;

export function PracticeDetailsForm() {
  const form = useForm<PracticeFormValues>({
    resolver: zodResolver(practiceFormSchema),
    defaultValues: {
      firmName: "",
      address: "",
      phone: "",
      email: "",
      website: "",
      description: "",
    },
  });

  const onSubmit = (data: PracticeFormValues) => {
    console.log("Practice details submitted:", data);
    // This would typically save the data to your backend
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Practice Details</h2>
        <p className="text-gray-400">
          Set up your firm's information to personalize your advisory platform
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Firm Logo</h3>
            <FileUpload 
              id="logo-upload"
              onUpload={(file) => form.setValue("logo", file)}
              accept="image/*"
              maxSize={5}
              className="w-full"
            />
            <p className="text-xs text-gray-400 mt-2">
              Upload a square logo (PNG or JPG), recommended size 512x512px
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="firmName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Firm Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Boutique Family Office LLC" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="contact@yourfirm.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="(555) 123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://www.yourfirm.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main St, City, State, Zip" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Firm Description (optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Tell clients about your firm's approach and services..." 
                    className="min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
