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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { beneficiarySchema } from "./beneficiarySchema";
import { BeneficiaryList } from "./BeneficiaryList";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export function BeneficiariesFormNew({ onSave }: { onSave: () => void }) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [beneficiaries, setBeneficiaries] = React.useState<z.infer<typeof beneficiarySchema>[]>([]);
  const [editingBeneficiary, setEditingBeneficiary] = React.useState<z.infer<typeof beneficiarySchema> | null>(null);
  
  const form = useForm<z.infer<typeof beneficiarySchema>>({
    resolver: zodResolver(beneficiarySchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      relationship: "",
      dateOfBirth: new Date(),
      ssn: "",
      email: "",
      address: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  React.useEffect(() => {
    const loadBeneficiaries = async () => {
      if (!user) {
        console.log('No user found, skipping beneficiaries load');
        return;
      }
      
      console.log('Loading beneficiaries for user:', user.id);
      
      try {
        const { data, error } = await supabase
          .from('user_beneficiaries')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) {
          console.error('Error loading beneficiaries:', error);
          return;
        }
        
        if (data && data.length > 0) {
          console.log('Loaded beneficiaries data:', data);
          const mappedBeneficiaries = data.map(item => ({
            firstName: item.first_name || "",
            lastName: item.last_name || "",
            relationship: item.relationship || "",
            dateOfBirth: new Date(item.date_of_birth || new Date()),
            ssn: item.ssn || "",
            email: item.email || "",
            address: item.address || "",
            address2: item.address2 || "",
            city: item.city || "",
            state: item.state || "",
            zipCode: item.zip_code || "",
          }));
          setBeneficiaries(mappedBeneficiaries);
        } else {
          console.log('No beneficiaries found');
          setBeneficiaries([]);
        }
      } catch (error) {
        console.error('Error in loadBeneficiaries:', error);
      }
    };
    
    loadBeneficiaries();
  }, [user]);

  const handleEdit = (beneficiary: z.infer<typeof beneficiarySchema>) => {
    console.log('Editing beneficiary:', beneficiary);
    setEditingBeneficiary(beneficiary);
    form.reset(beneficiary);
  };

  const handleRemove = async (beneficiaryToRemove: z.infer<typeof beneficiarySchema>) => {
    if (!user) {
      toast.error("You must be logged in to remove beneficiaries");
      return;
    }
    
    console.log('Removing beneficiary:', beneficiaryToRemove);
    
    try {
      const { error } = await supabase
        .from('user_beneficiaries')
        .delete()
        .eq('user_id', user.id)
        .eq('first_name', beneficiaryToRemove.firstName)
        .eq('last_name', beneficiaryToRemove.lastName);
        
      if (error) {
        console.error('Error removing beneficiary:', error);
        toast.error("Failed to remove beneficiary");
        return;
      }
      
      setBeneficiaries(prev => prev.filter(b => 
        !(b.firstName === beneficiaryToRemove.firstName && b.lastName === beneficiaryToRemove.lastName)
      ));
      toast.success("Beneficiary removed successfully");
    } catch (error) {
      console.error('Error removing beneficiary:', error);
      toast.error("An unexpected error occurred");
    }
  };

  async function onSubmit(values: z.infer<typeof beneficiarySchema>) {
    if (!user) {
      toast.error("You must be logged in to save beneficiaries");
      return;
    }
    
    setIsLoading(true);
    console.log('Saving beneficiary data:', values);
    
    try {
      const beneficiaryData = {
        user_id: user.id,
        first_name: values.firstName,
        last_name: values.lastName,
        relationship: values.relationship,
        date_of_birth: values.dateOfBirth.toISOString(),
        ssn: values.ssn || null,
        email: values.email || null,
        address: values.address,
        address2: values.address2 || null,
        city: values.city,
        state: values.state,
        zip_code: values.zipCode || null,
        updated_at: new Date().toISOString(),
      };
      
      console.log('Submitting beneficiary data:', beneficiaryData);
      
      if (editingBeneficiary) {
        // Update existing beneficiary
        const { error } = await supabase
          .from('user_beneficiaries')
          .update(beneficiaryData)
          .eq('user_id', user.id)
          .eq('first_name', editingBeneficiary.firstName)
          .eq('last_name', editingBeneficiary.lastName);
          
        if (error) {
          console.error('Error updating beneficiary:', error);
          toast.error(`Failed to update beneficiary: ${error.message}`);
          return;
        }
        
        // Update local state
        setBeneficiaries(prev => prev.map(b => 
          b.firstName === editingBeneficiary.firstName && b.lastName === editingBeneficiary.lastName 
            ? values 
            : b
        ));
        setEditingBeneficiary(null);
        toast.success("Beneficiary updated successfully");
      } else {
        // Add new beneficiary
        const { error } = await supabase
          .from('user_beneficiaries')
          .insert(beneficiaryData);
          
        if (error) {
          console.error('Error saving beneficiary:', error);
          toast.error(`Failed to save beneficiary: ${error.message}`);
          return;
        }
        
        // Add to local state
        setBeneficiaries(prev => [...prev, values]);
        toast.success("Beneficiary added successfully");
      }
      
      // Reset form
      form.reset({
        firstName: "",
        lastName: "",
        relationship: "",
        dateOfBirth: new Date(),
        ssn: "",
        email: "",
        address: "",
        address2: "",
        city: "",
        state: "",
        zipCode: "",
      });
      
      onSave();
    } catch (error) {
      console.error('Unexpected error saving beneficiary:', error);
      toast.error("An unexpected error occurred while saving beneficiary");
    } finally {
      setIsLoading(false);
    }
  }

  const cancelEdit = () => {
    setEditingBeneficiary(null);
    form.reset({
      firstName: "",
      lastName: "",
      relationship: "",
      dateOfBirth: new Date(),
      ssn: "",
      email: "",
      address: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-2">Beneficiaries</h2>
        <p className="text-sm text-muted-foreground">Add and manage your beneficiaries information.</p>
      </div>
      
      {beneficiaries.length > 0 && (
        <BeneficiaryList 
          beneficiaries={beneficiaries}
          onEdit={handleEdit}
          onRemove={handleRemove}
        />
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-foreground">
              {editingBeneficiary ? "Edit Beneficiary" : "Add New Beneficiary"}
            </h3>
            {editingBeneficiary && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={cancelEdit}
                className="text-muted-foreground border-border hover:bg-muted"
              >
                Cancel Edit
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">First Name *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="First name" 
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
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Last Name *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Last name" 
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
              name="relationship"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Relationship *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background border-border text-foreground">
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-background border-border">
                      <SelectItem value="spouse">Spouse</SelectItem>
                      <SelectItem value="child">Child</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="sibling">Sibling</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
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
                <FormItem>
                  <FormLabel className="text-foreground">Date of Birth *</FormLabel>
                  <FormControl>
                    <DatePicker
                      date={field.value}
                      onSelect={field.onChange}
                      className="bg-background border-border text-foreground"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="ssn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">SSN (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="XXX-XX-XXXX" 
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Email (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      type="email"
                      placeholder="email@example.com" 
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
              name="address"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-foreground">Address *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Street address" 
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
              name="address2"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-foreground">Address Line 2 (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Apartment, suite, etc." 
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
                      placeholder="City" 
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
                  <FormControl>
                    <Input 
                      placeholder="State" 
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
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">ZIP Code (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="ZIP code" 
                      {...field} 
                      className="bg-background border-border text-foreground"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {isLoading ? "Saving..." : editingBeneficiary ? "Update Beneficiary" : "Add Beneficiary"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
