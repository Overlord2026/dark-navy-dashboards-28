/**
 * Campaign Performance Table Component
 */

import React from 'react';
import { motion } from 'framer-motion';

interface Campaign {
  id: string;
  name: string;
  channel: string;
  startDate: string;
  endDate: string;
  spend: number;
  channelIcon: string;
  channelColor: string;
}

interface CampaignPerformanceTableProps {
  campaigns?: Campaign[];
}

const defaultCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Retirement Planning Q1',
    channel: 'Facebook',
    startDate: 'Jan 14, 2025',
    endDate: 'Mar 14, 2025',
    spend: 5200,
    channelIcon: 'F',
    channelColor: '#1877F2'
  },
  {
    id: '2',
    name: 'HNW Estate Planning',
    channel: 'LinkedIn',
    startDate: 'Jan 31, 2025',
    endDate: 'Apr 29, 2025',
    spend: 6500,
    channelIcon: 'in',
    channelColor: '#0077B5'
  },
  {
    id: '3',
    name: 'Tax Planning Strategies',
    channel: 'Google',
    startDate: 'Feb 28, 2025',
    endDate: 'Apr 14, 2025',
    spend: 3800,
    channelIcon: 'G',
    channelColor: '#4CAF50'
  },
  {
    id: '4',
    name: 'Wealth Transfer',
    channel: 'Facebook',
    startDate: 'Mar 31, 2025',
    endDate: 'Jun 29, 2025',
    spend: 3200,
    channelIcon: 'F',
    channelColor: '#1877F2'
  }
];

export function CampaignPerformanceTable({ campaigns = defaultCampaigns }: CampaignPerformanceTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-4"
    >
      <h3 className="text-white text-xl font-semibold">Campaign Performance</h3>
      
      <div className="bfo-card overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-5 gap-4 p-4 border-b border-white/10 text-white/70 text-sm font-medium">
          <div>Campaign</div>
          <div>Channel</div>
          <div>Start Date</div>
          <div>End Date</div>
          <div>Spend</div>
        </div>
        
        {/* Table Rows */}
        <div className="space-y-0">
          {campaigns.map((campaign, index) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="grid grid-cols-5 gap-4 p-4 border-b border-white/5 hover:bg-white/5 transition-colors"
            >
              <div className="text-white font-medium">
                {campaign.name}
              </div>
              
              <div className="flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: campaign.channelColor }}
                >
                  {campaign.channelIcon}
                </div>
                <span className="text-white/90">{campaign.channel}</span>
              </div>
              
              <div className="text-white/70">{campaign.startDate}</div>
              <div className="text-white/70">{campaign.endDate}</div>
              
              <div className="text-bfo-gold font-medium">
                ${campaign.spend.toLocaleString()}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}