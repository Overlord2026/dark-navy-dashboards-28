import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, BarChart3, TrendingUp } from 'lucide-react';
import { MarketingCampaign } from '@/marketing/types';

interface ABTestResultsProps {
  campaigns: MarketingCampaign[];
}

export function ABTestResults({ campaigns }: ABTestResultsProps) {
  // Mock A/B test data - in real app, this would come from analytics
  const mockABTests = [
    {
      id: 'test-1',
      campaignName: 'Q1 Retirement Planning',
      variant: 'Headline Test',
      winner: 'Version B',
      confidence: 95,
      improvement: 23.5,
      metric: 'Conversion Rate',
      originalValue: 2.1,
      winnerValue: 2.6,
    },
    {
      id: 'test-2',
      campaignName: 'Young Professional Financial',
      variant: 'CTA Button',
      winner: 'Version A',
      confidence: 87,
      improvement: 15.2,
      metric: 'Click Rate',
      originalValue: 3.4,
      winnerValue: 3.9,
    },
    {
      id: 'test-3',
      campaignName: 'Corporate Executive Wealth',
      variant: 'Ad Creative',
      winner: 'Version C',
      confidence: 92,
      improvement: 31.8,
      metric: 'Cost per Lead',
      originalValue: 45.20,
      winnerValue: 30.80,
      isInverse: true, // Lower is better for CPL
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          A/B Test Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        {mockABTests.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No A/B tests completed yet.</p>
            <p className="text-sm">Results will appear as tests conclude.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {mockABTests.map(test => (
              <div key={test.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{test.campaignName}</h4>
                    <p className="text-sm text-muted-foreground">{test.variant}</p>
                  </div>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Trophy className="h-3 w-3" />
                    {test.winner}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Confidence</p>
                    <p className="font-medium text-green-600">{test.confidence}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Improvement</p>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="font-medium text-green-600">
                        {test.improvement}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{test.metric}</p>
                    <p className="font-medium">
                      {test.metric.includes('Cost') ? '$' : ''}{test.winnerValue}
                      {test.metric.includes('Rate') ? '%' : ''}
                      {!test.metric.includes('Cost') && !test.metric.includes('Rate') ? 'x' : ''}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
                  <span>
                    Original: {test.metric.includes('Cost') ? '$' : ''}{test.originalValue}
                    {test.metric.includes('Rate') ? '%' : ''}
                  </span>
                  <span>
                    Winner: {test.metric.includes('Cost') ? '$' : ''}{test.winnerValue}
                    {test.metric.includes('Rate') ? '%' : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}