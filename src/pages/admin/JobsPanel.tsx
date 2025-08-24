import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Play, 
  Square, 
  RefreshCw, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Settings 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getJobs } from '@/jobs/registry';
import { 
  startJobs, 
  stopJobs, 
  runJobNow, 
  getJobRuns, 
  getJobStatus 
} from '@/jobs/runner';
import { getFlag, setFlag, type JobFlags } from '@/jobs/flags';
import type { Job, JobRun } from '@/jobs/types';

export default function JobsPanel() {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobRuns, setJobRuns] = useState<JobRun[]>([]);
  const [status, setStatus] = useState(getJobStatus());
  const [flags, setFlags] = useState<JobFlags>({
    BACKGROUND_JOBS_ENABLED: getFlag('BACKGROUND_JOBS_ENABLED'),
    MONITOR_GUARDRAILS_ENABLED: getFlag('MONITOR_GUARDRAILS_ENABLED'),
    SYNC_BENEFICIARIES_ENABLED: getFlag('SYNC_BENEFICIARIES_ENABLED'),
    SUPERVISOR_DIGEST_ENABLED: getFlag('SUPERVISOR_DIGEST_ENABLED'),
    SUPERVISOR_MONTHLY_ENABLED: getFlag('SUPERVISOR_MONTHLY_ENABLED'),
  });
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    loadData();
    
    // Import sample jobs to ensure they're registered
    import('@/jobs/sample-jobs');
    
    // Refresh data periodically
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    setJobs(getJobs().map(j => ({ ...j, name: j.name || j.key, description: j.description || '' })));
    setJobRuns(getJobRuns());
    setStatus(getJobStatus());
  };

  const handleFlagChange = async (flagName: keyof JobFlags, enabled: boolean) => {
    setFlag(flagName, enabled);
    setFlags(prev => ({ ...prev, [flagName]: enabled }));
    
    // Restart jobs if background jobs flag changed
    if (flagName === 'BACKGROUND_JOBS_ENABLED') {
      if (enabled) {
        await startJobs();
      } else {
        stopJobs();
      }
      setStatus(getJobStatus());
    }

    toast({
      title: 'Flag Updated',
      description: `${flagName} ${enabled ? 'enabled' : 'disabled'}`,
    });
  };

  const handleStartJobs = async () => {
    try {
      await startJobs();
      setStatus(getJobStatus());
      toast({
        title: 'Jobs Started',
        description: 'Background jobs are now running',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start jobs',
        variant: 'destructive',
      });
    }
  };

  const handleStopJobs = () => {
    stopJobs();
    setStatus(getJobStatus());
    toast({
      title: 'Jobs Stopped',
      description: 'All background jobs have been stopped',
    });
  };

  const handleRunJob = async (jobKey: string) => {
    setLoading(jobKey);
    try {
      const result = await runJobNow(jobKey);
      
      toast({
        title: result.ok ? 'Job Completed' : 'Job Failed',
        description: result.ok 
          ? `Processed ${result.count || 0} items in ${result.duration}ms`
          : result.error || 'Unknown error',
        variant: result.ok ? 'default' : 'destructive',
      });
      
      loadData(); // Refresh the runs list
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to run job',
        variant: 'destructive',
      });
    } finally {
      setLoading(null);
    }
  };

  const getJobLastRun = (jobKey: string) => {
    const runs = jobRuns.filter(run => run.jobKey === jobKey);
    return runs.length > 0 ? runs[0] : null;
  };

  const formatDuration = (ms?: number) => {
    if (!ms) return '-';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Background Jobs</h1>
          <p className="text-muted-foreground">
            Manage background tasks and job execution
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={status.isRunning ? 'default' : 'secondary'}>
            {status.isRunning ? 'Running' : 'Stopped'}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {status.activeJobs} active
          </span>
        </div>
      </div>

      {/* Job System Controls */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Settings className="h-4 w-4" />
          System Configuration
        </h3>
        
        <div className="space-y-4">
          {Object.entries(flags).map(([flagName, enabled]) => (
            <div key={flagName} className="flex items-center justify-between">
              <div>
                <Label className="font-medium">
                  {flagName.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {flagName === 'BACKGROUND_JOBS_ENABLED' && 'Enable automatic job execution'}
                  {flagName === 'MONITOR_GUARDRAILS_ENABLED' && 'Monitor retirement plan guardrails'}
                  {flagName === 'SYNC_BENEFICIARIES_ENABLED' && 'Check beneficiary designations'}
                  {flagName === 'SUPERVISOR_DIGEST_ENABLED' && 'Send daily supervisor digest emails'}
                  {flagName === 'SUPERVISOR_MONTHLY_ENABLED' && 'Generate monthly supervisor reports'}
                </p>
              </div>
              <Switch
                checked={enabled}
                onCheckedChange={(checked) => handleFlagChange(flagName as keyof JobFlags, checked)}
              />
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-6 pt-4 border-t">
          <Button
            onClick={handleStartJobs}
            disabled={status.isRunning || !flags.BACKGROUND_JOBS_ENABLED}
            size="sm"
            className="flex items-center gap-2"
          >
            <Play className="h-4 w-4" />
            Start Jobs
          </Button>
          <Button
            onClick={handleStopJobs}
            disabled={!status.isRunning}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Square className="h-4 w-4" />
            Stop Jobs
          </Button>
          <Button
            onClick={loadData}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </Card>

      {/* Jobs List */}
      <div className="space-y-4">
        <h3 className="font-semibold">Registered Jobs</h3>
        
        {jobs.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">No jobs registered</p>
          </Card>
        ) : (
          jobs.map((job) => {
            const lastRun = getJobLastRun(job.key);
            const isEnabled = getFlag(job.enabledFlag as keyof JobFlags);
            
            return (
              <Card key={job.key} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{job.name}</h4>
                      <Badge variant={isEnabled ? 'default' : 'secondary'}>
                        {isEnabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                      {job.intervalMs && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {job.intervalMs / 1000}s
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {job.description}
                    </p>
                    
                    {lastRun && (
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          {lastRun.result?.ok ? (
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          ) : (
                            <XCircle className="h-3 w-3 text-red-600" />
                          )}
                          <span>
                            Last run: {new Date(lastRun.startedAt).toLocaleString()}
                          </span>
                        </div>
                        
                        {lastRun.result && (
                          <>
                            <span>Duration: {formatDuration(lastRun.result.duration)}</span>
                            {lastRun.result.count !== undefined && (
                              <span>Count: {lastRun.result.count}</span>
                            )}
                            {lastRun.receiptId && (
                              <span>Receipt: {lastRun.receiptId.slice(-8)}</span>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <Button
                    onClick={() => handleRunJob(job.key)}
                    disabled={loading === job.key}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    {loading === job.key ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                    Run Now
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Recent Runs */}
      {jobRuns.length > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Recent Job Runs</h3>
          <div className="space-y-2">
            {jobRuns.slice(0, 10).map((run, index) => (
              <div
                key={`${run.jobKey}-${run.startedAt}`}
                className="flex items-center justify-between py-2 border-b border-border last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  {run.result?.ok ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className="font-medium">{run.jobKey}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(run.startedAt).toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {run.result && (
                    <>
                      <span>{formatDuration(run.result.duration)}</span>
                      {run.result.count !== undefined && (
                        <span>{run.result.count} items</span>
                      )}
                    </>
                  )}
                  {run.receiptId && (
                    <code className="text-xs">{run.receiptId.slice(-8)}</code>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}