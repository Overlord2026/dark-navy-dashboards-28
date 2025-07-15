import React, { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Chrome } from "lucide-react";
import OTPVerification from "@/components/auth/OTPVerification";
import { supabase } from "@/lib/supabase";

// Google Logo Component
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);
  const [passwordResetSent, setPasswordResetSent] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [loginUserId, setLoginUserId] = useState<string | null>(null);
  const [tempCredentials, setTempCredentials] = useState<{email: string, password: string} | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, login, signup, signInWithGoogle, resendConfirmation, resetPassword, complete2FALogin } = useAuth();

  useEffect(() => {
    // Check for email confirmation success
    const tokenHash = searchParams.get('token_hash');
    const type = searchParams.get('type');
    
    if (tokenHash && type === 'signup') {
      toast.success('Email confirmed successfully! You are now logged in.');
    }

    // Redirect if already authenticated, but NOT during 2FA verification
    // Also check that we're not in the middle of a 2FA flow (tempCredentials would be set)
    if (isAuthenticated && !showOTPVerification && !tempCredentials) {
      navigate('/client-dashboard');
    }
  }, [isAuthenticated, navigate, searchParams, showOTPVerification, tempCredentials]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const result = await signup(email, password, {
          first_name: firstName,
          last_name: lastName,
          display_name: `${firstName} ${lastName}`,
        });

        if (result.success) {
          if (result.error?.includes('confirmation link')) {
            // Email confirmation required
            setAwaitingConfirmation(true);
            toast.success('Account created! Please check your email and click the confirmation link to complete your registration.');
          } else {
            // Direct login (email confirmation disabled)
            toast.success('Account created successfully! You are now logged in.');
            navigate('/client-dashboard');
          }
        } else {
          if (result.error?.includes('User already registered')) {
            toast.error('An account with this email already exists. Please sign in instead.');
            setIsSignUp(false);
          } else {
            toast.error(result.error || 'Failed to create account');
          }
        }
      } else {
        const result = await login(email, password);
        console.log('Login result:', result);

        if (result.success) {
          // No 2FA, proceed with normal login
          console.log('Normal login successful');
          toast.success('Logged in successfully!');
          navigate('/client-dashboard');
        } else if (result.requires2FA) {
          // User has 2FA enabled, show OTP verification
          console.log('2FA required, showing OTP verification');
          console.log('User ID from login:', result.userId);
          
          setLoginUserId(result.userId!);
          setTempCredentials({ email, password });
          setShowOTPVerification(true);
          
          // Send OTP to user's email
          try {
            console.log('Sending OTP email to:', email);
            const otpResponse = await supabase.functions.invoke('send-otp-email', {
              body: { 
                email,
                userId: result.userId,
                userName: 'User'
              }
            });

            console.log('OTP email response:', otpResponse);

            if (otpResponse.error) {
              console.error('Failed to send OTP:', otpResponse.error);
              toast.error('Failed to send verification code. Please try again.');
              return;
            }

            toast.success('Verification code sent to your email');
          } catch (error) {
            console.error('OTP sending error:', error);
            toast.error('Failed to send verification code. Please try again.');
            return;
          }
        } else {
          // Handle login errors
          console.log('Login failed:', result.error);
          if (result.error?.includes('Invalid login credentials')) {
            toast.error('Invalid email or password. Please check your credentials.');
          } else if (result.error?.includes('Email not confirmed')) {
            toast.error('Please confirm your email address before signing in.');
            setAwaitingConfirmation(true);
          } else {
            toast.error(result.error || 'Failed to sign in');
          }
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result.success) {
        toast.success('Redirecting to Google sign-in...');
        // The redirect will happen automatically
      } else {
        toast.error(result.error || 'Failed to sign in with Google');
      }
    } catch (error) {
      toast.error('An unexpected error occurred with Google sign-in');
      console.error('Google sign-in error:', error);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const result = await resetPassword(email);
      if (result.success) {
        setPasswordResetSent(true);
        toast.success('Password reset email sent! Please check your inbox.');
      } else {
        toast.error(result.error || 'Failed to send password reset email');
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const result = await resendConfirmation(email);
      if (result.success) {
        toast.success('Confirmation email sent! Please check your inbox.');
      } else {
        toast.error(result.error || 'Failed to resend confirmation email');
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerificationSuccess = async () => {
    if (!tempCredentials) {
      toast.error('Authentication error. Please try again.');
      setShowOTPVerification(false);
      return;
    }

    try {
      const result = await complete2FALogin(tempCredentials.email, tempCredentials.password);
      
      if (result.success) {
        toast.success('Two-factor authentication successful!');
        setShowOTPVerification(false);
        setTempCredentials(null);
        navigate('/client-dashboard');
      } else {
        toast.error(result.error || 'Authentication failed. Please try again.');
        setShowOTPVerification(false);
        setTempCredentials(null);
      }
    } catch (error) {
      console.error('2FA completion error:', error);
      toast.error('Authentication failed. Please try again.');
      setShowOTPVerification(false);
      setTempCredentials(null);
    }
  };

  const handleBackToLogin = () => {
    setShowOTPVerification(false);
    setLoginUserId(null);
    setTempCredentials(null);
  };

  const resetForm = () => {
    setIsSignUp(false);
    setIsForgotPassword(false);
    setAwaitingConfirmation(false);
    setPasswordResetSent(false);
    setShowOTPVerification(false);
    setLoginUserId(null);
    setTempCredentials(null);
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
  };

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
        {showOTPVerification ? (
          <OTPVerification
            email={email}
            userId={loginUserId}
            onVerificationSuccess={handleOTPVerificationSuccess}
            onBack={handleBackToLogin}
          />
        ) : (
        <Card className="p-8 w-full max-w-md bg-[#1B1B32] border border-gray-200 shadow-lg">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white">
              {awaitingConfirmation 
                ? "Check Your Email" 
                : passwordResetSent 
                ? "Reset Email Sent" 
                : isForgotPassword 
                ? "Reset Password" 
                : (isSignUp ? "Create Account" : "Sign In")}
            </h1>
            <p className="text-gray-300 mt-2">
              {awaitingConfirmation 
                ? "We've sent you a confirmation link. Please check your email and click the link to verify your account."
                : passwordResetSent
                ? "We've sent you a password reset link. Please check your email and follow the instructions to reset your password."
                : isForgotPassword 
                ? "Enter your email address and we'll send you a link to reset your password"
                : (isSignUp 
                  ? "Join our family office platform" 
                  : "Access your personalized financial dashboard")}
            </p>
          </div>
          
          {awaitingConfirmation ? (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-4">
                  Didn't receive the email? Check your spam folder or click below to resend.
                </p>
                <Button 
                  onClick={handleResendConfirmation}
                  className="w-full bg-white text-[#1B1B32] hover:bg-gray-100 font-medium mb-4"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Resend Confirmation Email"}
                </Button>
                <Button 
                  variant="ghost"
                  onClick={resetForm}
                  className="text-white hover:bg-white/10"
                >
                  Back to Sign In
                </Button>
              </div>
            </div>
          ) : passwordResetSent ? (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-4">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
                <Button 
                  onClick={() => handleForgotPassword({ preventDefault: () => {} } as React.FormEvent)}
                  className="w-full bg-white text-[#1B1B32] hover:bg-gray-100 font-medium mb-4"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Resend Reset Email"}
                </Button>
                <Button 
                  variant="ghost"
                  onClick={resetForm}
                  className="text-white hover:bg-white/10"
                >
                  Back to Sign In
                </Button>
              </div>
            </div>
          ) : isForgotPassword ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white border-gray-300 text-black placeholder:text-gray-500 focus:border-white focus:ring-white"
                  autoComplete="email" 
                  required 
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-white text-[#1B1B32] hover:bg-gray-100 font-medium"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Email"}
              </Button>
              
              <div className="text-center">
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-white hover:underline font-medium text-sm"
                  disabled={loading}
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {/* Google Sign-In Button */}
              <Button 
                onClick={handleGoogleSignIn}
                className="w-full bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 font-medium flex items-center justify-center gap-3 shadow-sm py-2.5 transition-colors"
                disabled={googleLoading || loading}
              >
                <GoogleIcon />
                {googleLoading ? "Connecting..." : "Continue with Google"}
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full border-gray-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#1B1B32] px-2 text-gray-400">Or continue with email</span>
                </div>
              </div>

              {/* Email/Password Form */}
              <form onSubmit={handleAuth} className="space-y-4">
                {isSignUp && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-white">First Name</Label>
                      <Input 
                        id="firstName" 
                        type="text" 
                        placeholder="Enter your first name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="bg-white border-gray-300 text-black placeholder:text-gray-500 focus:border-white focus:ring-white"
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-white">Last Name</Label>
                      <Input 
                        id="lastName" 
                        type="text" 
                        placeholder="Enter your last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="bg-white border-gray-300 text-black placeholder:text-gray-500 focus:border-white focus:ring-white"
                        required 
                      />
                    </div>
                  </>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white border-gray-300 text-black placeholder:text-gray-500 focus:border-white focus:ring-white"
                    autoComplete="email" 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white border-gray-300 text-black placeholder:text-gray-500 focus:border-white focus:ring-white"
                    autoComplete={isSignUp ? "new-password" : "current-password"}
                    required 
                  />
                </div>
                
                {!isSignUp && (
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className="text-white hover:underline text-sm"
                      disabled={loading}
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors"
                  disabled={loading || googleLoading}
                >
                  {loading ? "Loading..." : (isSignUp ? "Create Account" : "Sign In")}
                </Button>
              </form>
            </div>
          )}
          
          {!awaitingConfirmation && !passwordResetSent && !isForgotPassword && (
            <div className="mt-6 text-center text-sm text-gray-300">
              <p>
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-white hover:underline font-medium"
                  disabled={loading || googleLoading}
                >
                  {isSignUp ? "Sign in" : "Create account"}
                </button>
              </p>
            </div>
          )}
        </Card>
        )}
      </div>
      
      <footer className="py-2 px-4 bg-[#1B1B32] text-white text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Boutique Family Office. All rights reserved.</p>
      </footer>
    </div>
  );
}
