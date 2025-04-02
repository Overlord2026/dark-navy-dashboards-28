
// Simple in-memory logging service
// In a real app, this would persist to a database or external service

export type LogLevel = 'debug' | 'info' | 'warning' | 'error' | 'critical';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  source?: string;
  id: string;
}

export interface LoggingConfig {
  minLevel: LogLevel;
  retentionPeriod: number; // in days
  enableRealTimeAlerts: boolean;
}

class LoggingService {
  private logs: LogEntry[] = [];
  private maxEntries = 1000; // Limit to prevent memory issues
  private config: LoggingConfig = {
    minLevel: 'info',
    retentionPeriod: 7,
    enableRealTimeAlerts: false
  };
  
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
  
  private addEntry(level: LogLevel, message: string, data?: any, source?: string): LogEntry {
    if (!this.shouldLog(level)) {
      return null as unknown as LogEntry;
    }
    
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      source,
      id: crypto.randomUUID()
    };
    
    this.logs.unshift(entry); // Add to beginning for chronological order
    
    // Trim if too many entries
    if (this.logs.length > this.maxEntries) {
      this.logs = this.logs.slice(0, this.maxEntries);
    }
    
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
  
  debug(message: string, data?: any, source?: string): LogEntry {
    console.debug(`[${source || 'App'}] ${message}`, data);
    return this.addEntry('debug', message, data, source);
  }
  
  info(message: string, data?: any, source?: string): LogEntry {
    console.info(`[${source || 'App'}] ${message}`, data);
    return this.addEntry('info', message, data, source);
  }
  
  warning(message: string, data?: any, source?: string): LogEntry {
    console.warn(`[${source || 'App'}] ${message}`, data);
    return this.addEntry('warning', message, data, source);
  }
  
  error(message: string, error?: any, source?: string): LogEntry {
    console.error(`[${source || 'App'}] ${message}`, error);
    return this.addEntry('error', message, {
      error: error instanceof Error ? { 
        message: error.message, 
        stack: error.stack,
        name: error.name
      } : error
    }, source);
  }
  
  critical(message: string, error?: any, source?: string): LogEntry {
    console.error(`[${source || 'App'}] CRITICAL: ${message}`, error);
    return this.addEntry('critical', message, {
      error: error instanceof Error ? { 
        message: error.message, 
        stack: error.stack,
        name: error.name
      } : error
    }, source);
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
