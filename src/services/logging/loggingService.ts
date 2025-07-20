
// Enhanced logging service with Supabase persistence
import { supabase } from '@/integrations/supabase/client';

export type LogLevel = 'debug' | 'info' | 'warning' | 'error' | 'critical';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  source?: string;
  id: string;
  correlationId?: string;
  userId?: string;
  sessionId?: string;
}

export interface LoggingConfig {
  minLevel: LogLevel;
  retentionPeriod: number;
  enableRealTimeAlerts: boolean;
  persistToSupabase: boolean;
}

class LoggingService {
  private logs: LogEntry[] = [];
  private maxEntries = 1000;
  private config: LoggingConfig = {
    minLevel: 'info',
    retentionPeriod: 7,
    enableRealTimeAlerts: false,
    persistToSupabase: true
  };
  private sessionId: string;
  
  constructor() {
    this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  initialize(config: Partial<LoggingConfig>): void {
    this.config = { ...this.config, ...config };
    console.log(`[Logger] Initialized with min level: ${this.config.minLevel}`);
  }
  
  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warning', 'error', 'critical'];
    const configLevelIndex = levels.indexOf(this.config.minLevel);
    const currentLevelIndex = levels.indexOf(level);
    
    return currentLevelIndex >= configLevelIndex;
  }
  
  private async persistToSupabase(entry: LogEntry): Promise<void> {
    if (!this.config.persistToSupabase) return;
    
    try {
      await supabase.from('audit_logs').insert({
        event_type: `log_${entry.level}`,
        status: entry.level === 'error' || entry.level === 'critical' ? 'error' : 'success',
        details: {
          log_id: entry.id,
          message: entry.message,
          source: entry.source,
          data: entry.data,
          correlation_id: entry.correlationId,
          session_id: entry.sessionId,
          timestamp: entry.timestamp,
          level: entry.level
        },
        user_id: entry.userId
      });
    } catch (error) {
      console.error('Failed to persist log to Supabase:', error);
    }
  }
  
  private async addEntry(
    level: LogLevel, 
    message: string, 
    data?: any, 
    source?: string,
    correlationId?: string
  ): Promise<LogEntry> {
    if (!this.shouldLog(level)) {
      return null as unknown as LogEntry;
    }
    
    // Get current user ID if available
    let userId: string | undefined;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id;
    } catch {
      // Ignore auth errors in logging
    }
    
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      source,
      id: crypto.randomUUID(),
      correlationId,
      userId,
      sessionId: this.sessionId
    };
    
    this.logs.unshift(entry);
    
    // Trim if too many entries
    if (this.logs.length > this.maxEntries) {
      this.logs = this.logs.slice(0, this.maxEntries);
    }
    
    // Persist to Supabase asynchronously
    this.persistToSupabase(entry).catch(console.error);
    
    if (level === 'error' || level === 'critical') {
      this.handleCriticalLog(entry);
    }
    
    return entry;
  }
  
  private handleCriticalLog(entry: LogEntry): void {
    if (this.config.enableRealTimeAlerts) {
      console.error(`[ALERT] ${entry.level.toUpperCase()}: ${entry.message}`, entry.data);
      // In a real app, this would send an alert via email, SMS, or other notification system
    }
  }
  
  async debug(message: string, data?: any, source?: string, correlationId?: string): Promise<LogEntry> {
    console.debug(`[${source || 'App'}] ${message}`, data);
    return this.addEntry('debug', message, data, source, correlationId);
  }
  
  async info(message: string, data?: any, source?: string, correlationId?: string): Promise<LogEntry> {
    console.info(`[${source || 'App'}] ${message}`, data);
    return this.addEntry('info', message, data, source, correlationId);
  }
  
  async warning(message: string, data?: any, source?: string, correlationId?: string): Promise<LogEntry> {
    console.warn(`[${source || 'App'}] ${message}`, data);
    return this.addEntry('warning', message, data, source, correlationId);
  }
  
  async error(message: string, error?: any, source?: string, correlationId?: string): Promise<LogEntry> {
    console.error(`[${source || 'App'}] ${message}`, error);
    return this.addEntry('error', message, {
      error: error instanceof Error ? { 
        message: error.message, 
        stack: error.stack,
        name: error.name
      } : error
    }, source, correlationId);
  }
  
  async critical(message: string, error?: any, source?: string, correlationId?: string): Promise<LogEntry> {
    console.error(`[${source || 'App'}] CRITICAL: ${message}`, error);
    return this.addEntry('critical', message, {
      error: error instanceof Error ? { 
        message: error.message, 
        stack: error.stack,
        name: error.name
      } : error
    }, source, correlationId);
  }
  
  getRecentLogs(limit: number = 100): LogEntry[] {
    return this.logs.slice(0, limit);
  }
  
  getLogsByLevel(level: LogLevel, limit: number = 100): LogEntry[] {
    return this.logs
      .filter(entry => entry.level === level)
      .slice(0, limit);
  }
  
  getLogsBySource(source: string, limit: number = 100): LogEntry[] {
    return this.logs
      .filter(entry => entry.source === source)
      .slice(0, limit);
  }
  
  clearLogs(): void {
    this.logs = [];
  }
  
  getConfig(): LoggingConfig {
    return { ...this.config };
  }
  
  updateConfig(config: Partial<LoggingConfig>): void {
    this.config = { ...this.config, ...config };
    console.log(`[Logger] Configuration updated: ${JSON.stringify(this.config)}`);
  }
}

export const logger = new LoggingService();
