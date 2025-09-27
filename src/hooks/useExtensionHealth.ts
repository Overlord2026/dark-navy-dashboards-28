import { useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ExtensionHealth {
  graphqlOk: boolean;
  vaultOk: boolean;
}

interface UseExtensionHealthResult {
  health: ExtensionHealth | null;
  isLoading: boolean;
  error: string | null;
  hasIssues: boolean;
}

async function checkExtensions() {
  const [{ data: gql }, { data: vault }] = await Promise.all([
    supabase.rpc('graphql_is_configured'),
    supabase.rpc('vault_is_configured')
  ]);
  return { graphqlOk: !!gql, vaultOk: !!vault };
}

export function useExtensionHealth(): UseExtensionHealthResult {
  const [health, setHealth] = useState<ExtensionHealth | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const runningRef = useRef(false);
  const retryCountRef = useRef(0);

  const performHealthCheck = useCallback(async () => {
    // Overlap guard: prevent concurrent calls
    if (runningRef.current) return;
    
    runningRef.current = true;
    setIsLoading(true);
    
    try {
      const result = await checkExtensions();
      setHealth(result);
      setError(null);
      retryCountRef.current = 0; // Reset retry count on success
    } catch (err) {
      console.error('Extension health check failed:', err);
      setHealth({ graphqlOk: false, vaultOk: false });
      setError('Extension check failed');
      retryCountRef.current += 1;
      
      // Exponential backoff for retries (max 3 attempts)
      if (retryCountRef.current < 3) {
        const delay = Math.min(1000 * Math.pow(2, retryCountRef.current), 5000);
        setTimeout(() => performHealthCheck(), delay);
      }
    } finally {
      setIsLoading(false);
      runningRef.current = false;
    }
  }, []);

  useEffect(() => {
    performHealthCheck();
  }, [performHealthCheck]);

  const hasIssues = health ? (
    !health.graphqlOk  // Only show issues if GraphQL is not configured, ignore vault for now
  ) : false;

  return {
    health,
    isLoading,
    error,
    hasIssues
  };
}