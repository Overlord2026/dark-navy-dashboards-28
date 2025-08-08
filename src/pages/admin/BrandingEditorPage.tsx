import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BrandBanner } from '@/components/branding/BrandBanner';
import { useBranding } from '@/contexts/BrandingContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function BrandingEditorPage() {
  const { branding, refreshBranding } = useBranding();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: branding.name,
    brand_primary: branding.colors.primary,
    brand_secondary: branding.colors.secondary,
    brand_accent: branding.colors.accent,
    powered_by_bfo: branding.powered_by_bfo
  });

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('tenants')
        .update(formData)
        .eq('slug', 'bfo');

      if (error) throw error;

      toast({
        title: "Success",
        description: "Branding updated successfully"
      });

      await refreshBranding();
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to update branding",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Branding Editor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label>Brand Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label>Primary Color</Label>
                <Input
                  type="color"
                  value={formData.brand_primary}
                  onChange={(e) => setFormData(prev => ({ ...prev, brand_primary: e.target.value }))}
                />
              </div>
              <div>
                <Label>Secondary Color</Label>
                <Input
                  type="color"
                  value={formData.brand_secondary}
                  onChange={(e) => setFormData(prev => ({ ...prev, brand_secondary: e.target.value }))}
                />
              </div>
              <div>
                <Label>Accent Color</Label>
                <Input
                  type="color"
                  value={formData.brand_accent}
                  onChange={(e) => setFormData(prev => ({ ...prev, brand_accent: e.target.value }))}
                />
              </div>
            </div>
            
            <div>
              <Label>Live Preview</Label>
              <Card className="p-4">
                <BrandBanner />
                <div className="mt-4 space-y-2">
                  <Button variant="default" size="sm">Primary Button</Button>
                  <Button variant="secondary" size="sm">Secondary Button</Button>
                </div>
              </Card>
            </div>
          </div>

          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}