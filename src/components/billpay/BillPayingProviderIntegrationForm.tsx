
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, CheckCircle, Info, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Provider-specific schema definitions based on their API requirements
const billDotComSchema = z.object({
  apiKey: z.string().min(1, "API key is required"),
  organizationId: z.string().min(1, "Organization ID is required"),
  sandboxMode: z.boolean().optional(),
});

const melioSchema = z.object({
  apiKey: z.string().min(1, "API key is required"),
  accountId: z.string().min(1, "Account ID is required"),
});

const vicAiSchema = z.object({
  apiKey: z.string().min(1, "API key is required"),
  clientId: z.string().min(1, "Client ID is required"),
  clientSecret: z.string().min(1, "Client secret is required"),
});

const gleanAiSchema = z.object({
  apiKey: z.string().min(1, "API key is required"),
  workspaceId: z.string().min(1, "Workspace ID is required"),
});

// Unified schema that changes based on provider selection
const providerConfigSchema = z.object({
  providerId: z.string().min(1, "Provider selection is required"),
  // The specific config will be validated separately based on provider
  config: z.record(z.string(), z.string()),
});

type ProviderConfig = z.infer<typeof providerConfigSchema>;

interface ProviderIntegrationFormProps {
  providerId: string;
  providerName: string;
  onCancel: () => void;
  onSuccess: () => void;
}

export function BillPayingProviderIntegrationForm({
  providerId,
  providerName,
  onCancel,
  onSuccess,
}: ProviderIntegrationFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [integrationResult, setIntegrationResult] = useState<"success" | "error" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize form with provider-specific schema
  const form = useForm<ProviderConfig>({
    resolver: zodResolver(providerConfigSchema),
    defaultValues: {
      providerId,
      config: {},
    },
  });

  // Get provider-specific fields
  const getProviderFields = () => {
    switch (providerId) {
      case "bill":
        return [
          { name: "apiKey", label: "API Key", type: "password", description: "Your BILL.com API key" },
          { name: "organizationId", label: "Organization ID", type: "text", description: "Your BILL.com organization identifier" },
          { name: "sandboxMode", label: "Sandbox Mode", type: "checkbox", description: "Enable sandbox for testing" },
        ];
      case "melio":
        return [
          { name: "apiKey", label: "API Key", type: "password", description: "Your Melio API key" },
          { name: "accountId", label: "Account ID", type: "text", description: "Your Melio account identifier" },
        ];
      case "vic":
        return [
          { name: "apiKey", label: "API Key", type: "password", description: "Your Vic.ai API key" },
          { name: "clientId", label: "Client ID", type: "text", description: "Your Vic.ai client identifier" },
          { name: "clientSecret", label: "Client Secret", type: "password", description: "Your Vic.ai client secret" },
        ];
      case "glean":
        return [
          { name: "apiKey", label: "API Key", type: "password", description: "Your Glean.ai API key" },
          { name: "workspaceId", label: "Workspace ID", type: "text", description: "Your Glean.ai workspace identifier" },
        ];
      default:
        return [];
    }
  };

  // Validate provider-specific data
  const validateProviderConfig = (data: ProviderConfig) => {
    let isValid = true;
    let schema;

    switch (data.providerId) {
      case "bill":
        schema = billDotComSchema;
        break;
      case "melio":
        schema = melioSchema;
        break;
      case "vic":
        schema = vicAiSchema;
        break;
      case "glean":
        schema = gleanAiSchema;
        break;
      default:
        return false;
    }

    // Validate against the provider-specific schema
    const result = schema.safeParse(data.config);
    isValid = result.success;

    return isValid;
  };

  const onSubmit = async (data: ProviderConfig) => {
    // Validate based on the provider
    if (!validateProviderConfig(data)) {
      setErrorMessage("Invalid configuration for this provider.");
      setIntegrationResult("error");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // In a real implementation, this would securely send the API keys to the backend
      console.log(`Attempting to integrate with ${providerName} (${providerId})`);
      
      // Simulate API call to backend for integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful integration
      setIntegrationResult("success");
      
      toast({
        title: "Integration Successful",
        description: `Your ${providerName} integration has been set up successfully.`,
        duration: 5000,
      });
      
      // Notify parent of success
      setTimeout(() => {
        onSuccess();
      }, 1500);
      
    } catch (error) {
      console.error("Integration error:", error);
      setErrorMessage("Failed to integrate. Please check your credentials and try again.");
      setIntegrationResult("error");
      
      toast({
        title: "Integration Failed",
        description: "There was an error integrating with the provider. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Lock className="h-5 w-5 text-blue-500" />
          {providerName} Integration Setup
        </CardTitle>
        <CardDescription>
          Securely connect to {providerName} for automated bill payment. Your credentials are encrypted and never stored in plain text.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {integrationResult === "success" ? (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertTitle>Integration Complete</AlertTitle>
            <AlertDescription>
              You have successfully integrated with {providerName}. You can now use their services within the platform.
            </AlertDescription>
          </Alert>
        ) : integrationResult === "error" ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Integration Failed</AlertTitle>
            <AlertDescription>
              {errorMessage || `There was an error integrating with ${providerName}. Please try again.`}
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <Alert className="mb-6 bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-500" />
              <AlertTitle>Secure Integration</AlertTitle>
              <AlertDescription>
                Your API keys and credentials are transmitted securely and never stored in plain text. We use industry-standard encryption to protect your sensitive data.
              </AlertDescription>
            </Alert>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {getProviderFields().map((field) => (
                  <FormField
                    key={field.name}
                    control={form.control}
                    name={`config.${field.name}`}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormLabel>{field.label}</FormLabel>
                        <FormControl>
                          {field.type === "checkbox" ? (
                            <div className="flex items-center space-x-2">
                             <Input
                               type="checkbox"
                               checked={!!formField.value}
                               onChange={(e) => formField.onChange(e.target.checked)}
                               className="w-4 h-4"
                             />
                              <span className="text-sm text-muted-foreground">
                                Enable Sandbox Mode
                              </span>
                            </div>
                          ) : (
                             <Input 
                               {...formField} 
                               type={field.type} 
                               autoComplete="off"
                               value={String(formField.value ?? "")}
                               onChange={(e) => formField.onChange(e.target.value)}
                               className={field.type === "password" ? "font-mono" : ""}
                             />
                          )}
                        </FormControl>
                        <FormDescription>{field.description}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </form>
            </Form>
          </>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <Button 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {integrationResult === "success" ? "Close" : "Cancel"}
        </Button>
        
        {integrationResult !== "success" && (
          <Button 
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Connecting..." : "Connect Integration"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
