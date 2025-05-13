
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  Filter,
  Download,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle,
  ShieldCheck,
  Cloud,
  Zap,
  MessageSquare,
  Palette,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface Plugin {
  id: string;
  name: string;
  description: string;
  category: string;
  author: string;
  version: string;
  status: 'installed' | 'available' | 'update';
  rating: number;
  icon: React.ReactNode;
  isVerified: boolean;
}

export function PluginsTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [plugins, setPlugins] = useState<Plugin[]>([
    {
      id: "plugin_1",
      name: "Data Sync Engine",
      description: "Synchronize data between Family Office platform and external systems",
      category: "Integration",
      author: "Family Office Labs",
      version: "1.2.0",
      status: "installed",
      rating: 4.8,
      icon: <Cloud className="h-8 w-8 text-blue-500" />,
      isVerified: true
    },
    {
      id: "plugin_2",
      name: "Advanced Analytics",
      description: "Enhanced reporting and analytics for financial data",
      category: "Analytics",
      author: "Wealth Analytics Inc",
      version: "2.1.3",
      status: "update",
      rating: 4.5,
      icon: <Zap className="h-8 w-8 text-amber-500" />,
      isVerified: true
    },
    {
      id: "plugin_3",
      name: "Document OCR",
      description: "Extract data from uploaded documents using optical character recognition",
      category: "Productivity",
      author: "Document AI",
      version: "1.0.5",
      status: "available",
      rating: 4.2,
      icon: <ShieldCheck className="h-8 w-8 text-green-500" />,
      isVerified: false
    },
    {
      id: "plugin_4",
      name: "AI Chat Assistant",
      description: "AI-powered chat assistant for financial planning questions",
      category: "Communication",
      author: "FinTech Innovations",
      version: "2.3.1",
      status: "available",
      rating: 4.7,
      icon: <MessageSquare className="h-8 w-8 text-purple-500" />,
      isVerified: true
    },
    {
      id: "plugin_5",
      name: "Custom Theme Builder",
      description: "Create and apply custom themes to your Family Office portal",
      category: "Appearance",
      author: "Design Systems Co",
      version: "1.8.2",
      status: "installed",
      rating: 3.9,
      icon: <Palette className="h-8 w-8 text-pink-500" />,
      isVerified: true
    },
  ]);

  const categories = ['All', 'Integration', 'Analytics', 'Productivity', 'Communication', 'Appearance'];
  
  const filteredPlugins = plugins.filter(plugin => {
    const matchesSearch = plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         plugin.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = !activeFilter || activeFilter === 'All' || plugin.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const handleInstallPlugin = (pluginId: string) => {
    setPlugins(currentPlugins => 
      currentPlugins.map(plugin => 
        plugin.id === pluginId 
          ? {...plugin, status: 'installed'} 
          : plugin
      )
    );
    toast.success("Plugin installed successfully");
  };

  const handleUpdatePlugin = (pluginId: string) => {
    setPlugins(currentPlugins => 
      currentPlugins.map(plugin => 
        plugin.id === pluginId 
          ? {...plugin, status: 'installed', version: plugin.version.split('.').map((v, i) => i === 2 ? parseInt(v) + 1 : v).join('.')} 
          : plugin
      )
    );
    toast.success("Plugin updated successfully");
  };

  const handleTogglePlugin = (pluginId: string, enabled: boolean) => {
    toast.success(`Plugin ${enabled ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-[300px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search plugins..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={activeFilter === category ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(category === 'All' ? null : category)}
            >
              {category}
            </Button>
          ))}
          
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredPlugins.map((plugin) => (
          <Card key={plugin.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  {plugin.icon}
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {plugin.name}
                      {plugin.isVerified && (
                        <Badge variant="outline" className="ml-1 text-blue-500 border-blue-500">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>v{plugin.version} • by {plugin.author}</CardDescription>
                  </div>
                </div>
                
                {plugin.status === "installed" && (
                  <Switch 
                    defaultChecked 
                    onCheckedChange={(checked) => handleTogglePlugin(plugin.id, checked)} 
                  />
                )}
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="flex justify-between items-center mb-3">
                <Badge>{plugin.category}</Badge>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-sm ${i < Math.floor(plugin.rating) ? 'text-yellow-500' : 'text-gray-300'}`}>
                      ★
                    </span>
                  ))}
                  <span className="ml-1 text-xs text-muted-foreground">{plugin.rating}</span>
                </div>
              </div>
              
              <p className="text-muted-foreground text-sm">{plugin.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between pt-3 border-t">
              {plugin.status === 'installed' ? (
                <Button variant="outline" size="sm" className="w-full">
                  Configure
                </Button>
              ) : plugin.status === 'update' ? (
                <Button 
                  size="sm" 
                  className="w-full bg-amber-600 hover:bg-amber-700"
                  onClick={() => handleUpdatePlugin(plugin.id)}
                >
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  Update Available
                </Button>
              ) : (
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleInstallPlugin(plugin.id)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Install
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {filteredPlugins.length === 0 && (
        <div className="text-center py-12">
          <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No plugins found</h3>
          <p className="mt-2 text-muted-foreground">
            We couldn't find any plugins matching your search criteria.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setActiveFilter(null);
            }}
            className="mt-4"
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
