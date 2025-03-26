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
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

const trustSchema = z.object({
  trustName: z.string().min(1, { message: "Trust name is required." }),
  country: z.string().min(1, { message: "Country is required." }),
  address: z.string().min(1, { message: "Address is required." }),
  city: z.string().min(1, { message: "City is required." }),
  state: z.string().min(1, { message: "State is required." }),
  zipCode: z.string().min(1, { message: "Zip code is required." }),
  phoneNumber: z.string().min(1, { message: "Phone number is required." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  documentType: z.string().min(1, { message: "Document type is required." }),
});

export function TrustsForm({ onSave }: { onSave: () => void }) {
  const [trusts, setTrusts] = useState<z.infer<typeof trustSchema>[]>([]);
  const [currentTrust, setCurrentTrust] = useState<z.infer<typeof trustSchema> | null>(null);

  const form = useForm<z.infer<typeof trustSchema>>({
    resolver: zodResolver(trustSchema),
    defaultValues: {
      trustName: "John's Trust",
      country: "United States",
      address: "123 Hancock St",
      city: "Los Angeles",
      state: "CA",
      zipCode: "12345",
      phoneNumber: "+1 123-456-7890",
      email: "johnjaydoe@gmail.com",
      documentType: "Trust Formation Document",
    },
  });

  function onSubmit(values: z.infer<typeof trustSchema>) {
    if (currentTrust) {
      // Update existing trust
      setTrusts(prev => 
        prev.map(t => 
          t === currentTrust ? values : t
        )
      );
      setCurrentTrust(null);
    } else {
      // Add new trust
      setTrusts(prev => [...prev, values]);
    }
    
    form.reset({
      trustName: "",
      country: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      phoneNumber: "",
      email: "",
      documentType: "",
    });
  }

  function handleRemoveTrust(trust: z.infer<typeof trustSchema>) {
    setTrusts(prev => prev.filter(t => t !== trust));
    if (currentTrust === trust) {
      setCurrentTrust(null);
      form.reset({
        trustName: "",
        country: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        phoneNumber: "",
        email: "",
        documentType: "",
      });
    }
  }

  function handleEditTrust(trust: z.infer<typeof trustSchema>) {
    setCurrentTrust(trust);
    form.reset(trust);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Trusts</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Have a trust in mind for an account or want to make an update? Please add the
          necessary info for your trust below.
        </p>
      </div>
      
      {trusts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium">Current Trusts</h3>
          </div>
          
          <div className="space-y-2">
            {trusts.map((trust, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between border rounded-md p-3"
              >
                <div>
                  <p className="font-medium">{trust.trustName}</p>
                  <p className="text-sm text-muted-foreground">{trust.city}, {trust.state}</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditTrust(trust)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleRemoveTrust(trust)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <h3 className="text-base font-medium">Trust</h3>
        <div className="flex items-center">
          <Select defaultValue="New">
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="New">New</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex ml-2">
            <Button variant="outline" size="icon">
              <Minus className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="ml-1">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="trustName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trust Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Trust name" {...field} />
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
                  <FormLabel>Country</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="United States">United States</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                      {/* Other countries would be added here */}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Street address" {...field} />
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
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="City" {...field} />
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
                  <FormLabel>State</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="AL">Alabama</SelectItem>
                      <SelectItem value="AK">Alaska</SelectItem>
                      <SelectItem value="AZ">Arizona</SelectItem>
                      <SelectItem value="AR">Arkansas</SelectItem>
                      <SelectItem value="CA">California</SelectItem>
                      <SelectItem value="CO">Colorado</SelectItem>
                      <SelectItem value="CT">Connecticut</SelectItem>
                      <SelectItem value="DE">Delaware</SelectItem>
                      <SelectItem value="FL">Florida</SelectItem>
                      <SelectItem value="GA">Georgia</SelectItem>
                      {/* Other states would be added here */}
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
                  <FormLabel>Zip Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Zip code" {...field} />
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
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone number" {...field} />
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
                    <Input placeholder="Email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="documentType"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Document Type 1</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Trust Formation Document">Trust Formation Document</SelectItem>
                      <SelectItem value="Trust Agreement">Trust Agreement</SelectItem>
                      <SelectItem value="Trust Certificate">Trust Certificate</SelectItem>
                      <SelectItem value="Trust Amendment">Trust Amendment</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="pt-4 border-t">
            <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-md bg-muted/50">
              <div className="text-center">
                <p className="text-muted-foreground mb-1">Drop files here</p>
                <Button variant="outline" size="sm">Select Files</Button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onSave()}>
              Cancel
            </Button>
            <Button type="submit">
              {currentTrust ? "Update Trust" : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
