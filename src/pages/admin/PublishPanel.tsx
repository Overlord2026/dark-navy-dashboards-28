import React, { useState } from 'react';
import { getFlags, setFlag, resetFlags, getBuildInfo, FLAG_DESCRIPTIONS, type FeatureFlag } from '@/config/flags';
import { purgeCDN } from '@/api/purge';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ExternalLink, RefreshCw, Save, Globe, FileText, Settings } from 'lucide-react';

export default function PublishPanel() {
  const [flags, setFlags] = useState(() => getFlags());
  const [pendingFlag, setPendingFlag] = useState<{ key: FeatureFlag; value: boolean } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const buildInfo = getBuildInfo();

  const handleFlagToggle = (key: FeatureFlag, value: boolean) => {
    setPendingFlag({ key, value });
  };

  const confirmFlagChange = () => {
    if (!pendingFlag) return;
    
    setFlag(pendingFlag.key, pendingFlag.value);
    setFlags(getFlags());
    setPendingFlag(null);
    
    toast({
      title: 'Flag Updated',
      description: `${pendingFlag.key} set to ${pendingFlag.value}`,
    });
  };

  const handlePurgeCDN = async () => {
    setIsLoading(true);
    try {
      const success = await purgeCDN();
      toast({
        title: success ? 'CDN Purge Initiated' : 'CDN Purge Failed',
        description: success 
          ? 'CDN purge initiated successfully. Changes may take 2-5 minutes to propagate.'
          : 'CDN purge failed. Check console for manual steps.',
        variant: success ? 'default' : 'destructive',
      });
    } catch (error) {
      toast({
        title: 'CDN Purge Error',
        description: 'Failed to initiate CDN purge. Check console for manual steps.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetFlags = () => {
    resetFlags();
    setFlags(getFlags());
    toast({
      title: 'Flags Reset',
      description: 'All flags reset to environment defaults',
    });
  };

  const openInNewTab = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Publish Panel</h1>
          <p className="text-muted-foreground">
            Control public feature visibility and manage deployments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {buildInfo.flavor.toUpperCase()}
          </Badge>
          <Badge variant="outline">
            {buildInfo.mode}
          </Badge>
        </div>
      </div>

      {/* Build Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Environment Info
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium">Build Flavor:</span>
              <div className="text-muted-foreground">{buildInfo.flavor}</div>
            </div>
            <div>
              <span className="font-medium">Mode:</span>
              <div className="text-muted-foreground">{buildInfo.mode}</div>
            </div>
            <div>
              <span className="font-medium">Timestamp:</span>
              <div className="text-muted-foreground">{new Date(buildInfo.timestamp).toLocaleString()}</div>
            </div>
            <div>
              <span className="font-medium">Environment:</span>
              <div className="text-muted-foreground">{buildInfo.dev ? 'Development' : 'Production'}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Manage deployment and test public routes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleResetFlags} variant="outline">
              <Save className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
            <Button 
              onClick={handlePurgeCDN} 
              disabled={isLoading}
              variant="outline"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Purge CDN
            </Button>
            <Button 
              onClick={() => openInNewTab('/discover')} 
              variant="outline"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open /discover
            </Button>
            <Button 
              onClick={() => openInNewTab('/solutions')} 
              variant="outline"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open /solutions
            </Button>
            <Button 
              onClick={() => openInNewTab('/sitemap.xml')} 
              variant="outline"
            >
              <FileText className="h-4 w-4 mr-2" />
              Open /sitemap.xml
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Feature Flags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Feature Flags
          </CardTitle>
          <CardDescription>
            Control which features are visible to public users. Changes take effect immediately.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(flags).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="font-medium">{key}</div>
                  <div className="text-sm text-muted-foreground">
                    {FLAG_DESCRIPTIONS[key as FeatureFlag]}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={value ? 'default' : 'secondary'}>
                    {value ? 'Enabled' : 'Disabled'}
                  </Badge>
                  <Switch
                    checked={value}
                    onCheckedChange={(checked) => handleFlagToggle(key as FeatureFlag, checked)}
                    data-testid={`flag-toggle-${key}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Safety Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Safety Notes</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>• Flag changes are in-memory only and reset on page refresh</p>
          <p>• Authenticated users always see private dashboard regardless of public flags</p>
          <p>• CDN purge may take 2-5 minutes to propagate globally</p>
          <p>• Set ADMIN_TOOLS_ENABLED=false to hide this panel from non-admin users</p>
          <p>• Emergency rollback: Reset flags to disable all public features instantly</p>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!pendingFlag} onOpenChange={() => setPendingFlag(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Flag Change</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingFlag && (
                <>
                  You are changing <strong>{pendingFlag.key}</strong> to{' '}
                  <strong>{pendingFlag.value ? 'enabled' : 'disabled'}</strong>.
                  <br /><br />
                  {FLAG_DESCRIPTIONS[pendingFlag.key]}
                  <br /><br />
                  This change takes effect immediately. Proceed?
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmFlagChange}>
              Confirm Change
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}