import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Plus, RotateCcw, MapPin, Calendar, DollarSign } from 'lucide-react';
import { recordGoalRDS } from '@/lib/rds';

interface BucketItem {
  id: string;
  title: string;
  cost: number;
  priority: 'high' | 'medium' | 'low';
}

const SAMPLE_ROADMAP = {
  projectedPortfolioValue: 2850000,
  retirementDate: '2035-06-15',
  successProbability: 89,
  monthlyIncome: 12500,
  riskScore: 'Moderate',
  rebalanceDate: '2025-03-01'
};

export default function RetireeBucketDemo() {
  const [bucketList, setBucketList] = useState<BucketItem[]>([
    { id: '1', title: 'European River Cruise', cost: 8500, priority: 'high' },
    { id: '2', title: 'Visit Grandchildren in Seattle', cost: 2000, priority: 'high' },
    { id: '3', title: 'Kitchen Renovation', cost: 25000, priority: 'medium' }
  ]);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', cost: '' });

  const addBucketItem = useCallback(() => {
    if (!newItem.title || !newItem.cost) return;
    
    const item: BucketItem = {
      id: Date.now().toString(),
      title: newItem.title,
      cost: parseFloat(newItem.cost),
      priority: 'medium'
    };
    
    setBucketList(prev => [...prev, item]);
    setNewItem({ title: '', cost: '' });
  }, [newItem]);

  const generateRoadmap = useCallback(() => {
    // Emit demo receipt
    const demoReceipt = {
      flow_name: 'retiree_bucket_roadmap',
      timestamp: new Date().toISOString(),
      demo_id: `demo_${Date.now()}`,
      bucket_items_count: bucketList.length,
      total_bucket_cost: bucketList.reduce((sum, item) => sum + item.cost, 0)
    };

    // Record RDS (content-free)
    recordGoalRDS(demoReceipt);

    setShowRoadmap(true);
    toast.success("Roadmap ready (demo)");
  }, [bucketList]);

  const resetDemo = useCallback(() => {
    setBucketList([
      { id: '1', title: 'European River Cruise', cost: 8500, priority: 'high' },
      { id: '2', title: 'Visit Grandchildren in Seattle', cost: 2000, priority: 'high' },
      { id: '3', title: 'Kitchen Renovation', cost: 25000, priority: 'medium' }
    ]);
    setShowRoadmap(false);
    setNewItem({ title: '', cost: '' });
    toast.info("Demo reset");
  }, []);

  const totalCost = bucketList.reduce((sum, item) => sum + item.cost, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Retiree Bucket List Planner
          </h1>
          <p className="text-lg text-muted-foreground">
            Plan your retirement dreams and see how they fit into your financial roadmap
          </p>
          <Button onClick={resetDemo} variant="outline" size="sm">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Demo
          </Button>
        </div>

        {!showRoadmap ? (
          <>
            {/* Bucket List Builder */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Your Retirement Bucket List
                </CardTitle>
                <CardDescription>
                  Add experiences and goals you want to achieve in retirement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add new item */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/5">
                  <div className="space-y-2">
                    <Label htmlFor="title">Experience or Goal</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Trip to Japan"
                      value={newItem.title}
                      onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cost">Estimated Cost</Label>
                    <Input
                      id="cost"
                      type="number"
                      placeholder="0"
                      value={newItem.cost}
                      onChange={(e) => setNewItem(prev => ({ ...prev, cost: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={addBucketItem} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </div>
                </div>

                {/* Bucket list items */}
                <div className="space-y-3">
                  {bucketList.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/5">
                      <div>
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">Priority: {item.priority}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${item.cost.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total Bucket List Cost:</span>
                    <span className="text-primary">${totalCost.toLocaleString()}</span>
                  </div>
                </div>

                {/* Generate Roadmap Button */}
                <Button onClick={generateRoadmap} size="lg" className="w-full">
                  <Calendar className="h-5 w-5 mr-2" />
                  Generate My Retirement Roadmap
                </Button>
              </CardContent>
            </Card>
          </>
        ) : (
          /* Roadmap View */
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Your Retirement Roadmap (Demo)
              </CardTitle>
              <CardDescription>
                Based on your bucket list and current financial situation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Success Probability</p>
                  <p className="text-2xl font-bold text-green-600">{SAMPLE_ROADMAP.successProbability}%</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Projected Portfolio</p>
                  <p className="text-2xl font-bold">${SAMPLE_ROADMAP.projectedPortfolioValue.toLocaleString()}</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Monthly Income</p>
                  <p className="text-2xl font-bold">${SAMPLE_ROADMAP.monthlyIncome.toLocaleString()}</p>
                </div>
              </div>

              {/* Bucket List Affordability */}
              <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                  ✅ Your bucket list is affordable!
                </h3>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Total cost of ${totalCost.toLocaleString()} represents only {((totalCost / SAMPLE_ROADMAP.projectedPortfolioValue) * 100).toFixed(1)}% 
                  of your projected retirement portfolio.
                </p>
              </div>

              {/* Timeline */}
              <div className="space-y-3">
                <h3 className="font-semibold">Recommended Timeline</h3>
                {bucketList.map((item, index) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Year {index + 1} of retirement
                      </p>
                    </div>
                    <p className="font-semibold">${item.cost.toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Button onClick={() => setShowRoadmap(false)} variant="outline" className="flex-1">
                  Edit Bucket List
                </Button>
                <Button onClick={resetDemo} variant="outline" className="flex-1">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Start Over
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}