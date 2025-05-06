
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Maximize2, Share2 } from "lucide-react";

export default function Architecture() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">System Architecture</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">System Overview</TabsTrigger>
          <TabsTrigger value="dataflow">Data Flow</TabsTrigger>
          <TabsTrigger value="security">Security Architecture</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>System Architecture Overview</CardTitle>
              <CardDescription>Comprehensive view of the Family Office Marketplace ecosystem</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative bg-muted rounded-lg p-6 mb-4">
                <div className="absolute top-2 right-2">
                  <Button size="icon" variant="ghost" className="h-6 w-6">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Architecture Diagram Mockup */}
                <div className="min-h-[400px] flex flex-col items-center justify-center border-4 border-dashed border-muted-foreground/20 rounded-lg p-6">
                  <div className="w-full max-w-3xl">
                    {/* Level 1: Client Layer */}
                    <div className="flex justify-center mb-8">
                      <div className="bg-blue-100 rounded-lg p-3 px-8 text-blue-800 font-medium border border-blue-200">
                        Client Applications
                      </div>
                    </div>
                    
                    {/* Level 2: API Layer */}
                    <div className="flex justify-center mb-8 relative">
                      <div className="bg-purple-100 rounded-lg p-3 px-12 text-purple-800 font-medium border border-purple-200">
                        API Gateway & Integration Layer
                      </div>
                      <div className="absolute -top-4 right-1/4 bg-orange-100 rounded-full px-3 py-1 text-xs border border-orange-200">
                        SOC-2 Compliant
                      </div>
                    </div>
                    
                    {/* Level 3: Services */}
                    <div className="flex justify-between mb-8">
                      <div className="bg-green-100 rounded-lg p-3 text-green-800 font-medium border border-green-200">
                        Financial Services
                      </div>
                      <div className="bg-green-100 rounded-lg p-3 text-green-800 font-medium border border-green-200">
                        Wealth Management
                      </div>
                      <div className="bg-green-100 rounded-lg p-3 text-green-800 font-medium border border-green-200">
                        Estate Planning
                      </div>
                      <div className="bg-green-100 rounded-lg p-3 text-green-800 font-medium border border-green-200">
                        Tax Services
                      </div>
                    </div>
                    
                    {/* Level 4: Data Layer */}
                    <div className="flex justify-center">
                      <div className="bg-gray-100 rounded-lg p-3 px-16 text-gray-800 font-medium border border-gray-200">
                        Secure Data Storage Layer
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 mt-6">
                <h4 className="font-medium">Architecture Components</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-3">
                    <h5 className="font-medium flex items-center gap-2">
                      Client Applications
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">Frontend</Badge>
                    </h5>
                    <p className="text-sm text-muted-foreground mt-1">Web and mobile applications providing user interfaces for family office members, advisors, and administrators.</p>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <h5 className="font-medium flex items-center gap-2">
                      API Gateway
                      <Badge className="bg-purple-100 text-purple-800 border-purple-200">Integration</Badge>
                    </h5>
                    <p className="text-sm text-muted-foreground mt-1">Centralized access point for all API services, handling authentication, rate limiting, and request routing.</p>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <h5 className="font-medium flex items-center gap-2">
                      Service Modules
                      <Badge className="bg-green-100 text-green-800 border-green-200">Microservices</Badge>
                    </h5>
                    <p className="text-sm text-muted-foreground mt-1">Specialized modules for financial services, wealth management, estate planning, and tax services.</p>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <h5 className="font-medium flex items-center gap-2">
                      Data Storage
                      <Badge className="bg-gray-100 text-gray-800 border-gray-200">Infrastructure</Badge>
                    </h5>
                    <p className="text-sm text-muted-foreground mt-1">Secure, encrypted storage for all client data with strict access controls and audit logging.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="dataflow" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Flow Architecture</CardTitle>
              <CardDescription>How data moves between components in the Family Office Marketplace</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-6 bg-muted rounded-lg text-center">
                <p>Data flow diagram would be displayed here</p>
                <p className="text-sm text-muted-foreground mt-2">This diagram would show the flow of information between different system components</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Architecture</CardTitle>
              <CardDescription>SOC-2 compliant security framework and implementation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-6 bg-muted rounded-lg text-center">
                <p>Security architecture diagram would be displayed here</p>
                <p className="text-sm text-muted-foreground mt-2">This diagram would illustrate the security measures implemented across the system</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
