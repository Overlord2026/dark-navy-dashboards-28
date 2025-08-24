import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GuardrailsCardProps {
  alertCount: number;
  lastAlert?: {
    scenarioName: string;
    successProb: number;
    createdAt: string;
  };
}

export function GuardrailsCard({ alertCount, lastAlert }: GuardrailsCardProps) {
  const navigate = useNavigate();

  if (alertCount === 0) return null;

  const handleReview = () => {
    navigate('/family/tools/retirement');
  };

  return (
    <Card className="border-destructive/20 bg-destructive/5">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <CardTitle className="text-sm font-medium">Guardrails Alert</CardTitle>
        </div>
        <Badge variant="destructive" className="text-xs">
          {alertCount} scenario{alertCount > 1 ? 's' : ''}
        </Badge>
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-3">
          {lastAlert ? (
            <>
              <span className="font-medium">{lastAlert.scenarioName}</span> has a{' '}
              <span className="font-medium">{(lastAlert.successProb * 100).toFixed(1)}%</span>{' '}
              success rate, outside recommended guardrails.
            </>
          ) : (
            'Some retirement scenarios are outside recommended guardrails.'
          )}
        </CardDescription>
        <Button 
          size="sm" 
          onClick={handleReview}
          className="w-full"
        >
          <TrendingDown className="mr-2 h-4 w-4" />
          Re-run & Review
        </Button>
      </CardContent>
    </Card>
  );
}