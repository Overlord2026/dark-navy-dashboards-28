
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { CollaboratorFormData } from "./types";

interface CollaboratorInfoStepProps {
  form: UseFormReturn<CollaboratorFormData>;
}

export const CollaboratorInfoStep = ({ form }: CollaboratorInfoStepProps) => {
  return (
    <div>
      <h2 className="text-xl font-medium mb-4">Add Collaborator</h2>
      <p className="text-gray-400 mb-6">Tell us who you want to collaborate with.</p>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-400 text-xs mb-1">First Name</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    className="bg-transparent border-gray-700 focus:border-gray-500"
                    placeholder="First Name"
                  />
                </FormControl>
                <FormMessage className="text-red-400 text-xs mt-1" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-400 text-xs mb-1">Last Name</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    className="bg-transparent border-gray-700 focus:border-gray-500"
                    placeholder="Last Name"
                  />
                </FormControl>
                <FormMessage className="text-red-400 text-xs mt-1" />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-400 text-xs mb-1">Email</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="email" 
                  className="bg-transparent border-gray-700 focus:border-gray-500"
                  placeholder="Email"
                />
              </FormControl>
              <FormMessage className="text-red-400 text-xs mt-1" />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
