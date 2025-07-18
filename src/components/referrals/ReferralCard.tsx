import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Share2, Gift, DollarSign } from "lucide-react";
import { useReferrals } from "@/hooks/useReferrals";

interface ReferralCardProps {
  userRole: string;
}

export const ReferralCard = ({ userRole }: ReferralCardProps) => {
  const { referrals, generateReferralCode, copyReferralLink, loading } = useReferrals();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success text-success-foreground';
      case 'paid': return 'bg-primary text-primary-foreground';
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'expired': return 'bg-muted text-muted-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const handleGenerateCode = async (type: 'client' | 'advisor') => {
    const rewardAmount = type === 'client' ? 100 : 500;
    await generateReferralCode(type, rewardAmount, 'credit');
  };

  const activeReferrals = referrals.filter(r => r.status === 'active' || r.status === 'pending');
  const totalEarnings = referrals
    .filter(r => r.status === 'paid')
    .reduce((sum, r) => sum + r.reward_amount, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5" />
          Referral Program
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-primary">{activeReferrals.length}</div>
            <div className="text-sm text-muted-foreground">Active Referrals</div>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-success flex items-center justify-center gap-1">
              <DollarSign className="h-5 w-5" />
              {totalEarnings}
            </div>
            <div className="text-sm text-muted-foreground">Total Earned</div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Generate Referral Code</h4>
          <div className="flex gap-2">
            <Button 
              onClick={() => handleGenerateCode('client')}
              disabled={loading}
              variant="outline"
              size="sm"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Refer Client
            </Button>
            {(userRole === 'advisor' || userRole === 'admin') && (
              <Button 
                onClick={() => handleGenerateCode('advisor')}
                disabled={loading}
                variant="outline"
                size="sm"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Refer Advisor
              </Button>
            )}
          </div>
        </div>

        {referrals.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Your Referrals</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {referrals.slice(0, 5).map((referral) => (
                <div 
                  key={referral.id} 
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                        {referral.referral_code}
                      </code>
                      <Badge 
                        variant="secondary" 
                        className={getStatusColor(referral.status)}
                      >
                        {referral.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {referral.referral_type} • ${referral.reward_amount} {referral.reward_type}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyReferralLink(referral.referral_code)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};