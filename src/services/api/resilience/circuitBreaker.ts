
/**
 * Circuit Breaker Implementation
 * 
 * Provides resilience patterns to protect against cascading failures
 * when external services experience issues.
 */

import { logger } from '@/services/logging/loggingService';
import { createSafeError } from '../security/piiProtection';

/**
 * Circuit states
 */
export enum CircuitState {
  CLOSED = 'CLOSED',   // Normal operation, requests pass through
  OPEN = 'OPEN',       // Circuit is open, requests fail fast
  HALF_OPEN = 'HALF_OPEN' // Testing if service recovered
}

export interface CircuitBreakerOptions {
  failureThreshold: number;     // Number of failures before opening
  resetTimeout: number;         // Time in ms before trying half-open state
  timeout?: number;             // Request timeout in ms
  monitorInterval?: number;     // Health check interval
  name?: string;                // Circuit name for logging
}

export interface CircuitBreakerStats {
  state: CircuitState;
  failures: number;
  successes: number;
  lastFailure: Date | null;
  lastSuccess: Date | null;
  lastStateChange: Date | null;
}

/**
 * Circuit breaker implementation to prevent cascading failures
 */
export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failures: number = 0;
  private successes: number = 0;
  private lastFailure: Date | null = null;
  private lastSuccess: Date | null = null;
  private lastStateChange: Date | null = null;
  private resetTimer: any = null;
  private options: CircuitBreakerOptions;

  constructor(options: CircuitBreakerOptions) {
    this.options = {
      failureThreshold: 5,
      resetTimeout: 30000, // 30 seconds
      timeout: 10000,      // 10 seconds
      monitorInterval: 60000, // 1 minute
      name: 'default',
      ...options
    };
    
    this.logCircuitState('Circuit breaker initialized');
  }

  /**
   * Execute a function with circuit breaker protection
   * @param fn Function to execute
   * @param args Arguments to pass to function
   * @returns Result of the function or error
   */
  async execute<T>(fn: (...args: any[]) => Promise<T>, ...args: any[]): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      logger.warning(`Circuit ${this.options.name} is OPEN - fast failing request`, {
        circuit: this.options.name,
        state: this.state
      }, 'CircuitBreaker');
      
      throw new Error(`Service unavailable (circuit ${this.options.name} is OPEN)`);
    }
    
    try {
      // Execute with timeout
      const result = await this.executeWithTimeout(fn, ...args);
      
      // Record success
      this.recordSuccess();
      return result;
    } catch (error) {
      // Record failure
      this.recordFailure(error);
      throw error;
    }
  }

  /**
   * Execute a function with a timeout
   */
  private async executeWithTimeout<T>(fn: (...args: any[]) => Promise<T>, ...args: any[]): Promise<T> {
    if (!this.options.timeout) {
      return fn(...args);
    }
    
    return new Promise<T>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Request timed out after ${this.options.timeout}ms`));
      }, this.options.timeout);
      
      fn(...args)
        .then(result => {
          clearTimeout(timeoutId);
          resolve(result);
        })
        .catch(error => {
          clearTimeout(timeoutId);
          reject(error);
        });
    });
  }

  /**
   * Record a successful request
   */
  private recordSuccess(): void {
    this.successes += 1;
    this.lastSuccess = new Date();
    
    // If we're half open, we can close the circuit again
    if (this.state === CircuitState.HALF_OPEN) {
      this.transitionTo(CircuitState.CLOSED);
      logger.info(`Circuit ${this.options.name} is now CLOSED after successful test request`, {
        circuit: this.options.name,
        state: this.state
      }, 'CircuitBreaker');
    }
  }

  /**
   * Record a failed request
   */
  private recordFailure(error: any): void {
    this.failures += 1;
    this.lastFailure = new Date();
    
    const safeError = createSafeError(error);
    logger.error(`Circuit ${this.options.name} recorded failure: ${safeError.message}`, 
      { circuit: this.options.name, failures: this.failures, error: safeError }, 
      'CircuitBreaker'
    );
    
    // Check if we need to open the circuit
    if (this.state === CircuitState.CLOSED && this.failures >= this.options.failureThreshold) {
      this.transitionTo(CircuitState.OPEN);
      
      // Schedule reset
      this.resetTimer = setTimeout(() => {
        this.attemptReset();
      }, this.options.resetTimeout);
    }
  }

  /**
   * Transition to a new state
   */
  private transitionTo(newState: CircuitState): void {
    this.state = newState;
    this.lastStateChange = new Date();
    this.logCircuitState(`Circuit ${this.options.name} state changed to ${newState}`);
    
    // Reset counters on state change
    if (newState === CircuitState.CLOSED) {
      this.failures = 0;
    } else if (newState === CircuitState.HALF_OPEN) {
      this.successes = 0;
    }
  }

  /**
   * Attempt to reset the circuit (transition to half-open)
   */
  private attemptReset(): void {
    if (this.state === CircuitState.OPEN) {
      this.transitionTo(CircuitState.HALF_OPEN);
      logger.info(`Circuit ${this.options.name} is now HALF_OPEN and testing the service`, {
        circuit: this.options.name,
        state: this.state
      }, 'CircuitBreaker');
    }
  }

  /**
   * Log the current circuit state
   */
  private logCircuitState(message: string): void {
    logger.info(message, {
      circuit: this.options.name,
      state: this.state,
      failures: this.failures,
      successes: this.successes
    }, 'CircuitBreaker');
  }

  /**
   * Get current circuit statistics
   */
  getStats(): CircuitBreakerStats {
    return {
      state: this.state,
      failures: this.failures,
      successes: this.successes,
      lastFailure: this.lastFailure,
      lastSuccess: this.lastSuccess,
      lastStateChange: this.lastStateChange
    };
  }

  /**
   * Reset the circuit breaker state
   */
  reset(): void {
    this.failures = 0;
    this.successes = 0;
    
    if (this.resetTimer) {
      clearTimeout(this.resetTimer);
      this.resetTimer = null;
    }
    
    this.transitionTo(CircuitState.CLOSED);
    logger.info(`Circuit ${this.options.name} has been manually reset`, {
      circuit: this.options.name,
      state: this.state
    }, 'CircuitBreaker');
  }
}
