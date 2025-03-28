
import { useState } from "react";
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
import { Plus, Minus } from "lucide-react";

const trustSchema = z.object({
  trustName: z.string().min(1, { message: "Trust name is required" }),
  country: z.string().min(1, { message: "Country is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State is required" }),
  zipCode: z.string().min(5, { message: "Zip code is required" }),
  phoneNumber: z.string().min(10, { message: "Phone number is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  documentType: z.string().min(1, { message: "Document type is required" }),
});

export function TrustsForm({ onSave }: { onSave: () => void }) {
  const [trusts, setTrusts] = useState<z.infer<typeof trustSchema>[]>([]);
  const [currentTrust, setCurrentTrust] = useState<z.infer<typeof trustSchema> | null>(null);

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
      email: "",
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
      country: "United States",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      phoneNumber: "",
      email: "",
      documentType: "Trust Formation Document",
    });
  }

  function handleRemoveTrust(trust: z.infer<typeof trustSchema>) {
    setTrusts(prev => prev.filter(t => t !== trust));
    if (currentTrust === trust) {
      setCurrentTrust(null);
      form.reset({
        trustName: "",
        country: "United States",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        phoneNumber: "",
        email: "",
        documentType: "Trust Formation Document",
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
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-2">Trusts</h2>
        <p className="text-sm text-gray-400">
          Have a trust in mind for an account or want to make an update? Please add the necessary info for your trust below.
        </p>
      </div>
      
      {trusts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium text-white">Current Trusts</h3>
          </div>
          
          <div className="space-y-2">
            {trusts.map((trust, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between border border-gray-700 rounded-md p-3"
              >
                <div>
                  <p className="font-medium text-white">{trust.trustName}</p>
                  <p className="text-sm text-gray-400">{trust.city}, {trust.state}</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditTrust(trust)}
                    className="border-gray-700 text-white hover:bg-gray-800"
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleRemoveTrust(trust)}
                    className="border-gray-700 text-white hover:bg-gray-800"
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
        <h3 className="text-base font-medium text-white">
          {currentTrust ? "Edit Trust" : "Add Trust"}
        </h3>
        {currentTrust && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setCurrentTrust(null);
              form.reset({
                trustName: "",
                country: "United States",
                address: "",
                city: "",
                state: "",
                zipCode: "",
                phoneNumber: "",
                email: "",
                documentType: "Trust Formation Document",
              });
            }}
            className="border-gray-700 text-white hover:bg-gray-800"
          >
            Cancel
          </Button>
        )}
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="trustName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">Trust Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter trust name" 
                      {...field} 
                      className="bg-transparent border-gray-700 text-white focus:border-blue-500" 
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">Country</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-transparent border-gray-700 text-white focus:ring-0">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[#0F0F2D] border-gray-700 text-white">
                      <SelectItem value="United States">United States</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">Address</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Street address" 
                      {...field} 
                      className="bg-transparent border-gray-700 text-white focus:border-blue-500" 
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">City</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="City" 
                      {...field} 
                      className="bg-transparent border-gray-700 text-white focus:border-blue-500" 
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">State</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-transparent border-gray-700 text-white focus:ring-0">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[#0F0F2D] border-gray-700 text-white">
                      <SelectItem value="CA">California</SelectItem>
                      <SelectItem value="FL">Florida</SelectItem>
                      <SelectItem value="NY">New York</SelectItem>
                      <SelectItem value="TX">Texas</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">Zip Code</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Zip code" 
                      {...field} 
                      className="bg-transparent border-gray-700 text-white focus:border-blue-500" 
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">Phone Number</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Phone number" 
                      {...field} 
                      className="bg-transparent border-gray-700 text-white focus:border-blue-500" 
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">Email Address</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Email address" 
                      {...field} 
                      className="bg-transparent border-gray-700 text-white focus:border-blue-500" 
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="documentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">Document Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-transparent border-gray-700 text-white focus:ring-0">
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[#0F0F2D] border-gray-700 text-white">
                      <SelectItem value="Trust Formation Document">Trust Formation Document</SelectItem>
                      <SelectItem value="Trust Amendment">Trust Amendment</SelectItem>
                      <SelectItem value="Trust Certificate">Trust Certificate</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
          </div>
          
          <div className="bg-black/20 border border-gray-700 rounded-lg p-6 text-center">
            <p className="text-white mb-2">Drop pdf file here or</p>
            <Button 
              type="button" 
              variant="outline"
              className="border-gray-700 text-white hover:bg-gray-800"
            >
              browse
            </Button>
          </div>
          
          <div className="flex justify-end gap-2">
            {trusts.length === 0 ? (
              <Button 
                variant="outline" 
                type="button"
                onClick={() => onSave()}
                className="border-gray-700 text-white hover:bg-gray-800"
              >
                No Trusts to Add
              </Button>
            ) : null}
            <Button 
              type="submit"
              className="bg-white text-[#0F0F2D] hover:bg-white/90"
            >
              {currentTrust ? "Update Trust" : "Add Trust"}
            </Button>
            {trusts.length > 0 && !currentTrust ? (
              <Button 
                type="button"
                onClick={() => onSave()}
                className="bg-white text-[#0F0F2D] hover:bg-white/90"
              >
                Create
              </Button>
            ) : null}
          </div>
        </form>
      </Form>
    </div>
  );
}
