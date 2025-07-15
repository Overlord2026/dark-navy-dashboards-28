import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from 'sonner';

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
  speed: number;
  remainingTime: number;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export interface PerformanceMetrics {
  uploadSpeed: number;
  cacheHitRate: number;
  averageResponseTime: number;
  totalOperations: number;
  failedOperations: number;
}

export const usePerformanceOptimization = () => {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    uploadSpeed: 0,
    cacheHitRate: 0,
    averageResponseTime: 0,
    totalOperations: 0,
    failedOperations: 0
  });

  const cache = useRef<Map<string, CacheEntry<any>>>(new Map());
  const operationTimes = useRef<number[]>([]);
  const cacheHits = useRef(0);
  const cacheMisses = useRef(0);

  // Cache management
  const getCachedData = useCallback(<T>(key: string): T | null => {
    const entry = cache.current.get(key);
    
    if (!entry) {
      cacheMisses.current++;
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      cache.current.delete(key);
      cacheMisses.current++;
      return null;
    }

    cacheHits.current++;
    return entry.data;
  }, []);

  const setCachedData = useCallback(<T>(
    key: string,
    data: T,
    expirationMinutes: number = 5
  ) => {
    const expiresAt = Date.now() + (expirationMinutes * 60 * 1000);
    cache.current.set(key, {
      data,
      timestamp: Date.now(),
      expiresAt
    });
  }, []);

  const clearCache = useCallback(() => {
    cache.current.clear();
  }, []);

  // Upload optimization
  const optimizedUpload = useCallback(async (
    file: File,
    uploadFunction: (file: File, onProgress: (progress: UploadProgress) => void) => Promise<any>,
    chunkSize: number = 1024 * 1024 // 1MB chunks
  ) => {
    setIsUploading(true);
    setUploadProgress(null);

    const startTime = Date.now();
    let lastLoaded = 0;
    let lastTime = startTime;

    try {
      const result = await uploadFunction(file, (progress) => {
        const now = Date.now();
        const timeDiff = now - lastTime;
        const bytesDiff = progress.loaded - lastLoaded;
        
        const speed = timeDiff > 0 ? bytesDiff / (timeDiff / 1000) : 0;
        const remainingBytes = progress.total - progress.loaded;
        const remainingTime = speed > 0 ? remainingBytes / speed : 0;

        const optimizedProgress: UploadProgress = {
          ...progress,
          percentage: Math.round((progress.loaded / progress.total) * 100),
          speed,
          remainingTime
        };

        setUploadProgress(optimizedProgress);
        lastLoaded = progress.loaded;
        lastTime = now;
      });

      const endTime = Date.now();
      const totalTime = endTime - startTime;
      
      // Update metrics
      setMetrics(prev => ({
        ...prev,
        uploadSpeed: file.size / (totalTime / 1000),
        totalOperations: prev.totalOperations + 1,
        averageResponseTime: (prev.averageResponseTime * prev.totalOperations + totalTime) / (prev.totalOperations + 1)
      }));

      operationTimes.current.push(totalTime);
      
      toast.success(`Upload completed in ${(totalTime / 1000).toFixed(2)}s`);
      return result;

    } catch (error) {
      setMetrics(prev => ({
        ...prev,
        failedOperations: prev.failedOperations + 1
      }));
      
      toast.error('Upload failed');
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  }, []);

  // Operation optimization with caching
  const optimizedOperation = useCallback(async <T>(
    key: string,
    operation: () => Promise<T>,
    cacheMinutes: number = 5,
    showProgress: boolean = true
  ): Promise<T> => {
    const startTime = Date.now();
    
    // Check cache first
    const cachedData = getCachedData<T>(key);
    if (cachedData) {
      if (showProgress) {
        toast.success('Data loaded from cache');
      }
      return cachedData;
    }

    try {
      if (showProgress) {
        toast.info('Loading data...');
      }

      const result = await operation();
      
      // Cache the result
      setCachedData(key, result, cacheMinutes);
      
      const endTime = Date.now();
      const totalTime = endTime - startTime;
      
      // Update metrics
      setMetrics(prev => ({
        ...prev,
        totalOperations: prev.totalOperations + 1,
        averageResponseTime: (prev.averageResponseTime * prev.totalOperations + totalTime) / (prev.totalOperations + 1)
      }));

      operationTimes.current.push(totalTime);
      
      if (showProgress) {
        toast.success(`Operation completed in ${(totalTime / 1000).toFixed(2)}s`);
      }
      
      return result;

    } catch (error) {
      setMetrics(prev => ({
        ...prev,
        failedOperations: prev.failedOperations + 1
      }));
      
      throw error;
    }
  }, [getCachedData, setCachedData]);

  // Debounced operation
  const debouncedOperation = useCallback((
    operation: () => void,
    delay: number = 500
  ) => {
    const timeoutId = setTimeout(operation, delay);
    return () => clearTimeout(timeoutId);
  }, []);

  // Batch operations
  const batchOperation = useCallback(async <T, R>(
    items: T[],
    operation: (item: T) => Promise<R>,
    batchSize: number = 10,
    delayBetweenBatches: number = 100
  ): Promise<R[]> => {
    const results: R[] = [];
    
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const batchResults = await Promise.all(batch.map(operation));
      results.push(...batchResults);
      
      // Add delay between batches to prevent overwhelming the system
      if (i + batchSize < items.length) {
        await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
      }
    }
    
    return results;
  }, []);

  // Update cache hit rate
  useEffect(() => {
    const totalCacheRequests = cacheHits.current + cacheMisses.current;
    const hitRate = totalCacheRequests > 0 ? (cacheHits.current / totalCacheRequests) * 100 : 0;
    
    setMetrics(prev => ({
      ...prev,
      cacheHitRate: hitRate
    }));
  }, []);

  const getPerformanceReport = useCallback(() => {
    const totalCacheRequests = cacheHits.current + cacheMisses.current;
    const averageUploadSpeed = metrics.uploadSpeed / 1024 / 1024; // MB/s
    
    return {
      ...metrics,
      cacheHitRate: Math.round(metrics.cacheHitRate),
      averageUploadSpeed: Math.round(averageUploadSpeed * 100) / 100,
      totalCacheRequests,
      cacheHits: cacheHits.current,
      cacheMisses: cacheMisses.current,
      recentOperationTimes: operationTimes.current.slice(-10),
      cacheSize: cache.current.size
    };
  }, [metrics]);

  return {
    uploadProgress,
    isUploading,
    metrics,
    optimizedUpload,
    optimizedOperation,
    debouncedOperation,
    batchOperation,
    getCachedData,
    setCachedData,
    clearCache,
    getPerformanceReport
  };
};