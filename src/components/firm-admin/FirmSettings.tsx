import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFirmManagement } from '@/hooks/useFirmManagement';
import { FIRM_TYPES } from '@/types/firm';
import { Building2, Palette, Globe, Shield } from 'lucide-react';

export function FirmSettings() {
  const { firm, updateFirmSettings } = useFirmManagement();
  const [formData, setFormData] = useState({
    name: firm?.name || '',
    type: firm?.type || '',
    billing_email: firm?.billing_email || '',
    logo_url: firm?.logo_url || '',
    marketplace_visibility: firm?.marketplace_visibility || false,
    branding_enabled: firm?.branding_enabled || false,
    custom_domain: firm?.custom_domain || '',
    primary_color: firm?.primary_color || '#3b82f6',
    secondary_color: firm?.secondary_color || '#64748b'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firm) return;

    setLoading(true);
    try {
      await updateFirmSettings(formData);
    } catch (error) {
      console.error('Error updating firm settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!firm) return null;

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Configure your firm's basic details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firm-name">Firm Name</Label>
                <Input
                  id="firm-name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter firm name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="firm-type">Firm Type</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select firm type" />
                  </SelectTrigger>
                  <SelectContent>
                    {FIRM_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="billing-email">Billing Email</Label>
                <Input
                  id="billing-email"
                  type="email"
                  value={formData.billing_email}
                  onChange={(e) => handleInputChange('billing_email', e.target.value)}
                  placeholder="billing@yourfirm.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="logo-url">Logo URL</Label>
                <Input
                  id="logo-url"
                  value={formData.logo_url}
                  onChange={(e) => handleInputChange('logo_url', e.target.value)}
                  placeholder="https://yourfirm.com/logo.png"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Marketplace Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Marketplace Settings
            </CardTitle>
            <CardDescription>
              Control how your firm appears in the public marketplace
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="marketplace-visibility">Marketplace Visibility</Label>
                <p className="text-sm text-muted-foreground">
                  Allow clients to discover your firm and professionals in the marketplace
                </p>
              </div>
              <Switch
                id="marketplace-visibility"
                checked={formData.marketplace_visibility}
                onCheckedChange={(checked) => handleInputChange('marketplace_visibility', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Branding & White Label */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Branding & White Label
            </CardTitle>
            <CardDescription>
              Customize your firm's appearance and enable white-label features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="branding-enabled">White Label Branding</Label>
                <p className="text-sm text-muted-foreground">
                  Enable custom branding and remove platform references
                </p>
              </div>
              <Switch
                id="branding-enabled"
                checked={formData.branding_enabled}
                onCheckedChange={(checked) => handleInputChange('branding_enabled', checked)}
              />
            </div>

            {formData.branding_enabled && (
              <div className="space-y-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="custom-domain">Custom Domain</Label>
                  <Input
                    id="custom-domain"
                    value={formData.custom_domain}
                    onChange={(e) => handleInputChange('custom_domain', e.target.value)}
                    placeholder="portal.yourfirm.com"
                  />
                  <p className="text-xs text-muted-foreground">
                    Contact support to configure your custom domain
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primary-color">Primary Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="primary-color"
                        type="color"
                        value={formData.primary_color}
                        onChange={(e) => handleInputChange('primary_color', e.target.value)}
                        className="w-16 h-10"
                      />
                      <Input
                        value={formData.primary_color}
                        onChange={(e) => handleInputChange('primary_color', e.target.value)}
                        placeholder="#3b82f6"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="secondary-color">Secondary Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="secondary-color"
                        type="color"
                        value={formData.secondary_color}
                        onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                        className="w-16 h-10"
                      />
                      <Input
                        value={formData.secondary_color}
                        onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                        placeholder="#64748b"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Settings
            </CardTitle>
            <CardDescription>
              Configure security and access control for your firm
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Require 2FA for all admin users
                  </p>
                </div>
                <Switch disabled />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Single Sign-On (SSO)</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable SAML/OAuth integration (Enterprise plan)
                  </p>
                </div>
                <Switch disabled />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
}