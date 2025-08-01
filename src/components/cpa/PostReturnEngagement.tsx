import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  Calendar, 
  FileText, 
  TrendingUp, 
  Users, 
  ArrowRight,
  Crown,
  Star,
  Send,
  Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CompletedReturn {
  id: string;
  clientName: string;
  returnType: string;
  completedDate: string;
  refundAmount?: number;
  nextStepsTriggered: boolean;
  engagementStatus: 'pending' | 'sent' | 'responded' | 'scheduled';
}

interface PlanningGuide {
  id: string;
  title: string;
  category: string;
  description: string;
  targetAudience: string[];
  priority: 'high' | 'medium' | 'low';
}

interface UpsellOpportunity {
  id: string;
  service: string;
  description: string;
  estimatedValue: number;
  applicableClients: number;
  conversionRate: number;
}

const mockCompletedReturns: CompletedReturn[] = [
  {
    id: '1',
    clientName: 'John & Mary Smith',
    returnType: 'Form 1040',
    completedDate: '2024-02-15',
    refundAmount: 3200,
    nextStepsTriggered: false,
    engagementStatus: 'pending'
  },
  {
    id: '2',
    clientName: 'Tech Solutions LLC',
    returnType: 'Form 1120S',
    completedDate: '2024-02-14',
    nextStepsTriggered: true,
    engagementStatus: 'sent'
  },
  {
    id: '3',
    clientName: 'Robert Johnson',
    returnType: 'Form 1040',
    completedDate: '2024-02-13',
    refundAmount: 1850,
    nextStepsTriggered: true,
    engagementStatus: 'responded'
  }
];

const planningGuides: PlanningGuide[] = [
  {
    id: '1',
    title: 'Quarterly Tax Planning Checklist',
    category: 'Tax Planning',
    description: 'Essential tax planning strategies for the upcoming quarter',
    targetAudience: ['individuals', 'small_business'],
    priority: 'high'
  },
  {
    id: '2',
    title: 'Year-End Tax Strategies',
    category: 'Tax Planning',
    description: 'Maximize deductions and minimize tax liability',
    targetAudience: ['individuals', 'high_net_worth'],
    priority: 'high'
  },
  {
    id: '3',
    title: 'Estate Planning Basics',
    category: 'Estate Planning',
    description: 'Introduction to estate planning for growing families',
    targetAudience: ['individuals', 'families'],
    priority: 'medium'
  },
  {
    id: '4',
    title: 'Business Structure Optimization',
    category: 'Business Planning',
    description: 'Choosing the right business entity for tax efficiency',
    targetAudience: ['small_business', 'entrepreneurs'],
    priority: 'medium'
  }
];

const upsellOpportunities: UpsellOpportunity[] = [
  {
    id: '1',
    service: 'Family Office Dashboard Access',
    description: 'Premium wealth management platform with advanced analytics',
    estimatedValue: 2500,
    applicableClients: 45,
    conversionRate: 25
  },
  {
    id: '2',
    service: 'Quarterly Tax Planning',
    description: 'Ongoing tax planning and strategy consultation',
    estimatedValue: 1500,
    applicableClients: 78,
    conversionRate: 35
  },
  {
    id: '3',
    service: 'Estate Planning Services',
    description: 'Comprehensive estate planning and document preparation',
    estimatedValue: 3500,
    applicableClients: 32,
    conversionRate: 15
  },
  {
    id: '4',
    service: 'Business Advisory Services',
    description: 'Strategic business consulting and financial planning',
    estimatedValue: 5000,
    applicableClients: 23,
    conversionRate: 20
  }
];

export function PostReturnEngagement() {
  const [completedReturns, setCompletedReturns] = useState<CompletedReturn[]>(mockCompletedReturns);
  const [selectedGuides, setSelectedGuides] = useState<string[]>([]);
  const [automationEnabled, setAutomationEnabled] = useState(true);
  const { toast } = useToast();

  const triggerPostReturnEngagement = async (returnId: string) => {
    try {
      const returnData = completedReturns.find(r => r.id === returnId);
      if (!returnData) return;

      // Trigger automated engagement sequence
      const { error } = await supabase.functions.invoke('trigger-post-return-engagement', {
        body: {
          returnId: returnId,
          clientName: returnData.clientName,
          returnType: returnData.returnType,
          refundAmount: returnData.refundAmount,
          automatedSequence: true
        }
      });

      if (error) throw error;

      setCompletedReturns(prev => prev.map(r => 
        r.id === returnId 
          ? { ...r, nextStepsTriggered: true, engagementStatus: 'sent' }
          : r
      ));

      toast({
        title: "Engagement triggered",
        description: `Post-return engagement sequence started for ${returnData.clientName}`,
      });
    } catch (error: any) {
      toast({
        title: "Error triggering engagement",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const triggerBulkEngagement = async () => {
    const pendingReturns = completedReturns.filter(r => !r.nextStepsTriggered);
    
    try {
      for (const returnData of pendingReturns) {
        await triggerPostReturnEngagement(returnData.id);
      }
      
      toast({
        title: "Bulk engagement triggered",
        description: `Engagement sequences started for ${pendingReturns.length} clients`,
      });
    } catch (error: any) {
      toast({
        title: "Error with bulk engagement",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const sendPlanningGuides = async (clientId: string, guideIds: string[]) => {
    try {
      const guides = planningGuides.filter(g => guideIds.includes(g.id));
      
      const { error } = await supabase.functions.invoke('send-planning-guides', {
        body: {
          clientId,
          guides: guides.map(g => ({
            title: g.title,
            category: g.category,
            description: g.description
          }))
        }
      });

      if (error) throw error;

      toast({
        title: "Planning guides sent",
        description: `${guides.length} planning guides sent to client`,
      });
    } catch (error: any) {
      toast({
        title: "Error sending guides",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const pendingEngagements = completedReturns.filter(r => !r.nextStepsTriggered).length;
  const totalRevenuePotential = upsellOpportunities.reduce((sum, opp) => 
    sum + (opp.estimatedValue * opp.applicableClients * opp.conversionRate / 100), 0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Post-Return Client Engagement
          </h3>
          <p className="text-muted-foreground">
            Automated follow-up and upsell opportunities after tax return completion
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="px-3 py-1">
            {pendingEngagements} Pending
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            ${Math.round(totalRevenuePotential).toLocaleString()} Revenue Potential
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="completed" className="space-y-6">
        <TabsList>
          <TabsTrigger value="completed">Completed Returns</TabsTrigger>
          <TabsTrigger value="guides">Planning Guides</TabsTrigger>
          <TabsTrigger value="upsell">Upsell Opportunities</TabsTrigger>
          <TabsTrigger value="automation">Automation Settings</TabsTrigger>
        </TabsList>

        {/* Completed Returns */}
        <TabsContent value="completed" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium">Recently Completed Returns</h4>
              <p className="text-sm text-muted-foreground">
                Trigger post-return engagement sequences
              </p>
            </div>
            <Button onClick={triggerBulkEngagement} disabled={pendingEngagements === 0}>
              <Send className="w-4 h-4 mr-2" />
              Trigger All ({pendingEngagements})
            </Button>
          </div>

          <div className="space-y-3">
            {completedReturns.map((returnData) => (
              <Card key={returnData.id} className={`${returnData.nextStepsTriggered ? 'border-green-500' : 'border-yellow-500'}`}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{returnData.clientName}</h4>
                        <Badge variant="outline" className="text-xs">
                          {returnData.returnType}
                        </Badge>
                        {returnData.refundAmount && (
                          <Badge className="text-xs bg-green-100 text-green-700">
                            ${returnData.refundAmount.toLocaleString()} Refund
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Completed: {new Date(returnData.completedDate).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">Status</div>
                        <Badge 
                          variant={returnData.engagementStatus === 'pending' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {returnData.engagementStatus}
                        </Badge>
                      </div>
                      
                      {!returnData.nextStepsTriggered ? (
                        <Button 
                          onClick={() => triggerPostReturnEngagement(returnData.id)}
                          size="sm"
                        >
                          <ArrowRight className="w-4 h-4 mr-2" />
                          Trigger Next Steps
                        </Button>
                      ) : (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm">Triggered</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Planning Guides */}
        <TabsContent value="guides" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium">Tax Planning Guides</h4>
              <p className="text-sm text-muted-foreground">
                Send targeted planning guides to clients based on their profile
              </p>
            </div>
            <Button 
              onClick={() => sendPlanningGuides('bulk', selectedGuides)}
              disabled={selectedGuides.length === 0}
            >
              <Send className="w-4 h-4 mr-2" />
              Send Selected ({selectedGuides.length})
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {planningGuides.map((guide) => (
              <Card 
                key={guide.id}
                className={`cursor-pointer transition-all ${
                  selectedGuides.includes(guide.id) 
                    ? 'border-primary ring-2 ring-primary/20' 
                    : 'hover:border-primary/50'
                }`}
                onClick={() => {
                  setSelectedGuides(prev => 
                    prev.includes(guide.id)
                      ? prev.filter(id => id !== guide.id)
                      : [...prev, guide.id]
                  );
                }}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center justify-between">
                    {guide.title}
                    <div className="flex items-center gap-1">
                      <Badge 
                        variant={guide.priority === 'high' ? 'destructive' : guide.priority === 'medium' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {guide.priority}
                      </Badge>
                      {selectedGuides.includes(guide.id) && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {guide.category}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    {guide.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {guide.targetAudience.map((audience) => (
                      <Badge key={audience} variant="outline" className="text-xs">
                        {audience.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Upsell Opportunities */}
        <TabsContent value="upsell" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Revenue Potential Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Revenue Potential</span>
                    <span className="font-bold text-green-600">
                      ${Math.round(totalRevenuePotential).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Applicable Clients</span>
                    <span className="font-medium">
                      {upsellOpportunities.reduce((sum, opp) => sum + opp.applicableClients, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Average Conversion</span>
                    <span className="font-medium">
                      {Math.round(upsellOpportunities.reduce((sum, opp) => sum + opp.conversionRate, 0) / upsellOpportunities.length)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Top Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {upsellOpportunities
                    .sort((a, b) => (b.estimatedValue * b.applicableClients * b.conversionRate) - (a.estimatedValue * a.applicableClients * a.conversionRate))
                    .slice(0, 3)
                    .map((opp, index) => (
                      <div key={opp.id} className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                          index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-600'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{opp.service}</div>
                          <div className="text-xs text-muted-foreground">
                            ${Math.round(opp.estimatedValue * opp.applicableClients * opp.conversionRate / 100).toLocaleString()} potential
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {upsellOpportunities.map((opportunity) => (
              <Card key={opportunity.id}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{opportunity.service}</h4>
                        {opportunity.service.includes('Family Office') && (
                          <Crown className="w-4 h-4 text-yellow-500" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {opportunity.description}
                      </p>
                      <div className="flex gap-3 text-xs text-muted-foreground">
                        <span>Value: ${opportunity.estimatedValue.toLocaleString()}</span>
                        <span>Clients: {opportunity.applicableClients}</span>
                        <span>Conversion: {opportunity.conversionRate}%</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        ${Math.round(opportunity.estimatedValue * opportunity.applicableClients * opportunity.conversionRate / 100).toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">Revenue Potential</div>
                      <Button size="sm" className="mt-2">
                        <Star className="w-4 h-4 mr-2" />
                        Create Campaign
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Automation Settings */}
        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Automation Configuration</CardTitle>
              <CardDescription>
                Configure automated post-return engagement sequences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Auto-trigger Engagement</h4>
                  <p className="text-sm text-muted-foreground">
                    Automatically send post-return communications when returns are completed
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={automationEnabled}
                    onChange={(e) => setAutomationEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Engagement Timeline</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Day 1: Return Delivery</div>
                      <div className="text-xs text-muted-foreground">Send completed return and planning guide</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Calendar className="w-4 h-4 text-green-500" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Day 3: Follow-up</div>
                      <div className="text-xs text-muted-foreground">Schedule next year planning consultation</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Crown className="w-4 h-4 text-yellow-500" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Day 7: Premium Services</div>
                      <div className="text-xs text-muted-foreground">Introduce Family Office Dashboard (qualifying clients)</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}