import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  GraduationCap, 
  Shield, 
  Lock, 
  DollarSign, 
  ShoppingBag,
  Award,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  X,
  UserPlus,
  FileText,
  Package,
  Users,
  Receipt
} from 'lucide-react';
import FTCComplianceBanner from '@/components/nil/FTCComplianceBanner';
import { NILActions } from '@/lib/nil/proofSlips';
import { nilAnalytics } from '@/lib/nil/analytics';
import { VoiceDrawer } from '@/components/voice/VoiceDrawer';

interface AthleteConfig {
  quickActions: Array<{
    label: string;
    route: string;
  }>;
  tabs: Array<{
    key: string;
    label: string;
    cards: Array<{
      route: string;
    }>;
  }>;
}

const athleteConfig: AthleteConfig = {
  "quickActions": [
    {"label":"Complete training","route":"/nil/training"},
    {"label":"Pick disclosure pack","route":"/nil/disclosures"},
    {"label":"Create an offer","route":"/nil/offers/new"},
    {"label":"Open Merch","route":"/nil/merch"},
    {"label":"Invite agent/parent/school","route":"/nil/invite"}
  ],
  "tabs": [
    {"key":"portfolio","label":"Portfolio","cards":[{"route":"/nil/portfolio"}]},
    {"key":"discovery","label":"Discovery","cards":[{"route":"/nil/index?me=true"}]},
    {"key":"offers","label":"Offers","cards":[{"route":"/nil/offers"}]},
    {"key":"training","label":"Training & Disclosures","cards":[{"route":"/nil/training"},{"route":"/nil/disclosures"}]},
    {"key":"contracts","label":"Contracts","cards":[{"route":"/nil/contracts"}]},
    {"key":"payments","label":"Payments","cards":[{"route":"/nil/payments"}]},
    {"key":"fans","label":"Fans & Merch","cards":[{"route":"/nil/fans"},{"route":"/nil/merch"}]},
    {"key":"receipts","label":"Receipts","cards":[{"route":"/receipts?scope=nil"}]}
  ]
};

const getActionIcon = (label: string) => {
  if (label.includes('training')) return <GraduationCap className="h-6 w-6" />;
  if (label.includes('disclosure')) return <Shield className="h-6 w-6" />;
  if (label.includes('offer')) return <Lock className="h-6 w-6" />;
  if (label.includes('Merch')) return <ShoppingBag className="h-6 w-6" />;
  if (label.includes('Invite')) return <UserPlus className="h-6 w-6" />;
  return <FileText className="h-6 w-6" />;
};

const getTabIcon = (key: string) => {
  switch (key) {
    case 'portfolio': return <Award className="h-4 w-4" />;
    case 'discovery': return <TrendingUp className="h-4 w-4" />;
    case 'offers': return <Lock className="h-4 w-4" />;
    case 'training': return <GraduationCap className="h-4 w-4" />;
    case 'contracts': return <FileText className="h-4 w-4" />;
    case 'payments': return <DollarSign className="h-4 w-4" />;
    case 'fans': return <Users className="h-4 w-4" />;
    case 'receipts': return <Receipt className="h-4 w-4" />;
    default: return <Package className="h-4 w-4" />;
  }
};

const AthleteHomeDashboard = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [showFTCBanner, setShowFTCBanner] = useState(true);
  const [activeTab, setActiveTab] = useState(athleteConfig.tabs[0]?.key || 'portfolio');

  const athleteId = 'athlete-123'; // Mock athlete ID

  useEffect(() => {
    // Handle ESC key to close modals
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
        setActiveModal(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleQuickActionClick = (route: string, label: string) => {
    nilAnalytics.quickActionClick('athlete', label);
    
    // Handle modal for demo purposes or navigate
    if (route.includes('/nil/training')) {
      handleQuickAction('training');
    } else if (route.includes('/nil/disclosures')) {
      handleQuickAction('disclosure');
    } else if (route.includes('/nil/offers')) {
      handleQuickAction('offerlock');
    } else if (route.includes('/nil/merch')) {
      handleQuickAction('merch');
    } else {
      navigate(route);
    }
  };

  const handleQuickAction = async (actionId: string) => {
    setActiveModal(actionId);
    setIsModalOpen(true);

    // Track analytics
    switch (actionId) {
      case 'training':
        nilAnalytics.trainingComplete(athleteId, 'nil-basics', 85);
        await NILActions.completeTraining(athleteId, 'nil-basics');
        break;
      case 'disclosure':
        nilAnalytics.disclosureApprove('post-123', athleteId, true);
        await NILActions.approveDisclosure('post-123', athleteId, '#ad #sponsored');
        break;
      case 'offerlock':
        nilAnalytics.offerLockCreate('offer-123', athleteId, 2500);
        await NILActions.approveDeal('offer-123', athleteId, 2500, 'school-admin');
        break;
      case 'merch':
        // Merch tracking would go here
        break;
    }
  };


  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Athlete Dashboard</h1>
          <p className="text-muted-foreground">Manage your NIL opportunities and compliance</p>
        </div>
        <div className="flex gap-2">
          <VoiceDrawer 
            triggerLabel="🎙️ Ask AI" 
            persona="athlete" 
            endpoint="meeting-summary"
          />
          <Button variant="outline">
            <TrendingUp className="h-4 w-4 mr-2" />
            View Analytics
          </Button>
          <Button>
            <Award className="h-4 w-4 mr-2" />
            Profile Builder
          </Button>
        </div>
      </div>

      {/* FTC Compliance Banner */}
      {showFTCBanner && (
        <FTCComplianceBanner
          postId="recent-post-123"
          athleteId={athleteId}
          hasRequiredDisclosure={false}
          variant="warning"
          onDismiss={() => setShowFTCBanner(false)}
        />
      )}

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {athleteConfig.quickActions.map((action, index) => (
          <Card 
            key={index}
            className="cursor-pointer transition-all hover:shadow-lg hover:scale-105"
            onClick={() => handleQuickActionClick(action.route, action.label)}
            role="button"
            tabIndex={0}
            aria-label={action.label}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleQuickActionClick(action.route, action.label);
              }
            }}
          >
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <div className="p-3 bg-primary/10 rounded-lg mb-3">
                {getActionIcon(action.label)}
              </div>
              <h3 className="font-medium text-sm">{action.label}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          {athleteConfig.tabs.map((tab) => (
            <TabsTrigger 
              key={tab.key} 
              value={tab.key}
              className="flex items-center gap-2 text-xs"
            >
              {getTabIcon(tab.key)}
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {athleteConfig.tabs.map((tab) => (
          <TabsContent key={tab.key} value={tab.key} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {tab.cards.map((card, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-lg transition-all">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {getTabIcon(tab.key)}
                      {tab.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => navigate(card.route)}
                      className="w-full"
                      variant="outline"
                    >
                      Go to {tab.label}
                    </Button>
                  </CardContent>
                </Card>
              ))}
              
              {/* Overview stats for portfolio tab */}
              {tab.key === 'portfolio' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Total Earnings
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$12,450</div>
                      <p className="text-sm text-muted-foreground">+15% from last month</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        Active Campaigns
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">4</div>
                      <p className="text-sm text-muted-foreground">2 pending approval</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Compliance Score
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-success">98%</div>
                      <p className="text-sm text-muted-foreground">All requirements met</p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Modal for Quick Actions */}
      {isModalOpen && activeModal && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => {
            setIsModalOpen(false);
            setActiveModal(null);
          }}
        >
          <div 
            className="bg-background rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {activeModal === 'training' && 'NIL Training'}
                {activeModal === 'disclosure' && 'Disclosure Manager'}
                {activeModal === 'offerlock' && 'OfferLock™'}
                {activeModal === 'merch' && 'Merch & Fan Offers'}
              </h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setIsModalOpen(false);
                  setActiveModal(null);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <p className="text-muted-foreground">
                {activeModal === 'training' && 'Training module completed! Proof slip generated.'}
                {activeModal === 'disclosure' && 'Disclosure approved and FTC compliant. Proof slip generated.'}
                {activeModal === 'offerlock' && 'Offer locked successfully. Proof slip generated.'}
                {activeModal === 'merch' && 'Merchandise features coming soon.'}
              </p>
              
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsModalOpen(false);
                    setActiveModal(null);
                  }}
                >
                  Close
                </Button>
                <Button>View Details</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AthleteHomeDashboard;