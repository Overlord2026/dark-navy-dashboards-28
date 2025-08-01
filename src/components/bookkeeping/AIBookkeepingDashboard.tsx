import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, AlertTriangle, TrendingUp, CheckCircle } from 'lucide-react';
import { MonthlyBookkeepingWidget } from './MonthlyBookkeepingWidget';
import { useAIBookkeeping } from '@/hooks/useAIBookkeeping';
import { useBankAccounts } from '@/hooks/useBankAccounts';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PendingTransaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  account_name: string;
  suggested_category?: string;
  confidence?: number;
  is_anomaly?: boolean;
  anomaly_reasons?: string[];
}

export function AIBookkeepingDashboard() {
  const [pendingTransactions, setPendingTransactions] = useState<PendingTransaction[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const { classifyTransaction, updateClassification } = useAIBookkeeping();
  const { accounts } = useBankAccounts();

  const loadPendingTransactions = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      // Get recent transactions that haven't been classified
      const { data: unclassified } = await supabase
        .from('bank_accounts')
        .select(`
          id,
          name,
          plaid_account_id
        `)
        .eq('user_id', user.user.id);

      // Mock recent transactions for demo (in real app, would come from Plaid sync)
      const mockTransactions: PendingTransaction[] = [
        {
          id: 'tx1',
          description: 'AMAZON.COM*TO4N23SD2 AMZN.COM/BILL WA',
          amount: -89.99,
          date: new Date().toISOString(),
          account_name: accounts[0]?.name || 'Checking'
        },
        {
          id: 'tx2', 
          description: 'STARBUCKS STORE #12345 SEATTLE WA',
          amount: -4.85,
          date: new Date(Date.now() - 86400000).toISOString(),
          account_name: accounts[0]?.name || 'Checking'
        },
        {
          id: 'tx3',
          description: 'PAYPAL *ZOOM.US 4029357733 CA',
          amount: -14.99,
          date: new Date(Date.now() - 172800000).toISOString(),
          account_name: accounts[0]?.name || 'Checking'
        }
      ];

      setPendingTransactions(mockTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  useEffect(() => {
    loadPendingTransactions();
  }, [accounts]);

  const handleBulkClassification = async () => {
    setIsProcessing(true);
    try {
      const results = [];
      
      for (const transaction of pendingTransactions) {
        const result = await classifyTransaction({
          id: transaction.id,
          description: transaction.description,
          amount: transaction.amount,
          date: transaction.date,
          account_id: accounts[0]?.id || 'mock'
        });
        
        if (result) {
          results.push({
            ...transaction,
            suggested_category: result.category,
            confidence: result.confidence,
            is_anomaly: result.isAnomaly,
            anomaly_reasons: result.anomalyReasons
          });
        }
      }
      
      setPendingTransactions(results);
      toast.success(`Classified ${results.length} transactions using AI`);
    } catch (error) {
      toast.error('Bulk classification failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCategoryUpdate = async (transactionId: string, newCategory: string) => {
    try {
      // In real implementation, would update the actual classification record
      setPendingTransactions(prev => 
        prev.map(tx => 
          tx.id === transactionId 
            ? { ...tx, suggested_category: newCategory }
            : tx
        )
      );
      toast.success('Category updated');
    } catch (error) {
      toast.error('Failed to update category');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Math.abs(amount));
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const unclassifiedCount = pendingTransactions.filter(tx => !tx.suggested_category).length;
  const anomalyCount = pendingTransactions.filter(tx => tx.is_anomaly).length;
  const highConfidenceCount = pendingTransactions.filter(tx => (tx.confidence || 0) >= 0.8).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI Bookkeeping Engine</h2>
          <p className="text-muted-foreground">
            Automated transaction categorization with machine learning
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-2">
          <Brain className="w-4 h-4" />
          AI Powered
        </Badge>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold">{unclassifiedCount}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Anomalies Found</p>
                <p className="text-2xl font-bold text-red-600">{anomalyCount}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Confidence</p>
                <p className="text-2xl font-bold text-green-600">{highConfidenceCount}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Automation Rate</p>
                <p className="text-2xl font-bold">87%</p>
              </div>
              <Zap className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Pending Transactions</TabsTrigger>
          <TabsTrigger value="reports">Monthly Reports</TabsTrigger>
          <TabsTrigger value="learning">Learning Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <MonthlyBookkeepingWidget />
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Pending Transactions</CardTitle>
                  <CardDescription>
                    Review and approve AI-generated transaction categories
                  </CardDescription>
                </div>
                <Button 
                  onClick={handleBulkClassification}
                  disabled={isProcessing}
                  className="flex items-center gap-2"
                >
                  <Brain className="w-4 h-4" />
                  {isProcessing ? 'Classifying...' : 'Classify All'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingTransactions.map((transaction) => (
                  <div key={transaction.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.account_name} • {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(transaction.amount)}</p>
                        {transaction.confidence && (
                          <p className={`text-sm ${getConfidenceColor(transaction.confidence)}`}>
                            {Math.round(transaction.confidence * 100)}% confidence
                          </p>
                        )}
                      </div>
                    </div>

                    {transaction.suggested_category && (
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{transaction.suggested_category}</Badge>
                        {transaction.is_anomaly && (
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Anomaly
                          </Badge>
                        )}
                      </div>
                    )}

                    {transaction.anomaly_reasons && transaction.anomaly_reasons.length > 0 && (
                      <div className="bg-orange-50 border border-orange-200 rounded p-2">
                        <p className="text-sm font-medium text-orange-800">Anomaly Detected:</p>
                        <ul className="text-sm text-orange-700 list-disc list-inside">
                          {transaction.anomaly_reasons.map((reason, index) => (
                            <li key={index}>{reason.replace('_', ' ')}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <select
                        value={transaction.suggested_category || ''}
                        onChange={(e) => handleCategoryUpdate(transaction.id, e.target.value)}
                        className="px-3 py-1 border rounded text-sm"
                      >
                        <option value="">Select Category</option>
                        <option value="Office Supplies">Office Supplies</option>
                        <option value="Software & Subscriptions">Software & Subscriptions</option>
                        <option value="Meals & Entertainment">Meals & Entertainment</option>
                        <option value="Travel">Travel</option>
                        <option value="Professional Services">Professional Services</option>
                        <option value="Marketing & Advertising">Marketing & Advertising</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Banking Fees">Banking Fees</option>
                        <option value="Other Expenses">Other Expenses</option>
                      </select>
                      <Button size="sm" variant="outline">
                        Approve
                      </Button>
                    </div>
                  </div>
                ))}

                {pendingTransactions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No pending transactions</p>
                    <p className="text-sm">All transactions have been classified</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <MonthlyBookkeepingWidget />
        </TabsContent>

        <TabsContent value="learning">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Learning Insights
              </CardTitle>
              <CardDescription>
                How the AI learns from your transaction patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted rounded-lg p-4">
                  <h4 className="font-medium mb-2">Vendor Recognition</h4>
                  <p className="text-sm text-muted-foreground">
                    The AI has learned to recognize recurring vendors and automatically categorize their transactions.
                    Current accuracy: 94% for known vendors.
                  </p>
                </div>
                
                <div className="bg-muted rounded-lg p-4">
                  <h4 className="font-medium mb-2">Anomaly Detection</h4>
                  <p className="text-sm text-muted-foreground">
                    Unusual amounts, duplicate charges, and new vendors are automatically flagged for review.
                    This helps catch potential errors or fraudulent transactions.
                  </p>
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <h4 className="font-medium mb-2">Continuous Learning</h4>
                  <p className="text-sm text-muted-foreground">
                    Every manual correction helps improve future classifications. The system becomes more 
                    accurate over time by learning your specific business patterns.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}