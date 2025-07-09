import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { OTPInput } from '@/components/auth/OTPInput';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Shield, Check, ArrowLeft, Mail } from 'lucide-react';

export default function Setup2FA() {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [testingMode, setTestingMode] = useState(false);
  const [testOtp, setTestOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();
  const { user, session, userProfile, refreshProfile } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // Load current 2FA status
    if (userProfile) {
      setIs2FAEnabled(userProfile.twoFactorEnabled || false);
      setInitialLoading(false);
    }
  }, [user, userProfile, navigate]);

  const handleToggle2FA = async (enabled: boolean) => {
    if (!user || !session) return;

    setLoading(true);
    try {
      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        .update({ two_factor_enabled: enabled })
        .eq('id', user.id);

      if (error) throw error;

      setIs2FAEnabled(enabled);
      await refreshProfile();

      if (enabled) {
        toast.success('Two-factor authentication enabled');
        setTestingMode(true);
      } else {
        toast.success('Two-factor authentication disabled');
        setTestingMode(false);
        setTestOtp('');
      }
    } catch (error: any) {
      console.error('2FA toggle error:', error);
      toast.error('Failed to update two-factor authentication');
    } finally {
      setLoading(false);
    }
  };

  const handleSendTestOTP = async () => {
    if (!session) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { userEmail: user?.email },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      toast.success('Test verification code sent to your email');
    } catch (error: any) {
      console.error('Send test OTP error:', error);
      toast.error(error.message || 'Failed to send test code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyTestOTP = async () => {
    if (testOtp.length !== 6 || !session) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('verify-otp', {
        body: { otpCode: testOtp },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      if (data.valid) {
        toast.success('Test verification successful! 2FA is working correctly.');
        setTestingMode(false);
        setTestOtp('');
      } else {
        toast.error('Invalid verification code. Please try again.');
        setTestOtp('');
      }
    } catch (error: any) {
      console.error('Test OTP verification error:', error);
      toast.error(error.message || 'Failed to verify test code');
      setTestOtp('');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/settings')}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Settings
          </Button>
          
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Two-Factor Authentication</h1>
          </div>
          <p className="text-muted-foreground">
            Add an extra layer of security to your account with email-based verification codes.
          </p>
        </div>

        <div className="space-y-6">
          {/* Current Status Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${is2FAEnabled ? 'bg-green-500' : 'bg-gray-400'}`} />
                <div>
                  <h3 className="font-semibold">
                    Two-Factor Authentication is {is2FAEnabled ? 'Enabled' : 'Disabled'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {is2FAEnabled 
                      ? 'Your account is protected with 2FA'
                      : 'Enable 2FA to secure your account'
                    }
                  </p>
                </div>
              </div>
              
              <Switch
                checked={is2FAEnabled}
                onCheckedChange={handleToggle2FA}
                disabled={loading}
              />
            </div>
          </Card>

          {/* How it Works */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Mail className="h-5 w-5" />
              How Email 2FA Works
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold mt-0.5">1</div>
                <p>When you sign in, enter your email and password as usual</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold mt-0.5">2</div>
                <p>We'll send a 6-digit verification code to your email address</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold mt-0.5">3</div>
                <p>Enter the code to complete your sign-in</p>
              </div>
            </div>
          </Card>

          {/* Test 2FA */}
          {is2FAEnabled && (
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Test Your 2FA Setup</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Send yourself a test verification code to make sure everything is working correctly.
              </p>
              
              {!testingMode ? (
                <Button
                  onClick={handleSendTestOTP}
                  disabled={loading}
                  variant="outline"
                >
                  {loading ? 'Sending...' : 'Send Test Code'}
                </Button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">
                      Enter the verification code sent to {user?.email}
                    </p>
                    <OTPInput
                      value={testOtp}
                      onChange={setTestOtp}
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <Button
                      onClick={handleVerifyTestOTP}
                      disabled={testOtp.length !== 6 || loading}
                    >
                      {loading ? 'Verifying...' : 'Verify Test Code'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setTestingMode(false);
                        setTestOtp('');
                      }}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Security Tips */}
          <Card className="p-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold mb-3 text-blue-900 dark:text-blue-100">
              Security Tips
            </h3>
            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Keep your email account secure with a strong password</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Never share your verification codes with anyone</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Verification codes expire after 5 minutes for security</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}