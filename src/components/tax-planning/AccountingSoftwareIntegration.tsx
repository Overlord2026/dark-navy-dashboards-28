
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileSpreadsheet, BarChart, CircleDollarSign, Wallet, RefreshCw, ArrowRight, CheckCircle, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

type AccountingSoftware = {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  popular?: boolean;
  connected: boolean;
  lastSync?: string;
};

export function AccountingSoftwareIntegration() {
  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);
  const [selectedSoftware, setSelectedSoftware] = useState<AccountingSoftware | null>(null);
  const [oauthUrl, setOauthUrl] = useState("");
  const [manualApiKey, setManualApiKey] = useState("");
  const [isSyncing, setIsSyncing] = useState<string | null>(null);
  const [accountingSoftwareOptions, setAccountingSoftwareOptions] = useState<AccountingSoftware[]>([
    {
      id: "quickbooks",
      name: "QuickBooks",
      icon: <FileSpreadsheet className="h-8 w-8 text-[#2CA01C]" />,
      description: "Connect to QuickBooks Online for automated tax data import",
      popular: true,
      connected: false
    },
    {
      id: "xero",
      name: "Xero",
      icon: <CircleDollarSign className="h-8 w-8 text-[#13B5EA]" />,
      description: "Import financial data from Xero accounting software",
      popular: true,
      connected: false
    },
    {
      id: "sage",
      name: "Sage",
      icon: <BarChart className="h-8 w-8 text-[#00DC06]" />,
      description: "Sync with Sage for business accounting and tax information",
      connected: false
    },
    {
      id: "freshbooks",
      name: "FreshBooks",
      icon: <Wallet className="h-8 w-8 text-[#0075DD]" />,
      description: "Connect to FreshBooks to import business expense data",
      connected: false
    }
  ]);

  const handleConnectSoftware = (software: AccountingSoftware) => {
    setSelectedSoftware(software);
    setIsConnectDialogOpen(true);
    
    // Set the OAuth URL for each provider
    switch (software.id) {
      case "quickbooks":
        setOauthUrl("https://appcenter.intuit.com/connect/oauth2");
        break;
      case "xero":
        setOauthUrl("https://login.xero.com/identity/connect/authorize");
        break;
      case "sage":
        setOauthUrl("https://www.sage.com/oauth/authorize");
        break;
      case "freshbooks":
        setOauthUrl("https://auth.freshbooks.com/oauth/authorize");
        break;
      default:
        setOauthUrl("");
    }
  };

  const handleConnect = () => {
    if (!selectedSoftware) return;
    
    // For OAuth-based services
    if (oauthUrl) {
      // Simulate successful connection for demonstration
      simulateOAuthConnection();
    } 
    // For API key-based services
    else if (manualApiKey) {
      // Simulate successful connection for API key method
      simulateApiKeyConnection();
    }
    
    setIsConnectDialogOpen(false);
    setManualApiKey("");
  };

  const simulateOAuthConnection = () => {
    if (!selectedSoftware) return;
    
    toast.info(`Connecting to ${selectedSoftware.name}...`, {
      duration: 2000,
    });
    
    // Update the software state after "connection"
    setTimeout(() => {
      setAccountingSoftwareOptions(prev => 
        prev.map(software => 
          software.id === selectedSoftware.id 
            ? { 
                ...software, 
                connected: true,
                lastSync: new Date().toISOString() 
              } 
            : software
        )
      );
      
      toast.success(`${selectedSoftware.name} connected successfully!`, {
        description: "Your accounting data will be synced automatically"
      });
    }, 2000);
  };

  const simulateApiKeyConnection = () => {
    if (!selectedSoftware) return;
    
    toast.info(`Connecting to ${selectedSoftware.name}...`, {
      duration: 2000,
    });
    
    // Update the software state after "connection"
    setTimeout(() => {
      setAccountingSoftwareOptions(prev => 
        prev.map(software => 
          software.id === selectedSoftware.id 
            ? { 
                ...software, 
                connected: true,
                lastSync: new Date().toISOString() 
              } 
            : software
        )
      );
      
      toast.success(`${selectedSoftware.name} API key saved`, {
        description: "Your accounting data will be synced automatically"
      });
    }, 2000);
  };

  const handleSyncData = (softwareId: string, softwareName: string) => {
    setIsSyncing(softwareId);
    
    toast.info(`Syncing data from ${softwareName}...`, {
      description: "Please wait while we import your financial data"
    });
    
    // Simulate completed sync
    setTimeout(() => {
      // Update last sync time
      setAccountingSoftwareOptions(prev => 
        prev.map(software => 
          software.id === softwareId 
            ? { 
                ...software, 
                lastSync: new Date().toISOString() 
              } 
            : software
        )
      );
      
      setIsSyncing(null);
      
      toast.success("Data sync complete", {
        description: "Your tax planning data has been updated successfully"
      });
    }, 3000);
  };

  const handleDisconnect = (softwareId: string, softwareName: string) => {
    toast.info(`Disconnecting ${softwareName}...`, {
      duration: 2000,
    });
    
    // Update the software state after disconnection
    setTimeout(() => {
      setAccountingSoftwareOptions(prev => 
        prev.map(software => 
          software.id === softwareId 
            ? { 
                ...software, 
                connected: false,
                lastSync: undefined
              } 
            : software
        )
      );
      
      toast.success(`${softwareName} disconnected`, {
        description: "Connection removed successfully"
      });
    }, 2000);
  };

  const formatLastSync = (isoDate: string | undefined) => {
    if (!isoDate) return "";
    
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-primary" />
          Accounting Software Integration
        </CardTitle>
        <CardDescription>
          Connect your accounting software to import financial data for tax planning
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {accountingSoftwareOptions.map((software) => (
              <div 
                key={software.id}
                className="border rounded-lg p-4 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {software.icon}
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-medium">{software.name}</h3>
                        {software.popular && (
                          <Badge className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            Popular
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {software.description}
                      </p>
                      {software.connected && software.lastSync && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Last sync: {formatLastSync(software.lastSync)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end space-x-2">
                  {software.connected ? (
                    <>
                      <div className="flex items-center text-green-500">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        <span className="text-sm">Connected</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSyncData(software.id, software.name)}
                        disabled={isSyncing === software.id}
                      >
                        {isSyncing === software.id ? (
                          <>
                            <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                            Syncing...
                          </>
                        ) : (
                          <>Sync Data</>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDisconnect(software.id, software.name)}
                        className="border-destructive/30 text-destructive hover:bg-destructive/10"
                      >
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleConnectSoftware(software)}
                    >
                      Connect <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-primary/5 rounded-md p-4 border border-primary/10 text-sm">
            <h4 className="font-medium mb-2">Why connect your accounting software?</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>Automatically import income, expenses, and deductions</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>Keep your tax planning data up-to-date with regular syncs</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>Ensure accuracy between your books and tax planning</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>Identify tax saving opportunities based on your actual financial data</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
      
      <Dialog open={isConnectDialogOpen} onOpenChange={setIsConnectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect {selectedSoftware?.name}</DialogTitle>
            <DialogDescription>
              {oauthUrl 
                ? `You'll be redirected to ${selectedSoftware?.name} to authorize this connection.`
                : `Enter your ${selectedSoftware?.name} API credentials to connect.`
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {oauthUrl ? (
              <div className="space-y-4">
                <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-800 dark:bg-blue-950 dark:text-blue-200">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <ExternalLink className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium">Secure OAuth Connection</h3>
                      <p className="mt-1">
                        You'll be redirected to {selectedSoftware?.name} to securely log in. We never store your {selectedSoftware?.name} credentials.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center p-2">
                  <Button onClick={handleConnect} className="w-full">
                    Authorize with {selectedSoftware?.name}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <Input 
                    id="api-key" 
                    placeholder="Enter your API key" 
                    value={manualApiKey}
                    onChange={(e) => setManualApiKey(e.target.value)}
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  Your API key is stored securely and encrypted. We never share your credentials.
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsConnectDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleConnect} disabled={!oauthUrl && !manualApiKey}>
              Connect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
