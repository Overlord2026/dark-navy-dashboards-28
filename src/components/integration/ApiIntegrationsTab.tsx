
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Check, Code, Copy, ExternalLink, Lock, Shield } from "lucide-react";
import { toast } from "sonner";

export function ApiIntegrationsTab() {
  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    toast.success(message);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">API Integrations</h2>
        <Button variant="outline" className="flex items-center gap-2">
          <Shield className="h-4 w-4" /> Generate New API Keys
        </Button>
      </div>
      
      <p className="text-muted-foreground mb-4">
        Securely integrate with Family Office Marketplace services using our comprehensive API suite.
      </p>
      
      {/* API Keys Section */}
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-medium mb-4">Your API Keys</h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Production API Key</span>
              <Badge className="bg-green-600">Active</Badge>
            </div>
            <div className="flex items-center">
              <code className="bg-background px-3 py-1 rounded border border-border flex-1 font-mono text-xs md:text-sm overflow-hidden text-ellipsis">
                •••••••••••••••••••••••••••fam_prod_2023
              </code>
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-2"
                onClick={() => copyToClipboard("bfo_api_key_1234567890fam_prod_2023", "Production API key copied")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Created: March 15, 2024 • Last used: 2 hours ago</p>
          </div>
          
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Development API Key</span>
              <Badge variant="outline">Development</Badge>
            </div>
            <div className="flex items-center">
              <code className="bg-background px-3 py-1 rounded border border-border flex-1 font-mono text-xs md:text-sm overflow-hidden text-ellipsis">
                •••••••••••••••••••••••••••fam_dev_2023
              </code>
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-2"
                onClick={() => copyToClipboard("bfo_api_key_0987654321fam_dev_2023", "Development API key copied")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Created: March 15, 2024 • Last used: 1 day ago</p>
          </div>
        </div>
      </Card>
      
      {/* Available APIs Section */}
      <h3 className="text-lg font-medium mb-4">Available APIs</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Portfolio Data API */}
        <Card className="p-6 border-l-4 border-l-blue-500">
          <div className="flex justify-between items-start">
            <h4 className="font-medium">Portfolio Data API</h4>
            <Badge className="bg-blue-500">Connected</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            Access and manage investment portfolio data.
          </p>
          
          <div className="space-y-1 mb-4">
            <div className="flex items-center text-sm">
              <Check className="h-4 w-4 text-green-500 mr-2" />
              <span>Read/write account data</span>
            </div>
            <div className="flex items-center text-sm">
              <Check className="h-4 w-4 text-green-500 mr-2" />
              <span>Performance metrics</span>
            </div>
            <div className="flex items-center text-sm">
              <Check className="h-4 w-4 text-green-500 mr-2" />
              <span>Asset allocation data</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Code className="h-4 w-4" /> Sample Request
            </Button>
            <Button variant="ghost" size="sm" className="text-blue-500 flex items-center gap-1">
              <BookOpen className="h-4 w-4" /> Documentation
            </Button>
          </div>
        </Card>
        
        {/* Document Sharing API */}
        <Card className="p-6">
          <div className="flex justify-between items-start">
            <h4 className="font-medium">Document Sharing API</h4>
            <Badge variant="outline">Available</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            Securely share documents between integrated applications.
          </p>
          
          <div className="space-y-1 mb-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Lock className="h-4 w-4 mr-2" />
              <span>Encrypted document transfer</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Lock className="h-4 w-4 mr-2" />
              <span>Access control management</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Lock className="h-4 w-4 mr-2" />
              <span>Version history tracking</span>
            </div>
          </div>
          
          <div className="flex items-center justify-end">
            <Button className="flex items-center gap-2">
              <Shield className="h-4 w-4" /> Enable API
            </Button>
          </div>
        </Card>
        
        {/* Client Data API */}
        <Card className="p-6">
          <div className="flex justify-between items-start">
            <h4 className="font-medium">Client Data API</h4>
            <Badge variant="outline">Available</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            Access and manage client profile information.
          </p>
          
          <div className="space-y-1 mb-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Lock className="h-4 w-4 mr-2" />
              <span>Basic profile access</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Lock className="h-4 w-4 mr-2" />
              <span>Contact information</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Lock className="h-4 w-4 mr-2" />
              <span>Preference management</span>
            </div>
          </div>
          
          <div className="flex items-center justify-end">
            <Button className="flex items-center gap-2">
              <Shield className="h-4 w-4" /> Enable API
            </Button>
          </div>
        </Card>
        
        {/* Tax Planning API */}
        <Card className="p-6">
          <div className="flex justify-between items-start">
            <h4 className="font-medium">Tax Planning API</h4>
            <Badge variant="outline">Available</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            Tax scenario modeling and optimization.
          </p>
          
          <div className="space-y-1 mb-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Lock className="h-4 w-4 mr-2" />
              <span>Tax projection data</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Lock className="h-4 w-4 mr-2" />
              <span>Strategy recommendations</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Lock className="h-4 w-4 mr-2" />
              <span>Historical tax data</span>
            </div>
          </div>
          
          <div className="flex items-center justify-end">
            <Button className="flex items-center gap-2">
              <Shield className="h-4 w-4" /> Enable API
            </Button>
          </div>
        </Card>
      </div>
      
      <div className="flex justify-center mt-6">
        <Button variant="outline" className="flex items-center gap-2">
          <ExternalLink className="h-4 w-4" /> Visit API Documentation Portal
        </Button>
      </div>
    </div>
  );
}
