/**
 * Marketing ROI Tracker Component - Main tracker interface
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, BarChart3, RefreshCw, Upload, DollarSign, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TimeRangeSelector } from './TimeRangeSelector';
import { ROICharts } from './ROICharts';
import { CampaignPerformanceTable } from './CampaignPerformanceTable';
import { ProfessionalMetricCard } from './ProfessionalMetricCard';
import { useROIData } from '@/hooks/useROIData';

export function MarketingROITracker() {
  const [selectedRange, setSelectedRange] = useState('last30');
  const [activeTab, setActiveTab] = useState('templates');
  const { getROIMetrics } = useROIData();
  const [metrics, setMetrics] = useState<any>(null);

  React.useEffect(() => {
    const loadMetrics = async () => {
      try {
        const data = await getROIMetrics();
        setMetrics(data);
      } catch (error) {
        console.error('Failed to load ROI metrics:', error);
      }
    };

    loadMetrics();
  }, [selectedRange]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-bfo-navy-dark p-4 space-y-8">
      {/* Header with gold styling */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-bfo-navy-dark p-6 rounded-lg"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Marketing ROI Tracker</h1>
            <p className="text-white/70 text-lg">
              Track and analyze your marketing campaign performance and sales conversion metrics
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button className="bfo-btn-outline flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
            <Button className="bfo-btn-gold flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Refresh Data
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Time Range Selector */}
      <TimeRangeSelector 
        selectedRange={selectedRange}
        onRangeChange={setSelectedRange}
      />

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex gap-6"
      >
        <button
          className={`text-lg font-medium pb-2 border-b-2 transition-colors ${
            activeTab === 'templates' 
              ? 'text-white border-bfo-gold' 
              : 'text-white/60 border-transparent hover:text-white/80'
          }`}
          onClick={() => setActiveTab('templates')}
        >
          Templates
        </button>
        <button
          className={`text-lg font-medium pb-2 border-b-2 transition-colors ${
            activeTab === 'datasources' 
              ? 'text-white border-bfo-gold' 
              : 'text-white/60 border-transparent hover:text-white/80'
          }`}
          onClick={() => setActiveTab('datasources')}
        >
          Data Sources
        </button>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="flex flex-wrap gap-4"
      >
        <Button className="bfo-btn-outline flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Data
        </Button>
        <Button className="bfo-btn-outline flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Import Data
        </Button>
        <Button className="bfo-btn-outline flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Customize Template
        </Button>
        <Button className="bfo-btn-outline">
          Copy Template
        </Button>
      </motion.div>

      {/* ROI Summary */}
      {metrics && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-4"
        >
          <h2 className="text-white text-2xl font-semibold">ROI Summary</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfessionalMetricCard
              title="Total Ad Spend"
              value={formatCurrency(metrics.totalSpend)}
              change="12.5%"
              changeType="positive"
              subtitle="vs. previous"
              icon={DollarSign}
            />
            
            <ProfessionalMetricCard
              title="Conversion Rate"
              value={`${metrics.conversionRate.toFixed(1)}%`}
              change="2.3%"
              changeType="positive"
              subtitle="vs. previous"
              icon={Percent}
            />
          </div>
        </motion.div>
      )}

      {/* Charts */}
      <ROICharts />

      {/* Campaign Performance Table */}
      <CampaignPerformanceTable />
    </div>
  );
}