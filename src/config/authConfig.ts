
/**
 * Authentication configuration for compliance with financial services requirements
 * - Configures OAuth/OpenID Connect providers
 * - Sets security parameters for authentication flows
 * - Implements MFA requirements
 */

export const authConfig = {
  // OAuth provider configurations
  providers: {
    google: {
      enabled: true,
      clientId: '', // Set via environment or secure config
      redirectUrl: `${window.location.origin}/auth/callback`,
      scopes: ['email', 'profile'],
    },
    microsoft: {
      enabled: true,
      tenantId: '', // Set via environment or secure config
      clientId: '', // Set via environment or secure config
      redirectUrl: `${window.location.origin}/auth/callback`,
      scopes: ['openid', 'profile', 'email', 'User.Read'],
    },
  },
  
  // MFA Configuration 
  mfa: {
    required: true,
    graceLogin: false, // Require MFA on first login
    rememberDevice: {
      enabled: true,
      durationDays: 30,
    },
    methods: {
      totp: true, // Time-based one-time password
      sms: true,  // SMS verification
      email: true, // Email verification
    }
  },
  
  // Session security settings
  session: {
    timeoutMinutes: 30,
    absoluteTimeoutHours: 12,
    renewalThresholdMinutes: 5,
    // Cookie security settings for JWT
    cookies: {
      sameSite: 'strict',
      secure: true,
      httpOnly: true,
    }
  },
  
  // Password policy
  passwordPolicy: {
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    preventPasswordReuse: 5, // Last 5 passwords cannot be reused
    maxAge: 90, // Password expires after 90 days
  }
};
