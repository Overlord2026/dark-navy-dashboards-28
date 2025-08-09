import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Calculator, Link as LinkIcon, Eye, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { analytics } from '@/lib/analytics';

interface HeroCTAProps {
  onHowItWorksClick: () => void;
}

export const HeroCTA: React.FC<HeroCTAProps> = ({ onHowItWorksClick }) => {
  const navigate = useNavigate();
  const [showMagicLinkInput, setShowMagicLinkInput] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');

  const handleMagicLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!inviteCode.trim()) {
      setError('Please enter an invite code');
      return;
    }

    analytics.track('magic_link_submitted', { 
      has_code: !!inviteCode.trim() 
    });

    window.location.href = `/invite?code=${encodeURIComponent(inviteCode.trim())}`;
  };

  const handleHowItWorks = () => {
    analytics.track('landing_hero_cta_clicked', { cta: 'how_it_works' });
    onHowItWorksClick();
  };

  const handleValueCalculator = () => {
    analytics.track('landing_hero_cta_clicked', { cta: 'value_calculator' });
    navigate('/value-calculator');
  };

  const handleAccessInvite = () => {
    analytics.track('landing_hero_cta_clicked', { cta: 'access_invite' });
    setShowMagicLinkInput(!showMagicLinkInput);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
        <Button 
          size="lg" 
          onClick={handleHowItWorks}
          className="bg-gradient-to-r from-emerald to-emerald/90 hover:from-emerald/90 hover:to-emerald text-white shadow-lg px-8 py-4 text-lg touch-target"
        >
          <Eye className="w-5 h-5 mr-2" />
          See How It Works
        </Button>
        
        <Button 
          size="lg" 
          variant="outline"
          onClick={handleValueCalculator}
          className="border-2 border-gold text-gold hover:bg-gold/10 hover:border-gold/80 px-8 py-4 text-lg touch-target"
        >
          <Calculator className="w-5 h-5 mr-2" />
          Try the Value Calculator
        </Button>
      </div>

      <div className="flex flex-col items-center lg:items-start">
        <Button 
          variant="ghost"
          onClick={handleAccessInvite}
          className="text-gold hover:text-gold/80 hover:bg-gold/10 transition-all duration-200 touch-target"
        >
          <LinkIcon className="w-4 h-4 mr-2" />
          Access Your Invitation
          <ArrowRight className={`w-4 h-4 ml-2 transition-transform duration-200 ${showMagicLinkInput ? 'rotate-90' : ''}`} />
        </Button>

        {showMagicLinkInput && (
          <Card className="mt-4 w-full max-w-md bg-card/80 backdrop-blur-sm border border-gold/30 animate-fade-in">
            <CardContent className="p-4">
              <form onSubmit={handleMagicLinkSubmit} className="space-y-3">
                <div>
                  <Input
                    placeholder="Paste your invite link code"
                    value={inviteCode}
                    onChange={(e) => {
                      setInviteCode(e.target.value);
                      setError('');
                    }}
                    className="bg-background/50 border-gold/20 focus:border-gold"
                    autoFocus
                  />
                  {error && (
                    <div className="flex items-center gap-2 mt-2 text-destructive text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </div>
                  )}
                </div>
                <Button 
                  type="submit"
                  className="w-full bg-gold hover:bg-gold/90 text-navy font-bold touch-target"
                  disabled={!inviteCode.trim()}
                >
                  Access
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};