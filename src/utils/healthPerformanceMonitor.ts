/**
 * Performance monitoring for health modules
 * Tracks load times and ensures no PHI leakage in metrics
 */

interface PerformanceMetrics {
  moduleLoadTime: number;
  renderTime: number;
  interactionTime: number;
  memoryUsage: number;
}

export class HealthPerformanceMonitor {
  private metrics: Map<string, PerformanceMetrics> = new Map();
  private startTimes: Map<string, number> = new Map();

  startTracking(moduleId: string) {
    this.startTimes.set(moduleId, performance.now());
    
    // Track memory usage (anonymized)
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      console.info('health.performance.start', {
        module: this.sanitizeModuleId(moduleId),
        heap_used_mb: Math.round(memory.usedJSHeapSize / 1024 / 1024),
        timestamp: Date.now()
      });
    }
  }

  endTracking(moduleId: string, event: 'load' | 'render' | 'interaction') {
    const startTime = this.startTimes.get(moduleId);
    if (!startTime) return;

    const duration = performance.now() - startTime;
    
    // Log performance (no PHI)
    console.info('health.performance.end', {
      module: this.sanitizeModuleId(moduleId),
      event,
      duration_ms: Math.round(duration),
      timestamp: Date.now()
    });

    // Update metrics
    const existing = this.metrics.get(moduleId) || {
      moduleLoadTime: 0,
      renderTime: 0,
      interactionTime: 0,
      memoryUsage: 0
    };

    switch (event) {
      case 'load':
        existing.moduleLoadTime = duration;
        break;
      case 'render':
        existing.renderTime = duration;
        break;
      case 'interaction':
        existing.interactionTime = duration;
        break;
    }

    this.metrics.set(moduleId, existing);
    this.startTimes.delete(moduleId);
  }

  /**
   * Sanitize module IDs to prevent PHI leakage
   */
  private sanitizeModuleId(moduleId: string): string {
    // Remove any potential PHI patterns
    return moduleId
      .replace(/\d{3}-\d{2}-\d{4}/g, '[SSN]') // SSN pattern
      .replace(/\b\d{2}\/\d{2}\/\d{4}\b/g, '[DATE]') // Date pattern
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]') // Email
      .replace(/\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/g, '[CARD]'); // Credit card
  }

  getMetrics(moduleId: string): PerformanceMetrics | undefined {
    return this.metrics.get(moduleId);
  }

  getAllMetrics(): Record<string, PerformanceMetrics> {
    const result: Record<string, PerformanceMetrics> = {};
    this.metrics.forEach((metrics, moduleId) => {
      result[this.sanitizeModuleId(moduleId)] = metrics;
    });
    return result;
  }

  /**
   * Check if performance meets Lighthouse targets
   */
  checkLighthouseTargets(): {
    performance: boolean;
    accessibility: boolean;
    bestPractices: boolean;
    issues: string[];
  } {
    const issues: string[] = [];
    let performance = true;
    let accessibility = true;
    let bestPractices = true;

    // Check render times (should be < 2s for good performance)
    this.metrics.forEach((metrics, moduleId) => {
      if (metrics.renderTime > 2000) {
        performance = false;
        issues.push(`Module ${this.sanitizeModuleId(moduleId)} render time: ${metrics.renderTime}ms`);
      }

      if (metrics.moduleLoadTime > 3000) {
        performance = false;
        issues.push(`Module ${this.sanitizeModuleId(moduleId)} load time: ${metrics.moduleLoadTime}ms`);
      }
    });

    // Check accessibility compliance (simulated)
    const hasSkipLinks = document.querySelector('[aria-label*="Skip"]');
    if (!hasSkipLinks) {
      accessibility = false;
      issues.push('Missing skip-to-content links');
    }

    // Check aria-labels on buttons
    const buttonsWithoutLabels = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
    if (buttonsWithoutLabels.length > 0) {
      accessibility = false;
      issues.push(`${buttonsWithoutLabels.length} buttons missing aria-labels`);
    }

    // Check best practices (no PHI in console)
    const consoleHasPHI = this.checkConsolePHI();
    if (consoleHasPHI) {
      bestPractices = false;
      issues.push('Potential PHI detected in console logs');
    }

    return {
      performance: performance && issues.filter(i => i.includes('time')).length === 0,
      accessibility: accessibility && issues.filter(i => i.includes('aria')).length === 0,
      bestPractices: bestPractices && !consoleHasPHI,
      issues
    };
  }

  /**
   * Check for PHI patterns in recent console logs (simulation)
   */
  private checkConsolePHI(): boolean {
    // This is a simulation - in real implementation would check actual console
    const mockConsoleContent = JSON.stringify(this.metrics);
    
    const phiPatterns = [
      /\b\d{3}-\d{2}-\d{4}\b/, // SSN
      /\b\d{2}\/\d{2}\/\d{4}\b/, // Date
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
      /\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/ // Credit card
    ];

    return phiPatterns.some(pattern => pattern.test(mockConsoleContent));
  }
}

// Global instance
export const healthPerformanceMonitor = new HealthPerformanceMonitor();