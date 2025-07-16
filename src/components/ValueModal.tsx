import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar, ArrowRight } from 'lucide-react';

interface ValueModalProps {
  open: boolean;
  onClose: () => void;
}

export function ValueModal({ open, onClose }: ValueModalProps) {
  const handleSchedule = () => {
    window.open('https://calendly.com/bfo-consultation', '_blank');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-4 text-foreground">
            Ready to See Your Full Value?
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Discover how much you could save—and how much more you could receive—with a Boutique Family Office relationship tailored to your needs.
          </p>
          
          <ul className="space-y-2">
            {[
              'Custom retirement income planning',
              'Ongoing tax reduction strategies',
              'Exclusive family legacy tools',
              'Private Market Alpha investments',
              'Dedicated concierge support'
            ].map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
          
          <div className="flex flex-col gap-3 pt-4">
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleSchedule}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Book My Complimentary Review
            </Button>
            <Button variant="outline" onClick={onClose} className="w-full">
              Continue Browsing
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}