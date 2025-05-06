
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Download, Settings, Info, AlertTriangle, CheckCircle, ShieldCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Plugins() {
  const plugins = [
    {
      id: "plugin-1",
      name: "Tax Document Scanner",
      description: "Automatically extracts data from uploaded tax documents using OCR technology",
      category: "Document Processing",
      version: "2.3.1",
      enabled: true,
      status: "active",
      compliance: ["SOC-2", "GDPR"],
      lastUpdated: "2023-11-01",
      publisher: "FinTech Solutions Inc."
    },
    {
      id: "plugin-2",
      name: "Financial Data Connector",
      description: "Connects to major financial institutions for automated data retrieval",
      category: "Financial Integration",
      version: "3.0.5",
      enabled: true,
      status: "active",
      compliance: ["SOC-2", "PCI-DSS", "GDPR"],
      lastUpdated: "2023-10-15",
      publisher: "Open Banking Technologies"
    },
    {
      id: "plugin-3",
      name: "AI Investment Analyzer",
      description: "Provides AI-powered analysis of investment portfolios and recommendations",
      category: "Investment Tools",
      version: "1.8.2",
      enabled: true,
      status: "warning",
      compliance: ["SOC-2"],
      lastUpdated: "2023-09-20",
      publisher: "Wealth Intelligence Ltd."
    },
    {
      id: "plugin-4",
      name: "Estate Plan Generator",
      description: "Template-based generation of estate planning documents",
      category: "Legal Documents",
      version: "2.1.0",
      enabled: false,
      status: "inactive",
      compliance: ["SOC-2", "HIPAA"],
      lastUpdated: "2023-08-05",
      publisher: "LegalTech Solutions"
    }
  ];

  const availablePlugins = [
    {
      id: "available-1",
      name: "Multi-Currency Tracker",
      description: "Track and analyze assets across multiple currencies and markets",
      category: "Financial Tools",
      publisher: "Global Finance Apps Ltd.",
      rating: 4.7,
      installations: "1.2k"
    },
    {
      id: "available-2",
      name: "Family Governance Portal",
      description: "Tools for family meeting management and decision documentation",
      category: "Governance",
      publisher: "Family Business Solutions",
      rating: 4.5,
      installations: "850"
    },
    {
      id: "available-3",
      name: "Philanthropy Impact Tracker",
      description: "Measure and report on the impact of charitable giving",
      category: "Philanthropy",
      publisher: "Social Impact Metrics Inc.",
      rating: 4.8,
      installations: "750"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Integration Plugins</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Install Plugin
          </Button>
        </div>
      </div>

      <Tabs defaultValue="installed" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="installed">Installed Plugins (4)</TabsTrigger>
          <TabsTrigger value="marketplace">Plugin Marketplace</TabsTrigger>
          <TabsTrigger value="settings">Plugin Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="installed" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plugins.map((plugin) => (
              <Card key={plugin.id} className={
                plugin.status === "warning" ? "border-yellow-300" : 
                plugin.status === "inactive" ? "border-gray-300 opacity-70" : ""
              }>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>{plugin.name}</CardTitle>
                    <Switch checked={plugin.enabled} />
                  </div>
                  <CardDescription>{plugin.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Version {plugin.version}</span>
                      <div>
                        {plugin.status === "active" && (
                          <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
                        )}
                        {plugin.status === "warning" && (
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Needs Attention</Badge>
                        )}
                        {plugin.status === "inactive" && (
                          <Badge variant="outline">Inactive</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Category:</span>
                        <span>{plugin.category}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Publisher:</span>
                        <span>{plugin.publisher}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Last Updated:</span>
                        <span>{plugin.lastUpdated}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {plugin.compliance.map((cert, i) => (
                        <div key={i} className="flex items-center gap-1 text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                          <ShieldCheck className="h-3 w-3" />
                          {cert}
                        </div>
                      ))}
                    </div>
                    
                    {plugin.status === "warning" && (
                      <div className="flex items-center p-2 bg-yellow-50 rounded border border-yellow-200 text-sm">
                        <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
                        <span>Update available to address security vulnerabilities</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Info className="h-4 w-4" />
                    Details
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Settings className="h-4 w-4" />
                    Configure
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="marketplace" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {availablePlugins.map((plugin) => (
              <Card key={plugin.id}>
                <CardHeader>
                  <CardTitle>{plugin.name}</CardTitle>
                  <CardDescription>{plugin.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Category:</span>
                      <span>{plugin.category}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Publisher:</span>
                      <span>{plugin.publisher}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Rating:</span>
                      <div className="flex items-center">
                        {plugin.rating}
                        <span className="text-yellow-500 ml-1">★★★★★</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Installations:</span>
                      <span>{plugin.installations}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full gap-2">
                    <Download className="h-4 w-4" />
                    Install
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Plugin System Settings</CardTitle>
              <CardDescription>Manage how plugins operate within the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Automatic Updates</p>
                    <p className="text-sm text-muted-foreground">Allow plugins to update automatically when new versions are available</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Security Scanning</p>
                    <p className="text-sm text-muted-foreground">Scan all plugins for security vulnerabilities before installation</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Require SOC-2 Compliance</p>
                    <p className="text-sm text-muted-foreground">Only allow installation of plugins that meet SOC-2 compliance standards</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Plugin Isolation</p>
                    <p className="text-sm text-muted-foreground">Run plugins in isolated environments for enhanced security</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">Data Access Restrictions</p>
                      <Badge className="bg-green-100 text-green-800">Recommended</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Limit plugin access to only necessary data and APIs</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
