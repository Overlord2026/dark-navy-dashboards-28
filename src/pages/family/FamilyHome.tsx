import React, { useState, useEffect } from 'react';
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

// Mock proof slips data
const MOCK_PROOF_SLIPS: ProofSlip[] = [
  { id: '1', type: 'document_upload', timestamp: '2024-01-22T10:30:00Z', description: 'Uploaded Estate Documents to Vault', anchored: true },
  { id: '2', type: 'calculation_run', timestamp: '2024-01-22T09:15:00Z', description: 'Retirement Roadmap Analysis', anchored: true },
  { id: '3', type: 'advisor_invite', timestamp: '2024-01-21T16:45:00Z', description: 'Invited Financial Advisor', anchored: false },
  { id: '4', type: 'account_link', timestamp: '2024-01-21T14:20:00Z', description: 'Connected Bank Account', anchored: true },
  { id: '5', type: 'compliance_check', timestamp: '2024-01-21T11:30:00Z', description: 'RMD Compliance Check', anchored: true }
];

const PROOF_SLIP_TYPES = {
  document_upload: { label: 'Document', color: 'bg-blue-100 text-blue-800' },
  account_link: { label: 'Account', color: 'bg-green-100 text-green-800' },
  advisor_invite: { label: 'Invite', color: 'bg-purple-100 text-purple-800' },
  calculation_run: { label: 'Analysis', color: 'bg-orange-100 text-orange-800' },
  compliance_check: { label: 'Compliance', color: 'bg-red-100 text-red-800' }
};

export function FamilyHome() {
  const navigate = useNavigate();
  const [session, setSession] = useState<UserSession | null>(null);

  useEffect(() => {
    // Get user session
    const sessionData = localStorage.getItem('user_session');
    if (sessionData) {
      const parsedSession = JSON.parse(sessionData);
      setSession(parsedSession);
    } else {
      // Redirect to onboarding if no session
      navigate('/start/families');
    }
  }, [navigate]);

  if (!session) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
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
      marketingRoute: tool.route
    } : {
      title: toolKey,
      description: 'Tool description',
      category: 'general',
      route: `/tools/${toolKey}`,
      marketingRoute: `/solutions/${toolKey}`
    };
  };

  const handleDemoOpen = () => {
    analytics.trackEvent('family.demo_opened', { segment: session.segment });
    navigate(`/demos/families-${session.segment}`);
  };

  const handleShare = () => {
    analytics.trackShareClick('family_workspace', { segment: session.segment });
    if (navigator.share) {
      navigator.share({
        title: `${segmentTitle} Family Workspace`,
        text: 'Check out my family financial workspace',
        url: window.location.href
      }).then(() => {
        analytics.trackShareSuccess('family_workspace', 'native_share', { segment: session.segment });
      });
    }
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
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        
        {/* Welcome Bar */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    {session.segment === 'aspiring' ? <TrendingUp className="w-5 h-5 text-primary" /> : <Shield className="w-5 h-5 text-primary" />}
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
                <Button variant="outline" size="sm" onClick={handleDemoOpen}>
                  <Play className="w-4 h-4 mr-2" />
                  Open 60-sec demo
                </Button>
                <Button variant="ghost" size="sm" onClick={handleShare}>
                  <Share className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 space-y-8">
          
          {/* Quick Actions */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid md:grid-cols-5 gap-4">
              {segmentConfig.quickActions.map((action, index) => (
                <Card 
                  key={index}
                  className="cursor-pointer hover:shadow-md transition-all duration-200 group"
                  onClick={() => {
                    analytics.trackFamilyQuickAction(action.label, action.route, { segment: session.segment });
                    navigate(action.route);
                  }}
                >
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-sm font-medium mb-2 group-hover:text-primary transition-colors">
                        {action.label}
                      </div>
                      <ArrowRight className="w-4 h-4 mx-auto text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <Separator />

          {/* Tools Tabs */}
          <section>
            <Tabs 
              defaultValue={segmentConfig.tabs[0].key} 
              className="space-y-6"
              onValueChange={(value) => {
                analytics.trackFamilyTabView(value, session.segment);
              }}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Your Tools</h2>
                <TabsList className="grid grid-cols-4 md:grid-cols-6 lg:w-fit">
                  {segmentConfig.tabs.map(tab => (
                    <TabsTrigger key={tab.key} value={tab.key} className="text-xs">
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {segmentConfig.tabs.map(tab => (
                <TabsContent key={tab.key} value={tab.key} className="space-y-4">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tab.cards.map(card => {
                      const toolDetails = getToolDetails(card.toolKey);
                      const isLoggedIn = !!session; // Check if user has session
                      const targetRoute = isLoggedIn ? toolDetails.route : (toolDetails.marketingRoute || toolDetails.route);
                      
                      return (
                        <Card 
                          key={card.toolKey}
                          className="cursor-pointer hover:shadow-md transition-shadow group"
                          onClick={() => {
                            analytics.trackToolCardOpen(card.toolKey, toolDetails.title, toolDetails.category, { 
                              segment: session.segment, 
                              tab: tab.key,
                              route: targetRoute 
                            });
                            navigate(targetRoute);
                          }}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                                    {toolDetails.title}
                                  </h3>
                                  {!isLoggedIn && <ExternalLink className="w-3 h-3 text-muted-foreground" />}
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {toolDetails.description}
                                </p>
                                <Badge variant="secondary" className="text-xs">
                                  {toolDetails.category}
                                </Badge>
                              </div>
                              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors ml-2" />
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </section>

          <Separator />

          {/* Receipts Strip */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent Proof Slips</h2>
              <Button variant="outline" size="sm" onClick={() => navigate('/receipts')}>
                <Receipt className="w-4 h-4 mr-2" />
                Open Receipts
              </Button>
            </div>
            
            <div className="grid md:grid-cols-5 gap-3">
              {MOCK_PROOF_SLIPS.slice(0, 5).map((slip) => {
                const typeConfig = PROOF_SLIP_TYPES[slip.type];
                return (
                  <Card key={slip.id} className="hover:shadow-sm transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className={`text-xs ${typeConfig.color}`}>
                            {typeConfig.label}
                          </Badge>
                          {slip.anchored && <CheckCircle className="w-3 h-3 text-green-600" />}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {slip.description}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock3 className="w-3 h-3" />
                          {formatTimestamp(slip.timestamp)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Trust Explainer Footer */}
          <footer className="mt-12 pt-8 border-t">
            <div className="text-center space-y-4">
              <h3 className="font-semibold text-muted-foreground">Trust Rails</h3>
              <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Smart Checks</span>
                </div>
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-blue-600" />
                  <span>Proof Slips</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-600" />
                  <span>Secure Vault</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span>Time-Stamp</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
                Every action in your workspace generates cryptographic proof. Keep-Safe storage with Legal Hold capabilities ensures your family's records are tamper-evident and court-admissible.
              </p>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}