
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchIcon, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";

export const PluginsTab = () => {
  const plugins = [
    {
      id: 1,
      name: "Advanced Tax Planning",
      author: "Boutique Family Office",
      version: "2.1.3",
      status: "Installed",
      description: "Sophisticated tax optimization strategies for high-net-worth clients."
    },
    {
      id: 2,
      name: "Estate Transfer Simulator",
      author: "Legacy Systems, Inc.",
      version: "1.4.0",
      status: "Installed",
      description: "Model wealth transfer scenarios and optimize estate planning outcomes."
    },
    {
      id: 3,
      name: "Alternative Investment Analyzer",
      author: "Wealth Metrics LLC",
      version: "3.2.5",
      status: "Available",
      description: "Analytics for private equity, real estate, and hedge fund investments."
    },
    {
      id: 4,
      name: "Family Governance Tools",
      author: "Boutique Family Office",
      version: "1.0.2",
      status: "Available",
      description: "Framework for implementing family constitutions and governance structures."
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Plugins</h2>
        <Button className="bg-black hover:bg-black/80 text-[#D4AF37]">
          <Plus className="h-4 w-4 mr-2" /> Upload Custom Plugin
        </Button>
      </div>

      <div className="relative mb-6">
        <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search plugins..." 
          className="pl-9 bg-[#121221] border-[#333]" 
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {plugins.map((plugin) => (
          <Card key={plugin.id} className="border-[#333] bg-[#1F1F2E]">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-[#D4AF37]">{plugin.name}</CardTitle>
                <Badge 
                  variant={plugin.status === "Installed" ? "outline" : "secondary"}
                  className={plugin.status === "Installed" 
                    ? "bg-green-900/30 text-green-300 border-green-500/50" 
                    : ""
                  }
                >
                  {plugin.status}
                </Badge>
              </div>
              <CardDescription>v{plugin.version} | By {plugin.author}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{plugin.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" className="text-[#D4AF37] border-[#D4AF37]">Details</Button>
              {plugin.status === "Installed" ? (
                <Button variant="destructive">Uninstall</Button>
              ) : (
                <Button className="bg-black hover:bg-black/80 text-[#D4AF37]">Install</Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card className="border-[#333] bg-[#1F1F2E]">
        <CardHeader>
          <CardTitle className="text-[#D4AF37]">Plugin Marketplace</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Discover additional plugins created by our partners and the community to extend your system's capabilities.
          </p>
          <Button className="bg-black hover:bg-black/80 text-[#D4AF37]">Browse Marketplace</Button>
        </CardContent>
      </Card>
    </div>
  );
};
