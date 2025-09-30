import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ToolGate } from '@/components/tools/ToolGate';
import { toast } from '@/hooks/use-toast';
import { EmptyReceiptsState } from '@/components/ui/empty-states';
import { ReceiptsStripSkeleton } from '@/components/ui/skeletons';
import { useFamilyAnalytics } from '@/lib/familyAnalytics';
import { AdvisorBenchmarkWidget } from '@/components/advisor/AdvisorBenchmarkWidget';
import { getFlag } from '@/config/flags';
import { FLAGS } from '@/config/flags';
import AssistedBadge from '@/components/badges/AssistedBadge';
import { 
  Users, 
  UserPlus, 
  Calculator, 
  FileText, 
  Share, 
  Calendar,
  TrendingUp,
  DollarSign,
  CheckCircle,
  Clock,
  Play,
  Copy,
  Target,
  Scale,
  Briefcase
} from 'lucide-react';
import { AdvisorE2EDemo } from '@/components/demos/AdvisorE2EDemo';
import { VoiceDrawer } from '@/components/voice/VoiceDrawer';

interface ProofSlip {
  id: string;
  type: string;
  timestamp: string;
  anchored: boolean;
  clientName?: string;
}

interface QuickAction {
  label: string;
  toolKey: string;
  route: string;
  icon: React.ElementType;
  description: string;
}

export default function AdvisorHome() {
  const navigate = useNavigate();
  const analytics = useFamilyAnalytics();
  const [recentProofSlips, setRecentProofSlips] = useState<ProofSlip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadStartTime] = useState(Date.now());

  useEffect(() => {
    const initializeData = async () => {
      // Simulate loading time for skeleton
      await new Promise(resolve => setTimeout(resolve, 600));

      // Load recent advisor proof slips (mock data)
      setRecentProofSlips([
        { id: '1', type: 'Client Onboarded', timestamp: '1 hour ago', anchored: true, clientName: 'John Smith' },
        { id: '2', type: 'Proposal Generated', timestamp: '3 hours ago', anchored: true, clientName: 'Sarah Johnson' },
        { id: '3', type: 'Roadmap Completed', timestamp: '1 day ago', anchored: false, clientName: 'Mike Wilson' },
        { id: '4', type: 'CPA Invited', timestamp: '2 days ago', anchored: true, clientName: 'Lisa Chen' },
      ]);

      setIsLoading(false);
      
      // Track page load
      const loadTime = Date.now() - loadStartTime;
      analytics.trackPageLoad('advisor', loadTime, true);
    };

    initializeData();
  }, [analytics, loadStartTime]);

  const quickActions: QuickAction[] = [
    {
      label: 'Add Lead',
      toolKey: 'lead-capture',
      route: '/advisor/leads/add',
      icon: UserPlus,
      description: 'Capture new prospect information'
    },
    {
      label: 'Onboard Client',
      toolKey: 'client-onboarding',
      route: '/advisor/clients/onboard',
      icon: Users,
      description: 'Start client onboarding workflow'
    },
    {
      label: 'Run Roadmap',
      toolKey: 'retirement-roadmap',
      route: '/tools/retirement-roadmap',
      icon: Calculator,
      description: 'Generate retirement analysis for client'
    },
    {
      label: 'Open Proposal & Report',
      toolKey: 'proposal-generator',
      route: '/advisor/proposals',
      icon: FileText,
      description: 'Create comprehensive client proposals'
    },
    {
      label: 'Invite CPA/Attorney',
      toolKey: 'professional-network',
      route: '/advisor/network/invite',
      icon: Scale,
      description: 'Collaborate with tax and legal professionals'
    }
  ];

  const handleQuickAction = (action: QuickAction) => {
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.track('advisor.quickAction.click', { 
        label: action.label, 
        route: action.route,
        toolKey: action.toolKey
      });
    }
    analytics.trackQuickAction(action.label, action.route, 'advisor');
  };

  const handleOpenDemo = () => {
    analytics.trackDemo('advisor-workflow', 'advisor');
    
    toast({
      title: "Opening Demo",
      description: "Loading advisor workflow demonstration...",
    });
    
    navigate('/demos/advisor-workflow', { 
      state: { startTime: Date.now(), source: 'advisor-home' }
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: 'My Advisor Dashboard',
      text: 'Check out my comprehensive advisor tools and client management system',
      url: window.location.href
    };

    if (navigator.share) {
      try {
        analytics.trackShare('native', 'advisor');
        await navigator.share(shareData);
        analytics.trackShareSuccess('native', 'advisor');
        toast({
          title: "Shared Successfully",
          description: "Your advisor dashboard has been shared!",
        });
      } catch (error) {
        console.debug('Share cancelled');
      }
    } else {
      try {
        analytics.trackShare('copy', 'advisor');
        await navigator.clipboard.writeText(window.location.href);
        analytics.trackShareSuccess('copy', 'advisor');
        toast({
          title: "Link Copied",
          description: "Dashboard link copied to clipboard",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">Advisor Hub</h1>
                {FLAGS.__ENABLE_AGENT_AUTOMATIONS__ && <AssistedBadge />}
              </div>
              <Badge variant="outline" className="mt-1">
                Professional Dashboard
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <VoiceDrawer 
              triggerLabel="🎙️ Voice Assistant" 
              persona="advisor" 
              endpoint="meeting-summary"
            />
            <AdvisorE2EDemo className="min-h-[44px]" />
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
        <section className="bfo-card p-5">
          <h2 className="text-[var(--bfo-gold)] font-semibold mb-3">Quick Actions</h2>
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <ToolGate key={index} toolKey={action.toolKey} fallbackRoute={action.route}>
                    <Card
                      className="cursor-pointer hover:shadow-md transition-all duration-200 focus-within:ring-2 focus-within:ring-[#67E8F9] focus-within:ring-offset-2 animate-fade-in"
                      onClick={() => handleQuickAction(action)}
                      data-tool-card={action.toolKey}
                    >
                      <CardContent className="p-4 text-center">
                        <Icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                        <h3 className="font-semibold text-sm mb-2">{action.label}</h3>
                        <p className="text-xs text-muted-foreground">{action.description}</p>
                      </CardContent>
                    </Card>
                  </ToolGate>
                );
              })}
             </div>
          </div>
        </section>

        {/* Recent Client Activity */}
        <section className="bfo-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[var(--bfo-gold)] font-semibold">Recent Client Activity</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/receipts?filter=advisor')}
              className="focus:ring-2 focus:ring-[#67E8F9] focus:ring-offset-2"
            >
              View All Receipts
            </Button>
          </div>
          <div>
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
                        <div className="text-xs text-muted-foreground">
                          {slip.clientName} • {slip.timestamp}
                        </div>
                      </div>
                    </div>
                    <Badge variant={slip.anchored ? "default" : "secondary"} className="text-xs">
                      {slip.anchored ? "Verified ✓" : "Processing"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ADV_V1 Enhanced Features */}
        {getFlag('ADV_V1') && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AdvisorBenchmarkWidget />
            
            {/* Quick Performance Metrics */}
            <div className="bfo-card bfo-no-blur p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Practice Performance</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">Client Retention</span>
                  <span className="text-white font-medium">94.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">Fee Competitiveness</span>
                  <span className="text-green-400 font-medium">Above Avg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">Compliance Score</span>
                  <span className="text-white font-medium">98%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+3 new this month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,200</div>
              <p className="text-xs text-muted-foreground">+18% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Opportunities</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">AI-flagged potential</p>
            </CardContent>
          </Card>
        </div>

        {/* Footer Trust Line */}
        <div className="text-center py-4">
          <p className="text-xs text-muted-foreground">
            Fiduciary-First • Client Vault • Professional Network • Compliance Tracking
          </p>
        </div>
      </div>
    </div>
  );
}