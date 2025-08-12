import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Palette, 
  Target, 
  TrendingUp,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  Plus,
  Trash2
} from 'lucide-react';
import { SwagPhase, InvestmentCategory, WhiteLabelConfig } from '@/types/swag-retirement';

const DEFAULT_CONFIG: WhiteLabelConfig = {
  brandName: 'SWAG Retirement Roadmap™',
  logoUrl: '',
  primaryColor: '#2563eb',
  secondaryColor: '#7c3aed',
  phases: [
    {
      id: 'income-now',
      name: 'Income Now',
      yearStart: 1,
      yearEnd: 2,
      description: 'Core necessities (housing, food, utilities, health), 1–2 years liquidity',
      fundingRequirement: 120000,
      investmentCategories: [],
      enabled: true,
      order: 1,
      allocation: {
        stocks: 20,
        bonds: 60,
        alternatives: 10,
        cash: 10
      },
      projection: {
        expectedReturn: 4.5,
        volatility: 5.0,
        projectedValue: 120000,
        withdrawalCapacity: 60000
      }
    },
    {
      id: 'income-later',
      name: 'Income Later',
      yearStart: 3,
      yearEnd: 12,
      description: 'Discretionary spend, RMDs, travel, safe-yield investments',
      fundingRequirement: 800000,
      investmentCategories: [],
      enabled: true,
      order: 2,
      allocation: {
        stocks: 40,
        bonds: 40,
        alternatives: 15,
        cash: 5
      },
      projection: {
        expectedReturn: 6.5,
        volatility: 8.0,
        projectedValue: 800000,
        withdrawalCapacity: 400000
      }
    },
    {
      id: 'growth',
      name: 'Growth',
      yearStart: 12,
      yearEnd: null,
      description: 'Long-term growth (dividend stocks, high-growth equities, blockchain, private equity)',
      fundingRequirement: 1500000,
      investmentCategories: [],
      enabled: true,
      order: 3,
      allocation: {
        stocks: 70,
        bonds: 15,
        alternatives: 10,
        cash: 5
      },
      projection: {
        expectedReturn: 9.0,
        volatility: 15.0,
        projectedValue: 1500000,
        withdrawalCapacity: 750000
      }
    },
    {
      id: 'legacy',
      name: 'Legacy',
      yearStart: 1,
      yearEnd: null,
      description: 'Estate planning, charitable giving, family wealth transfer',
      fundingRequirement: 500000,
      investmentCategories: [],
      enabled: true,
      order: 4,
      allocation: {
        stocks: 60,
        bonds: 25,
        alternatives: 10,
        cash: 5
      },
      projection: {
        expectedReturn: 8.0,
        volatility: 12.0,
        projectedValue: 500000,
        withdrawalCapacity: 250000
      }
    }
  ],
  brandingSettings: {
    primaryColor: '#2563eb',
    secondaryColor: '#7c3aed',
    companyName: 'SWAG Retirement Roadmap™',
    disclaimers: []
  },
  enabledFeatures: {
    phases: true,
    allocations: true,
    projections: true,
    reports: true
  }
};

export default function SwagRoadmapSettings() {
  const [config, setConfig] = useState<WhiteLabelConfig>(DEFAULT_CONFIG);
  const [activeTab, setActiveTab] = useState('phases');
  const [saving, setSaving] = useState(false);

  const updatePhase = (phaseId: string, updates: Partial<SwagPhase>) => {
    setConfig(prev => ({
      ...prev,
      phases: prev.phases.map(phase => 
        phase.id === phaseId ? { ...phase, ...updates } : phase
      )
    }));
  };

  const addInvestmentCategory = (phaseId: string) => {
    const newCategory: InvestmentCategory = {
      id: `category-${Date.now()}`,
      name: 'New Category',
      description: '',
      allocation: 0,
      targetAllocation: 0,
      riskLevel: 'moderate',
      expectedReturn: 7.0,
      risk: 5,
      products: []
    };

    updatePhase(phaseId, {
      investmentCategories: [
        ...config.phases.find(p => p.id === phaseId)?.investmentCategories || [],
        newCategory
      ]
    });
  };

  const removeInvestmentCategory = (phaseId: string, categoryId: string) => {
    const phase = config.phases.find(p => p.id === phaseId);
    if (phase) {
      updatePhase(phaseId, {
        investmentCategories: phase.investmentCategories.filter(c => c.id !== categoryId)
      });
    }
  };

  const updateBrandingSettings = (updates: Partial<typeof config.brandingSettings>) => {
    setConfig(prev => ({
      ...prev,
      brandingSettings: { ...prev.brandingSettings, ...updates }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    // TODO: Save configuration to backend
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
  };

  const resetToDefaults = () => {
    setConfig(DEFAULT_CONFIG);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">SWAG Roadmap Settings</h1>
              <p className="text-muted-foreground">White-label configuration and customization</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={resetToDefaults}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset to Defaults
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>

          {/* Main Configuration */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="phases">Phase Configuration</TabsTrigger>
              <TabsTrigger value="investments">Investment Mappings</TabsTrigger>
              <TabsTrigger value="branding">Branding & UI</TabsTrigger>
              <TabsTrigger value="features">Features & Access</TabsTrigger>
            </TabsList>

            {/* Phase Configuration */}
            <TabsContent value="phases" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    SWAG Framework Phases
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {config.phases.map((phase, index) => (
                      <div key={phase.id} className="border rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold">Phase {index + 1}: {phase.name}</h3>
                            <Badge variant={phase.enabled ? 'default' : 'secondary'}>
                              {phase.enabled ? 'Enabled' : 'Disabled'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updatePhase(phase.id, { enabled: !phase.enabled })}
                            >
                              {phase.enabled ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <Label>Phase Name</Label>
                              <Input
                                value={phase.name}
                                onChange={(e) => updatePhase(phase.id, { name: e.target.value })}
                              />
                            </div>
                            
                            <div>
                              <Label>Description</Label>
                              <Textarea
                                value={phase.description}
                                onChange={(e) => updatePhase(phase.id, { description: e.target.value })}
                                rows={3}
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Start Year</Label>
                                <Input
                                  type="number"
                                  value={phase.yearStart}
                                  onChange={(e) => updatePhase(phase.id, { yearStart: parseInt(e.target.value) || 1 })}
                                />
                              </div>
                              <div>
                                <Label>End Year (optional)</Label>
                                <Input
                                  type="number"
                                  value={phase.yearEnd || ''}
                                  onChange={(e) => updatePhase(phase.id, { 
                                    yearEnd: e.target.value ? parseInt(e.target.value) : null 
                                  })}
                                  placeholder="Ongoing"
                                />
                              </div>
                            </div>

                            <div>
                              <Label>Funding Requirement</Label>
                              <Input
                                type="number"
                                value={phase.fundingRequirement}
                                onChange={(e) => updatePhase(phase.id, { 
                                  fundingRequirement: parseInt(e.target.value) || 0 
                                })}
                              />
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <Label>Investment Categories</Label>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addInvestmentCategory(phase.id)}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Category
                              </Button>
                            </div>

                            <div className="space-y-3 max-h-64 overflow-y-auto">
                              {phase.investmentCategories.map((category) => (
                                <div key={category.id} className="border rounded-lg p-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <Input
                                      value={category.name}
                                      onChange={(e) => {
                                        const updated = phase.investmentCategories.map(c =>
                                          c.id === category.id ? { ...c, name: e.target.value } : c
                                        );
                                        updatePhase(phase.id, { investmentCategories: updated });
                                      }}
                                      className="text-sm"
                                    />
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeInvestmentCategory(phase.id, category.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  
                                  <div className="grid grid-cols-3 gap-2">
                                    <div>
                                      <Label className="text-xs">Allocation %</Label>
                                      <Input
                                        type="number"
                                        value={category.targetAllocation}
                                        onChange={(e) => {
                                          const updated = phase.investmentCategories.map(c =>
                                            c.id === category.id ? { ...c, targetAllocation: parseInt(e.target.value) || 0 } : c
                                          );
                                          updatePhase(phase.id, { investmentCategories: updated });
                                        }}
                                        className="text-xs"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-xs">Return %</Label>
                                      <Input
                                        type="number"
                                        step="0.1"
                                        value={category.expectedReturn}
                                        onChange={(e) => {
                                          const updated = phase.investmentCategories.map(c =>
                                            c.id === category.id ? { ...c, expectedReturn: parseFloat(e.target.value) || 0 } : c
                                          );
                                          updatePhase(phase.id, { investmentCategories: updated });
                                        }}
                                        className="text-xs"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-xs">Risk</Label>
                                      <Select
                                        value={category.riskLevel}
                                        onValueChange={(value) => {
                                          const updated = phase.investmentCategories.map(c =>
                                            c.id === category.id ? { ...c, riskLevel: value as any } : c
                                          );
                                          updatePhase(phase.id, { investmentCategories: updated });
                                        }}
                                      >
                                        <SelectTrigger className="text-xs">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="conservative">Conservative</SelectItem>
                                          <SelectItem value="moderate">Moderate</SelectItem>
                                          <SelectItem value="aggressive">Aggressive</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              
                              {phase.investmentCategories.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                  No investment categories configured
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Investment Mappings */}
            <TabsContent value="investments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Investment Account Mappings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Badge variant="outline" className="mb-2">Investment Mapping Module</Badge>
                    <p className="text-sm text-muted-foreground">
                      Configure automatic mapping rules for different account types to SWAG phases
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Branding */}
            <TabsContent value="branding" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Branding & Visual Identity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label>Company Name</Label>
                        <Input
                          value={config.brandingSettings.companyName}
                          onChange={(e) => updateBrandingSettings({ companyName: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label>Primary Color</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="color"
                            value={config.brandingSettings.primaryColor}
                            onChange={(e) => updateBrandingSettings({ primaryColor: e.target.value })}
                            className="w-16 h-10"
                          />
                          <Input
                            value={config.brandingSettings.primaryColor}
                            onChange={(e) => updateBrandingSettings({ primaryColor: e.target.value })}
                            placeholder="#2563eb"
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Secondary Color</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="color"
                            value={config.brandingSettings.secondaryColor}
                            onChange={(e) => updateBrandingSettings({ secondaryColor: e.target.value })}
                            className="w-16 h-10"
                          />
                          <Input
                            value={config.brandingSettings.secondaryColor}
                            onChange={(e) => updateBrandingSettings({ secondaryColor: e.target.value })}
                            placeholder="#7c3aed"
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Logo URL (optional)</Label>
                        <Input
                          value={config.brandingSettings.logoUrl || ''}
                          onChange={(e) => updateBrandingSettings({ logoUrl: e.target.value })}
                          placeholder="https://example.com/logo.png"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label>Footer Text (optional)</Label>
                        <Textarea
                          value={config.brandingSettings.footerText || ''}
                          onChange={(e) => updateBrandingSettings({ footerText: e.target.value })}
                          rows={3}
                          placeholder="Custom footer text for branded reports"
                        />
                      </div>

                      <div>
                        <Label>Legal Disclaimers</Label>
                        <Textarea
                          value={config.brandingSettings.disclaimers.join('\n')}
                          onChange={(e) => updateBrandingSettings({ 
                            disclaimers: e.target.value.split('\n').filter(d => d.trim()) 
                          })}
                          rows={4}
                          placeholder="Enter disclaimers, one per line"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Preview</h4>
                    <div 
                      className="rounded-lg p-6 text-white"
                      style={{ backgroundColor: config.brandingSettings.primaryColor }}
                    >
                      <h3 className="text-xl font-bold">{config.brandingSettings.companyName}</h3>
                      <p className="opacity-90">SWAG Retirement Roadmap™</p>
                      <div className="mt-4 flex items-center gap-4">
                        <div 
                          className="w-12 h-12 rounded-lg"
                          style={{ backgroundColor: config.brandingSettings.secondaryColor }}
                        />
                        <div className="text-sm opacity-75">
                          Phase-based retirement planning
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Features */}
            <TabsContent value="features" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Feature Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { key: 'phases', label: 'Phase Management', description: 'Enable/disable phase-based portfolio allocation' },
                      { key: 'allocations', label: 'Investment Allocations', description: 'Show investment allocation dashboard' },
                      { key: 'projections', label: 'Future Projections', description: 'Display phase projections and confidence levels' },
                      { key: 'reports', label: 'PDF Reports', description: 'Generate downloadable retirement reports' },
                      { key: 'scenarios', label: 'Scenario Testing', description: 'Allow users to test different scenarios' },
                      { key: 'rebalancing', label: 'Rebalancing Alerts', description: 'Show portfolio rebalancing recommendations' }
                    ].map((feature) => (
                      <div key={feature.key} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{feature.label}</h4>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                        <Checkbox
                          checked={config.enabledFeatures?.[feature.key] || false}
                          onCheckedChange={(checked) => {
                            setConfig(prev => ({
                              ...prev,
                              enabledFeatures: {
                                ...prev.enabledFeatures,
                                [feature.key]: !!checked
                              }
                            }));
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}