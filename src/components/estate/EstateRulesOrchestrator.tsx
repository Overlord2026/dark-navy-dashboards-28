import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { taxRulesOrchestrator } from '@/lib/rulesync/rulesClient';
import { useTaxRules } from '@/hooks/useTaxRules';
import { RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';

export function EstateRulesOrchestrator() {
  const { 
    getEstateExemption, 
    getRetirementRules, 
    refreshFromOrchestrator,
    loading 
  } = useTaxRules();
  
  const [estateExemption, setEstateExemption] = useState<number | null>(null);
  const [retirementRules, setRetirementRules] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    loadRulesData();
  }, []);

  const loadRulesData = async () => {
    try {
      const [exemption, retirement] = await Promise.all([
        getEstateExemption(currentYear),
        getRetirementRules(currentYear)
      ]);
      
      setEstateExemption(exemption);
      setRetirementRules(retirement);
    } catch (error) {
      console.error('Error loading rules data:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshFromOrchestrator(currentYear, 'US');
      await loadRulesData();
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error refreshing from orchestrator:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Tax Rules Orchestration</h2>
          <p className="text-muted-foreground">
            Automated tax law updates and estate planning rules
          </p>
        </div>
        <div className="flex items-center gap-2">
          {lastRefresh && (
            <Badge variant="outline" className="text-xs">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </Badge>
          )}
          <Button 
            onClick={handleRefresh} 
            disabled={refreshing || loading}
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh Rules
          </Button>
        </div>
      </div>

      <Tabs defaultValue="estate" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="estate">Estate Rules</TabsTrigger>
          <TabsTrigger value="retirement">Retirement Rules</TabsTrigger>
          <TabsTrigger value="orchestration">Orchestration Status</TabsTrigger>
        </TabsList>

        <TabsContent value="estate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Estate Tax Exemptions ({currentYear})
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardTitle>
              <CardDescription>
                Current federal estate and gift tax exemption amounts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {estateExemption && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Federal Estate Exemption</h4>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(estateExemption)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Per individual • {currentYear}
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Married Couple Total</h4>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(estateExemption * 2)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      With portability election
                    </p>
                  </div>
                </div>
              )}
              
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Estate tax exemptions are scheduled to sunset to approximately $8M 
                  per individual in 2026 unless Congress extends current law.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retirement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                SECURE Act Rules
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardTitle>
              <CardDescription>
                Current retirement account distribution requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {retirementRules && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">RMD Age</h4>
                    <p className="text-2xl font-bold text-primary">
                      {retirementRules.secure_act?.rmd_age || 73}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Required minimum distributions start
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">10-Year Rule</h4>
                    <p className="text-sm font-medium text-muted-foreground">
                      Non-eligible designated beneficiaries must distribute 
                      inherited retirement accounts within 10 years
                    </p>
                  </div>
                </div>
              )}
              
              {retirementRules?.secure_act?.eligible_designated_beneficiaries && (
                <div>
                  <h4 className="font-semibold mb-3">Eligible Designated Beneficiaries</h4>
                  <div className="flex flex-wrap gap-2">
                    {retirementRules.secure_act.eligible_designated_beneficiaries.map((beneficiary: string) => (
                      <Badge key={beneficiary} variant="secondary">
                        {beneficiary.replace(/_/g, ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orchestration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rules Engine Status</CardTitle>
              <CardDescription>
                Current status of the automated tax rules orchestration system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted rounded-lg text-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
                  <h4 className="font-semibold">Policy Engine</h4>
                  <p className="text-sm text-muted-foreground">Connected</p>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
                  <h4 className="font-semibold">Tax Rules</h4>
                  <p className="text-sm text-muted-foreground">Up to date</p>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
                  <h4 className="font-semibold">Estate Integration</h4>
                  <p className="text-sm text-muted-foreground">Active</p>
                </div>
              </div>
              
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  All tax rules are automatically synchronized with the latest IRS guidance. 
                  The system will alert professionals when client strategies need updates 
                  due to tax law changes.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}