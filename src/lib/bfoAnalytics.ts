// Task 8: Typed Analytics Event System for BFO
// Strongly typed event tracking with BfoEvent schema

export type BfoEvent =
  | { name: 'nav.menu_open'; menu: 'families' | 'pros' }
  | { name: 'persona.selected'; realm: 'families' | 'pros'; slug: string }
  | { name: 'dashboard.hero_viewed'; personaSlug?: string }
  | { name: 'guide.opened'; guideId: string; personaSlug?: string }
  | { name: 'calculator.run'; calcId: string; personaSlug?: string; durationMs: number }
  | { name: 'calculator.error'; calcId: string; error: string }
  | { name: 'invite.sent'; targetRole: 'advisor' | 'cpa' | 'attorney' | 'realtor' | 'insurance' }
  | { name: 'doc.uploaded'; docType?: string };

export function track(event: BfoEvent): void {
  // Log to console for now - can be swapped for GA4/Segment/PostHog later
  console.debug('[bfo-analytics]', event);
  
  // Send to PostHog if available
  if (typeof window !== 'undefined' && (window as any).posthog) {
    (window as any).posthog.capture(event.name, {
      ...event,
      timestamp: Date.now(),
      url: window.location.href,
    });
  }
}

// Example usage:
// track({ name: 'nav.menu_open', menu: 'families' });
// track({ name: 'calculator.run', calcId: 'monte-carlo', durationMs: 1250 });
// track({ name: 'persona.selected', realm: 'families', slug: 'retirees' });