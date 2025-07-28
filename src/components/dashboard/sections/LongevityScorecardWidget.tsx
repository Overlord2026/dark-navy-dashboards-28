import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Heart, TrendingUp, Calculator, ArrowRight } from 'lucide-react';
import { useEventTracking } from '@/hooks/useEventTracking';

export const LongevityScorecardWidget: React.FC = () => {
  const navigate = useNavigate();
  const { trackFeatureUsed } = useEventTracking();

  const handleStartScorecard = () => {
    trackFeatureUsed('longevity_scorecard_start', { source: 'dashboard_widget' });
    navigate('/longevity-scorecard');
  };

  return (
    <Card className="bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200 hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-pink-900">
          <Heart className="h-5 w-5 text-pink-600" />
          Health & Wealth Longevity Score
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-pink-700">
            Discover if your money will last as long as you do with our comprehensive longevity assessment.
          </p>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-pink-100 text-pink-700">
              <Calculator className="h-3 w-3 mr-1" />
              Stress Testing
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              <TrendingUp className="h-3 w-3 mr-1" />
              Bucket Strategy
            </Badge>
          </div>
        </div>

        <div className="bg-white/50 rounded-lg p-3">
          <h4 className="font-medium text-pink-900 mb-2">Assessment Includes:</h4>
          <ul className="text-xs text-pink-700 space-y-1">
            <li>• Sequence of returns stress testing</li>
            <li>• Inflation impact analysis</li>
            <li>• Asset bucket optimization</li>
            <li>• Healthspan vs. lifespan planning</li>
          </ul>
        </div>

        <Button 
          onClick={handleStartScorecard}
          className="w-full bg-pink-600 hover:bg-pink-700 text-white"
        >
          Take Longevity Scorecard
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};