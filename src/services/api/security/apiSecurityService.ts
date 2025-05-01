
/**
 * API Security Service
 * 
 * Central service for API security configuration and monitoring.
 */

import { createApiClient, ApiClientOptions } from '../client/apiClientFactory';
import { CircuitBreaker } from '../resilience/circuitBreaker';
import { logger } from '@/services/logging/loggingService';
import { SensitiveDataType, MaskingConfig } from './piiProtection';

/**
 * API security service configuration
 */
interface ApiSecurityConfig {
  defaultTimeout: number;
  defaultRetries: number;
  circuits: Record<string, {
    threshold: number;
    resetTimeout: number;
  }>;
  rateLimits: Record<string, {
    maxRequests: number;
    windowMs: number;
  }>;
}

/**
 * Default security configuration
 */
const DEFAULT_CONFIG: ApiSecurityConfig = {
  defaultTimeout: 10000,
  defaultRetries: 3,
  circuits: {
    default: {
      threshold: 5,
      resetTimeout: 30000
    }
  },
  rateLimits: {
    default: {
      maxRequests: 100,
      windowMs: 60000 // 1 minute
    }
  }
};

/**
 * API Security Service for managing secure API clients and monitoring
 */
export class ApiSecurityService {
  private config: ApiSecurityConfig;
  private clients: Record<string, any> = {};
  private circuitBreakers: Record<string, CircuitBreaker> = {};
  private rateLimiters: Record<string, {
    requests: number;
    resetTime: number;
  }> = {};

  /**
   * Creates a new API security service
   * @param config Configuration options
   */
  constructor(config: Partial<ApiSecurityConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    logger.info('API Security Service initialized', {
      defaultTimeout: this.config.defaultTimeout,
      defaultRetries: this.config.defaultRetries
    }, 'ApiSecurity');
  }

  /**
   * Create a secure API client for a specific service
   * @param name Service name
   * @param options API client options
   * @returns Secure API client
   */
  createClient(name: string, options: ApiClientOptions) {
    // Apply default circuit breaker config for this service
    const circuitConfig = this.config.circuits[name] || this.config.circuits.default;
    
    // Set up default configurations
    const clientOptions: ApiClientOptions = {
      ...options,
      timeout: options.timeout || this.config.defaultTimeout,
      retryConfig: {
        retries: this.config.defaultRetries,
        ...options.retryConfig
      },
      circuitBreakerConfig: {
        failureThreshold: circuitConfig.threshold,
        resetTimeout: circuitConfig.resetTimeout,
        name,
        ...options.circuitBreakerConfig
      }
    };
    
    // Create the client
    const client = createApiClient(clientOptions);
    
    // Store client and circuit breaker for monitoring
    this.clients[name] = client;
    if ((client as any).circuitBreaker) {
      this.circuitBreakers[name] = (client as any).circuitBreaker;
    }
    
    logger.info(`Created secure API client for ${name}`, {
      baseURL: options.baseURL,
      timeout: clientOptions.timeout,
      retries: clientOptions.retryConfig?.retries
    }, 'ApiSecurity');
    
    return client;
  }

  /**
   * Get circuit breaker status for all services
   * @returns Circuit breaker stats
   */
  getCircuitStatus() {
    const status: Record<string, any> = {};
    
    Object.entries(this.circuitBreakers).forEach(([name, circuit]) => {
      status[name] = circuit.getStats();
    });
    
    return status;
  }

  /**
   * Reset a specific circuit breaker
   * @param name Service name
   */
  resetCircuit(name: string) {
    const circuit = this.circuitBreakers[name];
    if (circuit) {
      circuit.reset();
      logger.info(`Reset circuit breaker for ${name}`, {}, 'ApiSecurity');
    }
  }

  /**
   * Check if a request would exceed rate limits
   * @param name Service name
   * @returns Whether the request is allowed
   */
  checkRateLimit(name: string): boolean {
    const limit = this.config.rateLimits[name] || this.config.rateLimits.default;
    const now = Date.now();
    
    // Initialize rate limiter if not exists
    if (!this.rateLimiters[name]) {
      this.rateLimiters[name] = {
        requests: 0,
        resetTime: now + limit.windowMs
      };
    }
    
    const limiter = this.rateLimiters[name];
    
    // Reset if window expired
    if (now > limiter.resetTime) {
      limiter.requests = 0;
      limiter.resetTime = now + limit.windowMs;
    }
    
    // Check if limit exceeded
    if (limiter.requests >= limit.maxRequests) {
      logger.warning(`Rate limit exceeded for ${name}`, {
        service: name,
        currentRequests: limiter.requests,
        limit: limit.maxRequests
      }, 'ApiSecurity');
      
      return false;
    }
    
    // Increment request count
    limiter.requests++;
    return true;
  }

  /**
   * Get common sensitive data masking configurations
   * @returns Default masking configurations
   */
  getDefaultMaskingConfigs(): Record<string, MaskingConfig> {
    return {
      'user.email': { type: SensitiveDataType.EMAIL },
      'user.name': { type: SensitiveDataType.NAME },
      'user.phone': { type: SensitiveDataType.PHONE },
      'user.address': { type: SensitiveDataType.ADDRESS },
      'payment.cardNumber': { type: SensitiveDataType.CREDIT_CARD },
      'payment.accountNumber': { type: SensitiveDataType.ACCOUNT_NUMBER },
      'authentication.token': { 
        type: SensitiveDataType.CUSTOM,
        pattern: /./g,
        replacement: '[REDACTED TOKEN]'
      },
      'authentication.password': { 
        type: SensitiveDataType.CUSTOM,
        pattern: /./g,
        replacement: '[REDACTED PASSWORD]'
      }
    };
  }
}

// Export singleton instance
export const apiSecurity = new ApiSecurityService();
