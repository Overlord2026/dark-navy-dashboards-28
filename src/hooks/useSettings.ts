import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface UserSettings {
  profile: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    avatar_url?: string;
    bio?: string;
  };
  security: {
    two_factor_enabled: boolean;
    last_password_change?: string;
    active_sessions: number;
  };
  notifications: {
    email_enabled: boolean;
    push_enabled: boolean;
    sms_enabled: boolean;
    weekly_reports: boolean;
    security_alerts: boolean;
  };
  billing: {
    plan: string;
    status: string;
    next_billing_date?: string;
    usage: Record<string, number>;
  };
}

export const useSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [apiCallsCount, setApiCallsCount] = useState(0);
  const [saveOperations, setSaveOperations] = useState(0);

  // Memoized default settings
  const defaultSettings = useMemo((): UserSettings => ({
    profile: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      avatar_url: '',
      bio: ''
    },
    security: {
      two_factor_enabled: false,
      active_sessions: 1
    },
    notifications: {
      email_enabled: true,
      push_enabled: true,
      sms_enabled: false,
      weekly_reports: true,
      security_alerts: true
    },
    billing: {
      plan: 'free',
      status: 'active',
      usage: {}
    }
  }), []);

  // Optimized settings loading
  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      setApiCallsCount(prev => prev + 1);
      
      if (!user) return;

      // Load profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setApiCallsCount(prev => prev + 1);

      // Load user preferences
      const { data: preferencesData, error: preferencesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setApiCallsCount(prev => prev + 1);

      if (profileError && profileError.code !== 'PGRST116') {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Profile fetch error:', profileError);
        }
        throw profileError;
      }

      if (preferencesError && preferencesError.code !== 'PGRST116') {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Preferences fetch error:', preferencesError);
        }
      }

      const mergedSettings: UserSettings = {
        ...defaultSettings,
        profile: {
          ...defaultSettings.profile,
          first_name: profileData?.first_name || '',
          last_name: profileData?.last_name || '',
          email: user.email || '',
          phone: profileData?.phone || '',
          avatar_url: profileData?.avatar_url || '',
          bio: profileData?.bio || ''
        },
        notifications: {
          ...defaultSettings.notifications,
          ...(preferencesData as any)?.notifications
        },
        security: {
          ...defaultSettings.security,
          two_factor_enabled: (preferencesData as any)?.two_factor_enabled || false
        }
      };

      setSettings(mergedSettings);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Load settings error:', error);
      }
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [defaultSettings, toast]);

  // Optimized profile save
  const saveProfileSettings = useCallback(async (profileData: Partial<UserSettings['profile']>) => {
    try {
      setSaving(true);
      setSaveOperations(prev => prev + 1);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);

      setApiCallsCount(prev => prev + 1);

      if (error) throw error;

      setSettings(prev => prev ? {
        ...prev,
        profile: { ...prev.profile, ...profileData }
      } : null);

      toast({
        title: "Success",
        description: "Profile settings saved successfully"
      });

      return true;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Save profile error:', error);
      }
      toast({
        title: "Error",
        description: "Failed to save profile settings",
        variant: "destructive"
      });
      return false;
    } finally {
      setSaving(false);
    }
  }, [toast]);

  // Optimized notification preferences save
  const saveNotificationSettings = useCallback(async (notificationData: Partial<UserSettings['notifications']>) => {
    try {
      setSaving(true);
      setSaveOperations(prev => prev + 1);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('profiles')
        .update({
          notifications: notificationData
        } as any)
        .eq('id', user.id);

      setApiCallsCount(prev => prev + 1);

      if (error) throw error;

      setSettings(prev => prev ? {
        ...prev,
        notifications: { ...prev.notifications, ...notificationData }
      } : null);

      toast({
        title: "Success",
        description: "Notification settings saved successfully"
      });

      return true;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Save notifications error:', error);
      }
      toast({
        title: "Error",
        description: "Failed to save notification settings",
        variant: "destructive"
      });
      return false;
    } finally {
      setSaving(false);
    }
  }, [toast]);

  // Optimized security settings save
  const saveSecuritySettings = useCallback(async (securityData: Partial<UserSettings['security']>) => {
    try {
      setSaving(true);
      setSaveOperations(prev => prev + 1);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('profiles')
        .update({
          two_factor_enabled: securityData.two_factor_enabled
        } as any)
        .eq('id', user.id);

      setApiCallsCount(prev => prev + 1);

      if (error) throw error;

      setSettings(prev => prev ? {
        ...prev,
        security: { ...prev.security, ...securityData }
      } : null);

      toast({
        title: "Success",
        description: "Security settings saved successfully"
      });

      return true;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Save security error:', error);
      }
      toast({
        title: "Error",
        description: "Failed to save security settings",
        variant: "destructive"
      });
      return false;
    } finally {
      setSaving(false);
    }
  }, [toast]);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // Refresh function
  const refreshSettings = useCallback(() => {
    loadSettings();
  }, [loadSettings]);

  return {
    settings,
    loading,
    saving,
    apiCallsCount,
    saveOperations,
    saveProfileSettings,
    saveNotificationSettings,
    saveSecuritySettings,
    refreshSettings,
    loadingStates: {
      main: loading,
      saving
    }
  };
};