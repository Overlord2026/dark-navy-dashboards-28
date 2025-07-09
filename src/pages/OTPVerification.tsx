import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { OTPInput } from '@/components/auth/OTPInput';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Shield, ArrowLeft, RefreshCw } from 'lucide-react';

export default function OTPVerification() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, session } = useAuth();

  const redirectTo = searchParams.get('redirect') || '/client-dashboard';

  useEffect(() => {
    // Redirect if not authenticated
    if (!user || !session) {
      navigate('/auth');
      return;
    }

    // Start 30 second countdown for resend
    setCountdown(30);
  }, [user, session, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('verify-otp', {
        body: { otpCode: otp },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (error) throw error;

      if (data.valid) {
        toast.success('Two-factor authentication verified successfully!');
        navigate(redirectTo);
      } else {
        toast.error('Invalid or expired verification code');
        setOtp('');
      }
    } catch (error: any) {
      console.error('OTP verification error:', error);
      toast.error(error.message || 'Failed to verify code');
      setOtp('');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;

    setResending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { userEmail: user?.email },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (error) throw error;

      toast.success('Verification code sent to your email');
      setCountdown(30);
      setOtp('');
    } catch (error: any) {
      console.error('Resend OTP error:', error);
      toast.error(error.message || 'Failed to resend code');
    } finally {
      setResending(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/auth');
  };

  // Auto-submit when OTP is complete
  useEffect(() => {
    if (otp.length === 6 && !loading) {
      handleVerifyOTP();
    }
  }, [otp, loading]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="w-full flex justify-center items-center py-2 border-b border-gray-200 bg-[#1B1B32] sticky top-0 z-50">
        <div className="flex justify-center items-center">
          <img 
            src="/lovable-uploads/3346c76f-f91c-4791-b77d-adb2f34a06af.png" 
            alt="Boutique Family Office Logo" 
            className="h-8 w-auto"
          />
        </div>
      </header>
      
      <div className="flex-1 flex justify-center items-center p-4 bg-white">
        <Card className="p-8 w-full max-w-md bg-[#1B1B32] border border-gray-200 shadow-lg">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-white">
              Two-Factor Authentication
            </h1>
            <p className="text-gray-300 mt-2">
              Enter the 6-digit verification code sent to your email address
            </p>
            <p className="text-gray-400 text-sm mt-1">
              {user?.email}
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <OTPInput
                value={otp}
                onChange={setOtp}
                disabled={loading}
                className="mb-2"
              />
              
              <div className="text-center text-sm text-gray-400">
                {loading && (
                  <p className="flex items-center justify-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Verifying code...
                  </p>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <Button
                onClick={handleVerifyOTP}
                disabled={otp.length !== 6 || loading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors"
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </Button>
              
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-2">
                  Didn't receive the code?
                </p>
                <Button
                  variant="ghost"
                  onClick={handleResendOTP}
                  disabled={countdown > 0 || resending}
                  className="text-white hover:bg-white/10 text-sm"
                >
                  {resending ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      Sending...
                    </>
                  ) : countdown > 0 ? (
                    `Resend in ${countdown}s`
                  ) : (
                    'Resend Code'
                  )}
                </Button>
              </div>
              
              <div className="text-center pt-4 border-t border-gray-600">
                <Button
                  variant="ghost"
                  onClick={handleBackToLogin}
                  className="text-gray-400 hover:text-white hover:bg-white/10 text-sm"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Sign In
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      <footer className="py-2 px-4 bg-[#1B1B32] text-white text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Boutique Family Office. All rights reserved.</p>
      </footer>
    </div>
  );
}