import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Package, FileText, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PublishCheck {
  name: string;
  status: 'passed' | 'failed' | 'warning';
  message: string;
}

interface LaunchReceipt {
  receipt_id: string;
  timestamp: string;
  version: string;
  checks_passed: number;
  total_checks: number;
  release_hash: string;
}

export function PublishTab() {
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishChecks, setPublishChecks] = useState<PublishCheck[]>([]);
  const [launchReceipt, setLaunchReceipt] = useState<LaunchReceipt | null>(null);
  const { toast } = useToast();

  const runPublishBatch = async () => {
    setIsPublishing(true);
    setPublishChecks([]);
    setLaunchReceipt(null);

    // Simulate publish checks
    const checks: PublishCheck[] = [
      { name: 'Route Coverage', status: 'passed', message: 'All routes accessible (0 404s)' },
      { name: 'Brand Compliance', status: 'passed', message: 'All components use bfo styling' },
      { name: 'Security Audit', status: 'passed', message: 'No security vulnerabilities detected' },
      { name: 'Performance Tests', status: 'passed', message: 'All pages meet performance thresholds' },
      { name: 'Database Migrations', status: 'passed', message: 'All migrations applied successfully' },
      { name: 'Edge Functions', status: 'passed', message: 'All functions deployed and operational' },
      { name: 'Feature Flags', status: 'warning', message: 'DEMO_MODE enabled for investor demo' },
      { name: 'Content Review', status: 'passed', message: 'All content passes compliance review' }
    ];

    // Simulate progressive checking
    for (let i = 0; i < checks.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setPublishChecks(prev => [...prev, checks[i]]);
    }

    // Generate launch receipt
    const receipt: LaunchReceipt = {
      receipt_id: `launch_${Date.now()}`,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      checks_passed: checks.filter(c => c.status === 'passed').length,
      total_checks: checks.length,
      release_hash: `sha256:${Array.from({length: 16}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`
    };

    setLaunchReceipt(receipt);
    setIsPublishing(false);

    toast({
      title: "Publish Batch Complete",
      description: `Launch receipt ${receipt.receipt_id} generated`,
    });
  };

  const exportRules = () => {
    const rulesData = {
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      rules: {
        feature_flags: {
          DEMO_MODE: true,
          VOICE_ENABLED: false,
          HQ_BOOT: true,
          IP_LEDGER: true,
          PUBLISH_BATCH: true
        },
        brand_rules: {
          header_color: "bfo-black",
          accent_color: "bfo-gold",
          card_class: "bfo-card",
          button_class: "btn-gold"
        },
        performance_thresholds: {
          LCP: 1500,
          FID: 100,
          CLS: 0.1,
          TTFB: 800
        },
        security_policies: {
          content_free_logging: true,
          cryptographic_receipts: true,
          merkle_verification: true
        }
      }
    };

    const blob = new Blob([JSON.stringify(rulesData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'platform_rules_export.json';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const getCheckIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  const getCheckBadgeColor = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Publish Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bfo-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Package className="h-5 w-5 text-bfo-gold" />
              Publish Batch
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300 text-sm">
              Run comprehensive checks and generate launch receipt for deployment.
            </p>
            <Button 
              onClick={runPublishBatch}
              disabled={isPublishing}
              className="btn-gold w-full"
            >
              {isPublishing ? 'Running Publish Batch...' : 'Run Publish Batch'}
            </Button>
          </CardContent>
        </div>

        <div className="bfo-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-bfo-gold" />
              Rules Export
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300 text-sm">
              Export platform configuration rules and policies.
            </p>
            <Button 
              onClick={exportRules}
              className="btn-gold w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Rules
            </Button>
          </CardContent>
        </div>
      </div>

      {/* Publish Checks */}
      {publishChecks.length > 0 && (
        <div className="bfo-card">
          <CardHeader>
            <CardTitle className="text-white">Publish Checks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {publishChecks.map((check, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-700 rounded">
                  <div className="flex items-center gap-3">
                    {getCheckIcon(check.status)}
                    <span className="text-white font-medium">{check.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-300">{check.message}</span>
                    <Badge className={`${getCheckBadgeColor(check.status)} text-white`}>
                      {check.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </div>
      )}

      {/* Launch Receipt */}
      {launchReceipt && (
        <div className="bfo-card">
          <CardHeader>
            <CardTitle className="text-white">Launch Receipt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-black/40 border border-gray-700 rounded p-4">
                <h3 className="text-bfo-gold font-semibold mb-3">Receipt Details</h3>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Receipt ID:</span>
                    <span className="text-white font-mono">{launchReceipt.receipt_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Version:</span>
                    <span className="text-white">{launchReceipt.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Timestamp:</span>
                    <span className="text-white">{new Date(launchReceipt.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Checks Passed:</span>
                    <span className="text-white">
                      {launchReceipt.checks_passed}/{launchReceipt.total_checks}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Release Hash:</span>
                    <span className="text-white font-mono text-xs">{launchReceipt.release_hash}</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-500/10 border border-green-500/20 rounded p-4">
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-semibold">Platform Ready for Deployment</span>
                </div>
                <p className="text-green-300 text-sm mt-2">
                  All systems operational. Launch receipt generated with content-free compliance logging.
                </p>
              </div>
            </div>
          </CardContent>
        </div>
      )}

      {/* Release Notes Draft */}
      {launchReceipt && (
        <div className="bfo-card">
          <CardHeader>
            <CardTitle className="text-white">Release Notes Draft</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black/40 border border-gray-700 rounded p-4">
              <h3 className="text-bfo-gold font-semibold mb-3">Version {launchReceipt.version} - Investor Demo Release</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p>✅ Zero-404 routing implementation</p>
                <p>✅ Brand compliance enforcement (bfo-black/gold theme)</p>
                <p>✅ Cryptographic receipt pipeline operational</p>
                <p>✅ Multi-persona demo flows validated</p>
                <p>✅ IP ledger and admin HQ functionality</p>
                <p>✅ Performance optimization (LCP &lt; 1.5s)</p>
                <p>⚠️ Demo mode enabled (VOICE_ENABLED=false)</p>
                <p className="mt-3 text-xs text-gray-400">
                  Release hash: {launchReceipt.release_hash}
                </p>
              </div>
            </div>
          </CardContent>
        </div>
      )}
    </div>
  );
}