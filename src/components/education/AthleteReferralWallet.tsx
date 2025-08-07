import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, 
  Trophy, 
  Users, 
  Gift, 
  Copy, 
  Share,
  Star,
  Crown,
  Medal,
  Target
} from 'lucide-react';
import { toast } from 'sonner';

interface AthleteStats {
  name: string;
  school: string;
  referrals: number;
  credits: number;
  rank: number;
}

const AthleteReferralWallet = () => {
  const [userCredits] = useState(125);
  const [userReferrals] = useState(8);
  const [userRank] = useState(3);

  const leaderboard: AthleteStats[] = [
    { name: "Sarah Johnson", school: "State University", referrals: 15, credits: 275, rank: 1 },
    { name: "Marcus Williams", school: "Tech College", referrals: 12, credits: 220, rank: 2 },
    { name: "You", school: "Your School", referrals: 8, credits: 125, rank: 3 },
    { name: "Emily Chen", school: "Metro University", referrals: 7, credits: 105, rank: 4 },
    { name: "Jake Rodriguez", school: "State University", referrals: 6, credits: 95, rank: 5 }
  ];

  const rewards = [
    { name: "Premium Course Access", cost: 50, icon: Star },
    { name: "1-on-1 Advisor Session", cost: 100, icon: Target },
    { name: "NIL Contract Review", cost: 150, icon: Trophy },
    { name: "Custom Brand Consultation", cost: 200, icon: Crown }
  ];

  const referralLink = "https://bfo.app/athletes/nil-onboarding?ref=athlete123";

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success('Referral link copied to clipboard!');
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Medal className="h-5 w-5 text-amber-600" />;
      default: return <Trophy className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Wallet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Credits Balance</p>
                <p className="text-3xl font-bold text-primary">{userCredits}</p>
              </div>
              <Wallet className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Successful Referrals</p>
                <p className="text-3xl font-bold text-green-600">{userReferrals}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Leaderboard Rank</p>
                <p className="text-3xl font-bold text-purple-600">#{userRank}</p>
              </div>
              {getRankIcon(userRank)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share className="h-5 w-5" />
            Invite Athletes & Earn Credits
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <code className="text-sm flex-1 truncate">{referralLink}</code>
              <Button variant="outline" size="sm" onClick={copyReferralLink}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>🎯 <strong>5 credits</strong> per successful signup</p>
            <p>🏆 <strong>Bonus 25 credits</strong> when your referral completes their first course</p>
          </div>
        </CardContent>
      </Card>

      {/* Rewards Store */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Redeem Credits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rewards.map((reward, index) => {
              const IconComponent = reward.icon;
              const canAfford = userCredits >= reward.cost;
              
              return (
                <div 
                  key={index}
                  className={`p-4 border rounded-lg ${canAfford ? 'border-primary bg-primary/5' : 'border-muted bg-muted/30'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <IconComponent className={`h-5 w-5 ${canAfford ? 'text-primary' : 'text-muted-foreground'}`} />
                    <Badge variant={canAfford ? 'default' : 'secondary'}>
                      {reward.cost} credits
                    </Badge>
                  </div>
                  <h3 className="font-semibold mb-2">{reward.name}</h3>
                  <Button 
                    size="sm" 
                    disabled={!canAfford}
                    className="w-full"
                  >
                    {canAfford ? 'Redeem' : 'Insufficient Credits'}
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            NIL Ambassador Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaderboard.map((athlete, index) => (
              <div 
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  athlete.name === 'You' ? 'bg-primary/10 border border-primary/20' : 'bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {getRankIcon(athlete.rank)}
                  <div>
                    <p className="font-semibold">{athlete.name}</p>
                    <p className="text-sm text-muted-foreground">{athlete.school}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold">{athlete.credits} credits</p>
                  <p className="text-sm text-muted-foreground">{athlete.referrals} referrals</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AthleteReferralWallet;