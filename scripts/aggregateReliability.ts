#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface HealthTelemetryEvent {
  event_type: 'gate.result' | 'consent.result' | 'pa.result' | 'export.action';
  policy_version: string;
  action: string;
  result: 'allow' | 'deny' | 'error' | 'success' | 'failure';
  reasons: string[];
  duration_ms: number;
  hasAnchor: boolean;
  timestamp: number;
  session_id: string;
}

interface ReliabilityMetrics {
  event_type: string;
  policy_version: string;
  total_events: number;
  success_rate: number;
  deny_rate: number;
  error_rate: number;
  median_duration_ms: number;
  avg_duration_ms: number;
  anchor_coverage: number;
  top_reasons: Array<{ reason: string; count: number; percentage: number }>;
  daily_trend: Array<{ date: string; count: number; success_rate: number }>;
}

interface ReliabilityReport {
  generated_at: string;
  period: {
    start: string;
    end: string;
  };
  summary: {
    total_events: number;
    overall_success_rate: number;
    overall_anchor_coverage: number;
    avg_response_time_ms: number;
  };
  metrics_by_type: ReliabilityMetrics[];
  compliance_score: number;
  recommendations: string[];
}

class ReliabilityAggregator {
  private events: HealthTelemetryEvent[] = [];

  loadEvents() {
    try {
      // In development, we'll simulate loading from a local file
      // In production, this would connect to your analytics backend
      const mockEvents = this.generateMockEvents();
      this.events = mockEvents;
      console.log(`Loaded ${this.events.length} telemetry events`);
    } catch (error) {
      console.error('Failed to load events:', error);
      this.events = [];
    }
  }

  private generateMockEvents(): HealthTelemetryEvent[] {
    const events: HealthTelemetryEvent[] = [];
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    // Generate events for the last 7 days
    for (let i = 0; i < 7; i++) {
      const dayStart = now - (i * dayMs);
      const eventsPerDay = Math.floor(Math.random() * 50) + 20;

      for (let j = 0; j < eventsPerDay; j++) {
        const timestamp = dayStart + Math.random() * dayMs;
        const eventTypes = ['gate.result', 'consent.result', 'pa.result', 'export.action'] as const;
        const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        
        let result: HealthTelemetryEvent['result'];
        let reasons: string[];

        switch (eventType) {
          case 'gate.result':
            result = Math.random() > 0.15 ? 'allow' : 'deny';
            reasons = result === 'deny' ? ['INSUFFICIENT_PERMISSION', 'SCOPE_MISMATCH'] : ['POLICY_MATCH'];
            break;
          case 'consent.result':
            result = Math.random() > 0.1 ? 'allow' : 'deny';
            reasons = result === 'deny' ? ['CONSENT_EXPIRED', 'SCOPE_INSUFFICIENT'] : ['CONSENT_VALID'];
            break;
          case 'pa.result':
            result = Math.random() > 0.2 ? 'success' : 'failure';
            reasons = result === 'failure' ? ['AUTHORIZATION_DENIED', 'INSUFFICIENT_DOCUMENTATION'] : ['APPROVED'];
            break;
          case 'export.action':
            result = Math.random() > 0.05 ? 'success' : 'failure';
            reasons = result === 'failure' ? ['EXPORT_ERROR', 'PERMISSION_DENIED'] : ['EXPORT_COMPLETE'];
            break;
        }

        events.push({
          event_type: eventType,
          policy_version: '1.0',
          action: `${eventType.split('.')[0]}_action_${j % 5}`,
          result,
          reasons,
          duration_ms: Math.floor(Math.random() * 2000) + 100,
          hasAnchor: Math.random() > 0.3,
          timestamp,
          session_id: `session_${Math.floor(timestamp / dayMs)}_${j % 10}`
        });
      }
    }

    return events.sort((a, b) => a.timestamp - b.timestamp);
  }

  private calculateMedian(numbers: number[]): number {
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  }

  private groupEventsByType(): Map<string, HealthTelemetryEvent[]> {
    const grouped = new Map<string, HealthTelemetryEvent[]>();
    
    for (const event of this.events) {
      const key = `${event.event_type}:${event.policy_version}`;
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(event);
    }
    
    return grouped;
  }

  private analyzeEventGroup(events: HealthTelemetryEvent[]): ReliabilityMetrics {
    const total = events.length;
    const successCount = events.filter(e => 
      e.result === 'allow' || e.result === 'success'
    ).length;
    const denyCount = events.filter(e => e.result === 'deny').length;
    const errorCount = events.filter(e => e.result === 'error' || e.result === 'failure').length;
    
    const durations = events.map(e => e.duration_ms);
    const anchorCount = events.filter(e => e.hasAnchor).length;
    
    // Count reasons
    const reasonCounts = new Map<string, number>();
    events.forEach(e => {
      e.reasons.forEach(reason => {
        reasonCounts.set(reason, (reasonCounts.get(reason) || 0) + 1);
      });
    });
    
    const topReasons = Array.from(reasonCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([reason, count]) => ({
        reason,
        count,
        percentage: Math.round((count / total) * 100)
      }));

    // Daily trend
    const dailyGroups = new Map<string, HealthTelemetryEvent[]>();
    events.forEach(e => {
      const date = new Date(e.timestamp).toISOString().split('T')[0];
      if (!dailyGroups.has(date)) {
        dailyGroups.set(date, []);
      }
      dailyGroups.get(date)!.push(e);
    });

    const dailyTrend = Array.from(dailyGroups.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, dayEvents]) => ({
        date,
        count: dayEvents.length,
        success_rate: Math.round((dayEvents.filter(e => 
          e.result === 'allow' || e.result === 'success'
        ).length / dayEvents.length) * 100)
      }));

    const firstEvent = events[0];
    
    return {
      event_type: firstEvent.event_type,
      policy_version: firstEvent.policy_version,
      total_events: total,
      success_rate: Math.round((successCount / total) * 100),
      deny_rate: Math.round((denyCount / total) * 100),
      error_rate: Math.round((errorCount / total) * 100),
      median_duration_ms: Math.round(this.calculateMedian(durations)),
      avg_duration_ms: Math.round(durations.reduce((a, b) => a + b, 0) / durations.length),
      anchor_coverage: Math.round((anchorCount / total) * 100),
      top_reasons: topReasons,
      daily_trend: dailyTrend
    };
  }

  private calculateComplianceScore(metrics: ReliabilityMetrics[]): number {
    let score = 100;
    
    for (const metric of metrics) {
      // Penalize high error rates
      score -= metric.error_rate * 2;
      
      // Penalize low anchor coverage
      if (metric.anchor_coverage < 80) {
        score -= (80 - metric.anchor_coverage) * 0.5;
      }
      
      // Penalize slow response times
      if (metric.avg_duration_ms > 1000) {
        score -= Math.min(10, (metric.avg_duration_ms - 1000) / 100);
      }
    }
    
    return Math.max(0, Math.round(score));
  }

  private generateRecommendations(metrics: ReliabilityMetrics[], complianceScore: number): string[] {
    const recommendations: string[] = [];
    
    if (complianceScore < 90) {
      recommendations.push('Overall compliance score below 90% - review system reliability');
    }
    
    const highErrorMetrics = metrics.filter(m => m.error_rate > 5);
    if (highErrorMetrics.length > 0) {
      recommendations.push(`High error rates detected in: ${highErrorMetrics.map(m => m.event_type).join(', ')}`);
    }
    
    const lowAnchorMetrics = metrics.filter(m => m.anchor_coverage < 70);
    if (lowAnchorMetrics.length > 0) {
      recommendations.push(`Low anchor coverage in: ${lowAnchorMetrics.map(m => m.event_type).join(', ')}`);
    }
    
    const slowMetrics = metrics.filter(m => m.avg_duration_ms > 1500);
    if (slowMetrics.length > 0) {
      recommendations.push(`Slow response times in: ${slowMetrics.map(m => m.event_type).join(', ')}`);
    }
    
    if (recommendations.length === 0) {
      recommendations.push('System performing within acceptable parameters');
    }
    
    return recommendations;
  }

  generateReport(): ReliabilityReport {
    const groupedEvents = this.groupEventsByType();
    const metrics: ReliabilityMetrics[] = [];
    
    for (const [, events] of groupedEvents) {
      metrics.push(this.analyzeEventGroup(events));
    }
    
    const totalEvents = this.events.length;
    const successEvents = this.events.filter(e => 
      e.result === 'allow' || e.result === 'success'
    ).length;
    const anchorEvents = this.events.filter(e => e.hasAnchor).length;
    const allDurations = this.events.map(e => e.duration_ms);
    
    const complianceScore = this.calculateComplianceScore(metrics);
    const recommendations = this.generateRecommendations(metrics, complianceScore);
    
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    return {
      generated_at: now.toISOString(),
      period: {
        start: weekAgo.toISOString(),
        end: now.toISOString()
      },
      summary: {
        total_events: totalEvents,
        overall_success_rate: Math.round((successEvents / totalEvents) * 100),
        overall_anchor_coverage: Math.round((anchorEvents / totalEvents) * 100),
        avg_response_time_ms: Math.round(allDurations.reduce((a, b) => a + b, 0) / allDurations.length)
      },
      metrics_by_type: metrics,
      compliance_score: complianceScore,
      recommendations
    };
  }

  saveReport(report: ReliabilityReport) {
    const filename = `reliability-report-${new Date().toISOString().split('T')[0]}.json`;
    const filepath = join(process.cwd(), 'reports', filename);
    
    try {
      // Ensure reports directory exists
      const { mkdirSync } = require('fs');
      mkdirSync(join(process.cwd(), 'reports'), { recursive: true });
      
      writeFileSync(filepath, JSON.stringify(report, null, 2));
      console.log(`Report saved to: ${filepath}`);
      console.log(`Compliance Score: ${report.compliance_score}/100`);
      console.log('Summary:', report.summary);
    } catch (error) {
      console.error('Failed to save report:', error);
    }
  }
}

// Main execution
if (require.main === module) {
  console.log('🔍 Generating HIPAA Compliance Reliability Report...');
  
  const aggregator = new ReliabilityAggregator();
  aggregator.loadEvents();
  
  const report = aggregator.generateReport();
  aggregator.saveReport(report);
  
  console.log('\n📊 Report Summary:');
  console.log(`Total Events: ${report.summary.total_events}`);
  console.log(`Success Rate: ${report.summary.overall_success_rate}%`);
  console.log(`Anchor Coverage: ${report.summary.overall_anchor_coverage}%`);
  console.log(`Avg Response Time: ${report.summary.avg_response_time_ms}ms`);
  console.log(`Compliance Score: ${report.compliance_score}/100`);
  
  if (report.recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    report.recommendations.forEach(rec => console.log(`  • ${rec}`));
  }
}

export { ReliabilityAggregator };