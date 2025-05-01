
import { useState, useEffect, useCallback } from 'react';
import { LogEntry } from '@/types/diagnostics/logs';

export function useDiagnosticsLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [logLevels, setLogLevels] = useState<string[]>([
    'error', 'warning', 'info', 'debug', 'success'
  ]);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Function to fetch logs
  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      // Mock data - in a real app this would be an API call
      const mockLogs: LogEntry[] = [
        {
          id: '1',
          level: 'error',
          message: 'API timeout error',
          timestamp: new Date().toISOString(),
          source: 'api-client',
          details: { endpoint: '/users', error: 'Request timed out' }
        },
        {
          id: '2',
          level: 'warning',
          message: 'Slow query performance',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          source: 'database',
          details: { query: 'SELECT * FROM large_table', time: '3.2s' }
        },
        {
          id: '3',
          level: 'info',
          message: 'User logged in successfully',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          source: 'auth-service',
          details: { userId: 'user-123' }
        }
      ];
      
      setLogs(mockLogs);
      filterLogs(mockLogs, selectedLevel, searchTerm);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch logs'));
    } finally {
      setLoading(false);
    }
  }, [selectedLevel, searchTerm]);

  // Filter logs by level and search term
  const filterLogs = useCallback((allLogs: LogEntry[], level: string, term: string) => {
    let filtered = allLogs;
    
    // Filter by level
    if (level !== 'all') {
      filtered = filtered.filter(log => log.level === level);
    }
    
    // Filter by search term
    if (term.trim()) {
      const searchLower = term.toLowerCase();
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(searchLower) ||
        log.source.toLowerCase().includes(searchLower) ||
        (typeof log.details === 'string' && log.details.toLowerCase().includes(searchLower))
      );
    }
    
    setFilteredLogs(filtered);
  }, []);

  // Effect to load logs on component mount
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Effect to filter logs when dependencies change
  useEffect(() => {
    filterLogs(logs, selectedLevel, searchTerm);
  }, [logs, selectedLevel, searchTerm, filterLogs]);

  // Function to clear filters
  const clearFilters = useCallback(() => {
    setSelectedLevel('all');
    setSearchTerm('');
  }, []);

  // Function to refresh logs
  const refreshLogs = useCallback(() => {
    return fetchLogs();
  }, [fetchLogs]);

  // Function to download logs
  const downloadLogs = useCallback(() => {
    try {
      const dataStr = JSON.stringify(logs, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', `logs-${new Date().toISOString()}.json`);
      linkElement.click();
    } catch (err) {
      console.error('Error downloading logs:', err);
    }
  }, [logs]);

  return {
    logs,
    filteredLogs,
    logLevels,
    selectedLevel,
    searchTerm,
    loading,
    error,
    setSearchTerm,
    setSelectedLevel,
    clearFilters,
    downloadLogs,
    refreshLogs
  };
}
