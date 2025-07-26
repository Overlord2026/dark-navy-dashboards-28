import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, MessageSquare, ThumbsUp } from "lucide-react";
import { toast } from "sonner";

interface ModuleFeedbackProps {
  moduleId: string;
  moduleName: string;
  onFeedbackSubmit: (rating: number, feedback: string) => void;
}

export function ModuleFeedback({ moduleId, moduleName, onFeedbackSubmit }: ModuleFeedbackProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error("Please provide a rating");
      return;
    }

    onFeedbackSubmit(rating, feedback);
    setIsSubmitted(true);
    toast.success("Thank you for your feedback!");
  };

  if (isSubmitted) {
    return (
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4 text-center">
          <ThumbsUp className="h-8 w-8 text-primary mx-auto mb-2" />
          <p className="font-medium text-primary">Thank you for your feedback!</p>
          <p className="text-sm text-muted-foreground">
            Your input helps us improve our educational content.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-background/50 border-border/50">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h4 className="font-medium">How helpful was this module?</h4>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-1 rounded hover:bg-primary/10 transition-colors"
              >
                <Star
                  className={`h-6 w-6 ${
                    star <= (hoveredRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-sm text-muted-foreground">
              {rating > 0 && (
                <>
                  {rating} star{rating !== 1 ? 's' : ''}
                  {rating >= 4 && " - Excellent!"}
                  {rating === 3 && " - Good"}
                  {rating <= 2 && " - We'll improve this"}
                </>
              )}
            </span>
          </div>
          
          <Textarea
            placeholder="Optional: Share specific feedback or suggestions..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="min-h-[80px] resize-none"
          />
          
          <Button 
            onClick={handleSubmit}
            size="sm"
            className="w-full"
            disabled={rating === 0}
          >
            Submit Feedback
          </Button>
          
          <p className="text-xs text-muted-foreground text-center">
            Your feedback is anonymous and helps us create better educational content.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}