import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Star, Bug, Lightbulb, Send, ThumbsUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FeedbackCollectorProps {
  context?: string; // Where the feedback is coming from
  variant?: 'button' | 'card' | 'floating';
  onFeedbackSubmitted?: (feedback: any) => void;
}

const FeedbackCollector: React.FC<FeedbackCollectorProps> = ({
  context = 'general',
  variant = 'button',
  onFeedbackSubmitted
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'bug' | 'feature' | 'general' | 'praise'>('general');
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const feedbackTypes = [
    { value: 'bug', label: 'Bug Report', icon: Bug, color: 'destructive' },
    { value: 'feature', label: 'Feature Request', icon: Lightbulb, color: 'default' },
    { value: 'general', label: 'General Feedback', icon: MessageCircle, color: 'secondary' },
    { value: 'praise', label: 'Compliment', icon: ThumbsUp, color: 'default' }
  ];

  const selectedType = feedbackTypes.find(type => type.value === feedbackType);

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      toast({
        title: "Feedback required",
        description: "Please provide your feedback before submitting.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real implementation, this would submit to your feedback service
      const feedbackData = {
        type: feedbackType,
        message: feedback,
        email: email || 'anonymous',
        context,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Feedback submitted:', feedbackData);
      
      onFeedbackSubmitted?.(feedbackData);

      toast({
        title: "Thank you for your feedback!",
        description: "We appreciate your input and will review it soon.",
      });

      // Reset form
      setFeedback('');
      setEmail('');
      setFeedbackType('general');
      setIsModalOpen(false);

    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Please try again or contact support directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const FeedbackContent = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Feedback Type</label>
        <div className="grid grid-cols-2 gap-2">
          {feedbackTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <Button
                key={type.value}
                variant={feedbackType === type.value ? "default" : "outline"}
                size="sm"
                onClick={() => setFeedbackType(type.value as any)}
                className="gap-2 h-auto p-3"
              >
                <IconComponent className="w-4 h-4" />
                <span className="text-xs">{type.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Your Feedback</label>
        <Textarea
          placeholder={`Share your ${feedbackType} with us...`}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="min-h-[100px]"
          aria-label="Feedback message"
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">
          Email (optional)
        </label>
        <Input
          type="email"
          placeholder="your-email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email address for follow-up"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Only if you'd like us to follow up with you
        </p>
      </div>

      <Button 
        onClick={handleSubmit}
        disabled={isSubmitting || !feedback.trim()}
        className="w-full gap-2"
      >
        <Send className="w-4 h-4" />
        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
      </Button>

      <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
        <strong>Context:</strong> {context} | <strong>Page:</strong> {window.location.pathname}
      </div>
    </div>
  );

  if (variant === 'card') {
    return (
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Share Your Feedback</h3>
            <Badge variant="secondary" className="text-xs">Beta</Badge>
          </div>
          <FeedbackContent />
        </CardContent>
      </Card>
    );
  }

  if (variant === 'floating') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-20 right-4 z-40"
      >
        <Button
          onClick={() => setIsModalOpen(true)}
          className="rounded-full h-12 w-12 shadow-lg bg-gradient-to-r from-primary to-gold hover:from-primary/90 hover:to-gold/90"
          aria-label="Open feedback form"
        >
          <MessageCircle className="w-5 h-5" />
        </Button>
      </motion.div>
    );
  }

  return (
    <>
      <Button 
        onClick={() => setIsModalOpen(true)}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        <MessageCircle className="w-4 h-4" />
        Give Feedback
      </Button>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedType && <selectedType.icon className="w-5 h-5 text-primary" />}
              Share Your Feedback
            </DialogTitle>
          </DialogHeader>
          <FeedbackContent />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FeedbackCollector;