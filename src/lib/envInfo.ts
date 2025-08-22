// Public environment variables (VITE_ only)
export function getPublicEnv(): { [key: string]: string } {
  const env: { [key: string]: string } = {};
  
  // Only expose VITE_ prefixed environment variables
  Object.keys(import.meta.env).forEach(key => {
    if (key.startsWith('VITE_')) {
      const cleanKey = key.replace('VITE_', '');
      let value = import.meta.env[key];
      
      // Mask sensitive-looking values
      if (/(secret|token|key|pwd|pass)/i.test(key)) {
        value = '***';
      } else if (typeof value === 'string' && value.length > 64) {
        // Truncate very long values to avoid UI overflow
        value = value.substring(0, 61) + '...';
      }
      
      env[cleanKey] = value;
    }
  });
  
  return env;
}