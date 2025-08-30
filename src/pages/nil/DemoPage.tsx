import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, RotateCcw, CheckCircle2, Users, FileText, DollarSign, Package } from 'lucide-react';
import { loadNilFixtures, getNilSnapshot, clearNilFixtures } from '@/fixtures/fixtures.nil';
import { toast } from 'sonner';
import { GoldButton, GoldOutlineButton } from '@/components/ui/brandButtons';
import NilReceiptsStrip from '@/components/nil/NilReceiptsStrip';

export default function NILDemoPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [snapshot, setSnapshot] = useState(getNilSnapshot());

  const handleResetDemo = async (profile: 'coach' | 'mom') => {
    setLoading(true);
    try {
      const result = await loadNilFixtures(profile);
      setSnapshot(result);
      toast.success(`NIL Demo loaded for ${profile} persona`, {
        description: `Created ${result.counts.invites} invites, ${result.counts.receipts} receipts, and ${result.counts.education} education modules`
      });
    } catch (error) {
      console.error('Failed to load NIL fixtures:', error);
      toast.error('Failed to load demo fixtures');
    } finally {
      setLoading(false);
    }
  };

  const handleClearDemo = () => {
    clearNilFixtures();
    setSnapshot(null);
    toast.success('NIL Demo cleared');
  };

  const goToMarketplace = () => {
    navigate('/nil');
  };

  return (
    <div className="min-h-screen bg-bfo-black text-white">
      <div className="max-w-4xl mx-auto space-y-6 py-8 px-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">NIL Demo Controls</h1>
            <p className="text-white/70 mt-2">
              Load sample data for NIL demonstrations and testing
            </p>
          </div>
          {snapshot && (
            <Badge variant="outline" className="px-3 py-1 border-bfo-gold/40 text-bfo-gold">
              Last loaded: {new Date(snapshot.lastLoaded).toLocaleString()}
            </Badge>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Demo Reset Controls */}
          <Card className="bg-[#24313d] border-bfo-gold/40 rounded-xl">
            <CardHeader className="border-b border-bfo-gold/30">
              <CardTitle className="flex items-center gap-2 text-white font-semibold">
                <RotateCcw className="h-5 w-5 text-bfo-gold" />
                Reset Demo Data
              </CardTitle>
              <CardDescription className="text-white/70">
                Load fixtures for different persona scenarios
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <GoldButton 
                onClick={() => handleResetDemo('coach')}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Loading...' : 'Reset NIL Demo (Coach)'}
              </GoldButton>
              
              <GoldOutlineButton 
                onClick={() => handleResetDemo('mom')}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Loading...' : 'Reset NIL Demo (Mom/Guardian)'}
              </GoldOutlineButton>

              <Separator className="bg-bfo-gold/30" />

              <GoldOutlineButton 
                onClick={handleClearDemo}
                className="w-full"
              >
                Clear NIL Demo
              </GoldOutlineButton>
            </CardContent>
          </Card>

          {/* Current Status */}
          <Card className="bg-[#24313d] border-bfo-gold/40 rounded-xl">
            <CardHeader className="border-b border-bfo-gold/30">
              <CardTitle className="flex items-center gap-2 text-white font-semibold">
                <CheckCircle2 className="h-5 w-5 text-bfo-gold" />
                Demo Status
              </CardTitle>
              <CardDescription className="text-white/70">
                Current state of NIL demo data
              </CardDescription>
            </CardHeader>
            <CardContent>
              {snapshot ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-white">Profile:</span>
                    <Badge variant="secondary" className="bg-bfo-gold/20 text-bfo-gold border-bfo-gold/30">
                      {snapshot.profile}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-bfo-gold" />
                      <span className="text-sm text-white">Invites: {snapshot.counts.invites}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-bfo-gold" />
                      <span className="text-sm text-white">Receipts: {snapshot.counts.receipts}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-bfo-gold" />
                      <span className="text-sm text-white">Education: {snapshot.counts.education}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-bfo-gold" />
                      <span className="text-sm text-white">Offers: {snapshot.counts.offers}</span>
                    </div>
                  </div>

                  <Separator className="bg-bfo-gold/30" />

                  <GoldOutlineButton 
                    onClick={goToMarketplace}
                    className="w-full"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Go to NIL → Marketplace
                  </GoldOutlineButton>
                </div>
              ) : (
                <div className="text-center py-8 text-white/50">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No demo data loaded</p>
                  <p className="text-sm">Use the reset buttons to load sample data</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Demo Tips */}
        {snapshot && (
          <Card className="bg-[#24313d] border-bfo-gold/40 rounded-xl">
            <CardHeader className="border-b border-bfo-gold/30">
              <CardTitle className="text-white font-semibold">Demo Tips</CardTitle>
              <CardDescription className="text-white/70">
                Key features to demonstrate after loading fixtures
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="flex items-start gap-3 p-4 border border-bfo-gold/30 rounded-lg bg-bfo-black/30">
                  <Users className="h-5 w-5 text-blue-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-white">Send an invite</p>
                    <p className="text-sm text-white/70">
                      Invite becomes "pending" status
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 border border-bfo-gold/30 rounded-lg bg-bfo-black/30">
                  <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-white">Education</p>
                    <p className="text-sm text-white/70">
                      Already complete (3/3 modules)
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 border border-bfo-gold/30 rounded-lg bg-bfo-black/30">
                  <FileText className="h-5 w-5 text-purple-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-white">Create/preview offer</p>
                    <p className="text-sm text-white/70">
                      Generates a receipt (🔒 content-free)
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <NilReceiptsStrip />
    </div>
  );
}