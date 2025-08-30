import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, RotateCcw, CheckCircle2, Users, FileText, DollarSign, Package } from 'lucide-react';
import { loadNilFixtures, getNilSnapshot, clearNilFixtures } from '@/fixtures/fixtures.nil';
import { toast } from 'sonner';
import NILLayout from '@/components/nil/NILLayout';

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
    <NILLayout 
      title="NIL Demo Controls" 
      description="Reset and manage NIL demo data for presentations"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">NIL Demo Controls</h1>
            <p className="text-muted-foreground mt-2">
              Load sample data for NIL demonstrations and testing
            </p>
          </div>
          {snapshot && (
            <Badge variant="outline" className="px-3 py-1">
              Last loaded: {new Date(snapshot.lastLoaded).toLocaleString()}
            </Badge>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Demo Reset Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5" />
                Reset Demo Data
              </CardTitle>
              <CardDescription>
                Load fixtures for different persona scenarios
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => handleResetDemo('coach')}
                disabled={loading}
                className="w-full"
                variant="default"
              >
                {loading ? 'Loading...' : 'Reset NIL Demo (Coach)'}
              </Button>
              
              <Button 
                onClick={() => handleResetDemo('mom')}
                disabled={loading}
                className="w-full"
                variant="secondary"
              >
                {loading ? 'Loading...' : 'Reset NIL Demo (Mom/Guardian)'}
              </Button>

              <Separator />

              <Button 
                onClick={handleClearDemo}
                variant="outline"
                className="w-full"
              >
                Clear NIL Demo
              </Button>
            </CardContent>
          </Card>

          {/* Current Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Demo Status
              </CardTitle>
              <CardDescription>
                Current state of NIL demo data
              </CardDescription>
            </CardHeader>
            <CardContent>
              {snapshot ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Profile:</span>
                    <Badge variant="secondary">{snapshot.profile}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Invites: {snapshot.counts.invites}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Receipts: {snapshot.counts.receipts}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Education: {snapshot.counts.education}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Offers: {snapshot.counts.offers}</span>
                    </div>
                  </div>

                  <Separator />

                  <Button 
                    onClick={goToMarketplace}
                    className="w-full"
                    variant="outline"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Go to NIL → Marketplace
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
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
          <Card>
            <CardHeader>
              <CardTitle>Demo Tips</CardTitle>
              <CardDescription>
                Key features to demonstrate after loading fixtures
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <Users className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Send an invite</p>
                    <p className="text-sm text-muted-foreground">
                      Invite becomes "pending" status
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Education</p>
                    <p className="text-sm text-muted-foreground">
                      Already complete (3/3 modules)
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <FileText className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Create/preview offer</p>
                    <p className="text-sm text-muted-foreground">
                      Generates a receipt (🔒 content-free)
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </NILLayout>
  );
}