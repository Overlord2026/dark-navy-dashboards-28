import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Bug, Lightbulb, HelpCircle, X, Send } from 'lucide-react';
import { toast } from 'sonner';
import { useLocation } from 'react-router-dom';

interface FeedbackOption {
  type: 'bug' | 'suggestion' | 'help';
  label: string;
  icon: React.ReactNode;
  color: string;
}

export function PersistentFeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<FeedbackOption['type'] | null>(null);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();

  const feedbackOptions: FeedbackOption[] = [
    {
      type: 'bug',
      label: 'Report Bug',
      icon: <Bug className="h-4 w-4" />,
      color: 'bg-red-100 text-red-700 hover:bg-red-200'
    },
    {
      type: 'suggestion',
      label: 'Suggestion',
      icon: <Lightbulb className="h-4 w-4" />,
      color: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
    },
    {
      type: 'help',
      label: 'Need Help',
      icon: <HelpCircle className="h-4 w-4" />,
      color: 'bg-blue-100 text-blue-700 hover:bg-blue-200'
    }
  ];

  const handleSubmit = async () => {
    if (!selectedType || !feedback.trim()) {
      toast.error('Please select a type and provide feedback');
      return;
    }

    setIsSubmitting(true);

    // Capture context automatically
    const context = {
      page: location.pathname,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      type: selectedType,
      feedback: feedback.trim()
    };

    // Track feedback event with context
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'feedback_submitted', {
        feedback_type: selectedType,
        page_path: location.pathname,
        feedback_length: feedback.length
      });
    }

    // Simulate API call (replace with actual implementation)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Thank you for your feedback! We\'ll review it shortly.');
    
    // Reset form
    setFeedback('');
    setSelectedType(null);
    setIsOpen(false);
    setIsSubmitting(false);
  };

  return (
    <>
      {/* Trigger Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.3 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90"
          aria-label="Provide feedback"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </motion.div>

      {/* Feedback Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="w-full max-w-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Quick Feedback</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="p-1 h-auto"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {!selectedType ? (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground mb-4">
                        What would you like to share?
                      </p>
                      {feedbackOptions.map((option) => (
                        <Button
                          key={option.type}
                          variant="outline"
                          className={`w-full justify-start gap-3 h-auto py-3 ${option.color}`}
                          onClick={() => setSelectedType(option.type)}
                        >
                          {option.icon}
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedType(null)}
                          className="p-1 h-auto"
                        >
                          ←
                        </Button>
                        <span className="text-sm font-medium">
                          {feedbackOptions.find(o => o.type === selectedType)?.label}
                        </span>
                      </div>

                      <Textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder={
                          selectedType === 'bug' ? 'Describe the issue you encountered...' :
                          selectedType === 'suggestion' ? 'Share your idea for improvement...' :
                          'What do you need help with?'
                        }
                        className="min-h-[100px]"
                        autoFocus
                      />

                      <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                        Page: {location.pathname} • Auto-captured for context
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setSelectedType(null)}
                          className="flex-1"
                        >
                          Back
                        </Button>
                        <Button
                          onClick={handleSubmit}
                          disabled={isSubmitting || !feedback.trim()}
                          className="flex-1"
                        >
                          {isSubmitting ? (
                            'Sending...'
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Send
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}