import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTenant } from '@/hooks/useTenant';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, FileText, AlertCircle, CheckCircle } from 'lucide-react';

interface TenantLicense {
  id: string;
  agreement_url?: string | null;
  license_type: 'franchise' | 'license' | 'owned' | null;
  start_date?: string | null;
  end_date?: string | null;
  status: 'pending' | 'active' | 'expired' | 'terminated';
  created_at: string;
}

export const TenantBillingPanel: React.FC = () => {
  const { currentTenant } = useTenant();
  const [licenses, setLicenses] = useState<TenantLicense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentTenant) {
      fetchTenantLicenses();
    }
  }, [currentTenant]);

  const fetchTenantLicenses = async () => {
    if (!currentTenant) return;

    try {
      const { data, error } = await supabase
        .from('tenant_licenses')
        .select('*')
        .eq('tenant_id', currentTenant.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLicenses((data || []).map(license => ({
        ...license,
        license_type: license.license_type as TenantLicense['license_type'],
        status: license.status as TenantLicense['status']
      })));
    } catch (err) {
      console.error('Failed to fetch licenses:', err);
    } finally {
      setLoading(false);
    }
  };

  const getBillingStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'trial':
        return 'bg-blue-100 text-blue-800';
      case 'delinquent':
        return 'bg-red-100 text-red-800';
      case 'suspended':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLicenseStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'terminated':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Billing & Subscription
          </CardTitle>
          <CardDescription>
            Manage your billing information and subscription status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="font-medium">Billing Status</h3>
              <Badge className={getBillingStatusColor(currentTenant?.billing_status || 'trial')}>
                {currentTenant?.billing_status?.toUpperCase() || 'TRIAL'}
              </Badge>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Franchise Type</h3>
              <Badge className="bg-blue-100 text-blue-800">
                {currentTenant?.franchisee_status?.toUpperCase() || 'OWNED'}
              </Badge>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Current Plan</h4>
                <p className="text-sm text-muted-foreground">Professional Plan</p>
              </div>
              <div className="text-right">
                <div className="font-medium">$299/month</div>
                <p className="text-sm text-muted-foreground">Billed monthly</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button>
              <CreditCard className="mr-2 h-4 w-4" />
              Update Payment Method
            </Button>
            <Button variant="outline">
              View Billing History
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            License Agreements
          </CardTitle>
          <CardDescription>
            View and manage your licensing agreements
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading license information...</div>
          ) : licenses.length > 0 ? (
            <div className="space-y-4">
              {licenses.map((license) => (
                <div key={license.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                         <h4 className="font-medium">
                           {license.license_type ? 
                             license.license_type.charAt(0).toUpperCase() + license.license_type.slice(1) + ' Agreement'
                             : 'License Agreement'
                           }
                         </h4>
                        <Badge className={getLicenseStatusColor(license.status)}>
                          {license.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {license.start_date && (
                          <span>Start: {new Date(license.start_date).toLocaleDateString()}</span>
                        )}
                        {license.end_date && (
                          <span className="ml-4">End: {new Date(license.end_date).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {license.status === 'active' && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      {license.status === 'expired' && (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )}
                      {license.agreement_url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={license.agreement_url} target="_blank" rel="noopener noreferrer">
                            View Agreement
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No license agreements found.</p>
              <p className="text-sm">Contact support to set up your licensing agreement.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};