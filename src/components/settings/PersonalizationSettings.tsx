import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Palette, 
  Moon, 
  Sun, 
  Monitor,
  Upload,
  Crown,
  ChevronDown,
  ChevronRight,
  Eye,
  Globe,
  Layout,
  Image,
  Save,
  Loader2,
  Lock
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';
import { useEventTracking } from '@/hooks/useEventTracking';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PersonalizationSettings {
  theme: 'light' | 'dark' | 'system';
  dashboard_layout: 'compact' | 'comfortable' | 'spacious';
  primary_color: string;
  show_advanced_features: boolean;
  show_beta_features: boolean;
  default_dashboard_view: 'overview' | 'detailed' | 'analytics';
  sidebar_collapsed: boolean;
  show_tooltips: boolean;
  animation_level: 'none' | 'reduced' | 'full';
  // Premium features
  custom_logo_url?: string;
  custom_domain?: string;
  white_label_enabled?: boolean;
  custom_brand_colors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export const PersonalizationSettings: React.FC = () => {
  const { user } = useAuth();
  const { subscriptionPlan, checkFeatureAccess } = useSubscriptionAccess();
  const { trackFeatureUsed } = useEventTracking();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);
  
  const [settings, setSettings] = useState<PersonalizationSettings>({
    theme: 'system',
    dashboard_layout: 'comfortable',
    primary_color: '#3b82f6',
    show_advanced_features: false,
    show_beta_features: false,
    default_dashboard_view: 'overview',
    sidebar_collapsed: false,
    show_tooltips: true,
    animation_level: 'full'
  });

  const isPremium = checkFeatureAccess('premium_analytics_access');
  const isWhiteLabelEnabled = checkFeatureAccess('white_label_access' as any);

  useEffect(() => {
    if (user) {
      loadPersonalizationSettings();
    }
  }, [user]);

  const loadPersonalizationSettings = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if ((data as any)?.personalization_settings) {
        setSettings({
          ...settings,
          ...(data as any).personalization_settings
        });
      }
    } catch (error) {
      console.error('Error loading personalization settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const updateData: any = {
        personalization_settings: settings,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;

      trackFeatureUsed('personalization_settings_updated', {
        theme: settings.theme,
        layout: settings.dashboard_layout,
        premium_features_used: isPremium ? Object.keys(settings.custom_brand_colors || {}).length : 0
      });

      toast({
        title: "Success",
        description: "Personalization settings updated successfully",
      });
    } catch (error) {
      console.error('Error updating personalization settings:', error);
      toast({
        title: "Error",
        description: "Failed to update personalization settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    if (!isWhiteLabelEnabled) {
      toast({
        title: "Premium Feature",
        description: "Upgrade to access custom branding features",
        variant: "destructive",
      });
      return;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-logo-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('branding')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('branding')
        .getPublicUrl(fileName);

      setSettings(prev => ({ ...prev, custom_logo_url: publicUrl }));
      
      trackFeatureUsed('custom_logo_uploaded');
      
      toast({
        title: "Success",
        description: "Custom logo uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: "Error",
        description: "Failed to upload custom logo",
        variant: "destructive",
      });
    }
  };

  const PremiumFeatureWrapper: React.FC<{ 
    children: React.ReactNode; 
    feature: string;
    description: string;
  }> = ({ children, feature, description }) => {
    const hasAccess = isPremium;
    
    return (
      <div className={`relative ${!hasAccess ? 'opacity-60' : ''}`}>
        {!hasAccess && (
          <div className="absolute inset-0 bg-gradient-to-r from-background/50 to-background/80 backdrop-blur-sm rounded-lg z-10 flex items-center justify-center">
            <div className="text-center space-y-2">
              <Crown className="h-6 w-6 text-amber-500 mx-auto" />
              <p className="text-sm font-medium">Premium Feature</p>
              <p className="text-xs text-muted-foreground">{description}</p>
              <Button size="sm" onClick={() => trackFeatureUsed('upgrade_prompt_clicked', { feature })}>
                <Crown className="h-3 w-3 mr-1" />
                Upgrade
              </Button>
            </div>
          </div>
        )}
        {children}
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Theme & Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme & Display
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Selection */}
          <div className="space-y-3">
            <Label>Theme Preference</Label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'light', icon: Sun, label: 'Light' },
                { value: 'dark', icon: Moon, label: 'Dark' },
                { value: 'system', icon: Monitor, label: 'System' }
              ].map(({ value, icon: Icon, label }) => (
                <Button
                  key={value}
                  variant={settings.theme === value ? "default" : "outline"}
                  className="flex flex-col gap-2 h-auto py-3"
                  onClick={() => setSettings(prev => ({ ...prev, theme: value as any }))}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-xs">{label}</span>
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Layout Options */}
          <div className="space-y-3">
            <Label>Dashboard Layout</Label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'compact', label: 'Compact' },
                { value: 'comfortable', label: 'Comfortable' },
                { value: 'spacious', label: 'Spacious' }
              ].map(({ value, label }) => (
                <Button
                  key={value}
                  variant={settings.dashboard_layout === value ? "default" : "outline"}
                  className="text-xs"
                  onClick={() => setSettings(prev => ({ ...prev, dashboard_layout: value as any }))}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* Primary Color */}
          <div className="space-y-3">
            <Label>Primary Color</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={settings.primary_color}
                onChange={(e) => setSettings(prev => ({ ...prev, primary_color: e.target.value }))}
                className="w-12 h-10 rounded-md border border-input"
              />
              <Input
                value={settings.primary_color}
                onChange={(e) => setSettings(prev => ({ ...prev, primary_color: e.target.value }))}
                className="max-w-[200px]"
                placeholder="#3b82f6"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Experience */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            User Experience
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Basic UX Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Show Tooltips</Label>
                <p className="text-sm text-muted-foreground">
                  Display helpful tooltips throughout the interface
                </p>
              </div>
              <Switch
                checked={settings.show_tooltips}
                onCheckedChange={(value) => setSettings(prev => ({ ...prev, show_tooltips: value }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Collapse Sidebar by Default</Label>
                <p className="text-sm text-muted-foreground">
                  Start with a collapsed navigation sidebar
                </p>
              </div>
              <Switch
                checked={settings.sidebar_collapsed}
                onCheckedChange={(value) => setSettings(prev => ({ ...prev, sidebar_collapsed: value }))}
              />
            </div>

            <div className="space-y-3">
              <Label>Animation Level</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'none', label: 'None' },
                  { value: 'reduced', label: 'Reduced' },
                  { value: 'full', label: 'Full' }
                ].map(({ value, label }) => (
                  <Button
                    key={value}
                    variant={settings.animation_level === value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSettings(prev => ({ ...prev, animation_level: value as any }))}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Advanced Options */}
          <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0">
                <span className="font-medium">Advanced Options</span>
                {isAdvancedOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Show Advanced Features</Label>
                  <p className="text-sm text-muted-foreground">
                    Display advanced options and controls
                  </p>
                </div>
                <Switch
                  checked={settings.show_advanced_features}
                  onCheckedChange={(value) => setSettings(prev => ({ ...prev, show_advanced_features: value }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Beta Features</Label>
                  <p className="text-sm text-muted-foreground">
                    Access experimental features (may be unstable)
                  </p>
                </div>
                <Switch
                  checked={settings.show_beta_features}
                  onCheckedChange={(value) => setSettings(prev => ({ ...prev, show_beta_features: value }))}
                />
              </div>

              <div className="space-y-3">
                <Label>Default Dashboard View</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={settings.default_dashboard_view}
                  onChange={(e) => setSettings(prev => ({ ...prev, default_dashboard_view: e.target.value as any }))}
                >
                  <option value="overview">Overview</option>
                  <option value="detailed">Detailed</option>
                  <option value="analytics">Analytics</option>
                </select>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>

      {/* Premium Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-500" />
            Branding & White Label
            {!isPremium && <Badge variant="outline">Premium</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Collapsible open={isPremiumOpen} onOpenChange={setIsPremiumOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0">
                <span className="font-medium">Custom Branding Options</span>
                {isPremiumOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-6 mt-4">
              {/* Custom Logo */}
              <PremiumFeatureWrapper
                feature="custom_logo"
                description="Upload your own logo to customize the interface"
              >
                <div className="space-y-3">
                  <Label>Custom Logo</Label>
                  <div className="space-y-3">
                    {settings.custom_logo_url && (
                      <div className="p-4 border rounded-lg flex items-center gap-3">
                        <img 
                          src={settings.custom_logo_url} 
                          alt="Custom logo" 
                          className="h-12 w-auto object-contain"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSettings(prev => ({ ...prev, custom_logo_url: undefined }))}
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <Button variant="outline" asChild>
                        <label className="cursor-pointer">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Logo
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                          />
                        </label>
                      </Button>
                      <p className="text-sm text-muted-foreground">
                        PNG, JPG up to 2MB. Recommended: 200x60px
                      </p>
                    </div>
                  </div>
                </div>
              </PremiumFeatureWrapper>

              {/* Custom Domain */}
              <PremiumFeatureWrapper
                feature="custom_domain"
                description="Use your own domain for the application"
              >
                <div className="space-y-3">
                  <Label>Custom Domain</Label>
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <Input
                      value={settings.custom_domain || ''}
                      onChange={(e) => setSettings(prev => ({ ...prev, custom_domain: e.target.value }))}
                      placeholder="yourdomain.com"
                      disabled={!isPremium}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Contact support to configure DNS settings
                  </p>
                </div>
              </PremiumFeatureWrapper>

              {/* Brand Colors */}
              <PremiumFeatureWrapper
                feature="brand_colors"
                description="Customize all brand colors to match your identity"
              >
                <div className="space-y-4">
                  <Label>Brand Colors</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { key: 'primary', label: 'Primary', default: '#3b82f6' },
                      { key: 'secondary', label: 'Secondary', default: '#64748b' },
                      { key: 'accent', label: 'Accent', default: '#f59e0b' }
                    ].map(({ key, label, default: defaultColor }) => (
                      <div key={key} className="space-y-2">
                        <Label className="text-sm">{label}</Label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={settings.custom_brand_colors?.[key as keyof typeof settings.custom_brand_colors] || defaultColor}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              custom_brand_colors: {
                                ...prev.custom_brand_colors,
                                [key]: e.target.value
                              }
                            }))}
                            className="w-8 h-8 rounded border border-input"
                            disabled={!isPremium}
                          />
                          <Input
                            value={settings.custom_brand_colors?.[key as keyof typeof settings.custom_brand_colors] || defaultColor}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              custom_brand_colors: {
                                ...prev.custom_brand_colors,
                                [key]: e.target.value
                              }
                            }))}
                            className="text-xs font-mono"
                            disabled={!isPremium}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </PremiumFeatureWrapper>

              {/* White Label Toggle */}
              <PremiumFeatureWrapper
                feature="white_label"
                description="Remove all branding references for a completely custom experience"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>White Label Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Remove all platform branding and references
                    </p>
                  </div>
                  <Switch
                    checked={settings.white_label_enabled || false}
                    onCheckedChange={(value) => setSettings(prev => ({ ...prev, white_label_enabled: value }))}
                    disabled={!isWhiteLabelEnabled}
                  />
                </div>
              </PremiumFeatureWrapper>
            </CollapsibleContent>
          </Collapsible>

          {!isPremium && (
            <Alert className="mt-4">
              <Crown className="h-4 w-4" />
              <AlertDescription>
                Upgrade to Premium or Elite to access custom branding features and create a fully personalized experience.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving} className="min-w-[120px]">
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Changes
        </Button>
      </div>
    </div>
  );
};