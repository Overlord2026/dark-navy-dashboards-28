import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Facebook, AlertCircle, CheckCircle2, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function SocialSettingsPage() {
  const [facebookToken, setFacebookToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasExistingToken, setHasExistingToken] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkExistingToken();
  }, []);

  const checkExistingToken = async () => {
    try {
      const { data, error } = await supabase
        .from('credentials')
        .select('id, credential_name, created_at')
        .eq('credential_type', 'facebook_page_token')
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      setHasExistingToken(!!data);
    } catch (error) {
      console.error('Error checking existing token:', error);
    }
  };

  const handleSaveToken = async () => {
    if (!facebookToken.trim()) {
      toast({
        title: "Token Required",
        description: "Please enter a Facebook Page Access Token",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // In a real implementation, this would encrypt the token
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('credentials') 
        .upsert({
          user_id: user.id,
          credential_type: 'facebook_page_token',
          credential_name: 'Facebook Page Access Token',
          encrypted_token: facebookToken, // In production: encrypt this!
          metadata: {
            created_via: 'advisor_platform',
            purpose: 'lead_enrichment'
          }
        }, {
          onConflict: 'user_id,credential_type'
        });

      if (error) throw error;

      toast({
        title: "Token Saved",
        description: "Facebook Page Access Token has been saved securely",
      });
      
      setFacebookToken('');
      setHasExistingToken(true);
    } catch (error) {
      console.error('Error saving token:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save Facebook token. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteToken = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('credentials')
        .delete()
        .eq('credential_type', 'facebook_page_token');

      if (error) throw error;

      toast({
        title: "Token Deleted",
        description: "Facebook Page Access Token has been removed",
      });
      
      setHasExistingToken(false);
    } catch (error) {
      console.error('Error deleting token:', error);
      toast({
        title: "Delete Failed", 
        description: "Failed to delete Facebook token. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Social Settings | Advisor Platform</title>
        <meta name="description" content="Configure social media integrations for lead enrichment and marketing automation" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Facebook className="w-6 h-6 text-blue-600" />
              Social Media Settings
            </h1>
            <p className="text-muted-foreground">
              Configure social media integrations for enhanced lead management
            </p>
          </div>
        </div>

        {/* Facebook Integration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Facebook className="w-5 h-5 text-blue-600" />
                Facebook Page Integration
              </div>
              {hasExistingToken && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Connected
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-900 mb-1">Temporary MVP Setup</h3>
                  <p className="text-sm text-blue-700 mb-2">
                    This is a temporary solution for storing your Facebook Page Access Token. 
                    We'll use this to backfill and enrich lead data from your Facebook campaigns.
                  </p>
                  <p className="text-xs text-blue-600">
                    ⚠️ For production use, tokens should be encrypted and managed through Facebook's official integration flow.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="facebook-token">Facebook Page Access Token</Label>
                <Textarea
                  id="facebook-token"
                  placeholder="Paste your long-lived Facebook Page Access Token here..."
                  value={facebookToken}
                  onChange={(e) => setFacebookToken(e.target.value)}
                  className="mt-1 min-h-[100px] font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This token will be stored securely and used for lead enrichment and campaign data backfill.
                </p>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleSaveToken}
                  disabled={loading || !facebookToken.trim()}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Saving...' : 'Save Token'}
                </Button>
                
                {hasExistingToken && (
                  <Button 
                    variant="outline"
                    onClick={handleDeleteToken}
                    disabled={loading}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete Token
                  </Button>
                )}
              </div>
            </div>

            {hasExistingToken && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-green-900 mb-1">Token Active</h3>
                    <p className="text-sm text-green-700">
                      Your Facebook Page Access Token is stored and ready for lead enrichment processes.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Future Integrations */}
        <Card className="opacity-50">
          <CardHeader>
            <CardTitle className="text-muted-foreground">
              Future Social Integrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg border-dashed">
                <h3 className="font-medium text-muted-foreground">LinkedIn Sales Navigator</h3>
                <p className="text-sm text-muted-foreground mt-1">Coming Soon</p>
              </div>
              <div className="p-4 border rounded-lg border-dashed">
                <h3 className="font-medium text-muted-foreground">Google Ads Integration</h3>
                <p className="text-sm text-muted-foreground mt-1">Coming Soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}