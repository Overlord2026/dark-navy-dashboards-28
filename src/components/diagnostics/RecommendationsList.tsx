
import React from 'react';
import { Recommendation } from '@/types/diagnostics';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface RecommendationsListProps {
  recommendations: Recommendation[];
}

export function RecommendationsList({ recommendations }: RecommendationsListProps) {
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-lg font-medium">Recommendations</h3>
      <div className="space-y-3">
        {recommendations.map((rec) => (
          <Card key={rec.id} className={`
            ${rec.priority === 'high' ? 'border-l-4 border-l-red-500' : ''}
            ${rec.priority === 'medium' ? 'border-l-4 border-l-amber-500' : ''}
            ${rec.priority === 'low' ? 'border-l-4 border-l-blue-500' : ''}
          `}>
            <CardContent className="p-4 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  {rec.priority === 'high' && <AlertCircle className="h-4 w-4 text-red-500" />}
                  {rec.priority === 'medium' && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                  {rec.priority === 'low' && <Info className="h-4 w-4 text-blue-500" />}
                  <h4 className="font-medium">{rec.title || rec.text}</h4>
                  <Badge className={`
                    ${rec.priority === 'high' ? 'bg-red-100 text-red-700 hover:bg-red-100' : ''}
                    ${rec.priority === 'medium' ? 'bg-amber-100 text-amber-700 hover:bg-amber-100' : ''}
                    ${rec.priority === 'low' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' : ''}
                  `}>
                    {rec.priority} priority
                  </Badge>
                </div>
                {rec.description && <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>}
              </div>
              {rec.actionable && rec.action && (
                <Button size="sm" variant="outline">{rec.action}</Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
