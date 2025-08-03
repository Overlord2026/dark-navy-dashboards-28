import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Settings, Save, Trash2, Shield, Upload } from 'lucide-react';
import { FileUpload } from '@/components/ui/file-upload';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type FamilyVault = Database['public']['Tables']['family_vaults']['Row'];

interface VaultSettingsProps {
  vault: FamilyVault;
  onVaultUpdated: () => void;
}

export function VaultSettings({ vault, onVaultUpdated }: VaultSettingsProps) {
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [formData, setFormData] = useState({
    vault_name: vault.vault_name,
    description: vault.description || '',
    family_motto: vault.family_motto || '',
    family_values: vault.family_values || [],
    vault_photo_url: vault.vault_photo_url || '',
    is_active: vault.is_active
  });
  const [newValue, setNewValue] = useState('');
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('family_vaults')
        .update({
          vault_name: formData.vault_name,
          description: formData.description || null,
          family_motto: formData.family_motto || null,
          family_values: formData.family_values.length > 0 ? formData.family_values : null,
          vault_photo_url: formData.vault_photo_url || null,
          is_active: formData.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', vault.id);

      if (error) throw error;

      toast({
        title: "Settings saved",
        description: "Your vault settings have been updated successfully.",
      });

      onVaultUpdated();
    } catch (error) {
      console.error('Error updating vault:', error);
      toast({
        title: "Error saving settings",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (file: File) => {
    try {
      setUploadingPhoto(true);
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/vault-photos/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('legacy-vault')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('legacy-vault')
        .getPublicUrl(fileName);

      setFormData(prev => ({ ...prev, vault_photo_url: publicUrl }));
      
      toast({
        title: "Photo uploaded",
        description: "Your vault photo has been updated.",
      });
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const addFamilyValue = () => {
    if (newValue.trim() && !formData.family_values.includes(newValue.trim())) {
      setFormData(prev => ({
        ...prev,
        family_values: [...prev.family_values, newValue.trim()]
      }));
      setNewValue('');
    }
  };

  const removeFamilyValue = (value: string) => {
    setFormData(prev => ({
      ...prev,
      family_values: prev.family_values.filter(v => v !== value)
    }));
  };

  const handleDeactivateVault = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('family_vaults')
        .update({ is_active: false })
        .eq('id', vault.id);

      if (error) throw error;

      toast({
        title: "Vault deactivated",
        description: "Your vault has been deactivated and is no longer accessible.",
        variant: "destructive",
      });

      onVaultUpdated();
    } catch (error) {
      console.error('Error deactivating vault:', error);
      toast({
        title: "Error deactivating vault",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Vault Settings</h2>
        <p className="text-muted-foreground">
          Manage your family vault configuration and preferences.
        </p>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vault_name">Vault Name</Label>
            <Input
              id="vault_name"
              value={formData.vault_name}
              onChange={(e) => setFormData(prev => ({ ...prev, vault_name: e.target.value }))}
              placeholder="Enter vault name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your family vault..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Family Identity */}
      <Card>
        <CardHeader>
          <CardTitle>Family Identity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="family_motto">Family Motto</Label>
            <Input
              id="family_motto"
              value={formData.family_motto}
              onChange={(e) => setFormData(prev => ({ ...prev, family_motto: e.target.value }))}
              placeholder="Enter your family motto"
            />
          </div>
          
          <div className="space-y-4">
            <Label>Family Values</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a family value"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addFamilyValue()}
              />
              <Button onClick={addFamilyValue} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.family_values.map((value, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => removeFamilyValue(value)}
                >
                  {value} ×
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vault Photo */}
      <Card>
        <CardHeader>
          <CardTitle>Vault Photo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.vault_photo_url ? (
            <div className="space-y-4">
              <img
                src={formData.vault_photo_url}
                alt="Vault photo"
                className="w-32 h-32 object-cover rounded-lg"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setFormData(prev => ({ ...prev, vault_photo_url: '' }))}
                >
                  Remove Photo
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Upload a photo that represents your family.
              </p>
              <FileUpload
                onFileChange={handlePhotoUpload}
                accept="image/*"
                maxSize={5 * 1024 * 1024} // 5MB
                className="w-full"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy & Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="is_active">Vault Status</Label>
              <p className="text-sm text-muted-foreground">
                Active vaults can be accessed by family members.
              </p>
            </div>
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
            />
          </div>
          
          <div className="pt-4 border-t">
            <h4 className="font-medium text-destructive mb-2">Danger Zone</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Deactivating your vault will make it inaccessible to all family members.
            </p>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Deactivate Vault
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Deactivate Vault</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will make your vault inaccessible to all family members. 
                    You can reactivate it later from the settings.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeactivateVault}>
                    Deactivate
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading} className="gap-2">
          <Save className="h-4 w-4" />
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}