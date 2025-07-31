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
        return new Promise((resolve) => {
          if (hcaptchaRef.current) {
            hcaptchaRef.current.execute({ async: true }).then((response) => {
              if (response && response.response) {
                resolve(response.response);
              } else {
                resolve(null);
              }
            }).catch(() => {
              resolve(null);
            });
          } else {
            resolve(null);
          }
        });
      },
      resetCaptcha: () => {
        if (hcaptchaRef.current) {
          hcaptchaRef.current.resetCaptcha();
        }
      }
    }));

    return (
      <div className="flex justify-center my-4">
        <HCaptcha
          ref={hcaptchaRef}
          sitekey={HCAPTCHA_SITE_KEY}
          onVerify={onVerify}
          onExpire={onExpire}
          onError={onError}
          size="normal"
          theme="light"
        />
      </div>
    );
  }
);

HCaptchaComponent.displayName = 'HCaptchaComponent';