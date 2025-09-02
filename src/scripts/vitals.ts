// Web Vitals P95 Tracking Script
import { onCLS, onFID, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals';

interface RouteVitals {
  route: string;
  timestamp: string;
  lcp: number;
  fid: number;
  cls: number;
  fcp: number;
  ttfb: number;
  userAgent: string;
}

class WebVitalsTracker {
  private vitalsData: RouteVitals[] = [];
  private currentRoute: string = window.location.pathname;

  constructor() {
    this.initializeTracking();
  }

  private initializeTracking() {
    onCLS(this.handleMetric.bind(this, 'CLS'));
    onFID(this.handleMetric.bind(this, 'FID'));
    onFCP(this.handleMetric.bind(this, 'FCP'));
    onLCP(this.handleMetric.bind(this, 'LCP'));
    onTTFB(this.handleMetric.bind(this, 'TTFB'));
  }

  private handleMetric(metricName: string, metric: Metric) {
    let routeEntry = this.vitalsData.find(entry => entry.route === this.currentRoute);
    
    if (!routeEntry) {
      routeEntry = {
        route: this.currentRoute,
        timestamp: new Date().toISOString(),
        lcp: 0, fid: 0, cls: 0, fcp: 0, ttfb: 0,
        userAgent: navigator.userAgent
      };
      this.vitalsData.push(routeEntry);
    }

    switch (metricName) {
      case 'LCP': routeEntry.lcp = metric.value; break;
      case 'FID': routeEntry.fid = metric.value; break;
      case 'CLS': routeEntry.cls = metric.value; break;
      case 'FCP': routeEntry.fcp = metric.value; break;
      case 'TTFB': routeEntry.ttfb = metric.value; break;
    }
  }

  public exportData() {
    localStorage.setItem('webVitalsData', JSON.stringify(this.vitalsData));
    console.log('[Web Vitals] Data exported');
  }
}

export const vitalsTracker = new WebVitalsTracker();

// Accessibility tracking
export function trackAccessibilityViolations(violations: any[], pageUrl: string) {
  const seriousViolations = violations.filter(v => v.impact === 'serious' || v.impact === 'critical');
  console.log(`[A11y] ${seriousViolations.length} serious violations on ${pageUrl}`);
  return { serious: seriousViolations.length, total: violations.length };
}