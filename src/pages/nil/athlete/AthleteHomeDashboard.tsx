import React, { useState, useEffect } from 'react';
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
  X
} from 'lucide-react';
import FTCComplianceBanner from '@/components/nil/FTCComplianceBanner';
import { NILActions } from '@/lib/nil/proofSlips';
import { nilAnalytics } from '@/lib/nil/analytics';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'complete' | 'pending' | 'available' | 'locked';
  progress?: number;
  onClick: () => void;
}

const AthleteHomeDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [showFTCBanner, setShowFTCBanner] = useState(true);

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

  const quickActions: QuickAction[] = [
    {
      id: 'training',
      title: 'NIL Training',
      description: 'Complete required education modules',
      icon: <GraduationCap className="h-6 w-6" />,
      status: 'pending',
      progress: 75,
      onClick: () => handleQuickAction('training')
    },
    {
      id: 'disclosure',
      title: 'Disclosure Manager',
      description: 'Review and approve post disclosures',
      icon: <Shield className="h-6 w-6" />,
      status: 'available',
      onClick: () => handleQuickAction('disclosure')
    },
    {
      id: 'offerlock',
      title: 'OfferLock™',
      description: 'Secure and manage brand offers',
      icon: <Lock className="h-6 w-6" />,
      status: 'available',
      onClick: () => handleQuickAction('offerlock')
    },
    {
      id: 'merch',
      title: 'Merch & Fan Offers',
      description: 'Launch merchandise and fan experiences',
      icon: <ShoppingBag className="h-6 w-6" />,
      status: 'locked',
      onClick: () => handleQuickAction('merch')
    }
  ];

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'available':
        return <AlertCircle className="h-4 w-4 text-primary" />;
      default:
        return <Lock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return 'success';
      case 'pending':
        return 'warning';
      case 'available':
        return 'default';
      default:
        return 'secondary';
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action) => (
          <Card 
            key={action.id} 
            className={`cursor-pointer transition-all hover:shadow-lg ${
              action.status === 'locked' ? 'opacity-60' : ''
            }`}
            onClick={action.status !== 'locked' ? action.onClick : undefined}
            role="button"
            tabIndex={action.status !== 'locked' ? 0 : -1}
            aria-label={`${action.title}: ${action.description}`}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && action.status !== 'locked') {
                e.preventDefault();
                action.onClick();
              }
            }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-primary/10 rounded-lg w-fit">
                  {action.icon}
                </div>
                <div className="flex items-center gap-1">
                  {getStatusIcon(action.status)}
                  <Badge variant={getStatusColor(action.status)}>
                    {action.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold mb-2">{action.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{action.description}</p>
              
              {action.progress !== undefined && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Progress</span>
                    <span>{action.progress}%</span>
                  </div>
                  <Progress value={action.progress} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="offers">Active Offers</TabsTrigger>
          <TabsTrigger value="content">Content Pipeline</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
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
        </TabsContent>

        <TabsContent value="offers">
          <Card>
            <CardHeader>
              <CardTitle>Active Brand Offers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                No active offers at this time. Check back soon!
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Content Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Content management tools coming soon.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="earnings">
          <Card>
            <CardHeader>
              <CardTitle>Earnings Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Detailed earnings analytics coming soon.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
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
                {quickActions.find(a => a.id === activeModal)?.title}
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