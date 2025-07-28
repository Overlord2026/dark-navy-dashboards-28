import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';

interface PasswordStrengthMeterProps {
  password: string;
  className?: string;
}

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
  met: boolean;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ 
  password, 
  className = '' 
}) => {
  const requirements: PasswordRequirement[] = [
    {
      label: 'At least 12 characters',
      test: (pwd) => pwd.length >= 12,
      met: password.length >= 12
    },
    {
      label: 'Contains uppercase letter',
      test: (pwd) => /[A-Z]/.test(pwd),
      met: /[A-Z]/.test(password)
    },
    {
      label: 'Contains lowercase letter',
      test: (pwd) => /[a-z]/.test(pwd),
      met: /[a-z]/.test(password)
    },
    {
      label: 'Contains number',
      test: (pwd) => /\d/.test(pwd),
      met: /\d/.test(password)
    },
    {
      label: 'Contains special character',
      test: (pwd) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
      met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    },
    {
      label: 'No common patterns',
      test: (pwd) => {
        const commonPatterns = [
          /123456/,
          /password/i,
          /qwerty/i,
          /abc123/i,
          /(.)\1{2,}/ // repeated characters
        ];
        return !commonPatterns.some(pattern => pattern.test(pwd));
      },
      met: (() => {
        const commonPatterns = [
          /123456/,
          /password/i,
          /qwerty/i,
          /abc123/i,
          /(.)\1{2,}/
        ];
        return !commonPatterns.some(pattern => pattern.test(password));
      })()
    }
  ];

  const metRequirements = requirements.filter(req => req.met).length;
  const strengthPercentage = (metRequirements / requirements.length) * 100;

  const getStrengthLabel = () => {
    if (metRequirements === 0) return { label: 'Very Weak', color: 'bg-red-500' };
    if (metRequirements <= 2) return { label: 'Weak', color: 'bg-red-400' };
    if (metRequirements <= 4) return { label: 'Fair', color: 'bg-yellow-500' };
    if (metRequirements <= 5) return { label: 'Good', color: 'bg-blue-500' };
    return { label: 'Strong', color: 'bg-green-500' };
  };

  const strength = getStrengthLabel();

  const calculateEntropy = (pwd: string): number => {
    if (!pwd) return 0;
    
    let charset = 0;
    if (/[a-z]/.test(pwd)) charset += 26;
    if (/[A-Z]/.test(pwd)) charset += 26;
    if (/\d/.test(pwd)) charset += 10;
    if (/[^a-zA-Z0-9]/.test(pwd)) charset += 32;
    
    return Math.log2(Math.pow(charset, pwd.length));
  };

  const entropy = calculateEntropy(password);
  const isEntropyGood = entropy >= 60; // Good entropy threshold

  return (
    <div className={`space-y-3 ${className}`}>
      {password && (
        <>
          {/* Strength Indicator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Password Strength</span>
              <Badge 
                variant="outline" 
                className={`${strength.color.replace('bg-', 'border-')} ${strength.color.replace('bg-', 'text-')}`}
              >
                {strength.label}
              </Badge>
            </div>
            
            <Progress 
              value={strengthPercentage} 
              className="h-2"
              // Custom color based on strength
              style={{
                background: '#f1f5f9'
              }}
            />
          </div>

          {/* Entropy Display */}
          <div className="flex items-center justify-between text-sm">
            <span>Entropy: {entropy.toFixed(1)} bits</span>
            <div className="flex items-center gap-1">
              {isEntropyGood ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <span className={isEntropyGood ? 'text-green-600' : 'text-red-600'}>
                {isEntropyGood ? 'Good' : 'Weak'}
              </span>
            </div>
          </div>

          {/* Requirements Checklist */}
          <div className="space-y-1">
            <span className="text-sm font-medium">Requirements:</span>
            <div className="grid grid-cols-1 gap-1">
              {requirements.map((req, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  {req.met ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className={req.met ? 'text-green-700' : 'text-red-700'}>
                    {req.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Security Tips */}
          {strengthPercentage < 100 && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Security Tips:</strong>
              </p>
              <ul className="text-xs text-blue-700 mt-1 space-y-1">
                <li>• Use a unique password for this account</li>
                <li>• Consider using a passphrase with random words</li>
                <li>• Enable two-factor authentication when available</li>
                <li>• Use a password manager to generate strong passwords</li>
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};