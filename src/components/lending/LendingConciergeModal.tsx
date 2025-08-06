import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Calendar, Phone, Mail, Video } from 'lucide-react';
import { toast } from 'sonner';

interface LendingConciergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientTier?: 'basic' | 'premium';
}

export function LendingConciergeModal({ isOpen, onClose, clientTier = 'basic' }: LendingConciergeModalProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'schedule' | 'callback'>('chat');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredTime: '',
    message: '',
    urgency: 'normal' as 'urgent' | 'normal' | 'routine'
  });

  const isPremiumClient = clientTier === 'premium';

  const handleCallbackRequest = async () => {
    try {
      // Simulate sending email to concierge
      const emailData = {
        to: 'concierge@familyoffice.com',
        subject: `${isPremiumClient ? 'PRIORITY' : ''} Lending Concierge Request - ${formData.name}`,
        body: `
Client: ${formData.name} (${isPremiumClient ? 'Premium' : 'Standard'} Tier)
Email: ${formData.email}
Phone: ${formData.phone}
Preferred Time: ${formData.preferredTime}
Urgency: ${formData.urgency}
Message: ${formData.message}

${isPremiumClient ? 'Note: This is a premium client request requiring priority handling.' : ''}
        `
      };

      // In a real app, this would call an edge function to send the email
      console.log('Sending email:', emailData);
      
      toast.success('Callback request sent!', {
        description: isPremiumClient 
          ? 'Your priority request has been sent. A senior concierge will contact you within 30 minutes.'
          : 'Your request has been sent. We\'ll contact you within 4 hours.',
      });
      
      onClose();
    } catch (error) {
      toast.error('Failed to send request. Please try again.');
    }
  };

  const handleScheduleGoogle = () => {
    window.open('https://calendar.google.com/calendar/appointments/create', '_blank');
    toast.success('Opening Google Calendar scheduling...');
  };

  const handleScheduleZoom = () => {
    window.open('https://zoom.us/book-a-meeting', '_blank');
    toast.success('Opening Zoom scheduling...');
  };

  const handleStartChat = () => {
    toast.success('Connecting to live chat...', {
      description: 'A lending specialist will be with you shortly.'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isPremiumClient && <Badge variant="default" className="bg-gradient-to-r from-amber-500 to-yellow-600">VIP</Badge>}
            Lending Concierge
          </DialogTitle>
          {isPremiumClient && (
            <p className="text-sm text-muted-foreground font-medium">
              Unlock your family's lending power—get matched to exclusive offers.
            </p>
          )}
        </DialogHeader>

        <div className="space-y-4">
          {/* Tab Navigation */}
          <div className="flex gap-1 p-1 bg-muted rounded-lg">
            <Button
              variant={activeTab === 'chat' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('chat')}
              className="flex-1"
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              Live Chat
            </Button>
            <Button
              variant={activeTab === 'schedule' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('schedule')}
              className="flex-1"
            >
              <Calendar className="w-4 h-4 mr-1" />
              Schedule
            </Button>
            <Button
              variant={activeTab === 'callback' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('callback')}
              className="flex-1"
            >
              <Phone className="w-4 h-4 mr-1" />
              Callback
            </Button>
          </div>

          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <div className="space-y-4">
              <div className="text-center py-6">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Start Live Chat</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {isPremiumClient 
                    ? 'Connect with a senior lending specialist instantly'
                    : 'Connect with our lending team for immediate assistance'
                  }
                </p>
                <Button onClick={handleStartChat} className="w-full">
                  Start Chat Now
                </Button>
              </div>
            </div>
          )}

          {/* Schedule Tab */}
          {activeTab === 'schedule' && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Schedule a Meeting</h3>
                <p className="text-sm text-muted-foreground">
                  Book a video call with our lending experts
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={handleScheduleGoogle} className="flex flex-col items-center py-6">
                  <Mail className="w-6 h-6 mb-2" />
                  <span className="text-sm">Google Meet</span>
                </Button>
                <Button variant="outline" onClick={handleScheduleZoom} className="flex flex-col items-center py-6">
                  <Video className="w-6 h-6 mb-2" />
                  <span className="text-sm">Zoom</span>
                </Button>
              </div>
            </div>
          )}

          {/* Callback Tab */}
          {activeTab === 'callback' && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <Phone className="w-12 h-12 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Request Callback</h3>
                <p className="text-sm text-muted-foreground">
                  {isPremiumClient 
                    ? 'Priority callback within 30 minutes'
                    : 'We\'ll call you back within 4 hours'
                  }
                </p>
              </div>

              <div className="space-y-3">
                <Input
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
                <Input
                  type="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
                <Input
                  type="tel"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
                <Input
                  type="datetime-local"
                  placeholder="Preferred callback time"
                  value={formData.preferredTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, preferredTime: e.target.value }))}
                />
                <Textarea
                  placeholder="What can we help you with?"
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  rows={3}
                />
                
                {isPremiumClient && (
                  <div className="flex gap-2">
                    <Button
                      variant={formData.urgency === 'urgent' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFormData(prev => ({ ...prev, urgency: 'urgent' }))}
                    >
                      Urgent
                    </Button>
                    <Button
                      variant={formData.urgency === 'normal' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFormData(prev => ({ ...prev, urgency: 'normal' }))}
                    >
                      Normal
                    </Button>
                    <Button
                      variant={formData.urgency === 'routine' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFormData(prev => ({ ...prev, urgency: 'routine' }))}
                    >
                      Routine
                    </Button>
                  </div>
                )}

                <Button 
                  onClick={handleCallbackRequest} 
                  className="w-full"
                  disabled={!formData.name || !formData.email || !formData.phone}
                >
                  Request Callback
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}