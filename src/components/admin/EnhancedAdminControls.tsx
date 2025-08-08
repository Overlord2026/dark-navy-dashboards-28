import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Palette, 
  Layout, 
  Users, 
  Eye, 
  Save, 
  RotateCcw, 
  Upload,
  Download,
  GripVertical,
  Monitor,
  Smartphone,
  Tablet,
  TreePine,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PersonaCard } from '@/components/marketplace/PersonaCard';

interface PersonaConfig {
  id: string;
  title: string;
  icon: string;
  benefits: string[];
  visible: boolean;
  order: number;
  customTitle?: string;
  customBenefits?: string[];
}

interface LayoutSettings {
  heroLayout: 'full-tree' | 'split';
  animationType: 'animated' | 'static';
  heroHeadline: string;
  heroSubheadline: string;
  ctaText: string;
  theme: 'dark' | 'light';
  mobileOptimized: boolean;
}

interface EnhancedAdminControlsProps {
  className?: string;
}

export const EnhancedAdminControls: React.FC<EnhancedAdminControlsProps> = ({
  className = ""
}) => {
  const [personas, setPersonas] = useState<PersonaConfig[]>([]);
  const [settings, setSettings] = useState<LayoutSettings>({
    heroLayout: 'full-tree',
    animationType: 'animated',
    heroHeadline: 'Welcome to Your Boutique Family Office Marketplace',
    heroSubheadline: 'Where clients and professionals connect in one trusted, fiduciary-driven platform',
    ctaText: 'Explore Your Path',
    theme: 'dark',
    mobileOptimized: true
  });
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
    loadPersonaConfig();
  }, []);

  const loadSettings = () => {
    const savedSettings = localStorage.getItem('bfo-layout-settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(prev => ({ ...prev, ...parsed }));
    }
  };

  const loadPersonaConfig = () => {
    const defaultPersonas: PersonaConfig[] = [
      {
        id: 'client-family',
        title: 'Client / Family',
        icon: 'Users',
        benefits: [
          'Wealth dashboard & secure vault',
          'Investment & lending access',
          'Tax & estate planning tools'
        ],
        visible: true,
        order: 1
      },
      {
        id: 'financial-advisor',
        title: 'Financial Advisor',
        icon: 'Briefcase',
        benefits: [
          'Practice management suite',
          'Lead-to-sale engine',
          'Compliance & client analytics'
        ],
        visible: true,
        order: 2
      },
      {
        id: 'cpa-accountant',
        title: 'CPA / Accountant',
        icon: 'Calculator',
        benefits: [
          'Client tax portal & document vault',
          'CE tracking & marketing engine',
          'Compliance dashboard'
        ],
        visible: true,
        order: 3
      },
      {
        id: 'attorney-legal',
        title: 'Attorney / Legal',
        icon: 'Scale',
        benefits: [
          'Estate & trust management',
          'Client vault & CLE tracking',
          'Legal compliance tools'
        ],
        visible: true,
        order: 4
      },
      {
        id: 'insurance-medicare',
        title: 'Insurance + Medicare Agent',
        icon: 'Shield',
        benefits: [
          'Policy management & client comms',
          'Medicare call recording compliance',
          'Premium marketing tools'
        ],
        visible: true,
        order: 5
      },
      {
        id: 'healthcare-longevity',
        title: 'Healthcare & Longevity',
        icon: 'Heart',
        benefits: [
          'Patient record vault & wellness tools',
          'Marketplace for advanced diagnostics',
          'Longevity planning suite'
        ],
        visible: true,
        order: 6
      },
      {
        id: 'real-estate',
        title: 'Real Estate / Property',
        icon: 'Home',
        benefits: [
          'Listings & property vault',
          'Tenant management tools',
          'Client portal & analytics'
        ],
        visible: true,
        order: 7
      },
      {
        id: 'elite-family-office',
        title: 'Elite Family Office Executive',
        icon: 'Crown',
        benefits: [
          'Multi-entity management',
          'Premium analytics & concierge',
          'Global asset oversight'
        ],
        visible: true,
        order: 8
      },
      {
        id: 'coach-consultant',
        title: 'Coach / Consultant',
        icon: 'Target',
        benefits: [
          'Client portal & booking system',
          'Marketing tools & digital vault',
          'Revenue optimization suite'
        ],
        visible: true,
        order: 9
      }
    ];

    const savedPersonas = localStorage.getItem('bfo-persona-config');
    if (savedPersonas) {
      setPersonas(JSON.parse(savedPersonas));
    } else {
      setPersonas(defaultPersonas);
    }
  };

  const saveSettings = () => {
    localStorage.setItem('bfo-layout-settings', JSON.stringify(settings));
    localStorage.setItem('bfo-persona-config', JSON.stringify(personas));
    setHasChanges(false);
    
    // Dispatch storage event to update other components
    window.dispatchEvent(new Event('storage'));
    
    toast({
      title: "Settings Saved",
      description: "Your layout settings have been saved successfully.",
    });
  };

  const resetSettings = () => {
    const defaultSettings: LayoutSettings = {
      heroLayout: 'full-tree',
      animationType: 'animated',
      heroHeadline: 'Welcome to Your Boutique Family Office Marketplace',
      heroSubheadline: 'Where clients and professionals connect in one trusted, fiduciary-driven platform',
      ctaText: 'Explore Your Path',
      theme: 'dark',
      mobileOptimized: true
    };

    setSettings(defaultSettings);
    loadPersonaConfig();
    setHasChanges(true);
    
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to defaults.",
    });
  };

  const updateSetting = <K extends keyof LayoutSettings>(
    key: K,
    value: LayoutSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const updatePersona = (id: string, updates: Partial<PersonaConfig>) => {
    setPersonas(prev => prev.map(p => 
      p.id === id ? { ...p, ...updates } : p
    ));
    setHasChanges(true);
  };

  const reorderPersonas = (fromIndex: number, toIndex: number) => {
    const newPersonas = [...personas];
    const [removed] = newPersonas.splice(fromIndex, 1);
    newPersonas.splice(toIndex, 0, removed);
    
    // Update order numbers
    const updatedPersonas = newPersonas.map((persona, index) => ({
      ...persona,
      order: index + 1
    }));
    
    setPersonas(updatedPersonas);
    setHasChanges(true);
  };

  const exportConfig = () => {
    const config = { settings, personas };
    const dataStr = JSON.stringify(config, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'bfo-marketplace-config.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getDevicePreviewClass = () => {
    switch (previewDevice) {
      case 'mobile': return 'max-w-sm mx-auto';
      case 'tablet': return 'max-w-2xl mx-auto';
      default: return 'w-full';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-card/50 backdrop-blur-sm rounded-xl p-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <Settings className="w-8 h-8 text-gold" />
            Enhanced Admin Controls
          </h1>
          <p className="text-muted-foreground">
            Comprehensive control panel for marketplace layout, persona management, and real-time preview
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button onClick={exportConfig} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Config
          </Button>
          <Button onClick={resetSettings} variant="outline" size="sm">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={saveSettings} disabled={!hasChanges} size="sm" className="bg-gradient-to-r from-gold to-gold/90">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Control Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="layout" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="layout" className="flex items-center gap-2">
                <Layout className="w-4 h-4" />
                Layout
              </TabsTrigger>
              <TabsTrigger value="personas" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Personas
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Content
              </TabsTrigger>
              <TabsTrigger value="theme" className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Theme
              </TabsTrigger>
            </TabsList>

            {/* Layout Tab */}
            <TabsContent value="layout" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hero Layout Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Hero Layout Style</Label>
                      <Select value={settings.heroLayout} onValueChange={(value: 'full-tree' | 'split') => updateSetting('heroLayout', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full-tree">Full Tree Hero</SelectItem>
                          <SelectItem value="split">Split Layout</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground">
                        Choose between full-page tree animation or split layout with persona sidebar
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Animation Type</Label>
                      <Select value={settings.animationType} onValueChange={(value: 'animated' | 'static') => updateSetting('animationType', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="animated">
                            <div className="flex items-center gap-2">
                              <TreePine className="w-4 h-4" />
                              Animated Tree
                            </div>
                          </SelectItem>
                          <SelectItem value="static">Static Image</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Label>Mobile Optimization</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable mobile-first responsive design optimizations
                      </p>
                    </div>
                    <Switch 
                      checked={settings.mobileOptimized} 
                      onCheckedChange={(checked) => updateSetting('mobileOptimized', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Personas Tab */}
            <TabsContent value="personas" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Persona Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {personas.sort((a, b) => a.order - b.order).map((persona, index) => (
                    <div key={persona.id} className="p-4 border border-border rounded-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                          <Input
                            value={persona.customTitle || persona.title}
                            onChange={(e) => updatePersona(persona.id, { customTitle: e.target.value })}
                            className="font-medium"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={persona.visible}
                            onCheckedChange={(checked) => updatePersona(persona.id, { visible: checked })}
                          />
                          <Label className="text-sm">Visible</Label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Benefits (one per line)</Label>
                        <Textarea
                          value={(persona.customBenefits || persona.benefits).join('\n')}
                          onChange={(e) => updatePersona(persona.id, { 
                            customBenefits: e.target.value.split('\n').filter(b => b.trim()) 
                          })}
                          className="min-h-20"
                          placeholder="Enter benefits, one per line"
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hero Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Hero Headline</Label>
                    <Input
                      value={settings.heroHeadline}
                      onChange={(e) => updateSetting('heroHeadline', e.target.value)}
                      placeholder="Main headline text"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Hero Subheadline</Label>
                    <Textarea
                      value={settings.heroSubheadline}
                      onChange={(e) => updateSetting('heroSubheadline', e.target.value)}
                      placeholder="Supporting description text"
                      className="min-h-20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Primary CTA Text</Label>
                    <Input
                      value={settings.ctaText}
                      onChange={(e) => updateSetting('ctaText', e.target.value)}
                      placeholder="Call-to-action button text"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Theme Tab */}
            <TabsContent value="theme" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Theme & Styling</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Color Theme</Label>
                    <Select value={settings.theme} onValueChange={(value: 'dark' | 'light') => updateSetting('theme', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dark">Dark Theme (Navy & Gold)</SelectItem>
                        <SelectItem value="light">Light Theme</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-navy rounded-lg text-center">
                      <div className="w-8 h-8 bg-navy mx-auto mb-2 rounded"></div>
                      <p className="text-xs text-navy-foreground">Navy</p>
                      <p className="text-xs text-navy-foreground/70">#0B1F3A</p>
                    </div>
                    <div className="p-4 bg-gold rounded-lg text-center">
                      <div className="w-8 h-8 bg-gold mx-auto mb-2 rounded"></div>
                      <p className="text-xs text-gold-foreground">Gold</p>
                      <p className="text-xs text-gold-foreground/70">#C9A449</p>
                    </div>
                    <div className="p-4 bg-emerald rounded-lg text-center">
                      <div className="w-8 h-8 bg-emerald mx-auto mb-2 rounded"></div>
                      <p className="text-xs text-emerald-foreground">Emerald</p>
                      <p className="text-xs text-emerald-foreground/70">#1B5E4A</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Live Preview Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Device Selector */}
              <div className="flex gap-2">
                <Button
                  variant={previewDevice === 'desktop' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewDevice('desktop')}
                >
                  <Monitor className="w-4 h-4" />
                </Button>
                <Button
                  variant={previewDevice === 'tablet' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewDevice('tablet')}
                >
                  <Tablet className="w-4 h-4" />
                </Button>
                <Button
                  variant={previewDevice === 'mobile' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewDevice('mobile')}
                >
                  <Smartphone className="w-4 h-4" />
                </Button>
              </div>

              <Separator />

              {/* Preview Content */}
              <div className={`border rounded-lg p-4 bg-background ${getDevicePreviewClass()}`}>
                <div className="space-y-4">
                  {/* Hero Preview */}
                  <div className="text-center space-y-2">
                    <h1 className="font-serif text-lg font-bold">{settings.heroHeadline}</h1>
                    <p className="text-sm text-muted-foreground">{settings.heroSubheadline}</p>
                    <Button size="sm" className="bg-gold text-gold-foreground">
                      {settings.ctaText}
                    </Button>
                  </div>

                  <Separator />

                  {/* Personas Preview */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-center">Choose Your Path</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {personas
                        .filter(p => p.visible)
                        .sort((a, b) => a.order - b.order)
                        .slice(0, 3)
                        .map(persona => (
                          <div key={persona.id} className="p-3 border border-gold/20 rounded-lg text-center">
                            <p className="font-medium text-sm">{persona.customTitle || persona.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {(persona.customBenefits || persona.benefits)[0]}
                            </p>
                          </div>
                        ))}
                      {personas.filter(p => p.visible).length > 3 && (
                        <div className="text-center text-xs text-muted-foreground">
                          +{personas.filter(p => p.visible).length - 3} more personas
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Settings Summary */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Layout:</span>
                  <Badge variant="secondary">{settings.heroLayout}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Animation:</span>
                  <Badge variant="secondary">{settings.animationType}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Visible Personas:</span>
                  <Badge variant="secondary">{personas.filter(p => p.visible).length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mobile Optimized:</span>
                  <Badge variant={settings.mobileOptimized ? "default" : "secondary"}>
                    {settings.mobileOptimized ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {hasChanges && (
            <Card className="border-warning bg-warning/5">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-warning-foreground mb-2">Unsaved Changes</p>
                <Button onClick={saveSettings} size="sm" className="bg-warning text-warning-foreground">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};