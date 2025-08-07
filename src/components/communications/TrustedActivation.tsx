import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Shield, 
  Phone, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Lock,
  Smartphone
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TrustedActivationProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  actionType: 'wire_transfer' | 'account_opening' | 'password_reset' | 'sensitive_document';
  actionDescription: string;
}

export function TrustedActivation({
  isOpen,
  onClose,
  onSuccess,
  actionType,
  actionDescription
}: TrustedActivationProps) {
  const [step, setStep] = useState<'phone' | 'code' | 'success'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const { toast } = useToast();

  React.useEffect(() => {
    if (step === 'code' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, timeLeft]);

  const sendMFACode = async () => {
    if (!phoneNumber) {
      toast({
        title: "Phone number required",
        description: "Please enter your phone number",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('trusted-activation', {
        body: {
          userId: user.user.id,
          action: 'send',
          phoneNumber,
          actionType
        }
      });

      if (error) throw error;

      setChallengeId(data.challengeId);
      setStep('code');
      setTimeLeft(600);

      toast({
        title: "Code sent",
        description: "Check your phone for the verification code"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send verification code",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyMFACode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Please enter the 6-digit verification code",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('trusted-activation', {
        body: {
          userId: user.user.id,
          action: 'verify',
          code: verificationCode,
          actionType
        }
      });

      if (error) throw error;

      if (data.verified) {
        setStep('success');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      } else {
        throw new Error('Invalid verification code');
      }
    } catch (error) {
      toast({
        title: "Verification failed",
        description: "The code you entered is incorrect or expired",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getActionSeverityBadge = () => {
    switch (actionType) {
      case 'wire_transfer':
        return <Badge variant="destructive" className="animate-pulse">Critical</Badge>;
      case 'account_opening':
        return <Badge variant="destructive">High Security</Badge>;
      case 'sensitive_document':
        return <Badge variant="secondary">Secure</Badge>;
      default:
        return <Badge variant="outline">Verification Required</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <DialogTitle className="text-xl">Trusted Activation</DialogTitle>
              <DialogDescription>Multi-factor authentication required</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Action Alert */}
          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <div>
                  <strong>Action:</strong> {actionDescription}
                </div>
                {getActionSeverityBadge()}
              </div>
            </AlertDescription>
          </Alert>

          {/* Phone Number Step */}
          {step === 'phone' && (
            <div className="space-y-4">
              <div className="text-center">
                <Smartphone className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Verify Your Identity</h3>
                <p className="text-sm text-muted-foreground">
                  We'll send a secure code to your registered phone number
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>

              <Button onClick={sendMFACode} disabled={loading} className="w-full">
                {loading ? 'Sending...' : 'Send Verification Code'}
              </Button>
            </div>
          )}

          {/* Verification Code Step */}
          {step === 'code' && (
            <div className="space-y-4">
              <div className="text-center">
                <Phone className="h-12 w-12 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Enter Verification Code</h3>
                <p className="text-sm text-muted-foreground">
                  Enter the 6-digit code sent to {phoneNumber}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="123456"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="text-center text-2xl tracking-widest"
                  maxLength={6}
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Code expires in:</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span className={timeLeft < 60 ? 'text-red-500' : 'text-muted-foreground'}>
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Button 
                  onClick={verifyMFACode} 
                  disabled={loading || verificationCode.length !== 6} 
                  className="w-full"
                >
                  {loading ? 'Verifying...' : 'Verify Code'}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => setStep('phone')} 
                  className="w-full"
                >
                  Use Different Number
                </Button>
              </div>
            </div>
          )}

          {/* Success Step */}
          {step === 'success' && (
            <div className="space-y-4 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto animate-scale-in" />
              <div>
                <h3 className="font-semibold text-green-800 mb-2">Verification Successful!</h3>
                <p className="text-sm text-muted-foreground">
                  Your identity has been verified. Proceeding with the requested action...
                </p>
              </div>
              
              <Alert className="border-green-200 bg-green-50">
                <Lock className="h-4 w-4" />
                <AlertDescription className="text-green-800">
                  All activities are logged for security and compliance.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}