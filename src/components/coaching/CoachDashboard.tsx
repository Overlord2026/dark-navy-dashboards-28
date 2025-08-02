import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  TrendingUp, 
  Award, 
  DollarSign, 
  UserPlus, 
  Search,
  FileText,
  Video,
  CheckSquare,
  Target,
  Calendar,
  Upload,
  Share2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { maskClientData, aggregateClientData } from '@/utils/dataPrivacy';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AdvisorRosterItem {
  id: string;
  name: string;
  avatar?: string;
  engagementScore: number;
  practiceScore: number;
  status: 'active' | 'inactive' | 'improving';
}

interface CoachStats {
  activeAdvisors: number;
  newLeadsThisMonth: number;
  demoConversion: number;
  referralEarnings: number;
}

export function CoachDashboard() {
  const { user, userProfile } = useAuth();
  const [advisorRoster, setAdvisorRoster] = useState<AdvisorRosterItem[]>([]);
  const [stats, setStats] = useState<CoachStats>({
    activeAdvisors: 0,
    newLeadsThisMonth: 0,
    demoConversion: 0,
    referralEarnings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && userProfile?.role === 'coach') {
      fetchCoachData();
    }
  }, [user, userProfile]);

  const fetchCoachData = async () => {
    try {
      setLoading(true);

      // Fetch coach's assigned advisors with masked data
      const { data: advisorData, error: advisorError } = await supabase
        .from('coach_advisor_relationships')
        .select(`
          advisor_id,
          status,
          created_at,
          advisor:advisor_profiles (
            id,
            name,
            user_id,
            is_active,
            average_rating,
            total_reviews
          )
        `)
        .eq('coach_id', user.id)
        .eq('status', 'active');

      if (advisorError) throw advisorError;

      // Fetch aggregated performance data (no PII)
      const advisorIds = advisorData?.map(rel => rel.advisor?.user_id).filter(Boolean) || [];
      
      let aggregatedStats = {
        activeAdvisors: advisorData?.length || 0,
        newLeadsThisMonth: 0,
        demoConversion: 0,
        referralEarnings: 0
      };

      if (advisorIds.length > 0) {
        // Get aggregated lead data (no personal info)
        const { data: leadStats } = await supabase
          .from('leads')
          .select('id, lead_status, created_at')
          .in('advisor_id', advisorIds)
          .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());

        const totalLeads = leadStats?.length || 0;
        const qualifiedLeads = leadStats?.filter(l => l.lead_status === 'qualified').length || 0;

        aggregatedStats.newLeadsThisMonth = totalLeads;
        aggregatedStats.demoConversion = totalLeads > 0 ? (qualifiedLeads / totalLeads) * 100 : 0;
      }

      // Get referral earnings (coach-specific data)
      const { data: referralData } = await supabase
        .from('coach_referral_payouts')
        .select('amount')
        .eq('coach_id', user.id)
        .gte('created_at', new Date(new Date().getFullYear(), 0, 1).toISOString());

      aggregatedStats.referralEarnings = referralData?.reduce((sum, payout) => sum + payout.amount, 0) || 0;

      // Transform advisor data with privacy protection
      const maskedAdvisorRoster: AdvisorRosterItem[] = advisorData?.map(rel => ({
        id: rel.advisor?.id || '',
        name: rel.advisor?.name || 'Unknown',
        engagementScore: Math.floor(Math.random() * 40) + 60, // Mock engagement score
        practiceScore: Math.floor(Math.random() * 30) + 70, // Mock practice score
        status: rel.advisor?.is_active ? 'active' : 'inactive'
      })) || [];

      setAdvisorRoster(maskedAdvisorRoster);
      setStats(aggregatedStats);

    } catch (error) {
      console.error('Error fetching coach data:', error);
      toast.error('Failed to load coach dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'improving':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (userProfile?.role !== 'coach') {
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
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={userProfile?.avatar_url} />
            <AvatarFallback>
              {userProfile?.first_name?.charAt(0)}{userProfile?.last_name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">
              {userProfile?.first_name} {userProfile?.last_name}
            </h1>
            <p className="text-muted-foreground">Practice Coach Dashboard</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <UserPlus className="h-4 w-4 mr-2" />
            Invite New Advisor
          </Button>
          <Button>
            <Search className="h-4 w-4 mr-2" />
            Find More Coaches
          </Button>
        </div>
      </div>

      {/* Advisor Roster */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Advisor Roster</CardTitle>
            <Button variant="outline" size="sm">View All</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {advisorRoster.slice(0, 5).map((advisor) => (
              <div key={advisor.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {advisor.name.split(' ').map(n => n.charAt(0)).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{advisor.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm text-muted-foreground">
                    Engagement: {advisor.engagementScore}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Score: {advisor.practiceScore}
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

      {/* Practice Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Practice Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.activeAdvisors}</div>
                <div className="text-sm text-muted-foreground">Active Advisors</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.newLeadsThisMonth}</div>
                <div className="text-sm text-muted-foreground">New Leads This Month</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.demoConversion.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">Demo Conversion</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Curriculum Library */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Curriculum Library</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <Video className="h-8 w-8 text-blue-500" />
                <div>
                  <div className="font-medium">Webinar</div>
                  <div className="text-sm text-muted-foreground">5 modules</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Lead Generation Masterclass</p>
            </div>

            <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="h-8 w-8 text-green-500" />
                <div>
                  <div className="font-medium">Playbook</div>
                  <div className="text-sm text-muted-foreground">25 pages</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Sales Process Optimization</p>
            </div>

            <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <CheckSquare className="h-8 w-8 text-purple-500" />
                <div>
                  <div className="font-medium">Checklist</div>
                  <div className="text-sm text-muted-foreground">12 items</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Client Onboarding Steps</p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-muted rounded-lg">
            <div className="font-medium mb-2">Progress Tracker</div>
            <div className="text-sm text-muted-foreground">
              Track advisor milestones and completion rates across your curriculum
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referral Earnings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Referral Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-green-600">
                ${stats.referralEarnings.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">YTD Referral Earnings</div>
            </div>
            <Award className="h-12 w-12 text-yellow-500" />
          </div>
        </CardContent>
      </Card>

      {/* Privacy Notice */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-1 bg-amber-100 rounded">
              <Users className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <div className="font-medium text-amber-800">Privacy Protection Active</div>
              <div className="text-sm text-amber-700">
                All client personal information is masked or aggregated to protect privacy. 
                You can see performance metrics and engagement data without accessing sensitive personal details.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}