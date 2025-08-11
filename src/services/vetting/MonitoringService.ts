// @ts-nocheck
/**
 * ===================================================
 * Patent #9: Continuous Monitoring with HIL Escalation
 * SLA-Driven Re-verification & Anomaly Detection
 * ===================================================
 */

import { supabase } from '@/integrations/supabase/client';
import { VettingEngine } from './VettingEngine';

export interface MonitoringJob {
  id: string;
  professional_id: string;
  job_type: 'periodic_reverification' | 'sanction_check' | 'license_renewal' | 'anomaly_check';
  frequency_days: number;
  next_execution: string;
  sla_hours: number;
  priority: number;
  status: 'scheduled' | 'running' | 'completed' | 'failed' | 'paused';
  config: Record<string, any>;
}

export interface AnomalyAlert {
  professional_id: string;
  anomaly_type: 'trust_score_drop' | 'new_sanctions' | 'license_expiry' | 'verification_failure';
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: Record<string, any>;
  requires_human_review: boolean;
}

export class MonitoringService {
  private static instance: MonitoringService;
  private vettingEngine: VettingEngine;

  constructor() {
    this.vettingEngine = VettingEngine.getInstance();
  }

  public static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  /**
   * Patent Feature: SLA-Driven Continuous Monitoring
   * Schedule periodic re-verification with priority escalation
   */
  async scheduleMonitoringJob(
    professionalId: string,
    jobType: MonitoringJob['job_type'],
    frequencyDays: number = 30,
    slaHours: number = 24,
    priority: number = 5
  ): Promise<MonitoringJob> {
    const nextExecution = new Date();
    nextExecution.setDate(nextExecution.getDate() + frequencyDays);

    const config = this.getJobConfig(jobType, professionalId);

    const { data, error } = await supabase
      .from('monitoring_jobs')
      .insert({
        professional_id: professionalId,
        job_type: jobType,
        frequency_days: frequencyDays,
        next_execution: nextExecution.toISOString(),
        sla_hours: slaHours,
        priority,
        config
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Patent Feature: Priority Queue Processing with Backoff
   * Execute monitoring jobs with exponential backoff on failures
   */
  async processScheduledJobs(): Promise<void> {
    const { data: jobs } = await supabase
      .from('monitoring_jobs')
      .select('*')
      .eq('status', 'scheduled')
      .lte('next_execution', new Date().toISOString())
      .order('priority', { ascending: false })
      .order('next_execution', { ascending: true })
      .limit(10);

    if (!jobs?.length) return;

    for (const job of jobs) {
      await this.executeMonitoringJob(job);
    }
  }

  private async executeMonitoringJob(job: MonitoringJob): Promise<void> {
    try {
      // Mark job as running
      await supabase
        .from('monitoring_jobs')
        .update({ status: 'running', last_execution: new Date().toISOString() })
        .eq('id', job.id);

      let result: any;
      
      switch (job.job_type) {
        case 'periodic_reverification':
          result = await this.executePeriodicReverification(job);
          break;
        case 'sanction_check':
          result = await this.executeSanctionCheck(job);
          break;
        case 'license_renewal':
          result = await this.executeLicenseRenewalCheck(job);
          break;
        case 'anomaly_check':
          result = await this.executeAnomalyCheck(job);
          break;
        default:
          throw new Error(`Unknown job type: ${job.job_type}`);
      }

      // Schedule next execution
      const nextExecution = new Date();
      nextExecution.setDate(nextExecution.getDate() + job.frequency_days);

      await supabase
        .from('monitoring_jobs')
        .update({
          status: 'completed',
          last_result: result,
          next_execution: nextExecution.toISOString(),
          retry_count: 0 // Reset retry count on success
        })
        .eq('id', job.id);

      // Check for anomalies in result
      await this.analyzeJobResultForAnomalies(job, result);

    } catch (error) {
      await this.handleJobFailure(job, error);
    }
  }

  private async executePeriodicReverification(job: MonitoringJob): Promise<any> {
    console.log(`Executing periodic re-verification for professional ${job.professional_id}`);
    
    // Initiate new vetting request
    const vettingRequest = await this.vettingEngine.initiateVettingRequest(
      job.professional_id,
      'periodic',
      job.priority
    );

    return {
      vetting_request_id: vettingRequest.id,
      execution_time: new Date().toISOString(),
      type: 'periodic_reverification'
    };
  }

  private async executeSanctionCheck(job: MonitoringJob): Promise<any> {
    console.log(`Executing sanction check for professional ${job.professional_id}`);
    
    // Query recent sanction hits
    const { data: recentSanctions } = await supabase
      .from('sanction_hits')
      .select('*')
      .eq('professional_id', job.professional_id)
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false });

    const hasNewSanctions = recentSanctions?.some(s => s.status === 'active');

    if (hasNewSanctions) {
      await this.escalateAnomalyForHumanReview({
        professional_id: job.professional_id,
        anomaly_type: 'new_sanctions',
        severity: 'high',
        details: { recent_sanctions: recentSanctions },
        requires_human_review: true
      });
    }

    return {
      sanctions_found: recentSanctions?.length || 0,
      active_sanctions: recentSanctions?.filter(s => s.status === 'active').length || 0,
      requires_attention: hasNewSanctions,
      execution_time: new Date().toISOString()
    };
  }

  private async executeLicenseRenewalCheck(job: MonitoringJob): Promise<any> {
    console.log(`Executing license renewal check for professional ${job.professional_id}`);
    
    // Get latest registry records with license expiry dates
    const { data: registryRecords } = await supabase
      .from('registry_records')
      .select('*')
      .eq('professional_id', job.professional_id)
      .not('license_expiry', 'is', null)
      .order('created_at', { ascending: false })
      .limit(5);

    const expiringLicenses = registryRecords?.filter(record => {
      if (!record.license_expiry) return false;
      const expiryDate = new Date(record.license_expiry);
      const warningDate = new Date();
      warningDate.setDate(warningDate.getDate() + 90); // 90-day warning
      return expiryDate <= warningDate;
    }) || [];

    if (expiringLicenses.length > 0) {
      await this.escalateAnomalyForHumanReview({
        professional_id: job.professional_id,
        anomaly_type: 'license_expiry',
        severity: 'medium',
        details: { expiring_licenses: expiringLicenses },
        requires_human_review: true
      });
    }

    return {
      licenses_checked: registryRecords?.length || 0,
      expiring_licenses: expiringLicenses.length,
      requires_attention: expiringLicenses.length > 0,
      execution_time: new Date().toISOString()
    };
  }

  private async executeAnomalyCheck(job: MonitoringJob): Promise<any> {
    console.log(`Executing anomaly check for professional ${job.professional_id}`);
    
    // Get current and historical trust scores
    const { data: currentTrustScore } = await supabase
      .from('trust_scores')
      .select('*')
      .eq('professional_id', job.professional_id)
      .single();

    if (!currentTrustScore) {
      return { anomalies_detected: 0, execution_time: new Date().toISOString() };
    }

    const anomalies: AnomalyAlert[] = [];

    // Check for sudden trust score drops
    const scoreHistory = currentTrustScore.score_history || [];
    if (scoreHistory.length >= 2) {
      const current = scoreHistory[scoreHistory.length - 1];
      const previous = scoreHistory[scoreHistory.length - 2];
      const scoreDrop = previous.score - current.score;

      if (scoreDrop > 0.2) { // 20% drop threshold
        anomalies.push({
          professional_id: job.professional_id,
          anomaly_type: 'trust_score_drop',
          severity: scoreDrop > 0.4 ? 'critical' : 'high',
          details: {
            previous_score: previous.score,
            current_score: current.score,
            drop_amount: scoreDrop,
            timeframe: 'recent'
          },
          requires_human_review: true
        });
      }
    }

    // Check for verification failures
    const { data: recentFailures } = await supabase
      .from('registry_records')
      .select('*')
      .eq('professional_id', job.professional_id)
      .eq('verification_status', 'failed')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    if (recentFailures && recentFailures.length >= 2) {
      anomalies.push({
        professional_id: job.professional_id,
        anomaly_type: 'verification_failure',
        severity: 'medium',
        details: {
          failure_count: recentFailures.length,
          failed_sources: recentFailures.map(f => f.source_id)
        },
        requires_human_review: true
      });
    }

    // Escalate detected anomalies
    for (const anomaly of anomalies) {
      await this.escalateAnomalyForHumanReview(anomaly);
    }

    return {
      anomalies_detected: anomalies.length,
      anomaly_types: anomalies.map(a => a.anomaly_type),
      max_severity: anomalies.reduce((max, a) => 
        this.getSeverityLevel(a.severity) > this.getSeverityLevel(max) ? a.severity : max, 
        'low' as const
      ),
      execution_time: new Date().toISOString()
    };
  }

  /**
   * Patent Feature: Human-in-the-Loop (HIL) Escalation
   * Automatic escalation of anomalies requiring human review
   */
  private async escalateAnomalyForHumanReview(anomaly: AnomalyAlert): Promise<void> {
    console.log(`Escalating ${anomaly.severity} anomaly for professional ${anomaly.professional_id}:`, anomaly.anomaly_type);

    // Create monitoring job with escalated priority
    await this.scheduleMonitoringJob(
      anomaly.professional_id,
      'anomaly_check',
      1, // Daily checks for escalated cases
      4, // 4-hour SLA for high priority
      1  // Highest priority
    );

    // Log escalation event
    await supabase
      .from('reconciliation_logs')
      .insert({
        professional_id: anomaly.professional_id,
        reconciliation_type: 'identity_ambiguity', // Using closest available type
        source_records: [],
        conflict_details: {
          anomaly_type: anomaly.anomaly_type,
          severity: anomaly.severity,
          details: anomaly.details,
          escalated_at: new Date().toISOString(),
          requires_human_review: anomaly.requires_human_review
        },
        resolution_method: 'escalated',
        requires_follow_up: true,
        follow_up_date: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      });

    // Reset trust score streak on critical anomalies
    if (anomaly.severity === 'critical') {
      await supabase
        .from('trust_scores')
        .update({
          streak_count: 0,
          last_adverse_event_date: new Date().toISOString(),
          flags: supabase.from('trust_scores').select('flags').eq('professional_id', anomaly.professional_id).single().then(
            result => [...(result.data?.flags || []), `${anomaly.anomaly_type}_detected`]
          )
        })
        .eq('professional_id', anomaly.professional_id);
    }
  }

  private async analyzeJobResultForAnomalies(job: MonitoringJob, result: any): Promise<void> {
    // Check if job execution exceeded SLA
    const executionTime = new Date(result.execution_time);
    const slaDeadline = new Date(job.next_execution);
    slaDeadline.setHours(slaDeadline.getHours() + job.sla_hours);

    if (executionTime > slaDeadline) {
      await this.escalateAnomalyForHumanReview({
        professional_id: job.professional_id,
        anomaly_type: 'verification_failure',
        severity: 'medium',
        details: {
          sla_breach: true,
          expected_completion: slaDeadline.toISOString(),
          actual_completion: executionTime.toISOString(),
          delay_hours: (executionTime.getTime() - slaDeadline.getTime()) / (1000 * 60 * 60)
        },
        requires_human_review: true
      });
    }

    // Analyze result-specific anomalies
    if (result.requires_attention) {
      const severity = result.active_sanctions > 0 ? 'high' : 'medium';
      await this.escalateAnomalyForHumanReview({
        professional_id: job.professional_id,
        anomaly_type: job.job_type === 'sanction_check' ? 'new_sanctions' : 'verification_failure',
        severity,
        details: result,
        requires_human_review: true
      });
    }
  }

  private async handleJobFailure(job: MonitoringJob, error: any): Promise<void> {
    const retryCount = (job.retry_count || 0) + 1;
    const maxRetries = job.max_retries || 3;
    const backoffMultiplier = job.backoff_multiplier || 2.0;

    if (retryCount <= maxRetries) {
      // Schedule retry with exponential backoff
      const backoffMinutes = Math.pow(backoffMultiplier, retryCount) * 5; // Base 5 minutes
      const nextExecution = new Date();
      nextExecution.setMinutes(nextExecution.getMinutes() + backoffMinutes);

      await supabase
        .from('monitoring_jobs')
        .update({
          status: 'scheduled',
          retry_count: retryCount,
          next_execution: nextExecution.toISOString(),
          error_message: error.message
        })
        .eq('id', job.id);
    } else {
      // Max retries exceeded, escalate
      await supabase
        .from('monitoring_jobs')
        .update({
          status: 'failed',
          escalation_triggered: true,
          escalated_at: new Date().toISOString(),
          error_message: error.message
        })
        .eq('id', job.id);

      await this.escalateAnomalyForHumanReview({
        professional_id: job.professional_id,
        anomaly_type: 'verification_failure',
        severity: 'high',
        details: {
          job_type: job.job_type,
          retry_count: retryCount,
          error: error.message,
          escalation_reason: 'max_retries_exceeded'
        },
        requires_human_review: true
      });
    }
  }

  private getJobConfig(jobType: MonitoringJob['job_type'], professionalId: string): Record<string, any> {
    const baseConfig = {
      professional_id: professionalId,
      created_at: new Date().toISOString()
    };

    switch (jobType) {
      case 'periodic_reverification':
        return {
          ...baseConfig,
          full_verification: true,
          check_all_sources: true
        };
      case 'sanction_check':
        return {
          ...baseConfig,
          check_criminal: true,
          check_regulatory: true,
          check_disciplinary: true
        };
      case 'license_renewal':
        return {
          ...baseConfig,
          warning_days: 90,
          critical_days: 30
        };
      case 'anomaly_check':
        return {
          ...baseConfig,
          trust_score_threshold: 0.2,
          failure_threshold: 2
        };
      default:
        return baseConfig;
    }
  }

  private getSeverityLevel(severity: AnomalyAlert['severity']): number {
    const levels = { low: 1, medium: 2, high: 3, critical: 4 };
    return levels[severity] || 1;
  }

  /**
   * Public API: Initialize monitoring for a professional
   */
  async initializeMonitoring(professionalId: string): Promise<void> {
    // Schedule all standard monitoring jobs
    await Promise.all([
      this.scheduleMonitoringJob(professionalId, 'periodic_reverification', 90, 48, 5),
      this.scheduleMonitoringJob(professionalId, 'sanction_check', 7, 24, 3),
      this.scheduleMonitoringJob(professionalId, 'license_renewal', 30, 24, 4),
      this.scheduleMonitoringJob(professionalId, 'anomaly_check', 1, 12, 2)
    ]);
  }

  /**
   * Public API: Get monitoring status for a professional
   */
  async getMonitoringStatus(professionalId: string): Promise<any> {
    const { data: jobs } = await supabase
      .from('monitoring_jobs')
      .select('*')
      .eq('professional_id', professionalId)
      .order('next_execution', { ascending: true });

    const { data: recentLogs } = await supabase
      .from('reconciliation_logs')
      .select('*')
      .eq('professional_id', professionalId)
      .order('created_at', { ascending: false })
      .limit(10);

    return {
      active_jobs: jobs?.filter(j => j.status === 'scheduled').length || 0,
      next_execution: jobs?.[0]?.next_execution,
      recent_anomalies: recentLogs?.filter(l => 
        l.conflict_details?.anomaly_type && l.resolution_method === 'escalated'
      ).length || 0,
      overall_status: this.calculateOverallMonitoringStatus(jobs || [])
    };
  }

  private calculateOverallMonitoringStatus(jobs: MonitoringJob[]): string {
    if (jobs.some(j => j.status === 'failed')) return 'degraded';
    if (jobs.some(j => j.escalation_triggered)) return 'escalated';
    if (jobs.every(j => j.status === 'completed' || j.status === 'scheduled')) return 'healthy';
    return 'unknown';
  }
}