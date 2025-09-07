// Console log removal utility for production builds
// This removes console logs from auth and PII-sensitive paths in production

export const removeProductionLogs = () => {
  if (import.meta.env.PROD) {
    // Override console methods in production
    const noop = () => {};
    
    // List of sensitive path patterns where logging should be completely disabled
    const sensitivePatterns = [
      '/auth',
      '/login',
      '/signup',
      '/profile',
      '/vault',
      '/documents',
      '/financial',
      '/health',
      '/personal'
    ];
    
    const isSensitivePath = () => {
      const path = window.location.pathname;
      return sensitivePatterns.some(pattern => path.includes(pattern));
    };
    
    // Only remove logs on sensitive paths or completely in production
    if (isSensitivePath()) {
      console.log = noop;
      console.info = noop;
      console.warn = noop;
      console.debug = noop;
      // Keep console.error for critical debugging
    }
  }
};

// Type-safe logger that respects environment
export const logger = {
  info: (...args: any[]) => {
    if (import.meta.env.DEV) {
      console.info(...args);
    }
  },
  warn: (...args: any[]) => {
    if (import.meta.env.DEV) {
      console.warn(...args);
    }
  },
  error: (...args: any[]) => {
    // Always log errors, even in production
    console.error(...args);
  },
  debug: (...args: any[]) => {
    if (import.meta.env.DEV) {
      console.debug(...args);
    }
  }
};
