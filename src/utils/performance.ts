
// Performance measurement utility
export const measureRouteLoad = (route: string) => {
  const startTime = performance.now();
  console.info(`Loading route: ${route} at ${new Date().toISOString()}`);
  
  // Return a cleanup function to be called when the component unmounts
  return () => {
    const endTime = performance.now();
    const loadTime = endTime - startTime;
    console.info(`Route ${route} loaded in ${loadTime.toFixed(2)}ms`);
    return loadTime;
  };
};

// Error boundary logging helper
export const logErrorToService = (error: Error, componentStack: string, routePath: string) => {
  // In a real app, this would send the error to a logging service
  console.error(`Error in route ${routePath}:`, error);
  console.error(`Component stack:`, componentStack);
  
  // Return a unique error ID for user reference
  return `ERR-${Math.floor(Math.random() * 1000000)}`;
};
