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
  Layout
} from 'lucide-react';

const quickActions = [
  {
    title: 'Add New Prospect',
    description: 'Capture a new lead',
    icon: Plus,
    route: '/pros/advisors/platform/prospects',
    variant: 'default' as const
  },
  {
    title: 'Schedule Meeting',
    description: 'Book client consultation',
    icon: Calendar,
    route: '/pros/advisors/platform/calendar',
    variant: 'outline' as const
  },
  {
    title: 'Review Recordings',
    description: 'Analyze call recordings',
    icon: Mic,
    route: '/pros/advisors/platform/recordings',
    variant: 'outline' as const
  },
  {
    title: 'Track ROI',
    description: 'Monitor campaign performance',
    icon: Target,
    route: '/pros/advisors/platform/roi',
    variant: 'outline' as const
  }
];

const platformStats = [
  {
    title: 'Active Prospects',
    value: '32',
    change: '+5 this week',
    icon: Users,
    color: 'text-blue-600'
  },
  {
    title: 'Recordings',
    value: '18',
    change: '3 pending review',
    icon: Mic,
    color: 'text-green-600'
  },
  {
    title: 'Templates',
    value: '24',
    change: '2 new this month',
    icon: Layout,
    color: 'text-purple-600'
  },
  {
    title: 'ROI Score',
    value: '8.5%',
    change: '+1.2% improvement',
    icon: TrendingUp,
    color: 'text-yellow-600'
  }
];

const recentActivity = [
  {
    type: 'recording',
    title: 'New recording processed: Client consultation with Smith Family',
    time: '2 hours ago',
    status: 'completed'
  },
  {
    type: 'prospect',
    title: 'High-value prospect added: Johnson Trust (Estate Planning)',
    time: '4 hours ago',
    status: 'new'
  },
  {
    type: 'template',
    title: 'Updated email template: Retirement Planning Sequence #3',
    time: '1 day ago',
    status: 'updated'
  },
  {
    type: 'questionnaire',
    title: 'New questionnaire response: Risk Assessment - Davis Family',
    time: '2 days ago',
    status: 'pending'
  }
];

export default function AdvisorPlatformDashboard() {
  const navigate = useNavigate();

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
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Platform Dashboard</h1>
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
        <section>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Card 
                key={index}
                className="cursor-pointer hover:shadow-md transition-shadow group"
                onClick={() => handleQuickAction(action)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <action.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium group-hover:text-primary transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Platform Stats */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Platform Metrics</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {platformStats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                    </div>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Recent Platform Activity */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Platform Activity</h2>
            <Button variant="outline" size="sm">
              View All Activity
            </Button>
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === 'completed' ? 'bg-green-500' :
                      activity.status === 'new' ? 'bg-blue-500' :
                      activity.status === 'updated' ? 'bg-purple-500' :
                      'bg-yellow-500'
                    }`} />
                    <div className="flex-1">
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  );
}