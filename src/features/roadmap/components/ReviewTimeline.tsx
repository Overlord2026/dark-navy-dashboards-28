import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { Review } from '../types';

interface ReviewTimelineProps {
  reviews: Review[];
  activeReviewId?: string;
  onReviewSelect: (review: Review) => void;
}

export function ReviewTimeline({
  reviews,
  activeReviewId,
  onReviewSelect,
}: ReviewTimelineProps) {
  const sortedReviews = [...reviews].sort(
    (a, b) => new Date(b.runAt).getTime() - new Date(a.runAt).getTime()
  );

  const getSuccessDelta = (index: number) => {
    if (index >= sortedReviews.length - 1) return null;
    const current = sortedReviews[index].results.successProb;
    const previous = sortedReviews[index + 1].results.successProb;
    return ((current - previous) * 100).toFixed(1);
  };

  const getDeltaIcon = (delta: string | null) => {
    if (!delta) return <Minus className="h-3 w-3" />;
    const num = parseFloat(delta);
    if (num > 0) return <TrendingUp className="h-3 w-3 text-green-600" />;
    if (num < 0) return <TrendingDown className="h-3 w-3 text-red-600" />;
    return <Minus className="h-3 w-3" />;
  };

  return (
    <div className="flex gap-2 p-4 border-b border-border">
      <span className="text-sm font-medium text-muted-foreground mr-2">
        Reviews:
      </span>
      <div className="flex gap-2 overflow-x-auto">
        {sortedReviews.map((review, index) => {
          const delta = getSuccessDelta(index);
          const isActive = activeReviewId === review.id;
          
          return (
            <Badge
              key={review.id}
              variant={isActive ? 'default' : 'secondary'}
              className="cursor-pointer hover:bg-accent/80 flex items-center gap-1 whitespace-nowrap"
              onClick={() => onReviewSelect(review)}
            >
              <span>{(review.results.successProb * 100).toFixed(0)}%</span>
              {delta && (
                <span className="flex items-center gap-0.5">
                  {getDeltaIcon(delta)}
                  <span className="text-xs">{Math.abs(parseFloat(delta))}%</span>
                </span>
              )}
            </Badge>
          );
        })}
      </div>
    </div>
  );
}