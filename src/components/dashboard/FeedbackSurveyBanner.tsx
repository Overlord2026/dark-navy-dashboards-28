
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { StarIcon, CheckIcon, X, ArrowDown, ArrowUp } from 'lucide-react';
import { toast } from 'sonner';

interface FeedbackSurveyBannerProps {
  onDismiss: () => void;
}

export function FeedbackSurveyBanner({ onDismiss }: FeedbackSurveyBannerProps) {
  const [step, setStep] = useState<'rating' | 'feedback' | 'thankyou'>('rating');
  const [rating, setRating] = useState<number | null>(null);
  const [advancedToolsFeedback, setAdvancedToolsFeedback] = useState('');
  const [improvementsFeedback, setImprovementsFeedback] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  
  const handleRatingSubmit = () => {
    if (rating !== null) {
      setStep('feedback');
    } else {
      toast.error('Please select a rating before continuing');
    }
  };
  
  const handleFeedbackSubmit = () => {
    // In a real application, you would send this data to your backend
    setStep('thankyou');
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Thank you for your feedback!');
      onDismiss();
    }, 2000);
  };
  
  const handleStarClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };
  
  return (
    <div className="bg-gradient-to-r from-purple-600/20 to-indigo-500/20 rounded-lg p-6 mb-6 animate-fade-in border border-purple-500/30">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          {step === 'rating' && "How has your experience been so far?"}
          {step === 'feedback' && "We'd love to hear more details"}
          {step === 'thankyou' && "Thank you for your feedback!"}
        </h2>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onDismiss}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {step === 'rating' && (
        <>
          <p className="text-muted-foreground mb-6">
            Your feedback helps us enhance the platform and deliver a better experience.
          </p>
          
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col items-center">
              <p className="text-sm font-medium mb-3">Rate your overall experience</p>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleStarClick(star)}
                    className={`p-2 rounded-full transition-colors ${
                      rating !== null && star <= rating 
                        ? 'text-yellow-400 bg-yellow-400/10' 
                        : 'text-muted-foreground hover:text-yellow-400 hover:bg-yellow-400/10'
                    }`}
                  >
                    <StarIcon className="h-8 w-8" />
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={handleRatingSubmit}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Continue
              </Button>
            </div>
          </div>
        </>
      )}
      
      {step === 'feedback' && (
        <>
          <p className="text-muted-foreground mb-6">
            Thank you for your rating! Please share more specific feedback to help us improve.
          </p>
          
          <div className="space-y-4">
            <div className="border border-border/40 rounded-md overflow-hidden">
              <button 
                onClick={() => toggleSection('advancedTools')}
                className="w-full flex justify-between items-center p-3 bg-background/80 hover:bg-background/90 text-left"
              >
                <span className="font-medium">Are you finding value in the advanced tools?</span>
                {expandedSection === 'advancedTools' ? (
                  <ArrowUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ArrowDown className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
              
              {expandedSection === 'advancedTools' && (
                <div className="p-3 bg-background/60">
                  <Textarea
                    placeholder="Tell us which advanced features you're finding most valuable..."
                    value={advancedToolsFeedback}
                    onChange={(e) => setAdvancedToolsFeedback(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
              )}
            </div>
            
            <div className="border border-border/40 rounded-md overflow-hidden">
              <button 
                onClick={() => toggleSection('improvements')}
                className="w-full flex justify-between items-center p-3 bg-background/80 hover:bg-background/90 text-left"
              >
                <span className="font-medium">Is there anything you'd like us to improve?</span>
                {expandedSection === 'improvements' ? (
                  <ArrowUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ArrowDown className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
              
              {expandedSection === 'improvements' && (
                <div className="p-3 bg-background/60">
                  <Textarea
                    placeholder="Any suggestions for improvements or new features..."
                    value={improvementsFeedback}
                    onChange={(e) => setImprovementsFeedback(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setStep('rating')}
              >
                Back
              </Button>
              <Button 
                onClick={handleFeedbackSubmit}
                className="bg-purple-600 hover:bg-purple-700"
                disabled={expandedSection !== null && (
                  (expandedSection === 'advancedTools' && !advancedToolsFeedback) || 
                  (expandedSection === 'improvements' && !improvementsFeedback)
                )}
              >
                Submit Feedback
              </Button>
            </div>
          </div>
        </>
      )}
      
      {step === 'thankyou' && (
        <div className="flex flex-col items-center justify-center py-6">
          <div className="bg-green-500/20 p-3 rounded-full mb-4">
            <CheckIcon className="h-8 w-8 text-green-500" />
          </div>
          <p className="text-center text-muted-foreground">
            Thank you for sharing your thoughts! Your feedback is invaluable as we continue to 
            improve our platform.
          </p>
        </div>
      )}
    </div>
  );
}
