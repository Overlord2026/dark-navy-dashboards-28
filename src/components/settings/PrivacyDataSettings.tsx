import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Download,
  Trash2,
  Eye,
  EyeOff,
  Share2,
  Lock,
  Globe,
  Database,
  FileText,
  Calendar,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Clock,
  HardDrive
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';
import { useEventTracking } from '@/hooks/useEventTracking';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PrivacySettings {
  profile_visibility: 'public' | 'family' | 'private';
  data_sharing_analytics: boolean;
  data_sharing_marketing: boolean;
  data_sharing_third_party: boolean;
  cookie_preferences: {
    essential: boolean;
    analytics: boolean;
    marketing: boolean;
    preferences: boolean;
  };
  data_retention_period: '1year' | '3years' | '7years' | 'indefinite';
  export_format: 'json' | 'csv' | 'pdf';
  delete_account_reason?: string;
}

interface DataExportRequest {
  id: string;
  status: 'pending' | 'processing' | 'ready' | 'expired';
  requested_at: string;
  expires_at: string;
  download_url?: string;
  file_size?: number;
}

export const PrivacyDataSettings: React.FC = () => {
  const { user } = useAuth();
  const { subscriptionPlan } = useSubscriptionAccess();
  const { trackFeatureUsed } = useEventTracking();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [exportRequests, setExportRequests] = useState<DataExportRequest[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const [settings, setSettings] = useState<PrivacySettings>({
    profile_visibility: 'family',
    data_sharing_analytics: true,
    data_sharing_marketing: false,
    data_sharing_third_party: false,
    cookie_preferences: {
      essential: true,
      analytics: true,
      marketing: false,
      preferences: true
    },
    data_retention_period: '7years',
    export_format: 'json'
  });

  const [dataStats, setDataStats] = useState({
    total_size: 0,
    documents_count: 0,
    transactions_count: 0,
    last_backup: null as string | null
  });

  useEffect(() => {
    if (user) {
      loadPrivacySettings();
      loadDataStats();
      loadExportRequests();
    }
  }, [user]);

  const loadPrivacySettings = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if ((data as any)?.privacy_settings) {
        setSettings({
          ...settings,
          ...(data as any).privacy_settings
        });
      }
    } catch (error) {
      console.error('Error loading privacy settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDataStats = async () => {
    if (!user) return;

    try {
      // Get data statistics
      const { data, error } = await supabase.functions.invoke('get-data-stats', {
        body: { user_id: user.id }
      });

      if (!error && data) {
        setDataStats(data);
      }
    } catch (error) {
      console.error('Error loading data stats:', error);
    }
  };

  const loadExportRequests = async () => {
    if (!user) return;

    try {
      // Mock export requests data for demo
      setExportRequests([
        {
          id: '1',
          status: 'ready',
          requested_at: new Date(Date.now() - 86400000).toISOString(),
          expires_at: new Date(Date.now() + 6 * 86400000).toISOString(),
          download_url: 'https://example.com/export.json',
          file_size: 1024000
        }
      ]);
    } catch (error) {
      console.error('Error loading export requests:', error);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const updateData: any = {
        privacy_settings: settings,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;

      trackFeatureUsed('privacy_settings_updated', {
        profile_visibility: settings.profile_visibility,
        data_sharing_enabled: Object.values(settings).filter(v => typeof v === 'boolean' && v).length,
        retention_period: settings.data_retention_period
      });

      toast({
        title: "Success",
        description: "Privacy settings updated successfully",
      });
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      toast({
        title: "Error",
        description: "Failed to update privacy settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = async () => {
    if (!user) return;

    setIsExporting(true);
    try {
      const { data, error } = await supabase.functions.invoke('request-data-export', {
        body: { 
          user_id: user.id,
          format: settings.export_format
        }
      });

      if (error) throw error;

      trackFeatureUsed('data_export_requested', {
        format: settings.export_format,
        user_tier: subscriptionPlan?.tier
      });

      toast({
        title: "Export Requested",
        description: "Your data export is being prepared. You'll receive an email when it's ready.",
      });

      await loadExportRequests();
    } catch (error) {
      console.error('Error requesting data export:', error);
      toast({
        title: "Error",
        description: "Failed to request data export",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase.functions.invoke('request-account-deletion', {
        body: { 
          user_id: user.id,
          reason: settings.delete_account_reason
        }
      });

      if (error) throw error;

      trackFeatureUsed('account_deletion_requested', {
        reason: settings.delete_account_reason,
        user_tier: subscriptionPlan?.tier
      });

      toast({
        title: "Deletion Requested",
        description: "Your account deletion request has been submitted. We'll contact you within 24 hours.",
      });

      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error requesting account deletion:', error);
      toast({
        title: "Error",
        description: "Failed to request account deletion",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getExportStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Privacy Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Privacy Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Visibility */}
          <div className="space-y-3">
            <Label>Profile Visibility</Label>
            <div className="space-y-2">
              {[
                { value: 'private', label: 'Private', description: 'Only you can see your profile' },
                { value: 'family', label: 'Family Only', description: 'Only family members can see your profile' },
                { value: 'public', label: 'Public', description: 'Your profile is visible to all platform users' }
              ].map(({ value, label, description }) => (
                <div key={value} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id={`visibility-${value}`}
                    name="visibility"
                    value={value}
                    checked={settings.profile_visibility === value}
                    onChange={(e) => setSettings(prev => ({ ...prev, profile_visibility: e.target.value as any }))}
                    className="h-4 w-4"
                  />
                  <div>
                    <Label htmlFor={`visibility-${value}`} className="font-medium">{label}</Label>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Data Sharing */}
          <div className="space-y-4">
            <h4 className="font-medium">Data Sharing Preferences</h4>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Analytics & Performance</Label>
                  <p className="text-sm text-muted-foreground">
                    Help us improve the platform by sharing anonymous usage data
                  </p>
                </div>
                <Switch
                  checked={settings.data_sharing_analytics}
                  onCheckedChange={(value) => setSettings(prev => ({ ...prev, data_sharing_analytics: value }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Marketing & Communications</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow us to send personalized offers and product updates
                  </p>
                </div>
                <Switch
                  checked={settings.data_sharing_marketing}
                  onCheckedChange={(value) => setSettings(prev => ({ ...prev, data_sharing_marketing: value }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Third-Party Integrations</Label>
                  <p className="text-sm text-muted-foreground">
                    Share data with trusted partners for enhanced services
                  </p>
                </div>
                <Switch
                  checked={settings.data_sharing_third_party}
                  onCheckedChange={(value) => setSettings(prev => ({ ...prev, data_sharing_third_party: value }))}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Cookie Preferences */}
          <div className="space-y-4">
            <h4 className="font-medium">Cookie Preferences</h4>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Essential Cookies</Label>
                  <p className="text-sm text-muted-foreground">
                    Required for basic functionality (cannot be disabled)
                  </p>
                </div>
                <Switch checked={true} disabled />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Analytics Cookies</Label>
                  <p className="text-sm text-muted-foreground">
                    Help us understand how you use the platform
                  </p>
                </div>
                <Switch
                  checked={settings.cookie_preferences.analytics}
                  onCheckedChange={(value) => setSettings(prev => ({
                    ...prev,
                    cookie_preferences: { ...prev.cookie_preferences, analytics: value }
                  }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Marketing Cookies</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable personalized advertising and content
                  </p>
                </div>
                <Switch
                  checked={settings.cookie_preferences.marketing}
                  onCheckedChange={(value) => setSettings(prev => ({
                    ...prev,
                    cookie_preferences: { ...prev.cookie_preferences, marketing: value }
                  }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Preference Cookies</Label>
                  <p className="text-sm text-muted-foreground">
                    Remember your settings and preferences
                  </p>
                </div>
                <Switch
                  checked={settings.cookie_preferences.preferences}
                  onCheckedChange={(value) => setSettings(prev => ({
                    ...prev,
                    cookie_preferences: { ...prev.cookie_preferences, preferences: value }
                  }))}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Data Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <HardDrive className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <div className="font-semibold">{formatFileSize(dataStats.total_size)}</div>
              <div className="text-sm text-muted-foreground">Total Data</div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <FileText className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <div className="font-semibold">{dataStats.documents_count}</div>
              <div className="text-sm text-muted-foreground">Documents</div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <Database className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <div className="font-semibold">{dataStats.transactions_count}</div>
              <div className="text-sm text-muted-foreground">Transactions</div>
            </div>
          </div>

          <Separator />

          {/* Data Retention */}
          <div className="space-y-3">
            <Label>Data Retention Period</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={settings.data_retention_period}
              onChange={(e) => setSettings(prev => ({ ...prev, data_retention_period: e.target.value as any }))}
            >
              <option value="1year">1 Year</option>
              <option value="3years">3 Years</option>
              <option value="7years">7 Years (Recommended)</option>
              <option value="indefinite">Indefinite</option>
            </select>
            <p className="text-sm text-muted-foreground">
              How long to keep your data after account closure. Note: Some financial data may be required to be kept longer for compliance.
            </p>
          </div>

          <Separator />

          {/* Export Data */}
          <div className="space-y-4">
            <h4 className="font-medium">Export Your Data</h4>
            <p className="text-sm text-muted-foreground">
              Download a copy of all your data in your preferred format.
            </p>
            
            <div className="space-y-3">
              <Label>Export Format</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={settings.export_format}
                onChange={(e) => setSettings(prev => ({ ...prev, export_format: e.target.value as any }))}
              >
                <option value="json">JSON (Machine readable)</option>
                <option value="csv">CSV (Spreadsheet friendly)</option>
                <option value="pdf">PDF (Human readable)</option>
              </select>
            </div>

            <Button 
              onClick={handleExportData} 
              disabled={isExporting}
              className="w-full sm:w-auto"
            >
              {isExporting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin border-2 border-current border-t-transparent rounded-full" />
                  Preparing Export...
                </div>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Request Data Export
                </>
              )}
            </Button>

            {dataStats.last_backup && (
              <p className="text-sm text-muted-foreground">
                Last backup: {new Date(dataStats.last_backup).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Export History */}
          {exportRequests.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-medium">Recent Export Requests</h4>
                <div className="space-y-2">
                  {exportRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge className={getExportStatusColor(request.status)}>
                            {request.status.toUpperCase()}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(request.requested_at).toLocaleDateString()}
                          </span>
                        </div>
                        {request.file_size && (
                          <p className="text-sm text-muted-foreground">
                            Size: {formatFileSize(request.file_size)}
                          </p>
                        )}
                      </div>
                      {request.status === 'ready' && request.download_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(request.download_url, '_blank')}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Legal & Compliance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Legal & Compliance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 justify-start"
              onClick={() => window.open('/legal/privacy-policy', '_blank')}
            >
              <Shield className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Privacy Policy</div>
                <div className="text-xs text-muted-foreground">How we handle your data</div>
              </div>
              <ExternalLink className="h-4 w-4 ml-auto" />
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 justify-start"
              onClick={() => window.open('/legal/terms-of-service', '_blank')}
            >
              <FileText className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Terms of Service</div>
                <div className="text-xs text-muted-foreground">Platform usage terms</div>
              </div>
              <ExternalLink className="h-4 w-4 ml-auto" />
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 justify-start"
              onClick={() => window.open('/legal/data-processing', '_blank')}
            >
              <Database className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Data Processing Agreement</div>
                <div className="text-xs text-muted-foreground">GDPR compliance details</div>
              </div>
              <ExternalLink className="h-4 w-4 ml-auto" />
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 justify-start"
              onClick={() => window.open('/legal/cookie-policy', '_blank')}
            >
              <Globe className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Cookie Policy</div>
                <div className="text-xs text-muted-foreground">Cookie usage information</div>
              </div>
              <ExternalLink className="h-4 w-4 ml-auto" />
            </Button>
          </div>

          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              We are fully compliant with GDPR, CCPA, and other major privacy regulations. 
              Your data is encrypted and stored securely in SOC 2 Type II certified facilities.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Account Deletion */}
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Delete Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Warning:</strong> Account deletion is permanent and cannot be undone. 
              All your data will be permanently deleted after a 30-day grace period.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Before deleting your account, we recommend:
            </p>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li>Export your data using the option above</li>
              <li>Cancel any active subscriptions</li>
              <li>Inform family members who have access to your data</li>
              <li>Download any important documents</li>
            </ul>
          </div>

          {!showDeleteConfirm ? (
            <Button
              variant="destructive"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete My Account
            </Button>
          ) : (
            <div className="space-y-4 p-4 border border-destructive/20 rounded-lg">
              <h4 className="font-medium text-destructive">Confirm Account Deletion</h4>
              <div className="space-y-3">
                <Label htmlFor="delete-reason">Reason for deletion (optional)</Label>
                <select
                  id="delete-reason"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={settings.delete_account_reason || ''}
                  onChange={(e) => setSettings(prev => ({ ...prev, delete_account_reason: e.target.value }))}
                >
                  <option value="">Select a reason</option>
                  <option value="no_longer_needed">No longer needed</option>
                  <option value="too_expensive">Too expensive</option>
                  <option value="missing_features">Missing features</option>
                  <option value="privacy_concerns">Privacy concerns</option>
                  <option value="switching_providers">Switching to another provider</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin border-2 border-current border-t-transparent rounded-full" />
                      Processing...
                    </div>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Confirm Deletion
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving} className="min-w-[120px]">
          {isSaving ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin border-2 border-current border-t-transparent rounded-full" />
              Saving...
            </div>
          ) : (
            <>
              <Shield className="h-4 w-4 mr-2" />
              Save Privacy Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
};