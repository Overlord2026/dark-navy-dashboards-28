import { useState } from 'react';
import { DrilldownData } from '../types';
import { useDrilldownTransactions } from '../api/cashFlowApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { X, ExternalLink, TrendingUp, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DrilldownPanelProps {
  period: string;
  categoryBreakdown: DrilldownData[];
  merchantBreakdown: DrilldownData[];
  selectedCategory?: string;
  selectedMerchant?: string;
  onClose: () => void;
}

export function DrilldownPanel({ 
  period, 
  categoryBreakdown, 
  merchantBreakdown, 
  selectedCategory, 
  selectedMerchant,
  onClose 
}: DrilldownPanelProps) {
  const [activeTab, setActiveTab] = useState('categories');
  const navigate = useNavigate();

  const drilldownFilters = {
    period,
    categoryId: selectedCategory,
    merchantId: selectedMerchant
  };

  const { data: transactions = [] } = useDrilldownTransactions(drilldownFilters);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleViewAllTransactions = () => {
    const params = new URLSearchParams();
    if (selectedCategory) params.set('categoryId', selectedCategory);
    if (selectedMerchant) params.set('merchantId', selectedMerchant);
    params.set('period', period);
    
    navigate(`/transactions?${params.toString()}`);
  };

  const getTotalAmount = () => {
    return transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Cash Flow Breakdown
            {(selectedCategory || selectedMerchant) && (
              <Badge variant="secondary">
                {selectedCategory ? 'Category Filter' : 'Merchant Filter'}
              </Badge>
            )}
          </CardTitle>
          
          <div className="flex items-center gap-2">
            {transactions.length > 0 && (
              <Button variant="outline" size="sm" onClick={handleViewAllTransactions} className="gap-2">
                <ExternalLink className="h-4 w-4" />
                View in Transactions
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="categories">By Category</TabsTrigger>
            <TabsTrigger value="merchants">By Merchant</TabsTrigger>
          </TabsList>
          
          <TabsContent value="categories" className="space-y-4">
            <div className="space-y-3">
              {categoryBreakdown.slice(0, 10).map((category, index) => (
                <div key={category.categoryId} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{category.categoryName}</div>
                      <div className="text-sm text-muted-foreground">
                        {category.transactionCount} transactions
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-mono font-medium">
                      {formatCurrency(category.amount)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {((category.amount / getTotalFromBreakdown(categoryBreakdown)) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="merchants" className="space-y-4">
            <div className="space-y-3">
              {merchantBreakdown.slice(0, 10).map((merchant, index) => (
                <div key={merchant.merchantId} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{merchant.merchantName}</div>
                      <div className="text-sm text-muted-foreground">
                        {merchant.transactionCount} transactions
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-mono font-medium">
                      {formatCurrency(merchant.amount)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {((merchant.amount / getTotalFromBreakdown(merchantBreakdown)) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Filtered Transactions Preview */}
        {transactions.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">
                Filtered Transactions ({transactions.length})
              </h4>
              <Badge variant="outline">
                Total: {formatCurrency(getTotalAmount())}
              </Badge>
            </div>
            
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.slice(0, 5).map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {new Date(transaction.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-medium">
                        {transaction.merchantName}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {transaction.categoryName}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        <span className={transaction.amount < 0 ? 'text-destructive' : 'text-success'}>
                          {transaction.amount < 0 ? '-' : ''}
                          {formatCurrency(Math.abs(transaction.amount))}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {transactions.length > 5 && (
                <div className="p-3 border-t text-center">
                  <Button variant="ghost" size="sm" onClick={handleViewAllTransactions}>
                    View all {transactions.length} transactions
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function getTotalFromBreakdown(breakdown: DrilldownData[]): number {
  return breakdown.reduce((sum, item) => sum + item.amount, 0);
}