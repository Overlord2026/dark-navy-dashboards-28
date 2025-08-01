import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ThumbsUp, ThumbsDown, MessageSquare, Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

export const TaxFeedbackWidget: React.FC = () => {
  const [helpful, setHelpful] = useState<string>('');
  const [improvements, setImprovements] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!helpful) {
      toast({
        title: "Please select an option",
        description: "Let us know if you found this tool helpful.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // In production, this would submit to an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubmitted(true);
      toast({
        title: "Thank you for your feedback!",
        description: "Your input helps us improve our tax planning tools."
      });
    } catch (error) {
      toast({
        title: "Error submitting feedback",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-6 text-center"
      >
        <div className="flex items-center justify-center gap-2 text-emerald-600 mb-2">
          <ThumbsUp className="h-5 w-5" />
          <span className="font-medium">Thank you for your feedback!</span>
        </div>
        <p className="text-sm text-emerald-700">
          Your input helps us continuously improve our tax planning tools.
        </p>
      </motion.div>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-slate-50 to-blue-50 border-slate-200">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h3 className="font-medium text-foreground">Feedback</h3>
          </div>
          
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Did you find this tool helpful?
            </Label>
            <RadioGroup value={helpful} onValueChange={setHelpful}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="helpful-yes" />
                <Label htmlFor="helpful-yes" className="flex items-center gap-2 cursor-pointer">
                  <ThumbsUp className="h-4 w-4 text-emerald-600" />
                  Yes, very helpful
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="somewhat" id="helpful-somewhat" />
                <Label htmlFor="helpful-somewhat" className="cursor-pointer">
                  Somewhat helpful
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="helpful-no" />
                <Label htmlFor="helpful-no" className="flex items-center gap-2 cursor-pointer">
                  <ThumbsDown className="h-4 w-4 text-red-500" />
                  Not helpful
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="improvements" className="text-sm font-medium">
              What would you improve?
            </Label>
            <Textarea
              id="improvements"
              placeholder="Share your suggestions for improving this tool..."
              value={improvements}
              onChange={(e) => setImprovements(e.target.value)}
              className="min-h-[80px] resize-none"
            />
          </div>

          <Button 
            type="submit" 
            disabled={!helpful || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              "Submitting..."
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Feedback
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};