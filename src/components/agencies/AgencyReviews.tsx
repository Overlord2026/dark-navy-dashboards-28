import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface Review {
  id: string;
  rating: number;
  review_text?: string;
  response_text?: string;
  responded_at?: string;
  created_at: string;
  advisor_name?: string;
}

interface AgencyReviewsProps {
  agencyId: string;
}

export const AgencyReviews: React.FC<AgencyReviewsProps> = ({ agencyId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, [agencyId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('agency_reviews')
        .select(`
          *
        `)
        .eq('agency_id', agencyId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedReviews: Review[] = (data || []).map(review => ({
        id: review.id,
        rating: review.rating,
        review_text: review.review_text,
        response_text: review.response_text,
        responded_at: review.responded_at,
        created_at: review.created_at,
        advisor_name: 'Anonymous Advisor'
      }));

      setReviews(transformedReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load reviews."
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleReviewExpansion = (reviewId: string) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReviews(newExpanded);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating 
            ? 'fill-gold-primary text-gold-primary' 
            : 'text-muted-foreground'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No reviews yet.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Be the first to work with this agency and leave a review!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Review Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Review Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[5, 4, 3, 2, 1].map(rating => {
              const count = reviews.filter(r => r.rating === rating).length;
              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
              
              return (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm font-medium">{rating}</span>
                  <Star className="w-4 h-4 fill-gold-primary text-gold-primary" />
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div 
                      className="bg-gold-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">({count})</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Individual Reviews */}
      <div className="space-y-4">
        {reviews.map((review) => {
          const isExpanded = expandedReviews.has(review.id);
          const shouldTruncate = review.review_text && review.review_text.length > 200;
          
          return (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Review Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {renderStars(review.rating)}
                        <Badge variant="outline" className="text-xs">
                          {review.rating}/5
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        by {review.advisor_name} • {format(new Date(review.created_at), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>

                  {/* Review Text */}
                  {review.review_text && (
                    <div>
                      <p className="text-foreground leading-relaxed">
                        {shouldTruncate && !isExpanded
                          ? `${review.review_text.substring(0, 200)}...`
                          : review.review_text
                        }
                      </p>
                      {shouldTruncate && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 p-0 h-auto font-normal text-blue-primary hover:text-blue-primary/80"
                          onClick={() => toggleReviewExpansion(review.id)}
                        >
                          {isExpanded ? 'Show less' : 'Read more'}
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Agency Response */}
                  {review.response_text && (
                    <div className="bg-muted/50 rounded-lg p-4 border-l-4 border-gold-primary">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageCircle className="w-4 h-4 text-gold-primary" />
                        <span className="text-sm font-medium text-gold-primary">
                          Agency Response
                        </span>
                        {review.responded_at && (
                          <span className="text-xs text-muted-foreground">
                            • {format(new Date(review.responded_at), 'MMM d, yyyy')}
                          </span>
                        )}
                      </div>
                      <p className="text-foreground leading-relaxed">
                        {review.response_text}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};