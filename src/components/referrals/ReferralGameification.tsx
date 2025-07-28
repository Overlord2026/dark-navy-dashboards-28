import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Trophy,
  Medal,
  Target,
  Gift,
  Users,
  TrendingUp,
  Share2,
  Crown,
  Star,
  Flame,
  Zap
} from 'lucide-react';
import { useReferrals } from '@/hooks/useReferrals';
import { useUser } from '@/context/UserContext';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  progress: number;
  target: number;
  reward: string;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  referrals: number;
  earnings: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

interface ReferralGameificationProps {
  userRole: string;
}

export const ReferralGameification: React.FC<ReferralGameificationProps> = ({ userRole }) => {
  const { referrals, generateReferralCode, loading } = useReferrals();
  const { userProfile } = useUser();
  const [currentStreak, setCurrentStreak] = useState(3);
  const [bonusMultiplier, setBonusMultiplier] = useState(1.2);
  const [showCelebration, setShowCelebration] = useState(false);

  const activeReferrals = referrals.filter(r => r.status === 'active').length;
  const totalEarnings = referrals
    .filter(r => r.status === 'paid')
    .reduce((sum, r) => sum + r.reward_amount, 0);

  // Calculate user tier based on referrals
  const getUserTier = (referralCount: number): LeaderboardEntry['tier'] => {
    if (referralCount >= 50) return 'platinum';
    if (referralCount >= 25) return 'gold';
    if (referralCount >= 10) return 'silver';
    return 'bronze';
  };

  const userTier = getUserTier(activeReferrals);
  
  const achievements: Achievement[] = [
    {
      id: 'first_referral',
      title: 'First Steps',
      description: 'Make your first referral',
      icon: <Target className="h-6 w-6" />,
      progress: Math.min(activeReferrals, 1),
      target: 1,
      reward: '$100 bonus',
      unlocked: activeReferrals >= 1,
      rarity: 'common'
    },
    {
      id: 'five_referrals',
      title: 'Network Builder',
      description: 'Reach 5 successful referrals',
      icon: <Users className="h-6 w-6" />,
      progress: Math.min(activeReferrals, 5),
      target: 5,
      reward: '$500 bonus + Silver tier',
      unlocked: activeReferrals >= 5,
      rarity: 'rare'
    },
    {
      id: 'streak_master',
      title: 'Streak Master',
      description: 'Maintain a 7-day referral streak',
      icon: <Flame className="h-6 w-6" />,
      progress: Math.min(currentStreak, 7),
      target: 7,
      reward: '2x multiplier for 30 days',
      unlocked: currentStreak >= 7,
      rarity: 'epic'
    },
    {
      id: 'top_performer',
      title: 'Top Performer',
      description: 'Reach top 10 on monthly leaderboard',
      icon: <Crown className="h-6 w-6" />,
      progress: 0, // Would be calculated from actual leaderboard data
      target: 1,
      reward: 'Platinum status + $2000 bonus',
      unlocked: false,
      rarity: 'legendary'
    }
  ];

  // Mock leaderboard data
  const leaderboard: LeaderboardEntry[] = [
    { rank: 1, name: 'Sarah M.', referrals: 87, earnings: 12500, tier: 'platinum' },
    { rank: 2, name: 'Mike R.', referrals: 65, earnings: 9800, tier: 'gold' },
    { rank: 3, name: 'Jennifer L.', referrals: 54, earnings: 8100, tier: 'gold' },
    { rank: 4, name: 'David K.', referrals: 42, earnings: 6300, tier: 'silver' },
    { rank: 5, name: 'Lisa W.', referrals: 38, earnings: 5700, tier: 'silver' },
  ];

  const getTierColor = (tier: LeaderboardEntry['tier']) => {
    switch (tier) {
      case 'platinum': return 'text-purple-600 bg-purple-100';
      case 'gold': return 'text-yellow-600 bg-yellow-100';
      case 'silver': return 'text-gray-600 bg-gray-100';
      case 'bronze': return 'text-orange-600 bg-orange-100';
    }
  };

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'legendary': return 'border-purple-500 bg-purple-50';
      case 'epic': return 'border-blue-500 bg-blue-50';
      case 'rare': return 'border-green-500 bg-green-50';
      case 'common': return 'border-gray-300 bg-gray-50';
    }
  };

  const nextMilestone = achievements.find(a => !a.unlocked);
  const progressToNext = nextMilestone 
    ? (nextMilestone.progress / nextMilestone.target) * 100 
    : 100;

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${getTierColor(userTier)}`}>
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-bold">{userTier.toUpperCase()}</div>
                <div className="text-sm text-muted-foreground">Current Tier</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{activeReferrals}</div>
                <div className="text-sm text-muted-foreground">Active Referrals</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">${totalEarnings}</div>
                <div className="text-sm text-muted-foreground">Total Earned</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100">
                <Flame className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{currentStreak}</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="achievements" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="space-y-6">
          {/* Progress to Next Milestone */}
          {nextMilestone && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Next Milestone: {nextMilestone.title}
                </CardTitle>
                <CardDescription>{nextMilestone.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{nextMilestone.progress}/{nextMilestone.target}</span>
                  </div>
                  <Progress value={progressToNext} className="h-3" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Reward: {nextMilestone.reward}
                    </span>
                    <Badge variant="outline">
                      {Math.ceil(nextMilestone.target - nextMilestone.progress)} more to go
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <Card 
                key={achievement.id} 
                className={`${getRarityColor(achievement.rarity)} ${
                  achievement.unlocked ? 'ring-2 ring-green-200' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      achievement.unlocked ? 'bg-green-100' : 'bg-muted'
                    }`}>
                      {achievement.unlocked ? (
                        <Star className="h-6 w-6 text-green-600" />
                      ) : (
                        achievement.icon
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{achievement.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {achievement.rarity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {achievement.description}
                      </p>
                      
                      {!achievement.unlocked && (
                        <div className="space-y-2">
                          <Progress 
                            value={(achievement.progress / achievement.target) * 100} 
                            className="h-2" 
                          />
                          <div className="text-xs text-muted-foreground">
                            {achievement.progress}/{achievement.target}
                          </div>
                        </div>
                      )}
                      
                      <div className="text-xs font-medium text-primary mt-2">
                        🎁 {achievement.reward}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Monthly Leaderboard
              </CardTitle>
              <CardDescription>
                Top performers this month - updated in real-time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.map((entry) => (
                  <div 
                    key={entry.rank}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        entry.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                        entry.rank === 2 ? 'bg-gray-100 text-gray-700' :
                        entry.rank === 3 ? 'bg-orange-100 text-orange-700' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {entry.rank <= 3 ? <Medal className="h-4 w-4" /> : entry.rank}
                      </div>
                      <div>
                        <div className="font-semibold">{entry.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {entry.referrals} referrals • ${entry.earnings} earned
                        </div>
                      </div>
                    </div>
                    <Badge className={getTierColor(entry.tier)}>
                      {entry.tier}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <div className="grid gap-6">
            {/* Current Campaign */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Holiday Bonus Campaign
                  </CardTitle>
                  <Badge variant="secondary">
                    <Crown className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </div>
                <CardDescription>
                  Double rewards on all referrals through December
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Campaign Progress</span>
                    <span className="font-semibold">23 days left</span>
                  </div>
                  <Progress value={65} className="h-3" />
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => generateReferralCode('client', 200, 'credit')}
                      disabled={loading}
                      className="flex-1"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Generate Holiday Link
                    </Button>
                    <Button variant="outline">
                      Share Campaign
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Campaign */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  New Year Challenge
                </CardTitle>
                <CardDescription>
                  Coming January 1st - Triple rewards for first 10 referrals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <div className="text-3xl font-bold text-primary mb-2">$1,500</div>
                  <div className="text-muted-foreground">Potential bonus earnings</div>
                  <Button className="mt-4" variant="outline">
                    Set Reminder
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};