// Legacy Planning analytics events
import { track } from './track';

export interface LegacyEventProps extends Record<string, string | number | boolean | null | undefined> {
  plan_key?: string;
  advisor_firm_id?: string;
  household_id?: string;
  export_hash?: string;
  executor_id?: string;
  reminder_type?: string;
  item_type?: string;
  change_type?: string;
  source?: string;
}

// Legacy flow events
export const trackLegacyFlowStarted = (props: LegacyEventProps) => 
  track('legacy.flow_started', props);

export const trackLegacyChecklistCompleted = (props: LegacyEventProps & { items_count?: number }) => 
  track('legacy.checklist_completed', props);

export const trackLegacyExportCreated = (props: LegacyEventProps & { recipient_count?: number }) => 
  track('legacy.export_created', props);

export const trackLegacyShareGrantCreated = (props: LegacyEventProps & { permissions?: string }) => 
  track('legacy.share_grant_created', props);

export const trackLegacyReminderScheduled = (props: LegacyEventProps & { days_out?: number }) => 
  track('legacy.reminder_scheduled', props);

export const trackLegacyItemUpdated = (props: LegacyEventProps) => 
  track('legacy.item_updated', props);

// Pricing page events
export const trackLegacyBetaInterest = (feature: string, plan_key: string) =>
  track('legacy.beta_interest', { feature, plan_key });

export const trackLegacyUpgradeIntent = (from_plan: string, to_plan: string) =>
  track('pricing.legacy_upgrade_intent', { from_plan, to_plan });

// In-app nudge events  
export const trackLegacyNudgeShown = (nudge_type: string, context: string) =>
  track('legacy.nudge_shown', { nudge_type, context });

export const trackLegacyNudgeClicked = (nudge_type: string, action: string) =>
  track('legacy.nudge_clicked', { nudge_type, action });