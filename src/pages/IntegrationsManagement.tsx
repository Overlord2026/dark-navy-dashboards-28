
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { IntegrationCard } from "@/components/integrations/IntegrationCard";
import { IntegrationSetupWizard } from "@/components/integrations/IntegrationSetupWizard";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SearchIcon, Filter, CheckCircle, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Define integration types
type IntegrationCategory = "accounting" | "banking" | "payments" | "expense" | "all";

interface Integration {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  category: "accounting" | "banking" | "payments" | "expense";
  isConnected: boolean;
  lastSynced?: Date;
  isPopular?: boolean;
  benefits: string[];
  fields: Array<{
    name: string;
    label: string;
    type: string;
    required: boolean;
    description?: string;
    placeholder?: string;
  }>;
  setupSteps?: string[];
  documentation?: string;
}

export default function IntegrationsManagement() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<IntegrationCategory>("all");
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [isSetupWizardOpen, setIsSetupWizardOpen] = useState(false);
  
  // Sample integration data
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "quickbooks",
      name: "QuickBooks",
      description: "Sync accounting data, bills, and invoice information automatically.",
      logoUrl: "https://logo.clearbit.com/quickbooks.com",
      category: "accounting",
      isConnected: false,
      isPopular: true,
      benefits: [
        "Automatic bill imports from QuickBooks",
        "Two-way sync of payment data",
        "Accounting reconciliation",
        "Real-time balance updates"
      ],
      fields: [
        { 
          name: "apiKey", 
          label: "API Key", 
          type: "password", 
          required: true,
          description: "Find this in your QuickBooks Developer Account",
          placeholder: "Enter your API key"
        },
        { 
          name: "companyId", 
          label: "Company ID", 
          type: "text", 
          required: true,
          description: "Your QuickBooks Company ID"
        }
      ],
      setupSteps: [
        "Log in to your QuickBooks account and navigate to the Developer Portal.",
        "Create a new app and get your API credentials.",
        "Enter your API credentials to establish the connection."
      ]
    },
    {
      id: "bill",
      name: "Bill.com",
      description: "Automate your accounts payable and receivable processes.",
      logoUrl: "https://logo.clearbit.com/bill.com",
      category: "payments",
      isConnected: false,
      isPopular: true,
      benefits: [
        "Automated invoice processing",
        "Streamlined approval workflows",
        "Simplified vendor management",
        "Paperless bill payments"
      ],
      fields: [
        { 
          name: "apiKey", 
          label: "API Key", 
          type: "password", 
          required: true,
          description: "Your Bill.com Developer API key" 
        },
        { 
          name: "organizationId", 
          label: "Organization ID", 
          type: "text", 
          required: true
        }
      ]
    },
    {
      id: "plaid",
      name: "Plaid",
      description: "Connect bank accounts securely and access financial data.",
      logoUrl: "https://logo.clearbit.com/plaid.com",
      category: "banking",
      isConnected: false,
      benefits: [
        "Secure bank account linking",
        "Real-time transaction data",
        "Balance verification",
        "Account authentication"
      ],
      fields: [
        { 
          name: "clientId", 
          label: "Client ID", 
          type: "text", 
          required: true 
        },
        { 
          name: "secret", 
          label: "Secret Key", 
          type: "password", 
          required: true 
        }
      ]
    },
    {
      id: "melio",
      name: "Melio",
      description: "B2B payment platform for businesses to transfer and receive payments.",
      logoUrl: "https://logo.clearbit.com/meliopayments.com",
      category: "payments",
      isConnected: false,
      benefits: [
        "Multiple payment options (ACH, check, credit card)",
        "Scheduled payments",
        "Payment approval workflows",
        "Vendor data management"
      ],
      fields: [
        { 
          name: "apiKey", 
          label: "API Key", 
          type: "password", 
          required: true 
        },
        { 
          name: "accountId", 
          label: "Account ID", 
          type: "text", 
          required: true 
        }
      ]
    },
    {
      id: "vic",
      name: "Vic.ai",
      description: "AI-powered accounting platform for automated bill processing.",
      logoUrl: "https://logo.clearbit.com/vic.ai",
      category: "accounting",
      isConnected: false,
      benefits: [
        "AI-powered invoice recognition",
        "Automated coding",
        "Compliance checks",
        "Invoice data extraction"
      ],
      fields: [
        { 
          name: "apiKey", 
          label: "API Key", 
          type: "password", 
          required: true 
        },
        { 
          name: "clientId", 
          label: "Client ID", 
          type: "text", 
          required: true 
        },
        { 
          name: "clientSecret", 
          label: "Client Secret", 
          type: "password", 
          required: true 
        }
      ]
    },
    {
      id: "glean",
      name: "Glean.ai",
      description: "Spend intelligence platform for tracking and analyzing expenses.",
      logoUrl: "https://logo.clearbit.com/glean.ai",
      category: "expense",
      isConnected: false,
      benefits: [
        "Automatic expense categorization",
        "Spend analytics",
        "Budget tracking",
        "Anomaly detection"
      ],
      fields: [
        { 
          name: "apiKey", 
          label: "API Key", 
          type: "password", 
          required: true 
        },
        { 
          name: "workspaceId", 
          label: "Workspace ID", 
          type: "text", 
          required: true 
        }
      ]
    },
    {
      id: "xero",
      name: "Xero",
      description: "Cloud-based accounting software for small businesses.",
      logoUrl: "https://logo.clearbit.com/xero.com",
      category: "accounting",
      isConnected: false,
      benefits: [
        "Multi-currency support",
        "Inventory tracking",
        "Project time tracking",
        "Financial reporting"
      ],
      fields: [
        { 
          name: "clientId", 
          label: "Client ID", 
          type: "text", 
          required: true 
        },
        { 
          name: "clientSecret", 
          label: "Client Secret", 
          type: "password", 
          required: true 
        }
      ]
    },
    {
      id: "expensify",
      name: "Expensify",
      description: "Expense management and receipt tracking solution.",
      logoUrl: "https://logo.clearbit.com/expensify.com",
      category: "expense",
      isConnected: false,
      benefits: [
        "Receipt scanning",
        "Automatic policy enforcement",
        "Corporate card reconciliation",
        "Approval workflows"
      ],
      fields: [
        { 
          name: "apiKey", 
          label: "API Key", 
          type: "password", 
          required: true 
        },
        { 
          name: "partnerUserID", 
          label: "Partner User ID", 
          type: "text", 
          required: true 
        }
      ]
    }
  ]);

  const handleConnect = (integrationId: string) => {
    const integration = integrations.find(i => i.id === integrationId);
    if (integration) {
      setSelectedIntegration(integration);
      setIsSetupWizardOpen(true);
    }
  };

  const handleLearnMore = (integrationId: string) => {
    const integration = integrations.find(i => i.id === integrationId);
    if (integration) {
      // In a real app, this would open a detailed page or link to external docs
      toast({
        title: `About ${integration.name}`,
        description: "Opening documentation in a new tab.",
      });
      
      // Simulate opening documentation
      console.log(`Opening documentation for ${integration.name}`);
    }
  };

  const handleSyncNow = (integrationId: string) => {
    const integration = integrations.find(i => i.id === integrationId);
    if (integration) {
      toast({
        title: "Syncing data",
        description: `Synchronizing with ${integration.name}. This may take a moment.`,
      });
      
      // Simulate a successful sync
      setTimeout(() => {
        setIntegrations(prevIntegrations => 
          prevIntegrations.map(i => 
            i.id === integrationId 
              ? { ...i, lastSynced: new Date() } 
              : i
          )
        );
        
        toast({
          title: "Sync Complete",
          description: `Successfully synchronized with ${integration.name}.`,
        });
      }, 2000);
    }
  };

  const handleSettings = (integrationId: string) => {
    const integration = integrations.find(i => i.id === integrationId);
    if (integration) {
      toast({
        title: "Integration Settings",
        description: `Opening settings for ${integration.name}.`,
      });
      
      // In a real app, this would open settings dialog
      console.log(`Opening settings for ${integration.name}`);
    }
  };

  const handleSetupComplete = (integrationId: string, credentials: Record<string, string>) => {
    // In a real app, these credentials would be sent to your backend
    console.log(`Setting up integration ${integrationId} with:`, credentials);
    
    setIntegrations(prevIntegrations => 
      prevIntegrations.map(integration => 
        integration.id === integrationId 
          ? { ...integration, isConnected: true, lastSynced: new Date() } 
          : integration
      )
    );
    
    setIsSetupWizardOpen(false);
    setSelectedIntegration(null);
  };

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || integration.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Sort with connected integrations first, then popular ones
  const sortedIntegrations = [...filteredIntegrations].sort((a, b) => {
    if (a.isConnected && !b.isConnected) return -1;
    if (!a.isConnected && b.isConnected) return 1;
    if (a.isPopular && !b.isPopular) return -1;
    if (!a.isPopular && b.isPopular) return 1;
    return a.name.localeCompare(b.name);
  });

  const connectedCount = integrations.filter(i => i.isConnected).length;

  return (
    <ThreeColumnLayout title="Integrations Management" activeMainItem="cash-management">
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Integrations Management</h1>
          <p className="text-muted-foreground mt-2">
            Connect with third-party services to enhance your bill pay and financial management experience.
          </p>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <ShieldCheck className="text-blue-600 h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-blue-800">Secure Connections</h3>
              <p className="text-blue-600 text-sm mt-1">
                Your data is encrypted and protected. We use OAuth and secure API connections 
                where possible, and never store sensitive credentials in plain text.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <TabsList>
                <TabsTrigger value="all">All ({integrations.length})</TabsTrigger>
                <TabsTrigger value="connected">Connected ({connectedCount})</TabsTrigger>
                <TabsTrigger value="available">Available ({integrations.length - connectedCount})</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                  <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search integrations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
                
                <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as IntegrationCategory)}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="accounting">Accounting</SelectItem>
                    <SelectItem value="banking">Banking</SelectItem>
                    <SelectItem value="payments">Payments</SelectItem>
                    <SelectItem value="expense">Expense Management</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <TabsContent value="all" className="m-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedIntegrations.map((integration) => (
                  <IntegrationCard
                    key={integration.id}
                    {...integration}
                    onConnect={handleConnect}
                    onLearnMore={handleLearnMore}
                    onSyncNow={integration.isConnected ? handleSyncNow : undefined}
                    onSettings={integration.isConnected ? handleSettings : undefined}
                  />
                ))}
              </div>
              
              {sortedIntegrations.length === 0 && (
                <div className="text-center py-12 border rounded-lg">
                  <p className="text-muted-foreground">No integrations found matching your criteria</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="connected" className="m-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedIntegrations
                  .filter(integration => integration.isConnected)
                  .map((integration) => (
                    <IntegrationCard
                      key={integration.id}
                      {...integration}
                      onConnect={handleConnect}
                      onLearnMore={handleLearnMore}
                      onSyncNow={handleSyncNow}
                      onSettings={handleSettings}
                    />
                  ))
                }
              </div>
              
              {sortedIntegrations.filter(i => i.isConnected).length === 0 && (
                <div className="text-center py-12 border rounded-lg">
                  <p className="text-muted-foreground">No connected integrations yet</p>
                  <Button variant="outline" className="mt-4" onClick={() => setSelectedCategory("all")}>
                    Browse Available Integrations
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="available" className="m-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedIntegrations
                  .filter(integration => !integration.isConnected)
                  .map((integration) => (
                    <IntegrationCard
                      key={integration.id}
                      {...integration}
                      onConnect={handleConnect}
                      onLearnMore={handleLearnMore}
                      onSyncNow={undefined}
                      onSettings={undefined}
                    />
                  ))
                }
              </div>
              
              {sortedIntegrations.filter(i => !i.isConnected).length === 0 && (
                <div className="text-center py-12 border rounded-lg">
                  <p className="text-muted-foreground">
                    No available integrations found matching your criteria
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        {selectedIntegration && (
          <IntegrationSetupWizard
            isOpen={isSetupWizardOpen}
            onClose={() => {
              setIsSetupWizardOpen(false);
              setSelectedIntegration(null);
            }}
            integration={selectedIntegration}
            onComplete={handleSetupComplete}
          />
        )}
      </div>
    </ThreeColumnLayout>
  );
}
