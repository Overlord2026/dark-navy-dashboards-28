import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';

// Production hCAPTCHA site key
const HCAPTCHA_SITE_KEY = 'fca2d59e-fe26-40d2-b1b8-44245aead460';

export interface HCaptchaRef {
  executeAsync: () => Promise<string | null>;
  resetCaptcha: () => void;
}

interface HCaptchaComponentProps {
  onVerify?: (token: string) => void;
  onExpire?: () => void;
  onError?: (error: string) => void;
}

export const HCaptchaComponent = forwardRef<HCaptchaRef, HCaptchaComponentProps>(
  ({ onVerify, onExpire, onError }, ref) => {
    const hcaptchaRef = useRef<HCaptcha>(null);

    useImperativeHandle(ref, () => ({
      executeAsync: async (): Promise<string | null> => {
        // QA MODE: Return dummy token immediately without CAPTCHA
        console.log("QA MODE: hCAPTCHA disabled - returning dummy token");
        return "qa-mode-dummy-token";
      },
      resetCaptcha: () => {
        // QA MODE: No-op
        console.log("QA MODE: hCAPTCHA reset disabled");
      }
    }));

    // QA MODE: Show disabled message instead of CAPTCHA
    return (
      <div className="flex justify-center my-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <div className="text-sm text-blue-700 dark:text-blue-300 text-center">
            🛠️ QA Mode: hCAPTCHA Disabled
          </div>
        </div>
      </div>
    );
  }
);

HCaptchaComponent.displayName = 'HCaptchaComponent';