import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Bell, 
  Mail, 
  Smartphone,
  CreditCard,
  Shield,
  TrendingUp,
  GraduationCap,
  Save,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useEventTracking } from '@/hooks/useEventTracking';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface NotificationPreferences {
  email: {
    billing: boolean;
    security: boolean;
    feature_updates: boolean;
    educational_content: boolean;
    marketing: boolean;
    system_updates: boolean;
  };
  sms: {
    security_alerts: boolean;
    payment_reminders: boolean;
    appointment_reminders: boolean;
    urgent_updates: boolean;
  };
  push: {
    real_time_alerts: boolean;
    daily_summary: boolean;
    weekly_reports: boolean;
    goal_reminders: boolean;
  };
  frequency: {
    email_digest: 'instant' | 'daily' | 'weekly' | 'never';
    summary_reports: 'weekly' | 'monthly' | 'quarterly';
  };
}

export const NotificationSettings: React.FC = () => {
  const { user } = useAuth();
  const { trackFeatureUsed } = useEventTracking();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email: {
      billing: true,
      security: true,
      feature_updates: true,
      educational_content: true,
      marketing: false,
      system_updates: true,
    },
    sms: {
      security_alerts: true,
      payment_reminders: true,
      appointment_reminders: true,
      urgent_updates: true,
    },
    push: {
      real_time_alerts: true,
      daily_summary: false,
      weekly_reports: true,
      goal_reminders: true,
    },
    frequency: {
      email_digest: 'daily',
      summary_reports: 'weekly',
    }
  });

  useEffect(() => {
    if (user) {
      loadNotificationPreferences();
    }
  }, [user]);

  const loadNotificationPreferences = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if ((data as any)?.notification_preferences) {
        setPreferences({
          ...preferences,
          ...(data as any).notification_preferences
        });
      }
    } catch (error) {
      console.error('Error loading notification preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const updateData: any = {
        updated_at: new Date().toISOString()
      };
      
      // Only update notification_preferences if the column exists
      updateData.notification_preferences = preferences;

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;

      trackFeatureUsed('notification_settings_updated', {
        email_notifications: Object.values(preferences.email).filter(Boolean).length,
        sms_notifications: Object.values(preferences.sms).filter(Boolean).length,
        push_notifications: Object.values(preferences.push).filter(Boolean).length,
      });

      toast({
        title: "Success",
        description: "Notification preferences updated successfully",
      });
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      toast({
        title: "Error",
        description: "Failed to update notification preferences",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateEmailPreference = (key: keyof NotificationPreferences['email'], value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      email: {
        ...prev.email,
        [key]: value
      }
    }));
  };

  const updateSmsPreference = (key: keyof NotificationPreferences['sms'], value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      sms: {
        ...prev.sms,
        [key]: value
      }
    }));
  };

  const updatePushPreference = (key: keyof NotificationPreferences['push'], value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      push: {
        ...prev.push,
        [key]: value
      }
    }));
  };

  const updateFrequencyPreference = (key: keyof NotificationPreferences['frequency'], value: string) => {
    setPreferences(prev => ({
      ...prev,
      frequency: {
        ...prev.frequency,
        [key]: value as any
      }
    }));
  };

  const getEnabledCount = (prefs: Record<string, boolean>) => {
    return Object.values(prefs).filter(Boolean).length;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="text-center space-y-2">
              <div className="h-6 w-6 animate-spin border-2 border-primary border-t-transparent rounded-full mx-auto" />
              <p className="text-sm text-muted-foreground">Loading preferences...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Notifications
            <Badge variant="secondary" className="ml-auto">
              {getEnabledCount(preferences.email)} enabled
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-blue-500" />
                  <Label>Billing & Payment Updates</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Invoices, payment confirmations, and billing issues
                </p>
              </div>
              <Switch
                checked={preferences.email.billing}
                onCheckedChange={(value) => updateEmailPreference('billing', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-red-500" />
                  <Label>Security Alerts</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Login attempts, password changes, and security updates
                </p>
              </div>
              <Switch
                checked={preferences.email.security}
                onCheckedChange={(value) => updateEmailPreference('security', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <Label>Feature Updates</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  New features, improvements, and product announcements
                </p>
              </div>
              <Switch
                checked={preferences.email.feature_updates}
                onCheckedChange={(value) => updateEmailPreference('feature_updates', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-purple-500" />
                  <Label>Educational Content</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Financial tips, guides, and educational resources
                </p>
              </div>
              <Switch
                checked={preferences.email.educational_content}
                onCheckedChange={(value) => updateEmailPreference('educational_content', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-orange-500" />
                  <Label>Marketing & Promotions</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Special offers, webinars, and promotional content
                </p>
              </div>
              <Switch
                checked={preferences.email.marketing}
                onCheckedChange={(value) => updateEmailPreference('marketing', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-blue-500" />
                  <Label>System Updates</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Maintenance notifications and system status updates
                </p>
              </div>
              <Switch
                checked={preferences.email.system_updates}
                onCheckedChange={(value) => updateEmailPreference('system_updates', value)}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="font-medium">Email Frequency</h4>
            <div className="space-y-2">
              <Label>Email Digest Frequency</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={preferences.frequency.email_digest}
                onChange={(e) => updateFrequencyPreference('email_digest', e.target.value)}
              >
                <option value="instant">Instant (as they happen)</option>
                <option value="daily">Daily digest</option>
                <option value="weekly">Weekly summary</option>
                <option value="never">Never</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SMS Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            SMS Notifications
            <Badge variant="secondary" className="ml-auto">
              {getEnabledCount(preferences.sms)} enabled
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Security Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Critical security events and login attempts
                </p>
              </div>
              <Switch
                checked={preferences.sms.security_alerts}
                onCheckedChange={(value) => updateSmsPreference('security_alerts', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Payment Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Upcoming payment due dates and overdue notices
                </p>
              </div>
              <Switch
                checked={preferences.sms.payment_reminders}
                onCheckedChange={(value) => updateSmsPreference('payment_reminders', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Appointment Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Scheduled meetings and consultation reminders
                </p>
              </div>
              <Switch
                checked={preferences.sms.appointment_reminders}
                onCheckedChange={(value) => updateSmsPreference('appointment_reminders', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Urgent Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Time-sensitive alerts and emergency notifications
                </p>
              </div>
              <Switch
                checked={preferences.sms.urgent_updates}
                onCheckedChange={(value) => updateSmsPreference('urgent_updates', value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Push Notifications
            <Badge variant="secondary" className="ml-auto">
              {getEnabledCount(preferences.push)} enabled
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Real-time Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Instant notifications for important events
                </p>
              </div>
              <Switch
                checked={preferences.push.real_time_alerts}
                onCheckedChange={(value) => updatePushPreference('real_time_alerts', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Daily Summary</Label>
                <p className="text-sm text-muted-foreground">
                  End-of-day summary of activities and updates
                </p>
              </div>
              <Switch
                checked={preferences.push.daily_summary}
                onCheckedChange={(value) => updatePushPreference('daily_summary', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Weekly Reports</Label>
                <p className="text-sm text-muted-foreground">
                  Weekly progress reports and insights
                </p>
              </div>
              <Switch
                checked={preferences.push.weekly_reports}
                onCheckedChange={(value) => updatePushPreference('weekly_reports', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Goal Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Reminders to check progress on financial goals
                </p>
              </div>
              <Switch
                checked={preferences.push.goal_reminders}
                onCheckedChange={(value) => updatePushPreference('goal_reminders', value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Frequency */}
      <Card>
        <CardHeader>
          <CardTitle>Report Frequency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Summary Reports</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={preferences.frequency.summary_reports}
                onChange={(e) => updateFrequencyPreference('summary_reports', e.target.value)}
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
              <p className="text-sm text-muted-foreground">
                How often you receive comprehensive performance reports
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving} className="min-w-[120px]">
          {isSaving ? (
            <div className="h-4 w-4 animate-spin border-2 border-current border-t-transparent rounded-full mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Preferences
        </Button>
      </div>
    </div>
  );
};