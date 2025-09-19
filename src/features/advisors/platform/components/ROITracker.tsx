/**
 * ROI Tracker Component - Professional ROI tracking for Advisor Platform
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Target, Users, Calendar, BarChart3 } from 'lucide-react';
import { ROIBanner } from '@/components/ui/ROIBanner';
import { ProfessionalMetricCard } from './ProfessionalMetricCard';
import { MarketingROITracker } from './MarketingROITracker';
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

  // Show the enhanced Marketing ROI Tracker
  return <MarketingROITracker />;
}