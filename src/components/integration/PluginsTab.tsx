
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Check, Search, Download, Settings } from "lucide-react";

export const PluginsTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const plugins = [
    {
      id: "plugin-1",
      name: "Document Sync",
      description: "Synchronize documents across connected platforms",
      author: "BFO Systems",
      version: "1.2.0",
      installed: true,
      category: "data",
      tags: ["documents", "sync"]
    },
    {
      id: "plugin-2",
      name: "Tax Report Generator",
      description: "Generate tax reports from financial data",
      author: "Finance Tools Inc.",
      version: "2.0.1",
      installed: true,
      category: "reporting",
      tags: ["tax", "reports"]
    },
    {
      id: "plugin-3",
      name: "Portfolio Analytics",
      description: "Advanced analytics for investment portfolios",
      author: "Wealth Insights",
      version: "3.1.4",
      installed: false,
      category: "analytics",
      tags: ["investments", "reporting"]
    },
    {
      id: "plugin-4",
      name: "Estate Planning Assistant",
      description: "Tools for estate planning and management",
      author: "Legacy Systems",
      version: "1.0.5",
      installed: false,
      category: "planning",
      tags: ["estate", "planning"]
    },
    {
      id: "plugin-5",
      name: "Multi-Currency Tracker",
      description: "Track assets across multiple currencies",
      author: "Global Finance",
      version: "2.3.1",
      installed: false,
      category: "finance",
      tags: ["currency", "assets"]
    }
  ];

  const filteredPlugins = plugins.filter(plugin => 
    plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plugin.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plugin.tags.some(tag => tag.includes(searchQuery.toLowerCase()))
  );

  const handleInstallPlugin = (pluginId: string) => {
    console.log(`Installing plugin ${pluginId}`);
    // In a real app, this would install the plugin
  };

  const handleConfigurePlugin = (pluginId: string) => {
    console.log(`Configure plugin ${pluginId}`);
    // In a real app, this would open plugin configuration
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Plugins Marketplace</h3>
          <p className="text-sm text-muted-foreground">
            Extend functionality with specialized plugins
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Upload Plugin
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search plugins..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">Filter</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPlugins.map((plugin) => (
          <Card key={plugin.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <div>
                  <CardTitle className="text-md">{plugin.name}</CardTitle>
                  <CardDescription className="text-xs">by {plugin.author}</CardDescription>
                </div>
                <div>
                  <Badge variant="outline" className="text-xs">v{plugin.version}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="py-2">
              <p className="text-sm">{plugin.description}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {plugin.tags.map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="text-xs"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50 pt-2 pb-2 justify-between">
              <Badge 
                variant="outline" 
                className={`capitalize ${
                  plugin.category === "data" 
                    ? "border-blue-500 text-blue-500" 
                    : plugin.category === "reporting" 
                    ? "border-amber-500 text-amber-500"
                    : plugin.category === "analytics"
                    ? "border-purple-500 text-purple-500"
                    : "border-green-500 text-green-500"
                }`}
              >
                {plugin.category}
              </Badge>
              {plugin.installed ? (
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-600 gap-1">
                    <Check className="h-3 w-3" />
                    Installed
                  </Badge>
                  <Button size="sm" variant="ghost" onClick={() => handleConfigurePlugin(plugin.id)}>
                    <Settings className="h-4 w-4 mr-1" />
                    Configure
                  </Button>
                </div>
              ) : (
                <Button size="sm" variant="outline" onClick={() => handleInstallPlugin(plugin.id)}>
                  <Download className="h-4 w-4 mr-1" /> 
                  Install
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {filteredPlugins.length === 0 && (
        <div className="bg-muted/30 rounded-lg p-12 text-center">
          <p className="text-muted-foreground">No plugins found matching your search criteria.</p>
          <Button variant="link" onClick={() => setSearchQuery("")}>Clear search</Button>
        </div>
      )}
    </div>
  );
};
