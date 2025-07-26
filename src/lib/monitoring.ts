import { analytics } from './analytics';

// Global error handler
export const setupErrorMonitoring = () => {
  // Catch unhandled errors
  window.addEventListener('error', (event) => {
    analytics.trackError(new Error(event.message), {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      source: 'global_error_handler'
    });
  });

  // Catch unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    analytics.trackError(new Error(event.reason), {
      source: 'unhandled_promise_rejection'
    });
  });

  // Performance monitoring
  if ('PerformanceObserver' in window) {
    try {
      // Monitor page load performance
      const perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            analytics.trackPerformance('page_load_time', navEntry.loadEventEnd - navEntry.loadEventStart);
            analytics.trackPerformance('dom_content_loaded', navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart);
          }
        }
      });
      
      perfObserver.observe({ entryTypes: ['navigation'] });
    } catch (e) {
      console.warn('Performance monitoring not available:', e);
    }
  }
};

// Auth monitoring
export const monitorAuthEvents = () => {
  const originalFetch = window.fetch;
  
  window.fetch = async (...args) => {
    const response = await originalFetch(...args);
    const url = args[0] instanceof Request ? args[0].url : args[0];
    
    // Monitor auth-related requests
    if (typeof url === 'string' && url.includes('/auth/')) {
      if (!response.ok) {
        analytics.trackSecurityEvent('auth_failure', 'medium', {
          url,
          status: response.status,
          statusText: response.statusText
        });
      }
    }
    
    return response;
  };
};

// Database monitoring
export const monitorDatabaseErrors = (error: any, operation: string) => {
  analytics.trackError(error, {
    source: 'database',
    operation,
    severity: 'high'
  });
};

// API monitoring
export const monitorAPIErrors = (error: any, endpoint: string, method: string) => {
  analytics.trackError(error, {
    source: 'api',
    endpoint,
    method,
    severity: 'medium'
  });
};