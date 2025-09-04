import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { playWelcome } from '@/utils/voiceAI';
import { Loader2 } from 'lucide-react';

interface FullScreenWelcomeProps {
  onAuthSuccess?: (user: any) => void;
}

export function FullScreenWelcome({ onAuthSuccess }: FullScreenWelcomeProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [showVoiceWelcome, setShowVoiceWelcome] = useState(true);

  useEffect(() => {
    // Play voice welcome on mount
    if (showVoiceWelcome) {
      const timer = setTimeout(() => {
        playWelcome('there', 'Families');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [showVoiceWelcome]);

  const handleEmailAuth = () => {
    navigate('/auth');
  };

  const handleSocialAuth = async (provider: 'google' | 'apple' | 'azure') => {
    setIsLoading(provider);
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider === 'apple' ? 'apple' : provider === 'azure' ? 'azure' : 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;
      
    } catch (error) {
      console.error(`${provider} auth error:`, error);
      toast({
        title: "Authentication Error",
        description: `Unable to sign in with ${provider}. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div 
      className="fixed inset-0 flex flex-col min-h-screen"
      style={{ backgroundColor: '#001F3F' }}
    >
      {/* Main Content - Centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center text-center max-w-lg mx-auto"
        >
          {/* Gold Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <div className="gold-logo-filter">
              <Logo 
                variant="hero" 
                className="h-24 w-auto md:h-32"
                useTenantLogo={false}
              />
            </div>
          </motion.div>

          {/* Linda's Welcome Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8 space-y-4"
          >
            <h1 className="font-playfair font-bold text-white text-3xl md:text-4xl leading-tight">
              Hi, I'm Linda from Your Boutique Family Office
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              Let's begin your journey—sign up in just 60 seconds.
            </p>
          </motion.div>

          {/* Authentication Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="w-full max-w-sm space-y-4"
          >
            {/* Continue with Apple */}
            <Button
              onClick={() => handleSocialAuth('apple')}
              disabled={!!isLoading}
              className="w-full h-12 bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:shadow-lg hover:shadow-white/20 transition-all duration-300 backdrop-blur-sm"
              style={{ 
                boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
              }}
            >
              {isLoading === 'apple' ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
              )}
              Continue with Apple
            </Button>

            {/* Continue with Microsoft */}
            <Button
              onClick={() => handleSocialAuth('azure')}
              disabled={!!isLoading}
              className="w-full h-12 bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:shadow-lg hover:shadow-white/20 transition-all duration-300 backdrop-blur-sm"
              style={{ 
                boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
              }}
            >
              {isLoading === 'azure' ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.4 24H0L8.2 0h11.4L11.4 24zm1.2-9.2L24 14.4V24l-11.4-9.2z"/>
                </svg>
              )}
              Continue with Microsoft
            </Button>

            {/* Continue with Google */}
            <Button
              onClick={() => handleSocialAuth('google')}
              disabled={!!isLoading}
              className="w-full h-12 bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:shadow-lg hover:shadow-white/20 transition-all duration-300 backdrop-blur-sm"
              style={{ 
                boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
              }}
            >
              {isLoading === 'google' ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )}
              Continue with Google
            </Button>

            {/* Continue with Email */}
            <Button
              onClick={handleEmailAuth}
              disabled={!!isLoading}
              className="w-full h-12 bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:shadow-lg hover:shadow-white/20 transition-all duration-300 backdrop-blur-sm"
              style={{ 
                boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
              }}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Continue with Email
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        className="pb-6 text-center"
      >
        <p className="text-sm opacity-60 text-white">
          Copyright © 2025 Boutique Family Office™
        </p>
      </motion.footer>
    </div>
  );
}