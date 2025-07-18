import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, DollarSign, TrendingUp, Users } from "lucide-react";
import { useReferrals } from "@/hooks/useReferrals";
import { PayoutManagement } from "@/components/referrals/PayoutManagement";
import { PayoutHistory } from "@/components/referrals/PayoutHistory";
import { useState } from "react";

export const ReferralManagement = () => {
  const { referrals, overrides, generateReferralCode, copyReferralLink, loading } = useReferrals();
  const [newReferral, setNewReferral] = useState({
    type: 'client' as 'client' | 'advisor' | 'franchise',
    rewardAmount: 100,
    rewardType: 'credit'
  });

  const stats = {
    totalReferrals: referrals.length,
    activeReferrals: referrals.filter(r => r.status === 'active').length,
    totalEarnings: referrals.filter(r => r.status === 'paid').reduce((sum, r) => sum + r.reward_amount, 0),
    pendingPayouts: referrals.filter(r => r.status === 'active').reduce((sum, r) => sum + r.reward_amount, 0),
  };

  const handleGenerateReferral = async () => {
    await generateReferralCode(newReferral.type, newReferral.rewardAmount, newReferral.rewardType);
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
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="payouts">Payout Management</TabsTrigger>
        <TabsTrigger value="history">Payout History</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <Users className="h-8 w-8 text-primary" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Total Referrals</p>
              <p className="text-2xl font-bold">{stats.totalReferrals}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <TrendingUp className="h-8 w-8 text-success" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Active Referrals</p>
              <p className="text-2xl font-bold">{stats.activeReferrals}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <DollarSign className="h-8 w-8 text-primary" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
              <p className="text-2xl font-bold">${stats.totalEarnings}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <DollarSign className="h-8 w-8 text-warning" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Pending Payouts</p>
              <p className="text-2xl font-bold">${stats.pendingPayouts}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generate New Referral */}
      <Card>
        <CardHeader>
          <CardTitle>Generate New Referral Code</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="type">Referral Type</Label>
              <Select
                value={newReferral.type}
                onValueChange={(value: 'client' | 'advisor' | 'franchise') => 
                  setNewReferral(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="advisor">Advisor</SelectItem>
                  <SelectItem value="franchise">Franchise</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="rewardAmount">Reward Amount</Label>
              <Input
                type="number"
                value={newReferral.rewardAmount}
                onChange={(e) => setNewReferral(prev => ({ 
                  ...prev, 
                  rewardAmount: parseFloat(e.target.value) || 0 
                }))}
              />
            </div>

            <div>
              <Label htmlFor="rewardType">Reward Type</Label>
              <Select
                value={newReferral.rewardType}
                onValueChange={(value) => setNewReferral(prev => ({ ...prev, rewardType: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit">Account Credit</SelectItem>
                  <SelectItem value="bonus">Cash Bonus</SelectItem>
                  <SelectItem value="gift_card">Gift Card</SelectItem>
                  <SelectItem value="discount">Discount</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button onClick={handleGenerateReferral} disabled={loading}>
                Generate Code
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referrals Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Referrals</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reward</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {referrals.map((referral) => (
                <TableRow key={referral.id}>
                  <TableCell>
                    <code className="font-mono text-sm bg-muted px-2 py-1 rounded">
                      {referral.referral_code}
                    </code>
                  </TableCell>
                  <TableCell className="capitalize">{referral.referral_type}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(referral.status)}>
                      {referral.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    ${referral.reward_amount} {referral.reward_type}
                  </TableCell>
                  <TableCell>
                    {new Date(referral.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyReferralLink(referral.referral_code)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Advisor Overrides */}
      {overrides.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Advisor Overrides</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Override %</TableHead>
                  <TableHead>Production Period</TableHead>
                  <TableHead>Production Amount</TableHead>
                  <TableHead>Override Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Frequency</TableHead>
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
                    <TableCell>${override.override_amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(override.status)}>
                        {override.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="capitalize">{override.payment_frequency}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      </TabsContent>

      <TabsContent value="payouts">
        <PayoutManagement />
      </TabsContent>

      <TabsContent value="history">
        <PayoutHistory />
      </TabsContent>
    </Tabs>
  );
};