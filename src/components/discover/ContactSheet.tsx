import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Users, Phone, X } from 'lucide-react';

interface ContactSheetProps {
  isOpen: boolean;
  onClose: () => void;
  source?: string;
}

export const ContactSheet: React.FC<ContactSheetProps> = ({ isOpen, onClose, source = 'unknown' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    honeypot: '' // Hidden honeypot field
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check honeypot
    if (formData.honeypot) {
      console.log('Bot detected, ignoring submission');
      return;
    }

    setIsSubmitting(true);

    try {
      // Analytics
      if (typeof window !== 'undefined' && (window as any).analytics) {
        (window as any).analytics.track('contact.submit', {
          name: formData.name,
          email: formData.email,
          source
        });
      }

      // Store lead (stub API call)
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          source,
          timestamp: new Date().toISOString()
        }),
      });

      if (response.ok) {
        // Show calendar
        setShowCalendar(true);
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      console.error('Contact submission failed:', error);
      // Still show calendar on error for better UX
      setShowCalendar(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        {!showCalendar ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Let's get started
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Honeypot field - hidden from users */}
              <div style={{ display: 'none' }}>
                <Input
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.honeypot}
                  onChange={(e) => handleInputChange('honeypot', e.target.value)}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  'Submitting...'
                ) : (
                  <>
                    <Calendar className="mr-2 h-4 w-4" />
                    Book a demo
                  </>
                )}
              </Button>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Schedule your demo
                </DialogTitle>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>
            
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Thanks {formData.name}! Choose a time that works for you:
              </p>
              
              {/* Calendly Embed */}
              <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center space-y-2">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto" />
                  <p className="text-sm text-muted-foreground">
                    Calendly integration would appear here
                  </p>
                  <Button 
                    onClick={() => {
                      // Analytics
                      if (typeof window !== 'undefined' && (window as any).analytics) {
                        (window as any).analytics.track('demo.booked', {
                          name: formData.name,
                          email: formData.email,
                          source
                        });
                      }
                      onClose();
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Simulate booking
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};