import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, 
  TrendingUp, 
  Clock, 
  Star, 
  Phone, 
  Mail, 
  Calendar,
  Award,
  BarChart3,
  Settings
} from 'lucide-react';
import { useLeadScoring, LeadWithScore } from '@/hooks/useLeadScoring';
import { LeadScoringConfig } from './LeadScoringConfig';
import { EngagementTracker } from './EngagementTracker';

export function LeadScoringDashboard() {
  const { 
    loading, 
    getLeadsWithScores, 
    getTopScoringLeads,
    updateLeadStatus,
    trackEngagement
  } = useLeadScoring();
  
  const [leads, setLeads] = useState<LeadWithScore[]>([]);
  const [topLeads, setTopLeads] = useState<LeadWithScore[]>([]);
  const [selectedLead, setSelectedLead] = useState<LeadWithScore | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [allLeads, topScoringLeads] = await Promise.all([
        getLeadsWithScores(),
        getTopScoringLeads(5)
      ]);
      setLeads(allLeads);
      setTopLeads(topScoringLeads);
    } catch (error) {
      console.error('Error loading leads:', error);
    }
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getScoreCategory = (score: number) => {
    if (score >= 80) return 'Hot';
    if (score >= 60) return 'Warm';
    if (score >= 40) return 'Cool';
    return 'Cold';
  };

  const handleEngagementTrack = async (leadId: string, type: string) => {
    await trackEngagement(leadId, type);
    loadData(); // Refresh to see updated scores
  };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    await updateLeadStatus(leadId, newStatus);
    loadData(); // Refresh data
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Lead Scoring Dashboard</h1>
          <p className="text-muted-foreground">AI-powered lead prioritization and automation</p>
        </div>
        <Button 
          onClick={loadData} 
          disabled={loading}
          className="gap-2"
        >
          <TrendingUp className="h-4 w-4" />
          Refresh Scores
        </Button>
      </div>

      {/* Top Scoring Leads */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Top Priority Leads
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {topLeads.map((lead) => (
              <Card key={lead.id} className="hover:shadow-md transition-shadow cursor-pointer" 
                    onClick={() => setSelectedLead(lead)}>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm">
                        {lead.first_name} {lead.last_name}
                      </h3>
                      <Badge className={`${getScoreBadgeColor(lead.lead_score)} text-white`}>
                        {lead.lead_score}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{lead.email}</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Value:</span>
                        <span className="font-medium">{formatCurrency(lead.lead_value)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Category:</span>
                        <span className="font-medium">{getScoreCategory(lead.lead_score)}</span>
                      </div>
                    </div>
                    <div className="flex gap-1 mt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEngagementTrack(lead.id, 'email_opened');
                        }}
                      >
                        <Mail className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEngagementTrack(lead.id, 'phone_answered');
                        }}
                      >
                        <Phone className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEngagementTrack(lead.id, 'meeting_booked');
                        }}
                      >
                        <Calendar className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="leads" className="space-y-4">
        <TabsList>
          <TabsTrigger value="leads">All Leads</TabsTrigger>
          <TabsTrigger value="engagement">Engagement Tracking</TabsTrigger>
          <TabsTrigger value="config">Pipeline Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="leads">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Lead Scoring Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leads.map((lead) => (
                  <div key={lead.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">
                          {lead.first_name} {lead.last_name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{lead.email}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm">Value: {formatCurrency(lead.lead_value)}</span>
                          <Badge variant="outline">{lead.lead_status}</Badge>
                          <Badge variant="outline">{lead.lead_source}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={`${getScoreBadgeColor(lead.lead_score)} text-white text-lg px-3 py-1`}>
                          {lead.lead_score}/100
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          {getScoreCategory(lead.lead_score)} Lead
                        </p>
                      </div>
                    </div>

                    {/* Score Breakdown */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Engagement</span>
                          <span>{lead.engagement_score}/30</span>
                        </div>
                        <Progress value={(lead.engagement_score / 30) * 100} className="h-2" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Budget</span>
                          <span>{lead.budget_score}/25</span>
                        </div>
                        <Progress value={(lead.budget_score / 25) * 100} className="h-2" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Timeline</span>
                          <span>{lead.timeline_score}/25</span>
                        </div>
                        <Progress value={(lead.timeline_score / 25) * 100} className="h-2" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Fit</span>
                          <span>{lead.fit_score}/20</span>
                        </div>
                        <Progress value={(lead.fit_score / 20) * 100} className="h-2" />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 flex-wrap">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEngagementTrack(lead.id, 'email_opened')}
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        Email Opened
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEngagementTrack(lead.id, 'email_replied')}
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        Email Replied
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEngagementTrack(lead.id, 'phone_answered')}
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        Call Answered
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEngagementTrack(lead.id, 'meeting_booked')}
                      >
                        <Calendar className="h-4 w-4 mr-1" />
                        Meeting Booked
                      </Button>
                      
                      {/* Status Change Buttons */}
                      <select 
                        value={lead.lead_status || ''}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        className="px-3 py-1 border rounded text-sm"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="closed_won">Closed Won</option>
                        <option value="closed_lost">Closed Lost</option>
                      </select>
                    </div>

                    {/* Next Follow-up */}
                    {lead.next_follow_up_due && (
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Next follow-up: {new Date(lead.next_follow_up_due).toLocaleString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement">
          <EngagementTracker />
        </TabsContent>

        <TabsContent value="config">
          <LeadScoringConfig />
        </TabsContent>
      </Tabs>
    </div>
  );
}