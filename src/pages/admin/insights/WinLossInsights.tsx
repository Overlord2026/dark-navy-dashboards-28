import React, { useState, useEffect } from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, TrendingDown, BarChart3, Calendar } from 'lucide-react';

export default function WinLossInsights() {
  return (
    <ThreeColumnLayout 
      title="Win/Loss Insights" 
      activeMainItem="admin"
      activeSecondaryItem="insights"
      secondaryMenuItems={[]}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Win/Loss Learning Insights</h1>
          <p className="text-muted-foreground">
            Weekly digest of win/loss patterns for coaching and improvement
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-success" />
                Top Win Reasons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Price/Value Match</span>
                  <Badge>45%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Strong Relationship</span>
                  <Badge>32%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Perfect Timing</span>
                  <Badge>23%</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-destructive" />
                Top Loss Reasons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Price Too High</span>
                  <Badge variant="destructive">38%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Timing Not Right</span>
                  <Badge variant="destructive">29%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Chose Competitor</span>
                  <Badge variant="destructive">21%</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ThreeColumnLayout>
  );
}