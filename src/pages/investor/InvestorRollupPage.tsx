import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  TrendingUp, 
  Users, 
  FileText, 
  CheckCircle2, 
  MousePointerClick, 
  PlayCircle, 
  ExternalLink,
  Award,
  DollarSign,
  Shield
} from 'lucide-react';
import { listReceipts, getReceiptsByType } from '@/features/receipts/record';
// NIL snapshot removed
const nilSnapshot = null;
import { GoldButton, GoldOutlineButton } from '@/components/ui/brandButtons';
import SEOHead from '@/components/seo/SEOHead';

export default function InvestorRollupPage() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({
    nil: { receipts: 0, anchored: 0, ctas: 0, tours: 0, ready: false },
    families: { receipts: 0, anchored: 0, ctas: 0, tours: 0, ready: false },
    advisors: { receipts: 0, anchored: 0, ctas: 0, tours: 0, ready: false }
  });

  const calculateMetrics = () => {
    const allReceipts = listReceipts();
    const anchoredReceipts = allReceipts.filter(r => r.anchor_ref?.accepted || r.anchor_ref?.status === 'anchored');
    
    // NIL metrics (actions with NIL-related content)
    const nilReceipts = allReceipts.filter(r => 
      r.action?.includes('nil') || 
      r.action?.includes('brand') || 
      r.action?.includes('index') ||
      r.action?.includes('escrow') ||
      r.type === 'Settlement-RDS'
    );
    const nilAnchored = anchoredReceipts.filter(r => 
      r.action?.includes('nil') || 
      r.action?.includes('brand') || 
      r.action?.includes('index') ||
      r.action?.includes('escrow') ||
      r.type === 'Settlement-RDS'
    );
    const nilCtas = allReceipts.filter(r => 
      r.action === 'brand.contact' || 
      r.action === 'index.watch' ||
      r.action?.includes('offer')
    );
    
    // Family metrics (general platform usage)
    const familyReceipts = allReceipts.filter(r => 
      r.action?.includes('family') || 
      r.action?.includes('education') ||
      r.action?.includes('profile')
    );
    const familyAnchored = anchoredReceipts.filter(r => 
      r.action?.includes('family') || 
      r.action?.includes('education') ||
      r.action?.includes('profile')
    );
    
    // Advisor metrics (professional features)
    const advisorReceipts = allReceipts.filter(r => 
      r.action?.includes('advisor') || 
      r.action?.includes('cosign') ||
      r.action?.includes('compliance')
    );
    const advisorAnchored = anchoredReceipts.filter(r => 
      r.action?.includes('advisor') || 
      r.action?.includes('cosign') ||
      r.action?.includes('compliance')
    );
    const advisorCtas = allReceipts.filter(r => 
      r.action === 'cosign.request' || 
      r.action === 'cosign.approve'
    );

  // NIL snapshot removed - using null
  const nilSnapshot = null;
    
    return {
      nil: {
        receipts: nilReceipts.length,
        anchored: nilAnchored.length,
        ctas: nilCtas.length,
        tours: nilSnapshot ? 1 : 0,
        ready: nilReceipts.length >= 3 && nilAnchored.length >= 1
      },
      families: {
        receipts: familyReceipts.length,
        anchored: familyAnchored.length,
        ctas: Math.floor(familyReceipts.length * 0.3), // Simulate CTA clicks
        tours: familyReceipts.length > 0 ? 1 : 0,
        ready: familyReceipts.length >= 3 && familyAnchored.length >= 1
      },
      advisors: {
        receipts: advisorReceipts.length,
        anchored: advisorAnchored.length,
        ctas: advisorCtas.length,
        tours: advisorReceipts.length > 0 ? 1 : 0,
        ready: advisorReceipts.length >= 3 && advisorAnchored.length >= 1
      }
    };
  };

  useEffect(() => {
    const updateMetrics = () => {
      setMetrics(calculateMetrics());
    };
    
    updateMetrics();
    
    // Update metrics every 2 seconds to catch real-time changes
    const interval = setInterval(updateMetrics, 2000);
    return () => clearInterval(interval);
  }, []);

  const overallReady = metrics.nil.ready && metrics.families.ready && metrics.advisors.ready;
  const totalReceipts = metrics.nil.receipts + metrics.families.receipts + metrics.advisors.receipts;
  const totalAnchored = metrics.nil.anchored + metrics.families.anchored + metrics.advisors.anchored;

  const handleNilTour = () => {
    navigate('/nil/tour?demo=nil_coach&autoplay=1');
  };

  const handleFamilyDemo = () => {
    navigate('/nil/demo?demo=nil_mom');
  };

  const sectionData = [
    {
      key: 'nil',
      title: 'NIL Platform',
      description: 'Name, Image, Likeness marketplace',
      icon: Award,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
      borderColor: 'border-yellow-400/30',
      data: metrics.nil
    },
    {
      key: 'families',
      title: 'Family Office',
      description: 'Wealth management platform', 
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      borderColor: 'border-blue-400/30',
      data: metrics.families
    },
    {
      key: 'advisors',
      title: 'Advisory Platform',
      description: 'Professional tools & compliance',
      icon: Shield,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      borderColor: 'border-green-400/30',
      data: metrics.advisors
    }
  ];

  return (
    <div className="min-h-screen bg-bfo-black text-white">
      <SEOHead
        title="Investor Rollup Dashboard | myBFOCFO"
        description="Real-time demo metrics and analytics across NIL, Family Office, and Advisory platforms"
        keywords={['investor dashboard', 'demo metrics', 'platform analytics']}
      />
      
      <div className="max-w-7xl mx-auto space-y-6 py-8 px-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Investor Rollup Dashboard</h1>
            <p className="text-white/70 mt-2">
              Real-time platform metrics and demo analytics
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Badge 
              className={`px-3 py-1 ${
                overallReady 
                  ? 'bg-bfo-gold/20 text-bfo-gold border-bfo-gold/40' 
                  : 'bg-gray-500/20 text-gray-400 border-gray-500/40'
              }`}
            >
              {overallReady ? '✓ Demo Ready' : 'Initializing...'}
            </Badge>
          </div>
        </div>

        {/* Overall Summary */}
        <Card className="bg-[#24313d] border-bfo-gold/40 rounded-xl">
          <CardHeader className="border-b border-bfo-gold/30">
            <CardTitle className="text-white font-semibold">Platform Overview</CardTitle>
            <CardDescription className="text-white/70">
              Aggregated metrics across all platform sections
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-bfo-gold">{totalReceipts}</div>
                <div className="text-sm text-white/60">Total Receipts</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{totalAnchored}</div>
                <div className="text-sm text-white/60">Anchored ✓</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{metrics.nil.ctas + metrics.advisors.ctas}</div>
                <div className="text-sm text-white/60">CTAs Clicked</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">{metrics.nil.tours + metrics.families.tours + metrics.advisors.tours}</div>
                <div className="text-sm text-white/60">Tours Run</div>
              </div>
            </div>
            
            <Separator className="my-4 bg-bfo-gold/30" />
            
            <div className="flex flex-wrap gap-3 justify-center">
              <GoldButton onClick={handleNilTour} className="flex items-center gap-2">
                <PlayCircle className="h-4 w-4" />
                Open NIL Tour
              </GoldButton>
              
              <GoldOutlineButton onClick={handleFamilyDemo} className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Open Family Demo
              </GoldOutlineButton>
            </div>
          </CardContent>
        </Card>

        {/* Section Metrics */}
        <div className="grid gap-6 md:grid-cols-3">
          {sectionData.map((section) => {
            const Icon = section.icon;
            return (
              <Card key={section.key} className={`bg-[#24313d] border rounded-xl ${section.borderColor}`}>
                <CardHeader className={`border-b ${section.borderColor}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${section.bgColor}`}>
                        <Icon className={`h-5 w-5 ${section.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-white font-semibold">{section.title}</CardTitle>
                        <CardDescription className="text-white/70 text-sm">
                          {section.description}
                        </CardDescription>
                      </div>
                    </div>
                    
                    <Badge 
                      className={`${
                        section.data.ready 
                          ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                          : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                      }`}
                    >
                      {section.data.ready ? 'Ready' : 'Pending'}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-bfo-gold" />
                      <div>
                        <div className="text-lg font-bold text-bfo-gold">{section.data.receipts}</div>
                        <div className="text-xs text-white/60">Receipts</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      <div>
                        <div className="text-lg font-bold text-green-400">{section.data.anchored}</div>
                        <div className="text-xs text-white/60">Anchored</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <MousePointerClick className="h-4 w-4 text-blue-400" />
                      <div>
                        <div className="text-lg font-bold text-blue-400">{section.data.ctas}</div>
                        <div className="text-xs text-white/60">CTAs</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-purple-400" />
                      <div>
                        <div className="text-lg font-bold text-purple-400">{section.data.tours}</div>
                        <div className="text-xs text-white/60">Tours</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Demo Status Indicators */}
        <Card className="bg-[#24313d] border-bfo-gold/40 rounded-xl">
          <CardHeader className="border-b border-bfo-gold/30">
            <CardTitle className="text-white font-semibold">Demo Readiness Status</CardTitle>
            <CardDescription className="text-white/70">
              Each section needs ≥3 receipts and ≥1 anchor for "Demo Ready" status
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {sectionData.map((section) => (
                <div key={section.key} className="flex items-center justify-between p-3 rounded-lg bg-bfo-black/30 border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded ${section.bgColor}`}>
                      <section.icon className={`h-4 w-4 ${section.color}`} />
                    </div>
                    <span className="font-medium text-white">{section.title}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <span className={`${section.data.receipts >= 3 ? 'text-green-400' : 'text-red-400'}`}>
                      {section.data.receipts}/3 receipts
                    </span>
                    <span className={`${section.data.anchored >= 1 ? 'text-green-400' : 'text-red-400'}`}>
                      {section.data.anchored}/1 anchored
                    </span>
                    <Badge 
                      className={`${
                        section.data.ready 
                          ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                          : 'bg-red-500/20 text-red-400 border-red-500/30'
                      }`}
                    >
                      {section.data.ready ? '✓ Ready' : '⧗ Pending'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}