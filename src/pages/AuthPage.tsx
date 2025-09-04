
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { PasswordStrengthIndicator } from '@/components/auth/PasswordStrengthIndicator';
import { authSecurityService } from '@/services/security/authSecurity';
import { PasswordValidationResult } from '@/services/security/passwordPolicy';
import { supabase } from '@/lib/supabase';
import { getLogoConfig } from '@/assets/logos';
import { EnvironmentIndicator } from '@/components/debug/EnvironmentIndicator';
import { Shield } from 'lucide-react';
import { runtimeFlags } from '@/config/runtimeFlags';

export function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidationResult | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const { isAuthenticated } = useUser();
  const navigate = useNavigate();
  
  // Get BFO logos
  const heroLogoConfig = getLogoConfig('hero');
  const brandLogoConfig = getLogoConfig('brand');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (password && isSignUp) {
      validatePassword();
    }
  }, [password, isSignUp]);

  const validatePassword = async () => {
    if (!password) {
      setPasswordValidation(null);
      return;
    }

    try {
      const validation = await authSecurityService.validatePasswordStrength(password);
      setPasswordValidation(validation);
    } catch (error) {
      console.error('Password validation error:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Standard Supabase login for QA environment
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (signInError) {
        throw signInError;
      }

      if (data.user) {
        navigate('/', { replace: true });
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    }
    
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/family/home`
        }
      });
      
      if (error) {
        throw error;
      }
      
      // OAuth will redirect automatically, no need to handle navigation here
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      setError(err.message || 'An unexpected error occurred with Google sign-in.');
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/family/home`
        }
      });
      
      if (error) {
        throw error;
      }
      
      // OAuth will redirect automatically
    } catch (err: any) {
      console.error('Apple sign-in error:', err);
      setError(err.message || 'An unexpected error occurred with Apple sign-in.');
      setLoading(false);
    }
  };

  const handleMicrosoftSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          redirectTo: `${window.location.origin}/family/home`,
          scopes: 'email'
        }
      });
      
      if (error) {
        throw error;
      }
      
      // OAuth will redirect automatically
    } catch (err: any) {
      console.error('Microsoft sign-in error:', err);
      setError(err.message || 'An unexpected error occurred with Microsoft sign-in.');
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Password validation
    if (!passwordValidation?.isValid) {
      setError('Please fix the password issues before continuing.');
      setLoading(false);
      return;
    }

    // Confirm password match
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (signUpError) {
        throw signUpError;
      }

      if (data.user) {
        setError('Sign up successful! Please check your email to verify your account.');
      }
    } catch (err: any) {
      console.error('Sign up error:', err);
      setError(err.message || 'An unexpected error occurred during sign up.');
    }

    setLoading(false);
  };


  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-navy relative overflow-hidden">
        {/* Background Watermark - Faint gold tree */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img 
            src={brandLogoConfig.src}
            alt=""
            className="w-[600px] h-[600px] object-contain opacity-5"
            style={{ filter: 'sepia(1) saturate(3) hue-rotate(30deg)' }}
          />
        </div>

        {/* Auth Content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
          <Card className="w-full max-w-md bg-card border-white/10">
            <CardHeader className="text-center">
              {/* BFO Logo */}
              <div className="mb-4">
                <img 
                  src={heroLogoConfig.src}
                  alt="Boutique Family Office™"
                  className="h-16 w-auto mx-auto mb-4"
                />
              </div>
              
              <CardTitle className="font-serif text-white text-xl">
                Welcome to Boutique Family Office™
              </CardTitle>
              <CardDescription className="text-white/70">
                {isSignUp ? 'Create your secure account' : 'Sign in to access your wealth management platform'}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs value={isSignUp ? 'signup' : 'login'} onValueChange={(value) => {
                if (runtimeFlags.prelaunchMode && value === 'signup') {
                  navigate('/waitlist');
                  return;
                }
                setIsSignUp(value === 'signup');
                setError(null);
                setPasswordValidation(null);
              }}>
                <TabsList className={`grid w-full ${runtimeFlags.prelaunchMode ? 'grid-cols-1' : 'grid-cols-2'} bg-navy border-white/20`}>
                  <TabsTrigger 
                    value="login" 
                    className="text-ink data-[state=active]:bg-gold-base data-[state=active]:text-ink font-display"
                  >
                    Login
                  </TabsTrigger>
                  {!runtimeFlags.prelaunchMode && (
                    <TabsTrigger 
                      value="signup" 
                      className="text-white data-[state=active]:bg-emerald data-[state=active]:text-white font-display"
                    >
                      Sign Up
                    </TabsTrigger>
                  )}
                </TabsList>
              
              <TabsContent value="login">
                <div className="space-y-4">
                  {error && (
                    <Alert variant={error.includes('successful') ? 'default' : 'destructive'}>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  {/* OAuth Providers */}
                  <div className="grid grid-cols-1 gap-3">
                    {/* Google */}
                    <Button 
                      onClick={handleGoogleSignIn}
                      className="w-full touch-target font-display bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                      style={{ minHeight: '48px' }}
                      disabled={loading}
                    >
                      <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      {loading ? 'Connecting...' : 'Continue with Google'}
                    </Button>

                    {/* Apple */}
                    <Button 
                      onClick={handleAppleSignIn}
                      className="w-full touch-target font-display bg-black text-white border border-gray-800 hover:bg-gray-900"
                      style={{ minHeight: '48px' }}
                      disabled={loading}
                    >
                      <svg className="w-5 h-5 mr-3 fill-current" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                      {loading ? 'Connecting...' : 'Continue with Apple'}
                    </Button>

                    {/* Microsoft */}
                    <Button 
                      onClick={handleMicrosoftSignIn}
                      className="w-full touch-target font-display bg-blue-600 text-white border border-blue-700 hover:bg-blue-700"
                      style={{ minHeight: '48px' }}
                      disabled={loading}
                    >
                      <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                        <path fill="#f25022" d="M1 1h10v10H1z"/>
                        <path fill="#00a4ef" d="M13 1h10v10H13z"/>
                        <path fill="#7fba00" d="M1 13h10v10H1z"/>
                        <path fill="#ffb900" d="M13 13h10v10H13z"/>
                      </svg>
                      {loading ? 'Connecting...' : 'Continue with Microsoft'}
                    </Button>
                  </div>
                  
                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-white/20" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-white/60">OR CONTINUE WITH EMAIL</span>
                    </div>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="login-email" className="text-sm font-medium text-white">Email</label>
                      <Input
                        id="login-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="login-password" className="text-sm font-medium text-white">Password</label>
                      <Input
                        id="login-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>

                    <div className="text-right">
                      <a href="#" className="text-sm text-white/70 hover:text-white">
                        Forgot Password?
                      </a>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full touch-target font-display"
                      style={{ 
                        backgroundColor: '#FFD700',
                        color: '#14213D',
                        minHeight: '48px'
                      }}
                      disabled={loading}
                    >
                      {loading ? 'Signing in...' : 'Sign In'}
                    </Button>

                    <div className="text-center text-sm text-white/70">
                      Don't have an account?{' '}
                      <button 
                        type="button"
                        onClick={() => setIsSignUp(true)}
                        className="text-white hover:underline"
                      >
                        Create account
                      </button>
                    </div>
                  </form>
                </div>
              </TabsContent>
              
              {!runtimeFlags.prelaunchMode && (
                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4">
                  {error && (
                    <Alert variant={error.includes('successful') ? 'default' : 'destructive'}>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-2">
                    <label htmlFor="signup-email" className="text-sm font-medium">Email</label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="signup-password" className="text-sm font-medium">Password</label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a strong password"
                      required
                    />
                    <PasswordStrengthIndicator 
                      validation={passwordValidation}
                      password={password}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="confirm-password" className="text-sm font-medium">Confirm Password</label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      required
                    />
                    {confirmPassword && password !== confirmPassword && (
                      <p className="text-sm text-red-600">Passwords do not match</p>
                    )}
                  </div>

                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      Password must be at least 12 characters with uppercase, lowercase, numbers, 
                      and special characters. We enforce strong security for your protection.
                    </AlertDescription>
                  </Alert>
                  
                  <Button 
                    type="submit" 
                    className="w-full touch-target font-display" 
                    style={{ 
                      backgroundColor: '#169873',
                      color: 'white',
                      minHeight: '48px'
                    }}
                    disabled={loading || !passwordValidation?.isValid || password !== confirmPassword}
                  >
                    {loading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
              )}
              
              {runtimeFlags.prelaunchMode && (
                <div className="mt-6 p-4 bg-navy/50 border border-white/10 rounded-lg text-center">
                  <p className="text-white/70 text-sm mb-3">
                    New user registration is currently limited.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full border-gold text-gold hover:bg-gold hover:text-navy"
                    onClick={() => navigate('/waitlist')}
                  >
                    Join Our Waitlist
                  </Button>
                </div>
              )}
            </Tabs>
          </CardContent>
        </Card>
      </div>
      <EnvironmentIndicator />
    </div>
  </ErrorBoundary>
  );
}
