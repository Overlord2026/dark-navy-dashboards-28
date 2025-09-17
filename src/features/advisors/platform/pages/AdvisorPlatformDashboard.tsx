import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  ArrowRight,
  Plus,
  Clock,
  Target,
  Mic,
  FileText,
  UserCheck,
  CalendarPlus,
  Send,
  Activity
} from 'lucide-react';
import { getDashboardKPIs, getRecentActivity, getActivityStatusStyle, getActivityTypeColor } from '../state/dashboardSelectors';

// Quick action buttons for the dashboard
const quickActions = [
  {
    title: 'Add Prospect',
    description: 'Capture a new lead',
    icon: Plus,
    route: '/pros/advisors/platform/prospects',
    variant: 'default' as const,
    color: 'bg-primary text-primary-foreground hover:bg-primary/90'
  },
  {
    title: 'Invite Client',
    description: 'Send magic link invite',
    icon: Send,
    route: '/pros/advisors/platform/invite',
    variant: 'outline' as const,
    color: 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20'
  },
  {
    title: 'Schedule Meeting',
    description: 'Book consultation',
    icon: CalendarPlus,
    route: '/pros/advisors/platform/calendar',
    variant: 'outline' as const,
    color: 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
  },
  {
    title: 'Send Questionnaire',
    description: 'Client assessment',
    icon: Send,
    route: '/pros/advisors/platform/questionnaires',
    variant: 'outline' as const,
    color: 'bg-accent text-accent-foreground hover:bg-accent/80'
  }
];

// Activity type icon mapping
const activityIcons = {
  conversion: UserCheck,
  meeting: Calendar,
  questionnaire: FileText,
  recording: Mic,
  prospect: Users
};

export default function AdvisorPlatformDashboard() {
  const navigate = useNavigate();
  const kpis = getDashboardKPIs();
  const recentActivity = getRecentActivity();

  const handleQuickAction = (action: typeof quickActions[0]) => {
    navigate(action.route);
  };

  return (
    <>
      <Helmet>
        <title>Advisor Platform Dashboard | Business Intelligence & Management</title>
        <meta name="description" content="Comprehensive advisor platform dashboard with prospect management, recording analysis, and ROI tracking" />
      </Helmet>

      <div className="space-y-8">
        {/* Welcome Section with Quick Actions */}
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Platform Dashboard</h1>
              <p className="text-muted-foreground text-lg">
                Complete advisor toolkit with integrated prospect and client management
              </p>
            </div>
            <Badge variant="outline" className="text-sm">
              <Clock className="w-3 h-3 mr-1" />
              Last updated: Now
            </Badge>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant}
                size="lg"
                className="h-auto p-4 justify-start"
                onClick={() => handleQuickAction(action)}
              >
                <action.icon className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">{action.title}</div>
                  <div className="text-xs opacity-80">{action.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-foreground">Key Performance Indicators</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Total Prospects</p>
                    <p className="text-3xl font-bold text-foreground">{kpis.totalProspects}</p>
                    <p className="text-xs text-muted-foreground mt-1">All-time count</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Active Prospects</p>
                    <p className="text-3xl font-bold text-foreground">{kpis.activeProspects}</p>
                    <p className="text-xs text-muted-foreground mt-1">In pipeline</p>
                  </div>
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Meetings Scheduled</p>
                    <p className="text-3xl font-bold text-foreground">{kpis.meetingsScheduled}</p>
                    <p className="text-xs text-muted-foreground mt-1">This month</p>
                  </div>
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Conversions</p>
                    <p className="text-3xl font-bold text-foreground">{kpis.conversions}</p>
                    <p className="text-xs text-green-600 mt-1">{kpis.conversionRate}% rate</p>
                  </div>
                  <div className="p-3 bg-yellow-500/10 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Activity
            </h2>
            <Button variant="outline" size="sm">
              View All Activity
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity, index) => {
                  const IconComponent = activityIcons[activity.type];
                  return (
                    <div key={activity.id} className="flex items-center gap-4 p-4 rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex-shrink-0">
                        <div className={`p-2 rounded-lg bg-background border ${getActivityTypeColor(activity.type)}`}>
                          <IconComponent className={`w-4 h-4 ${getActivityTypeColor(activity.type)}`} />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground truncate">{activity.title}</h3>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getActivityStatusStyle(activity.status)}`}
                          >
                            {activity.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">{activity.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Platform Performance Summary */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-foreground">Platform Overview</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">This Week's Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">New prospects added</span>
                    <span className="font-semibold text-foreground">+12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Meetings completed</span>
                    <span className="font-semibold text-foreground">8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Questionnaires sent</span>
                    <span className="font-semibold text-foreground">15</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Conversions achieved</span>
                    <span className="font-semibold text-green-600">3</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Next Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-2 rounded border border-border">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-sm text-foreground">3 meetings scheduled for today</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded border border-border">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-foreground">5 questionnaire responses pending review</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded border border-border">
                    <Users className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-foreground">7 prospects need follow-up</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </>
  );
}