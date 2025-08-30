import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, RotateCcw, CheckCircle2, Users, FileText, DollarSign, Package } from 'lucide-react';
import { loadNilFixtures, getNilSnapshot, clearNilFixtures, forceResetNilFixtures, getNilFixturesHealth } from '@/fixtures/fixtures.nil';
import { listReceipts } from '@/features/receipts/record';
import { toast } from 'sonner';
import { GoldButton, GoldOutlineButton } from '@/components/ui/brandButtons';
import NilReceiptsStrip from '@/components/nil/NilReceiptsStrip';

export default function NILDemoPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [snapshot, setSnapshot] = useState(getNilSnapshot());
  const [health, setHealth] = useState(getNilFixturesHealth());

  const handleResetDemo = async (profile: 'coach' | 'mom') => {
    setLoading(true);
    try {
      const result = await loadNilFixtures(profile);
      setSnapshot(result);
      setHealth(getNilFixturesHealth());
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
    setHealth(getNilFixturesHealth());
    toast.success('NIL Demo cleared');
  };

  const handleForceReset = () => {
    forceResetNilFixtures();
    setSnapshot(null);
    setHealth(getNilFixturesHealth());
    toast.success('NIL Demo force reset completed', {
      description: 'All caches cleared and state reset'
    });
  };

  const goToMarketplace = () => {
    navigate('/nil');
  };

  // Analytics calculations
  const getAnalytics = () => {
    const receipts = listReceipts();
    const anchoredCount = receipts.filter(r => r.anchor_ref?.accepted || r.anchor_ref?.status === 'anchored').length;
    const totalReceipts = receipts.length;
    
    return {
      invitesPending: snapshot?.counts.invites || 0,
      modulesCompleted: snapshot?.counts.education || 0,
      offersCreated: snapshot?.counts.offers || 0,
      catalogClicks: snapshot?.counts.catalog || 0,
      receiptsTotal: totalReceipts,
      receiptsAnchored: anchoredCount,
      healthyStatus: totalReceipts >= 3 && anchoredCount >= 1
    };
  };

  const analytics = getAnalytics();

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
          <div className="flex items-center space-x-2">
            {health.isUsingFallback && (
              <Badge variant="outline" className="border-orange-500/40 text-orange-400">
                Fallback Mode
              </Badge>
            )}
            {health.skipAnchoring && (
              <Badge variant="outline" className="border-blue-500/40 text-blue-400">
                No Anchoring
              </Badge>
            )}
            {snapshot && (
              <Badge variant="outline" className="px-3 py-1 border-bfo-gold/40 text-bfo-gold">
                Last loaded: {new Date(snapshot.lastLoaded).toLocaleString()}
              </Badge>
            )}
          </div>
        </div>

        {/* Analytics Panel */}
        {snapshot && (
          <Card className="bg-[#24313d] border-bfo-gold/40 rounded-xl">
            <CardHeader className="border-b border-bfo-gold/30">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white font-semibold">NIL Analytics Dashboard</CardTitle>
                <Badge 
                  className={`${
                    analytics.healthyStatus 
                      ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                      : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                  }`}
                >
                  {analytics.healthyStatus ? 'Healthy ✓' : 'Initializing...'}
                </Badge>
              </div>
              <CardDescription className="text-white/70">
                Investor-friendly metrics (content-free, privacy-first)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-bfo-black/30 border border-bfo-gold/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-bfo-gold">{analytics.invitesPending}</p>
                      <p className="text-sm text-white/60">Invites Sent</p>
                    </div>
                    <Users className="h-6 w-6 text-bfo-gold/60" />
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-bfo-black/30 border border-bfo-gold/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-bfo-gold">{analytics.modulesCompleted}</p>
                      <p className="text-sm text-white/60">Modules Done</p>
                    </div>
                    <CheckCircle2 className="h-6 w-6 text-bfo-gold/60" />
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-bfo-black/30 border border-bfo-gold/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-bfo-gold">{analytics.offersCreated}</p>
                      <p className="text-sm text-white/60">Offers Created</p>
                    </div>
                    <DollarSign className="h-6 w-6 text-bfo-gold/60" />
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-bfo-black/30 border border-bfo-gold/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-bfo-gold">{analytics.catalogClicks}</p>
                      <p className="text-sm text-white/60">Catalog Views</p>
                    </div>
                    <Package className="h-6 w-6 text-bfo-gold/60" />
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-bfo-black/30 border border-bfo-gold/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-bfo-gold">{analytics.receiptsTotal}</p>
                      <p className="text-sm text-white/60">Receipts Total</p>
                    </div>
                    <FileText className="h-6 w-6 text-bfo-gold/60" />
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-bfo-black/30 border border-bfo-gold/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-green-400">{analytics.receiptsAnchored}</p>
                      <p className="text-sm text-white/60">Anchored ✓</p>
                    </div>
                    <CheckCircle2 className="h-6 w-6 text-green-400/60" />
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 rounded-lg bg-bfo-gold/10 border border-bfo-gold/30">
                <p className="text-xs text-bfo-gold/80">
                  🛡️ Privacy-first: All metrics are content-free. No PII tracked or stored.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

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

              <GoldOutlineButton 
                onClick={handleForceReset}
                className="w-full border-orange-500/40 text-orange-400 hover:bg-orange-500/10"
              >
                🔄 Force Reset (Clear Caches)
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