import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

// Production Google reCAPTCHA site key - replace with actual key
const RECAPTCHA_SITE_KEY = '6LfYour_Site_Key_Here';

// Check if we're in development mode
const isDevelopment = window.location.hostname === 'localhost' || 
                     window.location.hostname.includes('lovableproject.com') ||
                     window.location.hostname.includes('my.bfocfo.com');

export interface ReCaptchaRef {
  executeAsync: () => Promise<string | null>;
  resetCaptcha: () => void;
}

interface ReCaptchaComponentProps {
  onVerify?: (token: string) => void;
  onExpire?: () => void;
  onError?: (error: string) => void;
}

export const ReCaptchaComponent = forwardRef<ReCaptchaRef, ReCaptchaComponentProps>(
  ({ onVerify, onExpire, onError }, ref) => {
    const recaptchaRef = useRef<ReCAPTCHA>(null);

    useImperativeHandle(ref, () => ({
      executeAsync: async (): Promise<string | null> => {
        // Development mode: Return null to bypass CAPTCHA
        if (isDevelopment) {
          console.log("Development mode: Bypassing Google reCAPTCHA");
          return null;
        }

        // Production mode: Execute real CAPTCHA
        try {
          if (recaptchaRef.current) {
            const token = await recaptchaRef.current.executeAsync();
            return token;
          }
          throw new Error("CAPTCHA widget not available");
        } catch (error) {
          console.error("Google reCAPTCHA execution failed:", error);
          onError?.(error instanceof Error ? error.message : "CAPTCHA failed");
          return null;
        }
      },
      resetCaptcha: () => {
        if (isDevelopment) {
          console.log("Development mode: CAPTCHA reset skipped");
          return;
        }
        
        if (recaptchaRef.current) {
          recaptchaRef.current.reset();
        }
      }
    }));

    // Development mode: Show bypass message
    if (isDevelopment) {
      return (
        <div className="flex justify-center my-4">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
            <div className="text-sm text-amber-700 dark:text-amber-300 text-center">
              🛠️ Development Mode: Google reCAPTCHA Bypassed for QA
            </div>
          </div>
        </div>
      );
    }

    // Production mode: Show real CAPTCHA
    return (
      <div className="flex justify-center my-4">
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={RECAPTCHA_SITE_KEY}
          onVerify={(token) => {
            console.log("Google reCAPTCHA verification successful");
            if (token) {
              onVerify?.(token);
            }
          }}
          onExpired={() => {
            console.log("Google reCAPTCHA expired");
            onExpire?.();
          }}
          onError={() => {
            console.error("Google reCAPTCHA error");
            onError?.("reCAPTCHA verification failed");
          }}
          size="normal"
          theme="light"
        />
      </div>
    );
  }
);

ReCaptchaComponent.displayName = 'ReCaptchaComponent';