import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Eye, Monitor, Smartphone, Tablet } from 'lucide-react';
import { toast } from 'sonner';

export interface LayoutSettings {
  landingLayout: 'full-tree' | 'split';
  theme: 'default' | 'dark' | 'light';
  mobileOptimized: boolean;
}

interface LayoutSettingsPanelProps {
  onSettingsChange?: (settings: LayoutSettings) => void;
  className?: string;
}

export const LayoutSettingsPanel: React.FC<LayoutSettingsPanelProps> = ({ 
  onSettingsChange,
  className = "" 
}) => {
  const [settings, setSettings] = useState<LayoutSettings>({
    landingLayout: 'full-tree',
    theme: 'default',
    mobileOptimized: true
  });

  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [hasChanges, setHasChanges] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('bfo-layout-settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      onSettingsChange?.(parsed);
    }
  }, [onSettingsChange]);

  const updateSetting = <K extends keyof LayoutSettings>(
    key: K, 
    value: LayoutSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    setHasChanges(true);
    
    // Auto-save to localStorage
    localStorage.setItem('bfo-layout-settings', JSON.stringify(newSettings));
    onSettingsChange?.(newSettings);
    
    toast.success(`${key === 'landingLayout' ? 'Landing layout' : key} updated`);
  };

  const resetSettings = () => {
    const defaultSettings: LayoutSettings = {
      landingLayout: 'full-tree',
      theme: 'default',
      mobileOptimized: true
    };
    
    setSettings(defaultSettings);
    localStorage.setItem('bfo-layout-settings', JSON.stringify(defaultSettings));
    onSettingsChange?.(defaultSettings);
    setHasChanges(false);
    
    toast.success('Settings reset to defaults');
  };

  const layoutOptions = [
    {
      value: 'full-tree' as const,
      label: 'Full Tree Hero',
      description: 'Tree animation fills 70-80% of viewport with centered headlines'
    },
    {
      value: 'split' as const,
      label: 'Split Layout',
      description: 'Tree on left (40%), persona grid on right with hover effects'
    }
  ];

  const deviceIcons = {
    desktop: Monitor,
    tablet: Tablet,
    mobile: Smartphone
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Landing Page Layout Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Landing Layout Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Landing Page Layout</Label>
            <Select 
              value={settings.landingLayout} 
              onValueChange={(value: 'full-tree' | 'split') => updateSetting('landingLayout', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select layout option" />
              </SelectTrigger>
              <SelectContent>
                {layoutOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{option.label}</span>
                      <span className="text-xs text-muted-foreground">{option.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {settings.landingLayout === 'full-tree' && (
              <Badge variant="secondary" className="text-xs">
                Recommended for desktop users
              </Badge>
            )}
            {settings.landingLayout === 'split' && (
              <Badge variant="secondary" className="text-xs">
                Better for quick persona selection
              </Badge>
            )}
          </div>

          {/* Preview Device Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Preview Device</Label>
            <div className="flex gap-2">
              {(Object.keys(deviceIcons) as Array<keyof typeof deviceIcons>).map((device) => {
                const Icon = deviceIcons[device];
                return (
                  <Button
                    key={device}
                    variant={previewDevice === device ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPreviewDevice(device)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="capitalize">{device}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Current Settings Summary */}
          <div className="p-4 bg-muted/30 rounded-lg space-y-2">
            <h4 className="font-medium text-sm text-foreground">Current Configuration</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Layout:</span>
                <span className="ml-2 font-medium">
                  {layoutOptions.find(opt => opt.value === settings.landingLayout)?.label}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Mobile Optimized:</span>
                <span className="ml-2 font-medium">
                  {settings.mobileOptimized ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={resetSettings}
              size="sm"
            >
              Reset to Defaults
            </Button>
            <Button 
              onClick={() => window.open('/', '_blank')}
              size="sm"
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Preview Landing Page
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Live Preview Indicator */}
      <Card className="border-emerald/20 bg-emerald/5">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald rounded-full animate-pulse" />
            <span className="text-sm text-emerald-700 dark:text-emerald-300">
              Changes are applied instantly to the live landing page
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};