
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, ExternalLink, Info, Plug, Plus, Settings, Star } from "lucide-react";

export function PluginsTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Plugins Marketplace</h2>
        <Button variant="outline" className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Upload Custom Plugin
        </Button>
      </div>
      
      <p className="text-muted-foreground mb-4">
        Extend your Family Office platform functionality with these specialized plugins.
      </p>
      
      {/* Installed Plugins */}
      <h3 className="text-lg font-medium mb-4">Installed Plugins</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6 border-l-4 border-l-green-500">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="bg-green-500/20 p-2 rounded">
                <Plug className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <h4 className="font-medium">Tax Document Analyzer</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  v2.3.4 • Installed 3 months ago
                </p>
                <div className="flex items-center mt-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs ml-1">(128)</span>
                </div>
              </div>
            </div>
            <Badge className="bg-green-500">Active</Badge>
          </div>
          
          <p className="text-sm mt-4">
            Automatically extracts and categorizes data from tax documents for faster processing.
          </p>
          
          <div className="mt-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">Official</Badge>
              <Badge variant="outline" className="text-xs">Premium</Badge>
            </div>
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <Settings className="h-4 w-4" /> Configure
            </Button>
          </div>
        </Card>
        
        <Card className="p-6 border-l-4 border-l-blue-500">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="bg-blue-500/20 p-2 rounded">
                <Plug className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h4 className="font-medium">Portfolio Rebalancer</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  v1.9.2 • Installed 1 month ago
                </p>
                <div className="flex items-center mt-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  <Star className="h-3 w-3 text-gray-300" />
                  <span className="text-xs ml-1">(94)</span>
                </div>
              </div>
            </div>
            <Badge className="bg-blue-500">Active</Badge>
          </div>
          
          <p className="text-sm mt-4">
            Automated portfolio rebalancing tools with customizable thresholds and tax optimization.
          </p>
          
          <div className="mt-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">Partner</Badge>
              <Badge variant="outline" className="text-xs">Premium</Badge>
            </div>
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <Settings className="h-4 w-4" /> Configure
            </Button>
          </div>
        </Card>
      </div>
      
      {/* Available Plugins */}
      <h3 className="text-lg font-medium mb-4">Available Plugins</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                <Plug className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <h4 className="font-medium">Estate Planning Assistant</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  v3.1.0 • Updated 2 weeks ago
                </p>
                <div className="flex items-center mt-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs ml-1">(207)</span>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-sm mt-4">
            Comprehensive estate planning tools with document generation and scenario modeling.
          </p>
          
          <div className="mt-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">Official</Badge>
              <Badge variant="outline" className="text-xs">Premium</Badge>
            </div>
            <Button className="flex items-center gap-2">
              <Download className="h-4 w-4" /> Install
            </Button>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                <Plug className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <h4 className="font-medium">Family Meeting Manager</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  v2.0.5 • Updated 1 month ago
                </p>
                <div className="flex items-center mt-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  <Star className="h-3 w-3 text-gray-300" />
                  <span className="text-xs ml-1">(76)</span>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-sm mt-4">
            Tools for scheduling, documenting and following up on family governance meetings.
          </p>
          
          <div className="mt-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">Partner</Badge>
              <Badge variant="outline" className="text-xs">Free</Badge>
            </div>
            <Button className="flex items-center gap-2">
              <Download className="h-4 w-4" /> Install
            </Button>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                <Plug className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <h4 className="font-medium">Charitable Giving Tracker</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  v1.4.2 • Updated 3 months ago
                </p>
                <div className="flex items-center mt-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  <Star className="h-3 w-3 text-gray-300" />
                  <span className="text-xs ml-1">(42)</span>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-sm mt-4">
            Track donations, generate tax reports, and measure impact of philanthropic activities.
          </p>
          
          <div className="mt-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">Community</Badge>
              <Badge variant="outline" className="text-xs">Free</Badge>
            </div>
            <Button className="flex items-center gap-2">
              <Download className="h-4 w-4" /> Install
            </Button>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                <Plug className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <h4 className="font-medium">Risk Assessment Suite</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  v2.2.0 • Updated 2 months ago
                </p>
                <div className="flex items-center mt-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs ml-1">(136)</span>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-sm mt-4">
            Advanced risk modeling, stress testing, and scenario analysis for complex portfolios.
          </p>
          
          <div className="mt-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">Official</Badge>
              <Badge variant="outline" className="text-xs">Premium</Badge>
            </div>
            <Button className="flex items-center gap-2">
              <Download className="h-4 w-4" /> Install
            </Button>
          </div>
        </Card>
      </div>
      
      <div className="flex justify-center mt-8">
        <Button variant="outline" className="flex items-center gap-2">
          <ExternalLink className="h-4 w-4" /> Browse All Plugins
        </Button>
      </div>
    </div>
  );
}
