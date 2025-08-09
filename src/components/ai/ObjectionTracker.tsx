import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  User, 
  AlertCircle,
  Brain,
  Target,
  ChevronRight
} from 'lucide-react';
import { analytics } from '@/lib/analytics';

interface Objection {
  type: 'price' | 'timing' | 'authority' | 'need';
  confidence: number;
  count: number;
  lastSeen: string;
  suggestedResponse: string;
  icon: React.ReactNode;
  color: string;
}

interface ObjectionTrackerProps {
  leadId?: string;
  className?: string;
}

export function ObjectionTracker({ leadId, className }: ObjectionTrackerProps) {
  const [objections, setObjections] = useState<Objection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadObjections();
  }, [leadId]);

  const loadObjections = async () => {
    setLoading(true);
    
    try {
      // In a real implementation, this would fetch from meeting summaries API
      // For now, we'll use mock data that simulates AI analysis
      const mockObjections: Objection[] = [
        {
          type: 'price',
          confidence: 85,
          count: 3,
          lastSeen: '2 hours ago',
          suggestedResponse: 'Present value calculator and ROI scenarios',
          icon: <DollarSign className="h-4 w-4" />,
          color: 'bg-red-100 text-red-800 border-red-200'
        },
        {
          type: 'timing',
          confidence: 72,
          count: 2,
          lastSeen: '1 day ago',
          suggestedResponse: 'Offer 48-hour follow-up with market insights',
          icon: <Clock className="h-4 w-4" />,
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
        },
        {
          type: 'authority',
          confidence: 90,
          count: 1,
          lastSeen: '3 hours ago',
          suggestedResponse: 'Request introduction to decision maker',
          icon: <User className="h-4 w-4" />,
          color: 'bg-blue-100 text-blue-800 border-blue-200'
        },
        {
          type: 'need',
          confidence: 45,
          count: 1,
          lastSeen: '5 hours ago',
          suggestedResponse: 'Share case studies and success stories',
          icon: <Target className="h-4 w-4" />,
          color: 'bg-green-100 text-green-800 border-green-200'
        }
      ];

      // Simulate AI detection analytics
      mockObjections.forEach(objection => {
        analytics.track('ai_objection_detected', {
          type: objection.type,
          confidence: objection.confidence,
          leadId,
          timestamp: Date.now()
        });
      });

      setObjections(mockObjections.filter(obj => obj.confidence > 50));
    } catch (error) {
      console.error('Error loading objections:', error);
    } finally {
      setLoading(false);
    }
  };

  const getObjectionTitle = (type: string) => {
    const titles = {
      price: 'Price Concerns',
      timing: 'Timing Issues',
      authority: 'Decision Authority',
      need: 'Need Clarity'
    };
    return titles[type as keyof typeof titles] || type;
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-24">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain className="h-5 w-5 text-primary" />
          AI Objection Tracker
          <Badge variant="secondary" className="ml-auto">
            {objections.length} detected
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {objections.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p>No objections detected yet</p>
            <p className="text-sm">AI will analyze meeting recordings and notes</p>
          </div>
        ) : (
          objections.map((objection) => (
            <div
              key={objection.type}
              className="space-y-3 p-4 rounded-lg border bg-muted/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className={objection.color}>
                    {objection.icon}
                    <span className="ml-1">{getObjectionTitle(objection.type)}</span>
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {objection.count}x mentioned
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">
                  {objection.lastSeen}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Confidence</span>
                  <span className="font-medium">{objection.confidence}%</span>
                </div>
                <Progress value={objection.confidence} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-3 w-3 text-primary" />
                  <span className="text-xs font-medium text-muted-foreground">
                    Suggested Response
                  </span>
                </div>
                <p className="text-sm bg-background p-3 rounded border">
                  {objection.suggestedResponse}
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  analytics.track('ai_objection_response_clicked', {
                    type: objection.type,
                    leadId,
                    timestamp: Date.now()
                  });
                }}
              >
                Apply Suggestion
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}