import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, TrendingUp, DollarSign, Users, Calendar, Building2, Play, Share, Copy, Check, ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { getFlag } from '@/lib/flags';

const nilStats = [
  { label: 'Active Athletes', value: '2,847', icon: Users, trend: '+12%' },
  { label: 'Weekly Deals', value: '156', icon: TrendingUp, trend: '+8%' },
  { label: 'Total Value', value: '$2.1M', icon: DollarSign, trend: '+24%' },
  { label: 'Avg Deal Size', value: '$4,800', icon: Award, trend: '+5%' }
];

const weeklyHighlights = [
  {
    title: 'Record Breaking Week for Basketball NIL',
    description: 'March Madness drives 340% increase in basketball athlete partnerships',
    value: '$847K',
    category: 'Basketball'
  },
  {
    title: 'Local Business Partnerships Surge',
    description: 'Small businesses discover NIL as cost-effective marketing channel',
    value: '89 deals',
    category: 'Local'
  },
  {
    title: 'Social Media Compliance at 99.2%',
    description: 'FTC disclosure automation maintains near-perfect compliance rates',
    value: '99.2%',
    category: 'Compliance'
  }
];

export default function NILIndex() {
  const navigate = useNavigate();
  const [shareText, setShareText] = useState('');
  const [copied, setCopied] = useState(false);

  const handleBrandStart = () => {
    // Analytics
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('brand.start.click', { 
        source: 'nil-index-sticky',
        campaign: 'quick-start'
      });
    }
    
    navigate('/start/brand');
  };

  const handleAthleteDemo = () => {
    // Analytics  
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('demo.open', { 
        source: 'nil-index-sticky',
        demoId: 'nil-athlete'
      });
    }
    
    navigate('/demos/nil-athlete');
  };

  const handleSchoolDemo = () => {
    // Analytics  
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('demo.open', { 
        source: 'nil-index-sticky',
        demoId: 'nil-school'
      });
    }
    
    navigate('/demos/nil-school');
  };

  const handleShare = async () => {
    const shareData = {
      title: 'NIL Weekly Index',
      text: 'Check out the latest NIL market trends and opportunities - comprehensive weekly analysis of Name, Image & Likeness deals.',
      url: window.location.href
    };

    // Analytics
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('share.click', { 
        source: 'nil-index-sticky',
        url: shareData.url
      });
    }

    // Try Web Share API first (mobile-friendly)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        
        // Analytics success
        if (typeof window !== 'undefined' && (window as any).analytics) {
          (window as any).analytics.track('share.success', { 
            method: 'native',
            source: 'nil-index-sticky'
          });
        }
        return;
      } catch (error) {
        console.log('Web Share cancelled or failed:', error);
      }
    }

    // Fallback to clipboard copy
    try {
      const copyText = `${shareData.text}\n\n${shareData.url}`;
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "The NIL index link has been copied to your clipboard.",
      });

      // Analytics success  
      if (typeof window !== 'undefined' && (window as any).analytics) {
        (window as any).analytics.track('share.success', { 
          method: 'copy',
          source: 'nil-index-sticky'
        });
      }
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      toast({
        title: "Copy failed",
        description: "Could not copy link to clipboard.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Weekly NIL Index & Discovery | myBFOCFO</title>
        <meta name="description" content="Weekly analysis of NIL market trends, deals, and opportunities. Comprehensive insights into Name, Image & Likeness partnerships and athlete earnings." />
        <meta name="keywords" content="NIL index, athlete partnerships, brand collaborations, NIL market trends, college sports marketing" />
        <meta property="og:title" content="Weekly NIL Index & Discovery | myBFOCFO" />
        <meta property="og:description" content="Weekly analysis of NIL market trends, deals, and opportunities. Comprehensive insights into Name, Image & Likeness partnerships and athlete earnings." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
      </Helmet>

      <div className="min-h-screen bg-background relative">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">NIL Weekly Index</h1>
                  <p className="text-muted-foreground">Market trends and partnership opportunities</p>
                </div>
                <Badge variant="secondary" className="ml-2">
                  Week of {new Date().toLocaleDateString()}
                </Badge>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 space-y-8 pb-24">
          {/* Market Stats */}
          <section>
            <h2 className="text-xl font-semibold mb-6">Market Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {nilStats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{stat.label}</p>
                          <p className="text-2xl font-bold">{stat.value}</p>
                          <p className="text-sm text-green-600 font-medium">{stat.trend}</p>
                        </div>
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Weekly Highlights */}
          <section>
            <h2 className="text-xl font-semibold mb-6">Weekly Highlights</h2>
            <div className="grid gap-6">
              {weeklyHighlights.map((highlight, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{highlight.title}</CardTitle>
                        <p className="text-muted-foreground mt-2">{highlight.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{highlight.value}</div>
                        <Badge variant="outline">{highlight.category}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </section>

          {/* Compliance & Trends */}
          <section>
            <h2 className="text-xl font-semibold mb-6">Industry Insights</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>FTC Compliance Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Disclosure compliance rates continue to improve with automated tools and education.
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Proper Disclosures</span>
                      <span className="font-medium">99.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Timely Payments</span>
                      <span className="font-medium">97.8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Documentation Complete</span>
                      <span className="font-medium">98.5%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Emerging Opportunities</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    New partnership models and market segments showing growth potential.
                  </p>
                  <div className="space-y-3">
                    <div>
                      <div className="font-medium">Local Business Partnerships</div>
                      <div className="text-sm text-muted-foreground">+145% growth this quarter</div>
                    </div>
                    <div>
                      <div className="font-medium">Event Appearances</div>
                      <div className="text-sm text-muted-foreground">Spring season bookings surge</div>
                    </div>
                    <div>
                      <div className="font-medium">Product Collaborations</div>
                      <div className="text-sm text-muted-foreground">Athletes as co-creators</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>

        {/* Sticky Action Row */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-t">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getFlag('BRAND_PUBLIC_ENABLED') && (
                  <Button 
                    onClick={handleBrandStart}
                    className="flex items-center gap-2 min-h-[44px]"
                  >
                    <Building2 className="w-4 h-4" />
                    For Brands & Local Businesses
                  </Button>
                )}
                
                {getFlag('DEMOS_ENABLED') && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-2 min-h-[44px]"
                      >
                        <Play className="w-4 h-4" />
                        See 60-sec Demo
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      className="z-50 bg-background border shadow-lg"
                      align="start"
                    >
                      <DropdownMenuItem onClick={handleAthleteDemo}>
                        <Award className="w-4 h-4 mr-2" />
                        Athlete Demo
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleSchoolDemo}>
                        <Building2 className="w-4 h-4 mr-2" />
                        School Demo
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              
              <Button
                variant="ghost"
                onClick={handleShare}
                className="flex items-center gap-2 min-h-[44px]"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Share className="w-4 h-4" />
                    Share
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}