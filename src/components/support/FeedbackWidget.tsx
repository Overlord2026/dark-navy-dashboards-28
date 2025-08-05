import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Bug, 
  Lightbulb, 
  Send, 
  X,
  Star,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useEventTracking } from '@/hooks/useEventTracking';

interface FeedbackWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  context?: string;
}

export const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({
  isOpen,
  onToggle,
  context = 'general'
}) => {
  const [feedbackType, setFeedbackType] = useState<'bug' | 'feature' | 'general'>('general');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { trackFeatureUsed } = useEventTracking();

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast({
        title: "Message Required",
        description: "Please enter your feedback before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    trackFeatureUsed('feedback_submitted', { 
      type: feedbackType, 
      rating, 
      context,
      message_length: message.length 
    });

    try {
      // In a real implementation, this would send to your support system
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Feedback Sent!",
        description: "Thank you for your feedback. We'll review it and get back to you soon.",
      });

      // Reset form
      setMessage('');
      setRating(0);
      setFeedbackType('general');
      onToggle();

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFeedbackIcon = (type: string) => {
    switch (type) {
      case 'bug': return <Bug className="h-4 w-4" />;
      case 'feature': return <Lightbulb className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getFeedbackColor = (type: string) => {
    switch (type) {
      case 'bug': return 'text-red-500';
      case 'feature': return 'text-blue-500';
      default: return 'text-green-500';
    }
  };

  if (!isOpen) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 left-6 z-50"
      >
        <Button
          onClick={onToggle}
          size="lg"
          className="rounded-full w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg group"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
        <div className="absolute -top-12 left-0 bg-black text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          Feedback
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-6 left-6 z-50 w-80"
    >
      <Card className="shadow-xl border-blue-500/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-white" />
              </div>
              Share Feedback
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Help us improve your experience
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Feedback Type */}
          <div>
            <label className="text-sm font-medium mb-2 block">What type of feedback?</label>
            <Select value={feedbackType} onValueChange={(value: any) => setFeedbackType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-green-500" />
                    General Feedback
                  </div>
                </SelectItem>
                <SelectItem value="bug">
                  <div className="flex items-center gap-2">
                    <Bug className="h-4 w-4 text-red-500" />
                    Bug Report
                  </div>
                </SelectItem>
                <SelectItem value="feature">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-blue-500" />
                    Feature Request
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Rating */}
          <div>
            <label className="text-sm font-medium mb-2 block">How would you rate your experience?</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`p-1 transition-colors ${
                    star <= rating ? 'text-yellow-400' : 'text-muted-foreground'
                  }`}
                >
                  <Star className="h-5 w-5 fill-current" />
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="text-sm font-medium mb-2 block">Your message</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                feedbackType === 'bug' 
                  ? 'Describe the bug you encountered...'
                  : feedbackType === 'feature'
                  ? 'What feature would you like to see?'
                  : 'Share your thoughts with us...'
              }
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Priority indicator for bugs */}
          {feedbackType === 'bug' && (
            <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg border border-red-200">
              <Zap className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-700">
                Critical bugs get priority response
              </span>
            </div>
          )}

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !message.trim()}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mr-2"
                >
                  <Send className="h-4 w-4" />
                </motion.div>
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Feedback
              </>
            )}
          </Button>

          {/* Context info */}
          {context !== 'general' && (
            <div className="text-xs text-muted-foreground text-center">
              <Badge variant="outline" className="text-xs">
                Context: {context}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};