import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AgencyRatingModalProps {
  agencyId: string;
  agencyName: string;
  campaignId?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const AgencyRatingModal: React.FC<AgencyRatingModalProps> = ({
  agencyId,
  agencyName,
  campaignId,
  onClose,
  onSuccess
}) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        variant: "destructive",
        title: "Rating Required",
        description: "Please select a rating before submitting."
      });
      return;
    }

    try {
      setLoading(true);

      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('You must be logged in to submit a review');
      }

      // Create review record
      const { error: reviewError } = await supabase
        .from('agency_reviews')
        .insert({
          agency_id: agencyId,
          advisor_id: user.id,
          campaign_id: campaignId,
          rating: rating,
          review_text: reviewText.trim() || null
        });

      if (reviewError) throw reviewError;

      toast({
        title: "Review Submitted!",
        description: "Thank you for your feedback. Your review helps other advisors make informed decisions."
      });

      onSuccess();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit review."
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1;
      const isActive = starValue <= (hoveredRating || rating);
      
      return (
        <button
          key={i}
          type="button"
          className="focus:outline-none transition-colors"
          onMouseEnter={() => setHoveredRating(starValue)}
          onMouseLeave={() => setHoveredRating(0)}
          onClick={() => setRating(starValue)}
        >
          <Star
            className={`w-8 h-8 ${
              isActive 
                ? 'fill-gold-primary text-gold-primary' 
                : 'text-muted-foreground hover:text-gold-primary/50'
            }`}
          />
        </button>
      );
    });
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Very Good';
      case 5: return 'Excellent';
      default: return '';
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Rate Your Experience
          </DialogTitle>
          <p className="text-muted-foreground">
            How was your experience working with {agencyName}?
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Star Rating */}
          <div className="space-y-3">
            <Label>Your Rating</Label>
            <div className="flex justify-center gap-1">
              {renderStars()}
            </div>
            {(hoveredRating || rating) > 0 && (
              <p className="text-center text-sm font-medium text-gold-primary">
                {getRatingText(hoveredRating || rating)}
              </p>
            )}
          </div>

          {/* Review Text */}
          <div className="space-y-2">
            <Label htmlFor="review_text">
              Your Review (Optional)
            </Label>
            <Textarea
              id="review_text"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience working with this agency. What went well? What could be improved?"
              rows={4}
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground text-right">
              {reviewText.length}/1000 characters
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="marketplace" disabled={loading || rating === 0}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Review
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};