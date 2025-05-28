
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
import { Trash2, Plus } from "lucide-react";

const beneficiarySchema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  relationship: z.string().min(1, { message: "Relationship is required." }),
  dateOfBirth: z.string().optional(),
  ssn: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  address2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
});

type Beneficiary = z.infer<typeof beneficiarySchema> & { id?: string };

export function BeneficiariesFormNew({ onSave }: { onSave: () => void }) {
  const { user } = useAuth();
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  
  const form = useForm<z.infer<typeof beneficiarySchema>>({
    resolver: zodResolver(beneficiarySchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      relationship: "",
      dateOfBirth: "",
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
    const loadExistingData = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('user_beneficiaries')
        .select('*')
        .eq('user_id', user.id);
        
      if (data && !error) {
        setBeneficiaries(data.map(b => ({
          id: b.id,
          firstName: b.first_name,
          lastName: b.last_name,
          relationship: b.relationship,
          dateOfBirth: b.date_of_birth || "",
          ssn: b.ssn || "",
          email: b.email || "",
          address: b.address || "",
          address2: b.address2 || "",
          city: b.city || "",
          state: b.state || "",
          zipCode: b.zip_code || "",
        })));
      }
    };
    
    loadExistingData();
  }, [user]);

  async function onSubmit(values: z.infer<typeof beneficiarySchema>) {
    if (!user) return;
    
    const { error } = await supabase
      .from('user_beneficiaries')
      .insert({
        user_id: user.id,
        first_name: values.firstName,
        last_name: values.lastName,
        relationship: values.relationship,
        date_of_birth: values.dateOfBirth || null,
        ssn: values.ssn || null,
        email: values.email || null,
        address: values.address || null,
        address2: values.address2 || null,
        city: values.city || null,
        state: values.state || null,
        zip_code: values.zipCode || null,
      });
      
    if (error) {
      toast.error("Failed to add beneficiary");
      console.error(error);
    } else {
      toast.success("Beneficiary added successfully");
      form.reset();
      // Reload data
      const { data } = await supabase
        .from('user_beneficiaries')
        .select('*')
        .eq('user_id', user.id);
      if (data) {
        setBeneficiaries(data.map(b => ({
          id: b.id,
          firstName: b.first_name,
          lastName: b.last_name,
          relationship: b.relationship,
          dateOfBirth: b.date_of_birth || "",
          ssn: b.ssn || "",
          email: b.email || "",
          address: b.address || "",
          address2: b.address2 || "",
          city: b.city || "",
          state: b.state || "",
          zipCode: b.zip_code || "",
        })));
      }
    }
  }

  const removeBeneficiary = async (id: string) => {
    const { error } = await supabase
      .from('user_beneficiaries')
      .delete()
      .eq('id', id);
      
    if (error) {
      toast.error("Failed to remove beneficiary");
    } else {
      setBeneficiaries(prev => prev.filter(b => b.id !== id));
      toast.success("Beneficiary removed successfully");
    }
  };

  const handleSaveAll = () => {
    onSave();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-2">Beneficiaries</h2>
        <p className="text-sm text-gray-400">Add and manage your beneficiaries.</p>
      </div>
      
      {beneficiaries.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white">Current Beneficiaries</h3>
          {beneficiaries.map((beneficiary) => (
            <div key={beneficiary.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div>
                <p className="text-white font-medium">{beneficiary.firstName} {beneficiary.lastName}</p>
                <p className="text-gray-400 text-sm">{beneficiary.relationship}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => beneficiary.id && removeBeneficiary(beneficiary.id)}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
      
      <div className="border-t border-gray-700 pt-6">
        <h3 className="text-lg font-medium text-white mb-4">Add New Beneficiary</h3>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-400">First Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="First name" 
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
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-400">Last Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Last name" 
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
                name="relationship"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-400">Relationship</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-transparent border-gray-700 text-white">
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[#0F0F2D] border-gray-700 text-white">
                        <SelectItem value="spouse">Spouse</SelectItem>
                        <SelectItem value="child">Child</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="sibling">Sibling</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-400">Email (Optional)</FormLabel>
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
            </div>
            
            <div className="flex justify-between">
              <Button 
                type="submit" 
                className="bg-green-600 text-white hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Beneficiary
              </Button>
              
              <Button 
                type="button"
                onClick={handleSaveAll}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Save All Changes
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
