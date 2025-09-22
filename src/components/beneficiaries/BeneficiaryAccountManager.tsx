import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, AlertTriangle, DollarSign, FileText, Plus } from 'lucide-react';
import { BeneficiaryDesignation, BeneficiaryGap } from '@/types/beneficiary-management';
import { analyzeBeneficiaryGaps } from '@/lib/beneficiary/beneficiaryAnalyzer';

interface AccountBeneficiary {
  id: string;
  account_id: string;
  account_name: string;
  account_type: string;
  account_value: number;
  primary_beneficiaries: BeneficiaryDesignation[];
  contingent_beneficiaries: BeneficiaryDesignation[];
  last_updated: string;
}

export const BeneficiaryAccountManager: React.FC = () => {
  const [accounts, setAccounts] = useState<AccountBeneficiary[]>([]);
  const [gaps, setGaps] = useState<BeneficiaryGap[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAccountBeneficiaries();
  }, []);

  const loadAccountBeneficiaries = async () => {
    try {
      // Mock data - would connect to Supabase accounts table
      const mockAccounts: AccountBeneficiary[] = [
        {
          id: '1',
          account_id: '401k-001',
          account_name: 'Company 401(k)',
          account_type: '401k',
          account_value: 485000,
          primary_beneficiaries: [
            {
              id: 'b1',
              account_id: '401k-001',
              beneficiary_type: 'primary',
              beneficiary_name: 'Sarah Johnson',
              relationship: 'spouse',
              percentage: 100,
              per_stirpes: false,
              created_at: '2024-01-15T00:00:00Z',
              updated_at: '2024-01-15T00:00:00Z'
            }
          ],
          contingent_beneficiaries: [],
          last_updated: '2024-01-15'
        },
        {
          id: '2',
          account_id: 'ira-002',
          account_name: 'Traditional IRA',
          account_type: 'traditional_ira',
          account_value: 125000,
          primary_beneficiaries: [],
          contingent_beneficiaries: [],
          last_updated: '2023-08-10'
        },
        {
          id: '3',
          account_id: 'roth-003',
          account_name: 'Roth IRA',
          account_type: 'roth_ira',
          account_value: 89000,
          primary_beneficiaries: [
            {
              id: 'b3',
              account_id: 'roth-003',
              beneficiary_type: 'primary',
              beneficiary_name: 'Michael Johnson',
              relationship: 'child',
              percentage: 50,
              per_stirpes: true,
              date_of_birth: '1995-03-22',
              created_at: '2024-02-01T00:00:00Z',
              updated_at: '2024-02-01T00:00:00Z'
            },
            {
              id: 'b4',
              account_id: 'roth-003',
              beneficiary_type: 'primary',
              beneficiary_name: 'Emily Johnson',
              relationship: 'child',
              percentage: 50,
              per_stirpes: true,
              date_of_birth: '1997-07-14',
              created_at: '2024-02-01T00:00:00Z',
              updated_at: '2024-02-01T00:00:00Z'
            }
          ],
          contingent_beneficiaries: [
            {
              id: 'b5',
              account_id: 'roth-003',
              beneficiary_type: 'contingent',
              beneficiary_name: 'Johnson Family Trust',
              relationship: 'trust',
              percentage: 100,
              trust_name: 'Johnson Family Revocable Trust',
              trust_type: 'revocable',
              per_stirpes: false,
              created_at: '2024-02-01T00:00:00Z',
              updated_at: '2024-02-01T00:00:00Z'
            }
          ],
          last_updated: '2024-02-01'
        }
      ];

      setAccounts(mockAccounts);
      
      // Analyze gaps
      const detectedGaps = await analyzeBeneficiaryGaps(mockAccounts);
      setGaps(detectedGaps);
    } catch (error) {
      console.error('Error loading account beneficiaries:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalDesignatedValue = () => {
    return accounts.reduce((total, account) => {
      return account.primary_beneficiaries.length > 0 ? total + account.account_value : total;
    }, 0);
  };

  const getUndesignatedValue = () => {
    return accounts.reduce((total, account) => {
      return account.primary_beneficiaries.length === 0 ? total + account.account_value : total;
    }, 0);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading beneficiary data...</div>;
  }

  const totalValue = accounts.reduce((sum, acc) => sum + acc.account_value, 0);
  const designatedValue = getTotalDesignatedValue();
  const undesignatedValue = getUndesignatedValue();
  const designationPercentage = totalValue > 0 ? (designatedValue / totalValue) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Assets</p>
                <p className="text-xl font-semibold">${totalValue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-green-600" />
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Designated</p>
                <p className="text-xl font-semibold text-green-600">${designatedValue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Undesignated</p>
                <p className="text-xl font-semibold text-red-600">${undesignatedValue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Completion</p>
                <p className="text-sm font-medium">{designationPercentage.toFixed(1)}%</p>
              </div>
              <Progress value={designationPercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gap Alerts */}
      {gaps.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>{gaps.length} beneficiary issues detected.</strong> Review the gaps below to ensure proper estate planning.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="accounts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="accounts">Account Details</TabsTrigger>
          <TabsTrigger value="gaps">Gap Analysis</TabsTrigger>
          <TabsTrigger value="optimization">Tax Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-4">
          {accounts.map((account) => (
            <Card key={account.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{account.account_name}</CardTitle>
                    <CardDescription>
                      {account.account_type.toUpperCase()} • ${account.account_value.toLocaleString()} • Last updated: {account.last_updated}
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Beneficiary
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Primary Beneficiaries ({account.primary_beneficiaries.length})</h4>
                  {account.primary_beneficiaries.length > 0 ? (
                    <div className="space-y-2">
                      {account.primary_beneficiaries.map((ben) => (
                        <div key={ben.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div>
                            <p className="font-medium">{ben.beneficiary_name}</p>
                            <p className="text-sm text-muted-foreground capitalize">
                              {ben.relationship} • {ben.percentage}% 
                              {ben.per_stirpes && ' • Per Stirpes'}
                              {ben.date_of_birth && ` • Born ${ben.date_of_birth}`}
                            </p>
                          </div>
                          <Badge variant="secondary">{ben.percentage}%</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                      <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No primary beneficiaries designated</p>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-medium mb-2">Contingent Beneficiaries ({account.contingent_beneficiaries.length})</h4>
                  {account.contingent_beneficiaries.length > 0 ? (
                    <div className="space-y-2">
                      {account.contingent_beneficiaries.map((ben) => (
                        <div key={ben.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <p className="font-medium">{ben.beneficiary_name}</p>
                            <p className="text-sm text-muted-foreground capitalize">
                              {ben.relationship} • {ben.percentage}%
                              {ben.trust_name && ` • ${ben.trust_name}`}
                            </p>
                          </div>
                          <Badge variant="outline">{ben.percentage}%</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center p-2">No contingent beneficiaries</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="gaps" className="space-y-4">
          {gaps.map((gap, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium">{gap.account_name}</h3>
                    <p className="text-sm text-muted-foreground">{gap.account_type} • ${gap.account_value.toLocaleString()}</p>
                  </div>
                  <Badge variant={getSeverityColor(gap.severity) as "default" | "destructive" | "secondary"}>
                    {gap.severity}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm">{gap.description}</p>
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Recommendation:</p>
                    <p className="text-sm">{gap.recommendation}</p>
                  </div>
                  {gap.estimated_probate_cost && (
                    <p className="text-sm text-destructive">
                      Estimated probate cost: ${gap.estimated_probate_cost.toLocaleString()}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SECURE Act 10-Year Rule Analysis</CardTitle>
              <CardDescription>Optimization strategies for inherited retirement accounts under the SECURE Act</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Analysis for each account with retirement benefits */}
              {accounts.filter(acc => acc.account_type.includes('401k') || acc.account_type.includes('ira')).map((account) => (
                <div key={account.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{account.account_name}</h4>
                    <Badge variant="secondary">${account.account_value.toLocaleString()}</Badge>
                  </div>
                  
                  {account.primary_beneficiaries.map((ben) => (
                    <div key={ben.id} className="bg-muted p-3 rounded-lg">
                      <p className="font-medium text-sm">{ben.beneficiary_name} ({ben.relationship})</p>
                      <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                        {ben.relationship === 'spouse' ? (
                          <p>✓ Spouse beneficiary: Can roll over to own IRA, not subject to 10-year rule</p>
                        ) : ben.date_of_birth ? (
                          <>
                            <p>• Subject to SECURE Act 10-year distribution rule</p>
                            <p>• Consider Roth conversion strategies to minimize tax impact</p>
                            <p>• Age at inheritance will determine tax bracket optimization</p>
                          </>
                        ) : (
                          <p>⚠️ Birthdate needed for SECURE Act analysis</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};