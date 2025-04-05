
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertTriangle, 
  CheckCircle, 
  ChevronRight, 
  Info, 
  Lock, 
  Shield 
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export interface IntegrationSetupWizardProps {
  isOpen: boolean;
  onClose: () => void;
  integration: {
    id: string;
    name: string;
    logoUrl: string;
    fields: Array<{
      name: string;
      label: string;
      type: string;
      required: boolean;
      description?: string;
      placeholder?: string;
    }>;
    documentation?: string;
    setupSteps?: string[];
  };
  onComplete: (integrationId: string, credentials: Record<string, string>) => void;
}

export function IntegrationSetupWizard({
  isOpen,
  onClose,
  integration,
  onComplete
}: IntegrationSetupWizardProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Dynamically create Zod schema based on integration fields
  const createFormSchema = () => {
    const schemaObject: Record<string, any> = {};
    
    integration.fields.forEach((field) => {
      if (field.required) {
        schemaObject[field.name] = z.string().min(1, `${field.label} is required`);
      } else {
        schemaObject[field.name] = z.string().optional();
      }
    });
    
    return z.object(schemaObject);
  };

  const formSchema = createFormSchema();
  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: integration.fields.reduce((acc, field) => {
      acc[field.name] = "";
      return acc;
    }, {} as Record<string, string>),
  });

  const handleNext = () => {
    if (currentStep < (integration.setupSteps?.length || 0)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would securely send credentials to your backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful connection
      setIsComplete(true);
      
      toast({
        title: "Integration Successful",
        description: `${integration.name} has been connected successfully.`,
      });
      
      setTimeout(() => {
        onComplete(integration.id, data);
      }, 1500);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: "There was a problem connecting. Please check your credentials and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseDialog = () => {
    setCurrentStep(0);
    setIsComplete(false);
    form.reset();
    onClose();
  };

  // Render setup steps if provided, otherwise go straight to the form
  const renderContent = () => {
    if (isComplete) {
      return (
        <>
          <div className="flex flex-col items-center my-8">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-medium">Integration Complete</h3>
            <p className="text-center text-muted-foreground mt-2">
              You've successfully connected to {integration.name}. Your data will start syncing shortly.
            </p>
          </div>

          <DialogFooter>
            <Button onClick={handleCloseDialog} className="w-full">
              Done
            </Button>
          </DialogFooter>
        </>
      );
    }

    if (integration.setupSteps && currentStep < integration.setupSteps.length) {
      return (
        <>
          <div className="py-6">
            <h3 className="text-lg font-medium mb-2">Step {currentStep + 1}: {`Get Ready to Connect`}</h3>
            <p className="text-muted-foreground mb-6">{integration.setupSteps[currentStep]}</p>
            
            <Alert className="bg-blue-50 border-blue-200 mb-4">
              <Info className="h-4 w-4 text-blue-500" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                You may need to log into your {integration.name} account to complete this step.
              </AlertDescription>
            </Alert>
            
            {integration.documentation && (
              <div className="text-sm text-muted-foreground">
                Need help? <a href="#" className="text-primary underline">View documentation</a>
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <Button variant="outline" onClick={handleBack} disabled={currentStep === 0}>
              Back
            </Button>
            <Button onClick={handleNext}>
              Next <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </DialogFooter>
        </>
      );
    }

    return (
      <>
        <div className="py-4">
          <div className="bg-muted p-4 rounded-lg mb-6 flex items-center space-x-3">
            <div className="h-10 w-10 rounded-md bg-white p-1 flex items-center justify-center overflow-hidden flex-shrink-0">
              <img 
                src={integration.logoUrl} 
                alt={`${integration.name} logo`} 
                className="h-full w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://placehold.co/40x40/gray/white?text=${integration.name.charAt(0)}`;
                }}
              />
            </div>
            <div>
              <h3 className="font-medium">Connect to {integration.name}</h3>
              <p className="text-sm text-muted-foreground">
                Enter your credentials to establish a secure connection
              </p>
            </div>
          </div>

          <Alert className="bg-blue-50 border-blue-200 mb-6">
            <Shield className="h-4 w-4 text-blue-500" />
            <AlertTitle>Secure Connection</AlertTitle>
            <AlertDescription>
              Your credentials are encrypted and securely stored. We use industry-standard practices to protect your data.
            </AlertDescription>
          </Alert>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              {integration.fields.map((field) => (
                <FormField
                  key={field.name}
                  control={form.control}
                  name={field.name}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel>{field.label} {field.required && <span className="text-destructive">*</span>}</FormLabel>
                      <FormControl>
                        <Input
                          {...formField}
                          type={field.type || "text"}
                          placeholder={field.placeholder || ""}
                          className={field.type === "password" ? "font-mono" : ""}
                          autoComplete={field.type === "password" ? "new-password" : "off"}
                        />
                      </FormControl>
                      {field.description && (
                        <p className="text-xs text-muted-foreground mt-1">{field.description}</p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              
              <div className="pt-4">
                <p className="flex items-center text-xs text-muted-foreground">
                  <Lock className="h-3 w-3 mr-1" /> 
                  Your credentials are encrypted and securely stored.
                </p>
              </div>
            </form>
          </Form>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleCloseDialog} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={form.handleSubmit(handleSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Connecting..." : "Connect to " + integration.name}
          </Button>
        </DialogFooter>
      </>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {isComplete ? "Integration Complete" : `Connect to ${integration.name}`}
          </DialogTitle>
          {!isComplete && (
            <DialogDescription>
              Follow the steps below to connect your account
            </DialogDescription>
          )}
        </DialogHeader>
        
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
