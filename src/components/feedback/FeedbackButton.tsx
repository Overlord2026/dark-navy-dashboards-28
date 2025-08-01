import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MessageSquare, Send, Star } from 'lucide-react';
import { toast } from 'sonner';

interface FeedbackButtonProps {
  page: string;
  tool?: string;
  className?: string;
}

export function FeedbackButton({ page, tool, className = "" }: FeedbackButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      toast.error('Please provide feedback before submitting');
      return;
    }

    setIsSubmitting(true);
    
    // Track feedback event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'feedback_submitted', {
        page_title: page,
        tool_name: tool || 'unknown',
        rating: rating,
        feedback_length: feedback.length
      });
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Thank you for your feedback!');
    setFeedback('');
    setRating(0);
    setIsOpen(false);
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`min-h-[44px] px-4 py-2 ${className}`}
          aria-label="Suggest improvement for this page"
        >
          <MessageSquare className="h-4 w-4 mr-2" aria-hidden="true" />
          Suggest Improvement
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Suggest an Improvement</DialogTitle>
          <DialogDescription>
            Help us make {tool || page} better with your feedback
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Rating */}
          <div>
            <label className="text-sm font-medium">Rate this tool (optional)</label>
            <div className="flex gap-1 mt-2">
              {[1,2,3,4,5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1"
                  aria-label={`Rate ${star} stars`}
                >
                  <Star 
                    className={`h-5 w-5 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Feedback */}
          <div>
            <label className="text-sm font-medium">Your suggestion</label>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="What would make this better?"
              className="mt-2 min-h-[80px]"
              aria-label="Enter your improvement suggestion"
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>Submitting...</>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}