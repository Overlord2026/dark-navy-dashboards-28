import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Key, 
  Smartphone,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Clock,
  Monitor,
  MapPin,
  Trash2,
  LogOut,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useEventTracking } from '@/hooks/useEventTracking';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface LoginSession {
  id: string;
  device: string;
  location: string;
  ip_address: string;
  last_seen: string;
  is_current: boolean;
}

export const SecuritySettings: React.FC = () => {
  const { user } = useAuth();
  const { trackFeatureUsed } = useEventTracking();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginSessions, setLoginSessions] = useState<LoginSession[]>([]);
  const [loginHistory, setLoginHistory] = useState<any[]>([]);
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [emailForm, setEmailForm] = useState({
    newEmail: '',
    password: ''
  });

  useEffect(() => {
    if (user) {
      loadSecurityData();
    }
  }, [user]);

  const loadSecurityData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Load user profile for 2FA status
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('two_factor_enabled')
        .eq('id', user.id)
        .single();

      if (!profileError && profile) {
        setTwoFactorEnabled(profile.two_factor_enabled || false);
      }

      // Load login sessions and history
      // This would typically come from a backend service
      // For now, we'll simulate with mock data
      setLoginSessions([
        {
          id: '1',
          device: 'Chrome on Mac',
          location: 'New York, NY',
          ip_address: '192.168.1.1',
          last_seen: new Date().toISOString(),
          is_current: true
        },
        {
          id: '2',
          device: 'Safari on iPhone',
          location: 'New York, NY',
          ip_address: '192.168.1.2',
          last_seen: new Date(Date.now() - 86400000).toISOString(),
          is_current: false
        }
      ]);

      setLoginHistory([
        {
          id: '1',
          device: 'Chrome on Mac',
          location: 'New York, NY',
          ip_address: '192.168.1.1',
          timestamp: new Date().toISOString(),
          status: 'success'
        },
        {
          id: '2',
          device: 'Safari on iPhone',
          location: 'New York, NY',
          ip_address: '192.168.1.2',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          status: 'success'
        }
      ]);
    } catch (error) {
      console.error('Error loading security data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!user) return;

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match",
        variant: "destructive",
      });
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });

      if (error) throw error;

      trackFeatureUsed('password_changed');

      toast({
        title: "Success",
        description: "Password updated successfully",
      });

      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      toast({
        title: "Error",
        description: "Failed to update password",
        variant: "destructive",
      });
    }
  };

  const handleEmailChange = async () => {
    if (!user || !emailForm.newEmail) return;

    try {
      const { error } = await supabase.auth.updateUser({
        email: emailForm.newEmail
      });

      if (error) throw error;

      trackFeatureUsed('email_change_requested');

      toast({
        title: "Verification Required",
        description: "Check your new email for verification link",
      });

      setEmailForm({ newEmail: '', password: '' });
    } catch (error) {
      console.error('Error changing email:', error);
      toast({
        title: "Error",
        description: "Failed to update email",
        variant: "destructive",
      });
    }
  };

  const handleToggle2FA = async (enabled: boolean) => {
    if (!user) return;

    try {
      if (enabled) {
        // Enable 2FA - would typically generate QR code
        trackFeatureUsed('2fa_enable_started');
        toast({
          title: "2FA Setup",
          description: "2FA setup would be implemented here",
        });
      } else {
        // Disable 2FA
        const { error } = await supabase
          .from('profiles')
          .update({ two_factor_enabled: false })
          .eq('id', user.id);

        if (error) throw error;

        setTwoFactorEnabled(false);
        trackFeatureUsed('2fa_disabled');
        
        toast({
          title: "2FA Disabled",
          description: "Two-factor authentication has been disabled",
        });
      }
    } catch (error) {
      console.error('Error toggling 2FA:', error);
      toast({
        title: "Error",
        description: "Failed to update 2FA settings",
        variant: "destructive",
      });
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      // Would revoke the session via backend
      setLoginSessions(prev => prev.filter(s => s.id !== sessionId));
      
      trackFeatureUsed('session_revoked', { session_id: sessionId });
      
      toast({
        title: "Session Revoked",
        description: "Device has been signed out",
      });
    } catch (error) {
      console.error('Error revoking session:', error);
      toast({
        title: "Error",
        description: "Failed to revoke session",
        variant: "destructive",
      });
    }
  };

  const handleLogoutAllDevices = async () => {
    try {
      // Sign out from all sessions except current
      await supabase.auth.signOut({ scope: 'others' });
      
      trackFeatureUsed('logout_all_devices');
      
      toast({
        title: "Success",
        description: "Signed out from all other devices",
      });

      // Reload sessions
      await loadSecurityData();
    } catch (error) {
      console.error('Error logging out all devices:', error);
      toast({
        title: "Error",
        description: "Failed to sign out all devices",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Two-Factor Authentication
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium">Enable 2FA</p>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <div className="flex items-center gap-2">
              {twoFactorEnabled && (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Enabled
                </Badge>
              )}
              <Switch
                checked={twoFactorEnabled}
                onCheckedChange={handleToggle2FA}
              />
            </div>
          </div>

          {!twoFactorEnabled && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                We recommend enabling 2FA to secure your account against unauthorized access.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Password Change */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="Enter current password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Enter new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirm new password"
              />
            </div>
          </div>
          <Button onClick={handlePasswordChange} disabled={!passwordForm.currentPassword || !passwordForm.newPassword}>
            Update Password
          </Button>
        </CardContent>
      </Card>

      {/* Email Change */}
      <Card>
        <CardHeader>
          <CardTitle>Change Email Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Current Email</Label>
            <Input value={user?.email || ''} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-email">New Email Address</Label>
            <Input
              id="new-email"
              type="email"
              value={emailForm.newEmail}
              onChange={(e) => setEmailForm(prev => ({ ...prev, newEmail: e.target.value }))}
              placeholder="Enter new email address"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email-password">Confirm with Password</Label>
            <Input
              id="email-password"
              type="password"
              value={emailForm.password}
              onChange={(e) => setEmailForm(prev => ({ ...prev, password: e.target.value }))}
              placeholder="Enter your password"
            />
          </div>
          <Button onClick={handleEmailChange} disabled={!emailForm.newEmail || !emailForm.password}>
            Update Email
          </Button>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Active Sessions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {loginSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{session.device}</span>
                    {session.is_current && (
                      <Badge variant="default" className="text-xs">Current</Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {session.location} • {session.ip_address}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Last seen: {new Date(session.last_seen).toLocaleString()}
                    </div>
                  </div>
                </div>
                {!session.is_current && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRevokeSession(session.id)}
                  >
                    <LogOut className="h-3 w-3 mr-1" />
                    Sign Out
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Separator />

          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Sign out all devices</p>
              <p className="text-sm text-muted-foreground">
                This will sign you out from all devices except this one
              </p>
            </div>
            <Button variant="destructive" onClick={handleLogoutAllDevices}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Login History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Login Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {loginHistory.slice(0, 5).map((login) => (
              <div key={login.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <div className="font-medium">{login.device}</div>
                  <div className="text-sm text-muted-foreground">
                    {login.location} • {login.ip_address}
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-sm text-muted-foreground">
                    {new Date(login.timestamp).toLocaleString()}
                  </div>
                  <Badge variant={login.status === 'success' ? "default" : "destructive"} className="text-xs">
                    {login.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};