import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import {
  TrendingUp,
  Users,
  DollarSign,
  Target,
  RefreshCcw,
  Calendar,
  Award,
  Activity
} from 'lucide-react';
import { useReferralAnalytics } from '@/hooks/useReferralAnalytics';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

export const ReferralAnalytics = () => {
  const [periodDays, setPeriodDays] = useState(30);
  const {
    topReferrers,
    conversionAnalytics,
    rewardAnalytics,
    campaignAnalytics,
    summaryMetrics,
    loading,
    refreshAnalytics
  } = useReferralAnalytics(periodDays);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getReferrerTypeBadge = (type: string) => {
    const badges = {
      client_advisor: <Badge variant="default">Client/Advisor</Badge>,
      franchise: <Badge variant="secondary">Franchise</Badge>
    };
    return badges[type as keyof typeof badges] || <Badge variant="outline">{type}</Badge>;
  };

  const getRewardTypeBadge = (type: string) => {
    const badges = {
      referral_reward: <Badge variant="default">Referral</Badge>,
      advisor_override: <Badge variant="secondary">Override</Badge>,
      franchise_reward: <Badge className="bg-purple-500 text-white">Franchise</Badge>
    };
    return badges[type as keyof typeof badges] || <Badge variant="outline">{type}</Badge>;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Referral Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into your referral program performance
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select
            value={periodDays.toString()}
            onValueChange={(value) => setPeriodDays(parseInt(value))}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={refreshAnalytics}
            disabled={loading}
            variant="outline"
            size="sm"
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryMetrics.totalReferrals}</div>
            <p className="text-xs text-muted-foreground">
              {summaryMetrics.totalActiveReferrals} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summaryMetrics.overallConversionRate.toFixed(1)}%
            </div>
            <Progress 
              value={summaryMetrics.overallConversionRate} 
              className="mt-2" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rewards Paid</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summaryMetrics.totalRewardsPaid)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(summaryMetrics.totalRewardsPending)} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Referrer</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {topReferrers[0]?.referrer_name || 'No data'}
            </div>
            <p className="text-xs text-muted-foreground">
              {topReferrers[0]?.total_referrals || 0} referrals
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="referrers">Top Referrers</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Conversion Analytics Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Conversion Analytics</CardTitle>
                <CardDescription>
                  Referral performance by type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={conversionAnalytics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="referral_type" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total_referrals" fill={COLORS[0]} name="Total" />
                    <Bar dataKey="active_referrals" fill={COLORS[1]} name="Active" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Reward Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Reward Distribution</CardTitle>
                <CardDescription>
                  Breakdown of reward types
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={rewardAnalytics}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ reward_type, total_amount }) => 
                        `${reward_type}: ${formatCurrency(total_amount)}`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="total_amount"
                    >
                      {rewardAnalytics.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Conversion Metrics Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Conversion Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Type</th>
                      <th className="text-right py-2">Total</th>
                      <th className="text-right py-2">Active</th>
                      <th className="text-right py-2">Pending</th>
                      <th className="text-right py-2">Conversion</th>
                      <th className="text-right py-2">Avg. Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {conversionAnalytics.map((item) => (
                      <tr key={item.referral_type} className="border-b">
                        <td className="py-2">
                          {getReferrerTypeBadge(item.referral_type)}
                        </td>
                        <td className="text-right py-2">{item.total_referrals}</td>
                        <td className="text-right py-2">{item.active_referrals}</td>
                        <td className="text-right py-2">{item.pending_referrals}</td>
                        <td className="text-right py-2">{item.conversion_rate}%</td>
                        <td className="text-right py-2">
                          {item.avg_time_to_activation_days ? 
                            `${item.avg_time_to_activation_days} days` : 'N/A'
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="referrers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Referrers</CardTitle>
              <CardDescription>
                Leading performers in your referral program
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topReferrers.map((referrer, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl font-bold text-muted-foreground">
                        #{index + 1}
                      </div>
                      <div>
                        <div className="font-semibold">{referrer.referrer_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {referrer.referrer_email}
                        </div>
                        <div className="mt-1">
                          {getReferrerTypeBadge(referrer.referrer_type)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{referrer.total_referrals}</div>
                      <div className="text-sm text-muted-foreground">
                        {referrer.active_referrals} active ({referrer.conversion_rate}%)
                      </div>
                      <div className="text-sm font-medium">
                        {formatCurrency(referrer.total_rewards)} earned
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
              <CardDescription>
                UTM tracking and marketing ROI analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Source</th>
                      <th className="text-left py-2">Medium</th>
                      <th className="text-left py-2">Campaign</th>
                      <th className="text-right py-2">Referrals</th>
                      <th className="text-right py-2">Active</th>
                      <th className="text-right py-2">Conversion</th>
                      <th className="text-right py-2">ROI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaignAnalytics.map((campaign, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">
                          <Badge variant="outline">{campaign.utm_source}</Badge>
                        </td>
                        <td className="py-2">
                          <Badge variant="outline">{campaign.utm_medium}</Badge>
                        </td>
                        <td className="py-2">
                          <Badge variant="outline">{campaign.utm_campaign}</Badge>
                        </td>
                        <td className="text-right py-2">{campaign.total_referrals}</td>
                        <td className="text-right py-2">{campaign.active_referrals}</td>
                        <td className="text-right py-2">{campaign.conversion_rate}%</td>
                        <td className="text-right py-2">
                          {formatCurrency(campaign.total_rewards)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payout Analytics</CardTitle>
              <CardDescription>
                Detailed breakdown of reward payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {rewardAnalytics.map((reward) => (
                  <Card key={reward.reward_type}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">
                        {getRewardTypeBadge(reward.reward_type)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Total Amount:</span>
                        <span className="font-medium">
                          {formatCurrency(reward.total_amount)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Paid:</span>
                        <span className="font-medium text-green-600">
                          {formatCurrency(reward.paid_amount)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Pending:</span>
                        <span className="font-medium text-yellow-600">
                          {formatCurrency(reward.pending_amount)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Count:</span>
                        <span>{reward.count_total} total</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};