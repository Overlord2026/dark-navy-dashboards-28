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
    window.open('https://calendly.com/tonygomes/talk-with-tony', '_blank');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold mb-2 text-foreground">
            Your Customized Retirement Roadmap—Driven by Your Family CFO
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-muted-foreground mb-3">
            You wouldn't run a business without a CFO or a forecast—so why trust your family's future to guesswork? Your SWAG™ Roadmap brings you:
          </p>
          
          <ul className="space-y-2">
            {[
              'Holistic, tax-smart income & legacy planning',
              'Protection against the "widow\'s penalty"',
              'Long-term care readiness—stress-tested',
              'Optimal Social Security and Roth conversion timing',
              'Clear action steps, updated as your life evolves'
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
              Book a Family Office Review
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