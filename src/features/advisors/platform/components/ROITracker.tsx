/**
 * ROI Tracker Component - Professional ROI tracking for Advisor Platform
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Target, Users, Calendar, BarChart3 } from 'lucide-react';
import { ROIBanner } from '@/components/ui/ROIBanner';
import { ProfessionalMetricCard } from './ProfessionalMetricCard';
import { useROIData } from '@/hooks/useROIData';
import { formatCurrency } from '../state/roi.mock';

export function ROITracker() {
  const { getROIMetrics, loading } = useROIData();
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const data = await getROIMetrics();
        setMetrics(data);
      } catch (error) {
        console.error('Failed to load ROI metrics:', error);
      }
    };

    loadMetrics();
  }, []);

  if (loading || !metrics) {
    return (
      <div className="min-h-screen bg-bfo-navy-dark p-4 flex items-center justify-center">
        <div className="text-white">Loading ROI metrics...</div>
      </div>
    );
  }

  const roi = metrics.roi || 0;
  const roiFormatted = roi > 0 ? `+${roi.toFixed(1)}%` : `${roi.toFixed(1)}%`;

  return (
    <div className="min-h-screen bg-bfo-navy-dark p-4 space-y-8">
      {/* Hero ROI Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <ROIBanner
          title="Total ROI Performance"
          amount={metrics.totalRevenue || 0}
          timeframe="Last 6 Months"
          description={`${roiFormatted} return on ${formatCurrency(metrics.totalSpend || 0)} invested`}
          variant="highlight"
          icon={<TrendingUp className="h-6 w-6" />}
        />
      </motion.div>

      {/* Key Metrics Grid */}
      <div className="space-y-4">
        <h2 className="text-white text-2xl font-semibold">Performance Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <ProfessionalMetricCard
            title="Total Leads"
            value={metrics.totalLeads.toString()}
            change={`${metrics.totalLeads > 10 ? '+15%' : '+5%'}`}
            changeType="positive"
            subtitle="vs. last period"
            icon={Users}
          />
          <ProfessionalMetricCard
            title="Conversion Rate"
            value={`${metrics.conversionRate.toFixed(1)}%`}
            change={metrics.conversionRate > 15 ? '+3.2%' : '+1.8%'}
            changeType="positive"
            subtitle="vs. last period"
            icon={Target}
          />
          <ProfessionalMetricCard
            title="Total Spend"
            value={formatCurrency(metrics.totalSpend)}
            change="12.5%"
            changeType="positive"
            subtitle="vs. last period"
            icon={DollarSign}
          />
          <ProfessionalMetricCard
            title="Revenue Generated"
            value={formatCurrency(metrics.totalRevenue)}
            change={`${roi > 0 ? '+' : ''}${roi.toFixed(1)}%`}
            changeType={roi > 0 ? "positive" : "negative"}
            subtitle="ROI performance"
            icon={BarChart3}
          />
        </div>
      </div>

      {/* Campaign Performance */}
      <div className="space-y-4">
        <h3 className="text-white text-xl font-semibold">Campaign Performance</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {metrics.campaigns?.slice(0, 4).map((campaign: any, index: number) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="bfo-card p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-white font-medium">{campaign.name}</h4>
                <span className="text-bfo-gold text-sm font-medium">
                  {campaign.source.toUpperCase()}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Spend:</span>
                  <span className="text-white">{formatCurrency(campaign.spend)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Leads:</span>
                  <span className="text-white">
                    {metrics.leads?.filter((l: any) => l.campaign_id === campaign.id).length || 0}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Leads */}
      <div className="space-y-4">
        <h3 className="text-white text-xl font-semibold">Recent Leads</h3>
        <div className="bfo-card">
          <div className="space-y-3">
            {metrics.leads?.slice(0, 5).map((lead: any, index: number) => (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="flex items-center justify-between p-3 rounded-lg bg-bfo-navy-light"
              >
                <div className="flex items-center gap-3">
                  <div className="bfo-icon-container">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {lead.first_name} {lead.last_name}
                    </p>
                    <p className="text-white/60 text-sm">{lead.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-bfo-gold text-sm font-medium capitalize">
                    {lead.stage}
                  </p>
                  <p className="text-white/60 text-xs">
                    {lead.source || 'Direct'}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}