/**
 * Asset Reminders Service with Attestation
 * Handles HNW asset reminder scheduling and processing
 */

import { supabase } from '@/integrations/supabase/client';
import { recordReceipt } from './receipts';
import { withAttestation } from './attestation';
import { inputs_hash } from '@/lib/canonical';
import { logLegacy } from '@/lib/telemetry';

export interface StormAlert {
  alert_id: string;
  storm_type: 'hurricane' | 'tornado' | 'wildfire' | 'flood' | 'earthquake';
  severity: 'watch' | 'warning' | 'emergency';
  affected_areas: string[];
  recommended_actions: string[];
  valid_until: string;
}

/**
 * Run asset reminders job with attestation
 */
export async function runReminders(): Promise<void> {
  await withAttestation('asset_reminders_job', async () => {
    const today = new Date().toISOString().split('T')[0];
    
    // Get pending reminders for today
    const { data: reminders, error } = await (supabase as any)
      .from('asset_reminders')
      .select('*, assets(*)')
      .eq('status', 'pending')
      .lte('reminder_date', today)
      .order('reminder_date');

    if (error) throw error;

    for (const reminder of reminders || []) {
      await processReminder(reminder);
    }

    // Schedule upcoming appraisal reminders
    await scheduleAppraisalReminders();
    
    // Check for marine lay-up season
    await checkMarineLayup();
    
    // Umbrella underlying policy checks
    await checkUmbrellaUnderlying();

  });
}

/**
 * Process individual reminder
 */
async function processReminder(reminder: any): Promise<void> {
  try {
    // Send notification (placeholder - would integrate with actual notification service)
    await sendReminderNotification(reminder);
    
    // Update reminder status
    await supabase
      .from('asset_reminders')
      .update({ 
        status: 'sent',
        sent_at: new Date().toISOString()
      })
      .eq('id', reminder.id);

    // Record reminder receipt
    await recordReceipt({
      type: 'ReminderSent-RDS',
      ts: new Date().toISOString(),
      policy_version: 'v1.0',
      reminder_id: reminder.id,
      asset_id: reminder.asset_id,
      reminder_type: reminder.reminder_type,
      notification_channels: reminder.notification_methods || ['email'],
      recipient_hash: await inputs_hash({ user_id: reminder.assets.user_id })
    });

  } catch (error) {
    console.error('Failed to process reminder:', reminder.id, error);
    
    // Record failure
    await recordReceipt({
      type: 'ReminderFailure-RDS',
      ts: new Date().toISOString(),
      policy_version: 'v1.0',
      reminder_id: reminder.id,
      asset_id: reminder.asset_id,
      failure_reason: 'notification_failed'
    });
  }
}

/**
 * Schedule appraisal reminders for assets
 */
async function scheduleAppraisalReminders(): Promise<void> {
  // Get assets with upcoming appraisal due dates
  const sixMonthsFromNow = new Date();
  sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
  
  const { data: assets, error } = await supabase
    .from('assets')
    .select('*')
    .eq('status', 'active')
    .lte('next_appraisal_due', sixMonthsFromNow.toISOString().split('T')[0])
    .not('next_appraisal_due', 'is', null);

  if (error) throw error;

  for (const asset of assets || []) {
    // Check if reminder already exists
    const { data: existingReminder } = await supabase
      .from('asset_reminders')
      .select('id')
      .eq('asset_id', asset.id)
      .eq('reminder_type', 'appraisal_due')
      .eq('status', 'pending')
      .single();

    if (!existingReminder) {
      // Calculate reminder date (3 months before due)
      const reminderDate = new Date(asset.next_appraisal_due);
      reminderDate.setMonth(reminderDate.getMonth() - 3);

      await supabase
        .from('asset_reminders')
        .insert({
          asset_id: asset.id,
          reminder_type: 'appraisal_due',
          reminder_date: reminderDate.toISOString().split('T')[0],
          title: `${asset.asset_name} Appraisal Due`,
          description: `Appraisal for ${asset.asset_name} is due on ${asset.next_appraisal_due}. Schedule renewal to maintain accurate coverage.`,
          notification_methods: ['email']
        });

      await recordReceipt({
        type: 'ReminderScheduled-RDS',
        ts: new Date().toISOString(),
        policy_version: 'v1.0',
        asset_id: asset.id,
        reminder_type: 'appraisal_due',
        scheduled_date: reminderDate.toISOString().split('T')[0],
        due_date: asset.next_appraisal_due
      });

      // Track legacy reminder scheduled event
      await logLegacy("legacy.reminder_scheduled", {
        household_id: asset.user_id,
        data: {
          asset_id: asset.id,
          reminder_type: 'appraisal_due',
          scheduled_date: reminderDate.toISOString().split('T')[0]
        }
      });
    }
  }
}

/**
 * Check for marine lay-up season
 */
async function checkMarineLayup(): Promise<void> {
  const currentMonth = new Date().getMonth() + 1; // 1-12
  
  // Northern climates: lay-up season typically October-April
  if (currentMonth === 9) { // September - prepare for lay-up
    const { data: marineAssets, error } = await supabase
      .from('assets')
      .select('*')
      .in('asset_type', ['marine_boat', 'marine_yacht'])
      .eq('status', 'active')
      .like('location_zip_first3', '0%'); // Northern states approximation

    if (error) throw error;

    for (const asset of marineAssets || []) {
      await scheduleMarineLayupReminder(asset, 'preparation');
    }
  } else if (currentMonth === 3) { // March - prepare for launch
    const { data: marineAssets, error } = await supabase
      .from('assets')
      .select('*')
      .in('asset_type', ['marine_boat', 'marine_yacht'])
      .eq('status', 'active')
      .like('location_zip_first3', '0%');

    if (error) throw error;

    for (const asset of marineAssets || []) {
      await scheduleMarineLayupReminder(asset, 'relaunch');
    }
  }
}

/**
 * Schedule marine lay-up reminder
 */
async function scheduleMarineLayupReminder(asset: any, phase: 'preparation' | 'relaunch'): Promise<void> {
  const title = phase === 'preparation' 
    ? `${asset.asset_name} Winter Lay-Up Preparation`
    : `${asset.asset_name} Spring Launch Preparation`;

  const description = phase === 'preparation'
    ? 'Prepare your vessel for winter storage. Update insurance for lay-up period and reduced coverage.'
    : 'Prepare your vessel for spring launch. Review insurance coverage and ensure full protection is active.';

  await supabase
    .from('asset_reminders')
    .insert({
      asset_id: asset.id,
      reminder_type: 'marine_layup',
      reminder_date: new Date().toISOString().split('T')[0],
      title,
      description,
      notification_methods: ['email']
    });

  await recordReceipt({
    type: 'MarineLayup-RDS',
    ts: new Date().toISOString(),
    policy_version: 'v1.0',
    asset_id: asset.id,
    layup_phase: phase,
    vessel_type: asset.asset_type
  });
}

/**
 * Check umbrella underlying policy requirements
 */
async function checkUmbrellaUnderlying(): Promise<void> {
  const { data: umbrellaAssets, error } = await supabase
    .from('assets')
    .select('*')
    .eq('asset_type', 'umbrella')
    .eq('status', 'active');

  if (error) throw error;

  for (const umbrella of umbrellaAssets || []) {
    // Get user's other assets to check underlying coverage
    const { data: userAssets } = await supabase
      .from('assets')
      .select('*')
      .eq('user_id', umbrella.user_id)
      .neq('asset_type', 'umbrella')
      .eq('status', 'active');

    // Analyze underlying coverage adequacy
    const analysis = analyzeUnderlyingCoverage(umbrella, userAssets || []);
    
    if (analysis.needs_review) {
      await supabase
        .from('asset_reminders')
        .insert({
          asset_id: umbrella.id,
          reminder_type: 'umbrella_check',
          reminder_date: new Date().toISOString().split('T')[0],
          title: 'Umbrella Policy Underlying Coverage Review',
          description: analysis.message,
          notification_methods: ['email']
        });

      await recordReceipt({
        type: 'UmbrellaCheck-RDS',
        ts: new Date().toISOString(),
        policy_version: 'v1.0',
        umbrella_asset_id: umbrella.id,
        underlying_assets_count: userAssets?.length || 0,
        review_reason: analysis.reason
      });
    }
  }
}

/**
 * Storm watch alerts (requires weather API key)
 */
export async function stormWatch(): Promise<StormAlert[]> {
  // Check if weather API key is available
  const weatherApiKey = process.env.WEATHER_API_KEY;
  if (!weatherApiKey) {
    console.log('Weather API key not configured - skipping storm watch');
    return [];
  }

  try {
    // Get user assets with locations
    const { data: assets, error } = await supabase
      .from('assets')
      .select('*')
      .eq('status', 'active')
      .not('location_zip_first3', 'is', null);

    if (error) throw error;

    const alerts: StormAlert[] = [];
    const locationGroups = groupAssetsByLocation(assets || []);

    for (const [location, locationAssets] of Object.entries(locationGroups)) {
      const stormAlerts = await checkWeatherAlerts(location);
      
      for (const alert of stormAlerts) {
        alerts.push(alert);
        
        // Create reminders for affected assets
        for (const asset of locationAssets) {
          await createStormReminder(asset, alert);
        }
      }
    }

    return alerts;

  } catch (error) {
    console.error('Storm watch failed:', error);
    return [];
  }
}

/**
 * Send reminder notification (placeholder)
 */
async function sendReminderNotification(reminder: any): Promise<void> {
  // In real implementation, would integrate with email/SMS services
  console.log(`Sending reminder: ${reminder.title} for asset ${reminder.asset_id}`);
  
  // Simulate notification sending
  await new Promise(resolve => setTimeout(resolve, 100));
}

/**
 * Analyze underlying coverage for umbrella policy
 */
function analyzeUnderlyingCoverage(umbrella: any, userAssets: any[]): {
  needs_review: boolean;
  reason: string;
  message: string;
} {
  const homeAssets = userAssets.filter(a => a.asset_type.includes('home'));
  const autoAssets = userAssets.filter(a => a.asset_type.includes('auto'));
  
  // Check for minimum underlying requirements
  if (homeAssets.length === 0) {
    return {
      needs_review: true,
      reason: 'missing_home_underlying',
      message: 'Umbrella policy requires homeowners underlying coverage. Please verify adequate underlying limits.'
    };
  }

  if (autoAssets.length === 0) {
    return {
      needs_review: true,
      reason: 'missing_auto_underlying',
      message: 'Umbrella policy requires auto underlying coverage. Please verify adequate underlying limits.'
    };
  }

  return {
    needs_review: false,
    reason: 'adequate_underlying',
    message: 'Underlying coverage appears adequate.'
  };
}

/**
 * Group assets by location for weather monitoring
 */
function groupAssetsByLocation(assets: any[]): Record<string, any[]> {
  return assets.reduce((groups, asset) => {
    const location = asset.location_zip_first3 || 'unknown';
    if (!groups[location]) groups[location] = [];
    groups[location].push(asset);
    return groups;
  }, {});
}

/**
 * Check weather alerts for location (placeholder)
 */
async function checkWeatherAlerts(location: string): Promise<StormAlert[]> {
  // In real implementation, would call weather API
  // Return empty array for now
  return [];
}

/**
 * Create storm reminder for asset
 */
async function createStormReminder(asset: any, alert: StormAlert): Promise<void> {
  await supabase
    .from('asset_reminders')
    .insert({
      asset_id: asset.id,
      reminder_type: 'storm_alert',
      reminder_date: new Date().toISOString().split('T')[0],
      title: `${alert.storm_type.toUpperCase()} ${alert.severity.toUpperCase()}: ${asset.asset_name}`,
      description: `${alert.storm_type} ${alert.severity} affecting your area. Take protective measures for ${asset.asset_name}.`,
      notification_methods: ['email', 'sms']
    });

  await recordReceipt({
    type: 'StormAlert-RDS',
    ts: new Date().toISOString(),
    policy_version: 'v1.0',
    asset_id: asset.id,
    storm_type: alert.storm_type,
    severity: alert.severity,
    alert_id: alert.alert_id
  });
}

/**
 * Get reminders dashboard for user
 */
export async function getRemindersdashboard(): Promise<{
  pending_reminders: any[];
  upcoming_count: number;
  overdue_count: number;
  by_type: Record<string, number>;
}> {
  const today = new Date().toISOString().split('T')[0];
  
  const { data: allReminders, error } = await supabase
    .from('asset_reminders')
    .select('*, assets(*)')
    .in('status', ['pending', 'sent'])
    .order('reminder_date');

  if (error) throw error;

  const pending = allReminders?.filter(r => r.status === 'pending') || [];
  const upcoming = pending.filter(r => r.reminder_date > today);
  const overdue = pending.filter(r => r.reminder_date <= today);

  const byType = pending.reduce((acc, reminder) => {
    acc[reminder.reminder_type] = (acc[reminder.reminder_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    pending_reminders: pending.slice(0, 10), // Latest 10
    upcoming_count: upcoming.length,
    overdue_count: overdue.length,
    by_type: byType
  };
}