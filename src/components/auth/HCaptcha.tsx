import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';

// Production hCAPTCHA site key
const HCAPTCHA_SITE_KEY = 'fca2d59e-fe26-40d2-b1b8-44245aead460';

// Check if we're in development mode
const isDevelopment = window.location.hostname === 'localhost' || 
                     window.location.hostname.includes('lovableproject.com') ||
                     window.location.hostname.includes('my.bfocfo.com');

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
        // Development mode: Return null to bypass CAPTCHA
        if (isDevelopment) {
          console.log("Development mode: Bypassing hCAPTCHA");
          return null;
        }

        // Production mode: Execute real CAPTCHA
        try {
          if (hcaptchaRef.current) {
            // HCaptcha doesn't have executeAsync, it executes automatically
            // We return a promise that resolves when onVerify is called
            return new Promise((resolve, reject) => {
              const timeout = setTimeout(() => {
                reject(new Error("CAPTCHA timeout"));
              }, 30000); // 30 second timeout

              // Store resolve function for onVerify callback
              (hcaptchaRef.current as any)._resolvePromise = (token: string) => {
                clearTimeout(timeout);
                resolve(token);
              };
              
              // Execute CAPTCHA
              hcaptchaRef.current?.execute();
            });
          }
          throw new Error("CAPTCHA widget not available");
        } catch (error) {
          console.error("hCAPTCHA execution failed:", error);
          onError?.(error instanceof Error ? error.message : "CAPTCHA failed");
          return null;
        }
      },
      resetCaptcha: () => {
        if (isDevelopment) {
          console.log("Development mode: CAPTCHA reset skipped");
          return;
        }
        
        if (hcaptchaRef.current) {
          hcaptchaRef.current.resetCaptcha();
        }
      }
    }));

    // Development mode: Show bypass message
    if (isDevelopment) {
      return (
        <div className="flex justify-center my-4">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
            <div className="text-sm text-amber-700 dark:text-amber-300 text-center">
              🛠️ Development Mode: hCAPTCHA Bypassed for QA
            </div>
          </div>
        </div>
      );
    }

    // Production mode: Show real CAPTCHA
    return (
      <div className="flex justify-center my-4">
        <HCaptcha
          ref={hcaptchaRef}
          sitekey={HCAPTCHA_SITE_KEY}
          onVerify={(token) => {
            console.log("hCAPTCHA verification successful");
            onVerify?.(token);
            // Resolve the promise if it exists
            const refCurrent = hcaptchaRef.current as any;
            if (refCurrent?._resolvePromise) {
              refCurrent._resolvePromise(token);
            }
          }}
          onExpire={onExpire}
          onError={(err) => {
            console.error("hCAPTCHA error:", err);
            onError?.(err);
          }}
          size="normal"
          theme="light"
        />
      </div>
    );
  }
);

HCaptchaComponent.displayName = 'HCaptchaComponent';