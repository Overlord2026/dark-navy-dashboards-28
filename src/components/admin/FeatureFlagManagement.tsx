import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/context/TenantContext';
import { toast } from 'sonner';
import { Settings, Zap, Shield, TrendingUp, FileText, Calculator } from 'lucide-react';

const AVAILABLE_FEATURES = [
  {
    name: 'advanced_analytics',
    label: 'Advanced Analytics',
    description: 'Access to detailed portfolio analytics and reporting',
    icon: TrendingUp,
    category: 'Analytics'
  },
  {
    name: 'premium_strategies',
    label: 'Premium Investment Strategies',
    description: 'Access to exclusive investment strategies and models',
    icon: Shield,
    category: 'Investments'
  },
  {
    name: 'document_management',
    label: 'Advanced Document Management',
    description: 'Enhanced document storage, sharing, and collaboration',
    icon: FileText,
    category: 'Documents'
  },
  {
    name: 'tax_planning_tools',
    label: 'Tax Planning Tools',
    description: 'Advanced tax planning and optimization tools',
    icon: Calculator,
    category: 'Planning'
  },
  {
    name: 'advisor_portal',
    label: 'Advisor Portal',
    description: 'Advanced advisor tools and client management',
    icon: Settings,
    category: 'Management'
  },
  {
    name: 'premium_support',
    label: 'Premium Support',
    description: 'Priority support and dedicated account management',
    icon: Zap,
    category: 'Support'
  }
];

interface FeatureFlag {
  id: string;
  feature_name: string;
  enabled: boolean;
}

export function FeatureFlagManagement() {
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentTenant } = useTenant();

  const fetchFeatureFlags = async () => {
    if (!currentTenant) return;

    try {
      const { data, error } = await supabase
        .from('tenant_feature_flags')
        .select('*')
        .eq('tenant_id', currentTenant.id);

      if (error) throw error;
      setFeatureFlags(data || []);
    } catch (error) {
      console.error('Error fetching feature flags:', error);
      toast.error('Failed to load feature flags');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatureFlags();
  }, [currentTenant]);

  const toggleFeature = async (featureName: string, enabled: boolean) => {
    if (!currentTenant) return;

    try {
      const { error } = await supabase
        .from('tenant_feature_flags')
        .upsert({
          tenant_id: currentTenant.id,
          feature_name: featureName,
          enabled
        });

      if (error) throw error;

      setFeatureFlags(prev => {
        const existing = prev.find(f => f.feature_name === featureName);
        if (existing) {
          return prev.map(f => 
            f.feature_name === featureName ? { ...f, enabled } : f
          );
        } else {
          return [...prev, {
            id: crypto.randomUUID(),
            feature_name: featureName,
            enabled
          }];
        }
      });

      toast.success(`Feature ${enabled ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      console.error('Error updating feature flag:', error);
      toast.error('Failed to update feature flag');
    }
  };

  const isFeatureEnabled = (featureName: string) => {
    const feature = featureFlags.find(f => f.feature_name === featureName);
    return feature?.enabled || false;
  };

  const groupedFeatures = AVAILABLE_FEATURES.reduce((acc, feature) => {
    if (!acc[feature.category]) {
      acc[feature.category] = [];
    }
    acc[feature.category].push(feature);
    return acc;
  }, {} as Record<string, typeof AVAILABLE_FEATURES>);

  if (isLoading) {
    return <div className="p-6">Loading feature flags...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Flag Management</CardTitle>
        <CardDescription>
          Control which premium features are available for your RIA clients
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(groupedFeatures).map(([category, features]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                {category}
                <Badge variant="outline">{features.length}</Badge>
              </h3>
              <div className="space-y-4">
                {features.map((feature) => {
                  const Icon = feature.icon;
                  const enabled = isFeatureEnabled(feature.name);
                  
                  return (
                    <div key={feature.name} className="flex items-center justify-between border rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-primary" />
                        <div>
                          <Label htmlFor={feature.name} className="text-base font-medium cursor-pointer">
                            {feature.label}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={enabled ? "default" : "secondary"}>
                          {enabled ? "Enabled" : "Disabled"}
                        </Badge>
                        <Switch
                          id={feature.name}
                          checked={enabled}
                          onCheckedChange={(checked) => toggleFeature(feature.name, checked)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}