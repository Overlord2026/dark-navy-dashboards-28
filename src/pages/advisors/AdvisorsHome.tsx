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
  Target
} from 'lucide-react';

const quickActions = [
  {
    title: 'Add New Lead',
    description: 'Capture a new prospect',
    icon: Plus,
    route: '/advisors/leads',
    variant: 'default' as const
  },
  {
    title: 'Schedule Meeting',
    description: 'Book client consultation',
    icon: Calendar,
    route: '/advisors/meetings',
    variant: 'outline' as const
  },
  {
    title: 'Review Pipeline',
    description: 'Check deal progress',
    icon: TrendingUp,
    route: '/advisors/pipeline',
    variant: 'outline' as const
  },
  {
    title: 'Launch Campaign',
    description: 'Start outreach sequence',
    icon: Target,
    route: '/advisors/campaigns',
    variant: 'outline' as const
  }
];

const dashboardStats = [
  {
    title: 'Active Leads',
    value: '24',
    change: '+3 this week',
    icon: Users,
    color: 'text-blue-600'
  },
  {
    title: 'Meetings Today',
    value: '5',
    change: '2 pending',
    icon: Calendar,
    color: 'text-green-600'
  },
  {
    title: 'Pipeline Value',
    value: '$485K',
    change: '+12% this month',
    icon: DollarSign,
    color: 'text-yellow-600'
  },
  {
    title: 'Conversion Rate',
    value: '18.5%',
    change: '+2.1% improvement',
    icon: TrendingUp,
    color: 'text-purple-600'
  }
];

const recentActivity = [
  {
    type: 'meeting',
    title: 'Client consultation with Sarah Johnson',
    time: '2 hours ago',
    status: 'completed'
  },
  {
    type: 'lead',
    title: 'New lead: Michael Chen (High Net Worth)',
    time: '4 hours ago',
    status: 'new'
  },
  {
    type: 'proposal',
    title: 'Proposal sent to Davis Family Trust',
    time: '1 day ago',
    status: 'pending'
  },
  {
    type: 'campaign',
    title: 'Q4 Retirement Planning campaign launched',
    time: '2 days ago',
    status: 'active'
  }
];

export default function AdvisorsHome() {
  const navigate = useNavigate();

  const handleQuickAction = (action: typeof quickActions[0]) => {
    navigate(action.route);
  };

  return (
    <>
      <Helmet>
        <title>Advisor Dashboard | Business Overview & Quick Actions</title>
        <meta name="description" content="Advisor dashboard with key metrics, recent activity, and quick actions for managing your practice" />
      </Helmet>

      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Good morning, Alex!</h1>
            <p className="text-muted-foreground text-lg">
              Here's what's happening with your practice today
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

        {/* Dashboard Stats */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {dashboardStats.map((stat, index) => (
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

        {/* Recent Activity */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Activity</h2>
            <Button variant="outline" size="sm">
              View All
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
                      activity.status === 'pending' ? 'bg-yellow-500' :
                      'bg-purple-500'
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