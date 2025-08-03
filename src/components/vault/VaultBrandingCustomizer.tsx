import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Image as ImageIcon, 
  Palette, 
  Heart, 
  Quote,
  Eye,
  Save,
  RefreshCw,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface VaultBranding {
  coverPhotoUrl?: string;
  familyMotto?: string;
  familyValues: string[];
  primaryColor: string;
  secondaryColor: string;
  fontStyle: 'classic' | 'modern' | 'elegant' | 'playful';
  description?: string;
}

interface VaultBrandingCustomizerProps {
  vaultId: string;
  currentBranding: VaultBranding;
  onSave: (branding: VaultBranding) => Promise<boolean>;
}

const colorPresets = [
  { name: 'Classic Gold', primary: '#D4AF37', secondary: '#F4E4A6' },
  { name: 'Royal Blue', primary: '#1E3A8A', secondary: '#93C5FD' },
  { name: 'Emerald Green', primary: '#059669', secondary: '#A7F3D0' },
  { name: 'Deep Purple', primary: '#7C3AED', secondary: '#C4B5FD' },
  { name: 'Warm Copper', primary: '#CD7F32', secondary: '#FED7AA' },
  { name: 'Navy & Silver', primary: '#1E293B', secondary: '#E2E8F0' }
];

const fontStyles = [
  { id: 'classic', name: 'Classic', style: 'font-serif' },
  { id: 'modern', name: 'Modern', style: 'font-sans' },
  { id: 'elegant', name: 'Elegant', style: 'font-serif italic' },
  { id: 'playful', name: 'Playful', style: 'font-sans font-medium' }
];

export function VaultBrandingCustomizer({ vaultId, currentBranding, onSave }: VaultBrandingCustomizerProps) {
  const [branding, setBranding] = useState<VaultBranding>(currentBranding);
  const [newValue, setNewValue] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleCoverPhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real implementation, this would upload to storage
      const reader = new FileReader();
      reader.onload = (e) => {
        setBranding(prev => ({
          ...prev,
          coverPhotoUrl: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addFamilyValue = () => {
    if (newValue.trim() && !branding.familyValues.includes(newValue.trim())) {
      setBranding(prev => ({
        ...prev,
        familyValues: [...prev.familyValues, newValue.trim()]
      }));
      setNewValue('');
    }
  };

  const removeFamilyValue = (valueToRemove: string) => {
    setBranding(prev => ({
      ...prev,
      familyValues: prev.familyValues.filter(value => value !== valueToRemove)
    }));
  };

  const handleColorPresetSelect = (preset: typeof colorPresets[0]) => {
    setBranding(prev => ({
      ...prev,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const success = await onSave(branding);
      if (success) {
        toast({
          title: "Branding Updated",
          description: "Your vault's branding has been saved successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save branding changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const resetToDefaults = () => {
    setBranding({
      coverPhotoUrl: '',
      familyMotto: '',
      familyValues: [],
      primaryColor: '#D4AF37',
      secondaryColor: '#F4E4A6',
      fontStyle: 'classic',
      description: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Vault Branding</h2>
          <p className="text-muted-foreground">
            Customize the look and feel of your family vault to reflect your unique identity.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            {isPreviewMode ? 'Exit Preview' : 'Preview'}
          </Button>
          
          <Button
            variant="outline"
            onClick={resetToDefaults}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Reset
          </Button>
          
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {isPreviewMode ? (
        // Preview Mode
        <Card className="overflow-hidden">
          <div 
            className="h-48 bg-gradient-to-r flex items-center justify-center relative"
            style={{
              background: branding.coverPhotoUrl 
                ? `url(${branding.coverPhotoUrl}) center/cover`
                : `linear-gradient(135deg, ${branding.primaryColor}, ${branding.secondaryColor})`
            }}
          >
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative text-center text-white">
              <h1 className={cn("text-4xl font-bold mb-2", 
                fontStyles.find(f => f.id === branding.fontStyle)?.style
              )}>
                Family Legacy Vault
              </h1>
              {branding.familyMotto && (
                <p className={cn("text-lg opacity-90",
                  fontStyles.find(f => f.id === branding.fontStyle)?.style
                )}>
                  "{branding.familyMotto}"
                </p>
              )}
            </div>
          </div>
          
          <CardContent className="p-6">
            {branding.description && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">About Our Family</h3>
                <p className="text-muted-foreground">{branding.description}</p>
              </div>
            )}
            
            {branding.familyValues.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Our Family Values</h3>
                <div className="flex flex-wrap gap-2">
                  {branding.familyValues.map((value, index) => (
                    <Badge 
                      key={index} 
                      variant="outline"
                      style={{ 
                        borderColor: branding.primaryColor,
                        color: branding.primaryColor 
                      }}
                    >
                      {value}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        // Edit Mode
        <div className="grid gap-6">
          {/* Cover Photo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Cover Photo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Upload Cover Photo</Label>
                <div className="flex items-center gap-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverPhotoUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Choose Image
                  </Button>
                  {branding.coverPhotoUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setBranding(prev => ({ ...prev, coverPhotoUrl: '' }))}
                      className="gap-2"
                    >
                      <X className="h-4 w-4" />
                      Remove
                    </Button>
                  )}
                </div>
                {branding.coverPhotoUrl && (
                  <div className="mt-4">
                    <img
                      src={branding.coverPhotoUrl}
                      alt="Cover preview"
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Family Identity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Family Identity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="motto">Family Motto</Label>
                <div className="relative">
                  <Quote className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="motto"
                    placeholder="Enter your family motto or guiding principle"
                    value={branding.familyMotto}
                    onChange={(e) => setBranding(prev => ({ ...prev, familyMotto: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Family Description</Label>
                <Textarea
                  id="description"
                  placeholder="Tell the story of your family..."
                  value={branding.description}
                  onChange={(e) => setBranding(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Family Values</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a family value"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addFamilyValue()}
                  />
                  <Button onClick={addFamilyValue} disabled={!newValue.trim()}>
                    Add
                  </Button>
                </div>
                {branding.familyValues.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {branding.familyValues.map((value, index) => (
                      <Badge key={index} variant="outline" className="gap-2">
                        {value}
                        <button
                          onClick={() => removeFamilyValue(value)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Color Scheme */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Color Scheme
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-3 block">Color Presets</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {colorPresets.map((preset) => (
                    <Card 
                      key={preset.name}
                      className={cn(
                        "cursor-pointer transition-all",
                        branding.primaryColor === preset.primary && "ring-2 ring-offset-2 ring-primary"
                      )}
                      onClick={() => handleColorPresetSelect(preset)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="flex">
                            <div 
                              className="w-6 h-6 rounded-l"
                              style={{ backgroundColor: preset.primary }}
                            />
                            <div 
                              className="w-6 h-6 rounded-r"
                              style={{ backgroundColor: preset.secondary }}
                            />
                          </div>
                          <span className="text-sm font-medium">{preset.name}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="primary-color"
                      type="color"
                      value={branding.primaryColor}
                      onChange={(e) => setBranding(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={branding.primaryColor}
                      onChange={(e) => setBranding(prev => ({ ...prev, primaryColor: e.target.value }))}
                      placeholder="#D4AF37"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondary-color">Secondary Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="secondary-color"
                      type="color"
                      value={branding.secondaryColor}
                      onChange={(e) => setBranding(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={branding.secondaryColor}
                      onChange={(e) => setBranding(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      placeholder="#F4E4A6"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Typography */}
          <Card>
            <CardHeader>
              <CardTitle>Typography</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Font Style</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {fontStyles.map((font) => (
                    <Card 
                      key={font.id}
                      className={cn(
                        "cursor-pointer transition-all",
                        branding.fontStyle === font.id && "ring-2 ring-offset-2 ring-primary"
                      )}
                      onClick={() => setBranding(prev => ({ ...prev, fontStyle: font.id as VaultBranding['fontStyle'] }))}
                    >
                      <CardContent className="p-4 text-center">
                        <div className={cn("text-lg mb-1", font.style)}>Aa</div>
                        <div className="text-xs text-muted-foreground">{font.name}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}