import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  Download, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Award, 
  FileText, 
  Briefcase,
  Target,
  CheckCircle2,
  Clock,
  AlertCircle,
  Star,
  MessageSquare,
  Calendar,
  Plus,
  Eye,
  Lightbulb
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface InteractiveDemoProps {
  role: string;
  onFeedback?: (feedback: string) => void;
}

export function InteractiveProfessionalDemo({ role, onFeedback }: InteractiveDemoProps) {
  const [demoData, setDemoData] = useState<any>({});
  const [userInteraction, setUserInteraction] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    // Initialize role-specific demo data
    initializeDemo();
  }, [role]);

  const initializeDemo = () => {
    const roleData = getRoleSpecificData(role);
    setDemoData(roleData);
  };

  const handleInteraction = () => {
    setUserInteraction(prev => prev + 1);
    if (userInteraction === 2) {
      // Trigger celebration after 3 interactions
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
    }
  };

  const submitFeedback = () => {
    if (onFeedback) {
      onFeedback(feedback);
    }
    setShowFeedback(false);
    setFeedback('');
    confetti({
      particleCount: 30,
      spread: 50,
      colors: ['#FFC700', '#00D2FF'],
      origin: { y: 0.8 }
    });
  };

  const getRoleSpecificData = (role: string) => {
    const roleConfigs: Record<string, any> = {
      'private_banker': {
        title: 'Private Banking Dashboard',
        metrics: {
          clientsManaged: 47,
          assetsUnderManagement: 125000000,
          avgClientValue: 2.7,
          trustAccounts: 23
        },
        features: ['Trust Management', 'Wealth Planning', 'Estate Services', 'Family Governance'],
        demoActions: [
          'View Trust Performance',
          'Schedule Family Meeting',
          'Generate Wealth Report',
          'Review Estate Plan'
        ]
      },
      'estate_planner': {
        title: 'Estate Planning Console',
        metrics: {
          activePlans: 34,
          documentsGenerated: 127,
          avgPlanValue: 850000,
          complianceScore: 98.5
        },
        features: ['Will & Trust Creation', 'Tax Optimization', 'Succession Planning', 'Charitable Giving'],
        demoActions: [
          'Create Estate Plan',
          'Review Tax Strategy',
          'Update Beneficiaries',
          'Schedule Review Meeting'
        ]
      },
      'business_succession_advisor': {
        title: 'Business Succession Center',
        metrics: {
          businessesServed: 18,
          avgBusinessValue: 3200000,
          successionsCompleted: 12,
          timeToExit: 18
        },
        features: ['Exit Planning', 'Valuation Analysis', 'Tax Strategy', 'Succession Timeline'],
        demoActions: [
          'Business Valuation',
          'Create Exit Strategy',
          'Review Tax Impact',
          'Update Succession Plan'
        ]
      },
      'insurance_specialist': {
        title: 'Insurance & Risk Planning',
        metrics: {
          policiesManaged: 156,
          totalCoverage: 45000000,
          claimsProcessed: 23,
          clientSatisfaction: 96.8
        },
        features: ['Life Insurance', 'Disability Coverage', 'LTC Planning', 'Risk Assessment'],
        demoActions: [
          'Analyze Coverage Gap',
          'Quote Life Insurance',
          'Review Policy Performance',
          'Process Claim'
        ]
      },
      'property_manager': {
        title: 'Property Management Hub',
        metrics: {
          propertiesManaged: 89,
          totalValue: 78000000,
          occupancyRate: 94.2,
          avgRent: 4500
        },
        features: ['Portfolio Overview', 'Maintenance Tracking', 'Tenant Management', 'Financial Reports'],
        demoActions: [
          'Schedule Maintenance',
          'Review Lease Terms',
          'Generate P&L Report',
          'Market Analysis'
        ]
      },
      'philanthropy_consultant': {
        title: 'Philanthropy Advisory',
        metrics: {
          foundationsManaged: 12,
          totalGiving: 8500000,
          impactScore: 87.3,
          programsSupported: 45
        },
        features: ['Giving Strategy', 'Foundation Management', 'Impact Measurement', 'Tax Planning'],
        demoActions: [
          'Plan Giving Strategy',
          'Measure Impact',
          'Review Foundation',
          'Tax Optimization'
        ]
      },
      'healthcare_advocate': {
        title: 'Healthcare Advocacy Center',
        metrics: {
          clientsServed: 67,
          advocacyCases: 134,
          avgSavings: 15000,
          successRate: 91.2
        },
        features: ['Medical Advocacy', 'Insurance Navigation', 'Care Coordination', 'Cost Analysis'],
        demoActions: [
          'Review Medical Bills',
          'Coordinate Care',
          'Appeal Insurance',
          'Find Specialists'
        ]
      },
      'luxury_concierge': {
        title: 'Luxury Concierge Services',
        metrics: {
          activeClients: 28,
          requestsCompleted: 245,
          avgRequestValue: 8500,
          satisfaction: 98.9
        },
        features: ['Travel Planning', 'Event Management', 'Personal Shopping', 'Lifestyle Services'],
        demoActions: [
          'Plan Vacation',
          'Book Restaurant',
          'Personal Shopping',
          'Event Planning'
        ]
      },
      'family_law_advisor': {
        title: 'Family Law Practice',
        metrics: {
          activeCases: 23,
          mediationsCompleted: 67,
          avgCaseValue: 125000,
          resolutionRate: 89.4
        },
        features: ['Divorce Mediation', 'Asset Division', 'Custody Planning', 'Prenuptial Agreements'],
        demoActions: [
          'Draft Agreement',
          'Schedule Mediation',
          'Asset Valuation',
          'File Documents'
        ]
      },
      'platform_aggregator': {
        title: 'Multi-Family Office Platform',
        metrics: {
          familyOffices: 8,
          totalAUM: 2400000000,
          integrations: 34,
          efficiency: 76.8
        },
        features: ['Office Integration', 'Consolidated Reporting', 'Shared Resources', 'Best Practices'],
        demoActions: [
          'Consolidate Reports',
          'Share Resources',
          'Benchmark Performance',
          'Integrate Systems'
        ]
      }
    };

    return roleConfigs[role] || {
      title: 'Professional Dashboard',
      metrics: { clients: 25, revenue: 125000, satisfaction: 95.2, growth: 18.5 },
      features: ['Client Management', 'Service Delivery', 'Performance Tracking', 'Growth Planning'],
      demoActions: ['View Clients', 'Generate Report', 'Schedule Meeting', 'Plan Strategy']
    };
  };

  return (
    <div className="container mx-auto p-6 space-y-6 animate-fade-in">
      {/* Header with Demo Badge */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{demoData.title}</h1>
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
              Interactive Demo
            </Badge>
          </div>
          <p className="text-lg text-muted-foreground">
            🚀 Full dashboard coming soon—your feedback shapes what's next!
          </p>
        </div>
        <Button 
          onClick={() => setShowFeedback(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          <Lightbulb className="h-4 w-4 mr-2" />
          Share Feedback
        </Button>
      </div>

      {/* Interactive Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(demoData.metrics || {}).map(([key, value], index) => (
          <Card 
            key={key} 
            className="cursor-pointer hover-scale transition-all duration-200"
            onClick={handleInteraction}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </p>
                  <p className="text-2xl font-bold">
                    {typeof value === 'number' && value > 100000 
                      ? `$${(value / 1000000).toFixed(1)}M`
                      : typeof value === 'number' && value > 1000
                      ? `${(value / 1000).toFixed(1)}K`
                      : String(value)
                    }
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  {index === 0 && <Users className="h-6 w-6 text-primary" />}
                  {index === 1 && <DollarSign className="h-6 w-6 text-primary" />}
                  {index === 2 && <TrendingUp className="h-6 w-6 text-primary" />}
                  {index === 3 && <Award className="h-6 w-6 text-primary" />}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Interactive Features Tabs */}
      <Tabs defaultValue="features" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="features">Core Features</TabsTrigger>
          <TabsTrigger value="demo">Try Demo Actions</TabsTrigger>
          <TabsTrigger value="roadmap">Coming Soon</TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(demoData.features || []).map((feature: string, index: number) => (
              <Card key={feature} className="hover-scale cursor-pointer" onClick={handleInteraction}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{feature}</h3>
                      <p className="text-sm text-muted-foreground">
                        Interactive feature preview available
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="demo" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(demoData.demoActions || []).map((action: string, index: number) => (
              <Button 
                key={action}
                variant="outline" 
                className="p-6 h-auto justify-start text-left hover-scale"
                onClick={handleInteraction}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    {index === 0 && <Eye className="h-4 w-4" />}
                    {index === 1 && <Calendar className="h-4 w-4" />}
                    {index === 2 && <FileText className="h-4 w-4" />}
                    {index === 3 && <Target className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="font-medium">{action}</p>
                    <p className="text-xs text-muted-foreground">Click to try demo</p>
                  </div>
                </div>
              </Button>
            ))}
          </div>
          
          {userInteraction > 0 && (
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200 animate-fade-in">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">Great job exploring!</p>
                    <p className="text-sm text-green-700">
                      You've tried {userInteraction} demo action{userInteraction > 1 ? 's' : ''}. 
                      The full dashboard will have complete functionality.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="roadmap" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Development Roadmap
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Interactive demo and core UI</span>
                  <Badge variant="secondary">Complete</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm">Full dashboard functionality</span>
                  <Badge variant="outline">In Progress</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Advanced analytics and reporting</span>
                  <Badge variant="outline">Planned</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Plus className="h-4 w-4 text-purple-600" />
                  <span className="text-sm">AI-powered insights and automation</span>
                  <Badge variant="outline">Future</Badge>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Want to influence our roadmap?</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Your feedback directly shapes which features we build next. Tell us what matters most to your practice.
                </p>
                <Button onClick={() => setShowFeedback(true)} size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Submit Feature Request
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Progress Indicator */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Demo Exploration Progress</span>
            <span className="text-sm text-muted-foreground">{Math.min(userInteraction * 25, 100)}%</span>
          </div>
          <Progress value={Math.min(userInteraction * 25, 100)} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            Keep exploring to unlock more demo features!
          </p>
        </CardContent>
      </Card>

      {/* Feedback Modal */}
      {showFeedback && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Share Your Feedback</CardTitle>
              <p className="text-sm text-muted-foreground">
                Help us build the perfect dashboard for {role.replace('_', ' ')} professionals
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="What features would be most valuable for your practice? What challenges do you face that this dashboard could solve?"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
              />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowFeedback(false)}>
                  Cancel
                </Button>
                <Button onClick={submitFeedback} disabled={!feedback.trim()}>
                  <Star className="h-4 w-4 mr-2" />
                  Submit Feedback
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}