import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/context/UserContext';
import { TrendingUp, Users, DollarSign, Target, Calendar, MessageSquare } from 'lucide-react';

interface CoachStats {
  totalAdvisors: number;
  activeAdvisors: number;
  totalEarnings: number;
  referralEarnings: number;
  newLeadsThisMonth: number;
  demoConversion: number;
}

interface AdvisorRosterItem {
  id: string;
  name: string;
  email: string;
  engagementScore: number;
  practiceScore: number;
  status: 'active' | 'inactive';
}

export function CoachDashboard() {
  const { userProfile } = useUser();
  const [stats, setStats] = useState<CoachStats>({
    totalAdvisors: 0,
    activeAdvisors: 0,
    totalEarnings: 0,
    referralEarnings: 0,
    newLeadsThisMonth: 0,
    demoConversion: 0
  });
  const [advisorRoster, setAdvisorRoster] = useState<AdvisorRosterItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userProfile) {
      fetchCoachData();
    }
  }, [userProfile]);

  const fetchCoachData = async () => {
    try {
      setLoading(true);
      
      // Mock data for demo purposes
      setStats({
        totalAdvisors: 12,
        activeAdvisors: 8,
        totalEarnings: 85000,
        referralEarnings: 15000,
        newLeadsThisMonth: 23,
        demoConversion: 68.5
      });
      
      setAdvisorRoster([
        {
          id: '1',
          name: 'John Smith',
          email: 'john@example.com',
          engagementScore: 85,
          practiceScore: 92,
          status: 'active'
        },
        {
          id: '2',
          name: 'Jane Doe',
          email: 'jane@example.com',
          engagementScore: 78,
          practiceScore: 88,
          status: 'active'
        },
        {
          id: '3',
          name: 'Bob Wilson',
          email: 'bob@example.com',
          engagementScore: 65,
          practiceScore: 75,
          status: 'inactive'
        }
      ]);
      
    } catch (error) {
      console.error('Error fetching coach data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!userProfile) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
            <p className="text-muted-foreground">This dashboard is only available to coaches.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={undefined} />
            <AvatarFallback>
              {userProfile?.firstName?.charAt(0)}{userProfile?.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">
              {userProfile?.firstName} {userProfile?.lastName}
            </h1>
            <p className="text-muted-foreground">Practice Coach Dashboard</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Check-in
          </Button>
          <Button>
            <MessageSquare className="h-4 w-4 mr-2" />
            Send Update
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Advisors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAdvisors}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeAdvisors} active this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newLeadsThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.demoConversion.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Lead to client
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Advisor Roster */}
      <Card>
        <CardHeader>
          <CardTitle>Advisor Roster</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {advisorRoster.map((advisor) => (
              <div key={advisor.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{advisor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{advisor.name}</h4>
                    <p className="text-sm text-muted-foreground">{advisor.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm">Engagement: {advisor.engagementScore}%</p>
                    <p className="text-sm">Practice: {advisor.practiceScore}%</p>
                  </div>
                  <Badge className={getStatusColor(advisor.status)}>
                    {advisor.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}