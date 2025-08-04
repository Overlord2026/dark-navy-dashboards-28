import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  MessageCircle, 
  Mail, 
  Phone, 
  Star,
  Send,
  Sparkles,
  Heart,
  Gift
} from 'lucide-react';
import { toast } from 'sonner';
import { useCelebration } from '@/hooks/useCelebration';

const recentMessages = [
  { id: 1, from: 'Onboarding Team', message: 'Welcome to BFO! Your onboarding is progressing well.', time: '2 hours ago', unread: false },
  { id: 2, from: 'Compliance Officer', message: 'Please upload your ADV filing when ready.', time: '1 day ago', unread: true },
  { id: 3, from: 'Support Team', message: 'Your custodian connection is now active!', time: '2 days ago', unread: false }
];

const milestones = [
  { id: 1, title: 'First File Upload', description: 'Successfully uploaded client data', achieved: true },
  { id: 2, title: 'Compliance Ready', description: 'Completed all required compliance tasks', achieved: false },
  { id: 3, title: 'Portal Live', description: 'Client portal is active and running', achieved: false }
];

export const CommunicationCenter = () => {
  const [message, setMessage] = useState('');
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const { triggerCelebration, CelebrationComponent } = useCelebration();

  const handleSendMessage = () => {
    if (message.trim()) {
      toast.success('Message sent to onboarding team!');
      setMessage('');
    }
  };

  const handleFeedbackSubmit = () => {
    if (feedback.trim() && rating > 0) {
      toast.success('Thank you for your feedback!');
      setFeedback('');
      setRating(0);
    }
  };

  const celebrateMilestone = (milestoneTitle: string) => {
    triggerCelebration('milestone', `🎉 ${milestoneTitle} achieved!`);
    toast.success(`Congratulations! ${milestoneTitle} completed!`);
  };

  return (
    <>
      {CelebrationComponent}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            Communication Center: Concierge Support
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Chat with Onboarding Team */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Chat with Onboarding Team
            </h4>
            <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
              {recentMessages.map((msg) => (
                <div key={msg.id} className={`p-3 border rounded-lg ${msg.unread ? 'border-primary/50 bg-primary/5' : ''}`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-sm">{msg.from}</span>
                    <span className="text-xs text-muted-foreground">{msg.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{msg.message}</p>
                  {msg.unread && (
                    <Badge className="mt-1 text-xs">New</Badge>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button onClick={handleSendMessage} size="sm">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Contact Options */}
          <div>
            <h4 className="font-semibold mb-3">Contact Options</h4>
            <div className="grid grid-cols-1 gap-2">
              <Button variant="outline" size="sm" className="justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Email Updates
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <Phone className="h-4 w-4 mr-2" />
                SMS Notifications
              </Button>
            </div>
          </div>

          {/* Milestone Celebrations */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Gift className="h-4 w-4" />
              Milestone Celebrations
            </h4>
            <div className="space-y-2">
              {milestones.map((milestone) => (
                <div key={milestone.id} className={`p-3 border rounded-lg ${milestone.achieved ? 'border-green-500/50 bg-green-500/5' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{milestone.title}</div>
                      <div className="text-xs text-muted-foreground">{milestone.description}</div>
                    </div>
                    {milestone.achieved ? (
                      <Badge className="bg-green-500/10 text-green-700 border-green-500/20">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Achieved!
                      </Badge>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => celebrateMilestone(milestone.title)}
                      >
                        Celebrate
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback Section */}
          <div className="p-4 bg-muted/30 rounded-lg">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Heart className="h-4 w-4" />
              How was your experience?
            </h4>
            <div className="space-y-3">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button
                    key={star}
                    variant="ghost"
                    size="sm"
                    className="p-1"
                    onClick={() => setRating(star)}
                  >
                    <Star 
                      className={`h-4 w-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} 
                    />
                  </Button>
                ))}
              </div>
              <Textarea
                placeholder="Tell us about your onboarding experience..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={3}
              />
              <Button 
                onClick={handleFeedbackSubmit} 
                size="sm" 
                className="w-full"
                disabled={!feedback.trim() || rating === 0}
              >
                Submit Feedback
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};