
import { useState, useEffect } from "react";
import { InfoIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ProfessionalType } from "@/types/professional";

type AddCollaboratorDialogProps = {
  onAddCollaborator: (collaborator: {
    name: string;
    email: string;
    role: string;
    accessLevel: "full" | "limited";
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
  collaboratorType: z.string().min(1, "Collaborator type is required"),
  accessLevel: z.enum(["full", "limited"]),
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
      collaboratorType: "",
      accessLevel: "limited",
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
      role: values.collaboratorType,
      accessLevel: values.accessLevel as "full" | "limited",
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

  const handleBack = () => {
    setStep(1);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      
      <DialogContent className="sm:max-w-md bg-[#030a1c] text-white border-gray-800">
        <div className="absolute top-0 left-0 right-0 h-10 flex items-center justify-center gap-2 bg-[#1c2e4a] text-white rounded-t-md px-4">
          {step === 1 ? (
            <span className="text-sm font-medium flex items-center">
              <span className="w-5 h-5 bg-white text-black rounded-full flex items-center justify-center text-xs mr-2">1</span>
              Add Collaborator
            </span>
          ) : (
            <>
              <span className="text-sm text-gray-400 font-medium flex items-center">
                <span className="w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center text-xs mr-2">1</span>
                Add Collaborator
              </span>
              <div className="w-10 h-[1px] bg-gray-700"></div>
              <span className="text-sm font-medium flex items-center">
                <span className="w-5 h-5 bg-white text-black rounded-full flex items-center justify-center text-xs mr-2">2</span>
                Access & Type
              </span>
            </>
          )}
        </div>
        
        <div className="pt-8">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-xl font-normal text-white">
              {step === 1 ? "Add Collaborator" : "Add Type and Access"}
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
                  <p className="text-sm text-gray-400 mb-6">
                    Choose the collaborator's type and access level. You can always change this later.
                  </p>
                
                  <div className="bg-[#0c1428] p-4 rounded-md mb-2">
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
                                <SelectItem value="aunt">Aunt</SelectItem>
                                <SelectItem value="brother">Brother</SelectItem>
                                <SelectItem value="daughter">Daughter</SelectItem>
                                <SelectItem value="domestic_partner">Domestic Partner</SelectItem>
                                <SelectItem value="father">Father</SelectItem>
                                <SelectItem value="father_in_law">Father-in-law</SelectItem>
                                <SelectItem value="grandfather">Grandfather</SelectItem>
                                <SelectItem value="grandmother">Grandmother</SelectItem>
                                <SelectItem value="granddaughter">Granddaughter</SelectItem>
                                <SelectItem value="grandson">Grandson</SelectItem>
                                <SelectItem value="mother">Mother</SelectItem>
                                <SelectItem value="mother_in_law">Mother-in-law</SelectItem>
                                <SelectItem value="nephew">Nephew</SelectItem>
                                <SelectItem value="niece">Niece</SelectItem>
                                <SelectItem value="other_individual">Other Individual</SelectItem>
                                <SelectItem value="sister">Sister</SelectItem>
                                <SelectItem value="son">Son</SelectItem>
                                <SelectItem value="spouse">Spouse</SelectItem>
                                <SelectItem value="uncle">Uncle</SelectItem>
                              </SelectGroup>
                              <SelectGroup>
                                <SelectLabel>Service Professional</SelectLabel>
                                <SelectItem value="accountant">Accountant</SelectItem>
                                <SelectItem value="estate_lawyer">Estate Lawyer</SelectItem>
                                <SelectItem value="financial_advisor">Financial Advisor</SelectItem>
                                <SelectItem value="property_manager">Property Manager</SelectItem>
                                <SelectItem value="insurance_broker">Insurance Broker</SelectItem>
                                <SelectItem value="realtor">Realtor</SelectItem>
                                <SelectItem value="banker">Banker</SelectItem>
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
                </>
              )}
              
              <div className="flex justify-between pt-4">
                {step === 1 ? (
                  <>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleCancel}
                      className="border border-white/20 bg-transparent text-white hover:bg-gray-800"
                    >
                      Cancel
                    </Button>
                    
                    <Button 
                      type="button"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={handleNext}
                    >
                      Next
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleCancel}
                      className="border border-white/20 bg-transparent text-white hover:bg-gray-800"
                    >
                      Cancel
                    </Button>
                    
                    <div className="flex gap-2">
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={handleBack}
                        className="border border-white/20 bg-transparent text-white hover:bg-gray-800"
                      >
                        Back
                      </Button>
                      
                      <Button 
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Send Invitation
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
