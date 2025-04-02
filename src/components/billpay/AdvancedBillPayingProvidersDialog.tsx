
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BillPayingProviderIntegrationForm } from "./BillPayingProviderIntegrationForm";

interface AdvancedBillPayingProvidersDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

// Define the provider data structure
interface Provider {
  id: string;
  name: string;
  description: string;
  logo: string;
  website: string;
  integrated?: boolean;
}

export function AdvancedBillPayingProvidersDialog({
  isOpen,
  onClose,
}: AdvancedBillPayingProvidersDialogProps) {
  const { toast } = useToast();
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

  // Sample data for bill paying providers
  const [providers, setProviders] = useState<Provider[]>([
    {
      id: "bill",
      name: "BILL.com",
      description: "Automate your accounts payable and receivable processes with digital payments, invoicing, and automated approval workflows.",
      logo: "https://logo.clearbit.com/bill.com",
      website: "https://www.bill.com",
    },
    {
      id: "melio",
      name: "Melio",
      description: "Simple, secure B2B payments solution that helps businesses manage bills and get paid online with multiple payment options.",
      logo: "https://logo.clearbit.com/meliopayments.com",
      website: "https://www.melio.com",
    },
    {
      id: "vic",
      name: "Vic.ai",
      description: "AI-powered accounting platform that automates accounts payable and financial operations using machine learning.",
      logo: "https://logo.clearbit.com/vic.ai",
      website: "https://www.vic.ai",
    },
    {
      id: "glean",
      name: "Glean.ai",
      description: "Spend intelligence platform that helps finance teams track, analyze, and optimize business spending with AI.",
      logo: "https://logo.clearbit.com/glean.ai",
      website: "https://www.glean.ai",
    },
  ]);

  const handleIntegrate = (provider: Provider) => {
    setSelectedProvider(provider);
  };

  const handleExternalLink = (website: string, providerName: string) => {
    window.open(website, "_blank", "noopener,noreferrer");
    console.log(`Opening website for ${providerName}: ${website}`);
  };

  const handleIntegrationSuccess = () => {
    if (selectedProvider) {
      // Mark the provider as integrated
      setProviders(prev => 
        prev.map(p => 
          p.id === selectedProvider.id 
            ? { ...p, integrated: true } 
            : p
        )
      );
      
      // Clear the selected provider after a delay to show success state
      setTimeout(() => {
        setSelectedProvider(null);
      }, 2000);
    }
  };

  const handleCancelIntegration = () => {
    setSelectedProvider(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        {selectedProvider ? (
          <BillPayingProviderIntegrationForm 
            providerId={selectedProvider.id}
            providerName={selectedProvider.name}
            onCancel={handleCancelIntegration}
            onSuccess={handleIntegrationSuccess}
          />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">Advanced Bill Paying Providers</DialogTitle>
              <DialogDescription>
                Connect with these third-party services to enhance your bill payment capabilities.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              {providers.map((provider) => (
                <Card key={provider.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="h-8 w-8 mr-2 rounded bg-muted flex items-center justify-center overflow-hidden">
                        <img 
                          src={provider.logo} 
                          alt={`${provider.name} logo`}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://placehold.co/30x30/gray/white?text=" + provider.name.charAt(0);
                          }}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <CardTitle className="text-lg">{provider.name}</CardTitle>
                      {provider.integrated && (
                        <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{provider.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleExternalLink(provider.website, provider.name)}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Learn More
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleIntegrate(provider)}
                      disabled={provider.integrated}
                    >
                      {provider.integrated ? "Integrated" : "Integrate Now"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
