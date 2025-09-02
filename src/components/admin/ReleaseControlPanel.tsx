import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, CheckCircle, XCircle, Rocket, RotateCcw } from 'lucide-react';
import { PublishBatchController } from '@/release/PublishBatchController';
import { RollbackManager } from '@/release/RollbackManager';
import { ReadinessStatus } from '@/release/ReadinessChecker';
import { toast } from '@/lib/toast';

export function ReleaseControlPanel() {
  const [releaseStatus, setReleaseStatus] = useState<'idle' | 'checking' | 'releasing' | 'complete' | 'blocked'>('idle');
  const [readinessData, setReadinessData] = useState<ReadinessStatus | null>(null);
  const [releaseResult, setReleaseResult] = useState<any>(null);
  const [rollbackAvailable, setRollbackAvailable] = useState(false);

  const publishController = new PublishBatchController();
  const rollbackManager = new RollbackManager();

  const handleInitiateRelease = async () => {
    setReleaseStatus('checking');
    try {
      const result = await publishController.executeGatedPublish();
      setReadinessData(result.readiness);
      setReleaseResult(result);
      setRollbackAvailable(result.rollback_ready);
      
      if (result.status === 'GREEN') {
        setReleaseStatus('complete');
        toast.ok('✅ Release completed successfully - all artifacts generated');
      } else {
        setReleaseStatus('blocked');
        toast.err(`🚫 Release blocked - status: ${result.status}. Check /docs/Readiness_Report.md`);
      }
    } catch (error) {
      setReleaseStatus('idle');
      toast.err(`❌ Release failed: ${error}`);
    }
  };

  const handleRollback = async () => {
    if (!rollbackAvailable) {
      toast.err('No rollback plan available');
      return;
    }
    
    try {
      const result = await rollbackManager.executeRollback();
      if (result.success) {
        toast.ok('🔄 Rollback completed successfully');
        setReleaseStatus('idle');
        setReleaseResult(null);
        setRollbackAvailable(false);
      } else {
        toast.err(`❌ ${result.message}`);
      }
    } catch (error) {
      toast.err(`❌ Rollback failed: ${error}`);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'GREEN': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'AMBER': return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'RED': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variant = status === 'GREEN' ? 'default' : status === 'AMBER' ? 'secondary' : 'destructive';
    return (
      <Badge variant={variant} className="gap-1">
        {getStatusIcon(status)}
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            Release Control Panel
          </CardTitle>
          <CardDescription>
            Manage controlled releases with readiness checks and rollback capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button
              onClick={handleInitiateRelease}
              disabled={releaseStatus === 'checking' || releaseStatus === 'releasing'}
              size="lg"
              className={releaseStatus === 'complete' ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              {releaseStatus === 'checking' ? 'Checking Readiness...' : 
               releaseStatus === 'complete' ? '✅ Release Complete' : 
               'Gate Publish'}
            </Button>
            
            {rollbackAvailable && releaseResult && (
              <Button
                variant="outline"
                onClick={handleRollback}
                className="gap-2 border-amber-200 text-amber-700 hover:bg-amber-50"
              >
                <RotateCcw className="h-4 w-4" />
                Revert to {releaseResult.readiness?.timestamp ? 
                  new Date(releaseResult.readiness.timestamp).toLocaleDateString() : 
                  'Previous'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {readinessData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Release Readiness Status
              {getStatusBadge(readinessData.overall_status)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="systems">Systems</TabsTrigger>
                <TabsTrigger value="personas">Personas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{readinessData.routes_404}</div>
                    <div className="text-sm text-muted-foreground">404 Routes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{readinessData.brand_lock ? '✅' : '❌'}</div>
                    <div className="text-sm text-muted-foreground">Brand Lock</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{readinessData.auth_ok ? '✅' : '❌'}</div>
                    <div className="text-sm text-muted-foreground">Auth & Security</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{readinessData.vitals_ok ? '✅' : '❌'}</div>
                    <div className="text-sm text-muted-foreground">Performance</div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="systems" className="space-y-4">
                <div className="space-y-2">
                  <ReadinessCheckItem label="Routes (404 Check)" status={readinessData.routes_404 === 0} />
                  <ReadinessCheckItem label="Brand Lock" status={readinessData.brand_lock} />
                  <ReadinessCheckItem label="Authentication" status={readinessData.auth_ok} />
                  <ReadinessCheckItem label="Receipts" status={readinessData.receipts_ok} />
                  <ReadinessCheckItem label="Anchors" status={readinessData.anchors_ok} />
                  <ReadinessCheckItem label="Performance Vitals" status={readinessData.vitals_ok} />
                </div>
              </TabsContent>
              
              <TabsContent value="personas" className="space-y-4">
                <div className="space-y-2">
                  <ReadinessCheckItem label="Families Flow" status={readinessData.families_ok} />
                  <ReadinessCheckItem label="Advisors Flow" status={readinessData.advisors_ok} />
                  <ReadinessCheckItem label="Accountants Flow" status={readinessData.accountants_ok} />
                  <ReadinessCheckItem label="Attorneys Flow" status={readinessData.attorneys_ok} />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {releaseResult && (
        <Card>
          <CardHeader>
            <CardTitle className={
              releaseResult.status === 'GREEN' ? 'text-green-600' : 
              releaseResult.status === 'AMBER' ? 'text-amber-600' : 'text-red-600'
            }>
              {releaseResult.status === 'GREEN' ? '✅ Release Completed' : 
               releaseResult.status === 'AMBER' ? '⚠️ Release Blocked (AMBER)' : 
               '🚨 Release Blocked (RED)'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {releaseResult.status === 'GREEN' ? (
              <div className="space-y-2">
                <p>✅ All readiness checks passed</p>
                <p>✅ RC tag created and published</p>
                <p>✅ Launch_Receipt.json generated</p>
                <p>✅ Rules_Export.csv created</p>
                <p>✅ Release_Note.md written</p>
                <p>✅ Investor_Pack.zip prepared</p>
                <p>✅ Rollback plan ready</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p>❌ Readiness checks failed</p>
                <p>📄 See /docs/Readiness_Report.md for details</p>
                <p>🔧 Fix blocking issues before retrying</p>
                {releaseResult.status === 'AMBER' && (
                  <p>⚠️ Non-critical issues detected</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ReadinessCheckItem({ label, status }: { label: string; status: boolean }) {
  return (
    <div className="flex items-center justify-between p-2 rounded border">
      <span>{label}</span>
      <span className={status ? 'text-green-600' : 'text-red-600'}>
        {status ? '✅ PASS' : '❌ FAIL'}
      </span>
    </div>
  );
}