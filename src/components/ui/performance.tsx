import * as React from "react"

// Lazy load wrapper with intersection observer
export function LazyWrapper({ 
  children, 
  fallback = <div className="h-32 bg-muted animate-pulse rounded" />,
  rootMargin = "50px"
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
}) {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref}>
      {isVisible ? children : fallback}
    </div>
  );
}

// Performance optimized list renderer
export function VirtualizedList<T>({ 
  items, 
  renderItem, 
  itemHeight = 60,
  containerHeight = 400
}: {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight?: number;
  containerHeight?: number;
}) {
  const [scrollTop, setScrollTop] = React.useState(0);
  
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );
  
  const visibleItems = items.slice(startIndex, endIndex);
  const offsetY = startIndex * itemHeight;
  
  return (
    <div 
      className="overflow-auto" 
      style={{ height: containerHeight }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
      role="list"
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div key={startIndex + index} style={{ height: itemHeight }} role="listitem">
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Preload critical resources
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

// Critical CSS inlining utility
export function CriticalCSS() {
  React.useEffect(() => {
    // Defer non-critical CSS
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]:not([data-critical])');
    stylesheets.forEach((sheet) => {
      const link = sheet as HTMLLinkElement;
      link.media = 'print';
      link.onload = () => {
        link.media = 'all';
      };
    });
  }, []);

  return null;
}