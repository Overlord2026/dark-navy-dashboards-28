import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PersonaSubHeader } from '@/components/layout/PersonaSubHeader';
import { ToolGate } from '@/components/tools/ToolGate';
import { toast } from '@/hooks/use-toast';
import { EmptyReceiptsState } from '@/components/ui/empty-states';
import { ReceiptsStripSkeleton } from '@/components/ui/skeletons';
import { useFamilyAnalytics } from '@/lib/familyAnalytics';
import { 
  GraduationCap, 
  FileText, 
  DollarSign, 
  ShoppingBag, 
  UserPlus,
  Play,
  Share,
  CheckCircle,
  Clock,
  Copy,
  Trophy,
  Target,
  CreditCard,
  Users
} from 'lucide-react';

interface ProofSlip {
  id: string;
  type: string;
  timestamp: string;
  anchored: boolean;
  details?: string;
}

interface QuickAction {
  label: string;
  toolKey: string;
  route: string;
  icon: React.ElementType;
  description: string;
}

export default function NILAthleteHome() {
  const navigate = useNavigate();
  const analytics = useFamilyAnalytics();
  const [recentProofSlips, setRecentProofSlips] = useState<ProofSlip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadStartTime] = useState(Date.now());

  useEffect(() => {
    const initializeData = async () => {
      // Simulate loading time for skeleton
      await new Promise(resolve => setTimeout(resolve, 600));

      // Load recent NIL athlete proof slips (mock data)
      setRecentProofSlips([
        { id: '1', type: 'Training Module Completed', timestamp: '30 min ago', anchored: true, details: 'NIL Basics' },
        { id: '2', type: 'Disclosure Pack Selected', timestamp: '2 hours ago', anchored: true, details: 'State Compliance' },
        { id: '3', type: 'Offer Created', timestamp: '1 day ago', anchored: false, details: 'Brand Partnership' },
        { id: '4', type: 'Payment Received', timestamp: '3 days ago', anchored: true, details: '$500.00' },
        { id: '5', type: 'Agent Invited', timestamp: '1 week ago', anchored: true, details: 'Sports Management' },
      ]);

      setIsLoading(false);
      
      // Track page load
      const loadTime = Date.now() - loadStartTime;
      analytics.trackPageLoad('nil-athlete', loadTime, true);
    };

    initializeData();
  }, [analytics, loadStartTime]);

  const quickActions: QuickAction[] = [
    {
      label: 'Complete Training',
      toolKey: 'nil-training',
      route: '/nil/training',
      icon: GraduationCap,
      description: 'Complete required NIL education modules'
    },
    {
      label: 'Pick Disclosure Pack',
      toolKey: 'nil-disclosure',
      route: '/nil/disclosure',
      icon: FileText,
      description: 'Select state-specific disclosure documents'
    },
    {
      label: 'Create Offer',
      toolKey: 'nil-offers',
      route: '/nil/offers/create',
      icon: DollarSign,
      description: 'Create new NIL opportunity or partnership'
    },
    {
      label: 'Open Merch',
      toolKey: 'nil-marketplace',
      route: '/nil/marketplace',
      icon: ShoppingBag,
      description: 'Browse NIL merchandise opportunities'
    },
    {
      label: 'Invite Agent/Parent/School',
      toolKey: 'nil-network',
      route: '/nil/network/invite',
      icon: UserPlus,
      description: 'Add support team members to your account'
    }
  ];

  const handleQuickAction = (action: QuickAction) => {
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.track('nil.quickAction.click', { 
        label: action.label, 
        route: action.route,
        toolKey: action.toolKey,
        persona: 'athlete'
      });
    }
    analytics.trackQuickAction(action.label, action.route, 'nil-athlete');
  };

  const handleOpenDemo = () => {
    analytics.trackDemo('nil-athlete-journey', 'nil-athlete');
    
    toast({
      title: "Opening Demo",
      description: "Loading NIL athlete journey demonstration...",
    });
    
    navigate('/demos/nil-athlete-journey', { 
      state: { startTime: Date.now(), source: 'nil-athlete-home' }
    });
  };

  const handleShare = async () => {
    const shareText = "🏆 NIL just got easier! NIL compliance and opportunity management system - Perfect for athletes navigating name, image & likeness deals with confidence.";
    const shareData = {
      title: 'NIL Athlete Dashboard',
      text: shareText,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        analytics.trackShare('native', 'nil-athlete');
        await navigator.share(shareData);
        analytics.trackShareSuccess('native', 'nil-athlete');
        toast({
          title: "Shared Successfully",
          description: "Your NIL dashboard has been shared!",
        });
      } catch (error) {
        console.debug('Share cancelled');
      }
    } else {
      try {
        analytics.trackShare('copy', 'nil-athlete');
        const copyText = `${shareText}\n\n${window.location.href}`;
        await navigator.clipboard.writeText(copyText);
        analytics.trackShareSuccess('copy', 'nil-athlete');
        toast({
          title: "Link Copied",
          description: "Dashboard link with message copied to clipboard",
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
      <PersonaSubHeader 
        title="NIL Athlete Hub"
        subtitle="Navigate name, image & likeness deals with confidence"
        right={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenDemo}
              className="flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              NIL Journey Demo
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
        }
      />
      <div className="container mx-auto px-4 py-6 space-y-6">

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        {/* Compliance & Activity Feed */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Activity & Proofs</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/receipts?filter=nil-athlete')}
              className="focus:ring-2 focus:ring-[#67E8F9] focus:ring-offset-2"
            >
              View All Receipts
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
                        <div className="text-xs text-muted-foreground">
                          {slip.details} • {slip.timestamp}
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
          </CardContent>
        </Card>

        {/* NIL Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Training Progress</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85%</div>
              <p className="text-xs text-muted-foreground">3 modules remaining</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Offers</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">2 pending review</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2,150</div>
              <p className="text-xs text-muted-foreground">This academic year</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Support Team</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">Agent, parents, school</p>
            </CardContent>
          </Card>
        </div>

        {/* Footer Trust Line */}
        <div className="text-center py-4">
          <p className="text-xs text-muted-foreground">
            NCAA Compliant • State Law Verified • Secure Payments • Education First
          </p>
        </div>
      </div>
    </div>
  );
}