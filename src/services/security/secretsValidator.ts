
import { logger } from '@/services/logging/loggingService';

export interface SecretValidationResult {
  secretName: string;
  isSecure: boolean;
  source: 'environment' | 'hardcoded' | 'supabase_vault' | 'unsafe';
  severity: 'critical' | 'high' | 'medium' | 'low';
  recommendation: string;
}

export class SecretsValidator {
  private knownSecretPatterns = [
    { name: 'OpenAI API Key', pattern: /sk-[a-zA-Z0-9]{48}/, severity: 'critical' as const },
    { name: 'Stripe Secret Key', pattern: /sk_test_[a-zA-Z0-9]{99}/, severity: 'critical' as const },
    { name: 'Stripe Publishable Key', pattern: /pk_test_[a-zA-Z0-9]{99}/, severity: 'medium' as const },
    { name: 'Supabase Service Role', pattern: /eyJ[a-zA-Z0-9_-]+\.eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/, severity: 'high' as const },
    { name: 'AWS Access Key', pattern: /AKIA[0-9A-Z]{16}/, severity: 'critical' as const },
    { name: 'Google API Key', pattern: /AIza[0-9A-Za-z\\-_]{35}/, severity: 'critical' as const },
    { name: 'Generic API Key', pattern: /[a-zA-Z0-9]{32,}/, severity: 'medium' as const }
  ];

  private unsafeSources = [
    'localStorage',
    'sessionStorage',
    'document.cookie',
    'window',
    'global',
    'process.env'
  ];

  validateSecretSource(secretValue: string, source: string): SecretValidationResult {
    const detectedPattern = this.knownSecretPatterns.find(p => p.pattern.test(secretValue));
    
    const result: SecretValidationResult = {
      secretName: detectedPattern?.name || 'Unknown Secret',
      isSecure: this.isSourceSecure(source),
      source: this.categorizeSource(source),
      severity: detectedPattern?.severity || 'medium',
      recommendation: this.getRecommendation(source, detectedPattern?.name)
    };

    // Log security violation if secret is insecure
    if (!result.isSecure) {
      this.logSecurityViolation(result);
    }

    return result;
  }

  private isSourceSecure(source: string): boolean {
    // Supabase Edge Function environment variables are secure
    if (source.includes('Deno.env.get')) return true;
    
    // Server-side environment variables are secure
    if (source.includes('process.env') && typeof window === 'undefined') return true;
    
    // Client-side sources are generally insecure
    if (typeof window !== 'undefined') return false;
    
    // Hardcoded values are never secure
    if (source.includes('hardcoded') || source.includes('string literal')) return false;
    
    return false;
  }

  private categorizeSource(source: string): SecretValidationResult['source'] {
    if (source.includes('Deno.env.get')) return 'supabase_vault';
    if (source.includes('process.env')) return 'environment';
    if (source.includes('hardcoded') || source.includes('string literal')) return 'hardcoded';
    return 'unsafe';
  }

  private getRecommendation(source: string, secretName?: string): string {
    const baseRecommendation = 'Move secret to Supabase Edge Function environment variables';
    
    if (source.includes('hardcoded')) {
      return `${baseRecommendation} and remove hardcoded value immediately`;
    }
    
    if (source.includes('localStorage') || source.includes('sessionStorage')) {
      return 'Never store sensitive secrets in browser storage. Use secure server-side storage';
    }
    
    if (secretName?.includes('OpenAI')) {
      return 'Move OpenAI API key to Supabase Edge Function secrets and call via edge function';
    }
    
    return baseRecommendation;
  }

  private logSecurityViolation(result: SecretValidationResult): void {
    logger.error(
      `SECURITY ALERT: Insecure secret detected - ${result.secretName}`,
      {
        secretName: result.secretName,
        source: result.source,
        severity: result.severity,
        recommendation: result.recommendation,
        timestamp: new Date().toISOString()
      },
      'SecretsSecurity'
    );

    // In production, this should also trigger alerts/notifications
    if (result.severity === 'critical') {
      console.error('🚨 CRITICAL SECURITY ALERT: Hardcoded secret detected!');
      console.error(`Secret: ${result.secretName}`);
      console.error(`Action required: ${result.recommendation}`);
    }
  }

  scanCodebaseForSecrets(codeContent: string, filePath: string): SecretValidationResult[] {
    const results: SecretValidationResult[] = [];
    
    this.knownSecretPatterns.forEach(pattern => {
      const matches = codeContent.match(new RegExp(pattern.pattern, 'g'));
      if (matches) {
        matches.forEach(match => {
          results.push({
            secretName: `${pattern.name} in ${filePath}`,
            isSecure: false,
            source: 'hardcoded',
            severity: pattern.severity,
            recommendation: `Remove hardcoded ${pattern.name} from ${filePath} and move to Supabase Edge Function secrets`
          });
        });
      }
    });

    return results;
  }

  validateRuntimeSecrets(): Promise<SecretValidationResult[]> {
    return new Promise(resolve => {
      const results: SecretValidationResult[] = [];
      
      // Check for common insecure secret access patterns
      const commonSecretNames = [
        'OPENAI_API_KEY',
        'STRIPE_SECRET_KEY',
        'AWS_ACCESS_KEY_ID',
        'AWS_SECRET_ACCESS_KEY',
        'GOOGLE_API_KEY'
      ];

      commonSecretNames.forEach(secretName => {
        // Check if secret is accessed insecurely
        if (typeof window !== 'undefined') {
          // Client-side check
          const localStorage = window.localStorage.getItem(secretName);
          const sessionStorage = window.sessionStorage.getItem(secretName);
          
          if (localStorage || sessionStorage) {
            results.push({
              secretName,
              isSecure: false,
              source: localStorage ? 'unsafe' : 'unsafe',
              severity: 'critical',
              recommendation: 'Remove secret from browser storage and use server-side edge functions'
            });
          }
        }
      });

      resolve(results);
    });
  }
}

export const secretsValidator = new SecretsValidator();
