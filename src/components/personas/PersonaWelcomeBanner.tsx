import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PersonaType, PERSONA_WELCOME_MESSAGES } from '@/types/personas';

interface PersonaWelcomeBannerProps {
  persona: PersonaType;
  userName?: string;
  onDismiss?: () => void;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  variant?: 'full' | 'compact' | 'sidebar';
}

const PersonaWelcomeBanner: React.FC<PersonaWelcomeBannerProps> = ({
  persona,
  userName = "Professional",
  onDismiss,
  onPrimaryAction,
  onSecondaryAction,
  variant = 'full'
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const welcomeData = PERSONA_WELCOME_MESSAGES[persona];

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  if (variant === 'sidebar') {
    return (
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -20, opacity: 0 }}
        className="p-4"
      >
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-gold/5">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="font-semibold text-sm">Welcome!</span>
              </div>
              {onDismiss && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleDismiss}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              {welcomeData.learnMoreText}
            </p>
            <Button 
              onClick={onPrimaryAction}
              size="sm" 
              className="w-full text-xs"
            >
              {welcomeData.ctaPrimary}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        className="mb-6"
      >
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 via-transparent to-gold/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-gold flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">{welcomeData.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {welcomeData.learnMoreText}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  onClick={onPrimaryAction}
                  size="sm"
                  className="gap-1"
                >
                  {welcomeData.ctaPrimary}
                  <ArrowRight className="w-3 w-3" />
                </Button>
                {onDismiss && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleDismiss}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
      className="mb-8"
    >
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-gold/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none" />
        <CardContent className="p-6 relative">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-gold flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{welcomeData.title}</h2>
                <Badge variant="secondary" className="mt-1">
                  New Member
                </Badge>
              </div>
            </div>
            {onDismiss && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleDismiss}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <p className="text-muted-foreground mb-6 leading-relaxed">
            {welcomeData.subtitle}
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                Your benefits include:
              </h3>
              <div className="space-y-2">
                {welcomeData.benefits.slice(0, 2).map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-gold" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-center space-y-3">
              <Button 
                onClick={onPrimaryAction}
                className="w-full bg-gradient-to-r from-primary to-gold hover:from-primary/90 hover:to-gold/90"
              >
                {welcomeData.ctaPrimary}
              </Button>
              {welcomeData.ctaSecondary && (
                <Button 
                  onClick={onSecondaryAction}
                  variant="outline"
                  className="w-full"
                >
                  {welcomeData.ctaSecondary}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PersonaWelcomeBanner;