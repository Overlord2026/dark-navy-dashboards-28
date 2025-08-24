import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToolGate } from '@/components/tools/ToolGate';
import { analytics } from '@/lib/analytics';
import { getWorkspaceTools } from '@/lib/workspaceTools';
import familyToolsConfig from '@/config/familyTools.json';
import catalogConfig from '@/config/catalogConfig.json';
import { Clock, Crown, Users, Heart, Briefcase, TrendingUp, Shield, Trophy, ExternalLink, Share, CheckCircle } from 'lucide-react';

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
  const [segment, setSegment] = useState<string>('aspiring');
  const [activeTab, setActiveTab] = useState<string>('');
  const [recentProofSlips, setRecentProofSlips] = useState<ProofSlip[]>([]);

  useEffect(() => {
    // Get segment from workspace
    const workspace = getWorkspaceTools();
    if (workspace.segment) {
      setSegment(workspace.segment);
    }

    // Load recent proof slips (mock data for now)
    setRecentProofSlips([
      { id: '1', type: 'Document Upload', timestamp: '2 hours ago', anchored: true },
      { id: '2', type: 'Account Link', timestamp: '1 day ago', anchored: true },
      { id: '3', type: 'Goal Created', timestamp: '3 days ago', anchored: false },
    ]);
  }, []);

  const segmentConfig = familyToolsConfig[segment as keyof typeof familyToolsConfig];
  
  useEffect(() => {
    if (segmentConfig?.tabs?.[0]) {
      setActiveTab(segmentConfig.tabs[0].key);
    }
  }, [segmentConfig]);

  const SegmentIcon = segmentIcons[segment as keyof typeof segmentIcons] || Users;

  const handleQuickAction = (action: any) => {
    analytics.trackEvent('family.quickAction.click', { label: action.label, route: action.route });
    navigate(action.route);
  };

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey);
    analytics.trackEvent('family.tab.view', { tabKey, segment });
  };

  const handleOpenDemo = () => {
    analytics.trackEvent('family.demo.open', { segment });
    navigate(`/demos/family-${segment}`);
  };

  const handleShare = () => {
    analytics.trackEvent('family.share.click', { segment });
    if (navigator.share) {
      navigator.share({
        title: 'My Family Financial Hub',
        text: 'Check out my personalized family office tools',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleToolCardClick = (toolKey: string) => {
    analytics.trackEvent('tool.card.open', { toolKey, segment });
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
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenDemo}
              className="flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {tab.cards?.map((card: any, cardIndex: number) => {
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
                              className="cursor-pointer hover:shadow-md transition-all duration-200 focus-within:ring-2 focus-within:ring-[#67E8F9] focus-within:ring-offset-2"
                              onClick={() => handleToolCardClick(card.toolKey)}
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
            <div className="space-y-3">
              {recentProofSlips.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No recent activity</p>
                  <p className="text-sm">Start using tools to see your proof slips here</p>
                </div>
              ) : (
                recentProofSlips.map((slip) => (
                  <div key={slip.id} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
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
                ))
              )}
            </div>
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