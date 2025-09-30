import React from 'react';
import { Clock, Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { getFlag } from '@/config/flags';
import { LegacyReceiptChip } from '@/components/families/ReceiptChip';
import { FamiliesReadinessButton } from '@/components/families/FamiliesReadinessButton';

export function DashboardWidgets() {
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
      {/* Recent Actions Widget - Enhanced with Receipt Chips */}
      <div className="bfo-card bfo-no-blur">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-bfo-gold" />
          <h3 className="text-lg font-semibold text-white">Recent Actions</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div>
              <div className="font-medium text-white">Onboarding Completed</div>
              <div className="text-sm text-white/60">Family profile setup finished</div>
            </div>
            <LegacyReceiptChip 
              hash="sha256:9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d"
              anchored={true}
              policyVersion="K-2025.09"
            />
          </div>
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div>
              <div className="font-medium text-white">Wealth Overview Accessed</div>
              <div className="text-sm text-white/60">Portfolio data synchronized</div>
            </div>
            <LegacyReceiptChip 
              hash="sha256:a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2"
              anchored={true}
              policyVersion="K-2025.09"
            />
          </div>
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div>
              <div className="font-medium text-white">Policy Evaluation</div>
              <div className="text-sm text-white/60">Latest compliance check</div>
            </div>
            <LegacyReceiptChip 
              hash="sha256:b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3"
              anchored={false}
              policyVersion="K-2025.09"
            />
          </div>
        </div>
      </div>

      {/* System Readiness Widget - Enhanced with Run Readiness Button */}
      <div className="bfo-card bfo-no-blur">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-bfo-gold" />
          <h3 className="text-lg font-semibold text-white">System Readiness</h3>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getReadinessColor('green')}`}>
                <CheckCircle className="h-3 w-3 mr-1" />
                Security
              </div>
            </div>
            <div className="text-center">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getReadinessColor('green')}`}>
                <CheckCircle className="h-3 w-3 mr-1" />
                Compliance
              </div>
            </div>
            <div className="text-center">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getReadinessColor('amber')}`}>
                <AlertTriangle className="h-3 w-3 mr-1" />
                Performance
              </div>
            </div>
            <div className="text-center">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getReadinessColor('green')}`}>
                <CheckCircle className="h-3 w-3 mr-1" />
                Anchoring
              </div>
            </div>
          </div>
          <FamiliesReadinessButton />
        </div>
      </div>
    </div>
  );
}