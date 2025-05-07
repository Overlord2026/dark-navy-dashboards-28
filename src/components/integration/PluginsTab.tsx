
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Download, PlusCircle } from "lucide-react";

export const PluginsTab = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Plugins</h2>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Browse Plugin Store
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Tax Calculator</CardTitle>
                <CardDescription>Advanced tax estimation tool</CardDescription>
              </div>
              <Switch checked={true} />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Provides advanced tax calculation capabilities for multiple jurisdictions with real-time updates.
            </p>
            <div className="flex items-center mt-4">
              <Badge variant="outline" className="mr-2">v2.3.1</Badge>
              <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Stable</Badge>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" size="sm">Settings</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Document Scanner</CardTitle>
                <CardDescription>OCR for financial documents</CardDescription>
              </div>
              <Switch checked={true} />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Extract data from financial documents using optical character recognition for automatic data entry.
            </p>
            <div className="flex items-center mt-4">
              <Badge variant="outline" className="mr-2">v1.8.0</Badge>
              <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20">Update Available</Badge>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" size="sm" className="flex items-center">
              <Download className="h-4 w-4 mr-1" /> Update
            </Button>
            <Button variant="outline" size="sm">Settings</Button>
          </CardFooter>
        </Card>
        
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Install New Plugin</CardTitle>
            <CardDescription>Enhance your application with plugins</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Button variant="outline" className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              Browse Plugins
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
