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

function toMsg(err: unknown) {
  if (err instanceof Error) return err.stack || err.message;
  return typeof err === 'string' ? err : JSON.stringify(err);
}

export function logError(err: unknown) {
  monitor.captureMessage(toMsg(err));
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
    logError(new Error(event.message));
  });

  // Catch unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    logError(new Error(event.reason));
  });
};