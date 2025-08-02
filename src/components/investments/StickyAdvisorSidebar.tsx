import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Calendar, MessageCircle, ExternalLink } from 'lucide-react';

export const StickyAdvisorSidebar = () => {
  const handleScheduleCall = () => {
    // Open Calendly or scheduling system
    window.open('https://calendly.com/mybfocfo/fiduciary-consultation', '_blank');
  };

  const handlePhoneCall = () => {
    window.location.href = 'tel:+1-855-BFO-HELP';
  };

  const handleLiveChat = () => {
    // Open chat widget or intercom
    console.log('Opening live chat...');
  };

  return (
    <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 hidden lg:block">
      <Card className="w-80 bg-gradient-to-br from-primary/95 to-gold-premium/95 text-white border-gold-premium shadow-2xl">
        <CardContent className="p-6 space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-bold mb-2">Speak to a Fiduciary Advisor</h3>
            <p className="text-sm opacity-90">
              Get unbiased guidance on private market allocation and strategy
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleScheduleCall}
              className="w-full bg-white text-primary hover:bg-gray-100 font-semibold"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule 20-Min Call
            </Button>

            <Button 
              onClick={handlePhoneCall}
              variant="outline" 
              className="w-full border-white text-white hover:bg-white/10"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call Now: 855-BFO-HELP
            </Button>

            <Button 
              onClick={handleLiveChat}
              variant="outline" 
              className="w-full border-white text-white hover:bg-white/10"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Live Chat Available
            </Button>
          </div>

          <div className="pt-3 border-t border-white/20">
            <div className="text-xs space-y-1 opacity-90">
              <div className="flex items-center justify-between">
                <span>Response Time:</span>
                <span className="font-semibold">Under 2 hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Consultation:</span>
                <span className="font-semibold">Always Free</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Fiduciary Standard:</span>
                <span className="font-semibold text-success">✓ Yes</span>
              </div>
            </div>
          </div>

          <div className="text-center pt-2">
            <button className="text-xs text-white/80 hover:text-white underline">
              Learn about our fiduciary commitment
              <ExternalLink className="w-3 h-3 ml-1 inline" />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};