// Typed analytics events for type safety and consistency

export enum AppEvent {
  // Page navigation
  PageView = 'page_view',
  
  // Family dashboard events
  FamilyTabView = 'family.tab.view',
  FamilyQuickActionClick = 'family.quickAction.click',
  
  // Advisor dashboard events
  AdvisorTabView = 'advisor.tab.view',
  AdvisorQuickActionClick = 'advisor.quickAction.click',
  
  // Demo events
  DemoOpen = 'demo.open',
  DemoComplete = 'demo.complete',
  DemoClick = 'demo.click',
  
  // Export events
  ExportClick = 'export.click',
  ExportComplete = 'export.complete',
  
  // Tools events
  ToolOpen = 'tool.open',
  ToolComplete = 'tool.complete',
  
  // Proof/receipts events
  ProofCreated = 'proof.created',
  ReceiptGenerated = 'receipt.generated',
  
  // Onboarding events
  OnboardingStart = 'onboarding.start',
  OnboardingComplete = 'onboarding.complete',
  OnboardingStep = 'onboarding.step',
  
  // Invite events
  InviteViewed = 'invite.viewed',
  InviteSent = 'invite.sent',
  
  // Meeting events
  MeetingImported = 'meeting.imported',
  MeetingViewed = 'meeting.viewed',
}

export type EventProps = Record<string, unknown>;

// Type-safe event tracking function
import analytics from '@/lib/analytics';

export function trackTyped(event: AppEvent, props?: EventProps) {
  analytics.track(event, props);
}

// Common event helpers
export const trackPageView = (page: string, props?: EventProps) => 
  trackTyped(AppEvent.PageView, { page, ...props });

export const trackDemoClick = (demoId: string, props?: EventProps) =>
  trackTyped(AppEvent.DemoClick, { demoId, ...props });

export const trackExportClick = (format: string, props?: EventProps) =>
  trackTyped(AppEvent.ExportClick, { format, ...props });

export const trackToolOpen = (toolId: string, persona?: string, props?: EventProps) =>
  trackTyped(AppEvent.ToolOpen, { toolId, persona, ...props });