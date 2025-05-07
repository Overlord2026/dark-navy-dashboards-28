
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Download, Star, Settings2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const PluginsTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Plugins Marketplace</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-10 w-[250px]" placeholder="Search plugins..." />
          </div>
          <Button variant="outline">
            <Settings2 className="mr-2 h-4 w-4" /> Manage Plugins
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Installed Plugin */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center mb-1">
              <div className="bg-primary/10 w-10 h-10 rounded flex items-center justify-center">
                <img src="/placeholder.svg" alt="Document AI" className="w-6 h-6" />
              </div>
              <Badge variant="secondary">Installed</Badge>
            </div>
            <CardTitle className="mt-2">Document AI</CardTitle>
            <CardDescription>Intelligent document processing and data extraction</CardDescription>
            <div className="flex items-center mt-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <span className="text-xs text-muted-foreground ml-1">(128)</span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-sm text-muted-foreground">
              <p>Automatically extract data from uploaded documents and organize by category.</p>
              <div className="flex mt-3 gap-2">
                <Badge variant="outline" className="text-xs">OCR</Badge>
                <Badge variant="outline" className="text-xs">Data Extraction</Badge>
                <Badge variant="outline" className="text-xs">AI-Powered</Badge>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm">Configure</Button>
            <Button variant="ghost" size="sm">Uninstall</Button>
          </CardFooter>
        </Card>
        
        {/* Available Plugin */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center mb-1">
              <div className="bg-primary/10 w-10 h-10 rounded flex items-center justify-center">
                <img src="/placeholder.svg" alt="Tax Optimizer" className="w-6 h-6" />
              </div>
              <Badge variant="outline">Available</Badge>
            </div>
            <CardTitle className="mt-2">Tax Optimizer</CardTitle>
            <CardDescription>Advanced tax planning and optimization</CardDescription>
            <div className="flex items-center mt-1">
              <div className="flex">
                {[1, 2, 3, 4].map((star) => (
                  <Star key={star} className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                ))}
                <Star className="h-3 w-3 text-yellow-500" />
              </div>
              <span className="text-xs text-muted-foreground ml-1">(92)</span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-sm text-muted-foreground">
              <p>Run tax simulations and find optimization opportunities for your portfolio.</p>
              <div className="flex mt-3 gap-2">
                <Badge variant="outline" className="text-xs">Tax Planning</Badge>
                <Badge variant="outline" className="text-xs">Reporting</Badge>
                <Badge variant="outline" className="text-xs">Scenarios</Badge>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <span className="text-sm font-medium">$99/month</span>
            <Button size="sm">
              <Download className="mr-2 h-4 w-4" /> Install
            </Button>
          </CardFooter>
        </Card>
        
        {/* Premium Plugin */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center mb-1">
              <div className="bg-primary/10 w-10 h-10 rounded flex items-center justify-center">
                <img src="/placeholder.svg" alt="Estate Planner Pro" className="w-6 h-6" />
              </div>
              <Badge className="bg-amber-500">Premium</Badge>
            </div>
            <CardTitle className="mt-2">Estate Planner Pro</CardTitle>
            <CardDescription>Comprehensive estate planning tools</CardDescription>
            <div className="flex items-center mt-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <span className="text-xs text-muted-foreground ml-1">(214)</span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-sm text-muted-foreground">
              <p>Design comprehensive estate plans with visualization and scenario modeling.</p>
              <div className="flex mt-3 gap-2">
                <Badge variant="outline" className="text-xs">Estate Planning</Badge>
                <Badge variant="outline" className="text-xs">Trusts</Badge>
                <Badge variant="outline" className="text-xs">Legal</Badge>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <span className="text-sm font-medium">$199/month</span>
            <Button size="sm">
              <Download className="mr-2 h-4 w-4" /> Install
            </Button>
          </CardFooter>
        </Card>
        
        {/* More plugins */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center mb-1">
              <div className="bg-primary/10 w-10 h-10 rounded flex items-center justify-center">
                <img src="/placeholder.svg" alt="Portfolio Analytics" className="w-6 h-6" />
              </div>
              <Badge variant="outline">Available</Badge>
            </div>
            <CardTitle className="mt-2">Portfolio Analytics</CardTitle>
            <CardDescription>Advanced investment analysis tools</CardDescription>
            <div className="flex items-center mt-1">
              <div className="flex">
                {[1, 2, 3, 4].map((star) => (
                  <Star key={star} className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                ))}
                <Star className="h-3 w-3 text-yellow-500" />
              </div>
              <span className="text-xs text-muted-foreground ml-1">(78)</span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-sm text-muted-foreground">
              <p>Deep investment analytics with risk assessment and allocation optimization.</p>
              <div className="flex mt-3 gap-2">
                <Badge variant="outline" className="text-xs">Analytics</Badge>
                <Badge variant="outline" className="text-xs">Investments</Badge>
                <Badge variant="outline" className="text-xs">Risk</Badge>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <span className="text-sm font-medium">$79/month</span>
            <Button size="sm">
              <Download className="mr-2 h-4 w-4" /> Install
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="flex justify-center mt-8">
        <Button variant="outline">Browse All Plugins (42)</Button>
      </div>
    </div>
  );
};
