
import { toast } from "sonner";
import { LogConfig, LogEntry, LogLevel } from "../diagnostics/types";
import { v4 as uuidv4 } from "uuid";

// Default logging configuration
const DEFAULT_LOG_CONFIG: LogConfig = {
  minLevel: "info",
  retentionPeriod: 7, // 7 days
  maxEntries: 1000,
  enableRealTimeAlerts: true,
  alertThreshold: {
    critical: 1, // Alert on any critical error
    error: 5,    // Alert after 5 errors
    timeWindow: 15, // Within 15 minutes
  }
};

class LoggingService {
  private logs: LogEntry[] = [];
  private config: LogConfig = DEFAULT_LOG_CONFIG;
  private errorCounts: { [key in LogLevel]?: { count: number, timestamp: number }[] } = {};
  private storageKey = "system_diagnostics_logs";
  private configKey = "system_diagnostics_log_config";

  constructor() {
    this.loadLogsFromStorage();
    this.loadConfigFromStorage();
    this.setupPeriodicCleanup();
  }

  // Initialize logging service with configuration
  public initialize(config?: Partial<LogConfig>): void {
    if (config) {
      this.config = { ...this.config, ...config };
      this.saveConfigToStorage();
    }
  }

  // Log a message with specified level
  public log(level: LogLevel, message: string, details?: any, source?: string): void {
    // Only log if level is >= minLevel
    if (!this.shouldLog(level)) return;

    try {
      const error = details instanceof Error ? details : null;
      const entry: LogEntry = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        level,
        message,
        details: error ? undefined : details,
        source,
        stackTrace: error?.stack
      };

      this.logs.push(entry);
      this.saveLogsToStorage();
      
      // Track error counts for alerting
      if (level === 'error' || level === 'critical') {
        this.trackError(level);
      }

      // Check if we should trigger a real-time alert
      if (this.config.enableRealTimeAlerts && (level === 'critical' || level === 'error')) {
        this.checkAlertThresholds(level);
      }

      // Log to console for development
      this.logToConsole(entry);

    } catch (e) {
      console.error("Failed to log message:", e);
    }
  }

  // Convenience methods for different log levels
  public info(message: string, details?: any, source?: string): void {
    this.log('info', message, details, source);
  }

  public warning(message: string, details?: any, source?: string): void {
    this.log('warning', message, details, source);
  }

  public error(message: string, details?: any, source?: string): void {
    this.log('error', message, details, source);
  }

  public critical(message: string, details?: any, source?: string): void {
    this.log('critical', message, details, source);
  }

  // Get logs filtered by level and timeframe
  public getLogs(level?: LogLevel, since?: Date): LogEntry[] {
    let filtered = [...this.logs];
    
    if (level) {
      filtered = filtered.filter(log => log.level === level);
    }
    
    if (since) {
      const sinceTime = since.getTime();
      filtered = filtered.filter(log => new Date(log.timestamp).getTime() >= sinceTime);
    }
    
    return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // Clear logs based on age or all
  public clearLogs(olderThan?: Date): void {
    if (olderThan) {
      const threshold = olderThan.getTime();
      this.logs = this.logs.filter(log => new Date(log.timestamp).getTime() >= threshold);
    } else {
      this.logs = [];
    }
    this.saveLogsToStorage();
  }

  // Update logging configuration
  public updateConfig(config: Partial<LogConfig>): void {
    this.config = { ...this.config, ...config };
    this.saveConfigToStorage();
  }

  // Get current configuration
  public getConfig(): LogConfig {
    return { ...this.config };
  }

  // Internal method to determine if message should be logged based on level
  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['info', 'warning', 'error', 'critical'];
    const minLevelIndex = levels.indexOf(this.config.minLevel);
    const currentLevelIndex = levels.indexOf(level);
    
    return currentLevelIndex >= minLevelIndex;
  }

  // Track error occurrences for alert thresholds
  private trackError(level: LogLevel): void {
    const now = Date.now();
    const windowMs = this.config.alertThreshold.timeWindow * 60 * 1000;
    
    if (!this.errorCounts[level]) {
      this.errorCounts[level] = [];
    }
    
    // Add the current error
    this.errorCounts[level]!.push({ count: 1, timestamp: now });
    
    // Remove errors outside the time window
    this.errorCounts[level] = this.errorCounts[level]!.filter(
      item => (now - item.timestamp) <= windowMs
    );
  }

  // Check if error thresholds are exceeded for alerting
  private checkAlertThresholds(level: LogLevel): void {
    if (!this.config.enableRealTimeAlerts) return;
    
    const counts = this.errorCounts[level];
    if (!counts) return;
    
    const totalCount = counts.reduce((total, item) => total + item.count, 0);
    const threshold = level === 'critical' 
      ? this.config.alertThreshold.critical 
      : this.config.alertThreshold.error;
    
    if (totalCount >= threshold) {
      const alertMessage = `${totalCount} ${level} errors detected in the last ${this.config.alertThreshold.timeWindow} minutes`;
      this.triggerAlert(level, alertMessage);
      
      // Reset count after alerting to prevent continuous alerts
      this.errorCounts[level] = [];
    }
  }

  // Trigger a real-time alert
  private triggerAlert(level: LogLevel, message: string): void {
    if (level === 'critical') {
      toast.error(message, {
        duration: 10000,
        position: "top-center",
      });
    } else {
      toast.warning(message, {
        duration: 6000,
      });
    }
  }

  // Log to console for development purposes
  private logToConsole(entry: LogEntry): void {
    const { level, message, details, source, stackTrace } = entry;
    const timestamp = new Date(entry.timestamp).toLocaleTimeString();
    const sourceInfo = source ? `[${source}]` : '';
    
    switch (level) {
      case 'info':
        console.info(`${timestamp} ${sourceInfo} ${message}`, details || '');
        break;
      case 'warning':
        console.warn(`${timestamp} ${sourceInfo} ${message}`, details || '');
        break;
      case 'error':
      case 'critical':
        console.error(`${timestamp} ${sourceInfo} ${message}`, details || '');
        if (stackTrace) console.error(stackTrace);
        break;
    }
  }

  // Setup periodic cleanup of old logs
  private setupPeriodicCleanup(): void {
    // Check and clean logs once a day
    setInterval(() => {
      const retentionDate = new Date();
      retentionDate.setDate(retentionDate.getDate() - this.config.retentionPeriod);
      this.clearLogs(retentionDate);
    }, 24 * 60 * 60 * 1000); // 24 hours
    
    // Also trim logs if they exceed maxEntries
    if (this.config.maxEntries && this.logs.length > this.config.maxEntries) {
      this.logs = this.logs
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, this.config.maxEntries);
      this.saveLogsToStorage();
    }
  }

  // Save logs to localStorage
  private saveLogsToStorage(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.logs));
    } catch (e) {
      console.error("Failed to save logs to storage:", e);
    }
  }

  // Load logs from localStorage
  private loadLogsFromStorage(): void {
    try {
      const storedLogs = localStorage.getItem(this.storageKey);
      if (storedLogs) {
        this.logs = JSON.parse(storedLogs);
      }
    } catch (e) {
      console.error("Failed to load logs from storage:", e);
      this.logs = [];
    }
  }

  // Save config to localStorage
  private saveConfigToStorage(): void {
    try {
      localStorage.setItem(this.configKey, JSON.stringify(this.config));
    } catch (e) {
      console.error("Failed to save config to storage:", e);
    }
  }

  // Load config from localStorage
  private loadConfigFromStorage(): void {
    try {
      const storedConfig = localStorage.getItem(this.configKey);
      if (storedConfig) {
        this.config = { ...this.config, ...JSON.parse(storedConfig) };
      }
    } catch (e) {
      console.error("Failed to load config from storage:", e);
    }
  }
}

// Create a singleton instance
export const logger = new LoggingService();

// Export log level types for convenience
export const LogLevels = {
  INFO: 'info' as LogLevel,
  WARNING: 'warning' as LogLevel,
  ERROR: 'error' as LogLevel,
  CRITICAL: 'critical' as LogLevel,
};
