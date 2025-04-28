
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlugIcon, Download, Settings, ToggleRight } from "lucide-react";

export function PluginsTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Plugins</h2>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Browse Plugin Marketplace
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Plugin 1 */}
        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <div className="flex gap-3 items-center">
                <div className="bg-primary/10 p-2 rounded-md">
                  <PlugIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Tax Document Analyzer</CardTitle>
                  <CardDescription>Automatically analyzes tax documents</CardDescription>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm">
                This plugin uses AI to extract and categorize information from tax documents, providing summaries and identifying potential deductions or issues.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Version:</p>
                  <p>2.4.1</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Developer:</p>
                  <p>FinTech Solutions</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Updated:</p>
                  <p>2 weeks ago</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Category:</p>
                  <p>Tax Planning</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex items-center">
              <ToggleRight className="h-5 w-5 text-green-500 mr-1" />
              <span className="text-sm">Enabled</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
            </div>
          </CardFooter>
        </Card>
        
        {/* Plugin 2 */}
        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <div className="flex gap-3 items-center">
                <div className="bg-primary/10 p-2 rounded-md">
                  <PlugIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Estate Planning Assistant</CardTitle>
                  <CardDescription>Collaborative estate planning tools</CardDescription>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm">
                Helps families and their advisors collaborate on estate planning with document templates, checklists, and scenario modeling tools.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Version:</p>
                  <p>1.8.0</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Developer:</p>
                  <p>Legacy Planning Group</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Updated:</p>
                  <p>1 month ago</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Category:</p>
                  <p>Estate Planning</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex items-center">
              <ToggleRight className="h-5 w-5 text-green-500 mr-1" />
              <span className="text-sm">Enabled</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
            </div>
          </CardFooter>
        </Card>
        
        {/* Plugin 3 */}
        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <div className="flex gap-3 items-center">
                <div className="bg-primary/10 p-2 rounded-md">
                  <PlugIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Multi-Family Office Dashboard</CardTitle>
                  <CardDescription>Consolidated view across multiple families</CardDescription>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm">
                Provides advisors with a consolidated view across multiple family offices, with customizable reporting and analytics tools.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Version:</p>
                  <p>3.1.2</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Developer:</p>
                  <p>Family Office Solutions</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Updated:</p>
                  <p>1 week ago</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Category:</p>
                  <p>Advisor Tools</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex items-center">
              <ToggleRight className="h-5 w-5 text-green-500 mr-1" />
              <span className="text-sm">Enabled</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
