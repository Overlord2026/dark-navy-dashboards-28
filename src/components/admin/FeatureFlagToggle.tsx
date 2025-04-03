
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useFeatureFlagContext } from '@/context/FeatureFlagContext';
import { FeatureFlag } from '@/types/featureFlags';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export function FeatureFlagToggle() {
  const { 
    flags, 
    environment, 
    isEnabled, 
    toggleFeature,
    resetToDefaults
  } = useFeatureFlagContext();
  
  const formatFeatureName = (flag: string): string => {
    return flag
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase());
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Feature Flags</CardTitle>
            <CardDescription>Toggle features for phased deployment</CardDescription>
          </div>
          <Badge variant={environment === 'production' ? 'destructive' : environment === 'staging' ? 'warning' : 'outline'}>
            {environment}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-4">
            {Object.keys(flags).map(flag => (
              <div key={flag} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <h3 className="font-medium">{formatFeatureName(flag)}</h3>
                  <p className="text-sm text-muted-foreground">{getFeatureDescription(flag as FeatureFlag)}</p>
                </div>
                <Switch
                  checked={isEnabled(flag as FeatureFlag)}
                  onCheckedChange={() => toggleFeature(flag as FeatureFlag)}
                />
              </div>
            ))}
          </div>
          
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={resetToDefaults} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Reset to Defaults
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to provide descriptions for each feature flag
function getFeatureDescription(flag: FeatureFlag): string {
  switch (flag) {
    case 'USE_LOCAL_STORAGE':
      return 'Use local storage instead of API for data persistence';
    case 'ENABLE_DIAGNOSTICS':
      return 'Enable diagnostic tools and error monitoring';
    case 'ENABLE_API_INTEGRATION':
      return 'Connect to external API services';
    case 'ENABLE_ADVANCED_ANALYTICS':
      return 'Enable advanced analytics and reporting features';
    case 'ENABLE_THIRD_PARTY_INTEGRATIONS':
      return 'Enable integrations with third-party services';
    case 'ENABLE_MARKETPLACE_FEATURES':
      return 'Enable marketplace and listing features';
    case 'ENABLE_TAX_PLANNING_TOOLS':
      return 'Enable tax planning and optimization tools';
    default:
      return 'Toggle this feature on/off';
  }
}
