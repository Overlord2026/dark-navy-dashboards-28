import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PremiumPlaceholder } from '@/components/premium/PremiumPlaceholder';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, FileText, Video, Calendar, Shield, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FamilyVault {
  id: string;
  vault_name: string;
  description: string;
  vault_photo_url: string;
  family_motto: string;
  family_values: string[];
  member_count: number;
  item_count: number;
  created_at: string;
}

export default function FamilyLegacyVault() {
  const [vaults, setVaults] = useState<FamilyVault[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadVaults();
  }, []);

  const loadVaults = async () => {
    try {
      const { data: vaultsData, error } = await supabase
        .from('family_vaults')
        .select(`
          *,
          vault_members(count),
          legacy_items(count)
        `)
        .eq('is_active', true);

      if (error) throw error;

      const formattedVaults = vaultsData?.map(vault => ({
        ...vault,
        member_count: vault.vault_members?.[0]?.count || 0,
        item_count: vault.legacy_items?.[0]?.count || 0
      })) || [];

      setVaults(formattedVaults);
    } catch (error) {
      console.error('Error loading vaults:', error);
      toast({
        title: "Error",
        description: "Failed to load family vaults",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createNewVault = () => {
    navigate('/family-vault/create');
  };

  const openVault = (vaultId: string) => {
    navigate(`/family-vault/${vaultId}`);
  };

  return (
    <PremiumPlaceholder
      featureId="family-legacy-vault"
      featureName="Family Legacy Vault™"
    >
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
            <Heart className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Preserve Your Legacy</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Family Legacy Vault</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create secure digital time capsules for your family. Share wisdom, stories, and memories 
            across generations with bank-grade security and thoughtful delivery triggers.
          </p>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Bank-Grade Security</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                AES-256 encryption, role-based access, and secure delivery systems protect your most precious memories.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Smart Delivery</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Schedule messages for birthdays, graduations, or life events. Set trusted executor triggers.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Rich Media</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Record video messages, upload photos, and create multimedia legacy stories for future generations.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Vaults Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-foreground">Your Family Vaults</h2>
            <Button onClick={createNewVault} className="gap-2">
              <Plus className="h-4 w-4" />
              Create New Vault
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded"></div>
                      <div className="h-3 bg-muted rounded w-4/5"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : vaults.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="space-y-4">
                <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Create Your First Family Vault</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Start preserving your family's stories, wisdom, and memories for future generations. 
                  Your legacy begins with a single story.
                </p>
                <Button onClick={createNewVault} size="lg" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Family Vault
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vaults.map((vault) => (
                <Card key={vault.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => openVault(vault.id)}>
                  <CardHeader>
                    {vault.vault_photo_url && (
                      <div className="mb-3 rounded-lg overflow-hidden">
                        <img 
                          src={vault.vault_photo_url} 
                          alt={vault.vault_name}
                          className="w-full h-32 object-cover"
                        />
                      </div>
                    )}
                    <CardTitle className="text-lg">{vault.vault_name}</CardTitle>
                    {vault.family_motto && (
                      <p className="text-sm italic text-muted-foreground">"{vault.family_motto}"</p>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {vault.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{vault.description}</p>
                    )}
                    
                    <div className="flex flex-wrap gap-2">
                      {vault.family_values?.slice(0, 3).map((value, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {value}
                        </Badge>
                      ))}
                      {vault.family_values?.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{vault.family_values.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{vault.member_count} members</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        <span>{vault.item_count} items</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Demo Content Section */}
        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Inspiration Gallery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              See examples of meaningful legacy content to inspire your own family stories.
            </p>
            <Button variant="outline" onClick={() => navigate('/family-vault/demo')}>
              View Sample Stories
            </Button>
          </CardContent>
        </Card>
      </div>
    </PremiumPlaceholder>
  );
}