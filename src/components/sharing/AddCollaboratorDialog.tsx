
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

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

  const handleNext = () => {
    // Validate only the required fields for step 1
    const isFirstNameValid = form.getValues("firstName") && form.getValues("firstName").length > 0;
    const isLastNameValid = form.getValues("lastName") && form.getValues("lastName").length > 0;
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.getValues("email") || "");
    
    if (isFirstNameValid && isLastNameValid && isEmailValid) {
      setStep(2);
    } else {
      // Show validation errors
      form.trigger(["firstName", "lastName", "email"]);
    }
  };

  const handleCancel = () => {
    form.reset();
    setStep(1);
    handleDialogOpenChange(false);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      
      <DialogContent className="sm:max-w-md bg-[#030a1c] text-white border-gray-800">
        <div className="mb-4 pt-2">
          <Breadcrumb>
            <BreadcrumbList className="text-xs">
              <BreadcrumbItem>
                <BreadcrumbLink href="#" className={`${step === 1 ? "text-white" : "text-gray-400"}`}>
                  <span className="flex items-center">
                    <span className={`inline-block w-4 h-4 rounded-full mr-2 ${step === 1 ? "bg-white text-black" : "bg-gray-700"} flex items-center justify-center text-xs`}>1</span>
                    Add Collaborator
                  </span>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-gray-500">
                <div className="w-10 h-[1px] bg-gray-700"></div>
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href="#" className={`${step === 2 ? "text-white" : "text-gray-400"}`}>
                  <span className="flex items-center">
                    <span className={`inline-block w-4 h-4 rounded-full mr-2 ${step === 2 ? "bg-white text-black" : "bg-gray-700"} flex items-center justify-center text-xs`}>2</span>
                    Access & Type
                  </span>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        
        <DialogHeader>
          <DialogTitle className="text-xl font-normal text-white">
            {step === 1 ? "Add Collaborator" : "Access & Type"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 && (
              <>
                <div>
                  <p className="text-sm text-gray-400 mb-6">
                    Tell us who you want to collaborate with.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
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
                      <FormLabel className="text-gray-400">What's their relationship to you?</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-transparent border-gray-700 text-white">
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-[#030a1c] border-gray-700 text-white">
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
                      <FormLabel className="text-gray-400">What level of access should they have?</FormLabel>
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
                className="border border-white/20 bg-transparent text-white hover:bg-gray-800"
              >
                Cancel
              </Button>
              
              {step === 1 ? (
                <Button 
                  type="button"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleNext}
                >
                  Next
                </Button>
              ) : (
                <Button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Send Invitation
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
