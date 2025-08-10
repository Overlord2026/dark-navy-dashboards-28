import { supabase } from '@/integrations/supabase/client';
import { track } from './track';

interface TrackFounding20Params {
  event_name: string;
  contact_id?: string;
  segment?: 'sports' | 'longevity' | 'ria';
  org_name?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  payload?: Record<string, any>;
}

export const trackFounding20Event = async (params: TrackFounding20Params) => {
  try {
    // Track locally
    track(params.event_name, {
      segment: params.segment,
      org_name: params.org_name,
      utm_source: params.utm_source,
      utm_medium: params.utm_medium,
      utm_campaign: params.utm_campaign,
      utm_content: params.utm_content,
      ...params.payload
    });

    // Track to edge function for advanced processing
    const response = await supabase.functions.invoke('track-founding20', {
      body: params
    });

    if (response.error) {
      console.error('Error tracking Founding 20 event:', response.error);
    }

    return response;
  } catch (error) {
    console.error('Failed to track Founding 20 event:', error);
  }
};

// Utility functions for common tracking events
export const trackInviteViewed = (orgName: string, utmParams: Record<string, string>) => {
  return trackFounding20Event({
    event_name: 'invite_viewed',
    segment: 'sports',
    org_name: orgName,
    ...utmParams
  });
};

export const trackCallBooked = (orgName: string, eventId?: string) => {
  return trackFounding20Event({
    event_name: 'call_booked',
    segment: 'sports',
    org_name: orgName,
    payload: { calendly_event_id: eventId }
  });
};

export const trackPDFDownloaded = (orgName: string, type: 'print' | 'digital') => {
  return trackFounding20Event({
    event_name: 'pdf_downloaded',
    segment: 'sports',
    org_name: orgName,
    payload: { pdf_type: type }
  });
};

export const trackVideoPlayed = (orgName: string, duration?: number) => {
  return trackFounding20Event({
    event_name: 'video_played',
    segment: 'sports',
    org_name: orgName,
    payload: { duration }
  });
};

export const trackPartnershipSigned = (orgName: string, tier: 'gold' | 'silver' | 'bronze') => {
  return trackFounding20Event({
    event_name: 'partnership_signed',
    segment: 'sports',
    org_name: orgName,
    payload: { tier }
  });
};