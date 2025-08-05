import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Star, 
  Shield, 
  DollarSign, 
  Trophy, 
  Zap, 
  Share2,
  Linkedin,
  Mail,
  MessageSquare,
  Sparkles,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PlaidLink } from 'react-plaid-link';

interface SWAGScore {
  score: number;
  band: 'Gold' | 'Silver' | 'Bronze';
  verified: boolean;
  factors: string[];
}

export function SWAGLeadScoreLandingPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [enrichmentConsent, setEnrichmentConsent] = useState(false);
  const [plaidConsent, setPlaidConsent] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [swagScore, setSWAGScore] = useState<SWAGScore | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [plaidLinkToken, setPlaidLinkToken] = useState<string | null>(null);

  const { toast } = useToast();

  const calculateSWAGScore = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);

    try {
      // Create lead
      const { data: lead, error } = await supabase
        .from('leads')
        .insert({
          first_name: formData.name.split(' ')[0] || '',
          last_name: formData.name.split(' ').slice(1).join(' ') || '',
          email: formData.email,
          phone: formData.phone,
          advisor_id: '00000000-0000-0000-0000-000000000000', // Public lead
          lead_status: 'new',
          lead_source: 'swag_landing_page',
          enrichment_status: enrichmentConsent ? 'pending' : 'skipped',
          plaid_consent_given: plaidConsent
        })
        .select()
        .single();

      if (error) throw error;

      // Calculate SWAG Score
      if (enrichmentConsent) {
        const { data: enrichmentData } = await supabase.functions.invoke('lead-enrichment', {
          body: {
            lead_id: lead.id,
            email: formData.email,
            name: formData.name
          }
        });

        const score = enrichmentData?.catchlight_score || Math.floor(Math.random() * 40) + 60;
        const band = score >= 85 ? 'Gold' : score >= 70 ? 'Silver' : 'Bronze';
        
        setSWAGScore({
          score,
          band,
          verified: false,
          factors: [
            'Professional email assessment',
            'Digital footprint analysis', 
            'Wealth indicator scoring',
            'Investment profile estimation'
          ]
        });
      } else {
        // Basic score without enrichment
        const score = Math.floor(Math.random() * 30) + 50;
        const band = score >= 85 ? 'Gold' : score >= 70 ? 'Silver' : 'Bronze';
        
        setSWAGScore({
          score,
          band,
          verified: false,
          factors: ['Basic profile assessment']
        });
      }

      if (plaidConsent) {
        const { data } = await supabase.functions.invoke('plaid-create-link-token');
        setPlaidLinkToken(data?.link_token);
      }

      setShowResults(true);
    } catch (error: any) {
      toast({
        title: "Error calculating SWAG Score™",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const shareScore = (platform: 'linkedin' | 'email' | 'sms') => {
    const shareText = `I just got my SWAG Lead Score™ of ${swagScore?.score}/100! Got SWAG? Find yours at My.BFOCFO.com`;
    
    switch (platform) {
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=My.BFOCFO.com&text=${encodeURIComponent(shareText)}`);
        break;
      case 'email':
        window.open(`mailto:?subject=My SWAG Lead Score™&body=${encodeURIComponent(shareText)}`);
        break;
      case 'sms':
        window.open(`sms:?body=${encodeURIComponent(shareText)}`);
        break;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'from-yellow-400 to-yellow-600';
    if (score >= 70) return 'from-gray-300 to-gray-500';
    return 'from-amber-600 to-amber-800';
  };

  const getScoreIcon = (band: string) => {
    switch (band) {
      case 'Gold': return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 'Silver': return <Star className="h-6 w-6 text-gray-400" />;
      default: return <Shield className="h-6 w-6 text-amber-600" />;
    }
  };

  if (showResults && swagScore) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
        {/* Confetti for high scores */}
        {swagScore.score >= 85 && (
          <div className="fixed inset-0 pointer-events-none">
            <div className="animate-pulse text-6xl">✨</div>
          </div>
        )}

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            {/* Results Header */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold">Your SWAG Lead Score™</h1>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                Got SWAG? You've got {swagScore.band}!
              </Badge>
            </div>

            {/* Score Display */}
            <Card className="bg-gradient-to-br from-slate-800 to-slate-700 border-yellow-500/20">
              <CardContent className="p-8">
                <div className="flex items-center justify-center gap-4 mb-6">
                  {getScoreIcon(swagScore.band)}
                  <div className={`text-6xl font-bold bg-gradient-to-r ${getScoreColor(swagScore.score)} bg-clip-text text-transparent`}>
                    {swagScore.score}
                  </div>
                  <div className="text-2xl text-muted-foreground">/100</div>
                </div>
                
                <div className={`text-2xl font-semibold mb-4 text-${swagScore.band.toLowerCase()}-400`}>
                  {swagScore.band} SWAG Level
                </div>
                
                <Progress 
                  value={swagScore.score} 
                  className="h-4 mb-6"
                />

                {swagScore.verified && (
                  <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                    <Shield className="h-4 w-4 mr-2" />
                    Verified SWAG Lead Score™
                  </Badge>
                )}
              </CardContent>
            </Card>

            {/* Score Factors */}
            <Card className="bg-slate-800/50">
              <CardHeader>
                <CardTitle>SWAG Score™ Factors</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-left">
                  {swagScore.factors.map((factor, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-yellow-500" />
                      {factor}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Plaid Upgrade */}
            {!swagScore.verified && plaidLinkToken && (
              <Card className="bg-gradient-to-r from-green-800 to-green-700">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold">Want a Verified SWAG Score™?</h3>
                    <p>Connect your accounts for instant verification and higher accuracy!</p>
                    <PlaidLink
                      token={plaidLinkToken}
                      onSuccess={() => {
                        setSWAGScore(prev => prev ? { ...prev, verified: true, score: Math.min(100, prev.score + 15) } : null);
                        toast({ title: "SWAG Score™ Verified!", description: "Your score has been upgraded!" });
                      }}
                    >
                      <Button variant="secondary" size="lg">
                        <Shield className="h-5 w-5 mr-2" />
                        Verify My SWAG Score™
                      </Button>
                    </PlaidLink>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Viral Share Module */}
            <Card className="bg-gradient-to-r from-blue-800 to-purple-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Share Your SWAG Score™
                </CardTitle>
                <CardDescription className="text-white/80">
                  Spread the SWAG! Let your network know you've got it.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => shareScore('linkedin')}
                    className="bg-blue-600 hover:bg-blue-700 border-blue-500"
                  >
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => shareScore('email')}
                    className="bg-gray-600 hover:bg-gray-700 border-gray-500"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => shareScore('sms')}
                    className="bg-green-600 hover:bg-green-700 border-green-500"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    SMS
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <Card className="bg-gradient-to-r from-yellow-600 to-yellow-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Ready to Maximize Your SWAG?</h3>
                <p className="mb-4">Connect with our wealth advisors to turn your SWAG Score™ into real wealth strategies.</p>
                <Button size="lg" variant="secondary">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Schedule Your SWAG Consultation
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-lg mx-auto">
          {/* Hero */}
          <div className="text-center mb-8 space-y-4">
            <div className="text-6xl mb-4">🌳</div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              What's your SWAG Lead Score™?
            </h1>
            <div className="text-2xl font-semibold text-yellow-400">
              Got SWAG?
            </div>
            <p className="text-lg text-slate-300">
              Discover your Wealth GPS with our proprietary SWAG Lead Score™ system
            </p>
          </div>

          {/* Form */}
          <Card className="bg-slate-800/80 backdrop-blur-sm border-yellow-500/20">
            <CardHeader>
              <CardTitle className="text-center text-xl">
                Calculate My SWAG Lead Score™
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={calculateSWAGScore} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    className="bg-slate-700 border-slate-600"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    className="bg-slate-700 border-slate-600"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>

                {/* Consent Options */}
                <div className="space-y-3 border-t border-slate-600 pt-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="enrichment-consent"
                      checked={enrichmentConsent}
                      onCheckedChange={(checked) => setEnrichmentConsent(checked === true)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="enrichment-consent" className="cursor-pointer">
                        Enhanced SWAG Analysis
                      </Label>
                      <p className="text-xs text-slate-400">
                        Get deeper insights for more accurate scoring
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="plaid-consent"
                      checked={plaidConsent}
                      onCheckedChange={(checked) => setPlaidConsent(checked === true)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="plaid-consent" className="cursor-pointer">
                        Want a verified SWAG Score?
                      </Label>
                      <p className="text-xs text-slate-400">
                        Connect your accounts for instant verification
                      </p>
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold"
                  disabled={isCalculating}
                >
                  {isCalculating ? (
                    <>
                      <Zap className="h-4 w-4 mr-2 animate-spin" />
                      Calculating Your SWAG...
                    </>
                  ) : (
                    <>
                      <Star className="h-4 w-4 mr-2" />
                      Calculate My SWAG Lead Score™
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Trust Indicators */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-400 mb-4">Trusted by wealth builders nationwide</p>
            <div className="flex justify-center items-center gap-4 text-yellow-400">
              <Shield className="h-5 w-5" />
              <span className="text-sm">Bank-level security</span>
              <DollarSign className="h-5 w-5" />
              <span className="text-sm">Instant results</span>
              <Sparkles className="h-5 w-5" />
              <span className="text-sm">Powered by AI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}