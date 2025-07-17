import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTenant } from '@/hooks/useTenant';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Save, Eye } from 'lucide-react';
import { toast } from 'sonner';

export const TenantAboutEditor: React.FC = () => {
  const { currentTenant, tenantSettings, updateTenantSettings } = useTenant();
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [formData, setFormData] = useState({
    company_mission: '',
    company_values: '',
    company_history: '',
    team_description: '',
    contact_info: '',
    office_locations: '',
    certifications: '',
    investment_philosophy: ''
  });

  useEffect(() => {
    if (tenantSettings) {
      setFormData({
        company_mission: tenantSettings.about_config?.company_mission || '',
        company_values: tenantSettings.about_config?.company_values || '',
        company_history: tenantSettings.about_config?.company_history || '',
        team_description: tenantSettings.about_config?.team_description || '',
        contact_info: tenantSettings.about_config?.contact_info || '',
        office_locations: tenantSettings.about_config?.office_locations || '',
        certifications: tenantSettings.about_config?.certifications || '',
        investment_philosophy: tenantSettings.about_config?.investment_philosophy || ''
      });
    }
  }, [tenantSettings]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!currentTenant) return;

    try {
      setSaving(true);

      await updateTenantSettings({
        about_config: {
          company_mission: formData.company_mission,
          company_values: formData.company_values,
          company_history: formData.company_history,
          team_description: formData.team_description,
          contact_info: formData.contact_info,
          office_locations: formData.office_locations,
          certifications: formData.certifications,
          investment_philosophy: formData.investment_philosophy
        }
      });

      toast.success('About page content saved successfully');
    } catch (error) {
      toast.error('Failed to save about page content');
    } finally {
      setSaving(false);
    }
  };

  const renderPreview = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">{currentTenant?.name}</h1>
        <p className="text-muted-foreground">About Our Organization</p>
      </div>

      {formData.company_mission && (
        <section>
          <h2 className="text-xl font-semibold mb-3">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed">{formData.company_mission}</p>
        </section>
      )}

      {formData.investment_philosophy && (
        <section>
          <h2 className="text-xl font-semibold mb-3">Investment Philosophy</h2>
          <p className="text-muted-foreground leading-relaxed">{formData.investment_philosophy}</p>
        </section>
      )}

      {formData.company_values && (
        <section>
          <h2 className="text-xl font-semibold mb-3">Our Values</h2>
          <p className="text-muted-foreground leading-relaxed">{formData.company_values}</p>
        </section>
      )}

      {formData.company_history && (
        <section>
          <h2 className="text-xl font-semibold mb-3">Our History</h2>
          <p className="text-muted-foreground leading-relaxed">{formData.company_history}</p>
        </section>
      )}

      {formData.team_description && (
        <section>
          <h2 className="text-xl font-semibold mb-3">Our Team</h2>
          <p className="text-muted-foreground leading-relaxed">{formData.team_description}</p>
        </section>
      )}

      {formData.certifications && (
        <section>
          <h2 className="text-xl font-semibold mb-3">Certifications & Credentials</h2>
          <p className="text-muted-foreground leading-relaxed">{formData.certifications}</p>
        </section>
      )}

      {formData.office_locations && (
        <section>
          <h2 className="text-xl font-semibold mb-3">Office Locations</h2>
          <p className="text-muted-foreground leading-relaxed">{formData.office_locations}</p>
        </section>
      )}

      {formData.contact_info && (
        <section>
          <h2 className="text-xl font-semibold mb-3">Contact Information</h2>
          <p className="text-muted-foreground leading-relaxed">{formData.contact_info}</p>
        </section>
      )}
    </div>
  );

  const renderEditor = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="company-mission">Company Mission</Label>
          <Textarea
            id="company-mission"
            value={formData.company_mission}
            onChange={(e) => handleInputChange('company_mission', e.target.value)}
            placeholder="Describe your company's mission and purpose..."
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="investment-philosophy">Investment Philosophy</Label>
          <Textarea
            id="investment-philosophy"
            value={formData.investment_philosophy}
            onChange={(e) => handleInputChange('investment_philosophy', e.target.value)}
            placeholder="Describe your investment approach and philosophy..."
            rows={4}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="company-values">Company Values</Label>
        <Textarea
          id="company-values"
          value={formData.company_values}
          onChange={(e) => handleInputChange('company_values', e.target.value)}
          placeholder="List and describe your core values..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="company-history">Company History</Label>
        <Textarea
          id="company-history"
          value={formData.company_history}
          onChange={(e) => handleInputChange('company_history', e.target.value)}
          placeholder="Tell the story of your company's founding and evolution..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="team-description">Team Description</Label>
        <Textarea
          id="team-description"
          value={formData.team_description}
          onChange={(e) => handleInputChange('team_description', e.target.value)}
          placeholder="Describe your team's expertise and experience..."
          rows={4}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="certifications">Certifications & Credentials</Label>
          <Textarea
            id="certifications"
            value={formData.certifications}
            onChange={(e) => handleInputChange('certifications', e.target.value)}
            placeholder="List relevant certifications, licenses, and credentials..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="office-locations">Office Locations</Label>
          <Textarea
            id="office-locations"
            value={formData.office_locations}
            onChange={(e) => handleInputChange('office_locations', e.target.value)}
            placeholder="List your office locations and addresses..."
            rows={3}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-info">Contact Information</Label>
        <Textarea
          id="contact-info"
          value={formData.contact_info}
          onChange={(e) => handleInputChange('contact_info', e.target.value)}
          placeholder="Main phone, email, website, and other contact details..."
          rows={3}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                About Page Editor
              </CardTitle>
              <CardDescription>
                Configure the content that appears on your organization's About page
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setPreview(!preview)}
              >
                <Eye className="mr-2 h-4 w-4" />
                {preview ? 'Edit' : 'Preview'}
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {preview ? renderPreview() : renderEditor()}
        </CardContent>
      </Card>
    </div>
  );
};