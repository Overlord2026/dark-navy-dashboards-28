
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
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";

const trustSchema = z.object({
  trustName: z.string().min(1, { message: "Trust name is required." }),
  trustType: z.string().min(1, { message: "Trust type is required." }),
  trusteeName: z.string().min(1, { message: "Trustee name is required." }),
  beneficiaryNames: z.string().min(1, { message: "Beneficiary names are required." }),
  establishmentDate: z.string().optional(),
  purpose: z.string().optional(),
  assetsValue: z.string().optional(),
});

type Trust = z.infer<typeof trustSchema> & { id?: string };

export function TrustsFormNew({ onSave }: { onSave: () => void }) {
  const { user } = useAuth();
  const [trusts, setTrusts] = useState<Trust[]>([]);
  
  const form = useForm<z.infer<typeof trustSchema>>({
    resolver: zodResolver(trustSchema),
    defaultValues: {
      trustName: "",
      trustType: "",
      trusteeName: "",
      beneficiaryNames: "",
      establishmentDate: "",
      purpose: "",
      assetsValue: "",
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
          trustName: t.trust_name,
          trustType: t.trust_type || "",
          trusteeName: t.trustee_name || "",
          beneficiaryNames: t.beneficiary_names || "",
          establishmentDate: t.establishment_date || "",
          purpose: t.purpose || "",
          assetsValue: t.assets_value || "",
        })));
      }
    };
    
    loadExistingData();
  }, [user]);

  async function onSubmit(values: z.infer<typeof trustSchema>) {
    if (!user) return;
    
    const { error } = await supabase
      .from('user_trusts')
      .insert({
        user_id: user.id,
        trust_name: values.trustName,
        trust_type: values.trustType,
        trustee_name: values.trusteeName,
        beneficiary_names: values.beneficiaryNames,
        establishment_date: values.establishmentDate || null,
        purpose: values.purpose || null,
        assets_value: values.assetsValue || null,
      });
      
    if (error) {
      toast.error("Failed to add trust");
      console.error(error);
    } else {
      toast.success("Trust added successfully");
      form.reset();
      // Reload data
      const { data } = await supabase
        .from('user_trusts')
        .select('*')
        .eq('user_id', user.id);
      if (data) {
        setTrusts(data.map(t => ({
          id: t.id,
          trustName: t.trust_name,
          trustType: t.trust_type || "",
          trusteeName: t.trustee_name || "",
          beneficiaryNames: t.beneficiary_names || "",
          establishmentDate: t.establishment_date || "",
          purpose: t.purpose || "",
          assetsValue: t.assets_value || "",
        })));
      }
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

  const handleSaveAll = () => {
    onSave();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-2">Trusts</h2>
        <p className="text-sm text-gray-400">Add and manage your trust information.</p>
      </div>
      
      {trusts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white">Current Trusts</h3>
          {trusts.map((trust) => (
            <div key={trust.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div>
                <p className="text-white font-medium">{trust.trustName}</p>
                <p className="text-gray-400 text-sm">{trust.trustType}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => trust.id && removeTrust(trust.id)}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
      
      <div className="border-t border-gray-700 pt-6">
        <h3 className="text-lg font-medium text-white mb-4">Add New Trust</h3>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="trustName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-400">Trust Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Trust name" 
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
                name="trustType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-400">Trust Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-transparent border-gray-700 text-white">
                          <SelectValue placeholder="Select trust type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[#0F0F2D] border-gray-700 text-white">
                        <SelectItem value="revocable">Revocable Trust</SelectItem>
                        <SelectItem value="irrevocable">Irrevocable Trust</SelectItem>
                        <SelectItem value="charitable">Charitable Trust</SelectItem>
                        <SelectItem value="special-needs">Special Needs Trust</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="trusteeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-400">Trustee Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Trustee name" 
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
                name="beneficiaryNames"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-400">Beneficiary Names</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Beneficiary names" 
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
                name="establishmentDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-400">Establishment Date (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="date"
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
                name="assetsValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-400">Assets Value (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., $1,000,000" 
                        {...field} 
                        className="bg-transparent border-gray-700 text-white focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">Purpose (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the purpose of this trust" 
                      {...field} 
                      className="bg-transparent border-gray-700 text-white focus:border-blue-500 min-h-[80px]"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <div className="flex justify-between">
              <Button 
                type="submit" 
                className="bg-green-600 text-white hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Trust
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
