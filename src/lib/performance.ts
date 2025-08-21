// Performance optimization utilities
export const performanceUtils = {
  // Lazy loading images
  lazyLoadImages: () => {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || '';
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  },

  // Preload critical resources
  preloadCriticalResources: () => {
    // Preload critical CSS
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = '/src/index.css';
    document.head.appendChild(link);
  },

  // Optimize bundle loading
  optimizeBundleLoading: () => {
    // Add resource hints for better loading
    const dns = document.createElement('link');
    dns.rel = 'dns-prefetch';
    dns.href = 'https://api.example.com';
    document.head.appendChild(dns);
  },

  // Monitor Core Web Vitals
  monitorWebVitals: () => {
    // LCP - Largest Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // FID - First Input Delay  
    try {
      new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          if (entry.processingStart && entry.startTime) {
            console.log('FID:', entry.processingStart - entry.startTime);
          }
        });
      }).observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.warn('FID monitoring not available:', e);
    }

    // CLS - Cumulative Layout Shift
    let clsValue = 0;
    new PerformanceObserver((list) => {
      list.getEntries().forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          console.log('CLS:', clsValue);
        }
      });
    }).observe({ entryTypes: ['layout-shift'] });
  }
};

// Initialize performance optimizations
export const initializePerformanceOptimizations = () => {
  // Run on DOM content loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      performanceUtils.lazyLoadImages();
      performanceUtils.preloadCriticalResources();
      performanceUtils.optimizeBundleLoading();
      performanceUtils.monitorWebVitals();
    });
  } else {
    performanceUtils.lazyLoadImages();
    performanceUtils.preloadCriticalResources();
    performanceUtils.optimizeBundleLoading();
    performanceUtils.monitorWebVitals();
  }
};