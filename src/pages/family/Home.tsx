import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToolGate } from '@/components/tools/ToolGate';
import { toast } from '@/hooks/use-toast';
import { getWorkspaceTools } from '@/lib/workspaceTools';
import { useFamilyAnalytics } from '@/lib/familyAnalytics';
import { EmptyTabState, EmptyReceiptsState } from '@/components/ui/empty-states';
import { TabGridSkeleton, ReceiptsStripSkeleton } from '@/components/ui/skeletons';
import { FamilyE2EDemo } from '@/components/demos/FamilyE2EDemo';
import familyToolsConfig from '@/config/familyTools.json';
import catalogConfig from '@/config/catalogConfig.json';
import { Clock, Crown, Users, Heart, Briefcase, TrendingUp, Shield, Trophy, ExternalLink, Share, CheckCircle, Play, Copy } from 'lucide-react';

const segmentIcons = {
  aspiring: Users,
  retirees: Clock,
  hnw: Crown,
  entrepreneurs: Briefcase,
  physicians: Heart,
  executives: TrendingUp,
  independent_women: Shield,
  athletes: Trophy
};

const segmentLabels = {
  aspiring: 'Aspiring Wealthy',
  retirees: 'Retirees',
  hnw: 'High-Net-Worth',
  entrepreneurs: 'Business Owners',
  physicians: 'Physicians & Dentists',
  executives: 'Corporate Executives',
  independent_women: 'Independent Women',
  athletes: 'Athletes & Entertainers'
};

interface ProofSlip {
  id: string;
  type: string;
  timestamp: string;
  anchored: boolean;
}

export default function FamilyHome() {
  const navigate = useNavigate();
  const analytics = useFamilyAnalytics();
  const [segment, setSegment] = useState<string>('aspiring');
  const [activeTab, setActiveTab] = useState<string>('');
  const [recentProofSlips, setRecentProofSlips] = useState<ProofSlip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadStartTime] = useState(Date.now());

  useEffect(() => {
    const initializeData = async () => {
      // Get segment from workspace
      const workspace = getWorkspaceTools();
      if (workspace.segment) {
        setSegment(workspace.segment);
      }

      // Simulate loading time for skeleton
      await new Promise(resolve => setTimeout(resolve, 800));

      // Load recent proof slips (mock data for now)
      setRecentProofSlips([
        { id: '1', type: 'Document Upload', timestamp: '2 hours ago', anchored: true },
        { id: '2', type: 'Account Link', timestamp: '1 day ago', anchored: true },
        { id: '3', type: 'Goal Created', timestamp: '3 days ago', anchored: false },
      ]);

      setIsLoading(false);
      
      // Track page load
      const loadTime = Date.now() - loadStartTime;
      analytics.trackPageLoad(workspace.segment || 'aspiring', loadTime, true);
    };

    initializeData();
  }, [analytics, loadStartTime]);

  const segmentConfig = familyToolsConfig[segment as keyof typeof familyToolsConfig];
  
  useEffect(() => {
    if (segmentConfig?.tabs?.[0]) {
      setActiveTab(segmentConfig.tabs[0].key);
    }
  }, [segmentConfig]);

  const SegmentIcon = segmentIcons[segment as keyof typeof segmentIcons] || Users;

  const handleQuickAction = (action: any) => {
    analytics.trackQuickAction(action.label, action.route, segment);
    navigate(action.route);
  };

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey);
    const tabConfig = segmentConfig?.tabs?.find(t => t.key === tabKey);
    const hasTools = tabConfig?.cards && tabConfig.cards.length > 0;
    analytics.trackTabView(tabKey, segment, hasTools || false);
  };

  const handleOpenDemo = () => {
    const demoType = `families-${segment}`;
    analytics.trackDemo(demoType, segment);
    
    toast({
      title: "Opening Demo",
      description: "Loading your personalized 60-second demo...",
    });
    
    // Track demo start time for completion analytics
    const demoStartTime = Date.now();
    navigate(`/demos/${demoType}`, { 
      state: { startTime: demoStartTime, source: 'family-home' }
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: 'My Family Financial Hub',
      text: 'Check out my personalized family office tools',
      url: window.location.href
    };

    if (navigator.share) {
      try {
        analytics.trackShare('native', segment);
        await navigator.share(shareData);
        analytics.trackShareSuccess('native', segment);
        toast({
          title: "Shared Successfully",
          description: "Your family hub has been shared!",
        });
      } catch (error) {
        console.debug('Share cancelled');
      }
    } else {
      // Fallback to clipboard
      try {
        analytics.trackShare('copy', segment);
        await navigator.clipboard.writeText(window.location.href);
        analytics.trackShareSuccess('copy', segment);
        toast({
          title: "Link Copied",
          description: "Link copied to clipboard",
          action: <Copy className="w-4 h-4" />
        });
      } catch (error) {
        toast({
          title: "Share Failed",
          description: "Unable to copy link",
          variant: "destructive"
        });
      }
    }
  };

  const handleToolCardClick = (toolKey: string, tabKey?: string) => {
    const isInstalled = getWorkspaceTools().installed?.includes(toolKey) || false;
    analytics.trackToolCard(toolKey, segment, isInstalled, tabKey);
  };

  if (!segmentConfig) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Welcome to Your Family Hub</h2>
            <p className="text-muted-foreground">Please complete your onboarding to access your personalized tools.</p>
            <Button onClick={() => navigate('/onboarding')} className="mt-4">
              Complete Setup
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <SegmentIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Family Hub</h1>
              <Badge variant="outline" className="mt-1">
                {segmentLabels[segment as keyof typeof segmentLabels]}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <FamilyE2EDemo />
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenDemo}
              className="flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              60-sec Demo
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="flex items-center gap-2"
            >
              <Share className="w-4 h-4" />
              Share
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        {segmentConfig.quickActions && segmentConfig.quickActions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                {segmentConfig.quickActions.map((action: any, index: number) => {
                  // Extract toolKey from route if it matches /tools/ pattern
                  const toolKeyMatch = action.route?.match(/\/tools\/([^\/]+)/);
                  const toolKey = toolKeyMatch ? toolKeyMatch[1] : null;
                  
                  if (toolKey) {
                    return (
                      <ToolGate key={index} toolKey={toolKey}>
                        <Button
                          variant="outline"
                          className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-accent transition-colors focus:ring-2 focus:ring-[#67E8F9] focus:ring-offset-2"
                        >
                          <div className="text-sm font-medium text-center">{action.label}</div>
                        </Button>
                      </ToolGate>
                    );
                  }
                  
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-accent transition-colors focus:ring-2 focus:ring-[#67E8F9] focus:ring-offset-2"
                      onClick={() => handleQuickAction(action)}
                    >
                      <div className="text-sm font-medium text-center">{action.label}</div>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tool Tabs */}
        {segmentConfig.tabs && segmentConfig.tabs.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mb-6">
                  {segmentConfig.tabs.map((tab: any) => (
                    <TabsTrigger
                      key={tab.key}
                      value={tab.key}
                      className="focus:ring-2 focus:ring-[#67E8F9] focus:ring-offset-2"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {segmentConfig.tabs.map((tab: any) => (
                  <TabsContent key={tab.key} value={tab.key} className="mt-0">
                    {isLoading ? (
                      <TabGridSkeleton />
                    ) : tab.cards && tab.cards.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {tab.cards.map((card: any, cardIndex: number) => {
                          const catalogItem = catalogConfig.find((item: any) => item.key === card.toolKey);
                          
                          if (!catalogItem) {
                            return (
                              <Card key={cardIndex} className="opacity-50">
                                <CardContent className="p-4">
                                  <div className="text-sm text-muted-foreground">
                                    Tool not found: {card.toolKey}
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          }

                          return (
                            <ToolGate key={cardIndex} toolKey={card.toolKey}>
                              <Card 
                                className="cursor-pointer hover:shadow-md transition-all duration-200 focus-within:ring-2 focus-within:ring-[#67E8F9] focus-within:ring-offset-2 animate-fade-in"
                                onClick={() => handleToolCardClick(card.toolKey, tab.key)}
                                data-tool-card={card.toolKey}
                              >
                                <CardContent className="p-4">
                                  <div className="space-y-2">
                                    <h3 className="font-semibold text-sm">{catalogItem.label}</h3>
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                      {catalogItem.summary}
                                    </p>
                                    {catalogItem.type && (
                                      <Badge variant="secondary" className="text-xs">
                                        {catalogItem.type}
                                      </Badge>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            </ToolGate>
                          );
                        })}
                      </div>
                    ) : (
                      <EmptyTabState 
                        tabKey={tab.key} 
                        tabLabel={tab.label} 
                        segment={segment} 
                      />
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Receipts Strip */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/receipts')}
              className="focus:ring-2 focus:ring-[#67E8F9] focus:ring-offset-2"
            >
              Open Receipts
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <ReceiptsStripSkeleton />
            ) : recentProofSlips.length === 0 ? (
              <EmptyReceiptsState />
            ) : (
              <div className="space-y-3">
                {recentProofSlips.map((slip) => (
                  <div key={slip.id} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg animate-fade-in">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        {slip.anchored ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Clock className="w-4 h-4 text-yellow-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{slip.type}</div>
                        <div className="text-xs text-muted-foreground">{slip.timestamp}</div>
                      </div>
                    </div>
                    <Badge variant={slip.anchored ? "default" : "secondary"} className="text-xs">
                      {slip.anchored ? "Verified ✓" : "Processing"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer Trust Line */}
        <div className="text-center py-4">
          <p className="text-xs text-muted-foreground">
            Smart Checks • Proof Slips • Secure Vault (Keep-Safe/Legal Hold) • Time-Stamp
          </p>
        </div>
      </div>
    </div>
  );
}