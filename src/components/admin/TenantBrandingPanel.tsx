import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTenant } from '@/hooks/useTenant';
import { Upload, Palette, Globe, Save } from 'lucide-react';
import { toast } from 'sonner';

export const TenantBrandingPanel: React.FC = () => {
  const { currentTenant, tenantSettings, updateTenant, updateTenantSettings } = useTenant();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: currentTenant?.name || '',
    domain: currentTenant?.domain || '',
    brand_logo_url: currentTenant?.brand_logo_url || '',
    primary_color: currentTenant?.color_palette?.primary || '#1F1F1F',
    accent_color: currentTenant?.color_palette?.accent || '#FFD700',
    secondary_color: currentTenant?.color_palette?.secondary || '#F5F5F5',
    custom_css: tenantSettings?.custom_css || ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!currentTenant) return;

    try {
      setSaving(true);

      // Update tenant basic info
      await updateTenant({
        name: formData.name,
        domain: formData.domain,
        brand_logo_url: formData.brand_logo_url,
        color_palette: {
          primary: formData.primary_color,
          accent: formData.accent_color,
          secondary: formData.secondary_color
        }
      });

      // Update tenant settings
      await updateTenantSettings({
        custom_css: formData.custom_css,
        branding_config: {
          colors: {
            primary: formData.primary_color,
            accent: formData.accent_color,
            secondary: formData.secondary_color
          }
        }
      });

      toast.success('Branding settings saved successfully');
    } catch (error) {
      toast.error('Failed to save branding settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Brand Identity
          </CardTitle>
          <CardDescription>
            Configure your organization's visual identity and branding
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tenant-name">Organization Name</Label>
              <Input
                id="tenant-name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter organization name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tenant-domain">Custom Domain</Label>
              <Input
                id="tenant-domain"
                value={formData.domain}
                onChange={(e) => handleInputChange('domain', e.target.value)}
                placeholder="myorg.yourplatform.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo-url">Logo URL</Label>
            <div className="flex gap-2">
              <Input
                id="logo-url"
                value={formData.brand_logo_url}
                onChange={(e) => handleInputChange('brand_logo_url', e.target.value)}
                placeholder="https://example.com/logo.png"
              />
              <Button variant="outline" size="icon">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Brand Colors</Label>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="primary-color">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="primary-color"
                    type="color"
                    value={formData.primary_color}
                    onChange={(e) => handleInputChange('primary_color', e.target.value)}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value={formData.primary_color}
                    onChange={(e) => handleInputChange('primary_color', e.target.value)}
                    placeholder="#1F1F1F"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accent-color">Accent Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="accent-color"
                    type="color"
                    value={formData.accent_color}
                    onChange={(e) => handleInputChange('accent_color', e.target.value)}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value={formData.accent_color}
                    onChange={(e) => handleInputChange('accent_color', e.target.value)}
                    placeholder="#FFD700"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondary-color">Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondary-color"
                    type="color"
                    value={formData.secondary_color}
                    onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value={formData.secondary_color}
                    onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                    placeholder="#F5F5F5"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Custom Styling
          </CardTitle>
          <CardDescription>
            Add custom CSS to further customize your platform appearance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="custom-css">Custom CSS</Label>
            <Textarea
              id="custom-css"
              value={formData.custom_css}
              onChange={(e) => handleInputChange('custom_css', e.target.value)}
              placeholder="/* Custom CSS styles */"
              rows={10}
              className="font-mono"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};