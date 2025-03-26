import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Minus, Plus, Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";

const beneficiarySchema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  relationship: z.string().min(1, { message: "Relationship is required." }),
  dateOfBirth: z.date({ required_error: "Date of birth is required." }),
  ssn: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  address2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
});

export function BeneficiariesForm({ onSave }: { onSave: () => void }) {
  const [beneficiaries, setBeneficiaries] = useState<z.infer<typeof beneficiarySchema>[]>([]);
  const [currentBeneficiary, setCurrentBeneficiary] = useState<z.infer<typeof beneficiarySchema> | null>(null);

  const form = useForm<z.infer<typeof beneficiarySchema>>({
    resolver: zodResolver(beneficiarySchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      relationship: "",
      address: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
      email: "",
      ssn: "",
    },
  });

  function onSubmit(values: z.infer<typeof beneficiarySchema>) {
    if (currentBeneficiary) {
      // Update existing beneficiary
      setBeneficiaries(prev => 
        prev.map(b => 
          b === currentBeneficiary ? values : b
        )
      );
      setCurrentBeneficiary(null);
    } else {
      // Add new beneficiary
      setBeneficiaries(prev => [...prev, values]);
    }
    
    form.reset({
      firstName: "",
      lastName: "",
      relationship: "",
      address: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
      email: "",
      ssn: "",
    });
  }

  function handleRemoveBeneficiary(beneficiary: z.infer<typeof beneficiarySchema>) {
    setBeneficiaries(prev => prev.filter(b => b !== beneficiary));
    if (currentBeneficiary === beneficiary) {
      setCurrentBeneficiary(null);
      form.reset({
        firstName: "",
        lastName: "",
        relationship: "",
        address: "",
        address2: "",
        city: "",
        state: "",
        zipCode: "",
        email: "",
        ssn: "",
      });
    }
  }

  function handleEditBeneficiary(beneficiary: z.infer<typeof beneficiarySchema>) {
    setCurrentBeneficiary(beneficiary);
    form.reset(beneficiary);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Provide your beneficiary information</h2>
        <p className="text-sm text-muted-foreground mt-1">
          You can add or remove beneficiaries from your profile. Ask your advisor to assign a
          beneficiary to a specific account.
        </p>
      </div>
      
      {beneficiaries.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium">Current Beneficiaries</h3>
          </div>
          
          <div className="space-y-2">
            {beneficiaries.map((beneficiary, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between border rounded-md p-3"
              >
                <div>
                  <p className="font-medium">{beneficiary.firstName} {beneficiary.lastName}</p>
                  <p className="text-sm text-muted-foreground">{beneficiary.relationship}</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditBeneficiary(beneficiary)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleRemoveBeneficiary(beneficiary)}
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
        <h3 className="text-base font-medium">
          {currentBeneficiary ? "Edit Beneficiary" : "Add Beneficiary"}
        </h3>
        {currentBeneficiary && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setCurrentBeneficiary(null);
              form.reset({
                firstName: "",
                lastName: "",
                relationship: "",
                address: "",
                address2: "",
                city: "",
                state: "",
                zipCode: "",
                email: "",
                ssn: "",
              });
            }}
          >
            Cancel
          </Button>
        )}
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="First name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="relationship"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relationship to Beneficiary</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Spouse">Spouse</SelectItem>
                      <SelectItem value="Child">Child</SelectItem>
                      <SelectItem value="Parent">Parent</SelectItem>
                      <SelectItem value="Sibling">Sibling</SelectItem>
                      <SelectItem value="Other Relative">Other Relative</SelectItem>
                      <SelectItem value="Friend">Friend</SelectItem>
                      <SelectItem value="Trust">Trust</SelectItem>
                      <SelectItem value="Organization">Organization</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of Birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "MM/dd/yyyy")
                          ) : (
                            <span>MM/DD/YYYY</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="ssn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SSN (or ITIN)</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="SSN or ITIN" {...field} />
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
                  <FormLabel>Email (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Email address" {...field} />
                  </FormControl>
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
              name="address2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address 2 (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Apt, suite, unit, etc." {...field} />
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
          </div>
          
          <div className="flex justify-end gap-2">
            {beneficiaries.length === 0 ? (
              <Button 
                variant="outline" 
                type="button"
                onClick={() => onSave()}
              >
                No Beneficiaries to Add
              </Button>
            ) : null}
            <Button type="submit">
              {currentBeneficiary ? "Update Beneficiary" : "Add Beneficiary"}
            </Button>
            {beneficiaries.length > 0 && !currentBeneficiary ? (
              <Button 
                type="button"
                onClick={() => onSave()}
              >
                Save
              </Button>
            ) : null}
          </div>
        </form>
      </Form>
    </div>
  );
}
