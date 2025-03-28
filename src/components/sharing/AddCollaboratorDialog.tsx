
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type AddCollaboratorDialogProps = {
  onAddCollaborator: (collaborator: {
    name: string;
    email: string;
    role: string;
    accessLevel: "full" | "partial";
  }) => void;
  trigger?: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  role: z.string().min(1, "Role is required"),
  accessLevel: z.enum(["full", "partial"]),
});

export function AddCollaboratorDialog({ 
  onAddCollaborator, 
  trigger, 
  isOpen, 
  onOpenChange 
}: AddCollaboratorDialogProps) {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [step, setStep] = useState(1);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: "",
      accessLevel: "partial",
    },
  });

  // Handle controlled open state from parent
  useEffect(() => {
    if (isOpen !== undefined) {
      setDialogOpen(isOpen);
    }
  }, [isOpen]);

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (onOpenChange) {
      onOpenChange(open);
    }
    if (!open) {
      // Reset form when dialog closes
      form.reset();
      setStep(1);
    }
  };
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (step === 1) {
      setStep(2);
      return;
    }
    
    onAddCollaborator({
      name: `${values.firstName} ${values.lastName}`,
      email: values.email,
      role: values.role,
      accessLevel: values.accessLevel,
    });
    
    // Reset form and close dialog
    form.reset();
    setStep(1);
    handleDialogOpenChange(false);
  };

  const handleCancel = () => {
    form.reset();
    setStep(1);
    handleDialogOpenChange(false);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      
      <DialogContent className="sm:max-w-md bg-[#0F0F2D] text-white border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {step === 1 ? "Add Collaborator" : "Access & Type"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 && (
              <>
                <div>
                  <p className="text-sm text-gray-300 mb-6">
                    Tell us who you want to collaborate with.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">First Name</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="bg-transparent border-gray-600 focus:border-gray-400"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Last Name</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="bg-transparent border-gray-600 focus:border-gray-400"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Email</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="email" 
                            className="bg-transparent border-gray-600 focus:border-gray-400"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}
            
            {step === 2 && (
              <>
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">What's their relationship to you?</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-transparent border-gray-600 text-white">
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-[#1A1A3A] border-gray-700 text-white">
                          <SelectItem value="spouse">Spouse</SelectItem>
                          <SelectItem value="child">Child</SelectItem>
                          <SelectItem value="parent">Parent</SelectItem>
                          <SelectItem value="accountant">Accountant</SelectItem>
                          <SelectItem value="financial_advisor">Financial Advisor</SelectItem>
                          <SelectItem value="attorney">Attorney</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
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
                      <FormLabel className="text-gray-300">What level of access should they have?</FormLabel>
                      <Select 
                        onValueChange={field.onChange as (value: string) => void} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-transparent border-gray-600 text-white">
                            <SelectValue placeholder="Select access level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-[#1A1A3A] border-gray-700 text-white">
                          <SelectItem value="full">Full Access</SelectItem>
                          <SelectItem value="partial">Partial Access</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </>
            )}
            
            <div className="flex justify-between pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
                className="border-gray-600 text-white hover:bg-gray-800"
              >
                Cancel
              </Button>
              
              <Button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {step === 1 ? "Next" : "Send Invitation"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
