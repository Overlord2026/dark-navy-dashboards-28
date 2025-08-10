import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, Target, Users, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ProgressData {
  segment: string;
  tier: string;
  week: string;
  total_items: number;
  completed_items: number;
  completion_percentage: number;
  last_updated: string;
}

interface OverallStats {
  total_items: number;
  completed_items: number;
  completion_percentage: number;
  by_segment: Record<string, { total: number; completed: number; percentage: number }>;
  by_tier: Record<string, { total: number; completed: number; percentage: number }>;
  by_week: Record<string, { total: number; completed: number; percentage: number }>;
}

const segmentColors = {
  sports: '#046B4D',
  longevity: '#0A152E', 
  ria: '#A6192E'
};

const tierColors = {
  gold: '#FFD700',
  silver: '#C0C0C0',
  bronze: '#CD7F32'
};

export const LaunchProgressDashboard: React.FC = () => {
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [overallStats, setOverallStats] = useState<OverallStats>({
    total_items: 0,
    completed_items: 0,
    completion_percentage: 0,
    by_segment: {},
    by_tier: {},
    by_week: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgressData();
    // Set up real-time updates
    const subscription = supabase
      .channel('launch_progress_updates')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'launch_checklist_progress' },
        () => loadProgressData()
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadProgressData = async () => {
    try {
      const { data, error } = await supabase
        .from('launch_checklist_progress')
        .select('*')
        .order('segment, tier, week');

      if (error) throw error;

      const progressData = data || [];
      setProgressData(progressData);
      setOverallStats(calculateOverallStats(progressData));
    } catch (error) {
      console.error('Error loading progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateOverallStats = (data: ProgressData[]): OverallStats => {
    const stats: OverallStats = {
      total_items: 0,
      completed_items: 0,
      completion_percentage: 0,
      by_segment: {},
      by_tier: {},
      by_week: {}
    };

    // Calculate totals
    stats.total_items = data.reduce((sum, item) => sum + item.total_items, 0);
    stats.completed_items = data.reduce((sum, item) => sum + item.completed_items, 0);
    stats.completion_percentage = stats.total_items > 0 
      ? Math.round((stats.completed_items / stats.total_items) * 100) 
      : 0;

    // Group by segment
    ['sports', 'longevity', 'ria'].forEach(segment => {
      const segmentData = data.filter(item => item.segment === segment);
      const total = segmentData.reduce((sum, item) => sum + item.total_items, 0);
      const completed = segmentData.reduce((sum, item) => sum + item.completed_items, 0);
      
      stats.by_segment[segment] = {
        total,
        completed,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0
      };
    });

    // Group by tier
    ['gold', 'silver', 'bronze'].forEach(tier => {
      const tierData = data.filter(item => item.tier === tier);
      const total = tierData.reduce((sum, item) => sum + item.total_items, 0);
      const completed = tierData.reduce((sum, item) => sum + item.completed_items, 0);
      
      stats.by_tier[tier] = {
        total,
        completed,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0
      };
    });

    // Group by week
    ['1-2', '3-4', '5-6', '7-8'].forEach(week => {
      const weekData = data.filter(item => item.week === week);
      const total = weekData.reduce((sum, item) => sum + item.total_items, 0);
      const completed = weekData.reduce((sum, item) => sum + item.completed_items, 0);
      
      stats.by_week[week] = {
        total,
        completed,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0
      };
    });

    return stats;
  };

  const sendDigest = async () => {
    try {
      const response = await supabase.functions.invoke('launch-digest', {
        body: { type: 'manual', force: true }
      });

      if (response.error) throw response.error;
      alert('Weekly digest sent successfully!');
    } catch (error) {
      console.error('Error sending digest:', error);
      alert('Failed to send digest');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto"></div>
          <p className="text-muted-foreground">Loading progress data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Progress Header */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-gold/10 to-gold/5 border-gold/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-gold text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{overallStats.completion_percentage}%</div>
            <p className="text-xs text-white/60">
              {overallStats.completed_items}/{overallStats.total_items} items complete
            </p>
            <Progress value={overallStats.completion_percentage} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-black border-emerald/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-emerald text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Sports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{overallStats.by_segment.sports?.percentage || 0}%</div>
            <p className="text-xs text-white/60">
              {overallStats.by_segment.sports?.completed || 0}/{overallStats.by_segment.sports?.total || 0} items
            </p>
            <Progress value={overallStats.by_segment.sports?.percentage || 0} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-black border-blue-900/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-blue-300 text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Longevity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{overallStats.by_segment.longevity?.percentage || 0}%</div>
            <p className="text-xs text-white/60">
              {overallStats.by_segment.longevity?.completed || 0}/{overallStats.by_segment.longevity?.total || 0} items
            </p>
            <Progress value={overallStats.by_segment.longevity?.percentage || 0} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-black border-red-900/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-red-300 text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              RIA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{overallStats.by_segment.ria?.percentage || 0}%</div>
            <p className="text-xs text-white/60">
              {overallStats.by_segment.ria?.completed || 0}/{overallStats.by_segment.ria?.total || 0} items
            </p>
            <Progress value={overallStats.by_segment.ria?.percentage || 0} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Tier Progress */}
      <Card className="bg-black border-gold/30">
        <CardHeader>
          <CardTitle className="text-gold">Progress by Tier</CardTitle>
          <CardDescription className="text-white/70">
            Execution progress across Gold, Silver, and Bronze tiers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(overallStats.by_tier).map(([tier, stats]) => (
            <div key={tier} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge 
                    variant="outline"
                    style={{ 
                      borderColor: tierColors[tier as keyof typeof tierColors] + '80',
                      color: tierColors[tier as keyof typeof tierColors]
                    }}
                  >
                    {tier === 'gold' ? '🥇' : tier === 'silver' ? '🥈' : '🥉'} {tier.charAt(0).toUpperCase() + tier.slice(1)}
                  </Badge>
                  <span className="text-white text-sm">
                    {stats.completed}/{stats.total} items complete
                  </span>
                </div>
                <span className="text-white font-medium">{stats.percentage}%</span>
              </div>
              <Progress value={stats.percentage} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Week Progress */}
      <Card className="bg-black border-gold/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gold">Weekly Execution Timeline</CardTitle>
              <CardDescription className="text-white/70">
                8-week launch sequence progress
              </CardDescription>
            </div>
            <Button onClick={sendDigest} className="bg-gold text-black hover:bg-gold/90">
              <Mail className="h-4 w-4 mr-2" />
              Send Weekly Digest
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(overallStats.by_week).map(([week, stats]) => {
              const weekLabels = {
                '1-2': 'Gold Tier Blitz',
                '3-4': 'Silver Tier Activation', 
                '5-6': 'Bronze Tier Strategic Push',
                '7-8': 'Consolidation & PR Push'
              };
              
              return (
                <div key={week} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">Week {week}</h3>
                      <p className="text-white/60 text-sm">
                        {weekLabels[week as keyof typeof weekLabels]}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-white">{stats.percentage}%</div>
                      <div className="text-xs text-white/60">
                        {stats.completed}/{stats.total}
                      </div>
                    </div>
                  </div>
                  <Progress value={stats.percentage} className="h-3" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Progress Table */}
      <Card className="bg-black border-gold/30">
        <CardHeader>
          <CardTitle className="text-gold">Detailed Progress Breakdown</CardTitle>
          <CardDescription className="text-white/70">
            Progress by segment, tier, and week combination
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gold/20">
                  <th className="text-left text-white/80 py-2">Segment</th>
                  <th className="text-left text-white/80 py-2">Tier</th>
                  <th className="text-left text-white/80 py-2">Week</th>
                  <th className="text-center text-white/80 py-2">Total</th>
                  <th className="text-center text-white/80 py-2">Complete</th>
                  <th className="text-center text-white/80 py-2">Progress</th>
                  <th className="text-center text-white/80 py-2">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {progressData.map((item, index) => (
                  <tr key={index} className="border-b border-white/10 hover:bg-white/5">
                    <td className="py-2">
                      <Badge 
                        variant="outline" 
                        style={{ 
                          borderColor: segmentColors[item.segment as keyof typeof segmentColors] + '80',
                          color: segmentColors[item.segment as keyof typeof segmentColors]
                        }}
                      >
                        {item.segment}
                      </Badge>
                    </td>
                    <td className="py-2">
                      <Badge 
                        variant="outline"
                        style={{ 
                          borderColor: tierColors[item.tier as keyof typeof tierColors] + '80',
                          color: tierColors[item.tier as keyof typeof tierColors]
                        }}
                      >
                        {item.tier}
                      </Badge>
                    </td>
                    <td className="py-2 text-white">{item.week}</td>
                    <td className="py-2 text-center text-white">{item.total_items}</td>
                    <td className="py-2 text-center text-white">{item.completed_items}</td>
                    <td className="py-2 text-center">
                      <div className="flex items-center gap-2">
                        <Progress value={item.completion_percentage} className="h-2 flex-1" />
                        <span className="text-white text-xs min-w-[3rem]">
                          {Math.round(item.completion_percentage)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-2 text-center text-white/60 text-xs">
                      {new Date(item.last_updated).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};