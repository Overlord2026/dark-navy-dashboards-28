import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Medal, 
  Star, 
  TrendingUp, 
  Users, 
  DollarSign,
  Award,
  Crown,
  Target,
  Gift
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface LeaderboardEntry {
  user_id: string;
  name: string;
  total_referrals: number;
  active_referrals: number;
  total_earnings: number;
  rank: number;
  avatar_url?: string;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  target: number;
  reward: string;
  icon: React.ReactNode;
  progress: number;
  completed: boolean;
}

export const ReferralLeaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);

  const defaultMilestones: Milestone[] = [
    {
      id: '1',
      title: 'First Referral',
      description: 'Refer your first user',
      target: 1,
      reward: '50 credits',
      icon: <Star className="h-5 w-5" />,
      progress: 0,
      completed: false
    },
    {
      id: '2',
      title: 'Rising Star',
      description: 'Refer 5 users',
      target: 5,
      reward: '300 credits + Premium month',
      icon: <Medal className="h-5 w-5" />,
      progress: 0,
      completed: false
    },
    {
      id: '3',
      title: 'Super Referrer',
      description: 'Refer 10 users',
      target: 10,
      reward: '750 credits + Gift card',
      icon: <Award className="h-5 w-5" />,
      progress: 0,
      completed: false
    },
    {
      id: '4',
      title: 'Referral Champion',
      description: 'Refer 25 users',
      target: 25,
      reward: '$200 cash bonus',
      icon: <Trophy className="h-5 w-5" />,
      progress: 0,
      completed: false
    },
    {
      id: '5',
      title: 'Elite Ambassador',
      description: 'Refer 50 users',
      target: 50,
      reward: '$500 cash + VIP status',
      icon: <Crown className="h-5 w-5" />,
      progress: 0,
      completed: false
    }
  ];

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Fetch leaderboard data
      const { data: referralStats, error } = await supabase
        .from('referrals')
        .select(`
          referrer_user_id,
          status,
          referral_rewards(reward_amount, status)
        `);

      if (error) throw error;

      // Process leaderboard data
      const userStats: { [key: string]: any } = {};
      
      referralStats?.forEach(referral => {
        const userId = referral.referrer_user_id;
        if (!userStats[userId]) {
          userStats[userId] = {
            user_id: userId,
            total_referrals: 0,
            active_referrals: 0,
            total_earnings: 0
          };
        }
        
        userStats[userId].total_referrals++;
        if (referral.status === 'active') {
          userStats[userId].active_referrals++;
        }
        
        if (referral.referral_rewards) {
          referral.referral_rewards.forEach((reward: any) => {
            if (reward.status === 'paid') {
              userStats[userId].total_earnings += Number(reward.reward_amount);
            }
          });
        }
      });

      // Convert to array and sort
      const leaderboardArray = Object.values(userStats)
        .sort((a: any, b: any) => b.total_referrals - a.total_referrals)
        .slice(0, 20)
        .map((entry: any, index) => ({
          ...entry,
          rank: index + 1,
          name: `User ${entry.user_id.slice(0, 8)}`
        }));

      setLeaderboard(leaderboardArray);

      // Find current user's rank
      if (user) {
        const currentUserStats = userStats[user.id];
        if (currentUserStats) {
          const userRankData = {
            ...currentUserStats,
            rank: leaderboardArray.findIndex((entry: any) => entry.user_id === user.id) + 1,
            name: 'You'
          };
          setUserRank(userRankData);

          // Update milestones based on user's progress
          const userReferrals = currentUserStats.total_referrals;
          const updatedMilestones = defaultMilestones.map(milestone => ({
            ...milestone,
            progress: Math.min((userReferrals / milestone.target) * 100, 100),
            completed: userReferrals >= milestone.target
          }));
          setMilestones(updatedMilestones);
        } else {
          setMilestones(defaultMilestones);
        }
      }

    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white';
      default:
        return 'bg-muted';
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading leaderboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* User's Current Rank */}
      {userRank && (
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${getRankColor(userRank.rank)}`}>
                  {getRankIcon(userRank.rank)}
                </div>
                <div>
                  <h3 className="text-xl font-bold">Your Ranking</h3>
                  <p className="text-muted-foreground">
                    #{userRank.rank} • {userRank.total_referrals} referrals • ${userRank.total_earnings.toFixed(2)} earned
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="secondary" className="mb-2">
                  {userRank.active_referrals} Active
                </Badge>
                <p className="text-sm text-muted-foreground">Keep referring to climb higher!</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="leaderboard">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="leaderboard">Top Referrers</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
        </TabsList>

        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Referral Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboard.length > 0 ? (
                  leaderboard.map((entry) => (
                    <div
                      key={entry.user_id}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        entry.rank <= 3 ? 'border-primary/20 bg-primary/5' : 'border-border'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getRankColor(entry.rank)}`}>
                          {getRankIcon(entry.rank)}
                        </div>
                        <div>
                          <p className="font-semibold">{entry.name}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {entry.total_referrals} referrals
                            </span>
                            <span className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              {entry.active_referrals} active
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              ${entry.total_earnings.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                      {entry.rank <= 3 && (
                        <Badge variant="secondary">
                          Top {entry.rank}
                        </Badge>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No referrers yet</h3>
                    <p className="text-muted-foreground">Be the first to start referring and claim the top spot!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-500" />
                Referral Milestones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {milestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    className={`p-4 rounded-lg border ${
                      milestone.completed 
                        ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20' 
                        : 'border-border'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        milestone.completed 
                          ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {milestone.completed ? <Award className="h-6 w-6" /> : milestone.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{milestone.title}</h4>
                          {milestone.completed && (
                            <Badge className="bg-green-100 text-green-800">
                              <Gift className="h-3 w-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{milestone.description}</p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Progress: {Math.floor(milestone.progress)}%</span>
                            <span className="font-medium">Reward: {milestone.reward}</span>
                          </div>
                          <Progress value={milestone.progress} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};