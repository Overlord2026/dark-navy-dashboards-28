import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, MapPin, Calendar, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { callEdgeJSON } from '@/services/aiEdge';

interface BucketListItem {
  id: string;
  title: string;
  description: string;
  estimatedCost: number;
  timeframe: string;
  location: string;
  completed?: boolean;
}

const bucketListItems: BucketListItem[] = [
  {
    id: '1',
    title: 'European River Cruise',
    description: 'Luxury cruise through Rhine and Danube rivers',
    estimatedCost: 15000,
    timeframe: 'Spring 2024',
    location: 'Europe'
  },
  {
    id: '2', 
    title: 'Grandchildren Education Fund',
    description: 'Set up 529 plans for all grandchildren',
    estimatedCost: 100000,
    timeframe: 'Immediate',
    location: 'USA'
  },
  {
    id: '3',
    title: 'Vineyard Investment',
    description: 'Purchase and develop boutique winery',
    estimatedCost: 500000,
    timeframe: '2025-2026',
    location: 'Napa Valley'
  }
];

export function RetireeDemo() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [receiptId, setReceiptId] = useState<string | null>(null);

  const toggleItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const generateRoadmap = async () => {
    if (selectedItems.length === 0) {
      toast.error('Please select at least one bucket list item');
      return;
    }

    setIsProcessing(true);
    try {
      const selectedBucketItems = bucketListItems.filter(item => selectedItems.includes(item.id));
      const totalCost = selectedBucketItems.reduce((sum, item) => sum + item.estimatedCost, 0);
      
      const response = await callEdgeJSON('decision-rds', {
        action: 'retirement_roadmap',
        inputs: {
          user_id: 'demo-retiree',
          bucket_list: selectedBucketItems,
          total_estimated_cost: totalCost,
          goals: selectedBucketItems.map(item => item.title)
        },
        policy_version: 'v1.0'
      });

      if (response.receipt_id) {
        setReceiptId(response.receipt_id);
        toast.success('Retirement roadmap generated successfully!', {
          description: `Receipt ID: ${response.receipt_id}`,
          action: {
            label: 'View Receipt',
            onClick: () => window.open(`/receipts/${response.receipt_id}`, '_blank')
          }
        });
      }
    } catch (error) {
      console.error('Failed to generate roadmap:', error);
      toast.error('Failed to generate retirement roadmap');
    } finally {
      setIsProcessing(false);
    }
  };

  const totalCost = bucketListItems
    .filter(item => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + item.estimatedCost, 0);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Retirement Bucket List Planner</h2>
        <p className="text-white/80">Select your retirement goals and we'll create a personalized roadmap</p>
      </div>

      <div className="grid gap-6 mb-8">
        {bucketListItems.map((item) => (
          <Card 
            key={item.id} 
            className={`bfo-card cursor-pointer transition-all duration-200 ${
              selectedItems.includes(item.id) ? 'ring-2 ring-[#D4AF37]' : ''
            }`}
            onClick={() => toggleItem(item.id)}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <CheckCircle 
                  className={`h-6 w-6 ${
                    selectedItems.includes(item.id) ? 'text-[#D4AF37]' : 'text-gray-400'
                  }`}
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-white/70 mb-4">{item.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-[#D4AF37]" />
                    <span>${item.estimatedCost.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#D4AF37]" />
                    <span>{item.timeframe}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#D4AF37]" />
                    <span>{item.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selectedItems.length > 0 && (
        <Card className="bfo-card mb-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Selected Goals Summary</h3>
            <p className="text-2xl font-bold text-[#D4AF37] mb-4">
              Total Estimated Cost: ${totalCost.toLocaleString()}
            </p>
            <p className="text-white/70 mb-6">
              {selectedItems.length} goal{selectedItems.length !== 1 ? 's' : ''} selected
            </p>
            <Button 
              className="btn-gold px-8 py-3 text-lg"
              onClick={generateRoadmap}
              disabled={isProcessing}
            >
              {isProcessing ? 'Generating Roadmap...' : 'Generate Retirement Roadmap'}
            </Button>
          </div>
        </Card>
      )}

      {receiptId && (
        <Card className="bfo-card">
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Roadmap Generated Successfully!</h3>
            <p className="text-white/70 mb-4">
              Your personalized retirement roadmap has been created and saved to your vault.
            </p>
            <div className="bg-black/50 rounded-lg p-4 mb-4">
              <p className="text-sm text-white/60">Receipt ID:</p>
              <p className="font-mono text-[#D4AF37]">{receiptId}</p>
            </div>
            <Button 
              variant="outline" 
              className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black"
              onClick={() => window.open(`/receipts/${receiptId}`, '_blank')}
            >
              View Receipt Details
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}