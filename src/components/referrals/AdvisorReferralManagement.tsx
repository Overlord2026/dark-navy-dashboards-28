import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserPlus, DollarSign, Users, TrendingUp, Copy, CheckCircle } from "lucide-react";
import { useReferrals } from "@/hooks/useReferrals";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AdvisorReferralManagementProps {
  userRole: string;
}

export const AdvisorReferralManagement = ({ userRole }: AdvisorReferralManagementProps) => {
  const { referrals, overrides, generateReferralCode, copyReferralLink, loading, refreshData } = useReferrals();
  const { toast } = useToast();
  const [newAdvisorCode, setNewAdvisorCode] = useState('');
  const [processingCode, setProcessingCode] = useState(false);

  const advisorReferrals = referrals.filter(r => r.referral_type === 'advisor');
  const activeOverrides = overrides.filter(o => o.status === 'active');
  const totalOverrideEarnings = overrides.reduce((sum, o) => sum + o.override_amount, 0);
  
  const canReferAdvisors = userRole === 'advisor' || userRole === 'admin' || userRole === 'tenant_admin';

  const handleGenerateAdvisorCode = async () => {
    await generateReferralCode('advisor', 1000, 'override'); // $1000 bonus + override
  };

  const handleProcessReferralCode = async () => {
    if (!newAdvisorCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a referral code",
        variant: "destructive",
      });
      return;
    }

    setProcessingCode(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .rpc('process_advisor_referral', {
          p_referral_code: newAdvisorCode.toUpperCase(),
          p_new_advisor_id: user.id
        });

      if (error) throw error;

      if (data) {
        toast({
          title: "Success",
          description: "Referral code processed successfully! Override tracking has been set up.",
        });
        setNewAdvisorCode('');
        await refreshData();
      } else {
        toast({
          title: "Error",
          description: "Invalid or expired referral code",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error processing referral code:', error);
      toast({
        title: "Error",
        description: "Failed to process referral code",
        variant: "destructive",
      });
    } finally {
      setProcessingCode(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success text-success-foreground';
      case 'paid': return 'bg-primary text-primary-foreground';
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'expired': return 'bg-muted text-muted-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Advisor Referral Program
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-primary">{advisorReferrals.length}</div>
            <div className="text-sm text-muted-foreground">Advisors Referred</div>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-success">{activeOverrides.length}</div>
            <div className="text-sm text-muted-foreground">Active Overrides</div>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-success flex items-center justify-center gap-1">
              <DollarSign className="h-5 w-5" />
              {totalOverrideEarnings.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Override Earnings</div>
          </div>
        </div>

        {/* Generate Referral Code */}
        {canReferAdvisors && (
          <div className="space-y-3">
            <h4 className="font-medium">Refer New Advisors</h4>
            <p className="text-sm text-muted-foreground">
              Generate referral codes for new advisors. You'll receive a $1,000 bonus plus 5% override on their production for 2 years.
            </p>
            <Button 
              onClick={handleGenerateAdvisorCode}
              disabled={loading}
              className="w-full"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Generate Advisor Referral Code
            </Button>
          </div>
        )}

        {/* Process Referral Code (for new advisors) */}
        <div className="space-y-3 border-t pt-4">
          <h4 className="font-medium">Were You Referred by Another Advisor?</h4>
          <p className="text-sm text-muted-foreground">
            Enter the referral code provided by your referring advisor to establish override tracking.
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="Enter referral code"
              value={newAdvisorCode}
              onChange={(e) => setNewAdvisorCode(e.target.value.toUpperCase())}
              className="flex-1"
            />
            <Button 
              onClick={handleProcessReferralCode}
              disabled={processingCode || !newAdvisorCode.trim()}
            >
              {processingCode ? 'Processing...' : 'Apply Code'}
            </Button>
          </div>
        </div>

        {/* Active Referrals */}
        {advisorReferrals.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Your Advisor Referrals</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {advisorReferrals.map((referral) => (
                <div 
                  key={referral.id} 
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                        {referral.referral_code}
                      </code>
                      <Badge className={getStatusColor(referral.status)}>
                        {referral.status}
                      </Badge>
                      {referral.status === 'active' && (
                        <CheckCircle className="h-4 w-4 text-success" />
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      ${referral.reward_amount} bonus + override • Created {new Date(referral.created_at).toLocaleDateString()}
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

        {/* Override Tracking */}
        {overrides.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Override Tracking</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Override %</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Production</TableHead>
                  <TableHead>Override Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {overrides.map((override) => (
                  <TableRow key={override.id}>
                    <TableCell>{(override.override_percent * 100).toFixed(1)}%</TableCell>
                    <TableCell>
                      {new Date(override.production_period_start).toLocaleDateString()}
                      {override.production_period_end && 
                        ` - ${new Date(override.production_period_end).toLocaleDateString()}`
                      }
                    </TableCell>
                    <TableCell>${override.production_amount.toLocaleString()}</TableCell>
                    <TableCell className="font-medium text-success">
                      ${override.override_amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(override.status)}>
                        {override.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};