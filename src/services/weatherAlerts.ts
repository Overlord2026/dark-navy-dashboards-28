import { supabase } from '@/integrations/supabase/client';
import { recordReceipt } from '@/services/receipts';

export interface WeatherAlert {
  id: string;
  alert_type: 'storm' | 'hurricane' | 'tornado' | 'flood' | 'hail' | 'wind';
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  location: {
    state: string;
    county?: string;
    city?: string;
    zip_code?: string;
  };
  title: string;
  description: string;
  start_time: string;
  end_time?: string;
  insurance_impact: {
    auto_risk: 'low' | 'medium' | 'high';
    home_risk: 'low' | 'medium' | 'high';
    claims_expected: boolean;
    coverage_reminder?: string;
  };
  created_at: string;
}

export async function fetchWeatherAlerts(
  locations: Array<{ state: string; zip_code?: string }>,
  provider: 'openweather' | 'tomorrow' | 'accuweather' = 'openweather'
): Promise<WeatherAlert[]> {
  try {
    const response = await fetch('https://xcmqjkvyvuhoslbzmlgi.functions.supabase.co/functions/v1/weather-alerts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        locations,
        provider
      })
    });

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.statusText}`);
    }

    const alerts = await response.json();
    
    // Record weather check receipt
    await recordReceipt({
      type: 'WeatherCheck-RDS',
      ts: new Date().toISOString(),
      inputs_hash: await hashInputs({ locations, provider }),
      policy_version: 'v1.0',
      outcome: 'alerts_retrieved',
      reasons: [`${alerts.length}_alerts_found`],
      metadata: {
        locations_checked: locations.length,
        alerts_count: alerts.length,
        provider
      }
    });

    return alerts;
  } catch (error) {
    console.error('Failed to fetch weather alerts:', error);
    return [];
  }
}

export async function processStormAlert(alert: WeatherAlert): Promise<void> {
  // Store alert in database
  const { error } = await (supabase as any)
    .from('weather_alerts')
    .insert({
      alert_type: alert.alert_type,
      severity: alert.severity,
      location: alert.location,
      title: alert.title,
      description: alert.description,
      start_time: alert.start_time,
      end_time: alert.end_time,
      insurance_impact: alert.insurance_impact
    });

  if (error) {
    console.error('Failed to store weather alert:', error);
    return;
  }

  // Record storm alert receipt
  await recordReceipt({
    type: 'StormAlert-RDS',
    ts: new Date().toISOString(),
    inputs_hash: await hashInputs({
      alert_type: alert.alert_type,
      severity: alert.severity,
      location_hash: await hashInputs(alert.location)
    }),
    policy_version: 'v1.0',
    outcome: 'alert_processed',
    reasons: [`${alert.severity}_${alert.alert_type}`, 'insurance_impact_assessed'],
    metadata: {
      alert_id: alert.id,
      severity: alert.severity,
      auto_risk: alert.insurance_impact.auto_risk,
      home_risk: alert.insurance_impact.home_risk,
      claims_expected: alert.insurance_impact.claims_expected
    }
  });
}

export async function getActiveAlerts(userLocation: { state: string; zip_code?: string }): Promise<WeatherAlert[]> {
  const { data, error } = await (supabase as any)
    .from('weather_alerts')
    .select('*')
    .eq('location->>state', userLocation.state)
    .gte('end_time', new Date().toISOString())
    .order('severity', { ascending: false })
    .order('start_time', { ascending: false });

  if (error) {
    console.error('Failed to get active alerts:', error);
    return [];
  }

  return (data || []) as WeatherAlert[];
}

export async function sendStormNotifications(alert: WeatherAlert, clientIds: string[]): Promise<void> {
  // Send notifications through communication service
  for (const clientId of clientIds) {
    try {
      await fetch('https://xcmqjkvyvuhoslbzmlgi.functions.supabase.co/functions/v1/storm-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: clientId,
          alert,
          communication_preferences: {
            email: true,
            sms: false // Based on user preferences
          }
        })
      });

      // Record communication receipt
      await recordReceipt({
        type: 'StormCommunication-RDS',
        ts: new Date().toISOString(),
        inputs_hash: await hashInputs({
          client_id: clientId,
          alert_id: alert.id,
          communication_method: 'email'
        }),
        policy_version: 'v1.0',
        outcome: 'notification_sent',
        reasons: ['storm_alert_notification', `severity_${alert.severity}`],
        metadata: {
          client_id: clientId,
          alert_type: alert.alert_type,
          severity: alert.severity,
          communication_method: 'email'
        }
      });
    } catch (error) {
      console.error(`Failed to send storm notification to ${clientId}:`, error);
    }
  }
}

async function hashInputs(inputs: any): Promise<string> {
  const inputString = JSON.stringify(inputs, Object.keys(inputs).sort());
  const encoder = new TextEncoder();
  const data = encoder.encode(inputString);
  const crypto = window.crypto || (globalThis as any).crypto;
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}