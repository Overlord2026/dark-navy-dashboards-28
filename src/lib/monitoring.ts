export type MonitorLike = {
  captureMessage: (msg: string) => void;
  gauge?: (name: string, value: number) => void;
  timing?: (name: string, value: number) => void;
};

const monitor: MonitorLike = (window as any).__MONITOR__ || {
  captureMessage: (msg:string) => (import.meta.env.DEV) && console.warn('[monitor]', msg),
  gauge: (n:string, v:number)=> (import.meta.env.DEV) && console.info('[gauge]', n, v),
  timing:(n:string, v:number)=> (import.meta.env.DEV) && console.info('[timing]', n, v)
};

function toMsg(...args: any[]) {
  try {
    return args.map(a =>
      a instanceof Error ? (a.stack || a.message)
      : typeof a === 'string' ? a
      : JSON.stringify(a)
    ).join(' | ');
  } catch { return '[monitor]'; }
}

export function logError(...args:any[]){ monitor.captureMessage(toMsg(...args)); }
export function logWarn (...args:any[]){ monitor.captureMessage(toMsg(...args)); }
export function logInfo (...args:any[]){ monitor.captureMessage(toMsg(...args)); }
export function gauge(name:string, value:number|{value:number}){ monitor.gauge?.(name, Number((value as any)?.value ?? value)); }
export function timing(name:string, value:number|{value:number}){ monitor.timing?.(name, Number((value as any)?.value ?? value)); }

// Global error handler
export const setupErrorMonitoring = () => {
  // Catch unhandled errors
  window.addEventListener('error', (event) => {
    logError(event.message, { stack: event.error?.stack });
  });

  // Catch unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    logError(String(event.reason), { 
      stack: event.reason instanceof Error ? event.reason.stack : undefined 
    });
  });
};