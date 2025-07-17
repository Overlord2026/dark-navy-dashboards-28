import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/context/TenantContext';
import { toast } from 'sonner';
import { Palette, Globe, Mail, Image } from 'lucide-react';

interface TenantSettings {
  id?: string;
  tenant_id: string;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  custom_domain?: string;
  subdomain?: string;
  email_templates: any;
  smtp_settings: any;
}

export function TenantBrandingSettings() {
  const [settings, setSettings] = useState<TenantSettings>({
    tenant_id: '',
    primary_color: '#0066cc',
    secondary_color: '#f8f9fa',
    accent_color: '#28a745',
    email_templates: {},
    smtp_settings: {}
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { currentTenant } = useTenant();

  useEffect(() => {
    if (currentTenant?.id) {
      fetchSettings();
    }
  }, [currentTenant]);

  const fetchSettings = async () => {
    if (!currentTenant?.id) return;

    try {
      const { data, error } = await (supabase as any)
        .from('tenant_settings')
        .select('*')
        .eq('tenant_id', currentTenant.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setSettings(data);
      } else {
        setSettings(prev => ({ ...prev, tenant_id: currentTenant.id }));
      }
    } catch (error) {
      console.error('Error fetching tenant settings:', error);
      toast.error('Failed to load branding settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!currentTenant?.id) return;

    setIsSaving(true);
    try {
      const { error } = await (supabase as any)
        .from('tenant_settings')
        .upsert({
          ...settings,
          tenant_id: currentTenant.id
        });

      if (error) throw error;

      toast.success('Branding settings saved successfully');
      
      // Log admin action
      await (supabase as any).rpc('log_admin_action', {
        p_tenant_id: currentTenant.id,
        p_event_type: 'branding_updated',
        p_action_category: 'tenant_management',
        p_details: {
          changes: settings
        }
      });
    } catch (error) {
      console.error('Error saving tenant settings:', error);
      toast.error('Failed to save branding settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading branding settings...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            <div>
              <CardTitle>Brand Colors</CardTitle>
              <CardDescription>
                Customize your tenant's color scheme
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="primary-color"
                  type="color"
                  value={settings.primary_color}
                  onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                  className="w-16 h-10"
                />
                <Input
                  type="text"
                  value={settings.primary_color}
                  onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                  placeholder="#0066cc"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="secondary-color">Secondary Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="secondary-color"
                  type="color"
                  value={settings.secondary_color}
                  onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
                  className="w-16 h-10"
                />
                <Input
                  type="text"
                  value={settings.secondary_color}
                  onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
                  placeholder="#f8f9fa"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="accent-color">Accent Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="accent-color"
                  type="color"
                  value={settings.accent_color}
                  onChange={(e) => setSettings({ ...settings, accent_color: e.target.value })}
                  className="w-16 h-10"
                />
                <Input
                  type="text"
                  value={settings.accent_color}
                  onChange={(e) => setSettings({ ...settings, accent_color: e.target.value })}
                  placeholder="#28a745"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            <div>
              <CardTitle>Logo & Assets</CardTitle>
              <CardDescription>
                Upload your company logo and other brand assets
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="logo-url">Logo URL</Label>
            <Input
              id="logo-url"
              type="url"
              value={settings.logo_url || ''}
              onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
              placeholder="https://example.com/logo.png"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            <div>
              <CardTitle>Domain Settings</CardTitle>
              <CardDescription>
                Configure your custom domain and subdomain
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="subdomain">Subdomain</Label>
            <div className="flex items-center">
              <Input
                id="subdomain"
                type="text"
                value={settings.subdomain || ''}
                onChange={(e) => setSettings({ ...settings, subdomain: e.target.value })}
                placeholder="yourcompany"
                className="rounded-r-none"
              />
              <span className="px-3 py-2 bg-muted border border-l-0 rounded-r-md text-sm text-muted-foreground">
                .yourplatform.com
              </span>
            </div>
          </div>
          <div>
            <Label htmlFor="custom-domain">Custom Domain</Label>
            <Input
              id="custom-domain"
              type="text"
              value={settings.custom_domain || ''}
              onChange={(e) => setSettings({ ...settings, custom_domain: e.target.value })}
              placeholder="app.yourcompany.com"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            <div>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>
                Configure SMTP settings and email templates
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Email template customization and SMTP configuration will be available when you provide API keys.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
}