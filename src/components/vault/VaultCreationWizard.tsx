import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Heart, Camera, Users, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { FileUpload } from '@/components/ui/file-upload';

interface VaultData {
  vault_name: string;
  description: string;
  family_motto: string;
  family_values: string[];
  vault_photo_url: string;
}

export function VaultCreationWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [vaultData, setVaultData] = useState<VaultData>({
    vault_name: '',
    description: '',
    family_motto: '',
    family_values: [],
    vault_photo_url: ''
  });
  const [newValue, setNewValue] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const steps = [
    { number: 1, title: 'Basic Information', description: 'Name and describe your vault' },
    { number: 2, title: 'Family Identity', description: 'Values and motto' },
    { number: 3, title: 'Customize Look', description: 'Photo and branding' },
    { number: 4, title: 'Review & Create', description: 'Finalize your vault' }
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const addFamilyValue = () => {
    if (newValue.trim() && !vaultData.family_values.includes(newValue.trim())) {
      setVaultData(prev => ({
        ...prev,
        family_values: [...prev.family_values, newValue.trim()]
      }));
      setNewValue('');
    }
  };

  const removeFamilyValue = (value: string) => {
    setVaultData(prev => ({
      ...prev,
      family_values: prev.family_values.filter(v => v !== value)
    }));
  };

  const handlePhotoUpload = async (file: File) => {
    try {
      setLoading(true);
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

      setVaultData(prev => ({ ...prev, vault_photo_url: publicUrl }));
      toast({
        title: "Photo uploaded",
        description: "Your vault photo has been uploaded successfully.",
      });
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createVault = async () => {
    try {
      setLoading(true);
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('family_vaults')
        .insert({
          user_id: user.id,
          ...vaultData
        })
        .select()
        .single();

      if (error) throw error;

      // Add the creator as an admin member
      await supabase
        .from('vault_members')
        .insert({
          vault_id: data.id,
          user_id: user.id,
          email: user.email!,
          first_name: user.user_metadata?.first_name || '',
          last_name: user.user_metadata?.last_name || '',
          role: 'admin',
          permissions: {
            view: true,
            add: true,
            share: true,
            admin: true
          },
          status: 'active',
          accepted_at: new Date().toISOString(),
          created_by: user.id
        });

      toast({
        title: "Vault created!",
        description: "Your family legacy vault has been created successfully.",
      });

      navigate(`/family-vault/${data.id}`);
    } catch (error) {
      console.error('Error creating vault:', error);
      toast({
        title: "Creation failed",
        description: "Failed to create vault. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return vaultData.vault_name.trim().length > 0;
      case 2:
        return true; // Optional fields
      case 3:
        return true; // Optional photo
      case 4:
        return true;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="vault_name">Vault Name *</Label>
              <Input
                id="vault_name"
                placeholder="e.g., The Smith Family Legacy"
                value={vaultData.vault_name}
                onChange={(e) => setVaultData(prev => ({ ...prev, vault_name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Tell future generations about your family's story..."
                value={vaultData.description}
                onChange={(e) => setVaultData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="family_motto">Family Motto</Label>
              <Input
                id="family_motto"
                placeholder="e.g., Together we rise, together we thrive"
                value={vaultData.family_motto}
                onChange={(e) => setVaultData(prev => ({ ...prev, family_motto: e.target.value }))}
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
                {vaultData.family_values.map((value, index) => (
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
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Vault Photo</Label>
              <p className="text-sm text-muted-foreground">
                Upload a photo that represents your family. This will be displayed on your vault.
              </p>
              {vaultData.vault_photo_url ? (
                <div className="space-y-4">
                  <img
                    src={vaultData.vault_photo_url}
                    alt="Vault photo"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    variant="outline"
                    onClick={() => setVaultData(prev => ({ ...prev, vault_photo_url: '' }))}
                  >
                    Remove Photo
                  </Button>
                </div>
              ) : (
                <FileUpload
                  onFileChange={handlePhotoUpload}
                  accept="image/*"
                  maxSize={5 * 1024 * 1024} // 5MB
                  className="w-full"
                />
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Review Your Vault</h3>
              <p className="text-muted-foreground">
                Make sure everything looks correct before creating your vault.
              </p>
            </div>
            
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h4 className="font-medium">Vault Name</h4>
                  <p className="text-muted-foreground">{vaultData.vault_name}</p>
                </div>
                
                {vaultData.description && (
                  <div>
                    <h4 className="font-medium">Description</h4>
                    <p className="text-muted-foreground">{vaultData.description}</p>
                  </div>
                )}
                
                {vaultData.family_motto && (
                  <div>
                    <h4 className="font-medium">Family Motto</h4>
                    <p className="text-muted-foreground italic">"{vaultData.family_motto}"</p>
                  </div>
                )}
                
                {vaultData.family_values.length > 0 && (
                  <div>
                    <h4 className="font-medium">Family Values</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {vaultData.family_values.map((value, index) => (
                        <Badge key={index} variant="secondary">{value}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {vaultData.vault_photo_url && (
                  <div>
                    <h4 className="font-medium">Vault Photo</h4>
                    <img
                      src={vaultData.vault_photo_url}
                      alt="Vault photo"
                      className="w-32 h-32 object-cover rounded-lg mt-2"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/family-vault')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Vaults
        </Button>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
          <Heart className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">Create Family Vault</span>
        </div>
        <h1 className="text-3xl font-bold">Create Your Legacy Vault</h1>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className={`flex flex-col items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === step.number
                  ? 'bg-primary text-primary-foreground'
                  : currentStep > step.number
                  ? 'bg-green-500 text-white'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {currentStep > step.number ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  step.number
                )}
              </div>
              <div className="text-center mt-2">
                <p className="text-xs font-medium">{step.title}</p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-px mx-4 ${
                currentStep > step.number ? 'bg-green-500' : 'bg-muted'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {currentStep === 1 && <Heart className="h-5 w-5" />}
            {currentStep === 2 && <Users className="h-5 w-5" />}
            {currentStep === 3 && <Camera className="h-5 w-5" />}
            {currentStep === 4 && <CheckCircle className="h-5 w-5" />}
            {steps[currentStep - 1].title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderStep()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>
        
        {currentStep < steps.length ? (
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="gap-2"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={createVault}
            disabled={loading || !canProceed()}
            className="gap-2"
          >
            {loading ? 'Creating...' : 'Create Vault'}
            <Heart className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}