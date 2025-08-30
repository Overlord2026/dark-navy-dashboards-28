import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { GoldButton, GoldOutlineButton } from '@/components/ui/brandButtons';
import { X, Calendar, Users, ExternalLink } from 'lucide-react';
import { PERSONA_CONFIG } from '@/config/personaConfig';
import { PUBLIC_CONFIG } from '@/config/publicConfig';
import { BRAND } from '@/theme/brand';

interface CTAStickyBarProps {
  className?: string;
}

export default function CTAStickyBar({ className }: CTAStickyBarProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible || !PUBLIC_CONFIG.CTA_BAR_ENABLED) return null;

  const handleStartWorkspace = () => {
    // Redirect to families onboarding as default
    window.open('/start/families', '_blank');
    
    // Track event
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.capture('subscribe.cta', {
        source: 'sticky_bar',
        action: 'start_workspace'
      });
    }
  };

  const handleBookDemo = () => {
    // Open Calendly in modal or new window
    const calendlyUrl = 'https://calendly.com/mybfocfo/demo'; // Replace with actual Calendly URL
    window.open(calendlyUrl, '_blank', 'width=800,height=600');
    
    // Track event
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.capture('demo.booked', {
        source: 'sticky_bar'
      });
    }
  };

  const handleLogin = () => {
    window.open('/login', '_blank');
  };

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-50 ${className}`} 
      role="complementary"
      style={{ borderTopColor: BRAND.gold, borderBottomColor: BRAND.gold }}
    >
      <div className="bg-black text-[#D4AF37] gold-border gold-shadow">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            
            {/* Message */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Users className="w-5 h-5 shrink-0" />
              <div className="min-w-0">
                <p className="font-semibold text-sm md:text-base truncate tracking-wide">
                  Ready to organize your financial life?
                </p>
                <p className="text-xs opacity-90 hidden sm:block">
                  Join thousands building wealth with our platform
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <GoldButton
                onClick={handleStartWorkspace}
                className="hidden sm:flex items-center gap-2 px-4 py-2"
              >
                <Users className="w-4 h-4" />
                Start Workspace
              </GoldButton>

              <GoldOutlineButton
                onClick={handleBookDemo}
                className="hidden md:flex items-center gap-2 px-4 py-2"
              >
                <Calendar className="w-4 h-4" />
                Book Demo
              </GoldOutlineButton>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogin}
                className="text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors"
              >
                <ExternalLink className="w-4 h-4 md:mr-1" />
                <span className="hidden md:inline">Log In</span>
              </Button>

              {/* Mobile CTA */}
              <GoldButton
                onClick={handleStartWorkspace}
                className="sm:hidden px-3 py-1"
              >
                Start
              </GoldButton>

              {/* Close Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
                className="text-[#D4AF37] hover:bg-[#D4AF37]/10 p-1 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}