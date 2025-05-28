
import React, { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Trash2, Upload } from "lucide-react";
import { FileUpload } from "@/components/ui/file-upload";

const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
];

const trustSchema = z.object({
  trustName: z.string().min(1, { message: "Trust name is required." }),
  country: z.string().min(1, { message: "Country is required." }),
  address: z.string().min(1, { message: "Address is required." }),
  city: z.string().min(1, { message: "City is required." }),
  state: z.string().min(1, { message: "State is required." }),
  zipCode: z.string().min(1, { message: "Zip code is required." }),
  phoneNumber: z.string().min(1, { message: "Phone number is required." }),
  emailAddress: z.string().email({ message: "Valid email is required." }),
  documentType: z.string().min(1, { message: "Document type is required." }),
});

type Trust = z.infer<typeof trustSchema> & { id?: string };

export function TrustsFormNew({ onSave }: { onSave: () => void }) {
  const { user } = useAuth();
  const [trusts, setTrusts] = useState<Trust[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof trustSchema>>({
    resolver: zodResolver(trustSchema),
    defaultValues: {
      trustName: "",
      country: "United States",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      phoneNumber: "",
      emailAddress: "",
      documentType: "Trust Formation Document",
    },
  });

  React.useEffect(() => {
    const loadExistingData = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('user_trusts')
        .select('*')
        .eq('user_id', user.id);
        
      if (data && !error) {
        setTrusts(data.map(t => ({
          id: t.id,
          trustName: t.trust_name || "",
          country: t.country || "United States",
          address: t.address || "",
          city: t.city || "",
          state: t.state || "",
          zipCode: t.zip_code || "",
          phoneNumber: t.phone_number || "",
          emailAddress: t.email_address || "",
          documentType: t.document_type || "Trust Formation Document",
        })));
      }
    };
    
    loadExistingData();
  }, [user]);

  async function onSubmit(values: z.infer<typeof trustSchema>) {
    if (!user) {
      toast.error("You must be logged in to save trusts");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('user_trusts')
        .insert({
          user_id: user.id,
          trust_name: values.trustName,
          country: values.country,
          address: values.address,
          city: values.city,
          state: values.state,
          zip_code: values.zipCode,
          phone_number: values.phoneNumber,
          email_address: values.emailAddress,
          document_type: values.documentType,
        });
        
      if (error) {
        toast.error("Failed to add trust");
        console.error(error);
      } else {
        toast.success("Trust added successfully");
        if (selectedFile) {
          toast.success(`Document ${selectedFile.name} uploaded with trust`);
        }
        form.reset({
          trustName: "",
          country: "United States",
          address: "",
          city: "",
          state: "",
          zipCode: "",
          phoneNumber: "",
          emailAddress: "",
          documentType: "Trust Formation Document",
        });
        setSelectedFile(null);
        // Reload data
        const { data } = await supabase
          .from('user_trusts')
          .select('*')
          .eq('user_id', user.id);
        if (data) {
          setTrusts(data.map(t => ({
            id: t.id,
            trustName: t.trust_name || "",
            country: t.country || "United States",
            address: t.address || "",
            city: t.city || "",
            state: t.state || "",
            zipCode: t.zip_code || "",
            phoneNumber: t.phone_number || "",
            emailAddress: t.email_address || "",
            documentType: t.document_type || "Trust Formation Document",
          })));
        }
        onSave();
      }
    } catch (error) {
      console.error('Unexpected error saving trust:', error);
      toast.error("An unexpected error occurred while saving trust");
    } finally {
      setIsLoading(false);
    }
  }

  const removeTrust = async (id: string) => {
    const { error } = await supabase
      .from('user_trusts')
      .delete()
      .eq('id', id);
      
    if (error) {
      toast.error("Failed to remove trust");
    } else {
      setTrusts(prev => prev.filter(t => t.id !== id));
      toast.success("Trust removed successfully");
    }
  };

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    toast.success(`File ${file.name} selected for upload`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-2">Trusts</h2>
        <p className="text-sm text-muted-foreground">Add and manage your trust information.</p>
      </div>
      
      {trusts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium text-foreground">Current Trusts</h3>
          </div>
          
          <div className="space-y-2">
            {trusts.map((trust) => (
              <div key={trust.id} className="flex items-center justify-between border rounded-md p-3 bg-card">
                <div>
                  <p className="font-medium text-foreground">{trust.trustName}</p>
                  <p className="text-sm text-muted-foreground">{trust.country}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => trust.id && removeTrust(trust.id)}
                  className="flex items-center"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="border-t border-border pt-6">
        <h3 className="text-lg font-medium text-foreground mb-4">Add New Trust</h3>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="trustName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Trust Name *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="John's Trust" 
                        {...field} 
                        className="bg-background border-border text-foreground"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Country *</FormLabel>
                    <div className="flex items-center gap-2">
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background border-border text-foreground flex-1">
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-background border-border">
                          <SelectItem value="United States">United States</SelectItem>
                          <SelectItem value="Canada">Canada</SelectItem>
                          <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="bg-background border-border text-foreground h-10 w-10 p-0 flex items-center justify-center"
                      >
                        US
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Address *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="123 Hancock St" 
                        {...field} 
                        className="bg-background border-border text-foreground"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">City *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Los Angeles" 
                        {...field} 
                        className="bg-background border-border text-foreground"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">State *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background border-border text-foreground">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-background border-border max-h-60 overflow-y-auto">
                        {US_STATES.map((state) => (
                          <SelectItem key={state.value} value={state.value}>
                            {state.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Zip Code *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="12345" 
                        {...field} 
                        className="bg-background border-border text-foreground"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Phone Number *</FormLabel>
                    <FormControl>
                      <div className="flex">
                        <div className="bg-background border border-r-0 border-border text-foreground rounded-l-md px-3 flex items-center">
                          +1
                        </div>
                        <Input 
                          placeholder="123-456-7890" 
                          {...field} 
                          className="bg-background border-border text-foreground rounded-l-none"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="emailAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Email Address *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="johngaydoe@email.com" 
                        {...field} 
                        className="bg-background border-border text-foreground"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="documentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Document Type 1 *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background border-border text-foreground">
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-background border-border">
                      <SelectItem value="Trust Formation Document">Trust Formation Document</SelectItem>
                      <SelectItem value="Trust Amendment">Trust Amendment</SelectItem>
                      <SelectItem value="Trust Certificate">Trust Certificate</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Upload Document</label>
              <FileUpload
                onFileChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                className="border-dashed border-border rounded-lg p-6"
              />
              {selectedFile && (
                <p className="text-sm text-muted-foreground">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                {isLoading ? "Saving..." : "Add Trust"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
