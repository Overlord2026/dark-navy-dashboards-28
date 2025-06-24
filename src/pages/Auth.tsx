
import React, { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { OTPVerification } from "@/components/auth/OTPVerification";
import { toast } from "sonner";
import { Chrome } from "lucide-react";

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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { 
    isAuthenticated, 
    login, 
    signup, 
    signInWithGoogle, 
    resendConfirmation, 
    resetPassword,
    requiresOTP,
    pendingUserId,
    pendingEmail,
    verifyOTP
  } = useAuth();

  useEffect(() => {
    // Check for email confirmation success
    const tokenHash = searchParams.get('token_hash');
    const type = searchParams.get('type');
    
    if (tokenHash && type === 'signup') {
      toast.success('Email confirmed successfully! You are now logged in.');
    }

    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate('/client-dashboard');
    }
  }, [isAuthenticated, navigate, searchParams]);

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

        if (result.success) {
          if (result.requiresOTP) {
            toast.success('OTP code sent to your email. Please verify to continue.');
          } else {
            toast.success('Logged in successfully!');
            navigate('/client-dashboard');
          }
        } else {
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

  const handleBackToLogin = () => {
    setIsSignUp(false);
    setIsForgotPassword(false);
    setAwaitingConfirmation(false);
    setPasswordResetSent(false);
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
  };

  const resetForm = () => {
    handleBackToLogin();
  };

  // Show OTP verification if required
  if (requiresOTP && pendingUserId && pendingEmail) {
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
          <OTPVerification
            email={pendingEmail}
            userId={pendingUserId}
            onBack={handleBackToLogin}
          />
        </div>
        
        <footer className="py-2 px-4 bg-[#1B1B32] text-white text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Boutique Family Office. All rights reserved.</p>
        </footer>
      </div>
    );
  }

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
                variant="outline"
                className="w-full bg-white text-black hover:bg-gray-50 border border-gray-300 font-medium flex items-center justify-center gap-2"
                disabled={googleLoading || loading}
              >
                <Chrome className="h-4 w-4" />
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
                  className="w-full bg-white text-[#1B1B32] hover:bg-gray-100 font-medium"
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
      </div>
      
      <footer className="py-2 px-4 bg-[#1B1B32] text-white text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Boutique Family Office. All rights reserved.</p>
      </footer>
    </div>
  );
}
