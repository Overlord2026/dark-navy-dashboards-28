
export interface PasswordPolicyConfig {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  minEntropy: number;
  preventReuse: boolean;
  reuseHistory: number;
}

export const DEFAULT_PASSWORD_POLICY: PasswordPolicyConfig = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  minEntropy: 60, // bits of entropy
  preventReuse: true,
  reuseHistory: 12 // last 12 passwords
};

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'fair' | 'good' | 'strong';
  entropy: number;
}

export class PasswordPolicyValidator {
  private policy: PasswordPolicyConfig;

  constructor(policy: PasswordPolicyConfig = DEFAULT_PASSWORD_POLICY) {
    this.policy = policy;
  }

  validatePassword(password: string, previousPasswords: string[] = []): PasswordValidationResult {
    const errors: string[] = [];
    
    // Length check
    if (password.length < this.policy.minLength) {
      errors.push(`Password must be at least ${this.policy.minLength} characters long`);
    }

    // Character composition checks
    if (this.policy.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (this.policy.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (this.policy.requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (this.policy.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    // Entropy check
    const entropy = this.calculateEntropy(password);
    if (entropy < this.policy.minEntropy) {
      errors.push(`Password complexity is too low (entropy: ${entropy.toFixed(1)}, required: ${this.policy.minEntropy})`);
    }

    // Password reuse check
    if (this.policy.preventReuse && previousPasswords.some(prev => prev === password)) {
      errors.push(`Password cannot be one of your last ${this.policy.reuseHistory} passwords`);
    }

    // Common password check
    if (this.isCommonPassword(password)) {
      errors.push('Password is too common and easily guessable');
    }

    const strength = this.calculateStrength(password, entropy);

    return {
      isValid: errors.length === 0,
      errors,
      strength,
      entropy
    };
  }

  private calculateEntropy(password: string): number {
    const charsetSize = this.getCharsetSize(password);
    return Math.log2(Math.pow(charsetSize, password.length));
  }

  private getCharsetSize(password: string): number {
    let size = 0;
    if (/[a-z]/.test(password)) size += 26;
    if (/[A-Z]/.test(password)) size += 26;
    if (/\d/.test(password)) size += 10;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) size += 32;
    return size;
  }

  private calculateStrength(password: string, entropy: number): 'weak' | 'fair' | 'good' | 'strong' {
    if (entropy < 30) return 'weak';
    if (entropy < 50) return 'fair';
    if (entropy < 70) return 'good';
    return 'strong';
  }

  private isCommonPassword(password: string): boolean {
    const commonPasswords = [
      'password123', '123456789', 'qwerty123', 'admin123',
      'password1', 'welcome123', 'changeme123', 'letmein123'
    ];
    return commonPasswords.includes(password.toLowerCase());
  }
}
