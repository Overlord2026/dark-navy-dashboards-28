import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

export const SecurityHeaders = () => {
  useEffect(() => {
    // Client-side security measures
    
    // Disable right-click in production (optional)
    const handleContextMenu = (e: MouseEvent) => {
      if (process.env.NODE_ENV === 'production') {
        e.preventDefault();
      }
    };
    
    // Disable certain keyboard shortcuts in production (optional)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (process.env.NODE_ENV === 'production') {
        // Disable F12, Ctrl+Shift+I, Ctrl+U, etc.
        if (
          e.key === 'F12' ||
          (e.ctrlKey && e.shiftKey && e.key === 'I') ||
          (e.ctrlKey && e.key === 'u')
        ) {
          e.preventDefault();
        }
      }
    };
    
    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    
    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <Helmet>
      {/* Content Security Policy */}
      <meta
        httpEquiv="Content-Security-Policy"
        content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://checkout.stripe.com https://www.google.com https://www.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://*.supabase.co https://api.stripe.com https://checkout.stripe.com wss://*.supabase.co; frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://checkout.stripe.com; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;"
      />
      
      {/* X-Frame-Options - Prevent clickjacking */}
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      
      {/* X-Content-Type-Options - Prevent MIME type sniffing */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      
      {/* X-XSS-Protection - Enable XSS protection */}
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      
      {/* Referrer Policy - Control referrer information */}
      <meta name="referrer" content="strict-origin-when-cross-origin" />
      
      {/* HTTP Strict Transport Security (if served over HTTPS) */}
      <meta
        httpEquiv="Strict-Transport-Security"
        content="max-age=31536000; includeSubDomains; preload"
      />
      
      {/* Permissions Policy - Control browser features */}
      <meta
        httpEquiv="Permissions-Policy"
        content="camera=(), microphone=(), geolocation=(), payment=(self), usb=(), bluetooth=(), magnetometer=(), gyroscope=(), accelerometer=()"
      />
      
      {/* Cross-Origin-Embedder-Policy */}
      <meta httpEquiv="Cross-Origin-Embedder-Policy" content="credentialless" />
      
      {/* Cross-Origin-Opener-Policy */}
      <meta httpEquiv="Cross-Origin-Opener-Policy" content="same-origin" />
      
      {/* Cross-Origin-Resource-Policy */}
      <meta httpEquiv="Cross-Origin-Resource-Policy" content="same-origin" />
    </Helmet>
  );
};

// Client-side security utilities
export const SecurityUtils = {
  // Check if running in secure context
  isSecureContext: () => {
    return window.isSecureContext;
  },
  
  // Check for common development tools
  detectDevTools: () => {
    let devtools = {
      open: false,
      orientation: null as 'vertical' | 'horizontal' | null
    };
    
    setInterval(() => {
      if (window.outerHeight - window.innerHeight > 200) {
        devtools.open = true;
        devtools.orientation = 'horizontal';
        console.warn('Developer tools detected');
      } else if (window.outerWidth - window.innerWidth > 200) {
        devtools.open = true;
        devtools.orientation = 'vertical';
        console.warn('Developer tools detected');
      } else {
        devtools.open = false;
        devtools.orientation = null;
      }
    }, 500);
    
    return devtools;
  },
  
  // Basic obfuscation for sensitive data in logs
  obfuscate: (str: string, showLength = 4) => {
    if (!str || str.length <= showLength) return '***';
    return str.substring(0, showLength) + '*'.repeat(Math.max(4, str.length - showLength));
  },
  
  // Check for suspicious browser extensions
  checkForSuspiciousExtensions: () => {
    const suspiciousKeywords = [
      'extension',
      'chrome-extension',
      'moz-extension',
      'browser-extension'
    ];
    
    return Array.from(document.scripts).some(script => 
      suspiciousKeywords.some(keyword => 
        script.src.includes(keyword)
      )
    );
  },
  
  // Simple integrity check for critical DOM elements
  checkDOMIntegrity: (selector: string, expectedContent?: string) => {
    const element = document.querySelector(selector);
    if (!element) return false;
    
    if (expectedContent) {
      return element.textContent?.includes(expectedContent) || false;
    }
    
    return true;
  }
};

// Hook for security monitoring
export const useSecurityMonitoring = () => {
  useEffect(() => {
    const startMonitoring = () => {
      // Monitor for suspicious activities
      let suspiciousActivity = 0;
      
      // Monitor rapid clicks
      let clickCount = 0;
      const handleClick = () => {
        clickCount++;
        setTimeout(() => clickCount--, 1000);
        
        if (clickCount > 10) {
          suspiciousActivity++;
          console.warn('Rapid clicking detected');
        }
      };
      
      // Monitor for automated behavior
      let keyCount = 0;
      const handleKeyPress = () => {
        keyCount++;
        setTimeout(() => keyCount--, 1000);
        
        if (keyCount > 20) {
          suspiciousActivity++;
          console.warn('Rapid typing detected');
        }
      };
      
      // Add listeners
      document.addEventListener('click', handleClick);
      document.addEventListener('keypress', handleKeyPress);
      
      // Check for browser automation tools
      if (
        // @ts-ignore
        window.navigator.webdriver ||
        // @ts-ignore
        window.callPhantom ||
        // @ts-ignore
        window._phantom ||
        // @ts-ignore
        window.phantom
      ) {
        console.warn('Automation tool detected');
        suspiciousActivity++;
      }
      
      return () => {
        document.removeEventListener('click', handleClick);
        document.removeEventListener('keypress', handleKeyPress);
      };
    };
    
    const cleanup = startMonitoring();
    return cleanup;
  }, []);
};