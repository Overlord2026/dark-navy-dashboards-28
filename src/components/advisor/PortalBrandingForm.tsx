
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const brandingFormSchema = z.object({
  portalTitle: z.string().min(2, "Portal title must be at least 2 characters"),
  primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Must be a valid hex color"),
  secondaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Must be a valid hex color"),
  customDomain: z.string().optional(),
  headerLogo: z.any().optional(),
  footerLogo: z.any().optional(),
  welcomeMessage: z.string().optional(),
});

type BrandingFormValues = z.infer<typeof brandingFormSchema>;

export function PortalBrandingForm() {
  const [activePreview, setActivePreview] = useState("desktop");
  
  const form = useForm<BrandingFormValues>({
    resolver: zodResolver(brandingFormSchema),
    defaultValues: {
      portalTitle: "Boutique Family Office Client Portal",
      primaryColor: "#1EAEDB",
      secondaryColor: "#33C3F0",
      customDomain: "",
      welcomeMessage: "Welcome to your personalized financial portal",
    },
  });

  const onSubmit = (data: BrandingFormValues) => {
    console.log("Branding details submitted:", data);
    // This would typically save the data to your backend
  };

  // Colors from the form for preview
  const primaryColor = form.watch("primaryColor");
  const secondaryColor = form.watch("secondaryColor");
  const portalTitle = form.watch("portalTitle");

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Client Portal Branding</h2>
        <p className="text-gray-400">
          Customize the appearance of your client portal to match your brand
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="portalTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Portal Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Firm Client Portal" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="primaryColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Color</FormLabel>
                      <div className="flex space-x-2">
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <div 
                          className="h-10 w-10 rounded border border-gray-600" 
                          style={{ backgroundColor: field.value }}
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="secondaryColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secondary Color</FormLabel>
                      <div className="flex space-x-2">
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <div 
                          className="h-10 w-10 rounded border border-gray-600" 
                          style={{ backgroundColor: field.value }}
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Portal Logo</h3>
                <FileUpload 
                  id="logo-upload"
                  onUpload={(file) => form.setValue("headerLogo", file)}
                  accept="image/*"
                  maxSize={5}
                  className="w-full"
                />
                <p className="text-xs text-gray-400 mt-2">
                  This logo will appear in the header of the client portal
                </p>
              </div>

              <FormField
                control={form.control}
                name="customDomain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom Domain (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="portal.yourfirm.com" {...field} />
                    </FormControl>
                    <p className="text-xs text-gray-400 mt-1">
                      You'll need to configure DNS records separately
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="welcomeMessage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Welcome Message</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Welcome to your personalized financial portal" 
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

        <div className="bg-gray-900 rounded-lg border border-gray-700 p-4">
          <div className="mb-4">
            <h3 className="text-lg font-medium">Portal Preview</h3>
            <p className="text-sm text-gray-400">See how your branding will look</p>
          </div>
          
          <Tabs value={activePreview} onValueChange={setActivePreview} className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="desktop">Desktop</TabsTrigger>
              <TabsTrigger value="mobile">Mobile</TabsTrigger>
            </TabsList>
            
            <TabsContent value="desktop" className="mt-4">
              <div className="border border-gray-700 rounded-lg overflow-hidden bg-black">
                <div 
                  className="h-12 flex items-center px-4 border-b border-gray-800"
                  style={{ backgroundColor: primaryColor }}
                >
                  <div className="font-medium text-white">{portalTitle}</div>
                </div>
                <div className="p-4">
                  <div className="h-40 bg-gray-800 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="mobile" className="mt-4">
              <div className="w-60 mx-auto border border-gray-700 rounded-lg overflow-hidden bg-black">
                <div 
                  className="h-10 flex items-center justify-center border-b border-gray-800"
                  style={{ backgroundColor: primaryColor }}
                >
                  <div className="font-medium text-white text-sm truncate">{portalTitle}</div>
                </div>
                <div className="p-2">
                  <div className="h-32 bg-gray-800 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 p-3 bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-300">
              This is a simplified preview. The actual portal will include navigation menus,
              content areas, and interactive elements styled with your brand colors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
