import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Eye, Download, ExternalLink } from 'lucide-react';
import { track } from '@/lib/analytics/track';

interface PublicReportWidgetProps {
  segment?: string;
  style?: {
    bg?: string;
    title_color?: string;
    text_color?: string;
    button_color?: string;
    button_text?: string;
  };
  placement?: 'page' | 'email';
}

export const PublicReportWidget: React.FC<PublicReportWidgetProps> = ({
  segment = 'founding20',
  style = {
    bg: 'black',
    title_color: 'gold',
    text_color: 'white',
    button_color: 'gold',
    button_text: 'View Highlights'
  },
  placement = 'page'
}) => {
  const [reportData, setReportData] = useState({
    title: 'Founding 20 Launch Results',
    subtitle: 'Early engagement metrics from the sports, longevity, and RIA campaigns',
    metrics: [
      { label: 'Organizations Reached', value: '47', change: '+15%' },
      { label: 'Demo Requests', value: '12', change: '+200%' },
      { label: 'Partnership Interest', value: '8', change: 'New' }
    ],
    highlights: [
      'NFL and NBA showing strong partnership interest',
      'Longevity segment exceeding expectations',
      'RIA integration discussions underway'
    ],
    reportUrl: '/founding20/launch-report',
    lastUpdated: '2 hours ago'
  });

  const handleViewReport = () => {
    track('public_report_viewed', {
      segment,
      placement,
      utm_source: placement === 'page' ? 'founding20_page' : 'founding20_email',
      utm_medium: 'cta',
      utm_campaign: 'public_wrapup_report'
    });

    // Open report in new tab
    window.open(reportData.reportUrl, '_blank');
  };

  if (placement === 'email') {
    return (
      <div style={{ 
        backgroundColor: style.bg === 'black' ? '#000000' : '#ffffff',
        padding: '24px',
        borderRadius: '8px',
        margin: '16px 0',
        border: `1px solid ${style.button_color === 'gold' ? '#FFD700' : '#cccccc'}`
      }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ 
            color: style.title_color === 'gold' ? '#FFD700' : style.title_color,
            fontSize: '18px',
            fontWeight: 'bold',
            margin: '0 0 8px 0'
          }}>
            See the Results from the Founding 20
          </h3>
          
          <p style={{
            color: style.text_color === 'white' ? '#ffffff' : style.text_color,
            fontSize: '14px',
            margin: '0 0 16px 0'
          }}>
            Early results are in — see why leading organizations are joining the BFO movement.
          </p>
          
          <div style={{ marginBottom: '16px' }}>
            {reportData.metrics.map((metric, idx) => (
              <div key={idx} style={{ 
                display: 'inline-block',
                margin: '0 8px',
                padding: '4px 8px',
                backgroundColor: style.text_color === 'white' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                borderRadius: '4px',
                fontSize: '12px'
              }}>
                <strong>{metric.value}</strong> {metric.label}
              </div>
            ))}
          </div>
          
          <a
            href={reportData.reportUrl}
            style={{
              backgroundColor: style.button_color === 'gold' ? '#FFD700' : style.button_color,
              color: style.button_color === 'gold' ? '#000000' : '#ffffff',
              padding: '12px 24px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 'bold',
              display: 'inline-block'
            }}
            onClick={() => track('public_report_email_click', { segment, placement })}
          >
            View Launch Highlights
          </a>
        </div>
      </div>
    );
  }

  return (
    <Card className={`bg-black border-gold/30 ${placement === 'page' ? 'mb-8' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-gold" />
            <Badge className="bg-gold text-black">
              Live Results
            </Badge>
            <span className="text-xs text-white/50">
              Updated {reportData.lastUpdated}
            </span>
          </div>
          
          <Button
            onClick={handleViewReport}
            size="sm"
            className="bg-gold text-black hover:bg-gold/90"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            {style.button_text}
          </Button>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-bold text-gold mb-2">
            {reportData.title}
          </h3>
          <p className="text-white/70 text-sm">
            {reportData.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          {reportData.metrics.map((metric, idx) => (
            <div key={idx} className="text-center">
              <div className="text-xl font-bold text-white">
                {metric.value}
              </div>
              <div className="text-xs text-white/70">
                {metric.label}
              </div>
              <div className="text-xs text-green-400">
                {metric.change}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gold">Key Highlights:</h4>
          {reportData.highlights.map((highlight, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm text-white/70">
              <div className="w-2 h-2 bg-gold rounded-full" />
              {highlight}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};