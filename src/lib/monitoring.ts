export type MonitorLike = {
  captureMessage: (msg: string) => void;
  gauge?: (name: string, value: number) => void;
  timing?: (name: string, value: number) => void;
};

// You can swap this with your real monitor (Sentry/Datadog/etc.)
const monitor: MonitorLike = (window as any).__MONITOR__ || {
  captureMessage: (msg: string) => console.warn('[monitor]', msg),
  gauge: (name: string, value: number) => console.info('[gauge]', name, value),
  timing: (name: string, value: number) => console.info('[timing]', name, value)
};

export function logError(msg: string, meta?: Record<string, any>) {
  monitor.captureMessage(msg);
  if (meta && Object.keys(meta).length > 0) {
    console.error('[monitor-meta]', meta);
  }
}

export function logEvent(name: string, meta?: Record<string, any>) {
  monitor.captureMessage(`[event] ${name}`);
  if (meta && Object.keys(meta).length > 0) {
    console.info('[event-meta]', meta);
  }
}

// Legacy helper for Error objects
export function logErrorFromException(err: unknown) {
  if (err instanceof Error) {
    logError(err.message, { stack: err.stack });
  } else {
    logError(typeof err === 'string' ? err : JSON.stringify(err));
  }
}

export function logWarn(msg: unknown) {
  monitor.captureMessage(typeof msg === 'string' ? msg : JSON.stringify(msg));
}

export function logInfo(msg: unknown) {
  monitor.captureMessage(typeof msg === 'string' ? msg : JSON.stringify(msg));
}

export function gauge(name: string, value: number | { value: number }) {
  const n = typeof value === 'number' ? value : value?.value;
  monitor.gauge?.(name, Number(n));
}

export function timing(name: string, value: number | { value: number }) {
  const n = typeof value === 'number' ? value : value?.value;
  monitor.timing?.(name, Number(n));
}

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