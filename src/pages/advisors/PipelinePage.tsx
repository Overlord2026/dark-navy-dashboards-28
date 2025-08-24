import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Clock, 
  ArrowRight,
  Target,
  Calendar,
  CheckCircle
} from 'lucide-react';

const pipelineStages = [
  { stage: 'Leads', count: 24, value: 875000, color: 'bg-blue-500' },
  { stage: 'Qualified', count: 18, value: 650000, color: 'bg-green-500' },
  { stage: 'Proposal', count: 12, value: 485000, color: 'bg-yellow-500' },
  { stage: 'Negotiation', count: 8, value: 320000, color: 'bg-orange-500' },
  { stage: 'Closed Won', count: 5, value: 185000, color: 'bg-emerald-500' }
];

const upcomingDeals = [
  {
    id: '1',
    client: 'Davis Family Trust',
    value: '$500,000',
    stage: 'Proposal',
    probability: 75,
    closeDate: '2024-12-15',
    lastActivity: '2 days ago',
    nextAction: 'Follow up on proposal review'
  },
  {
    id: '2',
    client: 'Johnson Retirement Fund',
    value: '$250,000',
    stage: 'Negotiation',
    probability: 85,
    closeDate: '2024-11-30',
    lastActivity: '1 day ago',
    nextAction: 'Schedule contract signing'
  },
  {
    id: '3',
    client: 'Chen Investment Group',
    value: '$125,000',
    stage: 'Qualified',
    probability: 60,
    closeDate: '2024-12-31',
    lastActivity: '5 days ago',
    nextAction: 'Prepare investment proposal'
  }
];

const recentWins = [
  {
    client: 'Smith Family Office',
    value: '$750,000',
    closedDate: '2024-11-20',
    type: 'Estate Planning'
  },
  {
    client: 'Martinez Trust',
    value: '$125,000',
    closedDate: '2024-11-18',
    type: 'Retirement Planning'
  }
];

const getStageColor = (stage: string) => {
  switch (stage.toLowerCase()) {
    case 'proposal': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
    case 'negotiation': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
    case 'qualified': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
    default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
  }
};

export default function PipelinePage() {
  const totalPipelineValue = pipelineStages.reduce((sum, stage) => sum + stage.value, 0);
  const weightedValue = upcomingDeals.reduce((sum, deal) => {
    const value = parseInt(deal.value.replace(/[$,]/g, ''));
    return sum + (value * deal.probability / 100);
  }, 0);

  return (
    <>
      <Helmet>
        <title>Sales Pipeline | Deal Tracking & Forecasting</title>
        <meta name="description" content="Track your sales pipeline and forecast revenue with comprehensive deal management" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Sales Pipeline</h1>
            <p className="text-muted-foreground">
              Track deals and forecast revenue across your sales process
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Add Deal
          </Button>
        </div>

        {/* Pipeline Overview */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Pipeline</p>
                  <p className="text-2xl font-bold">${(totalPipelineValue / 1000000).toFixed(1)}M</p>
                </div>
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Weighted Value</p>
                  <p className="text-2xl font-bold">${(weightedValue / 1000).toFixed(0)}K</p>
                </div>
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Deal Size</p>
                  <p className="text-2xl font-bold">$58K</p>
                </div>
                <Target className="w-6 h-6 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Win Rate</p>
                  <p className="text-2xl font-bold">68%</p>
                </div>
                <CheckCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pipeline Stages */}
        <Card>
          <CardHeader>
            <CardTitle>Pipeline by Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pipelineStages.map((stage, index) => (
                <div key={stage.stage} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                    <div>
                      <h3 className="font-semibold">{stage.stage}</h3>
                      <p className="text-sm text-muted-foreground">{stage.count} deals</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${(stage.value / 1000).toFixed(0)}K</p>
                    <p className="text-sm text-muted-foreground">
                      {((stage.value / totalPipelineValue) * 100).toFixed(1)}% of pipeline
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upcoming Deals */}
          <Card>
            <CardHeader>
              <CardTitle>High Priority Deals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingDeals.map((deal) => (
                  <div key={deal.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{deal.client}</h3>
                        <p className="text-lg font-bold text-green-600">{deal.value}</p>
                      </div>
                      <Badge className={getStageColor(deal.stage)}>
                        {deal.stage}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Win Probability</span>
                        <span className="font-medium">{deal.probability}%</span>
                      </div>
                      <Progress value={deal.probability} className="h-2" />
                    </div>
                    
                    <div className="flex items-center justify-between mt-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Close: {deal.closeDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {deal.lastActivity}
                      </span>
                    </div>
                    
                    <div className="mt-3 p-2 bg-muted/50 rounded text-sm">
                      <strong>Next:</strong> {deal.nextAction}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Wins */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Wins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentWins.map((win, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-green-50 dark:bg-green-900/20">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{win.client}</h3>
                        <p className="text-lg font-bold text-green-600">{win.value}</p>
                        <p className="text-sm text-muted-foreground">{win.type}</p>
                      </div>
                      <div className="text-right">
                        <CheckCircle className="w-5 h-5 text-green-600 mb-1" />
                        <p className="text-sm text-muted-foreground">{win.closedDate}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" className="w-full">
                  View All Closed Deals
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}