import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ReceiptChip } from '@/components/receipts/ReceiptChip';
import { getFlag } from '@/lib/flags';
import { callEdgeJSON } from '@/services/aiEdge';
import { Clock, Activity, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface RecentAction {
  id: string;
  action: string;
  timestamp: string;
  receipt_hash: string;
  anchored: boolean;
}

interface ReadinessStatus {
  status: 'green' | 'amber' | 'red';
  score: number;
  issues: string[];
}

export function DashboardWidgets() {
  const [recentActions] = useState<RecentAction[]>([
    {
      id: '1',
      action: 'Added retirement goal',
      timestamp: '2 hours ago',
      receipt_hash: 'sha256:a1b2c3d4',
      anchored: true
    },
    {
      id: '2', 
      action: 'Updated emergency fund',
      timestamp: '1 day ago',
      receipt_hash: 'sha256:f6e5d4c3',
      anchored: false
    },
    {
      id: '3',
      action: 'Reviewed insurance policy',
      timestamp: '3 days ago', 
      receipt_hash: 'sha256:9876543a',
      anchored: true
    }
  ]);

  const [readinessStatus, setReadinessStatus] = useState<ReadinessStatus | null>(null);
  const [isRunningReadiness, setIsRunningReadiness] = useState(false);

  const runReadinessCheck = async () => {
    setIsRunningReadiness(true);
    try {
      const result = await callEdgeJSON('policy-eval', {
        action: 'readiness_check',
        family_id: 'current_family',
        timestamp: new Date().toISOString()
      });

      // Simulate readiness scoring based on receipt
      const score = Math.floor(Math.random() * 100);
      let status: 'green' | 'amber' | 'red';
      let issues: string[] = [];

      if (score >= 80) {
        status = 'green';
      } else if (score >= 60) {
        status = 'amber';
        issues = ['Missing emergency fund documentation', 'Insurance review overdue'];
      } else {
        status = 'red';
        issues = ['No recent goal updates', 'Missing vault documents', 'Tax planning needed'];
      }

      setReadinessStatus({ status, score, issues });
    } catch (error) {
      console.error('Readiness check failed:', error);
      setReadinessStatus({ 
        status: 'red', 
        score: 0, 
        issues: ['System error - please try again'] 
      });
    } finally {
      setIsRunningReadiness(false);
    }
  };

  const getReadinessIcon = (status: string) => {
    switch (status) {
      case 'green': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'amber': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'red': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getReadinessColor = (status: string) => {
    switch (status) {
      case 'green': return 'bg-green-500/20 border-green-500/30 text-green-400';
      case 'amber': return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400';
      case 'red': return 'bg-red-500/20 border-red-500/30 text-red-400';
      default: return 'bg-gray-500/20 border-gray-500/30 text-gray-400';
    }
  };

  if (!getFlag('FAM_V1')) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Recent Actions Widget */}
      <div className="bfo-card bfo-no-blur">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-bfo-gold" />
          <h3 className="text-lg font-semibold text-white">Recent Actions</h3>
        </div>
        <div className="space-y-3">
          {recentActions.map((action) => (
            <div key={action.id} className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-bfo-gold/10">
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{action.action}</p>
                <p className="text-white/60 text-xs">{action.timestamp}</p>
              </div>
              <ReceiptChip 
                hash={action.receipt_hash} 
                anchored={action.anchored}
                className="ml-3"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Readiness Check Widget */}
      <div className="bfo-card bfo-no-blur">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-5 w-5 text-bfo-gold" />
          <h3 className="text-lg font-semibold text-white">Family Readiness</h3>
        </div>
        
        {!readinessStatus ? (
          <div className="text-center py-4">
            <p className="text-white/60 text-sm mb-4">
              Check your family's financial planning readiness
            </p>
            <Button 
              onClick={runReadinessCheck}
              disabled={isRunningReadiness}
              className="btn-gold"
            >
              {isRunningReadiness ? 'Running Check...' : 'Run Readiness Check'}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full border ${getReadinessColor(readinessStatus.status)}`}>
              {getReadinessIcon(readinessStatus.status)}
              <span className="text-sm font-medium capitalize">{readinessStatus.status}</span>
              <span className="text-xs">({readinessStatus.score}%)</span>
            </div>
            
            {readinessStatus.issues.length > 0 && (
              <div className="mt-3">
                <p className="text-white/80 text-xs font-medium mb-2">Action Items:</p>
                <ul className="space-y-1">
                  {readinessStatus.issues.map((issue, index) => (
                    <li key={index} className="text-white/60 text-xs flex items-center gap-2">
                      <span className="w-1 h-1 bg-bfo-gold rounded-full flex-shrink-0"></span>
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <Button 
              onClick={() => setReadinessStatus(null)}
              variant="outline"
              size="sm"
              className="mt-2 text-xs"
            >
              Run Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}