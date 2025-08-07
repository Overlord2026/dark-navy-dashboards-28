import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Plus, BarChart3, DollarSign, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

const sampleAssets = [
  { category: 'Bank Accounts', amount: 125000, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  { category: '401(k)', amount: 450000, color: 'text-green-600', bgColor: 'bg-green-50' },
  { category: 'Brokerage', amount: 280000, color: 'text-purple-600', bgColor: 'bg-purple-50' },
  { category: 'Real Estate', amount: 750000, color: 'text-orange-600', bgColor: 'bg-orange-50' },
  { category: 'Digital Assets', amount: 35000, color: 'text-cyan-600', bgColor: 'bg-cyan-50' }
];

const sampleLiabilities = [
  { category: 'Mortgage', amount: 350000, color: 'text-red-600', bgColor: 'bg-red-50' },
  { category: 'Credit Cards', amount: 8500, color: 'text-pink-600', bgColor: 'bg-pink-50' },
  { category: 'Student Loans', amount: 25000, color: 'text-indigo-600', bgColor: 'bg-indigo-50' }
];

export default function NetWorthPage() {
  const [showPlaidModal, setShowPlaidModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);

  const totalAssets = sampleAssets.reduce((sum, asset) => sum + asset.amount, 0);
  const totalLiabilities = sampleLiabilities.reduce((sum, liability) => sum + liability.amount, 0);
  const netWorth = totalAssets - totalLiabilities;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-primary" />
            Net Worth Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Track your complete financial picture with connected accounts and manual entries
          </p>
        </div>
        <Badge variant="secondary" className="text-sm bg-green-100 text-green-700">
          Free Feature
        </Badge>
      </div>

      {/* Net Worth Summary */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Total Assets</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalAssets)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Total Liabilities</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(totalLiabilities)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Net Worth</p>
              <p className="text-3xl font-bold text-primary">{formatCurrency(netWorth)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Accounts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Your Accounts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <Button 
              onClick={() => setShowPlaidModal(true)}
              className="h-20 flex flex-col items-center justify-center gap-2"
              variant="outline"
            >
              <BarChart3 className="h-6 w-6" />
              <span>Connect via Plaid</span>
              <span className="text-xs text-muted-foreground">Automatic sync</span>
            </Button>
            
            <Button 
              onClick={() => setShowManualModal(true)}
              className="h-20 flex flex-col items-center justify-center gap-2"
              variant="outline"
            >
              <DollarSign className="h-6 w-6" />
              <span>Manual Entry</span>
              <span className="text-xs text-muted-foreground">Add manually</span>
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground text-center mt-4">
            This is optional. You can add accounts later anytime from your dashboard.
          </p>
        </CardContent>
      </Card>

      {/* Assets */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-foreground">Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sampleAssets.map((asset, index) => (
              <motion.div
                key={asset.category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${asset.bgColor} rounded-lg flex items-center justify-center`}>
                    <DollarSign className={`w-6 h-6 ${asset.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{asset.category}</h3>
                    <p className="text-sm text-muted-foreground">Sample data</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{formatCurrency(asset.amount)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Liabilities */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-foreground">Liabilities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sampleLiabilities.map((liability, index) => (
              <motion.div
                key={liability.category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${liability.bgColor} rounded-lg flex items-center justify-center`}>
                    <CreditCard className={`w-6 h-6 ${liability.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{liability.category}</h3>
                    <p className="text-sm text-muted-foreground">Sample data</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-red-600">-{formatCurrency(liability.amount)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Placeholder Modals */}
      {showPlaidModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full mx-4">
            <CardHeader>
              <CardTitle>Connect via Plaid</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Plaid integration will be implemented here. This will allow you to connect your bank accounts securely.
              </p>
              <div className="flex gap-2">
                <Button onClick={() => setShowPlaidModal(false)} variant="outline">
                  Cancel
                </Button>
                <Button onClick={() => setShowPlaidModal(false)}>
                  Coming Soon
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showManualModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full mx-4">
            <CardHeader>
              <CardTitle>Manual Account Entry</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Manual entry form will be implemented here. You'll be able to add accounts by category and value.
              </p>
              <div className="flex gap-2">
                <Button onClick={() => setShowManualModal(false)} variant="outline">
                  Cancel
                </Button>
                <Button onClick={() => setShowManualModal(false)}>
                  Coming Soon
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}