import { useEffect, useState } from 'react';
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

  useEffect(() => {
    checkExtensions().then(({ graphqlOk, vaultOk }) => {
      setHealth({ graphqlOk, vaultOk });
      setError(null);
      setIsLoading(false);
    }).catch((err) => {
      console.error('Extension health check failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setHealth({ graphqlOk: false, vaultOk: false });
      setIsLoading(false);
    });
  }, []);

  const hasIssues = health ? (
    !health.graphqlOk || !health.vaultOk
  ) : false;

  return {
    health,
    isLoading,
    error,
    hasIssues
  };
}