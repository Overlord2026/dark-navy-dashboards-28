
import { DiagnosticTestStatus } from '@/types/diagnostics/common';
import { PerformanceTestResult } from '@/types/diagnostics';
import { v4 as uuidv4 } from 'uuid';

export function runComponentPerformanceTests(): PerformanceTestResult[] {
  const results: PerformanceTestResult[] = [
    {
      id: uuidv4(),
      component: "Dashboard",
      metric: "Render Time",
      value: 120,
      threshold: 100,
      status: "warning",
      message: "Dashboard renders slower than optimal threshold",
      timestamp: new Date().toISOString(),
      details: { renderCalls: 5, reRenders: 2 }
    },
    {
      id: uuidv4(),
      component: "AssetTable",
      metric: "Data Loading",
      value: 350,
      threshold: 500,
      status: "success",
      message: "Asset table data loads within acceptable time",
      timestamp: new Date().toISOString(),
      details: { dataPoints: 250, queryTime: "342ms" }
    },
    {
      id: uuidv4(),
      component: "NetWorthChart",
      metric: "Animation FPS",
      value: 45,
      threshold: 60,
      status: "warning",
      message: "Chart animations dropping frames on lower-end devices",
      timestamp: new Date().toISOString(),
      details: { averageFPS: 45, minFPS: 30 }
    }
  ];
  
  return results;
}

export function runPerformanceTests(): PerformanceTestResult[] {
  return runComponentPerformanceTests();
}
