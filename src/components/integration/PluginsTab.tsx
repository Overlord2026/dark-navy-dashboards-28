
import React from "react";
import { Card, CardHeader, CardContent, CardDescription, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CheckCircle, Download, Filter, PlusCircle, Settings } from "lucide-react";

export function PluginsTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Family Office Marketplace Plugins</h3>
        <div className="flex gap-2">
          <ToggleGroup type="multiple">
            <ToggleGroupItem value="all" aria-label="Toggle all">
              All
            </ToggleGroupItem>
            <ToggleGroupItem value="active" aria-label="Toggle active">
              Active
            </ToggleGroupItem>
            <ToggleGroupItem value="available" aria-label="Toggle available">
              Available
            </ToggleGroupItem>
          </ToggleGroup>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Installed Plugin Card */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <div>
                <CardTitle className="text-base">Document Analytics</CardTitle>
                <CardDescription>v2.1.0</CardDescription>
              </div>
              <Badge className="bg-green-600 hover:bg-green-700">Installed</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Advanced document analysis for financial statements and legal documents
            </p>
            <div className="mt-3 flex justify-between items-center">
              <div className="flex items-center">
                <Badge variant="outline" className="text-xs font-normal">
                  <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                  Verified
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                Updated 2 weeks ago
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="outline" size="sm" className="w-full">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
          </CardFooter>
        </Card>
        
        {/* Installed Plugin Card */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <div>
                <CardTitle className="text-base">Tax Optimizer</CardTitle>
                <CardDescription>v1.5.2</CardDescription>
              </div>
              <Badge className="bg-green-600 hover:bg-green-700">Installed</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Identifies tax optimization opportunities across portfolios
            </p>
            <div className="mt-3 flex justify-between items-center">
              <div className="flex items-center">
                <Badge variant="outline" className="text-xs font-normal">
                  <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                  Verified
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                Updated 1 month ago
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="outline" size="sm" className="w-full">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
          </CardFooter>
        </Card>
        
        {/* Available Plugin Card */}
        <Card className="border border-dashed border-muted-foreground/50">
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <div>
                <CardTitle className="text-base">Estate Planning Assistant</CardTitle>
                <CardDescription>v3.0.1</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Automated estate planning document generation and workflows
            </p>
            <div className="mt-3 flex justify-between items-center">
              <div className="flex items-center">
                <Badge variant="outline" className="text-xs font-normal">
                  <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                  Verified
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                Released 3 days ago
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="default" size="sm" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Install Plugin
            </Button>
          </CardFooter>
        </Card>
        
        {/* Available Plugin Card */}
        <Card className="border border-dashed border-muted-foreground/50">
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <div>
                <CardTitle className="text-base">Compliance Checker</CardTitle>
                <CardDescription>v2.3.0</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Automated regulatory compliance verification for financial documents
            </p>
            <div className="mt-3 flex justify-between items-center">
              <div className="flex items-center">
                <Badge variant="outline" className="text-xs font-normal">
                  <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                  Verified
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                Released 2 weeks ago
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="default" size="sm" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Install Plugin
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="flex justify-end">
        <Button variant="outline">
          <PlusCircle className="h-4 w-4 mr-2" />
          Browse More Plugins
        </Button>
      </div>
    </div>
  );
}
