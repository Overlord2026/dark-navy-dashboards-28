import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Settings, DollarSign, Users, TrendingUp, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface ModuleAccessPanelProps {
  organizationId: string;
}

interface ModuleConfig {
  id: string;
  name: string;
  description: string;
  category: string;
  isEnabled: boolean;
  pricingOverride?: number;
  usageLimit?: number;
  currentUsage: number;
  revenueShare: number;
  icon: string;
}

export const ModuleAccessPanel: React.FC<ModuleAccessPanelProps> = ({
  organizationId
}) => {
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<ModuleConfig | null>(null);

  // Mock module configuration data
  const moduleConfigs: ModuleConfig[] = [
    {
      id: 'estate_planning',
      name: 'Estate Planning',
      description: 'Advanced estate planning tools and documents',
      category: 'Premium',
      isEnabled: true,
      pricingOverride: 49.99,
      usageLimit: 100,
      currentUsage: 67,
      revenueShare: 15,
      icon: '🏛️'
    },
    {
      id: 'tax_optimization',
      name: 'Tax Optimization',
      description: 'Tax planning and optimization strategies',
      category: 'Premium',
      isEnabled: true,
      usageLimit: 50,
      currentUsage: 23,
      revenueShare: 20,
      icon: '💰'
    },
    {
      id: 'private_markets',
      name: 'Private Markets',
      description: 'Alternative investment access and analysis',
      category: 'Elite',
      isEnabled: false,
      pricingOverride: 199.99,
      usageLimit: 25,
      currentUsage: 0,
      revenueShare: 25,
      icon: '📈'
    },
    {
      id: 'insurance_analysis',
      name: 'Insurance Analysis',
      description: 'Comprehensive insurance needs analysis',
      category: 'Standard',
      isEnabled: true,
      usageLimit: 200,
      currentUsage: 145,
      revenueShare: 10,
      icon: '🛡️'
    },
    {
      id: 'retirement_planning',
      name: 'Retirement Planning',
      description: 'Retirement planning and projections',
      category: 'Standard',
      isEnabled: true,
      usageLimit: 150,
      currentUsage: 89,
      revenueShare: 12,
      icon: '🏖️'
    },
    {
      id: 'investment_management',
      name: 'Investment Management',
      description: 'Portfolio management and rebalancing',
      category: 'Premium',
      isEnabled: true,
      pricingOverride: 79.99,
      usageLimit: 75,
      currentUsage: 52,
      revenueShare: 18,
      icon: '📊'
    },
    {
      id: 'lending',
      name: 'Lending Services',
      description: 'Lending marketplace and loan origination',
      category: 'Elite',
      isEnabled: false,
      pricingOverride: 299.99,
      usageLimit: 10,
      currentUsage: 0,
      revenueShare: 30,
      icon: '💳'
    },
    {
      id: 'vault_premium',
      name: 'Premium Vault',
      description: 'Enhanced document storage and sharing',
      category: 'Premium',
      isEnabled: true,
      usageLimit: 500,
      currentUsage: 234,
      revenueShare: 8,
      icon: '🔒'
    }
  ];

  const handleToggleModule = (moduleId: string) => {
    toast.success('Module access updated');
  };

  const handleConfigureModule = (module: ModuleConfig) => {
    setSelectedModule(module);
    setIsConfigDialogOpen(true);
  };

  const handleSaveModuleConfig = () => {
    toast.success('Module configuration saved');
    setIsConfigDialogOpen(false);
    setSelectedModule(null);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Standard': return 'secondary';
      case 'Premium': return 'default';
      case 'Elite': return 'destructive';
      default: return 'outline';
    }
  };

  const enabledModules = moduleConfigs.filter(m => m.isEnabled);
  const totalRevenue = enabledModules.reduce((sum, m) => sum + (m.pricingOverride || 0), 0);
  const totalUsage = enabledModules.reduce((sum, m) => sum + m.currentUsage, 0);

  return (
    <div className="space-y-6">
      {/* Module Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Enabled Modules</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enabledModules.length}</div>
            <p className="text-xs text-muted-foreground">
              of {moduleConfigs.length} available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Monthly potential
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsage}</div>
            <p className="text-xs text-muted-foreground">
              Active users
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Module Categories */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Modules</TabsTrigger>
          <TabsTrigger value="standard">Standard</TabsTrigger>
          <TabsTrigger value="premium">Premium</TabsTrigger>
          <TabsTrigger value="elite">Elite</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {moduleConfigs.map((module) => (
              <Card key={module.id} className="relative">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{module.icon}</span>
                      <div>
                        <CardTitle className="text-lg">{module.name}</CardTitle>
                        <Badge variant={getCategoryColor(module.category)} className="text-xs">
                          {module.category}
                        </Badge>
                      </div>
                    </div>
                    <Switch 
                      checked={module.isEnabled}
                      onCheckedChange={() => handleToggleModule(module.id)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{module.description}</p>
                  
                  {module.isEnabled && (
                    <>
                      {module.usageLimit && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Usage</span>
                            <span>{module.currentUsage}/{module.usageLimit}</span>
                          </div>
                          <Progress value={(module.currentUsage / module.usageLimit) * 100} />
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center text-sm">
                        <span>Revenue Share</span>
                        <span className="font-medium">{module.revenueShare}%</span>
                      </div>
                      
                      {module.pricingOverride && (
                        <div className="flex justify-between items-center text-sm">
                          <span>Custom Price</span>
                          <span className="font-medium">${module.pricingOverride}</span>
                        </div>
                      )}
                    </>
                  )}
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleConfigureModule(module)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Configure
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="standard">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {moduleConfigs.filter(m => m.category === 'Standard').map((module) => (
              <Card key={module.id} className="relative">
                {/* Same card content as above */}
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{module.icon}</span>
                      <div>
                        <CardTitle className="text-lg">{module.name}</CardTitle>
                        <Badge variant={getCategoryColor(module.category)} className="text-xs">
                          {module.category}
                        </Badge>
                      </div>
                    </div>
                    <Switch 
                      checked={module.isEnabled}
                      onCheckedChange={() => handleToggleModule(module.id)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{module.description}</p>
                  
                  {module.isEnabled && (
                    <>
                      {module.usageLimit && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Usage</span>
                            <span>{module.currentUsage}/{module.usageLimit}</span>
                          </div>
                          <Progress value={(module.currentUsage / module.usageLimit) * 100} />
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center text-sm">
                        <span>Revenue Share</span>
                        <span className="font-medium">{module.revenueShare}%</span>
                      </div>
                    </>
                  )}
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleConfigureModule(module)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Configure
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="premium">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {moduleConfigs.filter(m => m.category === 'Premium').map((module) => (
              <Card key={module.id} className="relative">
                {/* Same card content structure */}
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{module.icon}</span>
                      <div>
                        <CardTitle className="text-lg">{module.name}</CardTitle>
                        <Badge variant={getCategoryColor(module.category)} className="text-xs">
                          {module.category}
                        </Badge>
                      </div>
                    </div>
                    <Switch 
                      checked={module.isEnabled}
                      onCheckedChange={() => handleToggleModule(module.id)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{module.description}</p>
                  
                  {module.isEnabled && (
                    <>
                      {module.usageLimit && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Usage</span>
                            <span>{module.currentUsage}/{module.usageLimit}</span>
                          </div>
                          <Progress value={(module.currentUsage / module.usageLimit) * 100} />
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center text-sm">
                        <span>Revenue Share</span>
                        <span className="font-medium">{module.revenueShare}%</span>
                      </div>
                      
                      {module.pricingOverride && (
                        <div className="flex justify-between items-center text-sm">
                          <span>Custom Price</span>
                          <span className="font-medium">${module.pricingOverride}</span>
                        </div>
                      )}
                    </>
                  )}
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleConfigureModule(module)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Configure
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="elite">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {moduleConfigs.filter(m => m.category === 'Elite').map((module) => (
              <Card key={module.id} className="relative">
                {/* Same card content structure */}
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{module.icon}</span>
                      <div>
                        <CardTitle className="text-lg">{module.name}</CardTitle>
                        <Badge variant={getCategoryColor(module.category)} className="text-xs">
                          {module.category}
                        </Badge>
                      </div>
                    </div>
                    <Switch 
                      checked={module.isEnabled}
                      onCheckedChange={() => handleToggleModule(module.id)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{module.description}</p>
                  
                  {module.isEnabled && (
                    <>
                      {module.usageLimit && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Usage</span>
                            <span>{module.currentUsage}/{module.usageLimit}</span>
                          </div>
                          <Progress value={(module.currentUsage / module.usageLimit) * 100} />
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center text-sm">
                        <span>Revenue Share</span>
                        <span className="font-medium">{module.revenueShare}%</span>
                      </div>
                      
                      {module.pricingOverride && (
                        <div className="flex justify-between items-center text-sm">
                          <span>Custom Price</span>
                          <span className="font-medium">${module.pricingOverride}</span>
                        </div>
                      )}
                    </>
                  )}
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleConfigureModule(module)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Configure
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Module Configuration Dialog */}
      <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Configure {selectedModule?.name}</DialogTitle>
            <DialogDescription>
              Customize pricing, limits, and revenue sharing for this module
            </DialogDescription>
          </DialogHeader>
          {selectedModule && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pricing-override">Custom Price Override</Label>
                  <Input 
                    id="pricing-override"
                    type="number"
                    placeholder="Default pricing"
                    defaultValue={selectedModule.pricingOverride}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="usage-limit">Usage Limit</Label>
                  <Input 
                    id="usage-limit"
                    type="number"
                    placeholder="Unlimited"
                    defaultValue={selectedModule.usageLimit}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="revenue-share">Revenue Share Percentage</Label>
                <Input 
                  id="revenue-share"
                  type="number"
                  min="0"
                  max="100"
                  defaultValue={selectedModule.revenueShare}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="auto-upgrade" />
                <Label htmlFor="auto-upgrade">Allow auto-upgrade for clients</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="rep-assignment" />
                <Label htmlFor="rep-assignment">Require rep assignment</Label>
              </div>

              <Button onClick={handleSaveModuleConfig} className="w-full">
                Save Configuration
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};