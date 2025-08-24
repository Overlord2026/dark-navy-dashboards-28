/**
 * Enhanced analytics for advisor and NIL experiences
 */

// Extend existing family analytics to support advisor and NIL
export const advisorAnalytics = {
  quickActionClick: (label: string, route: string, toolKey: string) => {
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.track('advisor.quickAction.click', {
        label,
        route,
        toolKey,
        timestamp: Date.now(),
        source: 'advisor-home'
      });
    }
    console.log('📊 Advisor Analytics:', { 
      event: 'advisor.quickAction.click', 
      label, 
      route, 
      toolKey 
    });
  },

  toolInstall: (toolKey: string, withSeed: boolean = false) => {
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.track('tool.install', {
        toolKey,
        withSeed,
        persona: 'advisor',
        timestamp: Date.now(),
        source: 'advisor-home'
      });
    }
    console.log('📊 Tool Install:', { toolKey, withSeed, persona: 'advisor' });
  },

  toolPreview: (toolKey: string) => {
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.track('tool.preview', {
        toolKey,
        persona: 'advisor',
        timestamp: Date.now(),
        source: 'advisor-home'
      });
    }
    console.log('📊 Tool Preview:', { toolKey, persona: 'advisor' });
  },

  proofCreated: (type: string, clientName?: string, details?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.track('proof.created', {
        type,
        clientName,
        persona: 'advisor',
        timestamp: Date.now(),
        ...details
      });
    }
    console.log('📊 Proof Created:', { type, clientName, persona: 'advisor' });
  }
};

export const nilAnalytics = {
  quickActionClick: (label: string, route: string, toolKey: string) => {
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.track('nil.quickAction.click', {
        label,
        route,
        toolKey,
        persona: 'athlete',
        timestamp: Date.now(),
        source: 'nil-athlete-home'
      });
    }
    console.log('📊 NIL Analytics:', { 
      event: 'nil.quickAction.click', 
      label, 
      route, 
      toolKey,
      persona: 'athlete'
    });
  },

  toolInstall: (toolKey: string, withSeed: boolean = false) => {
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.track('tool.install', {
        toolKey,
        withSeed,
        persona: 'nil-athlete',
        timestamp: Date.now(),
        source: 'nil-athlete-home'
      });
    }
    console.log('📊 Tool Install:', { toolKey, withSeed, persona: 'nil-athlete' });
  },

  toolPreview: (toolKey: string) => {
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.track('tool.preview', {
        toolKey,
        persona: 'nil-athlete',
        timestamp: Date.now(),
        source: 'nil-athlete-home'
      });
    }
    console.log('📊 Tool Preview:', { toolKey, persona: 'nil-athlete' });
  },

  proofCreated: (type: string, details?: string, metadata?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.track('proof.created', {
        type,
        details,
        persona: 'nil-athlete',
        timestamp: Date.now(),
        ...metadata
      });
    }
    console.log('📊 Proof Created:', { type, details, persona: 'nil-athlete' });
  },

  trainingCompleted: (moduleName: string, score?: number) => {
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.track('nil.training.completed', {
        moduleName,
        score,
        timestamp: Date.now()
      });
    }
    console.log('📊 Training Completed:', { moduleName, score });
  },

  offerCreated: (offerType: string, value?: number) => {
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.track('nil.offer.created', {
        offerType,
        value,
        timestamp: Date.now()
      });
    }
    console.log('📊 Offer Created:', { offerType, value });
  },

  paymentReceived: (amount: number, source: string) => {
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.track('nil.payment.received', {
        amount,
        source,
        timestamp: Date.now()
      });
    }
    console.log('📊 Payment Received:', { amount, source });
  }
};