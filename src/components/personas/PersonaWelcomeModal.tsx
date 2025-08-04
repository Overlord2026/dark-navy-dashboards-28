import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, CheckCircle, ArrowRight, X } from 'lucide-react';
import { PersonaType, PERSONA_WELCOME_MESSAGES } from '@/types/personas';

interface PersonaWelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  persona: PersonaType;
  userName?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
}

const PersonaWelcomeModal: React.FC<PersonaWelcomeModalProps> = ({
  isOpen,
  onClose,
  persona,
  userName = "Professional",
  onPrimaryAction,
  onSecondaryAction
}) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const welcomeData = PERSONA_WELCOME_MESSAGES[persona];

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handlePrimaryAction = () => {
    onPrimaryAction?.();
    onClose();
  };

  const handleSecondaryAction = () => {
    onSecondaryAction?.();
    onClose();
  };

  return (
    <>
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            {/* Confetti particles */}
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  background: i % 3 === 0 ? 'hsl(var(--gold))' : i % 3 === 1 ? 'hsl(var(--primary))' : 'hsl(var(--emerald))'
                }}
                initial={{
                  y: -10,
                  x: 0,
                  rotate: 0,
                  opacity: 1
                }}
                animate={{
                  y: window.innerHeight + 10,
                  x: Math.random() * 200 - 100,
                  rotate: 360,
                  opacity: 0
                }}
                transition={{
                  duration: 3,
                  delay: Math.random() * 2,
                  ease: "easeOut"
                }}
              />
            ))}
          </motion.div>
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute right-0 top-0 h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>

          <div className="space-y-6 pt-4">
            {/* Header with sparkles */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center space-y-4"
            >
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary via-gold to-emerald rounded-full flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              
              <div>
                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl font-bold bg-gradient-to-r from-primary via-gold to-emerald bg-clip-text text-transparent"
                >
                  {welcomeData.title}
                </motion.h1>
                
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg text-muted-foreground mt-2 leading-relaxed"
                >
                  {welcomeData.subtitle}
                </motion.p>
              </div>
            </motion.div>

            {/* Benefits */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-muted/50 to-muted/30 rounded-lg p-6"
            >
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                You now have access to:
              </h3>
              <div className="grid gap-3">
                {welcomeData.benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-gold" />
                    <span className="text-sm">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Learn more banner */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-primary/10 to-gold/10 border border-primary/20 rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <Badge variant="secondary" className="mb-2">
                    Premium Benefits
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {welcomeData.learnMoreText}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-primary" />
              </div>
            </motion.div>

            {/* Action buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex gap-3 pt-4"
            >
              <Button 
                onClick={handlePrimaryAction}
                className="flex-1 bg-gradient-to-r from-primary to-gold hover:from-primary/90 hover:to-gold/90"
                size="lg"
              >
                {welcomeData.ctaPrimary}
              </Button>
              {welcomeData.ctaSecondary && (
                <Button 
                  onClick={handleSecondaryAction}
                  variant="outline"
                  className="flex-1"
                  size="lg"
                >
                  {welcomeData.ctaSecondary}
                </Button>
              )}
            </motion.div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PersonaWelcomeModal;