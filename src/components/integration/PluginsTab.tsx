
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ToggleLeft, ToggleRight, Download, CheckCircle, AlertTriangle, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

export function PluginsTab() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const plugins = [
    {
      id: "tax-calculator",
      name: "Tax Optimization Engine",
      description: "Advanced tax calculation and optimization strategies",
      category: "Financial",
      status: "active",
      compatibility: ["retirees", "uhnw"],
      icon: "📊"
    },
    {
      id: "portfolio-analyzer",
      name: "Portfolio Analyzer",
      description: "In-depth investment portfolio analysis and recommendations",
      category: "Investments",
      status: "active",
      compatibility: ["aspiring", "retirees", "uhnw"],
      icon: "📈"
    },
    {
      id: "estate-planner",
      name: "Estate Planning Tool",
      description: "Comprehensive estate planning and wealth transfer solutions",
      category: "Planning",
      status: "available",
      compatibility: ["retirees", "uhnw"],
      icon: "🏛️"
    },
    {
      id: "retirement-calculator",
      name: "Retirement Simulator",
      description: "Advanced retirement planning scenarios and projections",
      category: "Planning",
      status: "available",
      compatibility: ["aspiring", "retirees"],
      icon: "🧮"
    }
  ];

  const filteredPlugins = plugins.filter(plugin => 
    plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    plugin.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plugin.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handlePluginAction = (pluginId: string, action: string) => {
    const plugin = plugins.find(p => p.id === pluginId);
    if (action === "toggle") {
      toast.success(`${plugin?.status === "active" ? "Disabled" : "Enabled"} ${plugin?.name}`);
    } else if (action === "install") {
      toast.success(`Installed ${plugin?.name} successfully`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search plugins..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-1" />
          Add Custom Plugin
        </Button>
      </div>

      {filteredPlugins.length === 0 ? (
        <Card className="p-8 text-center">
          <CardContent className="pt-4">
            <p className="text-muted-foreground">No plugins match your search criteria</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPlugins.map(plugin => (
            <Card key={plugin.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="text-2xl">{plugin.icon}</div>
                    <Badge variant="outline" className="bg-primary/10">
                      {plugin.category}
                    </Badge>
                  </div>
                  
                  {plugin.status === "active" ? (
                    <Badge className="bg-green-500/10 text-green-500 border-green-500/30 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="outline">Available</Badge>
                  )}
                </div>
                <CardTitle>{plugin.name}</CardTitle>
                <CardDescription>{plugin.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-muted-foreground">Compatible with:</span>
                  {plugin.compatibility.map(segment => (
                    <Badge key={segment} variant="secondary" className="text-xs">
                      {segment === "aspiring" 
                        ? "Aspiring" 
                        : segment === "retirees" 
                          ? "Retirees" 
                          : "UHNW"}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                {plugin.status === "active" ? (
                  <Button 
                    variant="outline" 
                    className="flex items-center" 
                    onClick={() => handlePluginAction(plugin.id, "toggle")}
                  >
                    <ToggleRight className="h-4 w-4 mr-2 text-green-500" />
                    Disable
                  </Button>
                ) : (
                  <Button 
                    onClick={() => handlePluginAction(plugin.id, "install")}
                    className="flex items-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Install
                  </Button>
                )}
                <Button variant="ghost">View Details</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
