import React, { Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Shield, 
  ArrowRight,
  Play,
  Share,
  ExternalLink,
  Clock3,
  Receipt
} from 'lucide-react';
import familyToolsConfig from '@/config/familyTools.json';
import catalogConfig from '@/config/catalogConfig.json';
import { analytics } from '@/lib/analytics';
import { cn } from '@/lib/utils';

type FamilySegment = 'aspiring' | 'retirees';

interface UserSession {
  email: string;
  segment: FamilySegment;
  goals: string[];
  onboarded: boolean;
}

interface ProofSlip {
  id: string;
  type: 'document_upload' | 'account_link' | 'advisor_invite' | 'calculation_run' | 'compliance_check';
  timestamp: string;
  description: string;
  anchored: boolean;
}

// Lazy-loaded components for performance
const LazyToolGrid = React.lazy(() => import('./components/LazyToolGrid'));
const LazyReceiptsStrip = React.lazy(() => import('./components/LazyReceiptsStrip'));

// Mock proof slips data
const MOCK_PROOF_SLIPS: ProofSlip[] = [
  { id: '1', type: 'document_upload', timestamp: '2024-01-22T10:30:00Z', description: 'Uploaded Estate Documents to Vault', anchored: true },
  { id: '2', type: 'calculation_run', timestamp: '2024-01-22T09:15:00Z', description: 'Retirement Roadmap Analysis', anchored: true },
  { id: '3', type: 'advisor_invite', timestamp: '2024-01-21T16:45:00Z', description: 'Invited Financial Advisor', anchored: false },
  { id: '4', type: 'account_link', timestamp: '2024-01-21T14:20:00Z', description: 'Connected Bank Account', anchored: true },
  { id: '5', type: 'compliance_check', timestamp: '2024-01-21T11:30:00Z', description: 'RMD Compliance Check', anchored: true }
];

const PROOF_SLIP_TYPES = {
  document_upload: { label: 'Document', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' },
  account_link: { label: 'Account', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' },
  advisor_invite: { label: 'Invite', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100' },
  calculation_run: { label: 'Analysis', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100' },
  compliance_check: { label: 'Compliance', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100' }
};

// Loading skeleton component
function LoadingSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-4 bg-muted rounded mb-2"></div>
            <div className="h-3 bg-muted rounded mb-4"></div>
            <div className="h-6 bg-muted rounded w-20"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function FamilyHome() {
  const navigate = useNavigate();
  const [session, setSession] = React.useState<UserSession | null>(null);
  const [activeTab, setActiveTab] = React.useState<string>('');

  React.useEffect(() => {
    // Get user session
    const sessionData = localStorage.getItem('user_session');
    if (sessionData) {
      const parsedSession = JSON.parse(sessionData);
      setSession(parsedSession);
      
      // Set initial active tab
      const segmentConfig = familyToolsConfig[parsedSession.segment];
      setActiveTab(segmentConfig.tabs[0].key);
    } else {
      // Redirect to onboarding if no session
      navigate('/start/families');
    }
  }, [navigate]);

  // Prefetch route on hover/touch
  const prefetchRoute = React.useCallback((route: string) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = route;
    document.head.appendChild(link);
  }, []);

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="loading-skeleton w-32 h-8"></div>
      </div>
    );
  }

  const segmentConfig = familyToolsConfig[session.segment];
  const segmentTitle = session.segment === 'aspiring' ? 'Aspiring Wealthy' : 'Retirees';

  const getToolDetails = (toolKey: string) => {
    const tool = catalogConfig.find((tool: any) => tool.key === toolKey);
    return tool ? {
      title: tool.label,
      description: tool.summary,
      category: tool.type.toLowerCase(),
      route: tool.route,
      marketingRoute: tool.route,
      status: tool.status
    } : {
      title: toolKey,
      description: 'Tool description',
      category: 'general',
      route: `/tools/${toolKey}`,
      marketingRoute: `/solutions/${toolKey}`,
      status: 'ready'
    };
  };

  const handleDemoOpen = () => {
    analytics.trackEvent('family.demo_opened', { segment: session.segment });
    navigate(`/demos/families-${session.segment}`);
  };

  const handleShare = async () => {
    analytics.trackShareClick('family_workspace', { segment: session.segment });
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${segmentTitle} Family Workspace`,
          text: 'Check out my family financial workspace',
          url: window.location.href
        });
        analytics.trackShareSuccess('family_workspace', 'native_share', { segment: session.segment });
      } catch (error) {
        // User cancelled share or error occurred
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      analytics.trackShareSuccess('family_workspace', 'clipboard', { segment: session.segment });
    }
  };

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey);
    analytics.trackFamilyTabView(tabKey, session.segment);
  };

  const handleQuickAction = (action: any) => {
    analytics.trackFamilyQuickAction(action.label, action.route, { segment: session.segment });
    navigate(action.route);
  };

  const handleToolCardClick = (card: any, toolDetails: any, targetRoute: string, tabKey: string) => {
    analytics.trackToolCardOpen(card.toolKey, toolDetails.title, toolDetails.category, { 
      segment: session.segment, 
      tab: tabKey,
      route: targetRoute 
    });
    navigate(targetRoute);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      <Helmet>
        <title>{segmentTitle} Family Workspace</title>
        <meta name="description" content={`Your private ${segmentTitle.toLowerCase()} family workspace for financial planning and organization`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      
      <div className="min-h-screen family-background">
        
        {/* Welcome Bar with proper contrast and focus management */}
        <header 
          className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          role="banner"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center"
                    aria-hidden="true"
                  >
                    {session.segment === 'aspiring' ? 
                      <TrendingUp className="w-5 h-5 text-primary" /> : 
                      <Shield className="w-5 h-5 text-primary" />
                    }
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold">{segmentTitle} Workspace</h1>
                    <p className="text-sm text-muted-foreground">{session.email}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="ml-2">
                  {segmentTitle}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleDemoOpen}
                  className="min-h-[44px]"
                  aria-label={`Open 60-second demo for ${segmentTitle.toLowerCase()} workspace`}
                >
                  <Play className="w-4 h-4 mr-2" aria-hidden="true" />
                  Open 60-sec demo
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleShare}
                  className="min-h-[44px] min-w-[44px]"
                  aria-label="Share workspace"
                >
                  <Share className="w-4 h-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 space-y-8" role="main">
          
          {/* Quick Actions with proper accessibility */}
          <section aria-labelledby="quick-actions-heading">
            <h2 id="quick-actions-heading" className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid md:grid-cols-5 gap-4" role="group" aria-labelledby="quick-actions-heading">
              {segmentConfig.quickActions.map((action, index) => (
                <Card 
                  key={index}
                  className="cursor-pointer hover:shadow-md transition-all duration-200 group tool-card"
                  tabIndex={0}
                  role="button"
                  aria-label={action.label}
                  onClick={() => handleQuickAction(action)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleQuickAction(action);
                    }
                  }}
                  onMouseEnter={() => prefetchRoute(action.route)}
                  onTouchStart={() => prefetchRoute(action.route)}
                >
                  <CardContent className="p-4 min-h-[44px] flex items-center">
                    <div className="text-center w-full">
                      <div className="text-sm font-medium mb-2 group-hover:text-primary transition-colors">
                        {action.label}
                      </div>
                      <ArrowRight 
                        className="w-4 h-4 mx-auto text-muted-foreground group-hover:text-primary transition-colors" 
                        aria-hidden="true" 
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <Separator />

          {/* Tools Tabs with proper ARIA and focus management */}
          <section aria-labelledby="tools-heading">
            <Tabs 
              value={activeTab}
              onValueChange={handleTabChange}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 id="tools-heading" className="text-lg font-semibold">Your Tools</h2>
                <TabsList 
                  className="grid grid-cols-4 md:grid-cols-6 lg:w-fit"
                  role="tablist"
                  aria-label="Tool categories"
                >
                  {segmentConfig.tabs.map(tab => (
                    <TabsTrigger 
                      key={tab.key} 
                      value={tab.key} 
                      className={cn(
                        "text-xs min-h-[44px]",
                        "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      )}
                      role="tab"
                      aria-controls={`tabpanel-${tab.key}`}
                      aria-selected={activeTab === tab.key}
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {segmentConfig.tabs.map(tab => (
                <TabsContent 
                  key={tab.key} 
                  value={tab.key} 
                  className="space-y-4"
                  role="tabpanel"
                  id={`tabpanel-${tab.key}`}
                  aria-labelledby={`tab-${tab.key}`}
                >
                  <Suspense fallback={<LoadingSkeleton />}>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {tab.cards.map(card => {
                        const toolDetails = getToolDetails(card.toolKey);
                        
                        // Skip tools marked as "soon"
                        if (toolDetails.status === 'soon') return null;
                        
                        const isLoggedIn = !!session;
                        const targetRoute = isLoggedIn ? toolDetails.route : (toolDetails.marketingRoute || toolDetails.route);
                        
                        return (
                          <Card 
                            key={card.toolKey}
                            className="cursor-pointer hover:shadow-md transition-shadow group tool-card"
                            tabIndex={0}
                            role="button"
                            aria-label={`Open ${toolDetails.title} tool`}
                            onClick={() => handleToolCardClick(card, toolDetails, targetRoute, tab.key)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleToolCardClick(card, toolDetails, targetRoute, tab.key);
                              }
                            }}
                            onMouseEnter={() => prefetchRoute(targetRoute)}
                            onTouchStart={() => prefetchRoute(targetRoute)}
                          >
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between">
                                <div className="space-y-2 flex-1">
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                                      {toolDetails.title}
                                    </h3>
                                    {!isLoggedIn && <ExternalLink className="w-3 h-3 text-muted-foreground" aria-label="External link" />}
                                  </div>
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {toolDetails.description}
                                  </p>
                                  <Badge variant="secondary" className="text-xs">
                                    {toolDetails.category}
                                  </Badge>
                                </div>
                                <ArrowRight 
                                  className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors ml-2" 
                                  aria-hidden="true" 
                                />
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </Suspense>
                </TabsContent>
              ))}
            </Tabs>
          </section>

          <Separator />

          {/* Receipts Strip with lazy loading */}
          <section aria-labelledby="receipts-heading">
            <div className="flex items-center justify-between mb-4">
              <h2 id="receipts-heading" className="text-lg font-semibold">Recent Proof Slips</h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/receipts')}
                className="min-h-[44px]"
                aria-label="Open full receipts viewer"
              >
                <Receipt className="w-4 h-4 mr-2" aria-hidden="true" />
                Open Receipts
              </Button>
            </div>
            
            <Suspense fallback={<LoadingSkeleton />}>
              <div className="grid md:grid-cols-5 gap-3" role="list" aria-label="Recent proof slips">
                {MOCK_PROOF_SLIPS.slice(0, 5).map((slip) => {
                  const typeConfig = PROOF_SLIP_TYPES[slip.type];
                  return (
                    <Card 
                      key={slip.id} 
                      className="hover:shadow-sm transition-shadow cursor-pointer tool-card"
                      role="listitem"
                      tabIndex={0}
                      aria-label={`Proof slip: ${slip.description}, ${formatTimestamp(slip.timestamp)}`}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge 
                              variant="secondary" 
                              className={cn("text-xs", typeConfig.color)}
                            >
                              {typeConfig.label}
                            </Badge>
                            {slip.anchored && (
                              <CheckCircle 
                                className="w-3 h-3 text-green-600" 
                                aria-label="Verified"
                              />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {slip.description}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock3 className="w-3 h-3" aria-hidden="true" />
                            <time dateTime={slip.timestamp}>
                              {formatTimestamp(slip.timestamp)}
                            </time>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </Suspense>
          </section>

          {/* Trust Explainer Footer */}
          <footer className="mt-12 pt-8 border-t" role="contentinfo">
            <div className="text-center space-y-4">
              <h3 className="font-semibold text-muted-foreground">Trust Rails</h3>
              <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" aria-hidden="true" />
                  <span>Smart Checks</span>
                </div>
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-blue-600" aria-hidden="true" />
                  <span>Proof Slips</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-600" aria-hidden="true" />
                  <span>Secure Vault</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-600" aria-hidden="true" />
                  <span>Time-Stamp</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
                Every action in your workspace generates cryptographic proof. Keep-Safe storage with Legal Hold capabilities ensures your family's records are tamper-evident and court-admissible.
              </p>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}