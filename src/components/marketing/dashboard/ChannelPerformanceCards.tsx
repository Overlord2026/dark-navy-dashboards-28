import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Facebook, Linkedin, Chrome, Youtube, Mail, MessageSquare } from 'lucide-react';
import { SpendSnapshot, MarketingChannel } from '@/marketing/types';

interface ChannelPerformanceCardsProps {
  spendData: SpendSnapshot[];
}

const CHANNEL_ICONS = {
  facebook: Facebook,
  linkedin: Linkedin,
  google: Chrome,
  youtube: Youtube,
  email: Mail,
  sms: MessageSquare,
};

const CHANNEL_COLORS = {
  facebook: 'bg-blue-500',
  linkedin: 'bg-blue-600',
  google: 'bg-red-500',
  youtube: 'bg-red-600',
  email: 'bg-green-500',
  sms: 'bg-purple-500',
};

export function ChannelPerformanceCards({ spendData }: ChannelPerformanceCardsProps) {
  // Aggregate metrics by channel
  const channelMetrics = spendData.reduce((acc, snapshot) => {
    const channel = snapshot.channel;
    if (!acc[channel]) {
      acc[channel] = {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        spend: 0,
        ctr: 0,
        cpc: 0,
        cpl: 0,
        cpa: 0,
        roas: 0,
        count: 0,
      };
    }
    
    acc[channel].impressions += snapshot.metrics.impressions;
    acc[channel].clicks += snapshot.metrics.clicks;
    acc[channel].conversions += snapshot.metrics.conversions;
    acc[channel].spend += snapshot.metrics.spend;
    acc[channel].ctr += snapshot.metrics.ctr;
    acc[channel].cpc += snapshot.metrics.cpc;
    acc[channel].cpl += snapshot.metrics.cpl;
    acc[channel].cpa += snapshot.metrics.cpa;
    acc[channel].roas += snapshot.metrics.roas;
    acc[channel].count += 1;
    
    return acc;
  }, {} as Record<string, any>);

  // Calculate averages
  Object.keys(channelMetrics).forEach(channel => {
    const data = channelMetrics[channel];
    const count = data.count;
    if (count > 0) {
      data.ctr = data.ctr / count;
      data.cpc = data.cpc / count;
      data.cpl = data.cpl / count;
      data.cpa = data.cpa / count;
      data.roas = data.roas / count;
    }
  });

  const channels = Object.keys(channelMetrics) as MarketingChannel[];

  if (channels.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Channel Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>No performance data available yet.</p>
            <p className="text-sm">Metrics will appear once campaigns are live.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Channel Performance</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {channels.map(channel => {
          const metrics = channelMetrics[channel];
          const Icon = CHANNEL_ICONS[channel];
          const colorClass = CHANNEL_COLORS[channel];
          
          // Mock trend calculation (in real app, compare with previous period)
          const trendDirection = Math.random() > 0.5 ? 'up' : 'down';
          const trendValue = (Math.random() * 20 + 5).toFixed(1);
          
          return (
            <Card key={channel}>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <div className={`p-2 rounded-lg ${colorClass} text-white mr-3`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-sm font-medium capitalize">
                    {channel}
                  </CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    {trendDirection === 'up' ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                    <span className={`text-xs ${trendDirection === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {trendValue}%
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">CTR</p>
                    <p className="font-medium">{(metrics.ctr * 100).toFixed(2)}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">CPC</p>
                    <p className="font-medium">${metrics.cpc.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">CPL</p>
                    <p className="font-medium">${metrics.cpl.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">ROAS</p>
                    <p className="font-medium">{metrics.roas.toFixed(2)}x</p>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Spend:</span>
                    <span className="font-medium">${metrics.spend.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Conversions:</span>
                    <span className="font-medium">{metrics.conversions}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}