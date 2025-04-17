
import { InfoIcon } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { CollaboratorFormData } from "./types";

interface CollaboratorAccessStepProps {
  form: UseFormReturn<CollaboratorFormData>;
}

export const CollaboratorAccessStep = ({ form }: CollaboratorAccessStepProps) => {
  return (
    <div>
      <h2 className="text-xl font-medium mb-4">Add Type and Access</h2>
      <p className="text-gray-400 mb-6">
        Choose the collaborator's type and access level. You can always change this later.
      </p>
      
      <div className="bg-[#0c1428] p-4 rounded-md space-y-6">
        <FormField
          control={form.control}
          name="collaboratorType"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel className="flex items-center gap-1 text-sm font-normal text-white">
                Collaborator Type
              </FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="bg-transparent border-gray-700 text-white">
                    <SelectValue placeholder="Select collaborator type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-[#030a1c] border-gray-700 text-white">
                  <SelectGroup>
                    <SelectLabel>Family Member</SelectLabel>
                    <SelectItem value="spouse">Spouse</SelectItem>
                    <SelectItem value="son">Son</SelectItem>
                    <SelectItem value="daughter">Daughter</SelectItem>
                    <SelectItem value="father">Father</SelectItem>
                    <SelectItem value="mother">Mother</SelectItem>
                    <SelectItem value="brother">Brother</SelectItem>
                    <SelectItem value="sister">Sister</SelectItem>
                    <SelectItem value="other_family">Other Family Member</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="accessLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1 text-sm font-normal text-white">
                Access
                <InfoIcon className="w-4 h-4 text-gray-400" />
              </FormLabel>
              <Select 
                onValueChange={field.onChange as (value: string) => void} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="bg-transparent border-gray-700 text-white">
                    <SelectValue placeholder="Select access level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-[#030a1c] border-gray-700 text-white">
                  <SelectItem value="full">Full Access</SelectItem>
                  <SelectItem value="limited">Limited Access</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
