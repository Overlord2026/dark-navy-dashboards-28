import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ExtensionHealth {
  graphql_version: string;
  graphql_accessible: boolean;
  vault_accessible: boolean;
  graphql_error?: string;
  vault_error?: string;
  checked_at: string;
}

interface UseExtensionHealthResult {
  health: ExtensionHealth | null;
  isLoading: boolean;
  error: string | null;
  hasIssues: boolean;
}

export function useExtensionHealth(): UseExtensionHealthResult {
  const [health, setHealth] = useState<ExtensionHealth | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const { data, error: healthError } = await supabase
          .rpc('check_extension_health');

        if (healthError) {
          throw healthError;
        }

        setHealth(data as unknown as ExtensionHealth);
        setError(null);
      } catch (err) {
        console.error('Extension health check failed:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    checkHealth();
  }, []);

  const hasIssues = health ? (
    !health.graphql_accessible || 
    !health.vault_accessible ||
    health.graphql_version === 'access_denied'
  ) : false;

  return {
    health,
    isLoading,
    error,
    hasIssues
  };
}