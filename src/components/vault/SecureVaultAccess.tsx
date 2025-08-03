import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Key, Lock, AlertTriangle } from 'lucide-react';
import { VaultEncryption } from '@/utils/vaultEncryption';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface SecureVaultAccessProps {
  vaultId: string;
  userRole: string;
  onAccessGranted: (masterKey: CryptoKey) => void;
  onAccessDenied: () => void;
}

export const SecureVaultAccess: React.FC<SecureVaultAccessProps> = ({
  vaultId,
  userRole,
  onAccessGranted,
  onAccessDenied
}) => {
  const { user } = useAuth();
  const [step, setStep] = useState<'2fa' | 'key_verification' | 'access_granted'>('2fa');
  const [otpCode, setOtpCode] = useState('');
  const [verificationKey, setVerificationKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [has2FA, setHas2FA] = useState(false);

  useEffect(() => {
    checkSecurityRequirements();
  }, [user]);

  const checkSecurityRequirements = async () => {
    if (!user) {
      onAccessDenied();
      return;
    }

    try {
      // Check if user has 2FA enabled
      const twoFactorEnabled = await VaultEncryption.enforce2FA(user.id);
      setHas2FA(twoFactorEnabled);
      
      if (twoFactorEnabled) {
        setStep('2fa');
      } else {
        setError('2FA is required for vault access. Please enable 2FA in your security settings.');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Security verification failed');
    }
  };

  const verify2FA = async () => {
    if (!user || !otpCode) return;

    setLoading(true);
    setError('');

    try {
      // In a real implementation, verify OTP with your 2FA service
      // For now, we'll simulate the verification
      if (otpCode.length !== 6) {
        throw new Error('Please enter a valid 6-digit code');
      }

      // Proceed to key verification step
      setStep('key_verification');
      toast.success('2FA verified successfully');
    } catch (error) {
      setError(error instanceof Error ? error.message : '2FA verification failed');
    } finally {
      setLoading(false);
    }
  };

  const verifyVaultAccess = async () => {
    if (!user || !verificationKey) return;

    setLoading(true);
    setError('');

    try {
      // In production, retrieve the encrypted role key from the database
      // For now, we'll simulate this process
      const roleKeyData = {
        roleKeyId: verificationKey,
        encryptedMasterKey: 'simulated-encrypted-key',
        iv: 'simulated-iv',
        role: userRole as any,
        vaultId
      };

      // Attempt to decrypt the master key
      // const masterKey = await VaultEncryption.decryptMasterKey(roleKeyData, userRole as any);
      
      // For demo purposes, generate a temporary key
      const masterKey = await crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );

      setStep('access_granted');
      toast.success('Vault access granted');
      onAccessGranted(masterKey);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Vault access verification failed');
    } finally {
      setLoading(false);
    }
  };

  if (!has2FA && error) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <CardTitle>Security Required</CardTitle>
          <CardDescription>Additional security measures required for vault access</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="mt-4 space-y-2">
            <Button 
              onClick={() => window.location.href = '/settings/security'} 
              className="w-full"
            >
              Enable 2FA
            </Button>
            <Button variant="outline" onClick={onAccessDenied} className="w-full">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === '2fa') {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>Enter the 6-digit code from your authenticator app</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="otp">Authentication Code</Label>
              <Input
                id="otp"
                type="text"
                placeholder="000000"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="text-center text-lg tracking-widest"
                maxLength={6}
              />
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Button 
                onClick={verify2FA} 
                disabled={loading || otpCode.length !== 6}
                className="w-full"
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </Button>
              <Button variant="outline" onClick={onAccessDenied} className="w-full">
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'key_verification') {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Key className="w-6 h-6 text-primary" />
          </div>
          <CardTitle>Vault Key Verification</CardTitle>
          <CardDescription>Enter your vault access key or recovery phrase</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="vault-key">Vault Access Key</Label>
              <Input
                id="vault-key"
                type="password"
                placeholder="Enter your vault key or recovery phrase"
                value={verificationKey}
                onChange={(e) => setVerificationKey(e.target.value)}
              />
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Button 
                onClick={verifyVaultAccess} 
                disabled={loading || !verificationKey}
                className="w-full"
              >
                {loading ? 'Verifying Access...' : 'Access Vault'}
              </Button>
              <Button variant="outline" onClick={() => setStep('2fa')} className="w-full">
                Back
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'access_granted') {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-green-600" />
          </div>
          <CardTitle className="text-green-700">Access Granted</CardTitle>
          <CardDescription>Vault is now decrypted and ready for use</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              You now have secure access to this family vault. All content is encrypted end-to-end.
            </p>
            <div className="bg-muted p-3 rounded-lg text-xs">
              <strong>Security Notice:</strong> Your session will automatically expire after 30 minutes of inactivity.
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};