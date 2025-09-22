import React, { useEffect, ReactNode } from 'react';
import { useAdvancedEmailTriggers } from '@/hooks/useAdvancedEmailTriggers';

interface BehaviorTrackerProps {
  children: ReactNode;
}

export const BehaviorTracker: React.FC<BehaviorTrackerProps> = ({ children }) => {
  const { processTriggers } = useAdvancedEmailTriggers();

  useEffect(() => {
    // Enhanced behavior tracking with data attributes
    const addTrackingAttributes = () => {
      // Track buttons with specific actions
      const buttons = document.querySelectorAll('button');
      buttons.forEach((button) => {
        if (!button.hasAttribute('data-tool-usage')) {
          // Determine tool usage based on button content or parent context
          const buttonText = button.textContent?.toLowerCase() || '';
          const parentCard = button.closest('[data-tool-name]');
          
          if (parentCard) {
            const toolName = parentCard.getAttribute('data-tool-name');
            button.setAttribute('data-tool-usage', toolName || 'generic-tool');
          } else if (buttonText.includes('calculate')) {
            button.setAttribute('data-tool-usage', 'calculator');
          } else if (buttonText.includes('analyze')) {
            button.setAttribute('data-tool-usage', 'analyzer');
          } else if (buttonText.includes('generate')) {
            button.setAttribute('data-tool-usage', 'generator');
          } else if (buttonText.includes('share')) {
            button.setAttribute('data-tool-usage', 'social-share');
          } else if (buttonText.includes('invite')) {
            button.setAttribute('data-tool-usage', 'invite-system');
          } else {
            button.setAttribute('data-tool-usage', 'general-action');
          }
        }
      });

      // Track form submissions
      const forms = document.querySelectorAll('form');
      forms.forEach((form) => {
        if (!form.hasAttribute('data-tool-usage')) {
          const formId = form.id || form.className;
          form.setAttribute('data-tool-usage', `form-${formId}`);
        }
      });

      // Track link clicks to important pages
      const links = document.querySelectorAll('a[href^="/"]');
      links.forEach((link) => {
        if (!link.hasAttribute('data-tool-usage')) {
          const href = link.getAttribute('href') || '';
          if (href.includes('/tools/')) {
            const toolName = href.split('/tools/')[1]?.split('/')[0];
            link.setAttribute('data-tool-usage', `tool-${toolName}`);
          } else if (href.includes('/pricing')) {
            link.setAttribute('data-tool-usage', 'pricing-page');
          } else if (href.includes('/dashboard')) {
            link.setAttribute('data-tool-usage', 'dashboard-nav');
          }
        }
      });
    };

    // Add tracking attributes on mount and when DOM changes
    addTrackingAttributes();
    
    const observer = new MutationObserver(() => {
      addTrackingAttributes();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Track scroll behavior for engagement scoring
    let scrollDepth = 0;
    const trackScrollDepth = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const newScrollDepth = Math.round((scrollTop / documentHeight) * 100);
      
      if (newScrollDepth > scrollDepth && newScrollDepth % 25 === 0) {
        scrollDepth = newScrollDepth;
        
        // Track scroll milestones
        const event = document.createEvent('Event');
        event.initEvent('toolUsage', true, true);
        (event as any).detail = {
          tool_name: `scroll-${scrollDepth}percent`,
          action: 'scroll',
          depth: scrollDepth
        };
        document.dispatchEvent(event);
      }
    };

    // Track time spent on page
    const startTime = Date.now();
    const trackTimeOnPage = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      
      // Track time milestones (30s, 60s, 2min, 5min)
      if ([30, 60, 120, 300].includes(timeSpent)) {
        const event = document.createEvent('Event');
        event.initEvent('toolUsage', true, true);
        (event as any).detail = {
          tool_name: `time-engaged-${timeSpent}s`,
          action: 'time-spent',
          seconds: timeSpent
        };
        document.dispatchEvent(event);
      }
    };

    // Set up event listeners
    window.addEventListener('scroll', trackScrollDepth);
    const timeTracker = setInterval(trackTimeOnPage, 10000); // Check every 10 seconds

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', trackScrollDepth);
      clearInterval(timeTracker);
    };
  }, [processTriggers]);

  return <>{children}</>;
};